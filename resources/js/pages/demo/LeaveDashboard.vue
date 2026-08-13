<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import {
    ArrowUpRight,
    CalendarCheck2,
    CalendarClock,
    CheckCircle2,
    Clock,
    FileBarChart2,
} from '@lucide/vue';
import type { LucideIcon } from '@lucide/vue';
import { computed } from 'vue';
import { useDemoLeave } from '@/composables/useDemoLeave';
import type { DemoLeaveRow } from '@/types';

const props = defineProps<{
    requests: DemoLeaveRow[];
    employees: {
        id: number;
        no: string;
        name: string;
        department: string;
        position: string;
        balance: number;
    }[];
    types: string[];
    stats: {
        total: number;
        pending: number;
        approved: number;
        onLeaveToday: number;
    };
}>();

// Session-added requests and status overrides stay in sync with the list.
const { addedRequests, statusFor } = useDemoLeave();

const allRequests = computed<DemoLeaveRow[]>(() => {
    const base: DemoLeaveRow[] = props.requests.map((row) => ({
        ...row,
        status: statusFor(row),
    }));
    const added: DemoLeaveRow[] = addedRequests.value.map((request) => {
        const employee = props.employees.find(
            (row) => row.id === request.employee_id,
        );

        return {
            ...request,
            no: employee?.no ?? 'EMP-0000',
            name: employee?.name ?? 'New employee',
            department: employee?.department ?? '—',
            position: employee?.position ?? '—',
            balance: employee?.balance ?? 0,
            status: statusFor(request),
        };
    });

    return [...base, ...added];
});

const typeCounts = computed(() =>
    props.types
        .map((type) => ({
            type,
            count: allRequests.value.filter((row) => row.type === type).length,
        }))
        .sort((a, b) => b.count - a.count),
);

const topTypes = computed(() => typeCounts.value.slice(0, 5));

const maxTypeCount = computed(() =>
    Math.max(...topTypes.value.map((row) => row.count), 1),
);

const recentRequests = computed(() =>
    [...allRequests.value]
        .sort((a, b) => (a.from < b.from ? 1 : -1))
        .slice(0, 5),
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
        label: 'Total requests',
        value: props.stats.total,
        icon: CalendarClock,
        iconClass: 'bg-blue-50 text-blue-700',
        href: '/demo/leave/requests',
    },
    {
        label: 'Pending approval',
        value: props.stats.pending,
        icon: Clock,
        iconClass: 'bg-amber-50 text-amber-700',
        href: '/demo/leave/requests?status=Pending',
    },
    {
        label: 'Approved',
        value: props.stats.approved,
        icon: CheckCircle2,
        iconClass: 'bg-emerald-50 text-emerald-700',
        href: '/demo/leave/requests?status=Approved',
    },
    {
        label: 'On leave today',
        value: props.stats.onLeaveToday,
        icon: CalendarCheck2,
        iconClass: 'bg-indigo-50 text-indigo-700',
        href: '/demo/leave/requests',
    },
];

const statusTone: Record<string, string> = {
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
    Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Declined: 'bg-red-50 text-red-700 border-red-200',
};
</script>

<template>
    <Head title="Dashboard — Leave Management" />

    <div class="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">
            Dashboard
        </h1>

        <!-- Stats (clickable -> leave requests with the matching filter) -->
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
                    View requests
                    <ArrowUpRight class="size-3.5" />
                </p>
            </Link>
        </div>

        <!-- Chart + recent requests -->
        <div class="grid gap-6 lg:grid-cols-2">
            <!-- Vertical bars: leaves by type -->
            <div class="rounded-xl border border-slate-200 bg-white p-5">
                <h2 class="font-semibold text-slate-900">Leaves by type</h2>
                <p class="mt-0.5 text-xs text-slate-500">
                    Requests filed per leave type
                </p>

                <div class="mt-8 flex h-48 items-end gap-2 sm:gap-3">
                    <div
                        v-for="row in topTypes"
                        :key="row.type"
                        class="relative flex min-w-0 flex-1 flex-col items-center justify-end self-stretch"
                    >
                        <span
                            class="absolute -top-5 left-1/2 -translate-x-1/2 text-[11px] font-semibold text-slate-600 tabular-nums"
                        >
                            {{ row.count }}
                        </span>
                        <div
                            class="w-full max-w-9 rounded-t-md bg-blue-600 transition-colors duration-200 hover:bg-blue-500"
                            :title="`${row.type}: ${row.count} request/s`"
                            :style="{
                                height: `${(row.count / maxTypeCount) * 88}%`,
                            }"
                        ></div>
                    </div>
                </div>
                <div class="mt-1.5 flex gap-2 sm:gap-3">
                    <div
                        v-for="row in topTypes"
                        :key="row.type"
                        class="min-w-0 flex-1"
                    >
                        <p
                            class="truncate text-center text-[10px] leading-tight text-slate-500"
                            :title="row.type"
                        >
                            {{ row.type }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Recent requests -->
            <div class="rounded-xl border border-slate-200 bg-white p-5">
                <div class="flex items-center justify-between">
                    <h2 class="font-semibold text-slate-900">
                        Recent requests
                    </h2>
                    <Link
                        href="/demo/leave/requests"
                        class="inline-flex items-center gap-1 text-xs font-medium text-blue-600 transition-colors hover:text-blue-800"
                    >
                        View all
                        <ArrowUpRight class="size-3.5" />
                    </Link>
                </div>

                <div class="mt-4 space-y-3">
                    <div
                        v-for="request in recentRequests"
                        :key="request.id"
                        class="flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50/60 px-4 py-3"
                    >
                        <div class="min-w-0">
                            <p
                                class="truncate text-sm font-medium text-slate-800"
                            >
                                {{ request.name }}
                            </p>
                            <p class="mt-0.5 truncate text-xs text-slate-500">
                                {{ request.type }} · {{ request.from }} –
                                {{ request.to }} ({{ request.days }} day{{
                                    request.days === 1 ? '' : 's'
                                }})
                            </p>
                        </div>
                        <span
                            class="shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium"
                            :class="statusTone[request.status]"
                        >
                            {{ request.status }}
                        </span>
                    </div>

                    <p
                        v-if="recentRequests.length === 0"
                        class="py-6 text-center text-sm text-slate-500"
                    >
                        No leave requests yet.
                    </p>
                </div>
            </div>
        </div>

        <!-- Quick action -->
        <Link
            href="/demo/leave/requests"
            class="group flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50/60 p-5 transition-colors duration-200 hover:border-blue-300 hover:bg-blue-50"
        >
            <div class="flex items-center gap-3">
                <span class="rounded-lg bg-blue-600 p-2.5 text-white shadow-sm">
                    <FileBarChart2 class="size-5" />
                </span>
                <div>
                    <p class="text-sm font-semibold text-slate-900">
                        Manage leave requests
                    </p>
                    <p class="text-xs text-slate-500">
                        File a new request or approve pending ones. Approved
                        leave marks the day off in Attendance and feeds Payroll
                        as paid or unpaid leave.
                    </p>
                </div>
            </div>
            <ArrowUpRight
                class="size-4 text-blue-600 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
        </Link>
    </div>
</template>
