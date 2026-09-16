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
import { useDemoEmployees } from '@/composables/useDemoEmployees';
import { useDemoProjects } from '@/composables/useDemoProjects';
import type { ProjectEmployee } from '@/composables/useDemoProjects';
import { exportSheet } from '@/lib/exportExcel';
import type { DemoProject } from '@/types';

const props = defineProps<{
    employees: ProjectEmployee[];
    projects: DemoProject[];
}>();

const { addedEmployees } = useDemoEmployees();

const allEmployees = computed<ProjectEmployee[]>(() => [
    ...props.employees,
    ...addedEmployees.value.map((employee) => ({
        id: employee.id,
        no: employee.no,
        name: employee.name,
        department: employee.department,
        position: employee.position,
    })),
]);

const { rows } = useDemoProjects(allEmployees.value, props.projects);

/* ------------------------------------------------------------------ */
/* Report type + filters                                               */
/* ------------------------------------------------------------------ */

const reportTypes = [
    { value: 'summary', label: 'Project Summary' },
    { value: 'department', label: 'By Department' },
    { value: 'status', label: 'By Status' },
    { value: 'utilization', label: 'Team Utilization' },
] as const;

type ReportType = (typeof reportTypes)[number]['value'];

const reportType = ref<ReportType>('summary');
const search = ref('');

const term = computed(() => search.value.trim().toLowerCase());

const match = (name: string): boolean =>
    term.value === '' || name.toLowerCase().includes(term.value);

const statusTone: Record<string, string> = {
    Active: 'bg-blue-50 text-blue-700 border-blue-200',
    Planning: 'bg-amber-50 text-amber-700 border-amber-200',
    'On Hold': 'bg-slate-100 text-slate-700 border-slate-200',
    Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Cancelled: 'bg-red-50 text-red-700 border-red-200',
};

const summaryRows = computed(() =>
    rows.value
        .filter(
            (row) =>
                match(row.name) ||
                match(row.lead_name) ||
                match(row.department),
        )
        .map((row, index) => ({
            no: index + 1,
            name: row.name,
            department: row.department,
            lead: row.lead_name,
            team: row.team_count,
            end: row.end_date,
            status: row.status,
            progress: `${row.progress}%`,
            budget: row.budget,
        })),
);

const departmentRows = computed(() => {
    const byDepartment = new Map<
        string,
        { total: number; planning: number; active: number; completed: number; budget: number }
    >();

    for (const row of rows.value) {
        const entry = byDepartment.get(row.department) ?? {
            total: 0,
            planning: 0,
            active: 0,
            completed: 0,
            budget: 0,
        };

        entry.total += 1;
        entry.budget += row.budget;
        if (row.status === 'Planning') entry.planning += 1;
        if (row.status === 'Active') entry.active += 1;
        if (row.status === 'Completed') entry.completed += 1;
        byDepartment.set(row.department, entry);
    }

    return [...byDepartment.entries()]
        .filter(([department]) => match(department))
        .map(([department, entry], index) => ({
            no: index + 1,
            department,
            total: entry.total,
            planning: entry.planning,
            active: entry.active,
            completed: entry.completed,
            budget: entry.budget,
        }));
});

const statusRows = computed(() => {
    const order = ['Planning', 'Active', 'On Hold', 'Completed', 'Cancelled'];

    return order
        .map((status, index) => ({
            no: index + 1,
            status,
            count: rows.value.filter((row) => row.status === status).length,
        }))
        .filter((row) => row.count > 0);
});

const utilizationRows = computed(() =>
    allEmployees.value
        .map((employee) => {
            const leading = rows.value.filter(
                (row) => row.lead_id === employee.id,
            ).length;
            const teaming = rows.value.filter((row) =>
                row.team_ids.includes(employee.id),
            ).length;

            return {
                no: 0,
                name: employee.name,
                noValue: employee.no,
                department: employee.department,
                position: employee.position,
                leading,
                teaming,
                total: leading + teaming,
            };
        })
        .filter((row) => match(row.name) || match(row.department))
        .map((row, index) => ({ ...row, no: index + 1 })),
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

const emptyMessage = computed(() => {
    if (reportType.value === 'summary') {
        return 'No projects match the selected filters.';
    }

    if (reportType.value === 'department') {
        return 'No departments match the search.';
    }

    if (reportType.value === 'utilization') {
        return 'No employees match the search.';
    }

    return 'No projects in the registry yet.';
});

/* ------------------------------------------------------------------ */
/* Generate / export                                                   */
/* ------------------------------------------------------------------ */

const showPreview = ref(false);

const documentColumns = computed<
    { key: string; label: string; numeric?: boolean }[]
>(() => {
    if (reportType.value === 'department') {
        return [
            { key: 'no', label: 'No.' },
            { key: 'department', label: 'Department' },
            { key: 'total', label: 'Projects', numeric: true },
            { key: 'planning', label: 'Planning', numeric: true },
            { key: 'active', label: 'Active', numeric: true },
            { key: 'completed', label: 'Completed', numeric: true },
            { key: 'budget', label: 'Budget (₱)', numeric: true },
        ];
    }

    if (reportType.value === 'status') {
        return [
            { key: 'no', label: 'No.' },
            { key: 'status', label: 'Status' },
            { key: 'count', label: 'Projects', numeric: true },
        ];
    }

    if (reportType.value === 'utilization') {
        return [
            { key: 'no', label: 'No.' },
            { key: 'name', label: 'Employee' },
            { key: 'department', label: 'Department' },
            { key: 'leading', label: 'Leading', numeric: true },
            { key: 'teaming', label: 'On Teams', numeric: true },
            { key: 'total', label: 'Total', numeric: true },
        ];
    }

    return [
        { key: 'no', label: 'No.' },
        { key: 'name', label: 'Project' },
        { key: 'department', label: 'Department' },
        { key: 'lead', label: 'Lead' },
        { key: 'team', label: 'Team Size', numeric: true },
        { key: 'end', label: 'End Date' },
        { key: 'status', label: 'Status' },
        { key: 'progress', label: 'Progress' },
        { key: 'budget', label: 'Budget (₱)', numeric: true },
    ];
});

const documentRows = computed<Record<string, string | number>[]>(() => {
    if (reportType.value === 'summary') {
        return summaryRows.value;
    }

    if (reportType.value === 'department') {
        return departmentRows.value;
    }

    if (reportType.value === 'status') {
        return statusRows.value;
    }

    return utilizationRows.value;
});

const documentTitle = computed(
    () =>
        reportTypes.find((type) => type.value === reportType.value)?.label ??
        'Project Report',
);

const documentNote = computed(() => {
    if (reportType.value === 'department') {
        return 'Project count and approved budget grouped by owning department.';
    }

    if (reportType.value === 'status') {
        return 'The registry broken down by lifecycle stage — Planning, Active, On Hold, Completed and Cancelled.';
    }

    if (reportType.value === 'utilization') {
        return 'How loaded every employee is — projects they lead vs. projects they are assigned to.';
    }

    return 'Every project in the registry with team, status, milestone progress and approved budget.';
});

function generate(): void {
    showPreview.value = true;
}

function exportExcel(): void {
    const headers = documentColumns.value.map(
        (column) => column.label.replace(' (🛎)', ''),
    );
    const payload = documentRows.value.map((row) =>
        documentColumns.value.map((column) => row[column.key] ?? ''),
    );

    exportSheet(`projects-${reportType.value}`, 'Projects', headers, payload);
}
</script>

<template>
    <Head title="Reports — Project Management" />

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
                <SelectTrigger class="w-60">
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
                    placeholder="Search project, employee or department…"
                    class="pl-9"
                />
            </div>
        </div>

        <!-- ================= PROJECT SUMMARY ================= -->
        <div
            v-if="reportType === 'summary'"
            class="rounded-xl border border-slate-200 bg-white shadow-sm"
        >
            <div class="flex items-center justify-between border-b px-5 py-4">
                <h2 class="font-semibold text-slate-900">Project summary</h2>
                <span
                    v-if="summaryRows.length > 0"
                    class="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 tabular-nums dark:bg-blue-500/15 dark:text-blue-300"
                >
                    {{ summaryRows.length }}
                    project{{ summaryRows.length === 1 ? '' : 's' }}
                </span>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full min-w-[1050px] text-sm">
                    <thead>
                        <tr
                            class="border-b text-left text-xs tracking-wide text-muted-foreground uppercase"
                        >
                            <th class="px-4 py-3 font-medium">No.</th>
                            <th class="px-4 py-3 font-medium">Project</th>
                            <th class="px-4 py-3 font-medium">Department</th>
                            <th class="px-4 py-3 font-medium">Lead</th>
                            <th class="px-4 py-3 text-right font-medium">
                                Team
                            </th>
                            <th class="px-4 py-3 font-medium">End date</th>
                            <th class="px-4 py-3 font-medium">Status</th>
                            <th class="px-4 py-3 font-medium">Progress</th>
                            <th class="px-4 py-3 text-right font-medium">
                                Budget (₱)
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="row in paged(summaryRows)"
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
                            <td class="px-4 py-3 text-slate-700">
                                {{ row.lead }}
                            </td>
                            <td
                                class="px-4 py-3 text-right text-muted-foreground tabular-nums"
                            >
                                {{ row.team }}
                            </td>
                            <td
                                class="px-4 py-3 text-muted-foreground tabular-nums"
                            >
                                {{ row.end }}
                            </td>
                            <td class="px-4 py-3">
                                <span
                                    class="inline-flex rounded-full border px-2 py-0.5 text-xs font-medium"
                                    :class="
                                        statusTone[row.status] ??
                                        'border-slate-200 bg-slate-50 text-slate-600'
                                    "
                                >
                                    {{ row.status }}
                                </span>
                            </td>
                            <td class="px-4 py-3 text-slate-700 tabular-nums">
                                {{ row.progress }}
                            </td>
                            <td
                                class="px-4 py-3 text-right text-slate-700 tabular-nums"
                            >
                                {{ row.budget.toLocaleString() }}
                            </td>
                        </tr>
                        <tr v-if="summaryRows.length === 0">
                            <td
                                colspan="9"
                                class="px-4 py-10 text-center text-sm text-muted-foreground"
                            >
                                {{ emptyMessage }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <PaginationBar
                :total="summaryRows.length"
                :page-size="PAGE_SIZE"
                v-model:page="reportPage"
            />
        </div>

        <!-- ================= BY DEPARTMENT ================= -->
        <div
            v-else-if="reportType === 'department'"
            class="rounded-xl border border-slate-200 bg-white shadow-sm"
        >
            <div class="flex items-center justify-between border-b px-5 py-4">
                <h2 class="font-semibold text-slate-900">
                    Projects by department
                </h2>
                <span
                    v-if="departmentRows.length > 0"
                    class="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 tabular-nums dark:bg-blue-500/15 dark:text-blue-300"
                >
                    {{ departmentRows.length }} departments
                </span>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full min-w-[750px] text-sm">
                    <thead>
                        <tr
                            class="border-b text-left text-xs tracking-wide text-muted-foreground uppercase"
                        >
                            <th class="px-4 py-3 font-medium">No.</th>
                            <th class="px-4 py-3 font-medium">Department</th>
                            <th class="px-4 py-3 text-right font-medium">
                                Projects
                            </th>
                            <th class="px-4 py-3 text-right font-medium">
                                Planning
                            </th>
                            <th class="px-4 py-3 text-right font-medium">
                                Active
                            </th>
                            <th class="px-4 py-3 text-right font-medium">
                                Completed
                            </th>
                            <th class="px-4 py-3 text-right font-medium">
                                Budget (₱)
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="row in paged(departmentRows)"
                            :key="row.no"
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
                            <td
                                class="px-4 py-3 text-right font-semibold text-slate-900 tabular-nums"
                            >
                                {{ row.total }}
                            </td>
                            <td
                                class="px-4 py-3 text-right text-muted-foreground tabular-nums"
                            >
                                {{ row.planning }}
                            </td>
                            <td
                                class="px-4 py-3 text-right tabular-nums"
                                :class="
                                    row.active > 0
                                        ? 'font-medium text-blue-600'
                                        : 'text-muted-foreground'
                                "
                            >
                                {{ row.active }}
                            </td>
                            <td
                                class="px-4 py-3 text-right tabular-nums"
                                :class="
                                    row.completed > 0
                                        ? 'font-medium text-emerald-600'
                                        : 'text-muted-foreground'
                                "
                            >
                                {{ row.completed }}
                            </td>
                            <td
                                class="px-4 py-3 text-right text-slate-700 tabular-nums"
                            >
                                {{ row.budget.toLocaleString() }}
                            </td>
                        </tr>
                        <tr v-if="departmentRows.length === 0">
                            <td
                                colspan="7"
                                class="px-4 py-10 text-center text-sm text-muted-foreground"
                            >
                                {{ emptyMessage }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <PaginationBar
                :total="departmentRows.length"
                :page-size="PAGE_SIZE"
                v-model:page="reportPage"
            />
        </div>

        <!-- ================= BY STATUS ================= -->
        <div
            v-else-if="reportType === 'status'"
            class="rounded-xl border border-slate-200 bg-white shadow-sm"
        >
            <div class="flex items-center justify-between border-b px-5 py-4">
                <h2 class="font-semibold text-slate-900">Projects by status</h2>
                <span
                    v-if="statusRows.length > 0"
                    class="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 tabular-nums dark:bg-blue-500/15 dark:text-blue-300"
                >
                    {{ rows.length }} total projects
                </span>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full min-w-[500px] text-sm">
                    <thead>
                        <tr
                            class="border-b text-left text-xs tracking-wide text-muted-foreground uppercase"
                        >
                            <th class="px-4 py-3 font-medium">No.</th>
                            <th class="px-4 py-3 font-medium">Status</th>
                            <th class="px-4 py-3 text-right font-medium">
                                Projects
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="row in statusRows"
                            :key="row.status"
                            class="border-b transition-colors last:border-0 hover:bg-muted/40"
                        >
                            <td
                                class="px-4 py-3 text-muted-foreground tabular-nums"
                            >
                                {{ row.no }}
                            </td>
                            <td class="px-4 py-3">
                                <span
                                    class="inline-flex rounded-full border px-2 py-0.5 text-xs font-medium"
                                    :class="
                                        statusTone[row.status] ??
                                        'border-slate-200 bg-slate-50 text-slate-600'
                                    "
                                >
                                    {{ row.status }}
                                </span>
                            </td>
                            <td
                                class="px-4 py-3 text-right font-semibold text-slate-900 tabular-nums"
                            >
                                {{ row.count }}
                            </td>
                        </tr>
                        <tr v-if="statusRows.length === 0">
                            <td
                                colspan="3"
                                class="px-4 py-10 text-center text-sm text-muted-foreground"
                            >
                                {{ emptyMessage }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- ================= TEAM UTILIZATION ================= -->
        <div
            v-else
            class="rounded-xl border border-slate-200 bg-white shadow-sm"
        >
            <div class="flex items-center justify-between border-b px-5 py-4">
                <h2 class="font-semibold text-slate-900">Team utilization</h2>
                <span
                    v-if="utilizationRows.length > 0"
                    class="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 tabular-nums dark:bg-blue-500/15 dark:text-blue-300"
                >
                    {{ utilizationRows.length }} employees
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
                                Leading
                            </th>
                            <th class="px-4 py-3 text-right font-medium">
                                On teams
                            </th>
                            <th class="px-4 py-3 text-right font-medium">
                                Total
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="row in paged(utilizationRows)"
                            :key="row.no"
                            class="border-b transition-colors last:border-0 hover:bg-muted/40"
                        >
                            <td
                                class="px-4 py-3 text-muted-foreground tabular-nums"
                            >
                                {{ row.no }}
                            </td>
                            <td class="px-4 py-3">
                                <p class="font-medium text-slate-900">
                                    {{ row.name }}
                                </p>
                                <p class="text-xs text-muted-foreground">
                                    {{ row.noValue }}
                                </p>
                            </td>
                            <td class="px-4 py-3 text-muted-foreground">
                                {{ row.department }}
                            </td>
                            <td
                                class="px-4 py-3 text-right font-medium text-blue-600 tabular-nums"
                            >
                                {{ row.leading }}
                            </td>
                            <td
                                class="px-4 py-3 text-right text-muted-foreground tabular-nums"
                            >
                                {{ row.teaming }}
                            </td>
                            <td
                                class="px-4 py-3 text-right font-semibold text-slate-900 tabular-nums"
                            >
                                {{ row.total }}
                            </td>
                        </tr>
                        <tr v-if="utilizationRows.length === 0">
                            <td
                                colspan="6"
                                class="px-4 py-10 text-center text-sm text-muted-foreground"
                            >
                                {{ emptyMessage }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <PaginationBar
                :total="utilizationRows.length"
                :page-size="PAGE_SIZE"
                v-model:page="reportPage"
            />
        </div>
    </div>

    <!-- Official report preview -->
    <RecordPrintModal
        v-if="showPreview"
        :heading="`${documentTitle} — ${documentRows.length} row${documentRows.length === 1 ? '' : 's'}`"
        subtitle="Official project report · ready to print"
        @close="showPreview = false"
    >
        <AttendanceReportDocument
            :title="documentTitle"
            :period="`As of ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`"
            system="Project Management System"
            :columns="documentColumns"
            :rows="documentRows"
            :note="documentNote"
        />
    </RecordPrintModal>
</template>