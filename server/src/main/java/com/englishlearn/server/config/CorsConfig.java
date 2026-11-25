package com.englishlearn.server.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * 前端开发服务器（webReact 5173、webAdmin 5174）与后端不同源，统一在这里放行。
 * 线上是同域部署（Nginx 把 /api 反代到本机 8080），不需要额外的跨域放行；
 * 换正式域名后如有独立前端域名，在 allowedOrigins 里按需追加。
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173", "http://localhost:5174")
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                // 会话走 HttpOnly Cookie，必须允许携带凭证
                .allowCredentials(true)
                .maxAge(3600);
    }
}
