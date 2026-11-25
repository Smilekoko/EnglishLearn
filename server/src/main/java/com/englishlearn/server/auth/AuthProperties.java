package com.englishlearn.server.auth;

import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * 鉴权相关配置。管理员不落库，由配置项 app.auth.admin-mids（或环境变量 ADMIN_MIDS）决定，
 * 这样改管理员不用动数据库。
 */
@Component
public class AuthProperties {

    private static final Logger log = LoggerFactory.getLogger(AuthProperties.class);

    private final Set<String> adminMids;
    private final int sessionDays;
    private final boolean cookieSecure;

    public AuthProperties(
            @Value("${app.auth.admin-mids:}") String adminMids,
            @Value("${app.auth.session-days:30}") int sessionDays,
            @Value("${app.auth.cookie-secure:false}") boolean cookieSecure) {
        this.adminMids = Arrays.stream(adminMids.split(","))
                .map(String::trim)
                .filter(value -> !value.isEmpty())
                .collect(Collectors.toUnmodifiableSet());
        this.sessionDays = sessionDays;
        this.cookieSecure = cookieSecure;
        // 启动时把结果打出来，省得排查「到底读到没有」
        if (this.adminMids.isEmpty()) {
            log.warn("管理员白名单为空：后台将无人可进（配置项 app.auth.admin-mids / 环境变量 ADMIN_MIDS）");
        } else {
            log.info("管理员白名单已加载 {} 个：{}", this.adminMids.size(), this.adminMids);
        }
    }

    public Set<String> getAdminMids() {
        return adminMids;
    }

    public int getSessionDays() {
        return sessionDays;
    }

    public boolean isCookieSecure() {
        return cookieSecure;
    }
}
