<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { FileBarChart2, FileSpreadsheet, Search } from '@lucide/vue';
import { computed, ref, watch } from 'vue';
import AttendanceReportDocument from '@/components/demo/AttendanceReportDocument.vue';
import PaginationBar from '@/components/demo/PaginationBar.vue';
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
import { useDemoDisciplinary } from '@/composables/useDemoDisciplinary';
import { useDemoEmployees } from '@/composables/useDemoEmployees';
import { useDemoOffboarding } from '@/composables/useDemoOffboarding';
import type { OffboardingEmployee } from '@/composables/useDemoOffboarding';
import type { DemoDisciplinaryRecord, DemoOffboardingCase } from '@/types';

const props = defineProps<{
    employees: OffboardingEmployee[];
    cases: DemoOffboardingCase[];
    disciplinary: DemoDisciplinaryRecord[];
}>();

const { addedEmployees } = useDemoEmployees();

const allEmployees = computed<OffboardingEmployee[]>(() => [
    ...props.employees,
    ...addedEmployees.value.map((employee) => ({
        id: employee.id,
        no: employee.no,
        name: employee.name,
        department: employee.department,
        position: employee.position,
        employment_type: employee.employment_type,
        salary: employee.salary,
        leave_balance: employee.leave_balance,
    })),
]);

// Live Disciplinary handoff (Module 9) — seeded + session-escalated cases.
const { escalatedEmployeeIds } = useDemoDisciplinary(
    allEmployees.value,
    props.disciplinary,
);

const { rows } = useDemoOffboarding(
    allEmployees.value,
    props.cases,
    escalatedEmployeeIds.value.map((employee_id) => ({ employee_id })),
);

/* ------------------------------------------------------------------ */
/* Report type + filters                                               */
/* ------------------------------------------------------------------ */

const reportTypes = [
    { value: 'register', label: 'Separation Register' },
    { value: 'active', label: 'Active Separations Report' },
    { value: 'final-pay', label: 'Final Pay Summary' },
    { value: 'archived', label: 'Archived Cases Report' },
] as const;

type ReportType = (typeof reportTypes)[number]['value'];

const reportType = ref<ReportType>('register');
const search = ref('');

const term = computed(() => search.value.trim().toLowerCase());

const match = (name: string): boolean =>
    term.value === '' || name.toLowerCase().includes(term.value);

const statusTone: Record<string, string> = {
    Requested: 'bg-blue-50 text-blue-700 border-blue-200',
    'In Clearance': 'bg-amber-50 text-amber-700 border-amber-200',
    'Final Pay': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

function formatMoney(value: number): string {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

function finalPayOf(row: (typeof rows.value)[number]): number | string {
    if (row.status === 'Final Pay' || row.status === 'Completed') {
        return row.finalPay.net;
    }

    return 'Pending';
}

const registerRows = computed(() =>
    rows.value
        .filter(
            (row) =>
                match(row.name) || match(row.department) || match(row.type),
        )
        .map((row, index) => ({
            no: index + 1,
            name: row.name,
            department: row.department,
            type: row.type,
            requester: row.requested_by,
            requested: row.requested_on,
            exit: row.exit_date,
            progress: `${row.progress}%`,
            status: row.status,
            finalPay: finalPayOf(row),
        })),
);

const activeRows = computed(() =>
    rows.value
        .filter((row) => row.status !== 'Completed' && match(row.name))
        .map((row, index) => ({
            no: index + 1,
            name: row.name,
            department: row.department,
            type: row.type,
            exit: row.exit_date,
            progress: `${row.progress}%`,
            status: row.status,
        })),
);

const finalPayRows = computed(() =>
    rows.value
        .filter(
            (row) =>
                (row.status === 'Final Pay' || row.status === 'Completed') &&
                match(row.name),
        )
        .map((row, index) => ({
            no: index + 1,
            name: row.name,
            department: row.department,
            type: row.type,
            exit: row.exit_date,
            finalPay: row.finalPay.net,
        })),
);

const archivedRows = computed(() =>
    rows.value
        .filter((row) => row.status === 'Completed' && match(row.name))
        .map((row, index) => ({
            no: index + 1,
            name: row.name,
            department: row.department,
            type: row.type,
            requester: row.requested_by,
            requested: row.requested_on,
            exit: row.exit_date,
            progress: `${row.progress}%`,
            status: row.status,
            finalPay: row.finalPay.net,
        })),
);

/* ------------------------------------------------------------------ */
/* Pagination                                                          */
/* ------------------------------------------------------------------ */

const PAGE_SIZE = 10;
const reportPage = ref(1);

function paged<T>(rows: T[]): T[] {
    const start = (reportPage.value - 1) * PAGE_SIZE;

    return rows.slice(start, start + PAGE_SIZE);
}

watch([reportType, search], () => {
    reportPage.value = 1;
});

/* ------------------------------------------------------------------ */
/* Generate / export                                                   */
/* ------------------------------------------------------------------ */

const showPreview = ref(false);

const documentColumns = computed<
    { key: string; label: string; numeric?: boolean }[]
>(() => {
    if (reportType.value === 'final-pay') {
        return [
            { key: 'no', label: 'No.' },
            { key: 'name', label: 'Employee' },
            { key: 'department', label: 'Department' },
            { key: 'type', label: 'Type' },
            { key: 'exit', label: 'Exit Date' },
            { key: 'finalPay', label: 'Final Pay', numeric: true },
        ];
    }

    if (reportType.value === 'active') {
        return [
            { key: 'no', label: 'No.' },
            { key: 'name', label: 'Employee' },
            { key: 'department', label: 'Department' },
            { key: 'type', label: 'Type' },
            { key: 'exit', label: 'Exit Date' },
            { key: 'progress', label: 'Clearance' },
            { key: 'status', label: 'Status' },
        ];
    }

    return [
        { key: 'no', label: 'No.' },
        { key: 'name', label: 'Employee' },
        { key: 'department', label: 'Department' },
        { key: 'type', label: 'Type' },
        { key: 'requester', label: 'Requested By' },
        { key: 'requested', label: 'Requested' },
        { key: 'exit', label: 'Exit Date' },
        { key: 'progress', label: 'Clearance' },
        { key: 'status', label: 'Status' },
        { key: 'finalPay', label: 'Final Pay' },
    ];
});

const documentRows = computed<Record<string, string | number>[]>(() => {
    if (reportType.value === 'register') {
        return registerRows.value;
    }

    if (reportType.value === 'active') {
        return activeRows.value;
    }

    if (reportType.value === 'final-pay') {
        return finalPayRows.value;
    }

    return archivedRows.value;
});

const documentTitle = computed(
    () =>
        reportTypes.find((type) => type.value === reportType.value)?.label ??
        'Separation Report',
);

const documentNote = computed(() => {
    if (reportType.value === 'active') {
        return 'Active separations are cases still moving through clearance or awaiting final pay release.';
    }

    if (reportType.value === 'final-pay') {
        return 'Final pay is computed from the employee record — basic pay, unused leave conversion, prorated 13th month, minus statutory deductions and advances.';
    }

    if (reportType.value === 'archived') {
        return 'Completed separations are archived safely — the employee record is closed but kept for records.';
    }

    return 'Cases move Requested → In Clearance → Final Pay → Completed; final pay is settled with Payroll and completed records are archived safely.';
});

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
    link.download = `offboarding-${reportType.value}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
}
</script>

<template>
    <Head title="Reports — Separation & Offboarding" />

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

            <div class="relative w-64">
                <Search
                    class="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                    v-model="search"
                    placeholder="Search employee or department…"
                    class="pl-9"
                />
            </div>
        </div>

        <!-- ================= REGISTER / ARCHIVED ================= -->
        <div
            v-if="reportType === 'register' || reportType === 'archived'"
            class="rounded-xl border border-slate-200 bg-white shadow-sm"
        >
            <div class="flex items-center justify-between border-b px-5 py-4">
                <h2 class="font-semibold text-slate-900">
                    {{
                        reportType === 'register'
                            ? 'Separation register'
                            : 'Archived cases'
                    }}
                </h2>
                <span
                    class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                >
                    {{
                        (reportType === 'register'
                            ? registerRows
                            : archivedRows
                        ).length
                    }}
                    case{{
                        (reportType === 'register'
                            ? registerRows
                            : archivedRows
                        ).length === 1
                            ? ''
                            : 's'
                    }}
                </span>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full min-w-[1000px] text-sm">
                    <thead>
                        <tr
                            class="border-b text-left text-xs tracking-wide text-muted-foreground uppercase"
                        >
                            <th class="px-4 py-3 font-medium">No.</th>
                            <th class="px-4 py-3 font-medium">Employee</th>
                            <th class="px-4 py-3 font-medium">Department</th>
                            <th class="px-4 py-3 font-medium">Type</th>
                            <th class="px-4 py-3 font-medium">Requested By</th>
                            <th class="px-4 py-3 font-medium">Requested</th>
                            <th class="px-4 py-3 font-medium">Exit Date</th>
                            <th class="px-4 py-3 font-medium">Clearance</th>
                            <th class="px-4 py-3 font-medium">Status</th>
                            <th class="px-4 py-3 font-medium">Final Pay</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="row in paged(
                                reportType === 'register'
                                    ? registerRows
                                    : archivedRows,
                            )"
                            :key="row.no"
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
                            <td class="px-4 py-3 text-muted-foreground">
                                {{ row.type }}
                            </td>
                            <td class="px-4 py-3 text-muted-foreground">
                                {{ row.requester }}
                            </td>
                            <td
                                class="px-4 py-3 text-muted-foreground tabular-nums"
                            >
                                {{ row.requested }}
                            </td>
                            <td
                                class="px-4 py-3 text-muted-foreground tabular-nums"
                            >
                                {{ row.exit }}
                            </td>
                            <td class="px-4 py-3 text-muted-foreground">
                                {{ row.progress }}
                            </td>
                            <td class="px-4 py-3">
                                <span
                                    class="inline-flex rounded-full border px-2 py-0.5 text-xs font-medium"
                                    :class="statusTone[row.status]"
                                >
                                    {{ row.status }}
                                </span>
                            </td>
                            <td
                                class="px-4 py-3 text-muted-foreground tabular-nums"
                            >
                                {{ row.finalPay }}
                            </td>
                        </tr>
                        <tr
                            v-if="
                                (reportType === 'register'
                                    ? registerRows
                                    : archivedRows
                                ).length === 0
                            "
                        >
                            <td
                                colspan="9"
                                class="px-4 py-10 text-center text-sm text-muted-foreground"
                            >
                                No cases match the selected filters.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <PaginationBar
                :total="
                    (reportType === 'register' ? registerRows : archivedRows)
                        .length
                "
                :page-size="PAGE_SIZE"
                v-model:page="reportPage"
            />
        </div>

        <!-- ================= ACTIVE SEPARATIONS ================= -->
        <div
            v-else-if="reportType === 'active'"
            class="rounded-xl border border-slate-200 bg-white shadow-sm"
        >
            <div class="flex items-center justify-between border-b px-5 py-4">
                <h2 class="font-semibold text-slate-900">Active separations</h2>
                <span
                    class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                >
                    {{ activeRows.length }} cases
                </span>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full min-w-[800px] text-sm">
                    <thead>
                        <tr
                            class="border-b text-left text-xs tracking-wide text-muted-foreground uppercase"
                        >
                            <th class="px-4 py-3 font-medium">No.</th>
                            <th class="px-4 py-3 font-medium">Employee</th>
                            <th class="px-4 py-3 font-medium">Department</th>
                            <th class="px-4 py-3 font-medium">Type</th>
                            <th class="px-4 py-3 font-medium">Exit Date</th>
                            <th class="px-4 py-3 font-medium">Clearance</th>
                            <th class="px-4 py-3 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="row in paged(activeRows)"
                            :key="row.no"
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
                            <td class="px-4 py-3 text-muted-foreground">
                                {{ row.type }}
                            </td>
                            <td
                                class="px-4 py-3 text-muted-foreground tabular-nums"
                            >
                                {{ row.exit }}
                            </td>
                            <td class="px-4 py-3 text-muted-foreground">
                                {{ row.progress }}
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
                        <tr v-if="activeRows.length === 0">
                            <td
                                colspan="7"
                                class="px-4 py-10 text-center text-sm text-muted-foreground"
                            >
                                No active separations right now.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <PaginationBar
                :total="activeRows.length"
                :page-size="PAGE_SIZE"
                v-model:page="reportPage"
            />
        </div>

        <!-- ================= FINAL PAY SUMMARY ================= -->
        <div
            v-else
            class="rounded-xl border border-slate-200 bg-white shadow-sm"
        >
            <div class="flex items-center justify-between border-b px-5 py-4">
                <h2 class="font-semibold text-slate-900">Final pay summary</h2>
                <span
                    class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                >
                    {{ finalPayRows.length }} cases
                </span>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full min-w-[700px] text-sm">
                    <thead>
                        <tr
                            class="border-b text-left text-xs tracking-wide text-muted-foreground uppercase"
                        >
                            <th class="px-4 py-3 font-medium">No.</th>
                            <th class="px-4 py-3 font-medium">Employee</th>
                            <th class="px-4 py-3 font-medium">Department</th>
                            <th class="px-4 py-3 font-medium">Type</th>
                            <th class="px-4 py-3 font-medium">Exit Date</th>
                            <th class="px-4 py-3 text-right font-medium">
                                Final Pay
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="row in paged(finalPayRows)"
                            :key="row.no"
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
                            <td class="px-4 py-3 text-muted-foreground">
                                {{ row.type }}
                            </td>
                            <td
                                class="px-4 py-3 text-muted-foreground tabular-nums"
                            >
                                {{ row.exit }}
                            </td>
                            <td
                                class="px-4 py-3 text-right font-semibold text-slate-900 tabular-nums"
                            >
                                {{ formatMoney(row.finalPay) }}
                            </td>
                        </tr>
                        <tr v-if="finalPayRows.length === 0">
                            <td
                                colspan="6"
                                class="px-4 py-10 text-center text-sm text-muted-foreground"
                            >
                                No final pay computed yet.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <PaginationBar
                :total="finalPayRows.length"
                :page-size="PAGE_SIZE"
                v-model:page="reportPage"
            />
        </div>
    </div>

    <!-- Official report preview -->
    <RecordPrintModal
        v-if="showPreview"
        :heading="`${documentTitle} — ${documentRows.length} case${documentRows.length === 1 ? '' : 's'}`"
        subtitle="Official separation & offboarding document · ready to print"
        @close="showPreview = false"
    >
        <AttendanceReportDocument
            :title="documentTitle"
            :period="`As of ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`"
            system="Separation & Offboarding System"
            :columns="documentColumns"
            :rows="documentRows"
            :note="documentNote"
        />
    </RecordPrintModal>
</template>
