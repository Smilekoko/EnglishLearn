package com.englishlearn.server.config;

import com.englishlearn.server.auth.AdminGuard;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/** 注册管理端拦截器：/api/admin/** 必须是管理员。 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final AdminGuard adminGuard;

    public WebConfig(AdminGuard adminGuard) {
        this.adminGuard = adminGuard;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(adminGuard).addPathPatterns("/api/admin/**");
    }
}
