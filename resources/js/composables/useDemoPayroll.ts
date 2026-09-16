import { ref } from 'vue';
import { useDemoDtr } from '@/composables/useDemoDtr';
import { useDemoHolidays } from '@/composables/useDemoHolidays';
import { hasDeductions, useDemoLoans } from '@/composables/useDemoLoans';
import type { DemoPayslip, DemoPayslipStatus } from '@/types';

/*
 * Payroll engine (Module 5). Every payslip is computed deterministically from
 * the other modules' data, so the numbers always add up:
 *
 *   gross = monthly salary + overtime pay (Attendance) − unpaid days
 *   unpaid days = absences (Attendance DTR) + no-work-no-pay declared
 *                 holidays (Holiday Picker)
 *   deductions = SSS + PhilHealth + Pag-IBIG + withholding tax + loan
 *                 amortization (approved Benefits loans)
 *   net = gross − deductions
 *
 * Session-backed like every other demo store: marking a payslip Paid (or
 * running payroll) survives navigation in the same tab, gone when the tab
 * closes. No database.
 */

const PAID_KEY = 'hris-demo-paid-payslips';

export type PayrollEmployee = {
    id: number;
    no: string;
    name: string;
    department: string;
    position: string;
    salary: number;
    /** ISO start date — no pay, OT or absences before this day. */
    hire_date?: string;
};

export type PayrollPeriod = {
    value: string;
    label: string;
    status: DemoPayslipStatus;
};

function loadPaid(): Record<string, boolean> {
    if (typeof window === 'undefined') {
        return {};
    }

    try {
        const raw = window.sessionStorage.getItem(PAID_KEY);

        return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
    } catch {
        return {};
    }
}

function savePaid(value: Record<string, boolean>): void {
    if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(PAID_KEY, JSON.stringify(value));
    }
}

function round2(value: number): number {
    return Math.round(value * 100) / 100;
}

export function useDemoPayroll(
    employees: PayrollEmployee[],
    periods: PayrollPeriod[],
) {
    const paid = ref<Record<string, boolean>>(loadPaid());
    const { rangeStats } = useDemoDtr();
    const { declaredHolidays } = useDemoHolidays();
    // Approved Benefits loans deduct their monthly amortization from payslips.
    const { monthlyDeductionFor } = useDemoLoans();

    function daysInMonth(period: string): number {
        const [year, month] = period.split('-').map(Number);

        return new Date(year, month, 0).getDate();
    }

    /** Declared no-work-no-pay holidays inside this period for a department.
     *  Days before the hire date don't count — the employee wasn't employed. */
    function unpaidHolidayDays(
        period: string,
        department: string,
        startDay = 1,
    ): number {
        return declaredHolidays.value.reduce((sum, holiday) => {
            if (holiday.pay !== 'No work, no pay (excused)') {
                return sum;
            }

            const applies =
                holiday.scope === 'all' || holiday.department === department;

            if (!applies) {
                return sum;
            }

            return (
                sum +
                holiday.dates.filter((date) => {
                    if (!date.startsWith(period)) {
                        return false;
                    }

                    return Number(date.slice(8, 10)) >= startDay;
                }).length
            );
        }, 0);
    }

    /** Monthly withholding tax (BIR monthly bracket). */
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
     * Hired mid-period? Pay runs only from the hire date: earlier periods
     * return null (no payslip at all) and the hire month is prorated from
     * the daily rate. Absences and overtime are also only counted on/after
     * the hire date, so a fresh employee is never docked for days they
     * weren't employed yet.
     */
    function hireBounds(
        employee: PayrollEmployee,
        period: PayrollPeriod,
    ): { start: number; end: number } | null {
        const days = daysInMonth(period.value);

        if (!employee.hire_date) {
            return { start: 1, end: days };
        }

        const hireMonth = employee.hire_date.slice(0, 7);

        // Hired after this period — no payslip for it at all.
        if (hireMonth > period.value) {
            return null;
        }

        // Hired before this period — full month.
        if (hireMonth < period.value) {
            return { start: 1, end: days };
        }

        // Hired during this period — count only the days from the hire date.
        return { start: new Date(`${employee.hire_date}T00:00:00`).getDate(), end: days };
    }

    function computePayslip(
        employee: PayrollEmployee,
        period: PayrollPeriod,
    ): DemoPayslip | null {
        // A new employee has no Benefits activity yet (no loan filed, no plan
        // enrolled), so nothing is deducted — net equals gross. Statutory
        // contributions (SSS, PhilHealth, Pag-IBIG, tax) start once they
        // apply for a benefit or loan, from the next payslip onward.
        const hasDeductionLines = hasDeductions(employee.id);
        const bounds = hireBounds(employee, period);

        if (bounds === null) {
            return null; // Not hired yet — no payslip for this period.
        }

        const monthDays = daysInMonth(period.value);
        const hourlyRate = employee.salary / 176;
        const dailyRate = employee.salary / 22;
        // Attendance patterns only count on/after the hire date, so a
        // mid-month hire is neither paid nor docked for earlier days.
        const stats = rangeStats(
            employee.id,
            `${period.value}-${String(Math.max(1, bounds.start)).padStart(2, '0')}`,
            `${period.value}-${String(monthDays).padStart(2, '0')}`,
        );
        const otPay = round2(stats.otHours * hourlyRate * 1.25);
        // A declared no-work-no-pay holiday overrides the absence pattern on
        // the DTR card (day off, not absent), so it must not be double-counted.
        const holidayDays = unpaidHolidayDays(
            period.value,
            employee.department,
            bounds.start,
        );
        const unpaidDays =
            holidayDays + Math.max(0, stats.absentDays - holidayDays);
        const unpaidDeduction = round2(unpaidDays * dailyRate);
        // Hired mid-month: basic pay is prorated from the daily rate for the
        // days from hire to month end (hired on the 1st ⇒ full salary).
        const basic =
            bounds.start > 1
                ? round2(dailyRate * (monthDays - bounds.start + 1))
                : employee.salary;
        const gross = round2(basic + otPay - unpaidDeduction);
        const sss = hasDeductionLines
            ? round2(Math.min(1125, gross * 0.045))
            : 0;
        const philhealth = hasDeductionLines
            ? round2(Math.min(2500, Math.max(250, gross * 0.025)))
            : 0;
        const pagibig = hasDeductionLines
            ? round2(Math.min(200, Math.max(100, gross * 0.02)))
            : 0;
        const tax = hasDeductionLines
            ? round2(withholdingTax(gross - sss - philhealth - pagibig))
            : 0;
        const loan = hasDeductionLines
            ? round2(monthlyDeductionFor(employee.id))
            : 0;
        const deductions = round2(sss + philhealth + pagibig + tax + loan);
        const net = round2(gross - deductions);
        const isPaid = paid.value[`${period.value}:${employee.id}`];

        return {
            period: period.value,
            periodLabel: period.label,
            employee_id: employee.id,
            no: employee.no,
            name: employee.name,
            department: employee.department,
            position: employee.position,
            basic,
            otHours: stats.otHours,
            otPay,
            unpaidDays,
            unpaidDeduction,
            gross,
            sss,
            philhealth,
            pagibig,
            tax,
            loan,
            deductions,
            net,
            status: isPaid ? 'Paid' : period.status,
        };
    }

    /** Payslips for every employee in a period, ready for the table + reports. */
    function payslipsFor(periodValue: string): DemoPayslip[] {
        const period =
            periods.find((row) => row.value === periodValue) ??
            periods[periods.length - 1];

        return employees
            .map((employee) => computePayslip(employee, period))
            .filter((row): row is DemoPayslip => row !== null);
    }

    /** Mark one payslip as Paid (session-persisted). */
    function markPaid(period: string, employeeId: number): void {
        paid.value[`${period}:${employeeId}`] = true;
        savePaid(paid.value);
    }

    /** Run payroll for a period: every Pending payslip becomes Paid. */
    function runPayroll(period: string, payslips: DemoPayslip[]): number {
        let count = 0;

        for (const payslip of payslips) {
            if (payslip.status === 'Pending') {
                paid.value[`${period}:${payslip.employee_id}`] = true;
                count += 1;
            }
        }

        savePaid(paid.value);

        return count;
    }

    /** Peso formatting, e.g. ₱42,000.00 (or whole pesos when decimals = 0). */
    function formatMoney(value: number, decimals = 2): string {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        }).format(value);
    }

    return { payslipsFor, markPaid, runPayroll, formatMoney };
}
