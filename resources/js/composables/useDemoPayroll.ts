import { ref } from 'vue';
import { useDemoDtr } from '@/composables/useDemoDtr';
import { useDemoHolidays } from '@/composables/useDemoHolidays';
import type { DemoPayslip, DemoPayslipStatus } from '@/types';

/*
 * Payroll engine (Module 5). Every payslip is computed deterministically from
 * the other modules' data, so the numbers always add up:
 *
 *   gross = monthly salary + overtime pay (Attendance) − unpaid days
 *   unpaid days = absences (Attendance DTR) + no-work-no-pay declared
 *                 holidays (Holiday Picker)
 *   deductions = SSS + PhilHealth + Pag-IBIG + withholding tax
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

    function daysInMonth(period: string): number {
        const [year, month] = period.split('-').map(Number);

        return new Date(year, month, 0).getDate();
    }

    /** Declared no-work-no-pay holidays inside this period for a department. */
    function unpaidHolidayDays(period: string, department: string): number {
        return declaredHolidays.value.reduce((sum, holiday) => {
            if (holiday.pay !== 'No work, no pay (excused)') {
                return sum;
            }

            const applies =
                holiday.scope === 'all' || holiday.department === department;

            return (
                sum +
                (applies
                    ? holiday.dates.filter((date) => date.startsWith(period))
                          .length
                    : 0)
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

    function computePayslip(
        employee: PayrollEmployee,
        period: PayrollPeriod,
    ): DemoPayslip {
        const stats = rangeStats(
            employee.id,
            `${period.value}-01`,
            `${period.value}-${daysInMonth(period.value)}`,
        );
        const hourlyRate = employee.salary / 176;
        const dailyRate = employee.salary / 22;
        const otPay = round2(stats.otHours * hourlyRate * 1.25);
        // A declared no-work-no-pay holiday overrides the absence pattern on
        // the DTR card (day off, not absent), so it must not be double-counted.
        const holidayDays = unpaidHolidayDays(
            period.value,
            employee.department,
        );
        const unpaidDays =
            holidayDays + Math.max(0, stats.absentDays - holidayDays);
        const unpaidDeduction = round2(unpaidDays * dailyRate);
        const gross = round2(employee.salary + otPay - unpaidDeduction);
        const sss = round2(Math.min(1125, gross * 0.045));
        const philhealth = round2(Math.min(2500, Math.max(250, gross * 0.025)));
        const pagibig = round2(Math.min(200, Math.max(100, gross * 0.02)));
        const tax = round2(withholdingTax(gross - sss - philhealth - pagibig));
        const deductions = round2(sss + philhealth + pagibig + tax);
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
            basic: employee.salary,
            otHours: stats.otHours,
            otPay,
            unpaidDays,
            unpaidDeduction,
            gross,
            sss,
            philhealth,
            pagibig,
            tax,
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

        return employees.map((employee) => computePayslip(employee, period));
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
