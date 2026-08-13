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
import { useDemoLeave } from '@/composables/useDemoLeave';
import type { DemoLeaveRow } from '@/types';

const props = defineProps<{
    requests: DemoLeaveRow[];
    employees: {
        id: number;
        no: string;
        name: string;
        department: string;
        position: string;
        balance: number;
    }[];
    types: string[];
    stats: {
        total: number;
        pending: number;
        approved: number;
        onLeaveToday: number;
    };
}>();

const { addedRequests, statusFor, balanceFor } = useDemoLeave();
const { addedEmployees } = useDemoEmployees();

const allEmployees = computed(() => [
    ...props.employees,
    ...addedEmployees.value.map((employee) => ({
        id: employee.id,
        no: employee.no,
        name: employee.name,
        department: employee.department,
        position: employee.position,
        balance: employee.leave_balance,
    })),
]);

const allRequests = computed<DemoLeaveRow[]>(() => {
    const base: DemoLeaveRow[] = props.requests.map((row) => ({
        ...row,
        status: statusFor(row),
    }));
    const added: DemoLeaveRow[] = addedRequests.value.map((request) => {
        const employee = allEmployees.value.find(
            (row) => row.id === request.employee_id,
        );

        return {
            ...request,
            no: employee?.no ?? 'EMP-0000',
            name: employee?.name ?? 'New employee',
            department: employee?.department ?? '—',
            position: employee?.position ?? '—',
            balance: employee?.balance ?? 0,
            status: statusFor(request),
        };
    });

    return [...base, ...added];
});

/* ------------------------------------------------------------------ */
/* Report type + filters                                               */
/* ------------------------------------------------------------------ */

const reportTypes = [
    { value: 'summary', label: 'Leave Summary Report' },
    { value: 'balances', label: 'Leave Balances Report' },
    { value: 'breakdown', label: 'Leave Type Breakdown' },
] as const;

type ReportType = (typeof reportTypes)[number]['value'];

const reportType = ref<ReportType>('summary');
const search = ref('');

const term = computed(() => search.value.trim().toLowerCase());

const summaryRows = computed(() =>
    allRequests.value
        .filter(
            (row) =>
                term.value === '' ||
                row.name.toLowerCase().includes(term.value) ||
                row.no.toLowerCase().includes(term.value),
        )
        .map((row, index) => ({
            no: index + 1,
            name: row.name,
            department: row.department,
            type: row.type,
            from: row.from,
            to: row.to,
            days: row.days,
            status: row.status,
        })),
);

// Balances reflect any balance set from the Leave Requests page — the
// effective balance (override ?? server value) for each employee with a
// leave record.
const balanceRows = computed(() => {
    const seen = new Set<number>();
    const rows: {
        no: number;
        name: string;
        department: string;
        balance: number;
    }[] = [];

    for (const row of allRequests.value) {
        if (seen.has(row.employee_id)) {
            continue;
        }

        seen.add(row.employee_id);
        rows.push({
            no: rows.length + 1,
            name: row.name,
            department: row.department,
            balance: balanceFor(row.employee_id, row.balance),
        });
    }

    return rows
        .filter(
            (row) =>
                term.value === '' ||
                row.name.toLowerCase().includes(term.value),
        )
        .sort((a, b) => b.balance - a.balance);
});

const breakdownRows = computed(() =>
    props.types
        .map((type, index) => {
            const rows = allRequests.value.filter((row) => row.type === type);

            return {
                no: index + 1,
                type,
                requests: rows.length,
                approved: rows.filter((row) => row.status === 'Approved')
                    .length,
                pending: rows.filter((row) => row.status === 'Pending').length,
                days: rows.reduce((sum, row) => sum + row.days, 0),
            };
        })
        .filter(
            (row) =>
                term.value === '' ||
                row.type.toLowerCase().includes(term.value),
        ),
);

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
            { key: 'type', label: 'Leave Type' },
            { key: 'from', label: 'From' },
            { key: 'to', label: 'To' },
            { key: 'days', label: 'Days', numeric: true },
            { key: 'status', label: 'Status' },
        ];
    }

    if (reportType.value === 'balances') {
        return [
            { key: 'no', label: 'No.' },
            { key: 'name', label: 'Employee' },
            { key: 'department', label: 'Department' },
            { key: 'balance', label: 'Balance (Days)', numeric: true },
        ];
    }

    return [
        { key: 'no', label: 'No.' },
        { key: 'type', label: 'Leave Type' },
        { key: 'requests', label: 'Requests', numeric: true },
        { key: 'approved', label: 'Approved', numeric: true },
        { key: 'pending', label: 'Pending', numeric: true },
        { key: 'days', label: 'Total Days', numeric: true },
    ];
});

const documentRows = computed<Record<string, string | number>[]>(() => {
    if (reportType.value === 'summary') {
        return summaryRows.value;
    }

    if (reportType.value === 'balances') {
        return balanceRows.value;
    }

    return breakdownRows.value;
});

const documentTitle = computed(
    () =>
        reportTypes.find((type) => type.value === reportType.value)?.label ??
        'Leave Report',
);

const printedOn = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
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
    link.download = 'leave-report.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const statusTone: Record<string, string> = {
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
    Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Declined: 'bg-red-50 text-red-700 border-red-200',
};
</script>

<template>
    <Head title="Reports — Leave Management" />

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
                    placeholder="Search name or leave type…"
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
                    Leave summary report
                </h2>
                <span
                    class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                >
                    {{ summaryRows.length }} requests
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
                            <th class="px-4 py-3 font-medium">Type</th>
                            <th class="px-4 py-3 font-medium">From</th>
                            <th class="px-4 py-3 font-medium">To</th>
                            <th class="px-4 py-3 font-medium">Days</th>
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
                            <td class="px-4 py-3 text-muted-foreground">
                                {{ row.type }}
                            </td>
                            <td
                                class="px-4 py-3 text-muted-foreground tabular-nums"
                            >
                                {{ row.from }}
                            </td>
                            <td
                                class="px-4 py-3 text-muted-foreground tabular-nums"
                            >
                                {{ row.to }}
                            </td>
                            <td class="px-4 py-3 tabular-nums">
                                {{ row.days }}
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

        <!-- ================= BALANCES ================= -->
        <div
            v-else-if="reportType === 'balances'"
            class="rounded-xl border border-slate-200 bg-white shadow-sm"
        >
            <div class="flex items-center justify-between border-b px-5 py-4">
                <h2 class="font-semibold text-slate-900">
                    Leave balances report
                </h2>
                <span
                    class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                >
                    {{ balanceRows.length }} employees
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
                            <th class="px-4 py-3 font-medium">
                                Balance (days)
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="row in balanceRows"
                            :key="row.name"
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
                            <td class="px-4 py-3 tabular-nums">
                                {{ row.balance }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- ================= BREAKDOWN ================= -->
        <div
            v-else
            class="rounded-xl border border-slate-200 bg-white shadow-sm"
        >
            <div class="flex items-center justify-between border-b px-5 py-4">
                <h2 class="font-semibold text-slate-900">
                    Leave type breakdown
                </h2>
                <span
                    class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                >
                    {{ breakdownRows.length }} types
                </span>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full min-w-[700px] text-sm">
                    <thead>
                        <tr
                            class="border-b text-left text-xs tracking-wide text-muted-foreground uppercase"
                        >
                            <th class="px-4 py-3 font-medium">No.</th>
                            <th class="px-4 py-3 font-medium">Leave type</th>
                            <th class="px-4 py-3 font-medium">Requests</th>
                            <th class="px-4 py-3 font-medium">Approved</th>
                            <th class="px-4 py-3 font-medium">Pending</th>
                            <th class="px-4 py-3 font-medium">Total days</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="row in breakdownRows"
                            :key="row.type"
                            class="border-b transition-colors last:border-0 hover:bg-muted/40"
                        >
                            <td
                                class="px-4 py-3 text-muted-foreground tabular-nums"
                            >
                                {{ row.no }}
                            </td>
                            <td class="px-4 py-3 font-medium text-slate-900">
                                {{ row.type }}
                            </td>
                            <td class="px-4 py-3 tabular-nums">
                                {{ row.requests }}
                            </td>
                            <td class="px-4 py-3 tabular-nums">
                                {{ row.approved }}
                            </td>
                            <td class="px-4 py-3 tabular-nums">
                                {{ row.pending }}
                            </td>
                            <td class="px-4 py-3 tabular-nums">
                                {{ row.days }}
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
        :heading="`${documentTitle} — ${documentRows.length} record${documentRows.length === 1 ? '' : 's'}`"
        subtitle="Official leave document · ready to print"
        @close="showPreview = false"
    >
        <AttendanceReportDocument
            :title="documentTitle"
            :period="`As of ${printedOn}`"
            system="Leave Management System"
            :columns="documentColumns"
            :rows="documentRows"
            note="Approved leave marks the employee's day off in Attendance and is settled as paid or unpaid leave in Payroll."
        />
    </RecordPrintModal>
</template>
