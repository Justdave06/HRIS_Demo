<?php

namespace App\Http\Controllers\Hris;

use App\Http\Controllers\Controller;
use App\Support\DemoData;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class RecruitmentController extends Controller
{
    /**
     * Recruitment dashboard (Module 2). Kept at /demo/recruitment so the
     * demo hub link keeps working, and mirrored at /demo/recruitment/dashboard.
     */
    public function index()
    {
        return $this->dashboard();
    }

    /**
     * Recruitment & Onboarding dashboard (Module 2).
     */
    public function dashboard()
    {
        [$jobs, $candidates, $departments, $stats] = $this->recruitmentData();

        return Inertia::render('demo/RecruitmentDashboard', [
            'jobs' => $jobs,
            'candidates' => $candidates,
            'departments' => $departments,
            'stats' => $stats,
        ]);
    }

    /**
     * Vacancy management (Module 2) - list with search, filters and the
     * add-vacancy form (manual hiring document attachment).
     */
    public function vacancies()
    {
        [$jobs, $candidates, $departments, $stats] = $this->recruitmentData();

        return Inertia::render('demo/Vacancies', [
            'jobs' => $jobs,
            'candidates' => $candidates,
            'departments' => $departments,
            'positions' => collect($jobs)->pluck('position')->unique()->sort()->values()->all(),
            'stats' => $stats,
        ]);
    }

    /**
     * Recruitment reports (Module 2) - table with filters, generate and export.
     */
    public function reports()
    {
        [$jobs, $candidates, $departments, $stats] = $this->recruitmentData();

        return Inertia::render('demo/RecruitmentReports', [
            'jobs' => $jobs,
            'candidates' => $candidates,
            'onboarding' => DemoData::onboarding(),
            'departments' => $departments,
            'positions' => collect($jobs)->pluck('position')->unique()->sort()->values()->all(),
            'stats' => $stats,
        ]);
    }

    /**
     * Shared data for the recruitment pages.
     *
     * @return array{0: array, 1: array, 2: array, 3: array}
     */
    private function recruitmentData(): array
    {
        $jobs = DemoData::openJobs();
        $candidates = DemoData::candidates();
        $now = Carbon::now();

        $departments = collect($jobs)->pluck('department')->unique()->sort()->values()->all();

        // Hired this month counts applicants whose hire date falls in the
        // current calendar month.
        $hiredThisMonth = collect($candidates)
            ->filter(fn ($c) => $c['stage'] === 'Hired' && $c['hired_on'])
            ->filter(fn ($c) => Carbon::parse($c['hired_on'])->isSameMonth($now))
            ->count();

        $stats = [
            'vacant' => collect($jobs)->where('status', 'Open')->count(),
            'totalApplicants' => count($candidates),
            'shortlisted' => collect($candidates)->whereIn('stage', ['Shortlisted', 'Interview'])->count(),
            'hiredThisMonth' => $hiredThisMonth,
        ];

        return [$jobs, $candidates, $departments, $stats];
    }
}
