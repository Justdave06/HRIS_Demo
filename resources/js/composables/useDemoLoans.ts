import { ref } from 'vue';
import type {
    DemoLoanApplication,
    DemoLoanStatus,
    DemoLoanType,
} from '@/types';

/*
 * Loan applications (Benefits module + Employee Portal).
 *
 * The employee files an application from the portal; HR reviews it in the
 * Benefits module (Approve / Decline). Approved loans interconnect with the
 * rest of the system:
 *
 *   Payroll      — the monthly amortization is deducted from each payslip
 *   Offboarding  — the unpaid balance is recovered from final pay
 *
 * Session-backed like every other demo store: applications and decisions
 * survive navigation in the same tab, gone when the tab closes. No database.
 */
const STORAGE_KEY = 'hris-demo-loan-applications';

export const LOAN_TYPES: DemoLoanType[] = [
    'SSS Salary Loan',
    'Pag-IBIG Multi-Purpose',
    'Company Loan',
    'Cash Advance',
];

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

const applications = ref<DemoLoanApplication[]>(
    loadStored<DemoLoanApplication[]>(STORAGE_KEY, []),
);

function round2(value: number): number {
    return Math.round(value * 100) / 100;
}

function todayIso(): string {
    return new Date().toISOString().slice(0, 10);
}

export type LoanDraft = {
    employee_id: number;
    type: DemoLoanType;
    amount: number;
    purpose: string;
    terms: number;
};

export function useDemoLoans() {
    function nextId(): number {
        const highest = applications.value.reduce(
            (max, application) => Math.max(max, application.id),
            1000,
        );

        return highest + 1;
    }

    /** File a loan application — starts as Pending, awaiting HR review. */
    function applyLoan(draft: LoanDraft): DemoLoanApplication {
        const amount = Math.max(0, Number(draft.amount) || 0);
        const terms = Math.max(1, Math.round(Number(draft.terms) || 1));
        const application: DemoLoanApplication = {
            id: nextId(),
            employee_id: draft.employee_id,
            type: draft.type,
            amount,
            purpose: draft.purpose.trim() || 'Loan application',
            terms,
            monthly: round2(amount / terms),
            applied_on: todayIso(),
            status: 'Pending',
            decided_on: null,
        };

        applications.value.unshift(application);
        saveStored(STORAGE_KEY, applications.value);

        return application;
    }

    /** Approve or decline an application (session-persisted). */
    function setStatus(id: number, status: DemoLoanStatus): void {
        applications.value = applications.value.map((application) =>
            application.id === id
                ? { ...application, status, decided_on: todayIso() }
                : application,
        );
        saveStored(STORAGE_KEY, applications.value);
    }

    /** All of one employee's applications, newest first. */
    function applicationsFor(employeeId: number): DemoLoanApplication[] {
        return applications.value.filter(
            (application) => application.employee_id === employeeId,
        );
    }

    /** Monthly loan amortization for an employee (approved loans only). */
    function monthlyDeductionFor(employeeId: number): number {
        return applications.value.reduce(
            (sum, application) =>
                application.employee_id === employeeId &&
                application.status === 'Approved'
                    ? sum + application.monthly
                    : sum,
            0,
        );
    }

    /** Unpaid loan balance for an employee — recovered from final pay. */
    function outstandingFor(employeeId: number): number {
        return applications.value.reduce(
            (sum, application) =>
                application.employee_id === employeeId &&
                application.status === 'Approved'
                    ? sum + application.amount
                    : sum,
            0,
        );
    }

    return {
        applications,
        applyLoan,
        setStatus,
        applicationsFor,
        monthlyDeductionFor,
        outstandingFor,
    };
}
