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
import type { DisciplinaryEmployee } from '@/composables/useDemoDisciplinary';
import type { DemoDisciplinaryRecord } from '@/types';

const props = defineProps<{
    employees: DisciplinaryEmployee[];
    records: DemoDisciplinaryRecord[];
}>();

const { rows, repeatOffenders } = useDemoDisciplinary(
    props.employees,
    props.records,
);

/* ------------------------------------------------------------------ */
/* Report type + filters                                               */
/* ------------------------------------------------------------------ */

const reportTypes = [
    { value: 'log', label: 'Disciplinary Log' },
    { value: 'open', label: 'Open Cases Report' },
    { value: 'escalations', label: 'Escalation Handoff Report' },
    { value: 'offenders', label: 'Repeat Offenders Report' },
] as const;

type ReportType = (typeof reportTypes)[number]['value'];

const reportType = ref<ReportType>('log');
const search = ref('');

const term = computed(() => search.value.trim().toLowerCase());

const match = (name: string): boolean =>
    term.value === '' || name.toLowerCase().includes(term.value);

const severityTone: Record<string, string> = {
    Serious: 'bg-red-50 text-red-700 border-red-200',
    Moderate: 'bg-amber-50 text-amber-700 border-amber-200',
    Minor: 'bg-blue-50 text-blue-700 border-blue-200',
};

const statusTone: Record<string, string> = {
    Logged: 'bg-blue-50 text-blue-700 border-blue-200',
    'Under Review': 'bg-amber-50 text-amber-700 border-amber-200',
    Resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Escalated: 'bg-red-50 text-red-700 border-red-200',
};

const logRows = computed(() =>
    rows.value
        .filter((row) => match(row.name) || match(row.category))
        .map((row, index) => ({
            no: index + 1,
            name: row.name,
            department: row.department,
            type: row.type,
            severity: row.severity,
            category: row.category,
            date: row.date,
            status: row.status,
            action: row.action,
        })),
);

const openRows = computed(() =>
    rows.value
        .filter(
            (row) =>
                (row.status === 'Logged' || row.status === 'Under Review') &&
                match(row.name),
        )
        .map((row, index) => ({
            no: index + 1,
            name: row.name,
            department: row.department,
            type: row.type,
            severity: row.severity,
            category: row.category,
            date: row.date,
            status: row.status,
            action: row.action,
        })),
);

const escalationRows = computed(() =>
    rows.value
        .filter((row) => row.status === 'Escalated' && match(row.name))
        .map((row, index) => ({
            no: index + 1,
            name: row.name,
            department: row.department,
            severity: row.severity,
            category: row.category,
            date: row.date,
            action: row.action,
        })),
);

const offenderRows = computed(() =>
    repeatOffenders.value
        .filter((offender) => match(offender.name))
        .map((offender, index) => ({
            no: index + 1,
            name: offender.name,
            department: offender.department,
            records: offender.recordCount,
            serious: offender.seriousCount,
            open: offender.openCount,
            flagged: offender.flagged ? 'Flagged' : 'On file',
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
    if (reportType.value === 'escalations') {
        return [
            { key: 'no', label: 'No.' },
            { key: 'name', label: 'Employee' },
            { key: 'department', label: 'Department' },
            { key: 'severity', label: 'Severity' },
            { key: 'category', label: 'Category' },
            { key: 'date', label: 'Date' },
            { key: 'action', label: 'Action Taken' },
        ];
    }

    if (reportType.value === 'offenders') {
        return [
            { key: 'no', label: 'No.' },
            { key: 'name', label: 'Employee' },
            { key: 'department', label: 'Department' },
            { key: 'records', label: 'Records', numeric: true },
            { key: 'serious', label: 'Serious', numeric: true },
            { key: 'open', label: 'Open Cases', numeric: true },
            { key: 'flagged', label: 'Status' },
        ];
    }

    return [
        { key: 'no', label: 'No.' },
        { key: 'name', label: 'Employee' },
        { key: 'department', label: 'Department' },
        { key: 'type', label: 'Type' },
        { key: 'severity', label: 'Severity' },
        { key: 'category', label: 'Category' },
        { key: 'date', label: 'Date' },
        { key: 'status', label: 'Status' },
        { key: 'action', label: 'Action Taken' },
    ];
});

const documentRows = computed<Record<string, string | number>[]>(() => {
    if (reportType.value === 'log') {
        return logRows.value;
    }

    if (reportType.value === 'open') {
        return openRows.value;
    }

    if (reportType.value === 'escalations') {
        return escalationRows.value;
    }

    return offenderRows.value;
});

const documentTitle = computed(
    () =>
        reportTypes.find((type) => type.value === reportType.value)?.label ??
        'Disciplinary Report',
);

const documentNote = computed(() => {
    if (reportType.value === 'open') {
        return 'Open cases are records still Logged or Under Review that need a decision — resolve or escalate.';
    }

    if (reportType.value === 'escalations') {
        return 'Escalated cases are handed to Separation & Offboarding for the next step in the process.';
    }

    if (reportType.value === 'offenders') {
        return 'Employees are flagged when they have repeated cases, serious offenses, or an escalation on file.';
    }

    return 'Cases move Logged → Under Review → Resolved; escalated cases are handed to Separation & Offboarding.';
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
    link.download = `disciplinary-${reportType.value}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
}
</script>

<template>
    <Head title="Reports — Disciplinary Management" />

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
                    placeholder="Search employee or category…"
                    class="pl-9"
                />
            </div>
        </div>

        <!-- ================= LOG / OPEN CASES ================= -->
        <div
            v-if="reportType === 'log' || reportType === 'open'"
            class="rounded-xl border border-slate-200 bg-white shadow-sm"
        >
            <div class="flex items-center justify-between border-b px-5 py-4">
                <h2 class="font-semibold text-slate-900">
                    {{
                        reportType === 'log' ? 'Disciplinary log' : 'Open cases'
                    }}
                </h2>
                <span
                    class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                >
                    {{ (reportType === 'log' ? logRows : openRows).length }}
                    record{{
                        (reportType === 'log' ? logRows : openRows).length === 1
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
                            <th class="px-4 py-3 font-medium">Severity</th>
                            <th class="px-4 py-3 font-medium">Category</th>
                            <th class="px-4 py-3 font-medium">Date</th>
                            <th class="px-4 py-3 font-medium">Status</th>
                            <th class="px-4 py-3 font-medium">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="row in paged(
                                reportType === 'log' ? logRows : openRows,
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
                            <td class="px-4 py-3">
                                <span
                                    class="inline-flex rounded-full border px-2 py-0.5 text-xs font-medium"
                                    :class="severityTone[row.severity]"
                                >
                                    {{ row.severity }}
                                </span>
                            </td>
                            <td class="px-4 py-3 text-slate-700">
                                {{ row.category }}
                            </td>
                            <td
                                class="px-4 py-3 text-muted-foreground tabular-nums"
                            >
                                {{ row.date }}
                            </td>
                            <td class="px-4 py-3">
                                <span
                                    class="inline-flex rounded-full border px-2 py-0.5 text-xs font-medium"
                                    :class="statusTone[row.status]"
                                >
                                    {{ row.status }}
                                </span>
                            </td>
                            <td class="px-4 py-3 text-muted-foreground">
                                {{ row.action }}
                            </td>
                        </tr>
                        <tr
                            v-if="
                                (reportType === 'log' ? logRows : openRows)
                                    .length === 0
                            "
                        >
                            <td
                                colspan="9"
                                class="px-4 py-10 text-center text-sm text-muted-foreground"
                            >
                                No records match the selected filters.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <PaginationBar
                :total="(reportType === 'log' ? logRows : openRows).length"
                :page-size="PAGE_SIZE"
                v-model:page="reportPage"
            />
        </div>

        <!-- ================= ESCALATION HANDOFF ================= -->
        <div
            v-else-if="reportType === 'escalations'"
            class="rounded-xl border border-slate-200 bg-white shadow-sm"
        >
            <div class="flex items-center justify-between border-b px-5 py-4">
                <h2 class="font-semibold text-slate-900">
                    Escalation handoff report
                </h2>
                <span
                    class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                >
                    {{ escalationRows.length }} escalations
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
                            <th class="px-4 py-3 font-medium">Severity</th>
                            <th class="px-4 py-3 font-medium">Category</th>
                            <th class="px-4 py-3 font-medium">Date</th>
                            <th class="px-4 py-3 font-medium">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="row in paged(escalationRows)"
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
                            <td class="px-4 py-3">
                                <span
                                    class="inline-flex rounded-full border px-2 py-0.5 text-xs font-medium"
                                    :class="severityTone[row.severity]"
                                >
                                    {{ row.severity }}
                                </span>
                            </td>
                            <td class="px-4 py-3 text-slate-700">
                                {{ row.category }}
                            </td>
                            <td
                                class="px-4 py-3 text-muted-foreground tabular-nums"
                            >
                                {{ row.date }}
                            </td>
                            <td class="px-4 py-3 text-muted-foreground">
                                {{ row.action }}
                            </td>
                        </tr>
                        <tr v-if="escalationRows.length === 0">
                            <td
                                colspan="7"
                                class="px-4 py-10 text-center text-sm text-muted-foreground"
                            >
                                No escalations to offboarding right now.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <PaginationBar
                :total="escalationRows.length"
                :page-size="PAGE_SIZE"
                v-model:page="reportPage"
            />
        </div>

        <!-- ================= REPEAT OFFENDERS ================= -->
        <div
            v-else
            class="rounded-xl border border-slate-200 bg-white shadow-sm"
        >
            <div class="flex items-center justify-between border-b px-5 py-4">
                <h2 class="font-semibold text-slate-900">
                    Repeat offenders report
                </h2>
                <span
                    class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                >
                    {{ offenderRows.length }} employees
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
                            <th class="px-4 py-3 text-right font-medium">
                                Records
                            </th>
                            <th class="px-4 py-3 text-right font-medium">
                                Serious
                            </th>
                            <th class="px-4 py-3 text-right font-medium">
                                Open cases
                            </th>
                            <th class="px-4 py-3 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="row in paged(offenderRows)"
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
                            <td
                                class="px-4 py-3 text-right font-semibold text-slate-900 tabular-nums"
                            >
                                {{ row.records }}
                            </td>
                            <td
                                class="px-4 py-3 text-right tabular-nums"
                                :class="
                                    row.serious > 0
                                        ? 'font-semibold text-red-600'
                                        : 'text-muted-foreground'
                                "
                            >
                                {{ row.serious }}
                            </td>
                            <td
                                class="px-4 py-3 text-right tabular-nums"
                                :class="
                                    row.open > 0
                                        ? 'font-medium text-amber-600'
                                        : 'text-muted-foreground'
                                "
                            >
                                {{ row.open }}
                            </td>
                            <td class="px-4 py-3">
                                <span
                                    v-if="row.flagged === 'Flagged'"
                                    class="inline-flex rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700"
                                >
                                    {{ row.flagged }}
                                </span>
                                <span
                                    v-else
                                    class="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600"
                                >
                                    {{ row.flagged }}
                                </span>
                            </td>
                        </tr>
                        <tr v-if="offenderRows.length === 0">
                            <td
                                colspan="7"
                                class="px-4 py-10 text-center text-sm text-muted-foreground"
                            >
                                No employees with records match the search.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <PaginationBar
                :total="offenderRows.length"
                :page-size="PAGE_SIZE"
                v-model:page="reportPage"
            />
        </div>
    </div>

    <!-- Official report preview -->
    <RecordPrintModal
        v-if="showPreview"
        :heading="`${documentTitle} — ${documentRows.length} record${documentRows.length === 1 ? '' : 's'}`"
        subtitle="Official disciplinary document · ready to print"
        @close="showPreview = false"
    >
        <AttendanceReportDocument
            :title="documentTitle"
            :period="`As of ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`"
            system="Disciplinary Management System"
            :columns="documentColumns"
            :rows="documentRows"
            :note="documentNote"
        />
    </RecordPrintModal>
</template>
