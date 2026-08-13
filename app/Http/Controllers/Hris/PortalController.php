<?php

namespace App\Http\Controllers\Hris;

use App\Http\Controllers\Controller;
use App\Support\DemoData;
use App\Support\DemoMode;
use Inertia\Inertia;

class PortalController extends Controller
{
    /**
     * Employee Portal login. Sample employees ride along so the page can
     * pre-seed demo credentials; employees added by HR log in with the
     * email + temporary password HR created (kept in the browser).
     */
    public function login()
    {
        return Inertia::render('demo/PortalLogin', [
            'employees' => collect(DemoMode::employees())->map(fn ($e) => [
                'id' => $e['id'],
                'no' => $e['no'],
                'name' => $e['name'],
                'email' => $e['email'],
            ])->values()->all(),
        ]);
    }

    /**
     * Employee self-service dashboard — shows the logged-in employee's own
     * records across modules (profile, attendance, leave, payslips, goals,
     * trainings, disciplinary, offboarding). The portal session lives in the
     * browser, so every employee's data is sent and the page picks the row
     * that matches the signed-in employee.
     */
    public function dashboard()
    {
        // Starter roster (5 employees) or the full sample set. Records below
        // still start empty so the portal workflows can be tested from zero.
        $employees = collect(DemoMode::employees());
        $employmentTypes = DemoData::employmentTypes();

        return Inertia::render('demo/PortalDashboard', [
            'employees' => $employees->map(fn ($e) => [
                'id' => $e['id'],
                'no' => $e['no'],
                'name' => $e['name'],
                'department' => $e['department'],
                'position' => $e['position'],
                'status' => $e['status'],
                'employment_type' => $employmentTypes[$e['id']] ?? 'Regular',
                'hire_date' => $e['hire_date'],
                'salary' => $e['salary'],
                'leave_balance' => $e['leave_balance'],
                'email' => $e['email'],
                'trainings' => $e['trainings'],
            ])->values()->all(),
            'attendance' => DemoMode::blank() ? [] : DemoData::attendance(),
            'leave' => DemoMode::blank() ? [] : DemoData::leaveRequests(),
            // Payroll periods are reference data; payslips are computed live
            // on the client from the same engine as the Payroll module, so a
            // payslip HR marks Paid (or a payroll run) reflects here instantly.
            'periods' => DemoData::payrollPeriods(),
            'goals' => DemoMode::blank() ? [] : DemoData::performanceGoals(),
            'trainings' => DemoMode::blank() ? [] : DemoData::trainingEnrollments(),
            'courses' => collect(DemoData::trainingCourses())->keyBy('id')->all(),
            'disciplinary' => DemoMode::blank() ? [] : DemoData::disciplinaryRecords(),
            'offboarding' => DemoMode::blank() ? [] : DemoData::offboardingCases(),
            // Benefit plans are reference data (available even in blank
            // mode); seeded enrollments are records, so they start empty.
            'plans' => DemoData::benefitPlans(),
            'enrollments' => DemoMode::blank() ? [] : DemoData::benefitEnrollments(),
        ]);
    }
}
