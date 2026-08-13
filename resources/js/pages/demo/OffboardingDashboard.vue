<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import {
    Archive,
    ArrowUpRight,
    Banknote,
    CalendarDays,
    ClipboardCheck,
    LogOut,
    ShieldAlert,
} from '@lucide/vue';
import type { LucideIcon } from '@lucide/vue';
import { computed } from 'vue';
import { useDemoDisciplinary } from '@/composables/useDemoDisciplinary';
import { useDemoEmployees } from '@/composables/useDemoEmployees';
import { useDemoOffboarding } from '@/composables/useDemoOffboarding';
import type { OffboardingEmployee } from '@/composables/useDemoOffboarding';
import type {
    DemoDisciplinaryRecord,
    DemoOffboardingCase,
    DemoOffboardingRow,
    DemoOffboardingStatus,
} from '@/types';

const props = defineProps<{
    employees: OffboardingEmployee[];
    cases: DemoOffboardingCase[];
    disciplinary: DemoDisciplinaryRecord[];
}>();

// Employees added in Employee Management can have separation cases too.
const { addedEmployees } = useDemoEmployees();

const allEmployees = computed<OffboardingEmployee[]>(() => [
    ...props.employees,
    ...addedEmployees.value.map((employee) => ({
        id: employee.id,
        no: employee.no,
        name: employee.name,
        department: employee.department,
        position: employee.position,
        employment_type: employee.employment_type,
        salary: employee.salary,
        leave_balance: employee.leave_balance,
    })),
]);

// Live Disciplinary handoff (Module 9) — seeded + session-escalated cases.
const { escalatedEmployeeIds } = useDemoDisciplinary(
    allEmployees.value,
    props.disciplinary,
);

const { rows } = useDemoOffboarding(
    allEmployees.value,
    props.cases,
    escalatedEmployeeIds.value.map((employee_id) => ({ employee_id })),
);

const activeCases = computed(() =>
    rows.value.filter((row) => row.status !== 'Completed'),
);

const inClearance = computed(
    () => rows.value.filter((row) => row.status === 'In Clearance').length,
);

const finalPayPending = computed(
    () => rows.value.filter((row) => row.status === 'Final Pay').length,
);

const archived = computed(
    () => rows.value.filter((row) => row.status === 'Completed').length,
);

const flaggedActive = computed(
    () => activeCases.value.filter((row) => row.flagged).length,
);

type StatCard = {
    label: string;
    value: string;
    icon: LucideIcon;
    iconClass: string;
    /** Query string pre-filtering the Offboarding register. */
    query: string;
};

// Every card deep-links into the Offboarding register (like the other
// modules' stat cards), pre-filtered to what the number counts.
const statCards: StatCard[] = [
    {
        label: 'Active separations',
        value: String(activeCases.value.length),
        icon: LogOut,
        iconClass: 'bg-blue-50 text-blue-700',
        query: '?tab=active',
    },
    {
        label: 'In clearance',
        value: String(inClearance.value),
        icon: ClipboardCheck,
        iconClass: 'bg-amber-50 text-amber-700',
        query: '?tab=active&status=In Clearance',
    },
    {
        label: 'Final pay pending',
        value: String(finalPayPending.value),
        icon: Banknote,
        iconClass: 'bg-indigo-50 text-indigo-700',
        query: '?tab=active&status=Final Pay',
    },
    {
        label: 'Archived this year',
        value: String(archived.value),
        icon: Archive,
        iconClass: 'bg-emerald-50 text-emerald-700',
        query: '?tab=archived',
    },
];

// Cases per pipeline stage for the horizontal bar chart.
const stageCounts = computed(() => {
    const order: DemoOffboardingStatus[] = [
        'Requested',
        'In Clearance',
        'Final Pay',
        'Completed',
    ];

    return order.map((status) => ({
        status,
        count: rows.value.filter((row) => row.status === status).length,
    }));
});

const maxStageCount = computed(() =>
    Math.max(...stageCounts.value.map((row) => row.count), 1),
);

const recent = computed(() =>
    [...activeCases.value]
        .sort((a, b) => (a.requested_on < b.requested_on ? 1 : -1))
        .slice(0, 5),
);

const statusTone: Record<string, string> = {
    Requested: 'bg-blue-50 text-blue-700 border-blue-200',
    'In Clearance': 'bg-amber-50 text-amber-700 border-amber-200',
    'Final Pay': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

function progressBar(row: DemoOffboardingRow): string {
    return `width: ${row.progress}%`;
}
</script>

<template>
    <Head title="Dashboard — Separation & Offboarding" />

    <div class="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">
            Dashboard
        </h1>

        <!-- Stats (clickable -> filtered Offboarding register) -->
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
                v-for="card in statCards"
                :key="card.label"
                :href="`/demo/offboarding/cases${card.query}`"
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
                    View register
                    <ArrowUpRight class="size-3.5" />
                </p>
            </Link>
        </div>

        <!-- Chart + recent cases -->
        <div class="grid gap-6 lg:grid-cols-2">
            <!-- Horizontal bars: cases by pipeline stage -->
            <div class="rounded-xl border border-slate-200 bg-white p-5">
                <h2 class="font-semibold text-slate-900">Pipeline by stage</h2>
                <p class="mt-0.5 text-xs text-slate-500">
                    Separation cases grouped by their current stage
                </p>

                <div class="mt-6 flex flex-col gap-4">
                    <div
                        v-for="row in stageCounts"
                        :key="row.status"
                        class="flex items-center gap-3"
                    >
                        <span
                            class="w-24 shrink-0 text-xs font-medium text-slate-600"
                        >
                            {{ row.status }}
                        </span>
                        <div
                            class="h-7 flex-1 overflow-hidden rounded-md bg-slate-100"
                        >
                            <div
                                class="flex h-full items-center justify-end rounded-md bg-blue-600 px-2 transition-all duration-300"
                                :style="{
                                    width: `${(row.count / maxStageCount) * 100}%`,
                                    minWidth: row.count > 0 ? '2rem' : '0',
                                }"
                            >
                                <span
                                    v-if="row.count > 0"
                                    class="text-xs font-semibold text-white tabular-nums"
                                >
                                    {{ row.count }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Recent active cases -->
            <div class="rounded-xl border border-slate-200 bg-white p-5">
                <div class="flex items-center justify-between">
                    <h2 class="font-semibold text-slate-900">
                        Recent separations
                    </h2>
                    <Link
                        href="/demo/offboarding/cases"
                        class="inline-flex items-center gap-1 text-xs font-medium text-blue-600 transition-colors hover:text-blue-800"
                    >
                        View all
                        <ArrowUpRight class="size-3.5" />
                    </Link>
                </div>

                <div class="mt-4 space-y-3">
                    <div
                        v-for="row in recent"
                        :key="row.id"
                        class="rounded-lg border border-slate-100 bg-slate-50/60 px-4 py-3"
                    >
                        <div class="flex items-center justify-between gap-3">
                            <div class="min-w-0">
                                <p
                                    class="truncate text-sm font-medium text-slate-800"
                                >
                                    {{ row.name }}
                                </p>
                                <p
                                    class="mt-0.5 truncate text-xs text-slate-500"
                                >
                                    {{ row.position }} · {{ row.department }}
                                </p>
                            </div>
                            <span
                                class="inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-xs font-medium"
                                :class="statusTone[row.status]"
                            >
                                {{ row.status }}
                            </span>
                        </div>
                        <div
                            class="mt-2.5 flex items-center justify-between gap-3"
                        >
                            <div class="min-w-0 flex-1">
                                <div
                                    class="h-1.5 w-full overflow-hidden rounded-full bg-slate-200"
                                >
                                    <div
                                        class="h-full rounded-full bg-blue-600"
                                        :style="progressBar(row)"
                                    ></div>
                                </div>
                                <p class="mt-1 text-[10px] text-slate-400">
                                    {{ row.progress }}% clearance
                                </p>
                            </div>
                            <Link
                                :href="
                                    row.employee_id >= 1001
                                        ? `/demo/offboarding/cases/session/${row.employee_id}`
                                        : `/demo/offboarding/cases/${row.employee_id}`
                                "
                                class="shrink-0 text-xs font-medium text-blue-600 transition-colors hover:text-blue-800"
                            >
                                Open
                            </Link>
                        </div>
                    </div>

                    <p
                        v-if="recent.length === 0"
                        class="py-6 text-center text-sm text-slate-500"
                    >
                        No active separations right now.
                    </p>
                </div>
            </div>
        </div>

        <!-- Handoff note: escalations from Disciplinary -->
        <div
            v-if="flaggedActive > 0"
            class="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/60 p-4 text-sm text-red-900"
        >
            <ShieldAlert class="mt-0.5 size-4 shrink-0 text-red-600" />
            <div class="text-xs leading-relaxed">
                <p class="font-semibold text-slate-900">
                    Handoff from Disciplinary
                </p>
                <p class="mt-1 text-slate-600">
                    {{ flaggedActive }} active separation{{
                        flaggedActive === 1 ? '' : 's'
                    }}
                    came from escalated disciplinary cases (Module 9) — review
                    the case notes before finalizing termination.
                </p>
            </div>
        </div>

        <!-- Quick action -->
        <Link
            href="/demo/offboarding/cases"
            class="group flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50/60 p-5 transition-colors duration-200 hover:border-blue-300 hover:bg-blue-50"
        >
            <div class="flex items-center gap-3">
                <span class="rounded-lg bg-blue-600 p-2.5 text-white shadow-sm">
                    <CalendarDays class="size-5" />
                </span>
                <div>
                    <p class="text-sm font-semibold text-slate-900">
                        Open the offboarding register
                    </p>
                    <p class="text-xs text-slate-500">
                        Start a separation, work through the clearance
                        checklist, and release final pay — then the employee
                        record is archived safely.
                    </p>
                </div>
            </div>
            <ArrowUpRight
                class="size-4 text-blue-600 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
        </Link>
    </div>
</template>
