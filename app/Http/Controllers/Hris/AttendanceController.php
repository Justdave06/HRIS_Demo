<?php

namespace App\Http\Controllers\Hris;

use App\Http\Controllers\Controller;
use App\Support\DemoData;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    /**
     * Time & Attendance dashboard (Module 3). Kept at /demo/attendance so the
     * demo hub link keeps working, and mirrored at /demo/attendance/dashboard.
     */
    public function index()
    {
        return $this->dashboard();
    }

    /**
     * Time & Attendance dashboard — total employees, present / absent / on
     * leave today, attendance by department, and the Holiday Picker shortcut.
     */
    public function dashboard()
    {
        [$roster, $stats, $departments] = $this->attendanceData();

        return Inertia::render('demo/AttendanceDashboard', [
            'attendance' => $roster,
            'departments' => $departments,
            'stats' => $stats,
            'links' => DemoData::moduleLinks('attendance'),
        ]);
    }

    /**
     * Attendance manager — the daily roster with start/end date filters and a
     * print-ready DTR card per employee.
     */
    public function manager()
    {
        [$roster, $stats, $departments] = $this->attendanceData();

        return Inertia::render('demo/AttendanceManager', [
            'attendance' => $roster,
            'departments' => $departments,
            'links' => DemoData::moduleLinks('attendance'),
        ]);
    }

    /**
     * Holiday Picker — declare abrupt, non-national holidays (earthquake,
     * structural damage, etc.) with scope and pay treatment.
     */
    public function holidays()
    {
        $departments = collect(DemoData::employees())
            ->pluck('department')
            ->unique()
            ->sort()
            ->values()
            ->all();

        return Inertia::render('demo/HolidayPicker', [
            'departments' => $departments,
            'links' => DemoData::moduleLinks('attendance'),
        ]);
    }

    /**
     * Attendance reports — Tardiness and Overtime, with date range + search,
     * generate (official letterhead) and export.
     */
    public function reports()
    {
        [$roster, $stats, $departments] = $this->attendanceData();

        return Inertia::render('demo/AttendanceReports', [
            'attendance' => $roster,
            'departments' => $departments,
            'links' => DemoData::moduleLinks('attendance'),
        ]);
    }

    /**
     * Shared data for the attendance pages.
     *
     * @return array{0: array, 1: array, 2: array}
     */
    private function attendanceData(): array
    {
        $employees = collect(DemoData::employees())->keyBy('id');

        $roster = collect(DemoData::attendance())->map(function ($record) use ($employees) {
            $employee = $employees->get($record['employee_id']);

            return [
                'employee_id' => $record['employee_id'],
                'no' => $employee['no'],
                'name' => $employee['name'],
                'department' => $employee['department'],
                'position' => $employee['position'],
                'time_in' => $record['time_in'],
                'time_out' => $record['time_out'],
                'status' => $record['status'],
            ];
        })->values()->all();

        $departments = collect($employees)->pluck('department')->unique()->sort()->values()->all();

        $stats = [
            'totalEmployees' => $employees->count(),
            'presentToday' => collect($roster)->whereIn('status', ['Present', 'Late'])->count(),
            'absentToday' => collect($roster)->whereIn('status', ['Absent', 'Not Yet In'])->count(),
            'onLeaveToday' => collect($roster)->where('status', 'On Leave')->count(),
        ];

        return [$roster, $stats, $departments];
    }
}
