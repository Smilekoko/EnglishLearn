#!/usr/bin/env bash
# 本地构建并发布到服务器（在项目根目录执行）
#
#   1. 先配好 SSH 免密登录
#   2. HOST=root@1.2.3.4 ./deploy/deploy.sh
#
# 只做「构建 → 上传到 /tmp → 远端切换」，失败时旧的 jar 还留着，可手动回滚。
set -euo pipefail

HOST=${HOST:?用法: HOST=user@your-server ./deploy/deploy.sh}
REMOTE_DIR=${REMOTE_DIR:-/tmp/englishlearn-deploy}
ROOT=$(cd "$(dirname "$0")/.." && pwd)

echo "==> 构建后端"
(cd "$ROOT/server" && ./gradlew bootJar -q)

echo "==> 构建前端"
(cd "$ROOT/webReact" && npm run build)
(cd "$ROOT/webAdmin" && VITE_BASE=/admin/ npm run build)

echo "==> 上传到 $HOST:$REMOTE_DIR"
ssh "$HOST" "mkdir -p $REMOTE_DIR"
scp "$ROOT"/server/build/libs/*.jar "$HOST:$REMOTE_DIR/server.jar"
rsync -az --delete "$ROOT/webReact/dist/" "$HOST:$REMOTE_DIR/webReact/"
rsync -az --delete "$ROOT/webAdmin/dist/" "$HOST:$REMOTE_DIR/webAdmin/"

echo "==> 远端切换"
ssh "$HOST" REMOTE_DIR="$REMOTE_DIR" bash -s <<'REMOTE_SCRIPT'
set -euo pipefail
sudo systemctl stop englishlearn || true
sudo cp "$REMOTE_DIR/server.jar" /opt/englishlearn/server.jar
sudo rsync -a --delete "$REMOTE_DIR/webReact/" /var/www/englishlearn/webReact/
sudo rsync -a --delete "$REMOTE_DIR/webAdmin/" /var/www/englishlearn/webAdmin/
sudo systemctl start englishlearn
sleep 3
curl -fsS http://127.0.0.1:8080/api/health && echo
REMOTE_SCRIPT

echo "==> 完成"
