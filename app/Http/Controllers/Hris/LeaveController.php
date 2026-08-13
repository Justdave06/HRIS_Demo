<?php

namespace App\Http\Controllers\Hris;

use App\Http\Controllers\Controller;
use App\Support\DemoData;
use App\Support\DemoMode;
use Inertia\Inertia;

class LeaveController extends Controller
{
    /**
     * Leave dashboard (Module 4). Kept at /demo/leave so the demo hub link
     * keeps working, and mirrored at /demo/leave/dashboard.
     */
    public function index()
    {
        return $this->dashboard();
    }

    /**
     * Leave dashboard — total requests, pending, approved, on leave today,
     * leaves by type, and recent requests.
     */
    public function dashboard()
    {
        [$rows, $types, $stats] = $this->leaveData();

        return Inertia::render('demo/LeaveDashboard', [
            'requests' => $rows,
            'employees' => collect(DemoMode::employees())->map(fn ($e) => [
                'id' => $e['id'],
                'no' => $e['no'],
                'name' => $e['name'],
                'department' => $e['department'],
                'position' => $e['position'],
                'balance' => $e['leave_balance'],
            ])->values()->all(),
            'types' => $types,
            'stats' => $stats,
            'links' => DemoData::moduleLinks('leave'),
        ]);
    }

    /**
     * Leave requests — the list with search + status/type filters, a new
     * request form, and Approve / Decline actions.
     */
    public function requests()
    {
        [$rows, $types, $stats] = $this->leaveData();

        return Inertia::render('demo/LeaveRequests', [
            'requests' => $rows,
            'employees' => collect(DemoMode::employees())->map(fn ($e) => [
                'id' => $e['id'],
                'no' => $e['no'],
                'name' => $e['name'],
                'department' => $e['department'],
                'position' => $e['position'],
                'balance' => $e['leave_balance'],
            ])->values()->all(),
            'types' => $types,
            'stats' => $stats,
            'links' => DemoData::moduleLinks('leave'),
        ]);
    }

    /**
     * One employee's leave record — balance summary and full history in a
     * dedicated page (with generate report + export).
     */
    public function record(int $employeeId)
    {
        $employee = collect(DemoData::employees())->firstWhere('id', $employeeId);

        if (! $employee) {
            return redirect()->route('demo.leave.requests');
        }

        [$rows] = $this->leaveData();

        return Inertia::render('demo/LeaveRecord', [
            'employee' => [
                'id' => $employee['id'],
                'no' => $employee['no'],
                'name' => $employee['name'],
                'department' => $employee['department'],
                'position' => $employee['position'],
                'balance' => $employee['leave_balance'],
            ],
            'requests' => $rows,
        ]);
    }

    /**
     * Leave record for a session-added demo employee. The server has no
     * record for them — the page hydrates the employee from sessionStorage.
     */
    public function sessionRecord(int $employeeId)
    {
        $employee = collect(DemoData::employees())->firstWhere('id', $employeeId);

        if (! $employee) {
            [$rows] = $this->leaveData();

            return Inertia::render('demo/LeaveRecord', [
                'employee' => [
                    'id' => $employeeId,
                    'no' => 'EMP-'.str_pad((string) $employeeId, 4, '0', STR_PAD_LEFT),
                    'name' => 'Employee',
                    'department' => '',
                    'position' => '',
                    'balance' => 0,
                ],
                'requests' => $rows,
            ]);
        }

        return redirect()->route('demo.leave.requests');
    }

    /**
     * Leave reports — summary, balances, and type breakdown, with search,
     * generate (official letterhead) and export.
     */
    public function reports()
    {
        [$rows, $types, $stats] = $this->leaveData();

        return Inertia::render('demo/LeaveReports', [
            'requests' => $rows,
            'employees' => collect(DemoMode::employees())->map(fn ($e) => [
                'id' => $e['id'],
                'no' => $e['no'],
                'name' => $e['name'],
                'department' => $e['department'],
                'position' => $e['position'],
                'balance' => $e['leave_balance'],
            ])->values()->all(),
            'types' => $types,
            'stats' => $stats,
            'links' => DemoData::moduleLinks('leave'),
        ]);
    }

    /**
     * Shared data for the leave pages.
     *
     * @return array{0: array, 1: array, 2: array}
     */
    private function leaveData(): array
    {
        if (DemoMode::blank()) {
            return [
                [],
                DemoData::leaveTypes(),
                ['total' => 0, 'pending' => 0, 'approved' => 0, 'onLeaveToday' => 0],
            ];
        }

        $employees = collect(DemoData::employees())->keyBy('id');

        $rows = collect(DemoData::leaveRequests())->map(function ($request) use ($employees) {
            $employee = $employees->get($request['employee_id']);

            return [
                'id' => $request['id'],
                'employee_id' => $request['employee_id'],
                'no' => $employee['no'],
                'name' => $employee['name'],
                'department' => $employee['department'],
                'position' => $employee['position'],
                'balance' => $employee['leave_balance'],
                'type' => $request['type'],
                'from' => $request['from'],
                'to' => $request['to'],
                'days' => $request['days'],
                'status' => $request['status'],
                'reason' => $request['reason'],
            ];
        })->values()->all();

        $types = DemoData::leaveTypes();

        $stats = [
            'total' => count($rows),
            'pending' => collect($rows)->where('status', 'Pending')->count(),
            'approved' => collect($rows)->where('status', 'Approved')->count(),
            'onLeaveToday' => collect(DemoData::attendance())->where('status', 'On Leave')->count(),
        ];

        return [$rows, $types, $stats];
    }
}
