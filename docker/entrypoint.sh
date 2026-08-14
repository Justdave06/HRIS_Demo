#!/bin/sh
set -e

export PORT="${PORT:-10000}"

echo "[entrypoint] PORT=${PORT}"

mkdir -p bootstrap/cache \
    storage/framework/cache/data \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs

chown -R www-data:www-data storage bootstrap/cache

envsubst '${PORT}' < docker/nginx.conf.template > /etc/nginx/nginx.conf

echo "[entrypoint] starting php-fpm"
php-fpm -D

sleep 2

echo "[entrypoint] starting nginx"
exec nginx -g 'daemon off;'
