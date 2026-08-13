import { ref } from 'vue';
import type {
    DemoBenefitPlan,
    DemoEnrollment,
    DemoEnrollmentRow,
    DemoEnrollmentStatus,
} from '@/types';

/*
 * Benefits engine (Module 6). Every enrollment is enriched with the
 * employee's record and the plan's monthly cost:
 *
 *   Government plans (SSS / PhilHealth / Pag-IBIG) use the same rates and
 *   caps as the Payroll module, so benefits always agree with payslips.
 *   Company plans and allowances are fixed monthly amounts paid by the
 *   employer (employee share 0).
 *
 * Session-backed like every other demo store: added enrollments, Confirm and
 * Remove actions survive navigation in the same tab, gone when the tab
 * closes. No database.
 */

const ADDED_KEY = 'hris-demo-added-enrollments';
const STATUS_KEY = 'hris-demo-enrollment-statuses';
const REMOVED_KEY = 'hris-demo-removed-enrollments';

export type BenefitsEmployee = {
    id: number;
    no: string;
    name: string;
    department: string;
    position: string;
    salary: number;
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

export type EnrollmentDraft = {
    employee_id: number;
    plan_id: number;
    coverage: DemoEnrollment['coverage'];
    effective: string;
};

export function useDemoBenefits(
    employees: BenefitsEmployee[],
    plans: DemoBenefitPlan[],
    seeded: DemoEnrollment[],
) {
    const added = ref<DemoEnrollment[]>(
        loadStored<DemoEnrollment[]>(ADDED_KEY, []),
    );
    const statusOverrides = ref<Record<number, DemoEnrollmentStatus>>(
        loadStored<Record<number, DemoEnrollmentStatus>>(STATUS_KEY, {}),
    );
    const removed = ref<number[]>(loadStored<number[]>(REMOVED_KEY, []));

    const planById = (id: number): DemoBenefitPlan | undefined =>
        plans.find((plan) => plan.id === id);

    /**
     * Monthly employee / employer cost for a plan, derived from the salary so
     * government contributions match the payroll deductions exactly.
     */
    function costFor(
        planName: string,
        salary: number,
    ): { employee: number; employer: number } {
        switch (planName) {
            case 'SSS':
                return {
                    employee: round2(Math.min(1125, salary * 0.045)),
                    employer: round2(Math.min(2125, salary * 0.085)),
                };
            case 'PhilHealth':
                return {
                    employee: round2(
                        Math.min(2500, Math.max(250, salary * 0.025)),
                    ),
                    employer: round2(
                        Math.min(2500, Math.max(250, salary * 0.025)),
                    ),
                };
            case 'Pag-IBIG':
                return {
                    employee: round2(
                        Math.min(200, Math.max(100, salary * 0.02)),
                    ),
                    employer: round2(
                        Math.min(200, Math.max(100, salary * 0.02)),
                    ),
                };
            case 'HMO Health Insurance':
                return { employee: 0, employer: 2500 };
            case 'Rice Allowance':
                return { employee: 0, employer: 1500 };
            case 'Transportation Allowance':
                return { employee: 0, employer: 1000 };
            default:
                return { employee: 0, employer: 0 };
        }
    }

    /** Effective status: override wins over the seeded value. */
    function statusFor(enrollment: DemoEnrollment): DemoEnrollmentStatus {
        return statusOverrides.value[enrollment.id] ?? enrollment.status;
    }

    /** Every enrollment (seeded + session-added), enriched with record + cost. */
    const rows = ref<DemoEnrollmentRow[]>([]);

    function rebuild(): void {
        const all: DemoEnrollment[] = [
            ...seeded.filter((item) => !removed.value.includes(item.id)),
            ...added.value,
        ];
        const out: DemoEnrollmentRow[] = [];

        for (const enrollment of all) {
            const employee = employees.find(
                (row) => row.id === enrollment.employee_id,
            );
            const plan = planById(enrollment.plan_id);

            if (!employee || !plan) {
                continue;
            }

            const cost = costFor(plan.name, employee.salary);

            out.push({
                ...enrollment,
                status: statusFor(enrollment),
                employee_no: employee.no,
                employee_name: employee.name,
                department: employee.department,
                position: employee.position,
                plan: plan.name,
                plan_type: plan.type,
                employee_cost: cost.employee,
                employer_cost: cost.employer,
            });
        }

        rows.value = out;
    }

    rebuild();

    function nextId(): number {
        const highest = [...seeded, ...added.value].reduce(
            (max, item) => Math.max(max, item.id),
            1000,
        );

        return highest + 1;
    }

    /** Enroll an employee in a plan — starts as Pending, awaiting confirmation. */
    function addEnrollment(draft: EnrollmentDraft): DemoEnrollment {
        const enrollment: DemoEnrollment = {
            id: nextId(),
            employee_id: draft.employee_id,
            plan_id: draft.plan_id,
            coverage: draft.coverage,
            effective: draft.effective,
            status: 'Pending',
        };

        added.value.unshift(enrollment);
        saveStored(ADDED_KEY, added.value);
        rebuild();

        return enrollment;
    }

    /** Approve a Pending enrollment — benefits are now active (session). */
    function confirm(id: number): void {
        statusOverrides.value[id] = 'Enrolled';
        saveStored(STATUS_KEY, statusOverrides.value);
        rebuild();
    }

    /** Decline a Pending enrollment (session-persisted). */
    function decline(id: number): void {
        statusOverrides.value[id] = 'Declined';
        saveStored(STATUS_KEY, statusOverrides.value);
        rebuild();
    }

    /** Withdraw an enrollment (session-persisted). */
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

    /** Plans with their live enrollment counts and monthly employer cost. */
    function planSummary() {
        return plans.map((plan) => {
            const enrolled = rows.value.filter(
                (row) => row.plan_id === plan.id,
            );
            const employer = enrolled.reduce(
                (sum, row) => sum + row.employer_cost,
                0,
            );

            return {
                ...plan,
                enrolled: enrolled.length,
                employer_cost: round2(employer),
            };
        });
    }

    function formatMoney(value: number, decimals = 2): string {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        }).format(value);
    }

    return {
        rows,
        addEnrollment,
        confirm,
        decline,
        remove,
        planSummary,
        formatMoney,
    };
}
