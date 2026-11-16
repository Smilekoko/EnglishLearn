#!/usr/bin/env bash
# 每天备份数据库，保留 14 天
# 用法：crontab -e 加一行
#   30 3 * * * DB_PASSWORD='xxx' /opt/englishlearn/backup.sh
set -euo pipefail

BACKUP_DIR=${BACKUP_DIR:-/opt/englishlearn/backups}
KEEP_DAYS=${KEEP_DAYS:-14}
DB_NAME=${DB_NAME:-englishlearn}
DB_USER=${DB_USERNAME:-englishlearn}
DB_PASS=${DB_PASSWORD:?需要设置 DB_PASSWORD}

mkdir -p "$BACKUP_DIR"
STAMP=$(date +%Y%m%d-%H%M%S)

mysqldump --single-transaction --quick --default-character-set=utf8mb4 \
  -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" | gzip > "$BACKUP_DIR/${DB_NAME}-${STAMP}.sql.gz"

# 清理过期备份
find "$BACKUP_DIR" -name "${DB_NAME}-*.sql.gz" -mtime +"$KEEP_DAYS" -delete

echo "[$(date '+%F %T')] backup done: ${BACKUP_DIR}/${DB_NAME}-${STAMP}.sql.gz"
