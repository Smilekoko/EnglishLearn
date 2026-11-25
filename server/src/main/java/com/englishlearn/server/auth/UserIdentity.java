package com.englishlearn.server.auth;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.Instant;

/**
 * 第三方登录身份。provider 目前只有 bilibili，后续加 github / wechat / password
 * 只需新增记录，不用改 app_users。
 */
@Entity
@Table(
        name = "user_identities",
        uniqueConstraints = @UniqueConstraint(columnNames = {"provider", "subject"}))
public class UserIdentity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 登录身份与用户的关联一律 EAGER：调用方几乎总要在同一请求里读用户资料，
     * LAZY 代理一旦离开事务就会抛 LazyInitializationException。
     */
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;

    /** bilibili / github / wechat / password */
    @Column(nullable = false, length = 32)
    private String provider;

    /** 该提供方里的唯一标识：B 站是 mid，GitHub 是 id，密码登录是用户名 */
    @Column(nullable = false, length = 64)
    private String subject;

    @Column(length = 64)
    private String nickname;

    @Column(length = 512)
    private String avatar;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at")
    private Instant updatedAt;

    protected UserIdentity() {
        // JPA
    }

    public UserIdentity(AppUser user, String provider, String subject, String nickname, String avatar) {
        this.user = user;
        this.provider = provider;
        this.subject = subject;
        this.nickname = nickname;
        this.avatar = avatar;
    }

    public void updateProfile(String nickname, String avatar) {
        this.nickname = nickname;
        this.avatar = avatar;
        this.updatedAt = Instant.now();
    }

    public AppUser getUser() {
        return user;
    }

    public String getProvider() {
        return provider;
    }

    public String getSubject() {
        return subject;
    }

    public String getNickname() {
        return nickname;
    }

    public String getAvatar() {
        return avatar;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
