#!/usr/bin/env bash
# SQLite + uploads backup script. Run nightly via cron on the VPS.
#
# Crontab entry (server time):
#   0 3 * * * /opt/radiantsound/scripts/backup.sh >> /var/log/radiantsound-backup.log 2>&1
#
# Restores:
#   docker compose down
#   cp /opt/radiantsound-backups/radiant-YYYY-MM-DD.db /var/lib/docker/volumes/radiantsound_portal_data/_data/radiant.db
#   docker compose up -d

set -euo pipefail

# Where docker compose stores the named volume on the host.
# Verify with: docker volume inspect radiantsound_portal_data
VOLUME_PATH="/var/lib/docker/volumes/radiantsound_portal_data/_data"
DB_FILE="$VOLUME_PATH/radiant.db"

# Backup target — pick somewhere off the main disk if possible
# (separate volume, S3 sync, rsync to a NAS, etc.). Keep 30 days.
BACKUP_DIR="/opt/radiantsound-backups"
RETAIN_DAYS=30

if [ ! -f "$DB_FILE" ]; then
  echo "No database file at $DB_FILE — nothing to back up."
  exit 0
fi

mkdir -p "$BACKUP_DIR"
TS=$(date +%Y-%m-%d_%H%M%S)
TARGET="$BACKUP_DIR/radiant-$TS.db"

# .backup is the SQLite-blessed way to copy a live database — handles
# concurrent writes correctly. Falls back to `cp` if sqlite3 missing.
if command -v sqlite3 >/dev/null 2>&1; then
  sqlite3 "$DB_FILE" ".backup '$TARGET'"
else
  cp "$DB_FILE" "$TARGET"
fi

echo "Backed up to $TARGET"

# Prune backups older than RETAIN_DAYS.
find "$BACKUP_DIR" -name "radiant-*.db" -type f -mtime +$RETAIN_DAYS -delete
