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

    echo "\n--- php stream tests ---\n";
    $f = @fopen('php://stderr', 'a');
    echo 'fopen(php://stderr,a)='.($f ? 'ok' : 'FAILED')."\n";
    if ($f) { fclose($f); }

    echo "\n--- laravel boot + channel resolve ---\n";
    try {
        require __DIR__.'/../vendor/autoload.php';
        $app = require_once __DIR__.'/../bootstrap/app.php';
        $app->make(Illuminate\Contracts\Http\Kernel::class)->bootstrap();
        echo 'boot ok; app.env='.$app->environment()."\n";
        echo 'config(logging.default)='.config('logging.default')."\n";
        $log = $app->make(Illuminate\Log\LogManager::class);
        try {
            $logger = $log->channel('stderr');
            echo "channel('stderr') OK\n";
            $logger->info('diag write test');
            echo "channel('stderr') write OK\n";
        } catch (Throwable $e) {
            echo 'channel(stderr) FAILED: '.get_class($e).': '.$e->getMessage()."\n";
        }
        $rm = new ReflectionMethod($log, 'resolve');
        $rm->setAccessible(true);
        try {
            $logger = $rm->invoke($log, 'stderr', $log->configurationFor('stderr'));
            echo "resolve('stderr') OK\n";
        } catch (Throwable $e) {
            echo 'resolve(stderr) FAILED: '.get_class($e).': '.$e->getMessage()."\n";
            echo $e->getTraceAsString()."\n";
        }
        try {
            $logger = $log->channel('emergency');
            echo "channel('emergency') OK\n";
            $logger->emergency('diag emergency test');
            echo "channel('emergency') write OK\n";
        } catch (Throwable $e) {
            echo 'channel(emergency) FAILED: '.get_class($e).': '.$e->getMessage()."\n";
        }
    } catch (Throwable $e) {
        echo 'BOOT FAILED: '.get_class($e).': '.$e->getMessage()."\n";
        echo $e->getTraceAsString()."\n";
    }
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
