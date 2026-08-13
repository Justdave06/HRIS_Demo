<?php

use App\Http\Controllers\Hris\AttendanceController;
use App\Http\Controllers\Hris\BenefitsController;
use App\Http\Controllers\Hris\ComingSoonController;
use App\Http\Controllers\Hris\DisciplinaryController;
use App\Http\Controllers\Hris\EmployeeController;
use App\Http\Controllers\Hris\HubController;
use App\Http\Controllers\Hris\LeaveController;
use App\Http\Controllers\Hris\OffboardingController;
use App\Http\Controllers\Hris\PayrollController;
use App\Http\Controllers\Hris\PerformanceController;
use App\Http\Controllers\Hris\PortalController;
use App\Http\Controllers\Hris\RecruitmentController;
use App\Http\Controllers\Hris\TrainingController;
use Illuminate\Support\Facades\Route;

/*
 * HRIS demo (no login, no database). The demo hub is the home page.
 */
Route::get('/', [HubController::class, 'index'])->name('home');

Route::prefix('demo')->name('demo.')->group(function () {
    Route::get('/', [HubController::class, 'index'])->name('hub');

    // Toggle between a fresh blank system and the seeded sample data.
    Route::get('/mode/{mode}', [HubController::class, 'mode'])->name('mode');

    // Module 1 - Employee Information Management
    Route::get('/employees/dashboard', [EmployeeController::class, 'dashboard'])->name('employees.dashboard');
    Route::get('/employees/reports', [EmployeeController::class, 'reports'])->name('employees.reports');
    Route::get('/employees/create', [EmployeeController::class, 'create'])->name('employees.create');
    Route::get('/employees', [EmployeeController::class, 'index'])->name('employees.index');
    // Session-added demo employees have no server record; their 201 file is
    // hydrated from sessionStorage on the client.
    Route::get('/employees/session/{employee}', [EmployeeController::class, 'sessionShow'])->whereNumber('employee')->name('employees.session');
    Route::get('/employees/{employee}', [EmployeeController::class, 'show'])->whereNumber('employee')->name('employees.show');
    // Legacy read-only overview URLs — the overview now lives inside the
    // Separation & Offboarding module; redirect stale links and bookmarks.
    Route::redirect('/employees/session/{employee}/overview', '/offboarding/employees/session/{employee}', 301)->whereNumber('employee')->name('employees.session.overview.redirect');
    Route::redirect('/employees/{employee}/overview', '/offboarding/employees/{employee}', 301)->whereNumber('employee')->name('employees.overview.redirect');

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
    Route::get('/leave/records/session/{employee}', [LeaveController::class, 'sessionRecord'])->whereNumber('employee')->name('leave.records.session');
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
    // One employee's full benefits record — every enrollment and loan on
    // file, in a dedicated page. Session-added employees (id 1001+) hydrate
    // their record from sessionStorage on the client.
    Route::get('/benefits/employees/session/{employee}', [BenefitsController::class, 'sessionEmployee'])->whereNumber('employee')->name('benefits.employees.session');
    Route::get('/benefits/employees/{employee}', [BenefitsController::class, 'employee'])->whereNumber('employee')->name('benefits.employees.show');
    Route::get('/benefits/reports', [BenefitsController::class, 'reports'])->name('benefits.reports');

    // Module 7 - Performance Management
    Route::get('/performance', [PerformanceController::class, 'index'])->name('performance.index');
    Route::get('/performance/dashboard', [PerformanceController::class, 'dashboard'])->name('performance.dashboard');
    Route::get('/performance/reviews', [PerformanceController::class, 'reviews'])->name('performance.reviews');
    Route::get('/performance/records/{employee}', [PerformanceController::class, 'record'])->whereNumber('employee')->name('performance.records');
    Route::get('/performance/records/session/{employee}', [PerformanceController::class, 'sessionRecord'])->whereNumber('employee')->name('performance.records.session');
    Route::get('/performance/reports', [PerformanceController::class, 'reports'])->name('performance.reports');

    // Module 8 - Training & Development
    Route::get('/training', [TrainingController::class, 'index'])->name('training.index');
    Route::get('/training/dashboard', [TrainingController::class, 'dashboard'])->name('training.dashboard');
    Route::get('/training/enrollments', [TrainingController::class, 'enrollments'])->name('training.enrollments');
    Route::get('/training/records/{employee}', [TrainingController::class, 'record'])->whereNumber('employee')->name('training.records');
    Route::get('/training/records/session/{employee}', [TrainingController::class, 'sessionRecord'])->whereNumber('employee')->name('training.records.session');
    Route::get('/training/reports', [TrainingController::class, 'reports'])->name('training.reports');

    // Module 9 - Disciplinary Management
    Route::get('/disciplinary', [DisciplinaryController::class, 'index'])->name('disciplinary.index');
    Route::get('/disciplinary/dashboard', [DisciplinaryController::class, 'dashboard'])->name('disciplinary.dashboard');
    Route::get('/disciplinary/records', [DisciplinaryController::class, 'records'])->name('disciplinary.records');
    Route::get('/disciplinary/records/session/{employee}', [DisciplinaryController::class, 'sessionRecord'])->whereNumber('employee')->name('disciplinary.records.session');
    Route::get('/disciplinary/records/{employee}', [DisciplinaryController::class, 'record'])->whereNumber('employee')->name('disciplinary.records.show');
    Route::get('/disciplinary/reports', [DisciplinaryController::class, 'reports'])->name('disciplinary.reports');

    // Module 10 - Separation & Offboarding
    Route::get('/offboarding', [OffboardingController::class, 'index'])->name('offboarding.index');
    Route::get('/offboarding/dashboard', [OffboardingController::class, 'dashboard'])->name('offboarding.dashboard');
    Route::get('/offboarding/cases', [OffboardingController::class, 'cases'])->name('offboarding.cases');
    Route::get('/offboarding/cases/session/{employee}', [OffboardingController::class, 'sessionCase'])->whereNumber('employee')->name('offboarding.cases.session');
    Route::get('/offboarding/cases/{employee}', [OffboardingController::class, 'case'])->whereNumber('employee')->name('offboarding.cases.show');
    // Read-only employee record overview, kept inside this module so the
    // case page's "Employee record" button never leaves Separation &
    // Offboarding. Session-added employees (id 1001+) hydrate from session.
    Route::get('/offboarding/employees/session/{employee}', [OffboardingController::class, 'sessionEmployeeOverview'])->whereNumber('employee')->name('offboarding.employees.session');
    Route::get('/offboarding/employees/{employee}', [OffboardingController::class, 'employeeOverview'])->whereNumber('employee')->name('offboarding.employees.show');
    Route::get('/offboarding/reports', [OffboardingController::class, 'reports'])->name('offboarding.reports');

    // Employee Portal — employees log in with the email + temporary password
    // HR created when they were hired in Employee Management.
    Route::get('/portal', [PortalController::class, 'login'])->name('portal.login');
    Route::get('/portal/dashboard', [PortalController::class, 'dashboard'])->name('portal.dashboard');

    Route::get('/modules/{module}', [ComingSoonController::class, 'show'])->name('modules.show');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'Dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
