<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import {
    ArrowUpRight,
    Briefcase,
    CalendarCheck2,
    FileBarChart2,
    Users,
    UserSearch,
} from '@lucide/vue';
import type { LucideIcon } from '@lucide/vue';
import { computed } from 'vue';
import { useDemoVacancies } from '@/composables/useDemoVacancies';
import type { DemoCandidate, DemoJob } from '@/types';

const props = defineProps<{
    jobs: DemoJob[];
    candidates: DemoCandidate[];
    departments: string[];
    stats: {
        vacant: number;
        totalApplicants: number;
        shortlisted: number;
        hiredThisMonth: number;
    };
}>();

// Session-added vacancies are merged in so they show up here too.
const { addedVacancies, statusFor } = useDemoVacancies();

const allJobs = computed(() => [...props.jobs, ...addedVacancies.value]);

// Recompute the vacant count from the merged list (added vacancies are
// Open by default and start with 0 applicants), keeping the applicant
// stats from the server since candidates aren't session-created.
const vacantCount = computed(
    () => allJobs.value.filter((job) => statusFor(job) === 'Open').length,
);

const departmentCounts = computed(() =>
    props.departments
        .map((department) => ({
            department,
            count: allJobs.value.filter((job) => job.department === department)
                .length,
        }))
        .sort((a, b) => b.count - a.count),
);

// The chart shows the top 5 departments, mirroring the employee dashboard.
const topDepartments = computed(() => departmentCounts.value.slice(0, 5));

const maxDepartmentCount = computed(() =>
    Math.max(...topDepartments.value.map((d) => d.count), 1),
);

type StatCard = {
    label: string;
    value: number;
    icon: LucideIcon;
    iconClass: string;
    href: string;
};

const statCards: StatCard[] = [
    {
        label: 'Vacant positions',
        value: vacantCount.value,
        icon: Briefcase,
        iconClass: 'bg-blue-50 text-blue-700',
        href: '/demo/recruitment/vacancies?status=Open',
    },
    {
        label: 'Total applicants',
        value: props.stats.totalApplicants,
        icon: Users,
        iconClass: 'bg-indigo-50 text-indigo-700',
        href: '/demo/recruitment/vacancies',
    },
    {
        label: 'Shortlisted',
        value: props.stats.shortlisted,
        icon: UserSearch,
        iconClass: 'bg-amber-50 text-amber-700',
        href: '/demo/recruitment/vacancies',
    },
    {
        label: 'Hired this month',
        value: props.stats.hiredThisMonth,
        icon: CalendarCheck2,
        iconClass: 'bg-emerald-50 text-emerald-700',
        href: '/demo/recruitment/vacancies',
    },
];

// Latest openings feed the "recent vacancies" list below the charts.
const recentVacancies = computed(() =>
    [...allJobs.value]
        .sort((a, b) => (a.posted < b.posted ? 1 : -1))
        .slice(0, 5),
);
</script>

<template>
    <Head title="Dashboard — Recruitment & Onboarding" />

    <div class="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">
            Dashboard
        </h1>

        <!-- Stats (clickable -> vacancies list with the matching filter) -->
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
                v-for="card in statCards"
                :key="card.label"
                :href="card.href"
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
                    View vacancies
                    <ArrowUpRight class="size-3.5" />
                </p>
            </Link>
        </div>

        <!-- Charts + recent vacancies -->
        <div class="grid gap-6 lg:grid-cols-2">
            <!-- Vertical bars: vacancies by department -->
            <div class="rounded-xl border border-slate-200 bg-white p-5">
                <h2 class="font-semibold text-slate-900">
                    Vacancies by department
                </h2>

                <div class="mt-8 flex h-48 items-end gap-2 sm:gap-3">
                    <div
                        v-for="row in topDepartments"
                        :key="row.department"
                        class="relative flex min-w-0 flex-1 flex-col items-center justify-end self-stretch"
                    >
                        <span
                            class="absolute -top-5 left-1/2 -translate-x-1/2 text-[11px] font-semibold text-slate-600 tabular-nums"
                        >
                            {{ row.count }}
                        </span>
                        <div
                            class="w-full max-w-9 rounded-t-md bg-blue-600 transition-colors duration-200 hover:bg-blue-500"
                            :title="`${row.department}: ${row.count} vacancy/ies`"
                            :style="{
                                height: `${(row.count / maxDepartmentCount) * 88}%`,
                            }"
                        ></div>
                    </div>
                </div>
                <div class="mt-1.5 flex gap-2 sm:gap-3">
                    <div
                        v-for="row in topDepartments"
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

            <!-- Recent vacancies -->
            <div class="rounded-xl border border-slate-200 bg-white p-5">
                <div class="flex items-center justify-between">
                    <h2 class="font-semibold text-slate-900">
                        Recent vacancies
                    </h2>
                    <Link
                        href="/demo/recruitment/vacancies"
                        class="inline-flex items-center gap-1 text-xs font-medium text-blue-600 transition-colors hover:text-blue-800"
                    >
                        View all
                        <ArrowUpRight class="size-3.5" />
                    </Link>
                </div>

                <div class="mt-4 space-y-3">
                    <div
                        v-for="job in recentVacancies"
                        :key="job.id"
                        class="flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50/60 px-4 py-3"
                    >
                        <div class="min-w-0">
                            <p
                                class="truncate text-sm font-medium text-slate-800"
                            >
                                {{ job.title }}
                            </p>
                            <p class="mt-0.5 truncate text-xs text-slate-500">
                                {{ job.department }} · {{ job.employment_type }}
                            </p>
                        </div>
                        <div class="shrink-0 text-right text-xs text-slate-500">
                            <p
                                class="font-semibold text-slate-700 tabular-nums"
                            >
                                {{ job.applicants }} applicant{{
                                    job.applicants === 1 ? '' : 's'
                                }}
                            </p>
                            <p>Posted {{ job.posted }}</p>
                        </div>
                    </div>

                    <p
                        v-if="recentVacancies.length === 0"
                        class="py-6 text-center text-sm text-slate-500"
                    >
                        No vacancies yet.
                    </p>
                </div>
            </div>
        </div>

        <!-- Quick action -->
        <Link
            href="/demo/recruitment/vacancies"
            class="group flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50/60 p-5 transition-colors duration-200 hover:border-blue-300 hover:bg-blue-50"
        >
            <div class="flex items-center gap-3">
                <span class="rounded-lg bg-blue-600 p-2.5 text-white shadow-sm">
                    <FileBarChart2 class="size-5" />
                </span>
                <div>
                    <p class="text-sm font-semibold text-slate-900">
                        Manage vacancies
                    </p>
                    <p class="text-xs text-slate-500">
                        Add a new job posting with its hiring document, and
                        track applicants per vacancy.
                    </p>
                </div>
            </div>
            <ArrowUpRight
                class="size-4 text-blue-600 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
        </Link>
    </div>
</template>
