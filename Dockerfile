# ---------------------------------------------------------------------------
# Stage 1: Build frontend assets (Node)
# node:22-slim is Debian/glibc based so the -linux-x64-gnu native binaries
# (tailwind oxide, lightningcss, rollup) listed in optionalDependencies work.
# ---------------------------------------------------------------------------
FROM node:22-slim AS node_build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build

# ---------------------------------------------------------------------------
# Stage 2: PHP-FPM + Nginx runtime
# ---------------------------------------------------------------------------
FROM php:8.3-fpm-alpine AS runtime

WORKDIR /var/www/html

RUN apk add --no-cache \
        nginx \
        gettext \
        zip \
        unzip \
        libzip-dev \
        oniguruma-dev \
        libxml2-dev \
        sqlite-dev \
    && docker-php-ext-install pdo pdo_mysql pdo_sqlite mbstring bcmath zip

# PHP-FPM: let workers inherit the environment variables set by Render
RUN sed -i 's/^;clear_env = no/clear_env = no/' /usr/local/etc/php-fpm.d/www.conf \
    && grep -q '^clear_env = no' /usr/local/etc/php-fpm.d/www.conf \
        || echo 'clear_env = no' >> /usr/local/etc/php-fpm.d/www.conf

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# App source
COPY . .

# Frontend build from stage 1 (overrides anything local; public/build is dockerignored anyway)
COPY --from=node_build /app/public/build ./public/build

# PHP dependencies (no dev packages on production)
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader

RUN chmod +x docker/entrypoint.sh \
    && mkdir -p bootstrap/cache \
        storage/framework/cache/data \
        storage/framework/sessions \
        storage/framework/views \
        storage/logs \
    && chown -R www-data:www-data storage bootstrap/cache

EXPOSE 10000

CMD ["docker/entrypoint.sh"]
