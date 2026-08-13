<?php

namespace App\Http\Controllers\Hris;

use App\Http\Controllers\Controller;
use App\Support\DemoData;
use Inertia\Inertia;

class PayrollController extends Controller
{
    /**
     * Payroll dashboard (Module 5). Kept at /demo/payroll so the demo hub
     * link keeps working, and mirrored at /demo/payroll/dashboard.
     */
    public function index()
    {
        return $this->dashboard();
    }

    /**
     * Payroll dashboard — employees on payroll, gross / deductions / net for
     * the current period, payroll by department, and latest payslips.
     */
    public function dashboard()
    {
        return Inertia::render('demo/PayrollDashboard', $this->payload());
    }

    /**
     * Payslips — pick a pay period, review every payslip, open the
     * print-ready payslip card, and run the payroll.
     */
    public function payslips()
    {
        return Inertia::render('demo/PayrollPayslips', $this->payload());
    }

    /**
     * Payroll reports — summary, payslip register, deductions, and department
     * cost, with period + search, generate (official letterhead) and export.
     */
    public function reports()
    {
        return Inertia::render('demo/PayrollReports', $this->payload());
    }

    /**
     * Shared payload for the payroll pages. The payslip amounts themselves
     * are computed on the client (deterministic engine) so they stay in sync
     * with Attendance hours and the session-declared holidays.
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
            'periods' => DemoData::payrollPeriods(),
        ];
    }
}
