import { computed, ref } from 'vue';
import type {
    DemoDisciplinaryRecord,
    DemoDisciplinaryRow,
    DemoRepeatOffender,
} from '@/types';

/*
 * Disciplinary engine (Module 9). Every record is enriched with the
 * employee's record, and repeat offenders are grouped for the offboarding
 * handoff:
 *
 *   status   = Logged → Under Review → Resolved | Escalated (session actions)
 *   flagged  = escalated, or enough cases to warrant offboarding review
 *
 * Session-backed like every other demo store: new records, Review / Resolve /
 * Escalate actions and withdrawals survive navigation in the same tab, gone
 * when the tab closes. No database.
 */

const ADDED_KEY = 'hris-demo-added-records';
const STATUS_KEY = 'hris-demo-record-statuses';
const UPDATE_KEY = 'hris-demo-record-updates';
const REMOVED_KEY = 'hris-demo-removed-records';
const HANDOFF_KEY = 'hris-demo-handoffs';

export const DISCIPLINARY_CATEGORIES = [
    'Tardiness',
    'Absenteeism',
    'Policy Violation',
    'Misconduct',
    'Negligence',
    'Insubordination',
    'Harassment',
] as const;

export const DISCIPLINARY_SEVERITIES = [
    'Minor',
    'Moderate',
    'Serious',
] as const;

/** Common sanctions — pick one when logging or updating a case. */
export const DISCIPLINARY_ACTIONS = [
    'Verbal warning',
    'Written warning',
    'Final written warning',
    'Counseling session',
    'Suspension (3 days)',
    'Suspension (5 days)',
    'Suspension (10 days)',
    'Investigation',
    'Dismissal recommendation',
] as const;

export type DisciplinaryEmployee = {
    id: number;
    no: string;
    name: string;
    department: string;
    position: string;
};

function loadStored<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') {
        return fallback;
    }

    try {
        const raw = window.sessionStorage.getItem(key);

        return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
        return fallback;
    }
}

function saveStored(key: string, value: unknown): void {
    if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(key, JSON.stringify(value));
    }
}

export type DisciplinaryDraft = {
    employee_id: number;
    type: 'Incident' | 'Warning';
    severity: 'Minor' | 'Moderate' | 'Serious';
    category: string;
    date: string;
    description: string;
    action: string;
};

export function useDemoDisciplinary(
    employees: DisciplinaryEmployee[],
    seeded: DemoDisciplinaryRecord[],
) {
    const added = ref<DemoDisciplinaryRecord[]>(
        loadStored<DemoDisciplinaryRecord[]>(ADDED_KEY, []),
    );
    const statusOverrides = ref<
        Record<number, DemoDisciplinaryRecord['status']>
    >(
        loadStored<Record<number, DemoDisciplinaryRecord['status']>>(
            STATUS_KEY,
            {},
        ),
    );
    const removed = ref<number[]>(loadStored<number[]>(REMOVED_KEY, []));

    /** Field edits (action, severity, category…) written by the edit modal. */
    const updates = ref<Record<number, Partial<DemoDisciplinaryRecord>>>(
        loadStored(UPDATE_KEY, {}),
    );

    /** Effective status: an action override wins over the seeded value. */
    function statusFor(
        record: DemoDisciplinaryRecord,
    ): DemoDisciplinaryRecord['status'] {
        return statusOverrides.value[record.id] ?? record.status;
    }

    /** Every record (seeded + session-added), enriched with the employee. */
    const rows = ref<DemoDisciplinaryRow[]>([]);

    function rebuild(): void {
        const all: DemoDisciplinaryRecord[] = [
            ...seeded.filter((item) => !removed.value.includes(item.id)),
            ...added.value,
        ];
        const out: DemoDisciplinaryRow[] = [];

        for (const record of all) {
            const employee = employees.find(
                (row) => row.id === record.employee_id,
            );

            if (!employee) {
                continue;
            }

            out.push({
                ...record,
                ...(updates.value[record.id] ?? {}),
                status: statusFor(record),
                no: employee.no,
                name: employee.name,
                department: employee.department,
                position: employee.position,
            });
        }

        rows.value = out;
    }

    rebuild();

    /**
     * Employee ids handed off to Separation & Offboarding (Module 10) — the
     * live set that flags terminations there. A handoff happens two ways:
     * the case status is Escalated, or the action taken is a Dismissal
     * recommendation (the dismissal path). Session-aware: a case escalated
     * or marked for dismissal here shows up in Offboarding instantly.
     */
    const escalatedEmployeeIds = computed<number[]>(
        () =>
            [...new Set(
                rows.value
                    .filter(
                        (row) =>
                            row.status === 'Escalated' ||
                            row.action === 'Dismissal recommendation',
                    )
                    .map((row) => row.employee_id),
            )],
    );

    /** Employees with cases — used for the repeat-offender directory. */
    const repeatOffenders = computed<DemoRepeatOffender[]>(() => {
        const byEmployee = new Map<
            number,
            {
                no: string;
                name: string;
                department: string;
                position: string;
                total: number;
                serious: number;
                open: number;
                escalated: boolean;
            }
        >();

        for (const row of rows.value) {
            const entry = byEmployee.get(row.employee_id) ?? {
                no: row.no,
                name: row.name,
                department: row.department,
                position: row.position,
                total: 0,
                serious: 0,
                open: 0,
                escalated: false,
            };

            entry.total += 1;
            entry.serious += row.severity === 'Serious' ? 1 : 0;
            entry.open +=
                row.status === 'Logged' || row.status === 'Under Review'
                    ? 1
                    : 0;
            entry.escalated = entry.escalated || row.status === 'Escalated';
            byEmployee.set(row.employee_id, entry);
        }

        return [...byEmployee.entries()]
            .map(([employee_id, entry]) => ({
                employee_id,
                no: entry.no,
                name: entry.name,
                department: entry.department,
                position: entry.position,
                recordCount: entry.total,
                seriousCount: entry.serious,
                openCount: entry.open,
                flagged:
                    entry.escalated ||
                    entry.total >= 3 ||
                    (entry.total >= 2 && entry.serious >= 1),
            }))
            .sort(
                (a, b) =>
                    b.recordCount - a.recordCount ||
                    b.seriousCount - a.seriousCount,
            );
    });

    function nextId(): number {
        const highest = [...seeded, ...added.value].reduce(
            (max, item) => Math.max(max, item.id),
            1000,
        );

        return highest + 1;
    }

    /** Log a new warning or incident — starts as Logged. */
    function addRecord(draft: DisciplinaryDraft): DemoDisciplinaryRecord {
        const record: DemoDisciplinaryRecord = {
            id: nextId(),
            employee_id: draft.employee_id,
            type: draft.type,
            severity: draft.severity,
            category: draft.category,
            date: draft.date,
            description: draft.description,
            action: draft.action,
            status: 'Logged',
        };

        added.value.unshift(record);
        saveStored(ADDED_KEY, added.value);
        rebuild();

        return record;
    }

    /**
     * Update a case — any field (action taken, severity, category…) plus an
     * optional new status, so a single modal can drive the whole workflow.
     */
    function updateRecord(
        id: number,
        patch: Omit<DisciplinaryDraft, 'employee_id'>,
        status?: DemoDisciplinaryRecord['status'],
    ): void {
        updates.value[id] = { ...patch };
        saveStored(UPDATE_KEY, updates.value);

        if (status) {
            statusOverrides.value[id] = status;
            saveStored(STATUS_KEY, statusOverrides.value);
        }

        rebuild();
    }

    /** Move a Logged case into review (session-persisted). */
    function review(id: number): void {
        statusOverrides.value[id] = 'Under Review';
        saveStored(STATUS_KEY, statusOverrides.value);
        rebuild();
    }

    /** Close a case as resolved (session-persisted). */
    function resolve(id: number): void {
        statusOverrides.value[id] = 'Resolved';
        saveStored(STATUS_KEY, statusOverrides.value);
        rebuild();
    }

    /** Escalate a case to Separation & Offboarding (session-persisted). */
    function escalate(id: number): void {
        statusOverrides.value[id] = 'Escalated';
        saveStored(STATUS_KEY, statusOverrides.value);
        rebuild();
    }

    /**
     * Employee ids explicitly sent to Separation & Offboarding (Module 10)
     * via the "Hand off" action. Sending does not navigate anywhere — the
     * termination case lands in the offboarding register automatically, and
     * the offboarding staff reviews and processes it from there.
     */
    const handedOffIds = ref<number[]>(
        loadStored<number[]>(HANDOFF_KEY, []),
    );

    /** Mark an employee as handed off to Separation & Offboarding. */
    function handoff(employeeId: number): void {
        if (!handedOffIds.value.includes(employeeId)) {
            handedOffIds.value = [...handedOffIds.value, employeeId];
            saveStored(HANDOFF_KEY, handedOffIds.value);
        }
    }

    /** Withdraw a record (session-persisted). */
    function remove(id: number): void {
        if (seeded.some((item) => item.id === id)) {
            removed.value.push(id);
            saveStored(REMOVED_KEY, removed.value);
        } else {
            added.value = added.value.filter((item) => item.id !== id);
            saveStored(ADDED_KEY, added.value);
        }

        rebuild();
    }

    return {
        rows,
        escalatedEmployeeIds,
        handedOffIds,
        repeatOffenders,
        addRecord,
        updateRecord,
        review,
        resolve,
        escalate,
        handoff,
        remove,
    };
}
