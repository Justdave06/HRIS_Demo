<?php

use App\Http\Controllers\Hris\AttendanceController;
use App\Http\Controllers\Hris\ComingSoonController;
use App\Http\Controllers\Hris\EmployeeController;
use App\Http\Controllers\Hris\HubController;
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

    // Modules 4-10 (coming soon)
    Route::get('/modules/{module}', [ComingSoonController::class, 'show'])->name('modules.show');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'Dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
