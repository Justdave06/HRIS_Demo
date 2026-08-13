<?php

namespace App\Http\Controllers\Hris;

use App\Http\Controllers\Controller;
use App\Support\DemoData;
use App\Support\DemoMode;
use Inertia\Inertia;

class TrainingController extends Controller
{
    /**
     * Training dashboard (Module 8). Kept at /demo/training so the demo hub
     * link keeps working, and mirrored at /demo/training/dashboard.
     */
    public function index()
    {
        return $this->dashboard();
    }

    /**
     * Training dashboard — courses this quarter, active enrollments,
     * completion rate and certificates issued, plus enrollments by category
     * and the upcoming training calendar.
     */
    public function dashboard()
    {
        return Inertia::render('demo/TrainingDashboard', $this->payload());
    }

    /**
     * Courses & Enrollment — the training calendar catalog and the
     * enrollment directory with New enrollment / Start / Complete / Withdraw
     * actions and generate + export.
     */
    public function enrollments()
    {
        return Inertia::render('demo/TrainingEnrollments', $this->payload());
    }

    /**
     * One employee's full training history — every course they enrolled in
     * with status, score and certificate, in a dedicated page.
     */
    public function record(int $employeeId)
    {
        $employee = collect(DemoData::employees())->firstWhere('id', $employeeId);

        if (! $employee) {
            return redirect()->route('demo.training.enrollments');
        }

        return Inertia::render('demo/TrainingRecord', array_merge(
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
     * Training record for a session-added demo employee. The server has no
     * record for them — the page hydrates the employee from sessionStorage.
     */
    public function sessionRecord(int $employeeId)
    {
        $employee = collect(DemoData::employees())->firstWhere('id', $employeeId);

        if (! $employee) {
            return Inertia::render('demo/TrainingRecord', array_merge(
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

        return redirect()->route('demo.training.enrollments');
    }

    /**
     * Training reports — enrollment, completion & scores, certificate
     * register and course summary, with generate + export.
     */
    public function reports()
    {
        return Inertia::render('demo/TrainingReports', $this->payload());
    }

    /**
     * Shared payload for the training pages. Counts and completion rates are
     * derived on the client (deterministic engine) so they stay in sync.
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
            ])->values()->all(),
            'courses' => DemoData::trainingCourses(),
            'enrollments' => DemoMode::blank() ? [] : DemoData::trainingEnrollments(),
        ];
    }
}
