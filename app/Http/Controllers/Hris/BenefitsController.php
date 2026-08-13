<?php

namespace App\Http\Controllers\Hris;

use App\Http\Controllers\Controller;
use App\Support\DemoData;
use App\Support\DemoMode;
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
     * One employee's full benefits record — every enrollment and loan
     * application on file, in a dedicated read-only page.
     */
    public function employee(int $employeeId)
    {
        $employee = collect(DemoData::employees())->firstWhere('id', $employeeId);

        if (! $employee) {
            return redirect()->route('demo.benefits.plans');
        }

        return Inertia::render('demo/BenefitsEmployee', array_merge(
            $this->payload(),
            ['employee' => [
                'id' => $employee['id'],
                'no' => $employee['no'],
                'name' => $employee['name'],
                'department' => $employee['department'],
                'position' => $employee['position'],
            ]],
        ));
    }

    /**
     * Benefits record page for a session-added demo employee (id 1001+). The
     * server has no record for them — the client hydrates the employee and
     * their session enrollments / loans from the browser's sessionStorage.
     */
    public function sessionEmployee(int $employeeId)
    {
        $employee = collect(DemoData::employees())->firstWhere('id', $employeeId);

        if (! $employee) {
            return Inertia::render('demo/BenefitsEmployee', array_merge(
                $this->payload(),
                ['employee' => [
                    'id' => $employeeId,
                    'no' => 'EMP-'.str_pad((string) $employeeId, 4, '0', STR_PAD_LEFT),
                    'name' => 'Employee',
                    'department' => '',
                    'position' => '',
                ]],
            ));
        }

        return redirect()->route('demo.benefits.plans');
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
            'employees' => collect(DemoMode::employees())->map(fn ($e) => [
                'id' => $e['id'],
                'no' => $e['no'],
                'name' => $e['name'],
                'department' => $e['department'],
                'position' => $e['position'],
                'salary' => $e['salary'],
            ])->values()->all(),
            'plans' => DemoData::benefitPlans(),
            'enrollments' => DemoMode::blank() ? [] : DemoData::benefitEnrollments(),
        ];
    }
}
