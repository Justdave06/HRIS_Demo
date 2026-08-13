import inertia from '@inertiajs/vite';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import { execSync } from 'node:child_process';
import laravel from 'laravel-vite-plugin';
import { bunny } from 'laravel-vite-plugin/fonts';
import { defineConfig } from 'vite';

/*
 * The wayfinder plugin regenerates the typed route/action helpers
 * (resources/js/routes, resources/js/actions, resources/js/wayfinder) by
 * running `php artisan wayfinder:generate` at build start. Those helpers are
 * committed to the repo, so on PHP-less build environments (e.g. Vercel,
 * where there is no PHP or vendor/ directory) we skip regeneration and build
 * against the committed copies instead.
 */
let phpAvailable = false;

try {
    // Same resolution wayfinder uses (shell `exec`), so local builds keep
    // regenerating the helpers while PHP-less CI builds skip them.
    execSync('php -v', { stdio: 'ignore' });
    phpAvailable = true;
} catch {
    phpAvailable = false;
}

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.ts'],
            refresh: true,
            fonts: [
                bunny('Instrument Sans', {
                    weights: [400, 500, 600],
                }),
            ],
        }),
        inertia(),
        tailwindcss(),
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
        ...(phpAvailable
            ? [
                  wayfinder({
                      formVariants: true,
                  }),
              ]
            : []),
    ],
});
