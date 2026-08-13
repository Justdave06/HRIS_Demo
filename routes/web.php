<?php

use App\Http\Controllers\Hris\AttendanceController;
use App\Http\Controllers\Hris\BenefitsController;
use App\Http\Controllers\Hris\ComingSoonController;
use App\Http\Controllers\Hris\EmployeeController;
use App\Http\Controllers\Hris\HubController;
use App\Http\Controllers\Hris\LeaveController;
use App\Http\Controllers\Hris\PayrollController;
use App\Http\Controllers\Hris\PerformanceController;
use App\Http\Controllers\Hris\RecruitmentController;
use Illuminate\Support\Facades\Route;

/*
 * HRIS demo (no login, no database). The demo hub is the home page.
 */
Route::get('/', [HubController::class, 'index'])->name('home');

Route::prefix('demo')->name('demo.')->group(function () {
    Route::get('/', [HubController::class, 'index'])->name('hub');

    // Module 1 - Employee Information Management
    Route::get('/employees/dashboard', [EmployeeController::class, 'dashboard'])->name('employees.dashboard');
    Route::get('/employees/reports', [EmployeeController::class, 'reports'])->name('employees.reports');
    Route::get('/employees/create', [EmployeeController::class, 'create'])->name('employees.create');
    Route::get('/employees', [EmployeeController::class, 'index'])->name('employees.index');
    // Session-added demo employees have no server record; their 201 file is
    // hydrated from sessionStorage on the client.
    Route::get('/employees/session/{employee}', [EmployeeController::class, 'sessionShow'])->whereNumber('employee')->name('employees.session');
    Route::get('/employees/{employee}', [EmployeeController::class, 'show'])->whereNumber('employee')->name('employees.show');

    // Module 2 - Recruitment & Onboarding
    Route::get('/recruitment', [RecruitmentController::class, 'index'])->name('recruitment.index');
    Route::get('/recruitment/dashboard', [RecruitmentController::class, 'dashboard'])->name('recruitment.dashboard');
    Route::get('/recruitment/vacancies', [RecruitmentController::class, 'vacancies'])->name('recruitment.vacancies');
    Route::get('/recruitment/reports', [RecruitmentController::class, 'reports'])->name('recruitment.reports');

    // Module 3 - Time & Attendance
    Route::get('/attendance', [AttendanceController::class, 'index'])->name('attendance.index');
    Route::get('/attendance/dashboard', [AttendanceController::class, 'dashboard'])->name('attendance.dashboard');
    Route::get('/attendance/manager', [AttendanceController::class, 'manager'])->name('attendance.manager');
    Route::get('/attendance/holidays', [AttendanceController::class, 'holidays'])->name('attendance.holidays');
    Route::get('/attendance/reports', [AttendanceController::class, 'reports'])->name('attendance.reports');

    // Module 4 - Leave Management
    Route::get('/leave', [LeaveController::class, 'index'])->name('leave.index');
    Route::get('/leave/dashboard', [LeaveController::class, 'dashboard'])->name('leave.dashboard');
    Route::get('/leave/requests', [LeaveController::class, 'requests'])->name('leave.requests');
    Route::get('/leave/records/{employee}', [LeaveController::class, 'record'])->whereNumber('employee')->name('leave.records');
    Route::get('/leave/reports', [LeaveController::class, 'reports'])->name('leave.reports');

    // Module 5 - Payroll Management
    Route::get('/payroll', [PayrollController::class, 'index'])->name('payroll.index');
    Route::get('/payroll/dashboard', [PayrollController::class, 'dashboard'])->name('payroll.dashboard');
    Route::get('/payroll/payslips', [PayrollController::class, 'payslips'])->name('payroll.payslips');
    Route::get('/payroll/reports', [PayrollController::class, 'reports'])->name('payroll.reports');

    // Module 6 - Benefits Administration
    Route::get('/benefits', [BenefitsController::class, 'index'])->name('benefits.index');
    Route::get('/benefits/dashboard', [BenefitsController::class, 'dashboard'])->name('benefits.dashboard');
    Route::get('/benefits/plans', [BenefitsController::class, 'plans'])->name('benefits.plans');
    Route::get('/benefits/reports', [BenefitsController::class, 'reports'])->name('benefits.reports');

    // Module 7 - Performance Management
    Route::get('/performance', [PerformanceController::class, 'index'])->name('performance.index');
    Route::get('/performance/dashboard', [PerformanceController::class, 'dashboard'])->name('performance.dashboard');
    Route::get('/performance/reviews', [PerformanceController::class, 'reviews'])->name('performance.reviews');
    Route::get('/performance/records/{employee}', [PerformanceController::class, 'record'])->whereNumber('employee')->name('performance.records');
    Route::get('/performance/reports', [PerformanceController::class, 'reports'])->name('performance.reports');

    // Modules 8-10 (coming soon)
    Route::get('/modules/{module}', [ComingSoonController::class, 'show'])->name('modules.show');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'Dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
