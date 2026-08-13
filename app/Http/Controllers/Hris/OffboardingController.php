<?php

namespace App\Http\Controllers\Hris;

use App\Http\Controllers\Controller;
use App\Support\DemoData;
use App\Support\DemoMode;
use Inertia\Inertia;

class OffboardingController extends Controller
{
    /**
     * Separation & Offboarding dashboard (Module 10). Kept at
     * /demo/offboarding so the demo hub link keeps working, and mirrored at
     * /demo/offboarding/dashboard.
     */
    public function index()
    {
        return $this->dashboard();
    }

    /**
     * Separation & Offboarding dashboard — active cases, clearance progress,
     * final pay pending, and archived separations.
     */
    public function dashboard()
    {
        return Inertia::render('demo/OffboardingDashboard', $this->payload());
    }

    /**
     * Offboarding register — every separation case with the New separation /
     * Advance stage / Clearance actions, plus filters and export.
     */
    public function cases()
    {
        return Inertia::render('demo/OffboardingCases', $this->payload());
    }

    /**
     * One employee's separation case — clearance checklist, final pay
     * breakdown and pipeline timeline, in a dedicated page.
     */
    public function case(int $employeeId)
    {
        $employee = collect(DemoData::employees())->firstWhere('id', $employeeId);

        if (! $employee) {
            return redirect()->route('demo.offboarding.cases');
        }

        return Inertia::render('demo/OffboardingCase', array_merge(
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
     * Case page for a session-added demo employee. The server has no record
     * for them — the page hydrates the employee and case from the browser's
     * sessionStorage (client-side), just like the employees module.
     */
    public function sessionCase(int $employeeId)
    {
        $employee = collect(DemoData::employees())->firstWhere('id', $employeeId);

        if (! $employee) {
            return Inertia::render('demo/OffboardingCase', array_merge(
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

        return redirect()->route('demo.offboarding.cases');
    }

    /**
     * Read-only employee overview kept inside this module — the case page's
     * "Employee record" button opens the employee's profile and records here
     * (no edit actions) so the user stays in Separation & Offboarding.
     */
    public function employeeOverview(int $employeeId)
    {
        $employee = collect(DemoData::employees())->firstWhere('id', $employeeId);

        if (! $employee) {
            return redirect()->route('demo.offboarding.cases');
        }

        $employee['employment_type'] = DemoData::employmentTypes()[$employee['id']] ?? 'Regular';
        $employee['file_status'] = DemoData::is201Complete($employee['id']) ? 'Complete' : 'Incomplete';

        return Inertia::render('demo/EmployeeOverview', [
            'employee' => $employee,
            'record' => DemoData::recordFor($employee['id']),
        ]);
    }

    /**
     * Read-only employee overview for a session-added demo employee (id
     * 1001+). The client hydrates the 201 file from sessionStorage; the
     * server only sends a placeholder directory row.
     */
    public function sessionEmployeeOverview(int $employeeId)
    {
        $employee = collect(DemoData::employees())->firstWhere('id', $employeeId);

        if (! $employee) {
            return Inertia::render('demo/EmployeeOverview', [
                'employee' => [
                    'id' => $employeeId,
                    'no' => 'EMP-'.str_pad((string) $employeeId, 4, '0', STR_PAD_LEFT),
                    'name' => 'Employee',
                    'department' => '',
                    'position' => '',
                    'status' => 'Active',
                    'employment_type' => 'Regular',
                    'file_status' => 'Incomplete',
                    'email' => '',
                    'phone' => '',
                    'hire_date' => '',
                    'birth_date' => '',
                    'gender' => '',
                    'address' => '',
                    'emergency' => ['name' => '', 'relation' => '', 'phone' => ''],
                    'manager' => '',
                    'salary' => 0,
                    'leave_balance' => 0,
                    'trainings' => 0,
                ],
                'record' => null,
            ]);
        }

        return redirect()->route('demo.offboarding.cases');
    }

    /**
     * Offboarding reports — case register, active separations, final pay
     * summary and archived cases, with generate + export.
     */
    public function reports()
    {
        return Inertia::render('demo/OffboardingReports', $this->payload());
    }

    /**
     * Shared payload for the offboarding pages. Escalated disciplinary cases
     * (Module 9) ride along so the handoff into termination is visible.
     */
    private function payload(): array
    {
        return [
            // The starter roster (5 employees) or the full sample set — the
            // separation dropdown needs someone to pick in either mode.
            'employees' => collect(DemoMode::employees())->map(fn ($e) => [
                'id' => $e['id'],
                'no' => $e['no'],
                'name' => $e['name'],
                'department' => $e['department'],
                'position' => $e['position'],
                'employment_type' => DemoData::employmentTypes()[$e['id']] ?? 'Regular',
                'salary' => $e['salary'],
                'leave_balance' => $e['leave_balance'],
            ])->values()->all(),
            'cases' => DemoMode::blank() ? [] : DemoData::offboardingCases(),
            // Seeded disciplinary records ride along so the client can derive
            // the live escalation set — including cases escalated during the
            // session — and flag the handoff into termination correctly.
            'disciplinary' => DemoMode::blank()
                ? []
                : DemoData::disciplinaryRecords(),
        ];
    }
}
