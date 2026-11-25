package com.englishlearn.server.auth;

import java.util.List;

/** 鉴权与用户管理对外的 JSON 结构。 */
public record AuthDtos() {

    public record UserView(Long id, String nickname, String avatar, String role, String status, String mid) {
    }

    public record PollResponse(String status, UserView user, String message) {
    }

    public record RenameRequest(String nickname) {
    }

    public record StatusRequest(String status) {
    }

    public record AdminUserRow(
            Long id,
            String nickname,
            String avatar,
            String role,
            String status,
            String provider,
            String subject,
            String createdAt,
            String lastLoginAt) {
    }

    public record AdminUserPage(List<AdminUserRow> items, long total, int page, int size) {
    }

    public static UserView view(AppUser user, String role, String mid) {
        return new UserView(user.getId(), user.getNickname(), user.getAvatar(), role, user.getStatus(), mid);
    }
}
