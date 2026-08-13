<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import {
    ArrowUpRight,
    Handshake,
    Hourglass,
    UserCheck,
    Users,
} from '@lucide/vue';
import type { LucideIcon } from '@lucide/vue';
import { computed } from 'vue';
import { useDemoEmployees } from '@/composables/useDemoEmployees';
import type { DemoEmployee } from '@/types';

type EmployeeRow = DemoEmployee & { today: string };

type DashboardStats = {
    total: number;
    regular: number;
    probationary: number;
    contractual: number;
    atWork: number;
    onLeave: number;
    newThisMonth: number;
    absent: number;
    notIn: number;
};

const props = defineProps<{
    employees: EmployeeRow[];
    departments: string[];
    stats: DashboardStats;
}>();

// Demo employees added from the Add Employee form (in-memory only). They have
// no attendance row yet, so they count as "Not Yet In" like the server rows.
const { addedEmployees } = useDemoEmployees();

const allEmployees = computed<EmployeeRow[]>(() => [
    ...props.employees,
    ...addedEmployees.value.map((e) => ({ ...e, today: 'Not Yet In' })),
]);

// Recompute the headline stats from the merged list so session-added
// employees are reflected (the server only knows about seeded data).
const dashboardStats = computed<DashboardStats>(() => {
    const now = new Date();

    return {
        total: allEmployees.value.length,
        regular: allEmployees.value.filter(
            (e) => e.employment_type === 'Regular',
        ).length,
        probationary: allEmployees.value.filter(
            (e) => e.employment_type === 'Probationary',
        ).length,
        contractual: allEmployees.value.filter(
            (e) => e.employment_type === 'Contractual',
        ).length,
        atWork: allEmployees.value.filter((e) =>
            ['Present', 'Late'].includes(e.today),
        ).length,
        onLeave: allEmployees.value.filter((e) => e.today === 'On Leave')
            .length,
        newThisMonth: allEmployees.value.filter((e) => {
            if (!e.hire_date) {
                return false;
            }

            const hired = new Date(e.hire_date);

            return (
                hired.getFullYear() === now.getFullYear() &&
                hired.getMonth() === now.getMonth()
            );
        }).length,
        absent: allEmployees.value.filter((e) => e.today === 'Absent').length,
        notIn: allEmployees.value.filter((e) => e.today === 'Not Yet In')
            .length,
    };
});

const departmentCounts = computed(() =>
    props.departments
        .map((department) => ({
            department,
            count: allEmployees.value.filter((e) => e.department === department)
                .length,
        }))
        .sort((a, b) => b.count - a.count),
);

// Both charts show the same top 5 departments so they mirror each other.
const topDepartments = computed(() => departmentCounts.value.slice(0, 5));

const maxDepartmentCount = computed(() =>
    Math.max(...topDepartments.value.map((d) => d.count), 1),
);

function share(count: number): number {
    return Math.round((count / dashboardStats.value.total) * 100);
}

// Headcount per department split by employment type, so each bar can be
// color-coded: Regular = emerald, Probationary = amber, Contractual = sky.
const departmentTypeCounts = computed(() =>
    topDepartments.value.map((row) => {
        const count = (type: DemoEmployee['employment_type']) =>
            allEmployees.value.filter(
                (e) =>
                    e.department === row.department &&
                    e.employment_type === type,
            ).length;

        return {
            department: row.department,
            total: row.count,
            regular: count('Regular'),
            probationary: count('Probationary'),
            contractual: count('Contractual'),
        };
    }),
);

const typeLegend = [
    { label: 'Regular', color: 'bg-emerald-500' },
    { label: 'Probationary', color: 'bg-amber-500' },
    { label: 'Contractual', color: 'bg-sky-500' },
];

type StatCard = {
    label: string;
    value: () => number;
    icon: LucideIcon;
    iconClass: string;
    /** Query param for the employee directory filter (all/Regular/...). */
    status: string;
};

const statCards: StatCard[] = [
    {
        label: 'Total employees',
        value: () => dashboardStats.value.total,
        icon: Users,
        iconClass: 'bg-blue-50 text-blue-700',
        status: 'all',
    },
    {
        label: 'Regular',
        value: () => dashboardStats.value.regular,
        icon: UserCheck,
        iconClass: 'bg-emerald-50 text-emerald-700',
        status: 'Regular',
    },
    {
        label: 'Probationary',
        value: () => dashboardStats.value.probationary,
        icon: Hourglass,
        iconClass: 'bg-amber-50 text-amber-700',
        status: 'Probationary',
    },
    {
        label: 'Contractual',
        value: () => dashboardStats.value.contractual,
        icon: Handshake,
        iconClass: 'bg-sky-50 text-sky-700',
        status: 'Contractual',
    },
];
</script>

<template>
    <Head title="Dashboard — Employee Information Management" />

    <div class="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">
            Dashboard
        </h1>

        <!-- Stats: employment types (clickable -> filtered directory) -->
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
                v-for="card in statCards"
                :key="card.label"
                :href="`/demo/employees?status=${card.status}`"
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
                            {{ card.value() }}
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

        <!-- Charts -->
        <div class="grid gap-6 lg:grid-cols-2">
            <!-- Vertical bars: department breakdown -->
            <div class="rounded-xl border border-slate-200 bg-white p-5">
                <h2 class="font-semibold text-slate-900">
                    Department breakdown
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
                            :title="`${row.department}: ${row.count} employees`"
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

            <!-- Stacked bars: employee types per department -->
            <div class="rounded-xl border border-slate-200 bg-white p-5">
                <h2 class="font-semibold text-slate-900">
                    Employee distribution by department
                </h2>

                <div
                    class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500"
                >
                    <span
                        v-for="item in typeLegend"
                        :key="item.label"
                        class="inline-flex items-center gap-1.5"
                    >
                        <span
                            class="size-2.5 rounded-full"
                            :class="item.color"
                        ></span>
                        {{ item.label }}
                    </span>
                </div>

                <div class="mt-5 space-y-4">
                    <div
                        v-for="row in departmentTypeCounts"
                        :key="row.department"
                    >
                        <div
                            class="flex items-baseline justify-between gap-2 text-sm"
                        >
                            <span class="truncate font-medium text-slate-700">
                                {{ row.department }}
                            </span>
                            <span
                                class="shrink-0 text-xs text-slate-500 tabular-nums"
                            >
                                {{ row.total }}
                            </span>
                        </div>
                        <div
                            class="mt-1.5 flex h-2.5 overflow-hidden rounded-full bg-slate-100"
                        >
                            <div
                                class="h-full bg-emerald-500"
                                :style="{ width: `${share(row.regular)}%` }"
                                :title="`Regular: ${row.regular}`"
                            ></div>
                            <div
                                class="h-full bg-amber-500"
                                :style="{
                                    width: `${share(row.probationary)}%`,
                                }"
                                :title="`Probationary: ${row.probationary}`"
                            ></div>
                            <div
                                class="h-full bg-sky-500"
                                :style="{
                                    width: `${share(row.contractual)}%`,
                                }"
                                :title="`Contractual: ${row.contractual}`"
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
