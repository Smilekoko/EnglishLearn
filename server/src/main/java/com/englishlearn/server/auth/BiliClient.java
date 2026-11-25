package com.englishlearn.server.auth;

import java.io.IOException;
import java.net.CookieManager;
import java.net.CookiePolicy;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

/**
 * B 站扫码登录的接口代理。
 *
 * <p>扫码流程（都是 B 站网页版登录接口，非官方 OpenAPI，可能随 B 站改版失效）：
 * generate 拿 qrcode_key 和跳转 url → 轮询 poll 直到 data.code = 0 → **再请求一次 data.url
 * （crossDomain）让 B 站把 SESSDATA / DedeUserID 等 cookie 写进 cookie jar** → 用同一份
 * cookie 调 nav 拿 mid / uname / face。
 *
 * <p>注意：poll 成功响应本身不一定带 Set-Cookie，跳过 data.url 这一步会导致 nav 未登录。
 *
 * <p>每个二维码用独立的 HttpClient + CookieManager，避免不同用户的 cookie 串号。
 */
@Component
public class BiliClient {

    private static final Logger log = LoggerFactory.getLogger(BiliClient.class);

    private static final String USER_AGENT =
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                    + "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
    private static final String QR_START =
            "https://passport.bilibili.com/x/passport-login/web/qrcode/generate";
    private static final String QR_POLL =
            "https://passport.bilibili.com/x/passport-login/web/qrcode/poll?qrcode_key=";
    private static final String NAV = "https://api.bilibili.com/x/web-interface/nav";
    /** 二维码 180 秒过期，留一点余量再清理内存里的 client */
    private static final Duration KEEP = Duration.ofMinutes(5);

    private final ObjectMapper mapper;
    private final Map<String, HttpClient> clients = new ConcurrentHashMap<>();
    private final Map<String, Instant> createdAt = new ConcurrentHashMap<>();

    public BiliClient(ObjectMapper mapper) {
        this.mapper = mapper;
    }

    public record Start(String key, String url) {
    }

    public record State(int code, String message, String followUrl) {
    }

    public record Profile(String mid, String name, String avatar) {
    }

    public Start generate() {
        HttpClient client = newClient();
        JsonNode node = get(client, QR_START);
        if (node.path("code").asInt() != 0) {
            throw new IllegalStateException("B 站二维码生成失败：" + node.path("message").asText());
        }
        String key = node.path("data").path("qrcode_key").asText();
        String url = node.path("data").path("url").asText();
        clients.put(key, client);
        createdAt.put(key, Instant.now());
        prune();
        return new Start(key, url);
    }

    /** data.code：0 成功、86101 未扫码、86090 已扫码待确认、86038 已过期 */
    public State poll(String key) {
        HttpClient client = clients.get(key);
        if (client == null) {
            return new State(86038, "二维码已过期，请刷新", null);
        }
        JsonNode node = get(client, QR_POLL + key);
        if (node.path("code").asInt() != 0) {
            return new State(node.path("code").asInt(), node.path("message").asText("轮询失败"), null);
        }
        JsonNode data = node.path("data");
        int code = data.path("code").asInt();
        String message = data.path("message").asText("");
        String followUrl = code == 0 ? data.path("url").asText("") : "";
        return new State(code, message, followUrl);
    }

    /** 扫码成功后请求一次 crossDomain 链接，让 B 站把登录 cookie 写进 cookie jar */
    public void follow(String key, String url) {
        HttpClient client = clients.get(key);
        if (client == null || url == null || url.isBlank()) {
            return;
        }
        // 只跟随 http(s) 链接；B 站偶尔会返回自定义 scheme
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            log.warn("B 站返回的跳转地址不是 http(s)，跳过：{}", url);
            return;
        }
        try {
            get(client, url);
        } catch (RuntimeException e) {
            // 拿 cookie 失败不直接报错，交给后面的 nav 判断
            log.warn("B 站 crossDomain 跳转失败：{}", e.getMessage());
        }
    }

    /** 扫码成功后调用；失败返回 null（未登录或风控） */
    public Profile nav(String key) {
        HttpClient client = clients.get(key);
        if (client == null) {
            return null;
        }
        JsonNode node = get(client, NAV);
        JsonNode data = node.path("data");
        if (node.path("code").asInt() != 0 || !data.path("isLogin").asBoolean()) {
            log.warn(
                    "B 站 nav 未登录：code={}, message={}",
                    node.path("code").asInt(),
                    node.path("message").asText(""));
            return null;
        }
        return new Profile(
                data.path("mid").asText(),
                data.path("uname").asText(),
                data.path("face").asText(""));
    }

    public void forget(String key) {
        clients.remove(key);
        createdAt.remove(key);
    }

    private HttpClient newClient() {
        CookieManager cookies = new CookieManager(null, CookiePolicy.ACCEPT_ALL);
        return HttpClient.newBuilder()
                .cookieHandler(cookies)
                .followRedirects(HttpClient.Redirect.ALWAYS)
                .connectTimeout(Duration.ofSeconds(8))
                .build();
    }

    private JsonNode get(HttpClient client, String url) {
        HttpRequest request = HttpRequest.newBuilder(URI.create(url))
                .header("User-Agent", USER_AGENT)
                .header("Referer", "https://www.bilibili.com/")
                .header("Origin", "https://www.bilibili.com")
                .header("Accept", "application/json, text/plain, */*")
                .timeout(Duration.ofSeconds(8))
                .GET()
                .build();
        try {
            HttpResponse<String> response =
                    client.send(request, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
            return mapper.readTree(response.body().isEmpty() ? "{}" : response.body());
        } catch (IOException e) {
            throw new IllegalStateException("访问 B 站接口失败", e);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("访问 B 站接口被中断", e);
        }
    }

    private void prune() {
        Instant cutoff = Instant.now().minus(KEEP);
        createdAt.entrySet().removeIf(entry -> {
            boolean stale = entry.getValue().isBefore(cutoff);
            if (stale) {
                clients.remove(entry.getKey());
            }
            return stale;
        });
    }
}
