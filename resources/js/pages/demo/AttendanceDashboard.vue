<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { ArrowUpRight, CalendarCheck2, Clock, UserX, Users } from '@lucide/vue';
import type { LucideIcon } from '@lucide/vue';
import { computed } from 'vue';
import { useDemoHolidays } from '@/composables/useDemoHolidays';

type RosterRow = {
    employee_id: number;
    no: string;
    name: string;
    department: string;
    position: string;
    time_in: string | null;
    time_out: string | null;
    status: string;
};

const props = defineProps<{
    attendance: RosterRow[];
    departments: string[];
    stats: {
        totalEmployees: number;
        presentToday: number;
        absentToday: number;
        onLeaveToday: number;
    };
}>();

// Declared holidays are session-backed, so the dashboard stays in sync with
// the Holiday Picker without a page reload.
const { declaredHolidays } = useDemoHolidays();

const presentCount = (department: string): number =>
    props.attendance.filter(
        (row) =>
            row.department === department &&
            (row.status === 'Present' || row.status === 'Late'),
    ).length;

const departmentRows = computed(() =>
    props.departments
        .map((department) => ({
            department,
            total: props.attendance.filter(
                (row) => row.department === department,
            ).length,
            present: presentCount(department),
        }))
        .sort((a, b) => b.total - a.total),
);

// Top 5 departments, mirroring the other module dashboards.
const topDepartments = computed(() => departmentRows.value.slice(0, 5));

const maxDepartmentTotal = computed(() =>
    Math.max(...topDepartments.value.map((row) => row.total), 1),
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
        label: 'Total employees',
        value: props.stats.totalEmployees,
        icon: Users,
        iconClass: 'bg-blue-50 text-blue-700',
        href: '/demo/attendance/manager',
    },
    {
        label: 'Present today',
        value: props.stats.presentToday,
        icon: Clock,
        iconClass: 'bg-emerald-50 text-emerald-700',
        href: '/demo/attendance/manager?status=Present',
    },
    {
        label: 'Absent today',
        value: props.stats.absentToday,
        icon: UserX,
        iconClass: 'bg-red-50 text-red-700',
        href: '/demo/attendance/manager?status=Absent',
    },
    {
        label: 'On leave today',
        value: props.stats.onLeaveToday,
        icon: CalendarCheck2,
        iconClass: 'bg-amber-50 text-amber-700',
        href: '/demo/attendance/manager?status=On Leave',
    },
];

function formatDate(iso: string): string {
    return new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}
</script>

<template>
    <Head title="Dashboard — Time & Attendance" />

    <div class="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">
            Dashboard
        </h1>

        <!-- Stats (clickable -> attendance manager with the matching filter) -->
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
                    View attendance
                    <ArrowUpRight class="size-3.5" />
                </p>
            </Link>
        </div>

        <!-- Chart + declared holidays -->
        <div class="grid gap-6 lg:grid-cols-2">
            <!-- Vertical bars: attendance by department -->
            <div class="rounded-xl border border-slate-200 bg-white p-5">
                <h2 class="font-semibold text-slate-900">
                    Attendance by department
                </h2>
                <p class="mt-0.5 text-xs text-slate-500">
                    Present vs. total headcount today
                </p>

                <div class="mt-8 flex h-48 items-end gap-2 sm:gap-3">
                    <div
                        v-for="row in topDepartments"
                        :key="row.department"
                        class="relative flex min-w-0 flex-1 flex-col items-center justify-end self-stretch"
                    >
                        <span
                            class="absolute -top-5 left-1/2 -translate-x-1/2 text-[11px] font-semibold text-slate-600 tabular-nums"
                        >
                            {{ row.present }}/{{ row.total }}
                        </span>
                        <div
                            class="w-full max-w-9 rounded-t-md bg-blue-600 transition-colors duration-200 hover:bg-blue-500"
                            :title="`${row.department}: ${row.present} of ${row.total} present`"
                            :style="{
                                height: `${(row.total / maxDepartmentTotal) * 88}%`,
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

            <!-- Declared holidays -->
            <div class="rounded-xl border border-slate-200 bg-white p-5">
                <div class="flex items-center justify-between">
                    <h2 class="font-semibold text-slate-900">
                        Declared holidays
                    </h2>
                    <Link
                        href="/demo/attendance/holidays"
                        class="inline-flex items-center gap-1 text-xs font-medium text-blue-600 transition-colors hover:text-blue-800"
                    >
                        Holiday Picker
                        <ArrowUpRight class="size-3.5" />
                    </Link>
                </div>

                <div class="mt-4 space-y-3">
                    <div
                        v-for="holiday in declaredHolidays"
                        :key="holiday.id"
                        class="rounded-lg border border-slate-100 bg-slate-50/60 px-4 py-3"
                    >
                        <div class="flex items-center justify-between gap-3">
                            <p
                                class="truncate text-sm font-medium text-slate-800"
                            >
                                {{ holiday.reason }}
                            </p>
                            <span
                                class="shrink-0 rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700"
                            >
                                {{
                                    holiday.dates.length === 1
                                        ? formatDate(holiday.dates[0])
                                        : `${holiday.dates.length} dates`
                                }}
                            </span>
                        </div>
                        <p class="mt-1 text-xs text-slate-500">
                            {{
                                holiday.scope === 'all'
                                    ? 'All employees'
                                    : holiday.department
                            }}
                            · {{ holiday.pay }}
                        </p>
                    </div>

                    <p
                        v-if="declaredHolidays.length === 0"
                        class="py-6 text-center text-sm text-slate-500"
                    >
                        No declared holidays yet — declare one for an abrupt
                        event like an earthquake or structural damage.
                    </p>
                </div>
            </div>
        </div>

        <!-- Quick action: Holiday Picker -->
        <Link
            href="/demo/attendance/holidays"
            class="group flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50/60 p-5 transition-colors duration-200 hover:border-blue-300 hover:bg-blue-50"
        >
            <div class="flex items-center gap-3">
                <span class="rounded-lg bg-blue-600 p-2.5 text-white shadow-sm">
                    <CalendarCheck2 class="size-5" />
                </span>
                <div>
                    <p class="text-sm font-semibold text-slate-900">
                        Holiday Picker
                    </p>
                    <p class="text-xs text-slate-500">
                        Declare an abrupt, non-national holiday (earthquake,
                        structural damage…) with scope and pay treatment. It
                        shows up on the DTR cards automatically.
                    </p>
                </div>
            </div>
            <ArrowUpRight
                class="size-4 text-blue-600 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
        </Link>
    </div>
</template>
