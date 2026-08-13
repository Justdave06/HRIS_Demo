<?php

/**
 * Vercel serverless function entry — every request routes here (see
 * vercel.json). Static assets built by Vite (public/build) are served
 * straight from disk; everything else boots Laravel via public/index.php.
 */

$uri = urldecode(
    parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? '',
);

if ($uri === '/__diag') {
    header('Content-Type: text/plain; charset=utf-8');
    echo 'REQUEST_URI='.$_SERVER['REQUEST_URI']."\n\n";
    echo "--- getenv (relevant) ---\n";
    foreach (['APP_ENV','APP_DEBUG','APP_KEY','APP_CONFIG_CACHE','LOG_CHANNEL','SESSION_DRIVER','CACHE_DRIVER','VIEW_COMPILED_PATH','ASSET_URL','DB_CONNECTION'] as $k) {
        echo $k.'='.var_export(getenv($k), true)."\n";
    }
    echo "\n--- _ENV keys (relevant) ---\n";
    foreach (['APP_ENV','APP_DEBUG','APP_KEY','LOG_CHANNEL','SESSION_DRIVER'] as $k) {
        echo $k.'='.var_export($_ENV[$k] ?? null, true)."\n";
    }
    echo "\n--- file checks ---\n";
    echo 'public/build/manifest.json='.(file_exists(__DIR__.'/../public/build/manifest.json') ? 'yes' : 'no')."\n";
    echo 'bootstrap/cache/config.php='.(file_exists(__DIR__.'/../bootstrap/cache/config.php') ? 'yes' : 'no')."\n";
    echo 'bootstrap/cache/packages.php='.(file_exists(__DIR__.'/../bootstrap/cache/packages.php') ? 'yes' : 'no')."\n";
    echo 'vendor/autoload.php='.(file_exists(__DIR__.'/../vendor/autoload.php') ? 'yes' : 'no')."\n";
    echo '/tmp writable='.(is_writable('/tmp') ? 'yes' : 'no')."\n";
    exit;
}

if ($uri !== '/' && file_exists($file = __DIR__.'/../public'.$uri)) {
    header('Content-type: '.get_mime_type($file).'; charset: UTF-8;');
    echo require $file;
} else {
    require_once __DIR__.'/../public/index.php';
}

function get_mime_type(string $filename): string
{
    $extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
    $mimes = [
        'txt' => 'text/plain',
        'html' => 'text/html',
        'php' => 'text/html',
        'css' => 'text/css',
        'js' => 'application/javascript',
        'json' => 'application/json',
        'xml' => 'application/xml',
        'png' => 'image/png',
        'jpe' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'jpg' => 'image/jpeg',
        'webp' => 'image/webp',
        'gif' => 'image/gif',
        'bmp' => 'image/bmp',
        'ico' => 'image/vnd.microsoft.icon',
        'tiff' => 'image/tiff',
        'tif' => 'image/tiff',
        'svg' => 'image/svg+xml',
        'svgz' => 'image/svg+xml',
        'zip' => 'application/zip',
        'rar' => 'application/x-rar-compressed',
        'mp3' => 'audio/mpeg',
        'qt' => 'video/quicktime',
        'mov' => 'video/quicktime',
        'ttf' => 'application/x-font-ttf',
        'woff' => 'application/x-woff',
        'woff2' => 'font/woff2',
        'otf' => 'font/otf',
    ];

    return $mimes[$extension] ?? 'application/octet-stream';
}
