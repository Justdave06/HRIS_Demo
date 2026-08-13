<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import {
    FileBarChart2,
    FileSpreadsheet,
    Printer,
    Search,
    Wallet,
    X,
} from '@lucide/vue';
import { computed, ref } from 'vue';
import { toast } from 'vue-sonner';
import AttendanceReportDocument from '@/components/demo/AttendanceReportDocument.vue';
import RecordPrintModal from '@/components/demo/RecordPrintModal.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useDemoEmployees } from '@/composables/useDemoEmployees';
import { useDemoPayroll } from '@/composables/useDemoPayroll';
import type {
    PayrollEmployee,
    PayrollPeriod,
} from '@/composables/useDemoPayroll';
import type { DemoPayslip } from '@/types';

const props = defineProps<{
    employees: PayrollEmployee[];
    periods: PayrollPeriod[];
}>();

// Employees added in Employee Management join payroll too (their salary was
// set at hire), so a payslip run covers the whole directory.
const { addedEmployees } = useDemoEmployees();

const allEmployees = computed<PayrollEmployee[]>(() => [
    ...props.employees,
    ...addedEmployees.value.map((employee) => ({
        id: employee.id,
        no: employee.no,
        name: employee.name,
        department: employee.department,
        position: employee.position,
        salary: employee.salary,
    })),
]);

const { payslipsFor, markPaid, runPayroll, formatMoney } = useDemoPayroll(
    allEmployees.value,
    props.periods,
);

/* ------------------------------------------------------------------ */
/* Filters                                                            */
/* ------------------------------------------------------------------ */

const period = ref(props.periods[props.periods.length - 1]?.value ?? '');
const statusFilter = ref('all');
const search = ref('');

const payslips = computed(() => payslipsFor(period.value));

const filtered = computed(() => {
    const term = search.value.trim().toLowerCase();

    return payslips.value.filter(
        (row) =>
            (statusFilter.value === 'all' ||
                row.status === statusFilter.value) &&
            (term === '' ||
                row.name.toLowerCase().includes(term) ||
                row.no.toLowerCase().includes(term)),
    );
});

const totals = computed(() => ({
    gross: filtered.value.reduce((sum, row) => sum + row.gross, 0),
    deductions: filtered.value.reduce((sum, row) => sum + row.deductions, 0),
    net: filtered.value.reduce((sum, row) => sum + row.net, 0),
}));

const statusTone: Record<string, string> = {
    Paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
};

/* ------------------------------------------------------------------ */
/* Payslip card (print-ready)                                          */
/* ------------------------------------------------------------------ */

const selected = ref<DemoPayslip | null>(null);

function openPayslip(row: DemoPayslip): void {
    selected.value = row;
}

function printPayslip(): void {
    window.print();
}

function markRowPaid(row: DemoPayslip): void {
    markPaid(row.period, row.employee_id);
    toast.success(`${row.name}'s payslip marked as paid (${row.periodLabel})`);
}

function runPayrollNow(): void {
    const count = runPayroll(period.value, payslips.value);

    toast.success(
        count > 0
            ? `Payroll run complete — ${count} payslip${count === 1 ? '' : 's'} marked as paid`
            : 'All payslips for this period are already paid.',
    );
}

/* ------------------------------------------------------------------ */
/* Generate / export                                                   */
/* ------------------------------------------------------------------ */

const showPreview = ref(false);

const reportRows = computed(() =>
    filtered.value.map((row, index) => ({
        no: index + 1,
        name: row.name,
        department: row.department,
        basic: row.basic,
        ot: row.otPay,
        deductions: row.deductions,
        net: row.net,
        status: row.status,
    })),
);

const periodLabel = computed(
    () => props.periods.find((row) => row.value === period.value)?.label ?? '',
);

function exportExcel(): void {
    const headers = [
        'No.',
        'Employee',
        'Department',
        'Basic Pay',
        'Overtime Pay',
        'Deductions',
        'Net Pay',
        'Status',
    ];
    const rows = reportRows.value.map((row) => [
        row.no,
        row.name,
        row.department,
        row.basic,
        row.ot,
        row.deductions,
        row.net,
        row.status,
    ]);
    const csv =
        '\uFEFF' +
        [headers, ...rows]
            .map((row) =>
                row
                    .map((cell) => `"${String(cell).replaceAll('"', '""')}"`)
                    .join(','),
            )
            .join('\n');
    const url = URL.createObjectURL(
        new Blob([csv], { type: 'text/csv;charset=utf-8;' }),
    );
    const link = document.createElement('a');

    link.href = url;
    link.download = `payroll-${period.value}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
}
</script>

<template>
    <Head title="Payslips — Payroll Management" />

    <div class="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <!-- Header -->
        <div
            class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
            <div>
                <h1 class="text-2xl font-bold tracking-tight text-slate-900">
                    Payslips
                </h1>
                <p class="mt-1 text-sm text-slate-500">
                    Overtime comes from Attendance, unpaid days from declared
                    holidays, and deductions from government contributions.
                </p>
            </div>
            <div class="flex flex-wrap gap-2">
                <Button variant="outline" @click="showPreview = true">
                    <FileBarChart2 class="size-4" />
                    Generate report
                </Button>
                <Button
                    class="bg-blue-600 hover:bg-blue-700"
                    @click="exportExcel"
                >
                    <FileSpreadsheet class="size-4" />
                    Export to Excel
                </Button>
                <Button
                    class="bg-blue-600 hover:bg-blue-700"
                    @click="runPayrollNow"
                >
                    <Wallet class="size-4" />
                    Run payroll
                </Button>
            </div>
        </div>

        <!-- Filters -->
        <div
            class="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
        >
            <Select v-model="period">
                <SelectTrigger class="w-44">
                    <SelectValue placeholder="Pay period" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem
                        v-for="row in periods"
                        :key="row.value"
                        :value="row.value"
                    >
                        {{ row.label }}
                    </SelectItem>
                </SelectContent>
            </Select>

            <Select v-model="statusFilter">
                <SelectTrigger class="w-40">
                    <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
            </Select>

            <div class="relative w-64">
                <Search
                    class="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                    v-model="search"
                    placeholder="Search name or employee ID…"
                    class="pl-9"
                />
            </div>

            <div
                class="ml-auto flex items-center gap-4 text-xs text-muted-foreground tabular-nums"
            >
                <span>
                    Gross
                    <span class="ml-1 font-semibold text-slate-900">
                        {{ formatMoney(totals.gross, 0) }}
                    </span>
                </span>
                <span>
                    Deductions
                    <span class="ml-1 font-semibold text-slate-900">
                        {{ formatMoney(totals.deductions, 0) }}
                    </span>
                </span>
                <span>
                    Net
                    <span class="ml-1 font-semibold text-blue-700">
                        {{ formatMoney(totals.net, 0) }}
                    </span>
                </span>
            </div>
        </div>

        <!-- Payslip table -->
        <div class="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div class="flex items-center justify-between border-b px-5 py-4">
                <h2 class="font-semibold text-slate-900">
                    {{ periodLabel }} payroll
                </h2>
                <span
                    class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                >
                    {{ filtered.length }} payslip{{
                        filtered.length === 1 ? '' : 's'
                    }}
                </span>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full min-w-[900px] text-sm">
                    <thead>
                        <tr
                            class="border-b text-left text-xs tracking-wide text-muted-foreground uppercase"
                        >
                            <th class="px-4 py-3 font-medium">No.</th>
                            <th class="px-4 py-3 font-medium">Employee</th>
                            <th class="px-4 py-3 text-right font-medium">
                                Basic pay
                            </th>
                            <th class="px-4 py-3 text-right font-medium">
                                OT pay
                            </th>
                            <th class="px-4 py-3 text-right font-medium">
                                Deductions
                            </th>
                            <th class="px-4 py-3 text-right font-medium">
                                Net pay
                            </th>
                            <th class="px-4 py-3 font-medium">Status</th>
                            <th class="px-4 py-3 text-right font-medium">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(row, index) in filtered"
                            :key="`${row.period}-${row.employee_id}`"
                            class="border-b transition-colors last:border-0 hover:bg-muted/40"
                        >
                            <td
                                class="px-4 py-3 text-muted-foreground tabular-nums"
                            >
                                {{ index + 1 }}
                            </td>
                            <td class="px-4 py-3">
                                <p class="font-medium text-slate-900">
                                    {{ row.name }}
                                </p>
                                <p class="text-xs text-muted-foreground">
                                    {{ row.position }} ·
                                    {{ row.department }}
                                </p>
                            </td>
                            <td
                                class="px-4 py-3 text-right text-muted-foreground tabular-nums"
                            >
                                {{ formatMoney(row.basic) }}
                            </td>
                            <td
                                class="px-4 py-3 text-right text-muted-foreground tabular-nums"
                            >
                                {{ formatMoney(row.otPay) }}
                            </td>
                            <td
                                class="px-4 py-3 text-right text-muted-foreground tabular-nums"
                            >
                                {{ formatMoney(row.deductions) }}
                            </td>
                            <td
                                class="px-4 py-3 text-right font-semibold text-slate-900 tabular-nums"
                            >
                                {{ formatMoney(row.net) }}
                            </td>
                            <td class="px-4 py-3">
                                <span
                                    class="inline-flex rounded-full border px-2 py-0.5 text-xs font-medium"
                                    :class="statusTone[row.status]"
                                >
                                    {{ row.status }}
                                </span>
                            </td>
                            <td class="px-4 py-3 text-right">
                                <div class="flex justify-end gap-2">
                                    <Button
                                        size="sm"
                                        class="bg-blue-600 hover:bg-blue-700"
                                        @click="openPayslip(row)"
                                    >
                                        Payslip
                                    </Button>
                                    <Button
                                        v-if="row.status === 'Pending'"
                                        variant="outline"
                                        size="sm"
                                        class="text-slate-600 shadow-none hover:bg-slate-50 hover:text-slate-900"
                                        @click="markRowPaid(row)"
                                    >
                                        Mark paid
                                    </Button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="filtered.length === 0">
                            <td
                                colspan="8"
                                class="px-4 py-10 text-center text-sm text-muted-foreground"
                            >
                                No payslips match the selected filters.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Generate report preview -->
    <RecordPrintModal
        v-if="showPreview"
        :heading="`Payroll Summary — ${periodLabel} · ${reportRows.length} payslips`"
        subtitle="Official payroll document · ready to print"
        @close="showPreview = false"
    >
        <AttendanceReportDocument
            title="Payroll Summary Report"
            :period="periodLabel"
            system="Payroll Management System"
            :columns="[
                { key: 'no', label: 'No.' },
                { key: 'name', label: 'Employee' },
                { key: 'department', label: 'Department' },
                { key: 'basic', label: 'Basic Pay', numeric: true },
                { key: 'ot', label: 'Overtime Pay', numeric: true },
                { key: 'deductions', label: 'Deductions', numeric: true },
                { key: 'net', label: 'Net Pay', numeric: true },
                { key: 'status', label: 'Status' },
            ]"
            :rows="reportRows"
            note="Overtime hours come from Attendance, unpaid days from declared holidays, and statutory deductions (SSS, PhilHealth, Pag-IBIG, withholding tax) are computed per payslip."
        />
    </RecordPrintModal>

    <!-- Print-ready payslip card -->
    <Teleport to="body">
        <div
            v-if="selected"
            id="payslip-overlay"
            class="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm sm:p-8"
        >
            <div class="mx-auto max-w-3xl">
                <div
                    class="sticky top-0 z-10 flex items-center justify-between rounded-t-2xl border-b border-slate-200 bg-white px-5 py-4 print:hidden"
                >
                    <div>
                        <h3 class="text-base font-bold text-slate-900">
                            Payslip — {{ selected.name }}
                        </h3>
                        <p class="text-xs text-muted-foreground">
                            {{ selected.periodLabel }} · ready to print
                        </p>
                    </div>
                    <div class="flex gap-2">
                        <Button variant="outline" @click="selected = null">
                            <X class="size-4" />
                            Close
                        </Button>
                        <Button
                            class="bg-blue-600 hover:bg-blue-700"
                            @click="printPayslip"
                        >
                            <Printer class="size-4" />
                            Print
                        </Button>
                    </div>
                </div>

                <!-- The payslip sheet -->
                <div
                    id="payslip-sheet"
                    class="rounded-b-2xl bg-white px-6 py-8 shadow-2xl sm:px-10"
                >
                    <div class="text-center">
                        <p
                            class="text-xs font-bold tracking-widest text-slate-700 uppercase"
                        >
                            Republic of the Philippines
                        </p>
                        <p class="mt-1 text-lg font-black tracking-tight">
                            DARBC HRIS
                        </p>
                        <p class="text-xs text-slate-500">
                            Payroll Management System
                        </p>
                        <p class="text-xs text-slate-500">
                            Human Resources Department
                        </p>
                    </div>

                    <div class="mt-6 border-y-2 border-slate-800 py-3">
                        <h2
                            class="text-center text-xl font-black tracking-widest uppercase"
                        >
                            Payslip
                        </h2>
                        <p class="mt-1 text-center text-xs text-slate-600">
                            Pay period: {{ selected.periodLabel }} ·
                            {{ selected.status }}
                        </p>
                    </div>

                    <!-- Employee info -->
                    <div
                        class="mt-6 grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:grid-cols-3"
                    >
                        <p class="text-xs text-slate-500 uppercase">Employee</p>
                        <p class="col-span-2 font-semibold text-slate-900">
                            {{ selected.name }}
                        </p>
                        <p class="text-xs text-slate-500 uppercase">
                            Employee No.
                        </p>
                        <p class="col-span-2 text-slate-700 tabular-nums">
                            {{ selected.no }}
                        </p>
                        <p class="text-xs text-slate-500 uppercase">Position</p>
                        <p class="col-span-2 text-slate-700">
                            {{ selected.position }}
                        </p>
                        <p class="text-xs text-slate-500 uppercase">
                            Department
                        </p>
                        <p class="col-span-2 text-slate-700">
                            {{ selected.department }}
                        </p>
                    </div>

                    <!-- Earnings & deductions -->
                    <div class="mt-6 grid gap-6 sm:grid-cols-2">
                        <div>
                            <h4
                                class="border-b border-slate-800 pb-1 text-xs font-black tracking-widest uppercase"
                            >
                                Earnings
                            </h4>
                            <div
                                class="mt-2 space-y-1.5 text-sm text-slate-700"
                            >
                                <div class="flex items-center justify-between">
                                    <span>Basic pay</span>
                                    <span class="tabular-nums">
                                        {{ formatMoney(selected.basic) }}
                                    </span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span>
                                        Overtime pay ({{ selected.otHours }}
                                        hrs × 125%)
                                    </span>
                                    <span class="tabular-nums">
                                        {{ formatMoney(selected.otPay) }}
                                    </span>
                                </div>
                                <div
                                    v-if="selected.unpaidDays > 0"
                                    class="flex items-center justify-between text-red-600"
                                >
                                    <span>
                                        Unpaid absences ({{
                                            selected.unpaidDays
                                        }}
                                        day{{
                                            selected.unpaidDays === 1
                                                ? ''
                                                : 's'
                                        }})
                                    </span>
                                    <span class="tabular-nums">
                                        −{{
                                            formatMoney(
                                                selected.unpaidDeduction,
                                            )
                                        }}
                                    </span>
                                </div>
                                <div
                                    class="mt-1 flex items-center justify-between border-t border-slate-200 pt-1.5 font-semibold text-slate-900"
                                >
                                    <span>Gross pay</span>
                                    <span class="tabular-nums">
                                        {{ formatMoney(selected.gross) }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4
                                class="border-b border-slate-800 pb-1 text-xs font-black tracking-widest uppercase"
                            >
                                Deductions
                            </h4>
                            <div
                                class="mt-2 space-y-1.5 text-sm text-slate-700"
                            >
                                <div class="flex items-center justify-between">
                                    <span>SSS</span>
                                    <span class="tabular-nums">
                                        {{ formatMoney(selected.sss) }}
                                    </span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span>PhilHealth</span>
                                    <span class="tabular-nums">
                                        {{ formatMoney(selected.philhealth) }}
                                    </span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span>Pag-IBIG</span>
                                    <span class="tabular-nums">
                                        {{ formatMoney(selected.pagibig) }}
                                    </span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span>Withholding tax</span>
                                    <span class="tabular-nums">
                                        {{ formatMoney(selected.tax) }}
                                    </span>
                                </div>
                                <div
                                    v-if="selected.loan > 0"
                                    class="flex items-center justify-between"
                                >
                                    <span>Loan amortization (Benefits)</span>
                                    <span class="tabular-nums">
                                        {{ formatMoney(selected.loan) }}
                                    </span>
                                </div>
                                <div
                                    class="mt-1 flex items-center justify-between border-t border-slate-200 pt-1.5 font-semibold text-slate-900"
                                >
                                    <span>Total deductions</span>
                                    <span class="tabular-nums">
                                        {{ formatMoney(selected.deductions) }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Net pay -->
                    <div
                        class="mt-6 flex items-center justify-between rounded-lg border-2 border-slate-800 bg-slate-50 px-4 py-3"
                    >
                        <span
                            class="text-sm font-black tracking-widest uppercase"
                        >
                            Net pay
                        </span>
                        <span
                            class="text-xl font-black text-slate-900 tabular-nums"
                        >
                            {{ formatMoney(selected.net) }}
                        </span>
                    </div>

                    <!-- Signatures -->
                    <div class="mt-10 grid grid-cols-2 gap-10 text-sm">
                        <div>
                            <p class="font-semibold text-slate-900">
                                {{ 'Carla Mendoza' }}
                            </p>
                            <p class="text-xs text-slate-500">
                                Prepared by · Payroll Officer
                            </p>
                            <div class="mt-8 border-t border-slate-400"></div>
                        </div>
                        <div>
                            <p class="font-semibold text-slate-900">
                                {{ selected.name }}
                            </p>
                            <p class="text-xs text-slate-500">
                                Received by · {{ selected.no }}
                            </p>
                            <div class="mt-8 border-t border-slate-400"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<style>
/* Print only the payslip sheet; hide the rest of the app. */
@media print {
    body * {
        visibility: hidden;
    }

    #payslip-overlay {
        position: static !important;
        inset: auto !important;
        z-index: auto !important;
        overflow: visible !important;
        background: transparent !important;
        backdrop-filter: none !important;
    }

    #payslip-sheet,
    #payslip-sheet * {
        visibility: visible;
    }

    #payslip-sheet {
        position: static !important;
        max-width: none !important;
        box-shadow: none !important;
        margin: 0 auto !important;
        border-radius: 0 !important;
    }
}
</style>
