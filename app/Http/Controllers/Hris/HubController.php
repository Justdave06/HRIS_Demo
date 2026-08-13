<?php

namespace App\Http\Controllers\Hris;

use App\Http\Controllers\Controller;
use App\Support\DemoData;
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
        ]);
    }
}
