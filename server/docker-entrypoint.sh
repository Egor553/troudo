#!/bin/sh

# Exit immediately if a command exits with a non-zero status
set -e

# Extract DB host and port from DATABASE_URL
# Example: postgresql://user:pass@db:5432/dbname
DB_HOST="db"
DB_PORT="5432"

echo "⏳ Waiting for database ($DB_HOST:$DB_PORT) to be ready..."

while ! nc -z $DB_HOST $DB_PORT; do
  sleep 1
done

echo "✅ Database is up! Syncing Prisma schema..."
if [ -d "prisma/migrations" ]; then
  npx prisma migrate deploy
else
  echo "⚠️ No migrations found. Using prisma db push to initialize..."
  npx prisma db push
fi

echo "🚀 Starting Troudo Backend..."
exec "$@"
