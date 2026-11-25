package com.englishlearn.server.auth;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminUserController {

    private static final DateTimeFormatter FMT = DateTimeFormatter.ISO_INSTANT;

    private final AppUserRepository users;
    private final UserIdentityRepository identities;
    private final AuthService auth;

    public AdminUserController(
            AppUserRepository users, UserIdentityRepository identities, AuthService auth) {
        this.users = users;
        this.identities = identities;
        this.auth = auth;
    }

    /** 用户列表：支持按昵称搜索、分页 */
    @GetMapping("/users")
    @Transactional(readOnly = true)
    public AuthDtos.AdminUserPage list(
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size) {
        int pageIndex = Math.max(page - 1, 0);
        int pageSize = Math.min(Math.max(size, 1), 100);
        Pageable pageable = PageRequest.of(pageIndex, pageSize, Sort.by(Sort.Direction.DESC, "id"));

        Page<AppUser> result = (q == null || q.isBlank())
                ? users.findAll(pageable)
                : users.findByNicknameContainingIgnoreCase(q.trim(), pageable);

        List<Long> ids = result.getContent().stream().map(AppUser::getId).toList();
        Map<Long, UserIdentity> identityByUser = ids.isEmpty()
                ? Map.of()
                : identities.findByUserIdIn(ids).stream()
                        .collect(Collectors.toMap(
                                identity -> identity.getUser().getId(),
                                Function.identity(),
                                (first, second) -> first));

        List<AuthDtos.AdminUserRow> items = result.getContent().stream()
                .map(user -> toRow(user, identityByUser.get(user.getId())))
                .toList();

        return new AuthDtos.AdminUserPage(items, result.getTotalElements(), pageIndex + 1, pageSize);
    }

    /** 封禁 / 解封 */
    @PatchMapping("/users/{id}")
    @Transactional
    public AuthDtos.AdminUserRow update(
            @PathVariable Long id, @RequestBody AuthDtos.StatusRequest request) {
        AppUser user = auth.requireUser(id);
        AppUser updated = auth.setStatus(user, request.status());
        UserIdentity identity = identities.findByUserIdAndProvider(updated.getId(), AuthService.PROVIDER_BILI)
                .orElse(null);
        return toRow(updated, identity);
    }

    private AuthDtos.AdminUserRow toRow(AppUser user, UserIdentity identity) {
        boolean admin = identity != null && auth.isAdmin(user);
        return new AuthDtos.AdminUserRow(
                user.getId(),
                user.getNickname(),
                user.getAvatar(),
                admin ? "ADMIN" : "USER",
                user.getStatus(),
                identity == null ? "" : identity.getProvider(),
                identity == null ? "" : identity.getSubject(),
                user.getCreatedAt() == null ? "" : FMT.format(user.getCreatedAt()),
                user.getLastLoginAt() == null ? "" : FMT.format(user.getLastLoginAt()));
    }
}
