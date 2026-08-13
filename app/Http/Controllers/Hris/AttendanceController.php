<?php

namespace App\Http\Controllers\Hris;

use App\Http\Controllers\Controller;
use App\Support\DemoData;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    /**
     * Time & Attendance dashboard (Module 3).
     */
    public function index()
    {
        $employees = collect(DemoData::employees())->keyBy('id');
        $attendance = collect(DemoData::attendance())->map(function ($record) use ($employees) {
            $employee = $employees->get($record['employee_id']);

            return [
                'employee_id' => $record['employee_id'],
                'name' => $employee['name'],
                'department' => $employee['department'],
                'position' => $employee['position'],
                'time_in' => $record['time_in'],
                'time_out' => $record['time_out'],
                'status' => $record['status'],
            ];
        });

        $weeklyHours = collect(DemoData::weeklyHours())->map(function ($hours, $employeeId) use ($employees, $attendance) {
            $employee = $employees->get((int) $employeeId);
            $status = $attendance->firstWhere('employee_id', (int) $employeeId)['status'];
            $working = in_array($status, ['Present', 'Late'], true);

            return [
                'employee_id' => (int) $employeeId,
                'name' => $employee['name'],
                'department' => $employee['department'],
                'hours' => $working ? round($hours, 1) : null,
                'status' => $status,
            ];
        });

        return Inertia::render('demo/Attendance', [
            'attendance' => $attendance->values()->all(),
            'weeklyHours' => $weeklyHours->values()->all(),
            'links' => DemoData::moduleLinks('attendance'),
            'stats' => [
                'atWork' => $attendance->whereIn('status', ['Present', 'Late'])->count(),
                'late' => $attendance->where('status', 'Late')->count(),
                'onLeave' => $attendance->where('status', 'On Leave')->count(),
                'notIn' => $attendance->whereIn('status', ['Absent', 'Not Yet In'])->count(),
            ],
        ]);
    }
}
