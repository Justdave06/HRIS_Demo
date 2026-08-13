<?php

namespace App\Http\Controllers\Hris;

use App\Http\Controllers\Controller;
use App\Support\DemoData;
use App\Support\DemoMode;
use Inertia\Inertia;

class HubController extends Controller
{
    /**
     * The simple login screen: pick one of the 10 demo accounts (each tied
     * to a module) to log in instantly.
     */
    public function index()
    {
        return Inertia::render('demo/Hub', [
            'accounts' => DemoData::accounts(),
            'modules' => DemoData::modules(),
            'mode' => DemoMode::blank() ? 'blank' : 'sample',
        ]);
    }

    /**
     * Switch the demo between a fresh blank system and the seeded sample
     * data. Stored in the session; a GET keeps the demo free of CSRF setup.
     */
    public function mode(string $mode)
    {
        session(['demo_mode' => in_array($mode, ['blank', 'sample'], true) ? $mode : 'blank']);

        return redirect('/');
    }
}
