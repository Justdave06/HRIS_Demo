<?php

namespace App\Http\Controllers\Hris;

use App\Http\Controllers\Controller;
use App\Support\DemoData;
use App\Support\DemoMode;
use Inertia\Inertia;

class PerformanceController extends Controller
{
    /**
     * Performance dashboard (Module 7). Kept at /demo/performance so the demo
     * hub link keeps working, and mirrored at /demo/performance/dashboard.
     */
    public function index()
    {
        return $this->dashboard();
    }

    /**
     * Performance dashboard — reviews this period, average rating, raise
     * recommendations for Payroll, skill gaps for Training, average rating by
     * department, and goals in progress.
     */
    public function dashboard()
    {
        return Inertia::render('demo/PerformanceDashboard', $this->payload());
    }

    /**
     * Goals & Reviews — review periods, the reviews table with a new review
     * form, Submit / Finalize actions, and generate + export.
     */
    public function reviews()
    {
        return Inertia::render('demo/PerformanceReviews', $this->payload());
    }

    /**
     * Performance reports — rating summary, raise recommendations, skill
     * gaps, and goals, with period + search, generate (official letterhead)
     * and export.
     */
    public function reports()
    {
        return Inertia::render('demo/PerformanceReports', $this->payload());
    }

    /**
     * One employee's full performance record — every review across periods
     * with criteria ratings, raise recommendations and skill gaps, plus the
     * goals set for the current cycle, in a dedicated page.
     */
    public function record(int $employeeId)
    {
        $employee = collect(DemoData::employees())->firstWhere('id', $employeeId);

        if (! $employee) {
            return redirect()->route('demo.performance.reviews');
        }

        return Inertia::render('demo/PerformanceRecord', array_merge(
            $this->payload(),
            ['employee' => [
                'id' => $employee['id'],
                'no' => $employee['no'],
                'name' => $employee['name'],
                'department' => $employee['department'],
                'position' => $employee['position'],
                'salary' => $employee['salary'],
                'manager' => $employee['manager'],
            ]],
        ));
    }

    /**
     * Performance record for a session-added demo employee. The server has
     * no record for them — the page hydrates the employee from sessionStorage.
     */
    public function sessionRecord(int $employeeId)
    {
        $employee = collect(DemoData::employees())->firstWhere('id', $employeeId);

        if (! $employee) {
            return Inertia::render('demo/PerformanceRecord', array_merge(
                $this->payload(),
                ['employee' => [
                    'id' => $employeeId,
                    'no' => 'EMP-'.str_pad((string) $employeeId, 4, '0', STR_PAD_LEFT),
                    'name' => 'Employee',
                    'department' => '',
                    'position' => '',
                    'salary' => 0,
                    'manager' => '',
                ]],
            ));
        }

        return redirect()->route('demo.performance.reviews');
    }

    /**
     * Shared payload for the performance pages. Ratings, raise amounts and
     * skill gaps are derived on the client (deterministic engine) so they
     * stay in sync everywhere.
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
            'periods' => DemoData::performancePeriods(),
            'reviews' => DemoMode::blank() ? [] : DemoData::performanceReviews(),
            'goals' => DemoMode::blank() ? [] : DemoData::performanceGoals(),
        ];
    }
}
