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
import { useDemoPerformance } from '@/composables/useDemoPerformance';
import type { PerformanceEmployee } from '@/composables/useDemoPerformance';
import type {
    DemoPerformanceGoal,
    DemoPerformancePeriod,
    DemoPerformanceReview,
} from '@/types';

const props = defineProps<{
    employees: PerformanceEmployee[];
    periods: DemoPerformancePeriod[];
    reviews: DemoPerformanceReview[];
    goals: DemoPerformanceGoal[];
}>();

const { rows, goalRows, formatMoney } = useDemoPerformance(
    props.employees,
    props.reviews,
    props.goals,
);

const periodLabel = (value: string): string =>
    props.periods.find((period) => period.value === value)?.label ?? value;

/* ------------------------------------------------------------------ */
/* Report type + filters                                               */
/* ------------------------------------------------------------------ */

const reportTypes = [
    { value: 'ratings', label: 'Rating Summary Report' },
    { value: 'raises', label: 'Raise Recommendations Report' },
    { value: 'gaps', label: 'Skill Gaps Report' },
    { value: 'goals', label: 'Goals Report' },
] as const;

type ReportType = (typeof reportTypes)[number]['value'];

const reportType = ref<ReportType>('ratings');
const periodFilter = ref('all');
const search = ref('');

const term = computed(() => search.value.trim().toLowerCase());

const match = (name: string): boolean =>
    term.value === '' || name.toLowerCase().includes(term.value);

const byPeriod = (period: string): boolean =>
    periodFilter.value === 'all' || period === periodFilter.value;

const ratingRows = computed(() =>
    rows.value
        .filter((row) => byPeriod(row.period) && match(row.name))
        .map((row, index) => ({
            no: index + 1,
            name: row.name,
            department: row.department,
            period: periodLabel(row.period),
            job_knowledge: row.job_knowledge,
            quality: row.quality,
            productivity: row.productivity,
            teamwork: row.teamwork,
            initiative: row.initiative,
            overall: row.overall,
            rating: row.rating_label,
        })),
);
const raiseRows = computed(() =>
    rows.value
        .filter(
            (row) =>
                row.raise_pct > 0 &&
                row.status === 'Finalized' &&
                byPeriod(row.period) &&
                match(row.name),
        )
        .map((row, index) => ({
            no: index + 1,
            name: row.name,
            department: row.department,
            period: periodLabel(row.period),
            overall: row.overall,
            salary: row.salary,
            raise: `${row.raise_pct * 100}%`,
            amount: row.raise_amount,
            new_salary: row.new_salary,
        })),
);

const gapRows = computed(() => {
    const out: {
        no: number;
        name: string;
        department: string;
        period: string;
        criterion: string;
        training: string;
        overall: number;
    }[] = [];

    for (const row of rows.value) {
        if (
            row.status !== 'Finalized' ||
            !byPeriod(row.period) ||
            !match(row.name)
        ) {
            continue;
        }

        for (const gap of row.gaps) {
            out.push({
                no: out.length + 1,
                name: row.name,
                department: row.department,
                period: periodLabel(row.period),
                criterion: gap.criterion,
                training: gap.training,
                overall: row.overall,
            });
        }
    }

    return out;
});

const goalReportRows = computed(() =>
    goalRows.value
        .filter((goal) => match(goal.name))
        .map((goal, index) => ({
            no: index + 1,
            name: goal.name,
            department: goal.department,
            title: goal.title,
            category: goal.category,
            progress: goal.progress,
            due: goal.due,
            status: goal.status,
        })),
);

const ratingTone: Record<string, string> = {
    Outstanding: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Exceeds Expectations': 'bg-blue-50 text-blue-700 border-blue-200',
    'Meets Expectations': 'bg-slate-100 text-slate-600 border-slate-200',
    'Needs Improvement': 'bg-amber-50 text-amber-700 border-amber-200',
    Unsatisfactory: 'bg-red-50 text-red-700 border-red-200',
};

const goalStatusTone: Record<string, string> = {
    'On Track': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Behind: 'bg-amber-50 text-amber-700 border-amber-200',
    'At Risk': 'bg-red-50 text-red-700 border-red-200',
};

/* ------------------------------------------------------------------ */
/* Pagination                                                          */
/* ------------------------------------------------------------------ */

const PAGE_SIZE = 10;
const reportPage = ref(1);

/** Slice the current report's rows to one page. */
function paged<T>(rows: T[]): T[] {
    const start = (reportPage.value - 1) * PAGE_SIZE;

    return rows.slice(start, start + PAGE_SIZE);
}

/* Changing the report type or any filter jumps back to the first page. */
watch([reportType, periodFilter, search], () => {
    reportPage.value = 1;
});

/* ------------------------------------------------------------------ */
/* Generate / export                                                   */
/* ------------------------------------------------------------------ */

const showPreview = ref(false);

const documentColumns = computed<
    { key: string; label: string; numeric?: boolean }[]
>(() => {
    if (reportType.value === 'ratings') {
        return [
            { key: 'no', label: 'No.' },
            { key: 'name', label: 'Employee' },
            { key: 'department', label: 'Department' },
            { key: 'period', label: 'Period' },
            { key: 'job_knowledge', label: 'Job Knowledge', numeric: true },
            { key: 'quality', label: 'Quality', numeric: true },
            { key: 'productivity', label: 'Productivity', numeric: true },
            { key: 'teamwork', label: 'Teamwork', numeric: true },
            { key: 'initiative', label: 'Initiative', numeric: true },
            { key: 'overall', label: 'Overall', numeric: true },
            { key: 'rating', label: 'Rating' },
        ];
    }

    if (reportType.value === 'raises') {
        return [
            { key: 'no', label: 'No.' },
            { key: 'name', label: 'Employee' },
            { key: 'department', label: 'Department' },
            { key: 'period', label: 'Period' },
            { key: 'overall', label: 'Overall', numeric: true },
            { key: 'salary', label: 'Current Salary', numeric: true },
            { key: 'raise', label: 'Raise %' },
            { key: 'amount', label: 'Increase', numeric: true },
            { key: 'new_salary', label: 'New Salary', numeric: true },
        ];
    }

    if (reportType.value === 'gaps') {
        return [
            { key: 'no', label: 'No.' },
            { key: 'name', label: 'Employee' },
            { key: 'department', label: 'Department' },
            { key: 'period', label: 'Period' },
            { key: 'criterion', label: 'Skill Gap' },
            { key: 'training', label: 'Suggested Training' },
            { key: 'overall', label: 'Overall', numeric: true },
        ];
    }

    return [
        { key: 'no', label: 'No.' },
        { key: 'name', label: 'Employee' },
        { key: 'department', label: 'Department' },
        { key: 'title', label: 'Goal' },
        { key: 'category', label: 'Category' },
        { key: 'progress', label: 'Progress %' },
        { key: 'due', label: 'Due' },
        { key: 'status', label: 'Status' },
    ];
});

const documentRows = computed<Record<string, string | number>[]>(() => {
    if (reportType.value === 'ratings') {
        return ratingRows.value;
    }

    if (reportType.value === 'raises') {
        return raiseRows.value;
    }

    if (reportType.value === 'gaps') {
        return gapRows.value;
    }

    return goalReportRows.value;
});

const documentTitle = computed(
    () =>
        reportTypes.find((type) => type.value === reportType.value)?.label ??
        'Performance Report',
);

const documentNote = computed(() => {
    if (reportType.value === 'raises') {
        return 'Raise recommendations are handed to Payroll and applied from the next pay period.';
    }

    if (reportType.value === 'gaps') {
        return 'Each skill gap is sent to the Training module as a suggested course for the employee.';
    }

    if (reportType.value === 'goals') {
        return 'Goals are set at the start of the H2 2026 cycle and tracked against progress each month.';
    }

    return 'Ratings are the average of five criteria (Job Knowledge, Quality, Productivity, Teamwork, Initiative).';
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
    link.download = `performance-${reportType.value}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
}
</script>

<template>
    <Head title="Reports — Performance Management" />

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

            <Select v-model="periodFilter" :disabled="reportType === 'goals'">
                <SelectTrigger class="w-48">
                    <SelectValue placeholder="All periods" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All periods</SelectItem>
                    <SelectItem
                        v-for="period in periods"
                        :key="period.value"
                        :value="period.value"
                    >
                        {{ period.label }}
                    </SelectItem>
                </SelectContent>
            </Select>

            <div class="relative w-64">
                <Search
                    class="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                    v-model="search"
                    placeholder="Search employee…"
                    class="pl-9"
                />
            </div>
        </div>

        <!-- ================= RATING SUMMARY ================= -->
        <div
            v-if="reportType === 'ratings'"
            class="rounded-xl border border-slate-200 bg-white shadow-sm"
        >
            <div class="flex items-center justify-between border-b px-5 py-4">
                <h2 class="font-semibold text-slate-900">
                    Rating summary report
                </h2>
                <span
                    class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                >
                    {{ ratingRows.length }} reviews
                </span>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full min-w-[1100px] text-sm">
                    <thead>
                        <tr
                            class="border-b text-left text-xs tracking-wide text-muted-foreground uppercase"
                        >
                            <th class="px-4 py-3 font-medium">No.</th>
                            <th class="px-4 py-3 font-medium">Employee</th>
                            <th class="px-4 py-3 font-medium">Department</th>
                            <th class="px-4 py-3 font-medium">Period</th>
                            <th class="px-4 py-3 text-right font-medium">
                                Job Know.
                            </th>
                            <th class="px-4 py-3 text-right font-medium">
                                Quality
                            </th>
                            <th class="px-4 py-3 text-right font-medium">
                                Product.
                            </th>
                            <th class="px-4 py-3 text-right font-medium">
                                Teamwork
                            </th>
                            <th class="px-4 py-3 text-right font-medium">
                                Initiative
                            </th>
                            <th class="px-4 py-3 text-right font-medium">
                                Overall
                            </th>
                            <th class="px-4 py-3 font-medium">Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="row in paged(ratingRows)"
                            :key="`${row.no}-${row.period}`"
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
                                {{ row.period }}
                            </td>
                            <td
                                class="px-4 py-3 text-right text-muted-foreground tabular-nums"
                            >
                                {{ row.job_knowledge }}
                            </td>
                            <td
                                class="px-4 py-3 text-right text-muted-foreground tabular-nums"
                            >
                                {{ row.quality }}
                            </td>
                            <td
                                class="px-4 py-3 text-right text-muted-foreground tabular-nums"
                            >
                                {{ row.productivity }}
                            </td>
                            <td
                                class="px-4 py-3 text-right text-muted-foreground tabular-nums"
                            >
                                {{ row.teamwork }}
                            </td>
                            <td
                                class="px-4 py-3 text-right text-muted-foreground tabular-nums"
                            >
                                {{ row.initiative }}
                            </td>
                            <td
                                class="px-4 py-3 text-right font-semibold text-slate-900 tabular-nums"
                            >
                                {{ row.overall.toFixed(1) }}
                            </td>
                            <td class="px-4 py-3">
                                <span
                                    class="inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium"
                                    :class="ratingTone[row.rating]"
                                >
                                    {{ row.rating }}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <PaginationBar
                :total="ratingRows.length"
                :page-size="PAGE_SIZE"
                v-model:page="reportPage"
            />
        </div>

        <!-- ================= RAISE RECOMMENDATIONS ================= -->
        <div
            v-else-if="reportType === 'raises'"
            class="rounded-xl border border-slate-200 bg-white shadow-sm"
        >
            <div class="flex items-center justify-between border-b px-5 py-4">
                <h2 class="font-semibold text-slate-900">
                    Raise recommendations report
                </h2>
                <span
                    class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                >
                    {{ raiseRows.length }} recommendations
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
                            <th class="px-4 py-3 font-medium">Period</th>
                            <th class="px-4 py-3 text-right font-medium">
                                Overall
                            </th>
                            <th class="px-4 py-3 text-right font-medium">
                                Current salary
                            </th>
                            <th class="px-4 py-3 text-right font-medium">
                                Raise
                            </th>
                            <th class="px-4 py-3 text-right font-medium">
                                Increase
                            </th>
                            <th class="px-4 py-3 text-right font-medium">
                                New salary
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="row in paged(raiseRows)"
                            :key="`${row.no}-${row.period}`"
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
                                {{ row.period }}
                            </td>
                            <td
                                class="px-4 py-3 text-right font-semibold text-slate-900 tabular-nums"
                            >
                                {{ row.overall.toFixed(1) }}
                            </td>
                            <td
                                class="px-4 py-3 text-right text-muted-foreground tabular-nums"
                            >
                                {{ formatMoney(row.salary) }}
                            </td>
                            <td
                                class="px-4 py-3 text-right font-medium text-emerald-600 tabular-nums"
                            >
                                {{ row.raise }}
                            </td>
                            <td
                                class="px-4 py-3 text-right font-medium text-emerald-600 tabular-nums"
                            >
                                +{{ formatMoney(row.amount) }}
                            </td>
                            <td
                                class="px-4 py-3 text-right font-semibold text-slate-900 tabular-nums"
                            >
                                {{ formatMoney(row.new_salary) }}
                            </td>
                        </tr>
                        <tr v-if="raiseRows.length === 0">
                            <td
                                colspan="9"
                                class="px-4 py-10 text-center text-sm text-muted-foreground"
                            >
                                No raise recommendations for the selected
                                filters — reviews must rate 4.0 or higher.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <PaginationBar
                :total="raiseRows.length"
                :page-size="PAGE_SIZE"
                v-model:page="reportPage"
            />
        </div>

        <!-- ================= SKILL GAPS ================= -->
        <div
            v-else-if="reportType === 'gaps'"
            class="rounded-xl border border-slate-200 bg-white shadow-sm"
        >
            <div class="flex items-center justify-between border-b px-5 py-4">
                <h2 class="font-semibold text-slate-900">Skill gaps report</h2>
                <span
                    class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                >
                    {{ gapRows.length }} gaps
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
                            <th class="px-4 py-3 font-medium">Period</th>
                            <th class="px-4 py-3 font-medium">Skill gap</th>
                            <th class="px-4 py-3 font-medium">
                                Suggested training
                            </th>
                            <th class="px-4 py-3 text-right font-medium">
                                Overall
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="row in paged(gapRows)"
                            :key="`${row.name}-${row.criterion}-${row.period}`"
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
                                {{ row.period }}
                            </td>
                            <td class="px-4 py-3">
                                <span
                                    class="inline-flex rounded-full border px-2 py-0.5 text-xs font-medium"
                                    :class="'border-amber-200 bg-amber-50 text-amber-700'"
                                >
                                    {{ row.criterion }}
                                </span>
                            </td>
                            <td class="px-4 py-3 text-slate-700">
                                {{ row.training }}
                            </td>
                            <td
                                class="px-4 py-3 text-right text-muted-foreground tabular-nums"
                            >
                                {{ row.overall.toFixed(1) }}
                            </td>
                        </tr>
                        <tr v-if="gapRows.length === 0">
                            <td
                                colspan="7"
                                class="px-4 py-10 text-center text-sm text-muted-foreground"
                            >
                                No skill gaps for the selected filters.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <PaginationBar
                :total="gapRows.length"
                :page-size="PAGE_SIZE"
                v-model:page="reportPage"
            />
        </div>

        <!-- ================= GOALS ================= -->
        <div
            v-else
            class="rounded-xl border border-slate-200 bg-white shadow-sm"
        >
            <div class="flex items-center justify-between border-b px-5 py-4">
                <h2 class="font-semibold text-slate-900">Goals report</h2>
                <span
                    class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                >
                    {{ goalReportRows.length }} goals
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
                            <th class="px-4 py-3 font-medium">Goal</th>
                            <th class="px-4 py-3 font-medium">Category</th>
                            <th class="px-4 py-3 text-right font-medium">
                                Progress
                            </th>
                            <th class="px-4 py-3 font-medium">Due</th>
                            <th class="px-4 py-3 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="row in paged(goalReportRows)"
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
                                {{ row.title }}
                            </td>
                            <td class="px-4 py-3 text-muted-foreground">
                                {{ row.category }}
                            </td>
                            <td class="px-4 py-3 text-right tabular-nums">
                                {{ row.progress }}%
                            </td>
                            <td
                                class="px-4 py-3 text-muted-foreground tabular-nums"
                            >
                                {{ row.due }}
                            </td>
                            <td class="px-4 py-3">
                                <span
                                    class="inline-flex rounded-full border px-2 py-0.5 text-xs font-medium"
                                    :class="goalStatusTone[row.status]"
                                >
                                    {{ row.status }}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <PaginationBar
                :total="goalReportRows.length"
                :page-size="PAGE_SIZE"
                v-model:page="reportPage"
            />
        </div>
    </div>

    <!-- Official report preview -->
    <RecordPrintModal
        v-if="showPreview"
        :heading="`${documentTitle} — ${documentRows.length} record${documentRows.length === 1 ? '' : 's'}`"
        subtitle="Official performance document · ready to print"
        @close="showPreview = false"
    >
        <AttendanceReportDocument
            :title="documentTitle"
            :period="`As of ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`"
            system="Performance Management System"
            :columns="documentColumns"
            :rows="documentRows"
            :note="documentNote"
        />
    </RecordPrintModal>
</template>
