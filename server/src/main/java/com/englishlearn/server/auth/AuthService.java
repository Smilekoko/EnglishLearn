package com.englishlearn.server.auth;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;
import java.util.List;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.web.server.ResponseStatusException;

/** 登录、会话与用户资料。所有第三方登录方式最终都落到 app_users + user_identities。 */
@Service
public class AuthService {

    public static final String PROVIDER_BILI = "bilibili";

    private final AppUserRepository users;
    private final UserIdentityRepository identities;
    private final AuthSessionRepository sessions;
    private final AuthProperties props;
    private final BiliClient bili;
    private final TransactionTemplate transactionTemplate;
    private final SecureRandom random = new SecureRandom();

    public AuthService(
            AppUserRepository users,
            UserIdentityRepository identities,
            AuthSessionRepository sessions,
            AuthProperties props,
            BiliClient bili,
            PlatformTransactionManager transactionManager) {
        this.users = users;
        this.identities = identities;
        this.sessions = sessions;
        this.props = props;
        this.bili = bili;
        this.transactionTemplate = new TransactionTemplate(transactionManager);
    }

    public record QrView(String key, String svg, int expiresIn) {
    }

    public record LoginResult(AppUser user, String token) {
    }

    public QrView startBiliQr() {
        BiliClient.Start start = bili.generate();
        return new QrView(start.key(), QrSvg.render(start.url()), 180);
    }

    /**
     * status: pending / scanned / ok / expired / failed；ok 时附带用户与新会话 token。
     *
     * <p>网络请求（poll / crossDomain / nav）不放在事务里，避免轮询期间长时间占着数据库连接；
     * 只有拿到资料后的写库操作走一个短事务。
     */
    public PollResult pollBiliQr(String key) {
        BiliClient.State state = bili.poll(key);
        return switch (state.code()) {
            case 86101 -> new PollResult("pending", null, null, "");
            case 86090 -> new PollResult("scanned", null, null, "");
            case 0 -> {
                // 关键一步：请求 crossDomain 链接，B 站才会把 SESSDATA 写进 cookie jar
                bili.follow(key, state.followUrl());
                BiliClient.Profile profile = bili.nav(key);
                if (profile == null) {
                    // cookie 写入可能比响应慢一拍，稍等再读一次
                    try {
                        Thread.sleep(300L);
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                    }
                    profile = bili.nav(key);
                }
                bili.forget(key);
                if (profile == null) {
                    yield new PollResult("failed", null, null, "扫码成功但获取账号信息失败，请刷新二维码重试");
                }
                BiliClient.Profile resolved = profile;
                LoginResult login = transactionTemplate.execute(status -> {
                    AppUser user = upsertBiliUser(resolved);
                    return new LoginResult(user, createSession(user));
                });
                if (login == null) {
                    yield new PollResult("failed", null, null, "登录信息保存失败，请重试");
                }
                yield new PollResult("ok", login.user(), login.token(), "");
            }
            default -> {
                bili.forget(key);
                String message = state.message() == null || state.message().isBlank()
                        ? "二维码已过期，请刷新"
                        : state.message();
                yield new PollResult("expired", null, null, message);
            }
        };
    }

    public record PollResult(String status, AppUser user, String token, String message) {
    }

    private AppUser upsertBiliUser(BiliClient.Profile profile) {
        String mid = profile.mid() == null ? "" : profile.mid().trim();
        if (mid.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "没有拿到 B 站账号信息");
        }
        String nickname = profile.name() == null || profile.name().isBlank() ? "B站用户" + mid : profile.name();
        String avatar = profile.avatar() == null ? "" : profile.avatar();

        UserIdentity identity = identities.findByProviderAndSubject(PROVIDER_BILI, mid).orElse(null);
        AppUser user;
        if (identity == null) {
            user = users.save(new AppUser(nickname, avatar));
            identities.save(new UserIdentity(user, PROVIDER_BILI, mid, nickname, avatar));
        } else {
            identity.updateProfile(nickname, avatar);
            identities.save(identity);
            user = identity.getUser();
            // 昵称允许用户在站内改过，登录时不覆盖；头像跟随 B 站
            user.updateProfile(user.getNickname(), avatar);
        }

        if ("BANNED".equals(user.getStatus())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "账号已被封禁");
        }
        user.touchLogin();
        return users.save(user);
    }

    @Transactional
    public String createSession(AppUser user) {
        byte[] raw = new byte[32];
        random.nextBytes(raw);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(raw);
        Instant expiresAt = Instant.now().plus(Duration.ofDays(props.getSessionDays()));
        sessions.save(new AuthSession(sha256(token), user.getId(), expiresAt));
        sessions.deleteByExpiresAtBefore(Instant.now());
        return token;
    }

    public Optional<AppUser> userForToken(String token) {
        if (token == null || token.isBlank()) {
            return Optional.empty();
        }
        return sessions.findByTokenHash(sha256(token))
                .filter(session -> session.getExpiresAt().isAfter(Instant.now()))
                .flatMap(session -> users.findById(session.getUserId()))
                // 封禁后已登录的会话立即失效
                .filter(user -> !"BANNED".equals(user.getStatus()));
    }

    @Transactional
    public void logout(String token) {
        if (token != null && !token.isBlank()) {
            sessions.deleteByTokenHash(sha256(token));
        }
    }

    /** 管理员由环境变量 ADMIN_MIDS 里的 B 站 mid 决定，不落库 */
    public boolean isAdmin(AppUser user) {
        return identities.findByUserIdAndProvider(user.getId(), PROVIDER_BILI)
                .map(identity -> props.getAdminMids().contains(identity.getSubject()))
                .orElse(false);
    }

    public String roleOf(AppUser user) {
        return isAdmin(user) ? "ADMIN" : "USER";
    }

    public String providerOf(AppUser user) {
        return identities.findByUserIdAndProvider(user.getId(), PROVIDER_BILI)
                .map(UserIdentity::getProvider)
                .orElse("");
    }

    /** B 站 mid，登录页会显示出来，方便站长把自己加进 ADMIN_MIDS */
    public String subjectOf(AppUser user) {
        return identities.findByUserIdAndProvider(user.getId(), PROVIDER_BILI)
                .map(UserIdentity::getSubject)
                .orElse("");
    }

    public List<UserIdentity> identitiesOf(AppUser user) {
        return identities.findByUserId(user.getId());
    }

    public AppUser rename(AppUser user, String nickname) {
        String next = nickname == null ? "" : nickname.trim();
        if (next.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "昵称不能为空");
        }
        if (next.length() > 20) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "昵称最多 20 个字");
        }
        user.updateProfile(next, user.getAvatar());
        return users.save(user);
    }

    public AppUser requireUser(Long id) {
        return users.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "用户不存在"));
    }

    public AppUser setStatus(AppUser user, String status) {
        String next = "BANNED".equals(status) ? "BANNED" : "ACTIVE";
        user.setStatus(next);
        return users.save(user);
    }

    public long countUsers() {
        return users.count();
    }

    private static String sha256(String value) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(digest.digest(value.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("缺少 SHA-256", e);
        }
    }
}
