<?php

namespace App\Http\Controllers\Hris;

use App\Http\Controllers\Controller;
use App\Support\DemoData;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    /**
     * Employee Information Management - Dashboard (Module 1).
     */
    public function dashboard()
    {
        [$rows, $departments, $stats] = $this->employeeRows();

        return Inertia::render('demo/EmployeesDashboard', [
            'employees' => $rows->values()->all(),
            'departments' => $departments,
            'stats' => $stats,
        ]);
    }

    /**
     * Employee list (Module 1 - Employee Management).
     */
    public function index()
    {
        [$rows, $departments] = $this->employeeRows();

        return Inertia::render('demo/Employees', [
            'employees' => $rows->values()->all(),
            'departments' => $departments,
            'links' => DemoData::moduleLinks('employees'),
        ]);
    }

    /**
     * Sample reports page (Module 1 - Reports).
     */
    public function reports()
    {
        [$rows, $departments, $stats] = $this->employeeRows();

        return Inertia::render('demo/Reports', [
            'employees' => $rows->values()->all(),
            'departments' => $departments,
            'positions' => $rows->pluck('position')->unique()->sort()->values()->all(),
            'stats' => $stats,
        ]);
    }

    /**
     * Add employee page (Module 1) - full record with tabbed sections.
     */
    public function create()
    {
        return Inertia::render('demo/AddEmployee', [
            'departments' => collect(DemoData::employees())
                ->pluck('department')
                ->unique()
                ->sort()
                ->values()
                ->all(),
        ]);
    }

    /**
     * One employee's full record (Module 1 detail).
     */
    public function show(int $employee)
    {
        $employee = collect(DemoData::employees())->firstWhere('id', $employee);

        if (! $employee) {
            return redirect()->route('demo.employees.index');
        }

        $employee['employment_type'] = DemoData::employmentTypes()[$employee['id']] ?? 'Regular';
        $employee['file_status'] = DemoData::is201Complete($employee['id']) ? 'Complete' : 'Incomplete';

        return Inertia::render('demo/EmployeeDetail', [
            'employee' => $employee,
            'departments' => collect(DemoData::employees())->pluck('department')->unique()->sort()->values()->all(),
            'trainings' => DemoData::trainingsFor($employee['id']),
            'record' => DemoData::recordFor($employee['id']),
        ]);
    }

    /**
     * View page for a session-added demo employee. The server has no
     * record for them — the page hydrates the 201 file from the browser's
     * sessionStorage (client-side) and falls back to the directory row.
     */
    public function sessionShow(int $employeeId)
    {
        $employee = collect(DemoData::employees())->firstWhere('id', $employeeId);

        if (! $employee) {
            // Session-added employees have ids 1001+ and never exist here.
            // The client hydrates their record from sessionStorage.
            return Inertia::render('demo/EmployeeDetail', [
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
                'departments' => collect(DemoData::employees())->pluck('department')->unique()->sort()->values()->all(),
                'trainings' => [],
                'record' => null,
            ]);
        }

        return redirect()->route('demo.employees.index');
    }

    /**
     * Shared data for the list-style pages: employee rows with today's
     * attendance status, department options, and headline stats.
     *
     * @return array{0: \Illuminate\Support\Collection, 1: array, 2: array}
     */
    private function employeeRows(): array
    {
        $employees = DemoData::employees();
        $attendance = collect(DemoData::attendance());
        $employmentTypes = DemoData::employmentTypes();
        $now = Carbon::now();

        $rows = collect($employees)->map(function ($employee) use ($attendance, $employmentTypes) {
            $today = $attendance->firstWhere('employee_id', $employee['id']);

            return array_merge($employee, [
                'today' => $today['status'] ?? 'Not Yet In',
                'employment_type' => $employmentTypes[$employee['id']] ?? 'Regular',
                'file_status' => DemoData::is201Complete($employee['id']) ? 'Complete' : 'Incomplete',
            ]);
        });

        $departments = $rows->pluck('department')->unique()->sort()->values()->all();

        $stats = [
            'total' => $rows->count(),
            'regular' => $rows->where('employment_type', 'Regular')->count(),
            'probationary' => $rows->where('employment_type', 'Probationary')->count(),
            'contractual' => $rows->where('employment_type', 'Contractual')->count(),
            'atWork' => $rows->whereIn('today', ['Present', 'Late'])->count(),
            'onLeave' => $rows->where('today', 'On Leave')->count(),
            'newThisMonth' => $rows->filter(fn ($e) => Carbon::parse($e['hire_date'])->isSameMonth($now))->count(),
            'absent' => $rows->where('today', 'Absent')->count(),
            'notIn' => $rows->where('today', 'Not Yet In')->count(),
        ];

        return [$rows, $departments, $stats];
    }
}
