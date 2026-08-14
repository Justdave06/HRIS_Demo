#!/bin/sh
set -e

export PORT="${PORT:-10000}"
echo "[entrypoint] PORT=${PORT}"

# Determine the user php-fpm should run as.
if [ "$(id -u)" = "0" ]; then
    echo "[entrypoint] running as root"
    mkdir -p bootstrap/cache \
        storage/framework/cache/data \
        storage/framework/sessions \
        storage/framework/views \
        storage/logs 2>/dev/null || true
    chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || true
    FPM_USER=www-data
    FPM_GROUP=www-data
else
    echo "[entrypoint] running as $(id -un) ($(id -u)); php-fpm runs as the container user"
    FPM_USER="$(id -un)"
    FPM_GROUP="$(id -gn)"
fi

# php-fpm pool config (generated into /tmp so it works whether or not we are root)
cat > /tmp/www.conf <<EOF
error_log = /dev/stderr
[www]
user = ${FPM_USER}
group = ${FPM_GROUP}
listen = 9000
pm = dynamic
pm.max_children = 5
pm.start_servers = 2
pm.min_spare_servers = 1
pm.max_spare_servers = 3
clear_env = no
catch_workers_output = yes
EOF

# nginx config (generated into /tmp — /etc/nginx is not writable when non-root)
envsubst '${PORT}' < docker/nginx.conf.template > /tmp/nginx.conf

echo "[entrypoint] starting php-fpm"
php-fpm -y /tmp/www.conf -D || { echo "[entrypoint] php-fpm failed to start"; exit 1; }

sleep 2

echo "[entrypoint] starting nginx"
exec nginx -c /tmp/nginx.conf -g 'daemon off;'
