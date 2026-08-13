<?php

namespace App\Http\Controllers\Hris;

use App\Http\Controllers\Controller;
use App\Support\DemoData;
use Inertia\Inertia;

class DisciplinaryController extends Controller
{
    /**
     * Disciplinary dashboard (Module 9). Kept at /demo/disciplinary so the
     * demo hub link keeps working, and mirrored at /demo/disciplinary/dashboard.
     */
    public function index()
    {
        return $this->dashboard();
    }

    /**
     * Disciplinary dashboard — open cases, warnings and incidents logged,
     * escalations to offboarding, plus records by severity and the repeat
     * offenders list.
     */
    public function dashboard()
    {
        return Inertia::render('demo/DisciplinaryDashboard', $this->payload());
    }

    /**
     * Disciplinary log — the incident & warning directory with New record /
     * Review / Resolve / Escalate actions, plus the repeat-offender tab and
     * generate + export.
     */
    public function records()
    {
        return Inertia::render('demo/DisciplinaryRecords', $this->payload());
    }

    /**
     * One employee's disciplinary history — every case on file with status,
     * severity and action, in a dedicated page.
     */
    public function record(int $employeeId)
    {
        $employee = collect(DemoData::employees())->firstWhere('id', $employeeId);

        if (! $employee) {
            return redirect()->route('demo.disciplinary.records');
        }

        return Inertia::render('demo/DisciplinaryRecord', array_merge(
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
     * Disciplinary reports — case log, open cases, escalation handoff and
     * repeat offenders, with generate + export.
     */
    public function reports()
    {
        return Inertia::render('demo/DisciplinaryReports', $this->payload());
    }

    /**
     * Shared payload for the disciplinary pages. Repeat-offender grouping is
     * derived on the client (deterministic engine) so it stays in sync.
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
            ])->values()->all(),
            'records' => DemoData::disciplinaryRecords(),
        ];
    }
}
