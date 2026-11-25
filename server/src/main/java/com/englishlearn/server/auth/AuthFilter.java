package com.englishlearn.server.auth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/** 读取会话 cookie，把当前用户挂到 request 上；不拦截请求，鉴权交给各接口判断。 */
@Component
public class AuthFilter extends OncePerRequestFilter {

    public static final String ATTR_USER = "currentUser";
    public static final String COOKIE = "EL_SESSION";

    private final AuthService auth;

    public AuthFilter(AuthService auth) {
        this.auth = auth;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request, HttpServletResponse response, jakarta.servlet.FilterChain chain)
            throws jakarta.servlet.ServletException, IOException {
        String token = readCookie(request);
        auth.userForToken(token).ifPresent(user -> request.setAttribute(ATTR_USER, user));
        chain.doFilter(request, response);
    }

    public static String readCookie(HttpServletRequest request) {
        jakarta.servlet.http.Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return null;
        }
        for (jakarta.servlet.http.Cookie cookie : cookies) {
            if (COOKIE.equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }
}
