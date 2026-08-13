<?php

namespace App\Http\Controllers\Hris;

use App\Http\Controllers\Controller;
use App\Support\DemoData;
use Inertia\Inertia;

class BenefitsController extends Controller
{
    /**
     * Benefits dashboard (Module 6). Kept at /demo/benefits so the demo hub
     * link keeps working, and mirrored at /demo/benefits/dashboard.
     */
    public function index()
    {
        return $this->dashboard();
    }

    /**
     * Benefits dashboard — enrolled employees, active plans, monthly employee
     * and employer cost, enrollment by plan, and recent enrollments.
     */
    public function dashboard()
    {
        return Inertia::render('demo/BenefitsDashboard', $this->payload());
    }

    /**
     * Benefit Plans — the plan strip plus the enrollments table with an
     * enroll form, Confirm / Remove actions, and generate + export.
     */
    public function plans()
    {
        return Inertia::render('demo/BenefitsPlans', $this->payload());
    }

    /**
     * Benefits reports — enrollment summary, contributions, plan cost, and
     * allowances, with search, generate (official letterhead) and export.
     */
    public function reports()
    {
        return Inertia::render('demo/BenefitsReports', $this->payload());
    }

    /**
     * Shared payload for the benefits pages. Contribution amounts are derived
     * on the client (same rates as Payroll) so they stay in sync everywhere.
     */
    private function payload(): array
    {
        return [
            'employees' => collect(DemoData::employees())->map(fn ($e) => [
                'id' => $e['id'],
                'no' => $e['no'],
                'name' => $e['name'],
                'department' => $e['department'],
                'position' => $e['position'],
                'salary' => $e['salary'],
            ])->values()->all(),
            'plans' => DemoData::benefitPlans(),
            'enrollments' => DemoData::benefitEnrollments(),
        ];
    }
}
