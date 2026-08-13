<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import {
    ClipboardCheck,
    FileBarChart2,
    FileSpreadsheet,
    GraduationCap,
    Info,
    Search,
    Target,
    TrendingUp,
    X,
} from '@lucide/vue';
import { computed, ref, watch } from 'vue';
import { toast } from 'vue-sonner';
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
import {
    PERFORMANCE_CRITERIA,
    useDemoPerformance,
} from '@/composables/useDemoPerformance';
import type { PerformanceEmployee } from '@/composables/useDemoPerformance';
import { cn } from '@/lib/utils';
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

const { rows, goalRows, addReview, submit, finalize, remove, formatMoney } =
    useDemoPerformance(props.employees, props.reviews, props.goals);

const periodLabel = (value: string): string =>
    props.periods.find((period) => period.value === value)?.label ?? value;

const currentPeriod =
    props.periods.find((period) => period.status === 'In Progress')?.value ??
    props.periods[0]?.value;

/* ------------------------------------------------------------------ */
/* Period strip                                                       */
/* ------------------------------------------------------------------ */

const periodSummary = computed(() =>
    props.periods.map((period) => {
        const periodRows = rows.value.filter(
            (row) => row.period === period.value,
        );
        const average =
            periodRows.length === 0
                ? 0
                : periodRows.reduce((sum, row) => sum + row.overall, 0) /
                  periodRows.length;

        return {
            ...period,
            count: periodRows.length,
            average,
        };
    }),
);

const periodStatusTone: Record<string, string> = {
    Finalized: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
};

/* ------------------------------------------------------------------ */
/* Filters                                                            */
/* ------------------------------------------------------------------ */

/* Query-param pre-fill so the dashboard stat cards can deep-link into a
 * filtered directory: ?period=2026-H2, ?raise=1, ?gaps=1. */
function queryParam(name: string): string | null {
    if (typeof window === 'undefined') {
        return null;
    }

    return new URLSearchParams(window.location.search).get(name);
}

const initialPeriod = queryParam('period');

const periodFilter = ref(
    initialPeriod && props.periods.some((p) => p.value === initialPeriod)
        ? initialPeriod
        : 'all',
);
const statusFilter = ref('all');
const search = ref('');
const raiseOnly = ref(queryParam('raise') === '1');
const gapsOnly = ref(queryParam('gaps') === '1');

const filtered = computed(() => {
    const term = search.value.trim().toLowerCase();

    return rows.value.filter(
        (row) =>
            (periodFilter.value === 'all' ||
                row.period === periodFilter.value) &&
            (statusFilter.value === 'all' ||
                row.status === statusFilter.value) &&
            (!raiseOnly.value ||
                (row.raise_pct > 0 && row.status === 'Finalized')) &&
            (!gapsOnly.value ||
                (row.gaps.length > 0 && row.status === 'Finalized')) &&
            (term === '' ||
                row.name.toLowerCase().includes(term) ||
                row.no.toLowerCase().includes(term) ||
                row.department.toLowerCase().includes(term)),
    );
});

const ratingTone: Record<string, string> = {
    Outstanding: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Exceeds Expectations': 'bg-blue-50 text-blue-700 border-blue-200',
    'Meets Expectations': 'bg-slate-100 text-slate-600 border-slate-200',
    'Needs Improvement': 'bg-amber-50 text-amber-700 border-amber-200',
    Unsatisfactory: 'bg-red-50 text-red-700 border-red-200',
};

const statusTone: Record<string, string> = {
    Draft: 'bg-amber-50 text-amber-700 border-amber-200',
    Submitted: 'bg-blue-50 text-blue-700 border-blue-200',
    Finalized: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const goalStatusTone: Record<string, string> = {
    'On Track': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Behind: 'bg-amber-50 text-amber-700 border-amber-200',
    'At Risk': 'bg-red-50 text-red-700 border-red-200',
};

const goalBarTone: Record<string, string> = {
    'On Track': 'bg-emerald-500',
    Behind: 'bg-amber-500',
    'At Risk': 'bg-red-500',
};

/* Goals of the current cycle — filtered by the same search box. */
const goalRowsFiltered = computed(() => {
    const term = search.value.trim().toLowerCase();

    return goalRows.value.filter(
        (goal) =>
            term === '' ||
            goal.name.toLowerCase().includes(term) ||
            goal.no.toLowerCase().includes(term) ||
            goal.department.toLowerCase().includes(term) ||
            goal.title.toLowerCase().includes(term),
    );
});

/* ------------------------------------------------------------------ */
/* Pagination                                                          */
/* ------------------------------------------------------------------ */

const PAGE_SIZE = 10;

const reviewPage = ref(1);
const goalPage = ref(1);

const pagedReviews = computed(() => {
    const start = (reviewPage.value - 1) * PAGE_SIZE;

    return filtered.value.slice(start, start + PAGE_SIZE);
});

const pagedGoals = computed(() => {
    const start = (goalPage.value - 1) * PAGE_SIZE;

    return goalRowsFiltered.value.slice(start, start + PAGE_SIZE);
});

/* Changing any filter jumps back to the first page. */
watch([periodFilter, statusFilter, search, raiseOnly, gapsOnly], () => {
    reviewPage.value = 1;
    goalPage.value = 1;
});

/* ------------------------------------------------------------------ */
/* New review modal                                                    */
/* ------------------------------------------------------------------ */

const showModal = ref(false);

/* Tabs — same sticky, full-width style as the other modules' pages. */
const tabs = [
    { key: 'reviews', label: 'Performance Reviews', icon: ClipboardCheck },
    { key: 'goals', label: 'Goals', icon: Target },
] as const;

type TabKey = (typeof tabs)[number]['key'];

const activeTab = ref<TabKey>('reviews');
const draftEmployee = ref('');
const draftPeriod = ref(currentPeriod);
const draftRatings = ref<Record<string, string>>(
    Object.fromEntries(PERFORMANCE_CRITERIA.map((c) => [c.key, '3'])),
);
const draftComments = ref('');

const draftEmployeeOption = computed(() =>
    props.employees.find((row) => row.id === Number(draftEmployee.value)),
);

const ratingOptions = ['1', '2', '3', '4', '5'];

function openModal(): void {
    draftEmployee.value = '';
    draftPeriod.value = currentPeriod;
    draftRatings.value = Object.fromEntries(
        PERFORMANCE_CRITERIA.map((c) => [c.key, '3']),
    );
    draftComments.value = '';
    showModal.value = true;
}

function saveReview(): void {
    if (!draftEmployee.value) {
        toast.error('Choose the employee to review');

        return;
    }

    addReview({
        employee_id: Number(draftEmployee.value),
        period: draftPeriod.value,
        job_knowledge: Number(draftRatings.value.job_knowledge),
        quality: Number(draftRatings.value.quality),
        productivity: Number(draftRatings.value.productivity),
        teamwork: Number(draftRatings.value.teamwork),
        initiative: Number(draftRatings.value.initiative),
        comments: draftComments.value,
    });

    toast.success(
        `${draftEmployeeOption.value?.name ?? 'Employee'} review saved as Draft — submit to send it for approval`,
    );
    showModal.value = false;
}

/* ------------------------------------------------------------------ */
/* Actions                                                            */
/* ------------------------------------------------------------------ */

function submitRow(id: number): void {
    submit(id);
    toast.success('Review submitted — pending finalization');
}

function finalizeRow(id: number): void {
    finalize(id);
    toast.success('Review finalized — rating and outputs are locked');
}

function removeRow(id: number): void {
    remove(id);
    toast('Review withdrawn');
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
        period: periodLabel(row.period),
        overall: row.overall,
        rating: row.rating_label,
        raise: row.raise_pct > 0 ? `${row.raise_pct * 100}%` : '—',
        gaps: row.gaps.length,
        status: row.status,
    })),
);

const printedOn = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
});

function exportExcel(): void {
    const headers = [
        'No.',
        'Employee',
        'Department',
        'Period',
        'Overall',
        'Rating',
        'Raise Rec',
        'Skill Gaps',
        'Status',
    ];
    const rowsCsv = reportRows.value.map((row) => [
        row.no,
        row.name,
        row.department,
        row.period,
        row.overall,
        row.rating,
        row.raise,
        row.gaps,
        row.status,
    ]);
    const csv =
        '\uFEFF' +
        [headers, ...rowsCsv]
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
    link.download = 'performance-reviews.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
}
</script>

<template>
    <Head title="Goals & Reviews — Performance Management" />

    <div class="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <!-- Header -->
        <div
            class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
            <div>
                <h1 class="text-2xl font-bold tracking-tight text-slate-900">
                    Goals & Reviews
                </h1>
                <p class="mt-1 text-sm text-slate-500">
                    Rate each employee on five criteria. Reviews rated 4.0+
                    recommend a merit raise for Payroll; criteria rated 2 or
                    below become training suggestions.
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
            </div>
        </div>

        <!-- How reviews work -->
        <div
            class="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/60 p-4 text-sm text-blue-900"
        >
            <Info class="mt-0.5 size-4 shrink-0 text-blue-600" />
            <div class="text-xs leading-relaxed">
                <p class="font-semibold text-slate-900">How this page works</p>
                <p class="mt-1 text-slate-600">
                    Each employee is reviewed twice a year —
                    <span class="font-medium">H1</span> (Jan–Jun, closed) and
                    <span class="font-medium">H2</span> (Jul–Dec, the current
                    cycle). Reviews move
                    <span class="font-medium">Draft</span> →
                    <span class="font-medium">Submitted</span> →
                    <span class="font-medium">Finalized</span>; only finalized
                    reviews count toward reports. An overall rating of 4.0+
                    recommends a <span class="font-medium">raise</span> for
                    Payroll, and criteria rated 2 or below become
                    <span class="font-medium">skill gaps</span> with a suggested
                    training course.
                </p>
            </div>
        </div>

        <!-- Tabs: sticky, full-width single row, each tab flexes equally -->
        <div
            class="sticky top-2 z-20 flex w-full rounded-xl border bg-card p-1.5 shadow-sm"
        >
            <button
                v-for="tab in tabs"
                :key="tab.key"
                type="button"
                class="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors"
                :class="
                    cn(
                        activeTab === tab.key
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    )
                "
                @click="activeTab = tab.key"
            >
                <component :is="tab.icon" class="size-4" />
                {{ tab.label }}
            </button>
        </div>

        <!-- Review periods strip -->
        <div class="grid gap-3 sm:grid-cols-2">
            <div
                v-for="period in periodSummary"
                :key="period.value"
                class="flex flex-col gap-1.5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
                <div class="flex items-center justify-between gap-2">
                    <p class="font-semibold text-slate-900">
                        {{ period.label }}
                    </p>
                    <span
                        class="inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium"
                        :class="periodStatusTone[period.status]"
                    >
                        {{ period.status }}
                    </span>
                </div>
                <div
                    class="mt-auto flex items-center justify-between pt-1 text-xs text-slate-600"
                >
                    <span class="tabular-nums">
                        {{ period.count }} reviews
                    </span>
                    <span class="tabular-nums">
                        {{
                            period.count === 0
                                ? '—'
                                : `${period.average.toFixed(1)} avg`
                        }}
                    </span>
                </div>
            </div>
        </div>

        <!-- Reviews tab -->
        <div v-if="activeTab === 'reviews'" class="flex flex-col gap-6">
            <!-- Filters -->
            <div
                class="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
                <Select v-model="periodFilter">
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

                <Select v-model="statusFilter">
                    <SelectTrigger class="w-40">
                        <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Submitted">Submitted</SelectItem>
                        <SelectItem value="Finalized">Finalized</SelectItem>
                    </SelectContent>
                </Select>

                <div class="relative w-64">
                    <Search
                        class="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                        v-model="search"
                        placeholder="Search employee, ID or department…"
                        class="pl-9"
                    />
                </div>

                <div class="flex items-center gap-2">
                    <button
                        type="button"
                        class="inline-flex h-9 items-center gap-1.5 rounded-md border px-3 text-xs font-medium transition-colors"
                        :class="
                            raiseOnly
                                ? 'border-blue-200 bg-blue-50 text-blue-700'
                                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        "
                        @click="raiseOnly = !raiseOnly"
                    >
                        <TrendingUp class="size-3.5" />
                        Raise recs
                    </button>
                    <button
                        type="button"
                        class="inline-flex h-9 items-center gap-1.5 rounded-md border px-3 text-xs font-medium transition-colors"
                        :class="
                            gapsOnly
                                ? 'border-blue-200 bg-blue-50 text-blue-700'
                                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        "
                        @click="gapsOnly = !gapsOnly"
                    >
                        <GraduationCap class="size-3.5" />
                        Skill gaps
                    </button>
                </div>
            </div>

            <!-- Reviews table -->
            <div class="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div
                    class="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4"
                >
                    <h2 class="font-semibold text-slate-900">
                        Performance reviews
                    </h2>
                    <div class="flex items-center gap-3">
                        <span
                            class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                        >
                            {{ filtered.length }} review{{
                                filtered.length === 1 ? '' : 's'
                            }}
                        </span>
                        <Button
                            class="bg-blue-600 hover:bg-blue-700"
                            size="sm"
                            @click="openModal"
                        >
                            <ClipboardCheck class="size-4" />
                            New review
                        </Button>
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full min-w-[1000px] text-sm">
                        <thead>
                            <tr
                                class="border-b text-left text-xs tracking-wide text-muted-foreground uppercase"
                            >
                                <th class="px-4 py-3 font-medium">No.</th>
                                <th class="px-4 py-3 font-medium">Employee</th>
                                <th class="px-4 py-3 font-medium">Period</th>
                                <th class="px-4 py-3 font-medium">Rating</th>
                                <th class="px-4 py-3 font-medium">Raise rec</th>
                                <th class="px-4 py-3 font-medium">
                                    Skill gaps
                                </th>
                                <th class="px-4 py-3 font-medium">Status</th>
                                <th class="px-4 py-3 text-right font-medium">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="(row, index) in pagedReviews"
                                :key="row.id"
                                class="border-b transition-colors last:border-0 hover:bg-muted/40"
                            >
                                <td
                                    class="px-4 py-3 text-muted-foreground tabular-nums"
                                >
                                    {{
                                        (reviewPage - 1) * PAGE_SIZE + index + 1
                                    }}
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
                                <td class="px-4 py-3 text-muted-foreground">
                                    {{ periodLabel(row.period) }}
                                </td>
                                <td class="px-4 py-3">
                                    <div class="flex items-center gap-2">
                                        <span
                                            class="text-base font-semibold text-slate-900 tabular-nums"
                                        >
                                            {{ row.overall.toFixed(1) }}
                                        </span>
                                        <span
                                            class="inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium"
                                            :class="
                                                ratingTone[row.rating_label]
                                            "
                                        >
                                            {{ row.rating_label }}
                                        </span>
                                    </div>
                                </td>
                                <td class="px-4 py-3">
                                    <span
                                        v-if="row.raise_pct > 0"
                                        class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700"
                                        :title="`New salary ${formatMoney(row.new_salary)}`"
                                    >
                                        +{{ row.raise_pct * 100 }}% ·
                                        {{ formatMoney(row.raise_amount) }}
                                    </span>
                                    <span v-else class="text-muted-foreground">
                                        —
                                    </span>
                                </td>
                                <td class="px-4 py-3">
                                    <span
                                        v-if="row.gaps.length > 0"
                                        class="inline-flex rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700"
                                        :title="
                                            row.gaps
                                                .map((gap) => gap.training)
                                                .join(', ')
                                        "
                                    >
                                        {{ row.gaps.length }} gap{{
                                            row.gaps.length === 1 ? '' : 's'
                                        }}
                                    </span>
                                    <span v-else class="text-muted-foreground">
                                        —
                                    </span>
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
                                        <Link
                                            :href="`/demo/performance/records/${row.employee_id}`"
                                            class="inline-flex items-center rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                                        >
                                            View
                                        </Link>
                                        <Button
                                            v-if="row.status === 'Draft'"
                                            size="sm"
                                            class="bg-blue-600 hover:bg-blue-700"
                                            @click="submitRow(row.id)"
                                        >
                                            Submit
                                        </Button>
                                        <Button
                                            v-if="row.status === 'Submitted'"
                                            size="sm"
                                            class="bg-blue-600 hover:bg-blue-700"
                                            @click="finalizeRow(row.id)"
                                        >
                                            Finalize
                                        </Button>
                                        <Button
                                            v-if="
                                                row.status === 'Draft' ||
                                                row.status === 'Submitted'
                                            "
                                            variant="outline"
                                            size="sm"
                                            class="text-slate-600 shadow-none hover:bg-slate-50 hover:text-slate-900"
                                            @click="removeRow(row.id)"
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="filtered.length === 0">
                                <td
                                    colspan="8"
                                    class="px-4 py-10 text-center text-sm text-muted-foreground"
                                >
                                    No reviews match the selected filters.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <PaginationBar
                    :total="filtered.length"
                    :page-size="PAGE_SIZE"
                    v-model:page="reviewPage"
                />
            </div>
        </div>

        <!-- Goals tab -->
        <div v-else class="flex flex-col gap-6">
            <div class="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div
                    class="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4"
                >
                    <h2 class="font-semibold text-slate-900">
                        Goals — H2 2026 cycle
                    </h2>
                    <div class="flex items-center gap-3">
                        <div class="relative w-64">
                            <Search
                                class="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                            />
                            <Input
                                v-model="search"
                                placeholder="Search employee or goal…"
                                class="pl-9"
                            />
                        </div>
                        <span
                            class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                        >
                            {{ goalRowsFiltered.length }} goal{{
                                goalRowsFiltered.length === 1 ? '' : 's'
                            }}
                        </span>
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full min-w-[900px] text-sm">
                        <thead>
                            <tr
                                class="border-b text-left text-xs tracking-wide text-muted-foreground uppercase"
                            >
                                <th class="px-4 py-3 font-medium">No.</th>
                                <th class="px-4 py-3 font-medium">Employee</th>
                                <th class="px-4 py-3 font-medium">Goal</th>
                                <th class="px-4 py-3 font-medium">Category</th>
                                <th class="px-4 py-3 font-medium">Progress</th>
                                <th class="px-4 py-3 font-medium">Due</th>
                                <th class="px-4 py-3 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="(goal, index) in pagedGoals"
                                :key="goal.id"
                                class="border-b transition-colors last:border-0 hover:bg-muted/40"
                            >
                                <td
                                    class="px-4 py-3 text-muted-foreground tabular-nums"
                                >
                                    {{ (goalPage - 1) * PAGE_SIZE + index + 1 }}
                                </td>
                                <td class="px-4 py-3">
                                    <p class="font-medium text-slate-900">
                                        {{ goal.name }}
                                    </p>
                                    <p class="text-xs text-muted-foreground">
                                        {{ goal.position }} ·
                                        {{ goal.department }}
                                    </p>
                                </td>
                                <td class="px-4 py-3 text-slate-700">
                                    {{ goal.title }}
                                </td>
                                <td class="px-4 py-3">
                                    <span
                                        class="inline-flex rounded-full border px-2 py-0.5 text-xs font-medium"
                                        :class="'border-slate-200 bg-slate-50 text-slate-600'"
                                    >
                                        {{ goal.category }}
                                    </span>
                                </td>
                                <td class="px-4 py-3">
                                    <div class="flex items-center gap-2">
                                        <div
                                            class="h-1.5 w-24 overflow-hidden rounded-full bg-slate-200"
                                        >
                                            <div
                                                class="h-full rounded-full"
                                                :class="
                                                    goalBarTone[goal.status]
                                                "
                                                :style="{
                                                    width: `${goal.progress}%`,
                                                }"
                                            ></div>
                                        </div>
                                        <span
                                            class="text-xs font-medium text-slate-600 tabular-nums"
                                        >
                                            {{ goal.progress }}%
                                        </span>
                                    </div>
                                </td>
                                <td
                                    class="px-4 py-3 text-muted-foreground tabular-nums"
                                >
                                    {{ goal.due }}
                                </td>
                                <td class="px-4 py-3">
                                    <span
                                        class="inline-flex rounded-full border px-2 py-0.5 text-xs font-medium"
                                        :class="goalStatusTone[goal.status]"
                                    >
                                        {{ goal.status }}
                                    </span>
                                </td>
                            </tr>
                            <tr v-if="goalRowsFiltered.length === 0">
                                <td
                                    colspan="7"
                                    class="px-4 py-10 text-center text-sm text-muted-foreground"
                                >
                                    No goals match the selected filters.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <PaginationBar
                    :total="goalRowsFiltered.length"
                    :page-size="PAGE_SIZE"
                    v-model:page="goalPage"
                />
            </div>
        </div>
    </div>

    <!-- Generate report preview -->
    <RecordPrintModal
        v-if="showPreview"
        :heading="`Performance Review Summary — ${reportRows.length} review${reportRows.length === 1 ? '' : 's'}`"
        subtitle="Official performance document · ready to print"
        @close="showPreview = false"
    >
        <AttendanceReportDocument
            title="Performance Review Summary"
            :period="`As of ${printedOn}`"
            system="Performance Management System"
            :columns="[
                { key: 'no', label: 'No.' },
                { key: 'name', label: 'Employee' },
                { key: 'department', label: 'Department' },
                { key: 'period', label: 'Period' },
                { key: 'overall', label: 'Overall', numeric: true },
                { key: 'rating', label: 'Rating' },
                { key: 'raise', label: 'Raise Rec' },
                { key: 'gaps', label: 'Skill Gaps', numeric: true },
                { key: 'status', label: 'Status' },
            ]"
            :rows="reportRows"
            note="Reviews rated 4.0+ recommend a merit raise handed to Payroll; criteria rated 2 or below become training suggestions for the Training module."
        />
    </RecordPrintModal>

    <!-- New review modal -->
    <Teleport to="body">
        <div
            v-if="showModal"
            class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm sm:p-8"
            @click.self="showModal = false"
        >
            <div
                class="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl"
            >
                <div
                    class="flex items-center justify-between border-b px-6 py-4"
                >
                    <div>
                        <h3 class="text-base font-bold text-slate-900">
                            New performance review
                        </h3>
                        <p class="text-xs text-muted-foreground">
                            Starts as Draft — submit, then finalize to lock the
                            rating.
                        </p>
                    </div>
                    <button
                        type="button"
                        class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        aria-label="Close"
                        @click="showModal = false"
                    >
                        <X class="size-5" />
                    </button>
                </div>

                <div class="overflow-y-auto px-6 py-5">
                    <!-- Employee & period -->
                    <div class="grid gap-4 sm:grid-cols-2 sm:gap-5">
                        <div class="flex flex-col gap-1.5">
                            <label
                                class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                            >
                                Employee
                            </label>
                            <Select v-model="draftEmployee">
                                <SelectTrigger>
                                    <SelectValue
                                        placeholder="Choose employee"
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem
                                        v-for="employee in employees"
                                        :key="employee.id"
                                        :value="String(employee.id)"
                                    >
                                        {{ employee.name }} ·
                                        {{ employee.no }}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <p
                                v-if="draftEmployeeOption"
                                class="text-xs text-slate-500"
                            >
                                {{ draftEmployeeOption.position }} ·
                                {{ draftEmployeeOption.department }}
                            </p>
                        </div>

                        <div class="flex flex-col gap-1.5">
                            <label
                                class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                            >
                                Review period
                            </label>
                            <Select v-model="draftPeriod">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem
                                        v-for="period in periods"
                                        :key="period.value"
                                        :value="period.value"
                                    >
                                        {{ period.label }}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <!-- Ratings -->
                    <div class="mt-6">
                        <p
                            class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                        >
                            Ratings (1–5)
                        </p>
                        <p class="mt-0.5 text-xs text-slate-500">
                            Rate each criterion from 1 (poor) to 5
                            (outstanding).
                        </p>
                        <div
                            class="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5 sm:gap-4"
                        >
                            <div
                                v-for="criterion in PERFORMANCE_CRITERIA"
                                :key="criterion.key"
                                class="flex flex-col gap-1.5"
                            >
                                <label
                                    class="truncate text-[11px] font-medium text-slate-600"
                                    :title="criterion.label"
                                >
                                    {{ criterion.label }}
                                </label>
                                <Select v-model="draftRatings[criterion.key]">
                                    <SelectTrigger class="justify-center">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem
                                            v-for="value in ratingOptions"
                                            :key="value"
                                            :value="value"
                                        >
                                            {{ value }}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <!-- Comments -->
                    <div class="mt-6 flex flex-col gap-1.5">
                        <label
                            class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                        >
                            Comments
                        </label>
                        <textarea
                            v-model="draftComments"
                            rows="3"
                            placeholder="Summary of the review period…"
                            class="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        ></textarea>
                    </div>
                </div>

                <div class="flex justify-end gap-2 border-t px-6 py-4">
                    <Button variant="ghost" @click="showModal = false">
                        Cancel
                    </Button>
                    <Button
                        class="bg-blue-600 hover:bg-blue-700"
                        @click="saveReview"
                    >
                        <ClipboardCheck class="size-4" />
                        Save review
                    </Button>
                </div>
            </div>
        </div>
    </Teleport>
</template>
