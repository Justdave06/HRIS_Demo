<?php

namespace App\Http\Controllers\Hris;

use App\Http\Controllers\Controller;
use App\Support\DemoData;
use Inertia\Inertia;

class ComingSoonController extends Controller
{
    /**
     * Preview page for modules that are not built yet.
     */
    public function show(string $module)
    {
        $module = collect(DemoData::modules())->firstWhere('slug', $module);

        if (! $module) {
            return redirect()->route('demo.hub');
        }

        return Inertia::render('demo/ComingSoon', [
            'module' => $module,
            'links' => DemoData::moduleLinks($module['slug']),
        ]);
    }
}
