#!/bin/bash
set -e

echo "⏳ Waiting for PostgreSQL to be ready..."

# Ждём готовности PostgreSQL (до 30 секунд)
max_attempts=30
attempt=0
until python -c "from app.db.database import engine; engine.connect()" 2>/dev/null; do
    attempt=$((attempt + 1))
    if [ $attempt -ge $max_attempts ]; then
        echo "❌ PostgreSQL is not available after $max_attempts attempts"
        exit 1
    fi
    echo "   Attempt $attempt/$max_attempts..."
    sleep 1
done

echo "✅ PostgreSQL is ready!"

# Применяем миграции
echo "🔄 Running database migrations..."
alembic upgrade head

# Заполняем БД (с проверкой на дубликаты внутри скрипта)
echo "🌱 Running database seeding..."
python seed.py

# Запускаем сервер
echo "🚀 Starting FastAPI server..."
exec uvicorn main:app --host 0.0.0.0 --port 8000
