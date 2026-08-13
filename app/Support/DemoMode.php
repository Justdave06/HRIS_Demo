<?php

namespace App\Support;

/**
 * Demo mode — the HRIS starts with a small starter roster of 5 sample
 * employees (so every module has someone to reference while testing) but no
 * records, so every workflow can be run from zero. The full sample dataset
 * can be toggled on from the hub, which stores the choice in the session.
 */
class DemoMode
{
    /** The system starts with the starter roster; sample data is toggled on. */
    public static function blank(): bool
    {
        return session('demo_mode', 'blank') === 'blank';
    }

    /**
     * Employees available in the current mode. The starter roster is the
     * first 5 seeded employees; sample mode returns the full 30.
     */
    public static function employees(): array
    {
        return self::blank()
            ? array_slice(DemoData::employees(), 0, 5)
            : DemoData::employees();
    }

    /** Departments offered when the system starts blank (no employees yet). */
    public static function defaultDepartments(): array
    {
        return [
            'Human Resources',
            'Finance',
            'Information Technology',
            'Operations',
            'Sales',
            'Marketing',
        ];
    }
}
