# deploy · 香港服务器部署

面向一台 Ubuntu 24.04、2C4G 的香港轻量服务器，所有组件装在同一台机器上：

```
域名（无需备案）
└── Nginx :443
    ├── /            → /var/www/englishlearn/webReact   （用户端静态站）
    ├── /admin/      → /var/www/englishlearn/webAdmin   （管理端静态站）
    └── /api/        → 127.0.0.1:8080                   （Spring Boot）
                         └── MySQL 8（仅监听 127.0.0.1）
```

同一域名下没有跨域问题，`webReact` 的 `VITE_API_BASE` 不用设。

## 0. 买什么

| 项 | 建议 |
|----|------|
| 服务器 | 腾讯云/阿里云 **香港轻量** 2C4G（约 ¥90–150/月），Ubuntu 24.04，40 GB SSD |
| 带宽 | 轻量一般 30 Mbps 峰值 / 1 TB 流量，够用 |
| 域名 | 任意注册商，¥30–70/年，**不需要备案**，但要**实名认证** |
| 证书 | 免费（Let's Encrypt） |

安全组只开 **22（SSH）、80、443**，其余全部关闭。

## 1. 基础环境

```bash
# 以 root 登录后
apt update && apt upgrade -y
apt install -y openjdk-21-jre-headless nginx mysql-server certbot python3-certbot-nginx rsync

# 应用用户与目录
useradd -r -s /usr/sbin/nologin englishlearn || true
mkdir -p /opt/englishlearn/logs /var/www/englishlearn/{webReact,webAdmin} /etc/englishlearn
chown -R englishlearn:englishlearn /opt/englishlearn
```

## 2. 数据库

```bash
mysql -u root -p <<'SQL'
CREATE DATABASE IF NOT EXISTS englishlearn
  DEFAULT CHARACTER SET utf8mb4 DEFAULT COLLATE utf8mb4_0900_ai_ci;
CREATE USER IF NOT EXISTS 'englishlearn'@'localhost' IDENTIFIED BY '改成强密码';
GRANT ALL PRIVILEGES ON englishlearn.* TO 'englishlearn'@'localhost';
FLUSH PRIVILEGES;
SQL
```

表结构和初始数据由应用首次启动时自动创建/灌入，不用手工建表。

## 3. 环境变量

```bash
cp deploy/env.example /etc/englishlearn/env
# 编辑：把 DB_PASSWORD 换成上面的强密码
chmod 600 /etc/englishlearn/env
chown root:root /etc/englishlearn/env
```

## 4. 部署产物

本地执行：

```bash
HOST=root@你的服务器IP ./deploy/deploy.sh
```

脚本会构建 `server`、`webReact`、`webAdmin`（管理端用 `VITE_BASE=/admin/` 构建）并上传、切换。也可以手动：

```bash
cd server && ./gradlew bootJar
cd webReact && npm run build
cd webAdmin && VITE_BASE=/admin/ npm run build
```

上传后放到：

```
/opt/englishlearn/server.jar
/var/www/englishlearn/webReact/
/var/www/englishlearn/webAdmin/
```

## 5. 开机自启

```bash
cp deploy/systemd/englishlearn.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now englishlearn
systemctl status englishlearn
curl http://127.0.0.1:8080/api/health
```

## 6. Nginx + HTTPS

```bash
# 先把 example.com 换成你的域名，并确保域名已解析到服务器 IP
cp deploy/nginx/englishlearn.conf /etc/nginx/conf.d/
sed -i 's/example.com/你的域名/g' /etc/nginx/conf.d/englishlearn.conf
nginx -t && systemctl reload nginx

# 申请证书（自动改配置并加自动续期）
certbot --nginx -d 你的域名 -m 你的邮箱 --agree-tos --redirect
```

## 7. 备份

```bash
chmod +x /opt/englishlearn/backup.sh   # 把 deploy/backup.sh 拷过去
crontab -e
# 每天 3:30 备份，保留 14 天
30 3 * * * DB_PASSWORD='数据库密码' /opt/englishlearn/backup.sh
```

备份文件在 `/opt/englishlearn/backups/`，建议再同步到对象存储或本地一份。

## 8. 日常更新

```bash
HOST=root@服务器 ./deploy/deploy.sh
```

脚本会先停服务、替换 jar 与静态文件、再启动，并检查 `/api/health`。旧 jar 在 `/opt/englishlearn/server.jar`（可先备份一份再覆盖）。

## 常见问题

| 现象 | 排查 |
|------|------|
| 502 Bad Gateway | `systemctl status englishlearn`，看日志 `/opt/englishlearn/logs/server.log` |
| 管理端白屏 | 构建时忘了 `VITE_BASE=/admin/`，资源路径会指向 `/assets/...` |
| 页面能开但数据空 | `/api/health` 是否通；MySQL 用户/密码是否与 `/etc/englishlearn/env` 一致 |
| 国内访问慢 | 香港机器正常范围 30–80ms；持续很慢就换 CN2 线路的机房 |
| 证书过期 | `certbot renew --dry-run` 检查自动续期任务 |
