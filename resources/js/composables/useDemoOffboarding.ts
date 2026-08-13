import { computed, ref } from 'vue';
import { useDemoLoans } from '@/composables/useDemoLoans';
import type {
    DemoClearanceTask,
    DemoFinalPay,
    DemoOffboardingCase,
    DemoOffboardingDraft,
    DemoOffboardingRow,
    DemoOffboardingStatus,
    DemoOffboardingType,
} from '@/types';

/*
 * Separation & Offboarding engine (Module 10). Every case is enriched with
 * the employee's record and a computed final pay:
 *
 *   status   = Requested → In Clearance → Final Pay → Completed (archived)
 *   flagged  = employee has an escalated disciplinary case (Module 9 handoff)
 *
 * Session-backed like every other demo store: new cases, stage changes,
 * clearance task toggles and withdrawals survive navigation in the same tab,
 * gone when the tab closes. No database.
 */

const ADDED_KEY = 'hris-demo-added-offboarding-cases';
const STATUS_KEY = 'hris-demo-offboarding-statuses';
const TASKS_KEY = 'hris-demo-offboarding-task-overrides';
const UPDATES_KEY = 'hris-demo-offboarding-updates';
const REMOVED_KEY = 'hris-demo-removed-offboarding-cases';

/** The exit clearance checklist every separation starts with. */
export const OFFBOARDING_CLEARANCE: DemoClearanceTask[] = [
    { label: 'Return company laptop and peripherals', done: false },
    { label: 'Clear desk and locker', done: false },
    { label: 'Turn over documents and files', done: false },
    { label: 'Exit interview with HR', done: false },
    { label: 'Settle outstanding advances or loans', done: false },
    { label: 'Deactivate system and email access', done: false },
    { label: 'Return company ID and access cards', done: false },
];

export const OFFBOARDING_TYPES: DemoOffboardingType[] = [
    'Resignation',
    'Termination',
    'End of Contract',
    'Retirement',
];

export const OFFBOARDING_STATUSES: DemoOffboardingStatus[] = [
    'Requested',
    'In Clearance',
    'Final Pay',
    'Completed',
];

export type OffboardingEmployee = {
    id: number;
    no: string;
    name: string;
    department: string;
    position: string;
    employment_type: DemoOffboardingRow['employment_type'];
    salary: number;
    leave_balance: number;
};

/** A handoff from Disciplinary (Module 9): employee has an escalated case. */
export type OffboardingEscalation = {
    employee_id: number;
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

function round2(value: number): number {
    return Math.round(value * 100) / 100;
}

/** Monthly withholding tax (BIR monthly bracket) — same as the payroll engine. */
function withholdingTax(monthly: number): number {
    if (monthly <= 20833) {
        return 0;
    }

    if (monthly <= 33333) {
        return (monthly - 20833) * 0.15;
    }

    if (monthly <= 66667) {
        return 1875 + (monthly - 33333) * 0.2;
    }

    if (monthly <= 166667) {
        return 8541.67 + (monthly - 66667) * 0.25;
    }

    return 33541.67 + (monthly - 166667) * 0.3;
}

/**
 * Final pay for a separation, computed from the employee record like Payroll
 * computes a payslip: basic pay up to the exit date, unused leave converted
 * to cash, prorated 13th month, minus statutory deductions and any advances.
 */
export function computeFinalPay(
    employee: Pick<OffboardingEmployee, 'id' | 'salary' | 'leave_balance'>,
    exitDate: string,
): DemoFinalPay {
    const dailyRate = employee.salary / 22;
    const month = Number(exitDate.slice(5, 7));
    const day = Number(exitDate.slice(8, 10));
    const basic = round2(day * dailyRate);
    const leaveConversion = round2(employee.leave_balance * dailyRate);
    const thirteenthMonth = round2((employee.salary * month) / 12);
    const gross = round2(basic + leaveConversion + thirteenthMonth);
    const sss = round2(Math.min(1125, gross * 0.045));
    const philhealth = round2(Math.min(2500, Math.max(250, gross * 0.025)));
    const pagibig = round2(Math.min(200, Math.max(100, gross * 0.02)));
    const tax = round2(withholdingTax(gross - sss - philhealth - pagibig));
    const deductions = round2(sss + philhealth + pagibig + tax);
    // Advances to recover from final pay: a carried cash advance for some
    // employees, plus the unpaid balance of any approved Benefits loans.
    const { outstandingFor } = useDemoLoans();
    const advances = round2(
        (employee.id % 5 === 0 ? dailyRate * 2 : 0) +
            outstandingFor(employee.id),
    );
    const net = round2(gross - deductions - advances);

    return {
        basic,
        leave_conversion: leaveConversion,
        thirteenth_month: thirteenthMonth,
        gross,
        sss,
        philhealth,
        pagibig,
        tax,
        deductions,
        advances,
        net,
    };
}

/** Ids for auto-created Disciplinary handoff cases (Module 9 → 10). */
const HANDOFF_BASE = 900000;

/**
 * A handoff case created automatically when an employee's disciplinary case
 * is escalated or marked as a dismissal recommendation. It lands in the
 * register as a Requested Termination, ready for the offboarding staff to
 * advance through clearance, final pay and completion — no manual setup.
 */
function handoffCaseFor(
    employee: OffboardingEmployee,
    flagged: boolean,
): DemoOffboardingCase | null {
    if (!flagged) {
        return null;
    }

    const today = new Date().toISOString().slice(0, 10);

    return {
        id: HANDOFF_BASE + employee.id,
        employee_id: employee.id,
        type: 'Termination',
        requested_by: 'HR / Management',
        requested_on: today,
        exit_date: today,
        reason: 'Dismissal recommended by Disciplinary Management — escalated case on file.',
        status: 'Requested',
        tasks: OFFBOARDING_CLEARANCE.map((task) => ({ ...task })),
    };
}

export function useDemoOffboarding(
    employees: OffboardingEmployee[],
    seeded: DemoOffboardingCase[],
    escalations: OffboardingEscalation[],
) {
    const added = ref<DemoOffboardingCase[]>(
        loadStored<DemoOffboardingCase[]>(ADDED_KEY, []),
    );
    const statusOverrides = ref<Record<number, DemoOffboardingStatus>>(
        loadStored<Record<number, DemoOffboardingStatus>>(STATUS_KEY, {}),
    );
    const taskOverrides = ref<Record<number, DemoClearanceTask[]>>(
        loadStored<Record<number, DemoClearanceTask[]>>(TASKS_KEY, {}),
    );
    const updates = ref<Record<number, Partial<DemoOffboardingCase>>>(
        loadStored<Record<number, Partial<DemoOffboardingCase>>>(
            UPDATES_KEY,
            {},
        ),
    );
    const removed = ref<number[]>(loadStored<number[]>(REMOVED_KEY, []));

    const flaggedIds = new Set(
        escalations.map((escalation) => escalation.employee_id),
    );

    /**
     * Auto-created handoff cases for employees with an escalated disciplinary
     * case who do not already have a separation case in the register.
     */
    const handoffCases = ref<DemoOffboardingCase[]>(
        employees
            .filter((employee) => flaggedIds.has(employee.id))
            .map((employee) => handoffCaseFor(employee, true))
            .filter((caseRow): caseRow is DemoOffboardingCase => caseRow !== null),
    );

    /** Effective status: an action override wins over the seeded value. */
    function statusFor(record: DemoOffboardingCase): DemoOffboardingStatus {
        return statusOverrides.value[record.id] ?? record.status;
    }

    /** Effective tasks: a toggle override wins over the seeded checklist. */
    function tasksFor(record: DemoOffboardingCase): DemoClearanceTask[] {
        return taskOverrides.value[record.id] ?? record.tasks;
    }

    /** Every case (seeded + session-added), enriched with the employee. */
    const rows = ref<DemoOffboardingRow[]>([]);

    function rebuild(): void {
        const all: DemoOffboardingCase[] = [
            ...seeded.filter((item) => !removed.value.includes(item.id)),
            ...added.value,
            // Auto-created Disciplinary handoffs land in the register too, so
            // the offboarding staff sees them without starting a case by hand.
            ...handoffCases.value.filter(
                (item) => !removed.value.includes(item.id),
            ),
        ];
        const out: DemoOffboardingRow[] = [];

        for (const record of all) {
            const employee = employees.find(
                (row) => row.id === record.employee_id,
            );

            if (!employee) {
                continue;
            }

            const effective = {
                ...record,
                ...(updates.value[record.id] ?? {}),
                status: statusFor(record),
            };
            const tasks = tasksFor(record);
            const done = tasks.filter((task) => task.done).length;

            out.push({
                ...effective,
                tasks,
                archived: effective.status === 'Completed',
                no: employee.no,
                name: employee.name,
                department: employee.department,
                position: employee.position,
                employment_type: employee.employment_type,
                salary: employee.salary,
                leave_balance: employee.leave_balance,
                progress:
                    tasks.length === 0
                        ? 0
                        : Math.round((done / tasks.length) * 100),
                finalPay: computeFinalPay(employee, effective.exit_date),
                flagged: flaggedIds.has(employee.id),
            });
        }

        rows.value = out;
    }

    rebuild();

    /** Next case id: above every seeded, session-added and handoff id. */
    function nextId(): number {
        const highest = [...seeded, ...added.value, ...handoffCases.value].reduce(
            (max, item) => Math.max(max, item.id),
            1000,
        );

        return highest + 1;
    }

    /** Open a separation — starts as Requested with an empty checklist. */
    function addCase(draft: DemoOffboardingDraft): DemoOffboardingCase {
        const record: DemoOffboardingCase = {
            id: nextId(),
            employee_id: draft.employee_id,
            type: draft.type,
            requested_by: draft.requested_by,
            requested_on: draft.requested_on,
            exit_date: draft.exit_date,
            reason: draft.reason,
            status: 'Requested',
            tasks: OFFBOARDING_CLEARANCE.map((task) => ({ ...task })),
        };

        added.value.unshift(record);
        saveStored(ADDED_KEY, added.value);
        rebuild();

        return record;
    }

    /** Edit a case's type, exit date or reason (session-persisted). */
    function updateCase(
        id: number,
        patch: Partial<
            Pick<DemoOffboardingCase, 'type' | 'exit_date' | 'reason'>
        >,
    ): void {
        updates.value[id] = { ...(updates.value[id] ?? {}), ...patch };
        saveStored(UPDATES_KEY, updates.value);
        rebuild();
    }

    /** Move a case one stage down the pipeline (session-persisted). */
    function advance(id: number): void {
        const order: DemoOffboardingStatus[] = [
            'Requested',
            'In Clearance',
            'Final Pay',
            'Completed',
        ];
        const record = [...seeded, ...added.value, ...handoffCases.value].find(
            (item) => item.id === id,
        );

        if (!record) {
            return;
        }

        const current = statusFor(record);
        const next = order[order.indexOf(current) + 1];

        if (!next) {
            return;
        }

        statusOverrides.value[id] = next;
        saveStored(STATUS_KEY, statusOverrides.value);
        rebuild();
    }

    /** Toggle one clearance task (session-persisted). */
    function toggleTask(caseId: number, index: number): void {
        const record = [...seeded, ...added.value, ...handoffCases.value].find(
            (item) => item.id === caseId,
        );

        if (!record) {
            return;
        }

        const tasks = tasksFor(record).map((task, taskIndex) =>
            taskIndex === index ? { ...task, done: !task.done } : { ...task },
        );

        taskOverrides.value[caseId] = tasks;
        saveStored(TASKS_KEY, taskOverrides.value);
        rebuild();
    }

    /** Withdraw a case from the register (session-persisted). */
    function remove(id: number): void {
        if (
            seeded.some((item) => item.id === id) ||
            handoffCases.value.some((item) => item.id === id)
        ) {
            removed.value.push(id);
            saveStored(REMOVED_KEY, removed.value);
        } else {
            added.value = added.value.filter((item) => item.id !== id);
            saveStored(ADDED_KEY, added.value);
        }

        rebuild();
    }

    /** Employees who do not have a case yet — eligible for a new separation. */
    const eligibleEmployees = computed<OffboardingEmployee[]>(() => {
        const withCase = new Set(rows.value.map((row) => row.employee_id));

        return employees.filter((employee) => !withCase.has(employee.id));
    });

    return {
        rows,
        eligibleEmployees,
        addCase,
        updateCase,
        advance,
        toggleTask,
        remove,
        computeFinalPay,
    };
}
