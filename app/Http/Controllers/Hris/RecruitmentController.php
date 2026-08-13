<?php

namespace App\Http\Controllers\Hris;

use App\Http\Controllers\Controller;
use App\Support\DemoData;
use Inertia\Inertia;

class RecruitmentController extends Controller
{
    /**
     * Recruitment & Onboarding dashboard (Module 2).
     */
    public function index()
    {
        $jobs = DemoData::openJobs();
        $candidates = DemoData::candidates();

        return Inertia::render('demo/Recruitment', [
            'jobs' => $jobs,
            'candidates' => $candidates,
            'onboarding' => DemoData::onboarding(),
            'links' => DemoData::moduleLinks('recruitment'),
            'stats' => [
                'openJobs' => count($jobs),
                'totalApplicants' => array_sum(array_column($jobs, 'applicants')),
                'candidates' => count($candidates),
                'interviews' => count(array_filter($candidates, fn ($c) => $c['stage'] === 'Interview')),
                'hired' => count(array_filter($candidates, fn ($c) => $c['stage'] === 'Hired')),
            ],
        ]);
    }
}
