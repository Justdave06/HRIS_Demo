<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import {
    ArrowUpRight,
    ClipboardCheck,
    GraduationCap,
    Star,
    TrendingUp,
    Users,
} from '@lucide/vue';
import type { LucideIcon } from '@lucide/vue';
import { computed } from 'vue';
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

const { rows, goalRows } = useDemoPerformance(
    props.employees,
    props.reviews,
    props.goals,
);

// The dashboard tells the story of the current cycle (the in-progress period).
const currentPeriod =
    props.periods.find((period) => period.status === 'In Progress')?.value ??
    props.periods[0]?.value;

const currentRows = computed(() =>
    rows.value.filter((row) => row.period === currentPeriod),
);

const reviewed = computed(() => currentRows.value.length);

const averageRating = computed(() => {
    if (currentRows.value.length === 0) {
        return '—';
    }

    const average =
        currentRows.value.reduce((sum, row) => sum + row.overall, 0) /
        currentRows.value.length;

    return average.toFixed(1);
});

const raiseCount = computed(
    () =>
        currentRows.value.filter(
            (row) => row.raise_pct > 0 && row.status === 'Finalized',
        ).length,
);

const gapCount = computed(
    () =>
        currentRows.value.filter(
            (row) => row.status === 'Finalized' && row.gaps.length > 0,
        ).length,
);

type StatCard = {
    label: string;
    value: string;
    icon: LucideIcon;
    iconClass: string;
    /** Query string pre-filtering the Goals & Reviews directory. */
    query: string;
};

// Every card deep-links into the Goals & Reviews directory (like the
// Employees module's stat cards), pre-filtered to what the number counts.
const statCards: StatCard[] = [
    {
        label: 'Reviews this period',
        value: String(reviewed.value),
        icon: Users,
        iconClass: 'bg-blue-50 text-blue-700',
        query: `?period=${currentPeriod}`,
    },
    {
        label: 'Average rating',
        value: averageRating.value,
        icon: Star,
        iconClass: 'bg-amber-50 text-amber-700',
        query: `?period=${currentPeriod}`,
    },
    {
        label: 'Raise recommendations',
        value: String(raiseCount.value),
        icon: TrendingUp,
        iconClass: 'bg-emerald-50 text-emerald-700',
        query: `?period=${currentPeriod}&raise=1`,
    },
    {
        label: 'Skill gaps for training',
        value: String(gapCount.value),
        icon: GraduationCap,
        iconClass: 'bg-indigo-50 text-indigo-700',
        query: `?period=${currentPeriod}&gaps=1`,
    },
];

// Average rating per department for the vertical bar chart.
const departmentRows = computed(() => {
    const byDepartment = new Map<string, { total: number; count: number }>();

    for (const row of currentRows.value) {
        const entry = byDepartment.get(row.department) ?? {
            total: 0,
            count: 0,
        };

        entry.total += row.overall;
        entry.count += 1;
        byDepartment.set(row.department, entry);
    }

    return [...byDepartment.entries()]
        .map(([department, entry]) => ({
            department,
            average: entry.count === 0 ? 0 : entry.total / entry.count,
        }))
        .sort((a, b) => b.average - a.average)
        .slice(0, 5);
});

// Goals most at risk first, so reviewers see what needs attention.
const topGoals = computed(() =>
    [...goalRows.value].sort((a, b) => a.progress - b.progress).slice(0, 5),
);

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

function formatDate(iso: string): string {
    return new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}
</script>

<template>
    <Head title="Dashboard — Performance Management" />

    <div class="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">
            Dashboard
        </h1>

        <!-- Stats (clickable -> filtered Goals & Reviews directory) -->
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
                v-for="card in statCards"
                :key="card.label"
                :href="`/demo/performance/reviews${card.query}`"
                class="group rounded-xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
            >
                <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0">
                        <p
                            class="truncate text-sm font-medium text-slate-500 group-hover:text-blue-600"
                        >
                            {{ card.label }}
                        </p>
                        <p
                            class="mt-2 text-3xl font-bold tracking-tight text-slate-900 tabular-nums"
                        >
                            {{ card.value }}
                        </p>
                    </div>
                    <span
                        class="shrink-0 rounded-lg p-2.5"
                        :class="card.iconClass"
                    >
                        <component :is="card.icon" class="size-5" />
                    </span>
                </div>
                <p
                    class="mt-3 inline-flex items-center gap-1 text-xs font-medium text-blue-600 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                >
                    View directory
                    <ArrowUpRight class="size-3.5" />
                </p>
            </Link>
        </div>

        <!-- Chart + goals in progress -->
        <div class="grid gap-6 lg:grid-cols-2">
            <!-- Vertical bars: average rating by department -->
            <div class="rounded-xl border border-slate-200 bg-white p-5">
                <h2 class="font-semibold text-slate-900">
                    Average rating by department
                </h2>
                <p class="mt-0.5 text-xs text-slate-500">
                    Overall rating (1–5) per department, current cycle
                </p>

                <div class="mt-8 flex h-48 items-end gap-2 sm:gap-3">
                    <div
                        v-for="row in departmentRows"
                        :key="row.department"
                        class="relative flex min-w-0 flex-1 flex-col items-center justify-end self-stretch"
                    >
                        <span
                            class="absolute -top-5 left-1/2 -translate-x-1/2 text-[11px] font-semibold text-slate-600 tabular-nums"
                        >
                            {{ row.average.toFixed(1) }}
                        </span>
                        <div
                            class="w-full max-w-9 rounded-t-md bg-blue-600 transition-colors duration-200 hover:bg-blue-500"
                            :title="`${row.department}: ${row.average.toFixed(1)} average rating`"
                            :style="{
                                height: `${(row.average / 5) * 88}%`,
                            }"
                        ></div>
                    </div>
                </div>
                <div class="mt-1.5 flex gap-2 sm:gap-3">
                    <div
                        v-for="row in departmentRows"
                        :key="row.department"
                        class="min-w-0 flex-1"
                    >
                        <p
                            class="truncate text-center text-[10px] leading-tight text-slate-500"
                            :title="row.department"
                        >
                            {{ row.department }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Goals in progress -->
            <div class="rounded-xl border border-slate-200 bg-white p-5">
                <div class="flex items-center justify-between">
                    <h2 class="font-semibold text-slate-900">
                        Goals in progress
                    </h2>
                    <Link
                        href="/demo/performance/reviews"
                        class="inline-flex items-center gap-1 text-xs font-medium text-blue-600 transition-colors hover:text-blue-800"
                    >
                        View all
                        <ArrowUpRight class="size-3.5" />
                    </Link>
                </div>

                <div class="mt-4 space-y-3">
                    <div
                        v-for="goal in topGoals"
                        :key="goal.id"
                        class="rounded-lg border border-slate-100 bg-slate-50/60 px-4 py-3"
                    >
                        <div class="flex items-center justify-between gap-3">
                            <div class="min-w-0">
                                <p
                                    class="truncate text-sm font-medium text-slate-800"
                                >
                                    {{ goal.title }}
                                </p>
                                <p
                                    class="mt-0.5 truncate text-xs text-slate-500"
                                >
                                    {{ goal.name }} · {{ goal.department }} ·
                                    due {{ formatDate(goal.due) }}
                                </p>
                            </div>
                            <span
                                class="shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium"
                                :class="goalStatusTone[goal.status]"
                            >
                                {{ goal.status }}
                            </span>
                        </div>
                        <div class="mt-2.5 flex items-center gap-2">
                            <div
                                class="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200"
                            >
                                <div
                                    class="h-full rounded-full"
                                    :class="goalBarTone[goal.status]"
                                    :style="{ width: `${goal.progress}%` }"
                                ></div>
                            </div>
                            <span
                                class="text-xs font-medium text-slate-600 tabular-nums"
                            >
                                {{ goal.progress }}%
                            </span>
                        </div>
                    </div>

                    <p
                        v-if="topGoals.length === 0"
                        class="py-6 text-center text-sm text-slate-500"
                    >
                        No goals set for the current cycle yet.
                    </p>
                </div>
            </div>
        </div>

        <!-- Quick action -->
        <Link
            href="/demo/performance/reviews"
            class="group flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50/60 p-5 transition-colors duration-200 hover:border-blue-300 hover:bg-blue-50"
        >
            <div class="flex items-center gap-3">
                <span class="rounded-lg bg-blue-600 p-2.5 text-white shadow-sm">
                    <ClipboardCheck class="size-5" />
                </span>
                <div>
                    <p class="text-sm font-semibold text-slate-900">
                        Run the H2 2026 performance reviews
                    </p>
                    <p class="text-xs text-slate-500">
                        Record ratings per criterion, finalize reviews, and the
                        system recommends merit raises for Payroll and training
                        for skill gaps automatically.
                    </p>
                </div>
            </div>
            <ArrowUpRight
                class="size-4 text-blue-600 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
        </Link>
    </div>
</template>
