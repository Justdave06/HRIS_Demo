<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import {
    ArrowLeft,
    ArrowUpRight,
    FileBarChart2,
    FileSpreadsheet,
    GraduationCap,
    Star,
    TrendingUp,
} from '@lucide/vue';
import { computed, ref } from 'vue';
import AttendanceReportDocument from '@/components/demo/AttendanceReportDocument.vue';
import RecordPrintModal from '@/components/demo/RecordPrintModal.vue';
import { Button } from '@/components/ui/button';
import {
    PERFORMANCE_CRITERIA,
    useDemoPerformance,
} from '@/composables/useDemoPerformance';
import type { PerformanceEmployee } from '@/composables/useDemoPerformance';
import type {
    DemoPerformanceGoal,
    DemoPerformancePeriod,
    DemoPerformanceReview,
} from '@/types';

const props = defineProps<{
    employee: {
        id: number;
        no: string;
        name: string;
        department: string;
        position: string;
        salary: number;
        manager: string;
    };
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

const currentPeriod =
    props.periods.find((period) => period.status === 'In Progress')?.value ??
    props.periods[0]?.value;

/* ------------------------------------------------------------------ */
/* This employee's reviews + goals                                     */
/* ------------------------------------------------------------------ */

const reviews = computed(() =>
    rows.value
        .filter((row) => row.employee_id === props.employee.id)
        .sort((a, b) => (a.period < b.period ? -1 : 1)),
);

const employeeGoals = computed(() =>
    goalRows.value.filter((goal) => goal.employee_id === props.employee.id),
);

const currentReview = computed(() =>
    reviews.value.find((row) => row.period === currentPeriod),
);

const currentOverall = computed(() =>
    currentReview.value ? currentReview.value.overall.toFixed(1) : '—',
);

const raiseRecommendation = computed(() =>
    reviews.value.find(
        (row) => row.status === 'Finalized' && row.raise_pct > 0,
    ),
);

const gapCount = computed(
    () =>
        reviews.value.filter(
            (row) => row.status === 'Finalized' && row.gaps.length > 0,
        ).length,
);

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

const ratingValueTone: Record<number, string> = {
    1: 'text-red-600',
    2: 'text-amber-600',
    3: 'text-slate-700',
    4: 'text-emerald-600',
    5: 'text-emerald-600',
};

/* ------------------------------------------------------------------ */
/* Generate / export                                                   */
/* ------------------------------------------------------------------ */

const showPreview = ref(false);

const reportRows = computed(() =>
    reviews.value.map((row, index) => ({
        no: index + 1,
        period: periodLabel(row.period),
        job_knowledge: row.job_knowledge,
        quality: row.quality,
        productivity: row.productivity,
        teamwork: row.teamwork,
        initiative: row.initiative,
        overall: row.overall,
        rating: row.rating_label,
        raise: row.raise_pct > 0 ? `${row.raise_pct * 100}%` : '—',
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
        'Period',
        'Job Knowledge',
        'Quality',
        'Productivity',
        'Teamwork',
        'Initiative',
        'Overall',
        'Rating',
        'Raise Rec',
        'Status',
    ];
    const rowsCsv = reportRows.value.map((row) => [
        row.no,
        row.period,
        row.job_knowledge,
        row.quality,
        row.productivity,
        row.teamwork,
        row.initiative,
        row.overall,
        row.rating,
        row.raise,
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
    link.download = `${props.employee.name.replaceAll(' ', '-').toLowerCase()}-performance-record.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
}
</script>

<template>
    <Head :title="`${employee.name} — Performance Record`" />

    <div class="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <!-- Header -->
        <div
            class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
            <div>
                <Link
                    href="/demo/performance/reviews"
                    class="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-blue-600"
                >
                    <ArrowLeft class="size-3.5" />
                    Back to Goals & Reviews
                </Link>
                <h1
                    class="mt-2 text-2xl font-bold tracking-tight text-slate-900"
                >
                    {{ employee.name }}
                </h1>
                <p class="mt-1 text-sm text-slate-500">
                    {{ employee.no }} · {{ employee.position }} ·
                    {{ employee.department }}
                </p>
                <p class="mt-0.5 text-xs text-slate-400">
                    Reviewer: {{ employee.manager }}
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

        <!-- Summary -->
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div
                class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
                <div class="flex items-center justify-between">
                    <p
                        class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                    >
                        Current cycle rating
                    </p>
                    <span class="rounded-lg bg-amber-50 p-2 text-amber-700">
                        <Star class="size-4" />
                    </span>
                </div>
                <p class="mt-2 text-3xl font-bold text-slate-900 tabular-nums">
                    {{ currentOverall }}
                    <span class="text-sm font-medium text-slate-500">
                        / 5
                    </span>
                </p>
                <p v-if="currentReview" class="mt-1 text-xs text-slate-500">
                    {{ currentReview.rating_label }} ·
                    {{ periodLabel(currentReview.period) }}
                </p>
                <p v-else class="mt-1 text-xs text-slate-500">
                    No review for the current cycle yet.
                </p>
            </div>

            <div
                class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
                <div class="flex items-center justify-between">
                    <p
                        class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                    >
                        Reviews on file
                    </p>
                    <span class="rounded-lg bg-blue-50 p-2 text-blue-700">
                        <FileBarChart2 class="size-4" />
                    </span>
                </div>
                <p class="mt-2 text-3xl font-bold text-slate-900 tabular-nums">
                    {{ reviews.length }}
                </p>
                <p class="mt-1 text-xs text-slate-500">
                    {{ reviews.length }} review period{{
                        reviews.length === 1 ? '' : 's'
                    }}
                </p>
            </div>

            <div
                class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
                <div class="flex items-center justify-between">
                    <p
                        class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                    >
                        Raise recommendation
                    </p>
                    <span class="rounded-lg bg-emerald-50 p-2 text-emerald-700">
                        <TrendingUp class="size-4" />
                    </span>
                </div>
                <p
                    v-if="raiseRecommendation"
                    class="mt-2 text-2xl font-bold text-emerald-600 tabular-nums"
                >
                    +{{ raiseRecommendation.raise_pct * 100 }}%
                </p>
                <p v-else class="mt-2 text-3xl font-bold text-slate-900">—</p>
                <p
                    v-if="raiseRecommendation"
                    class="mt-1 text-xs text-slate-500"
                >
                    {{ formatMoney(raiseRecommendation.raise_amount) }} → new
                    salary {{ formatMoney(raiseRecommendation.new_salary) }}
                </p>
                <p v-else class="mt-1 text-xs text-slate-500">
                    Needs a 4.0+ rating to qualify.
                </p>
            </div>

            <div
                class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
                <div class="flex items-center justify-between">
                    <p
                        class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                    >
                        Skill gaps for training
                    </p>
                    <span class="rounded-lg bg-indigo-50 p-2 text-indigo-700">
                        <GraduationCap class="size-4" />
                    </span>
                </div>
                <p class="mt-2 text-3xl font-bold text-slate-900 tabular-nums">
                    {{ gapCount }}
                </p>
                <p class="mt-1 text-xs text-slate-500">
                    Low-rated criteria → suggested courses
                </p>
            </div>
        </div>

        <!-- Performance reviews per period -->
        <div class="space-y-4">
            <div
                v-for="review in reviews"
                :key="review.id"
                class="rounded-xl border border-slate-200 bg-white shadow-sm"
            >
                <div
                    class="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4"
                >
                    <div class="flex items-center gap-3">
                        <h2 class="font-semibold text-slate-900">
                            {{ periodLabel(review.period) }}
                        </h2>
                        <span
                            class="inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium"
                            :class="statusTone[review.status]"
                        >
                            {{ review.status }}
                        </span>
                        <span
                            class="inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium"
                            :class="ratingTone[review.rating_label]"
                        >
                            {{ review.rating_label }}
                        </span>
                    </div>
                    <div
                        class="flex items-center gap-2 text-sm font-semibold text-slate-900 tabular-nums"
                    >
                        <Star class="size-4 text-amber-500" />
                        {{ review.overall.toFixed(1) }}
                        <span class="font-medium text-slate-400">/ 5</span>
                    </div>
                </div>

                <div class="grid gap-6 px-5 py-5 lg:grid-cols-5">
                    <!-- Criteria ratings -->
                    <div class="lg:col-span-3">
                        <div class="grid grid-cols-2 gap-3 sm:grid-cols-5">
                            <div
                                v-for="criterion in PERFORMANCE_CRITERIA"
                                :key="criterion.key"
                                class="rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2.5"
                            >
                                <p
                                    class="text-[11px] leading-tight text-slate-500"
                                >
                                    {{ criterion.label }}
                                </p>
                                <p
                                    class="mt-1 text-xl font-bold tabular-nums"
                                    :class="
                                        ratingValueTone[review[criterion.key]]
                                    "
                                >
                                    {{ review[criterion.key] }}
                                </p>
                            </div>
                        </div>
                        <p
                            v-if="review.comments"
                            class="mt-4 text-sm leading-relaxed text-slate-600"
                        >
                            “{{ review.comments }}”
                        </p>
                    </div>

                    <!-- Outputs -->
                    <div class="flex flex-col gap-3 lg:col-span-2">
                        <div
                            v-if="review.raise_pct > 0"
                            class="rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-3"
                        >
                            <p class="text-xs font-medium text-emerald-700">
                                Raise recommendation → Payroll
                            </p>
                            <p class="mt-1 text-sm text-slate-700">
                                <span class="font-semibold text-emerald-700">
                                    +{{ review.raise_pct * 100 }}%
                                </span>
                                · {{ formatMoney(review.raise_amount) }} — new
                                salary
                                {{ formatMoney(review.new_salary) }}
                                (from {{ formatMoney(review.salary) }})
                            </p>
                        </div>

                        <div
                            v-if="review.gaps.length > 0"
                            class="rounded-xl border border-indigo-100 bg-indigo-50/60 px-4 py-3"
                        >
                            <p class="text-xs font-medium text-indigo-700">
                                Skill gaps → Training
                            </p>
                            <ul class="mt-1.5 space-y-1.5">
                                <li
                                    v-for="gap in review.gaps"
                                    :key="gap.criterion"
                                    class="flex items-start gap-2 text-sm text-slate-700"
                                >
                                    <span
                                        class="mt-1 size-1.5 shrink-0 rounded-full bg-indigo-500"
                                    ></span>
                                    <span>
                                        <span class="font-medium">
                                            {{ gap.criterion }}
                                        </span>
                                        — {{ gap.training }}
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <div
                            v-if="
                                review.raise_pct === 0 &&
                                review.gaps.length === 0
                            "
                            class="rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3 text-sm text-slate-500"
                        >
                            No raise recommendation or skill gaps for this
                            period.
                        </div>
                    </div>
                </div>
            </div>

            <p
                v-if="reviews.length === 0"
                class="py-10 text-center text-sm text-slate-500"
            >
                No performance reviews on file for this employee.
            </p>
        </div>

        <!-- Goals -->
        <div class="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div class="flex items-center justify-between border-b px-5 py-4">
                <h2 class="font-semibold text-slate-900">
                    Goals — {{ periodLabel(currentPeriod) }}
                </h2>
                <span
                    class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                >
                    {{ employeeGoals.length }} goal{{
                        employeeGoals.length === 1 ? '' : 's'
                    }}
                </span>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full min-w-[700px] text-sm">
                    <thead>
                        <tr
                            class="border-b text-left text-xs tracking-wide text-muted-foreground uppercase"
                        >
                            <th class="px-4 py-3 font-medium">No.</th>
                            <th class="px-4 py-3 font-medium">Goal</th>
                            <th class="px-4 py-3 font-medium">Category</th>
                            <th class="px-4 py-3 font-medium">Progress</th>
                            <th class="px-4 py-3 font-medium">Due</th>
                            <th class="px-4 py-3 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(goal, index) in employeeGoals"
                            :key="goal.id"
                            class="border-b transition-colors last:border-0 hover:bg-muted/40"
                        >
                            <td
                                class="px-4 py-3 text-muted-foreground tabular-nums"
                            >
                                {{ index + 1 }}
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
                                            :class="goalBarTone[goal.status]"
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
                        <tr v-if="employeeGoals.length === 0">
                            <td
                                colspan="6"
                                class="px-4 py-10 text-center text-sm text-muted-foreground"
                            >
                                No goals set for this employee yet.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Quick link back -->
        <Link
            href="/demo/performance/reviews"
            class="group flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50/60 p-5 transition-colors duration-200 hover:border-blue-300 hover:bg-blue-50"
        >
            <div class="flex items-center gap-3">
                <span class="rounded-lg bg-blue-600 p-2.5 text-white shadow-sm">
                    <ArrowLeft class="size-5" />
                </span>
                <div>
                    <p class="text-sm font-semibold text-slate-900">
                        Back to Goals & Reviews
                    </p>
                    <p class="text-xs text-slate-500">
                        Review all employees or start a new review.
                    </p>
                </div>
            </div>
            <ArrowUpRight
                class="size-4 text-blue-600 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
        </Link>
    </div>

    <!-- Generate report preview -->
    <RecordPrintModal
        v-if="showPreview"
        :heading="`Performance Record — ${employee.name}`"
        subtitle="Official performance document · ready to print"
        @close="showPreview = false"
    >
        <AttendanceReportDocument
            title="Employee Performance Record"
            :period="`As of ${printedOn}`"
            system="Performance Management System"
            :columns="[
                { key: 'no', label: 'No.' },
                { key: 'period', label: 'Period' },
                { key: 'job_knowledge', label: 'Job Knowledge', numeric: true },
                { key: 'quality', label: 'Quality', numeric: true },
                { key: 'productivity', label: 'Productivity', numeric: true },
                { key: 'teamwork', label: 'Teamwork', numeric: true },
                { key: 'initiative', label: 'Initiative', numeric: true },
                { key: 'overall', label: 'Overall', numeric: true },
                { key: 'rating', label: 'Rating' },
                { key: 'raise', label: 'Raise Rec' },
                { key: 'status', label: 'Status' },
            ]"
            :rows="reportRows"
            :note="`${employee.name} — ${employee.position}, ${employee.department}. Ratings are the average of five criteria; overall 4.0+ recommends a merit raise for Payroll, criteria rated 2 or below become training suggestions.`"
        />
    </RecordPrintModal>
</template>
