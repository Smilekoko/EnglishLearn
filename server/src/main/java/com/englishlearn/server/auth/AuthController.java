package com.englishlearn.server.auth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.time.Duration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService auth;
    private final AuthProperties props;

    public AuthController(AuthService auth, AuthProperties props) {
        this.auth = auth;
        this.props = props;
    }

    /** 生成 B 站扫码登录二维码（SVG 直接内嵌到页面） */
    @PostMapping("/bili/qr")
    public AuthService.QrView qr() {
        return auth.startBiliQr();
    }

    /** 轮询扫码状态；成功时下发会话 cookie 并返回用户 */
    @GetMapping("/bili/qr/{key}")
    public AuthDtos.PollResponse poll(@PathVariable String key, HttpServletResponse response) {
        AuthService.PollResult result = auth.pollBiliQr(key);
        if (result.user() != null && result.token() != null) {
            response.addHeader(HttpHeaders.SET_COOKIE, sessionCookie(result.token()).toString());
            AppUser user = result.user();
            return new AuthDtos.PollResponse(
                    "ok",
                    AuthDtos.view(user, auth.roleOf(user), auth.subjectOf(user)),
                    "");
        }
        return new AuthDtos.PollResponse(result.status(), null, result.message());
    }

    @GetMapping("/me")
    public AuthDtos.UserView me(
            @RequestAttribute(name = AuthFilter.ATTR_USER, required = false) AppUser user) {
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "未登录");
        }
        return AuthDtos.view(user, auth.roleOf(user), auth.subjectOf(user));
    }

    @PatchMapping("/me")
    public AuthDtos.UserView rename(
            @RequestAttribute(name = AuthFilter.ATTR_USER, required = false) AppUser user,
            @RequestBody AuthDtos.RenameRequest request) {
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "未登录");
        }
        AppUser updated = auth.rename(user, request.nickname());
        return AuthDtos.view(updated, auth.roleOf(updated), auth.subjectOf(updated));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @CookieValue(value = AuthFilter.COOKIE, required = false) String token,
            HttpServletRequest request,
            HttpServletResponse response) {
        auth.logout(token != null ? token : AuthFilter.readCookie(request));
        response.addHeader(HttpHeaders.SET_COOKIE, clearCookie().toString());
        return ResponseEntity.noContent().build();
    }

    private ResponseCookie sessionCookie(String token) {
        return ResponseCookie.from(AuthFilter.COOKIE, token)
                .httpOnly(true)
                .secure(props.isCookieSecure())
                .path("/")
                .sameSite("Lax")
                .maxAge(Duration.ofDays(props.getSessionDays()))
                .build();
    }

    private ResponseCookie clearCookie() {
        return ResponseCookie.from(AuthFilter.COOKIE, "")
                .httpOnly(true)
                .secure(props.isCookieSecure())
                .path("/")
                .sameSite("Lax")
                .maxAge(0)
                .build();
    }
}
