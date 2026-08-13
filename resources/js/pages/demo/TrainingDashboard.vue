<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import {
    ArrowUpRight,
    Award,
    BookOpen,
    CalendarCheck2,
    TrendingUp,
    Users,
} from '@lucide/vue';
import type { LucideIcon } from '@lucide/vue';
import { computed } from 'vue';
import { useDemoTraining } from '@/composables/useDemoTraining';
import type { TrainingEmployee } from '@/composables/useDemoTraining';
import type { DemoTrainingCourse, DemoTrainingEnrollment } from '@/types';

const props = defineProps<{
    employees: TrainingEmployee[];
    courses: DemoTrainingCourse[];
    enrollments: DemoTrainingEnrollment[];
}>();

const { rows, courseRows } = useDemoTraining(
    props.employees,
    props.courses,
    props.enrollments,
);

// Reference date of the demo: mid-Q3 2026, when the calendar below was cut.
const TODAY = '2026-08-13';

const activeCount = computed(
    () =>
        rows.value.filter(
            (row) => row.status === 'Enrolled' || row.status === 'In Progress',
        ).length,
);

const completed = computed(() =>
    rows.value.filter((row) => row.status === 'Completed'),
);

const completionRate = computed(() =>
    rows.value.length === 0
        ? '0%'
        : `${Math.round((completed.value.length / rows.value.length) * 100)}%`,
);

type StatCard = {
    label: string;
    value: string;
    icon: LucideIcon;
    iconClass: string;
    /** Query string pre-filtering the Courses & Enrollment directory. */
    query: string;
};

// Every card deep-links into the Courses & Enrollment directory (like the
// other modules' stat cards), pre-filtered to what the number counts.
const statCards: StatCard[] = [
    {
        label: 'Courses this quarter',
        value: String(courseRows.value.length),
        icon: BookOpen,
        iconClass: 'bg-blue-50 text-blue-700',
        query: '?tab=courses',
    },
    {
        label: 'Active enrollments',
        value: String(activeCount.value),
        icon: Users,
        iconClass: 'bg-amber-50 text-amber-700',
        query: '?tab=enrollments&status=active',
    },
    {
        label: 'Completion rate',
        value: completionRate.value,
        icon: TrendingUp,
        iconClass: 'bg-emerald-50 text-emerald-700',
        query: '?tab=enrollments&status=completed',
    },
    {
        label: 'Certificates issued',
        value: String(completed.value.length),
        icon: Award,
        iconClass: 'bg-indigo-50 text-indigo-700',
        query: '?tab=enrollments&status=completed',
    },
];

// Enrollments per category for the vertical bar chart.
const categoryCounts = computed(() => {
    const byCategory = new Map<string, number>();

    for (const row of rows.value) {
        byCategory.set(row.category, (byCategory.get(row.category) ?? 0) + 1);
    }

    return [...byCategory.entries()]
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
});

const maxCategoryCount = computed(() =>
    Math.max(...categoryCounts.value.map((c) => c.count), 1),
);

// Upcoming courses first, so the coordinator sees what needs seats filled.
const upcoming = computed(() =>
    [...courseRows.value]
        .filter((course) => course.start > TODAY)
        .sort((a, b) => (a.start < b.start ? -1 : 1))
        .slice(0, 5),
);

function formatDate(iso: string): string {
    return new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    });
}

const seatsLeft = (course: (typeof courseRows.value)[number]): number =>
    Math.max(0, course.capacity - course.enrolled);

const utilization = (course: (typeof courseRows.value)[number]): number =>
    Math.min(100, Math.round((course.enrolled / course.capacity) * 100));
</script>

<template>
    <Head title="Dashboard — Training & Development" />

    <div class="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">
            Dashboard
        </h1>

        <!-- Stats (clickable -> filtered Courses & Enrollment directory) -->
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
                v-for="card in statCards"
                :key="card.label"
                :href="`/demo/training/enrollments${card.query}`"
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

        <!-- Chart + upcoming training -->
        <div class="grid gap-6 lg:grid-cols-2">
            <!-- Vertical bars: enrollments by category -->
            <div class="rounded-xl border border-slate-200 bg-white p-5">
                <h2 class="font-semibold text-slate-900">
                    Enrollments by category
                </h2>
                <p class="mt-0.5 text-xs text-slate-500">
                    Course enrollments grouped by training category, Q3 2026
                </p>

                <div class="mt-8 flex h-48 items-end gap-2 sm:gap-3">
                    <div
                        v-for="row in categoryCounts"
                        :key="row.category"
                        class="relative flex min-w-0 flex-1 flex-col items-center justify-end self-stretch"
                    >
                        <span
                            class="absolute -top-5 left-1/2 -translate-x-1/2 text-[11px] font-semibold text-slate-600 tabular-nums"
                        >
                            {{ row.count }}
                        </span>
                        <div
                            class="w-full max-w-9 rounded-t-md bg-blue-600 transition-colors duration-200 hover:bg-blue-500"
                            :title="`${row.category}: ${row.count} enrollments`"
                            :style="{
                                height: `${(row.count / maxCategoryCount) * 88}%`,
                            }"
                        ></div>
                    </div>
                </div>
                <div class="mt-1.5 flex gap-2 sm:gap-3">
                    <div
                        v-for="row in categoryCounts"
                        :key="row.category"
                        class="min-w-0 flex-1"
                    >
                        <p
                            class="truncate text-center text-[10px] leading-tight text-slate-500"
                            :title="row.category"
                        >
                            {{ row.category }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Upcoming training -->
            <div class="rounded-xl border border-slate-200 bg-white p-5">
                <div class="flex items-center justify-between">
                    <h2 class="font-semibold text-slate-900">
                        Upcoming training
                    </h2>
                    <Link
                        href="/demo/training/enrollments?tab=courses"
                        class="inline-flex items-center gap-1 text-xs font-medium text-blue-600 transition-colors hover:text-blue-800"
                    >
                        View all
                        <ArrowUpRight class="size-3.5" />
                    </Link>
                </div>

                <div class="mt-4 space-y-3">
                    <div
                        v-for="course in upcoming"
                        :key="course.id"
                        class="rounded-lg border border-slate-100 bg-slate-50/60 px-4 py-3"
                    >
                        <div class="flex items-center justify-between gap-3">
                            <div class="min-w-0">
                                <p
                                    class="truncate text-sm font-medium text-slate-800"
                                >
                                    {{ course.title }}
                                </p>
                                <p
                                    class="mt-0.5 truncate text-xs text-slate-500"
                                >
                                    {{ course.code }} ·
                                    {{ formatDate(course.start) }} –
                                    {{ formatDate(course.end) }} ·
                                    {{ seatsLeft(course) }} seat{{
                                        seatsLeft(course) === 1 ? '' : 's'
                                    }}
                                    left
                                </p>
                            </div>
                            <span
                                class="shrink-0 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700"
                            >
                                {{ course.enrolled }}/{{ course.capacity }}
                            </span>
                        </div>
                        <div class="mt-2.5 flex items-center gap-2">
                            <div
                                class="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200"
                            >
                                <div
                                    class="h-full rounded-full bg-blue-500"
                                    :style="{
                                        width: `${utilization(course)}%`,
                                    }"
                                ></div>
                            </div>
                            <span
                                class="text-xs font-medium text-slate-600 tabular-nums"
                            >
                                {{ utilization(course) }}%
                            </span>
                        </div>
                    </div>

                    <p
                        v-if="upcoming.length === 0"
                        class="py-6 text-center text-sm text-slate-500"
                    >
                        No courses scheduled after this week.
                    </p>
                </div>
            </div>
        </div>

        <!-- Quick action -->
        <Link
            href="/demo/training/enrollments"
            class="group flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50/60 p-5 transition-colors duration-200 hover:border-blue-300 hover:bg-blue-50"
        >
            <div class="flex items-center gap-3">
                <span class="rounded-lg bg-blue-600 p-2.5 text-white shadow-sm">
                    <CalendarCheck2 class="size-5" />
                </span>
                <div>
                    <p class="text-sm font-semibold text-slate-900">
                        Run the Q3 2026 training calendar
                    </p>
                    <p class="text-xs text-slate-500">
                        Enroll employees in upcoming courses, mark them In
                        Progress as they attend, and complete them to issue
                        certificates — every completed training lands on the
                        employee's record automatically.
                    </p>
                </div>
            </div>
            <ArrowUpRight
                class="size-4 text-blue-600 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
        </Link>
    </div>
</template>
