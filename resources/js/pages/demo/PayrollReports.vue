<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { FileBarChart2, FileSpreadsheet, Search } from '@lucide/vue';
import { computed, ref } from 'vue';
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

// Employees added in Employee Management join payroll too.
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

const { payslipsFor, formatMoney } = useDemoPayroll(
    allEmployees.value,
    props.periods,
);

/* ------------------------------------------------------------------ */
/* Report type + filters                                               */
/* ------------------------------------------------------------------ */

const reportTypes = [
    { value: 'summary', label: 'Payroll Summary Report' },
    { value: 'register', label: 'Payslip Register' },
    { value: 'deductions', label: 'Deductions Summary' },
    { value: 'departments', label: 'Department Cost Report' },
] as const;

type ReportType = (typeof reportTypes)[number]['value'];

const reportType = ref<ReportType>('summary');
const period = ref(props.periods[props.periods.length - 1]?.value ?? '');
const search = ref('');

const payslips = computed(() => payslipsFor(period.value));

const term = computed(() => search.value.trim().toLowerCase());

const periodLabel = computed(
    () => props.periods.find((row) => row.value === period.value)?.label ?? '',
);

const match = (row: DemoPayslip): boolean =>
    term.value === '' ||
    row.name.toLowerCase().includes(term.value) ||
    row.no.toLowerCase().includes(term.value) ||
    row.department.toLowerCase().includes(term.value);

const summaryRows = computed(() =>
    payslips.value.filter(match).map((row, index) => ({
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

const registerRows = computed(() =>
    payslips.value.filter(match).map((row, index) => ({
        no: index + 1,
        name: row.name,
        position: row.position,
        department: row.department,
        gross: row.gross,
        net: row.net,
        status: row.status,
    })),
);

const deductionRows = computed(() =>
    payslips.value.filter(match).map((row, index) => ({
        no: index + 1,
        name: row.name,
        sss: row.sss,
        philhealth: row.philhealth,
        pagibig: row.pagibig,
        tax: row.tax,
        total: row.deductions,
    })),
);

const departmentRows = computed(() => {
    const byDepartment = new Map<string, DemoPayslip[]>();

    for (const row of payslips.value) {
        const list = byDepartment.get(row.department) ?? [];

        list.push(row);
        byDepartment.set(row.department, list);
    }

    return [...byDepartment.entries()]
        .map(([department, rows], index) => {
            const gross = rows.reduce((sum, row) => sum + row.gross, 0);
            const net = rows.reduce((sum, row) => sum + row.net, 0);

            return {
                no: index + 1,
                department,
                employees: rows.length,
                gross: Math.round(gross * 100) / 100,
                net: Math.round(net * 100) / 100,
                average: Math.round((net / rows.length) * 100) / 100,
            };
        })
        .filter(
            (row) =>
                term.value === '' ||
                row.department.toLowerCase().includes(term.value),
        )
        .sort((a, b) => b.net - a.net);
});

/* ------------------------------------------------------------------ */
/* Generate / export                                                   */
/* ------------------------------------------------------------------ */

const showPreview = ref(false);

const documentColumns = computed<
    { key: string; label: string; numeric?: boolean }[]
>(() => {
    if (reportType.value === 'summary') {
        return [
            { key: 'no', label: 'No.' },
            { key: 'name', label: 'Employee' },
            { key: 'department', label: 'Department' },
            { key: 'basic', label: 'Basic', numeric: true },
            { key: 'ot', label: 'OT Pay', numeric: true },
            { key: 'deductions', label: 'Deductions', numeric: true },
            { key: 'net', label: 'Net', numeric: true },
            { key: 'status', label: 'Status' },
        ];
    }

    if (reportType.value === 'register') {
        return [
            { key: 'no', label: 'No.' },
            { key: 'name', label: 'Employee' },
            { key: 'position', label: 'Position' },
            { key: 'department', label: 'Department' },
            { key: 'gross', label: 'Gross', numeric: true },
            { key: 'net', label: 'Net', numeric: true },
            { key: 'status', label: 'Status' },
        ];
    }

    if (reportType.value === 'deductions') {
        return [
            { key: 'no', label: 'No.' },
            { key: 'name', label: 'Employee' },
            { key: 'sss', label: 'SSS', numeric: true },
            { key: 'philhealth', label: 'PhilHealth', numeric: true },
            { key: 'pagibig', label: 'Pag-IBIG', numeric: true },
            { key: 'tax', label: 'W/H Tax', numeric: true },
            { key: 'total', label: 'Total', numeric: true },
        ];
    }

    return [
        { key: 'no', label: 'No.' },
        { key: 'department', label: 'Department' },
        { key: 'employees', label: 'Employees', numeric: true },
        { key: 'gross', label: 'Gross', numeric: true },
        { key: 'net', label: 'Net', numeric: true },
        { key: 'average', label: 'Avg Net', numeric: true },
    ];
});

const documentRows = computed<Record<string, string | number>[]>(() => {
    if (reportType.value === 'summary') {
        return summaryRows.value;
    }

    if (reportType.value === 'register') {
        return registerRows.value;
    }

    if (reportType.value === 'deductions') {
        return deductionRows.value;
    }

    return departmentRows.value;
});

const documentTitle = computed(
    () =>
        reportTypes.find((type) => type.value === reportType.value)?.label ??
        'Payroll Report',
);

function generate(): void {
    showPreview.value = true;
}

function exportExcel(): void {
    const headers = documentColumns.value.map((column) => column.label);
    const payload = documentRows.value.map((row) =>
        documentColumns.value.map((column) => row[column.key] ?? ''),
    );
    const csv =
        '\uFEFF' +
        [headers, ...payload]
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
    link.download = `payroll-${reportType.value}-${period.value}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const statusTone: Record<string, string> = {
    Paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
};
</script>

<template>
    <Head title="Reports — Payroll Management" />

    <div class="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <!-- Header -->
        <div
            class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
            <h1 class="text-2xl font-bold tracking-tight text-slate-900">
                Reports
            </h1>
            <div class="flex flex-wrap gap-2">
                <Button variant="outline" @click="generate">
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
            </div>
        </div>

        <!-- Filters -->
        <div
            class="flex flex-wrap gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
        >
            <Select v-model="reportType">
                <SelectTrigger class="w-64">
                    <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem
                        v-for="type in reportTypes"
                        :key="type.value"
                        :value="type.value"
                    >
                        {{ type.label }}
                    </SelectItem>
                </SelectContent>
            </Select>

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

            <div class="relative w-64">
                <Search
                    class="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                    v-model="search"
                    placeholder="Search name, ID or department…"
                    class="pl-9"
                />
            </div>
        </div>

        <!-- ================= SUMMARY ================= -->
        <div
            v-if="reportType === 'summary'"
            class="rounded-xl border border-slate-200 bg-white shadow-sm"
        >
            <div class="flex items-center justify-between border-b px-5 py-4">
                <h2 class="font-semibold text-slate-900">
                    Payroll summary report
                </h2>
                <span
                    class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                >
                    {{ summaryRows.length }} payslips
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
                            <th class="px-4 py-3 font-medium">Department</th>
                            <th class="px-4 py-3 text-right font-medium">
                                Basic
                            </th>
                            <th class="px-4 py-3 text-right font-medium">OT</th>
                            <th class="px-4 py-3 text-right font-medium">
                                Deductions
                            </th>
                            <th class="px-4 py-3 text-right font-medium">
                                Net
                            </th>
                            <th class="px-4 py-3 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="row in summaryRows"
                            :key="`${row.no}-${row.name}`"
                            class="border-b transition-colors last:border-0 hover:bg-muted/40"
                        >
                            <td
                                class="px-4 py-3 text-muted-foreground tabular-nums"
                            >
                                {{ row.no }}
                            </td>
                            <td class="px-4 py-3 font-medium text-slate-900">
                                {{ row.name }}
                            </td>
                            <td class="px-4 py-3 text-muted-foreground">
                                {{ row.department }}
                            </td>
                            <td
                                class="px-4 py-3 text-right text-muted-foreground tabular-nums"
                            >
                                {{ formatMoney(row.basic) }}
                            </td>
                            <td
                                class="px-4 py-3 text-right text-muted-foreground tabular-nums"
                            >
                                {{ formatMoney(row.ot) }}
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
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- ================= REGISTER ================= -->
        <div
            v-else-if="reportType === 'register'"
            class="rounded-xl border border-slate-200 bg-white shadow-sm"
        >
            <div class="flex items-center justify-between border-b px-5 py-4">
                <h2 class="font-semibold text-slate-900">Payslip register</h2>
                <span
                    class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                >
                    {{ registerRows.length }} payslips
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
                            <th class="px-4 py-3 font-medium">Position</th>
                            <th class="px-4 py-3 font-medium">Department</th>
                            <th class="px-4 py-3 text-right font-medium">
                                Gross
                            </th>
                            <th class="px-4 py-3 text-right font-medium">
                                Net
                            </th>
                            <th class="px-4 py-3 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="row in registerRows"
                            :key="`${row.no}-${row.name}`"
                            class="border-b transition-colors last:border-0 hover:bg-muted/40"
                        >
                            <td
                                class="px-4 py-3 text-muted-foreground tabular-nums"
                            >
                                {{ row.no }}
                            </td>
                            <td class="px-4 py-3 font-medium text-slate-900">
                                {{ row.name }}
                            </td>
                            <td class="px-4 py-3 text-muted-foreground">
                                {{ row.position }}
                            </td>
                            <td class="px-4 py-3 text-muted-foreground">
                                {{ row.department }}
                            </td>
                            <td
                                class="px-4 py-3 text-right text-muted-foreground tabular-nums"
                            >
                                {{ formatMoney(row.gross) }}
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
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- ================= DEDUCTIONS ================= -->
        <div
            v-else-if="reportType === 'deductions'"
            class="rounded-xl border border-slate-200 bg-white shadow-sm"
        >
            <div class="flex items-center justify-between border-b px-5 py-4">
                <h2 class="font-semibold text-slate-900">Deductions summary</h2>
                <span
                    class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                >
                    {{ deductionRows.length }} employees
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
                                SSS
                            </th>
                            <th class="px-4 py-3 text-right font-medium">
                                PhilHealth
                            </th>
                            <th class="px-4 py-3 text-right font-medium">
                                Pag-IBIG
                            </th>
                            <th class="px-4 py-3 text-right font-medium">
                                Tax
                            </th>
                            <th class="px-4 py-3 text-right font-medium">
                                Total
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="row in deductionRows"
                            :key="`${row.no}-${row.name}`"
                            class="border-b transition-colors last:border-0 hover:bg-muted/40"
                        >
                            <td
                                class="px-4 py-3 text-muted-foreground tabular-nums"
                            >
                                {{ row.no }}
                            </td>
                            <td class="px-4 py-3 font-medium text-slate-900">
                                {{ row.name }}
                            </td>
                            <td
                                class="px-4 py-3 text-right text-muted-foreground tabular-nums"
                            >
                                {{ formatMoney(row.sss) }}
                            </td>
                            <td
                                class="px-4 py-3 text-right text-muted-foreground tabular-nums"
                            >
                                {{ formatMoney(row.philhealth) }}
                            </td>
                            <td
                                class="px-4 py-3 text-right text-muted-foreground tabular-nums"
                            >
                                {{ formatMoney(row.pagibig) }}
                            </td>
                            <td
                                class="px-4 py-3 text-right text-muted-foreground tabular-nums"
                            >
                                {{ formatMoney(row.tax) }}
                            </td>
                            <td
                                class="px-4 py-3 text-right font-semibold text-slate-900 tabular-nums"
                            >
                                {{ formatMoney(row.total) }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- ================= DEPARTMENTS ================= -->
        <div
            v-else
            class="rounded-xl border border-slate-200 bg-white shadow-sm"
        >
            <div class="flex items-center justify-between border-b px-5 py-4">
                <h2 class="font-semibold text-slate-900">
                    Department cost report
                </h2>
                <span
                    class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                >
                    {{ departmentRows.length }} departments
                </span>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full min-w-[800px] text-sm">
                    <thead>
                        <tr
                            class="border-b text-left text-xs tracking-wide text-muted-foreground uppercase"
                        >
                            <th class="px-4 py-3 font-medium">No.</th>
                            <th class="px-4 py-3 font-medium">Department</th>
                            <th class="px-4 py-3 text-right font-medium">
                                Employees
                            </th>
                            <th class="px-4 py-3 text-right font-medium">
                                Gross pay
                            </th>
                            <th class="px-4 py-3 text-right font-medium">
                                Net pay
                            </th>
                            <th class="px-4 py-3 text-right font-medium">
                                Average net
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="row in departmentRows"
                            :key="row.department"
                            class="border-b transition-colors last:border-0 hover:bg-muted/40"
                        >
                            <td
                                class="px-4 py-3 text-muted-foreground tabular-nums"
                            >
                                {{ row.no }}
                            </td>
                            <td class="px-4 py-3 font-medium text-slate-900">
                                {{ row.department }}
                            </td>
                            <td class="px-4 py-3 text-right tabular-nums">
                                {{ row.employees }}
                            </td>
                            <td
                                class="px-4 py-3 text-right text-muted-foreground tabular-nums"
                            >
                                {{ formatMoney(row.gross) }}
                            </td>
                            <td
                                class="px-4 py-3 text-right font-semibold text-slate-900 tabular-nums"
                            >
                                {{ formatMoney(row.net) }}
                            </td>
                            <td
                                class="px-4 py-3 text-right text-muted-foreground tabular-nums"
                            >
                                {{ formatMoney(row.average) }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Official report preview -->
    <RecordPrintModal
        v-if="showPreview"
        :heading="`${documentTitle} — ${periodLabel} · ${documentRows.length} record${documentRows.length === 1 ? '' : 's'}`"
        subtitle="Official payroll document · ready to print"
        @close="showPreview = false"
    >
        <AttendanceReportDocument
            :title="documentTitle"
            :period="periodLabel"
            system="Payroll Management System"
            :columns="documentColumns"
            :rows="documentRows"
            note="Overtime hours come from Attendance, unpaid days from declared holidays, and statutory deductions (SSS, PhilHealth, Pag-IBIG, withholding tax) are computed per payslip."
        />
    </RecordPrintModal>
</template>
