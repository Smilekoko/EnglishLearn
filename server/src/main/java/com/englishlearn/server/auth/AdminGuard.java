package com.englishlearn.server.auth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.nio.charset.StandardCharsets;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

/** 保护 /api/admin/**：必须登录且是管理员（B 站 mid 在 ADMIN_MIDS 白名单里）。 */
@Component
public class AdminGuard implements HandlerInterceptor {

    private final AuthService auth;

    public AdminGuard(AuthService auth) {
        this.auth = auth;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }
        Object current = request.getAttribute(AuthFilter.ATTR_USER);
        if (!(current instanceof AppUser user)) {
            write(response, HttpStatus.UNAUTHORIZED, "请先登录");
            return false;
        }
        if (!auth.isAdmin(user)) {
            write(response, HttpStatus.FORBIDDEN, "需要管理员权限");
            return false;
        }
        return true;
    }

    private void write(HttpServletResponse response, HttpStatus status, String message) throws Exception {
        response.setStatus(status.value());
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write("{\"message\":\"" + message + "\"}");
    }
}
