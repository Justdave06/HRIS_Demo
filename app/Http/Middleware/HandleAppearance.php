<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;
use Symfony\Component\HttpFoundation\Response;

class HandleAppearance
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // The demo area always renders light so every page shares the same
        // white canvas, regardless of the user's appearance preference.
        $appearance = $request->is('demo*', '/')
            ? 'light'
            : ($request->cookie('appearance') ?? 'system');

        View::share('appearance', $appearance);

        return $next($request);
    }
}
