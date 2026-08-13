<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import {
    AlertTriangle,
    ArrowUpRight,
    FileX,
    ShieldAlert,
    UserX,
} from '@lucide/vue';
import type { LucideIcon } from '@lucide/vue';
import { computed } from 'vue';
import { useDemoDisciplinary } from '@/composables/useDemoDisciplinary';
import type { DisciplinaryEmployee } from '@/composables/useDemoDisciplinary';
import type { DemoDisciplinaryRecord } from '@/types';

const props = defineProps<{
    employees: DisciplinaryEmployee[];
    records: DemoDisciplinaryRecord[];
}>();

const { rows, repeatOffenders } = useDemoDisciplinary(
    props.employees,
    props.records,
);

const openCases = computed(
    () =>
        rows.value.filter(
            (row) => row.status === 'Logged' || row.status === 'Under Review',
        ).length,
);

const warnings = computed(
    () => rows.value.filter((row) => row.type === 'Warning').length,
);

const incidents = computed(
    () => rows.value.filter((row) => row.type === 'Incident').length,
);

const escalated = computed(
    () => rows.value.filter((row) => row.status === 'Escalated').length,
);

type StatCard = {
    label: string;
    value: string;
    icon: LucideIcon;
    iconClass: string;
    /** Query string pre-filtering the Disciplinary Log directory. */
    query: string;
};

// Every card deep-links into the Disciplinary Log directory (like the other
// modules' stat cards), pre-filtered to what the number counts.
const statCards: StatCard[] = [
    {
        label: 'Open cases',
        value: String(openCases.value),
        icon: ShieldAlert,
        iconClass: 'bg-amber-50 text-amber-700',
        query: '?tab=log&status=open',
    },
    {
        label: 'Warnings logged',
        value: String(warnings.value),
        icon: AlertTriangle,
        iconClass: 'bg-blue-50 text-blue-700',
        query: '?tab=log&type=warning',
    },
    {
        label: 'Incidents logged',
        value: String(incidents.value),
        icon: FileX,
        iconClass: 'bg-indigo-50 text-indigo-700',
        query: '?tab=log&type=incident',
    },
    {
        label: 'Escalated to offboarding',
        value: String(escalated.value),
        icon: UserX,
        iconClass: 'bg-red-50 text-red-700',
        query: '?tab=log&status=escalated',
    },
];

// Cases per severity for the vertical bar chart.
const severityCounts = computed(() => {
    const order = ['Serious', 'Moderate', 'Minor'];
    const counts = order.map((severity) => ({
        severity,
        count: rows.value.filter((row) => row.severity === severity).length,
    }));

    return counts.filter((row) => row.count > 0);
});

const maxSeverityCount = computed(() =>
    Math.max(...severityCounts.value.map((c) => c.count), 1),
);

// Repeat offenders with open cases first.
const flagged = computed(() =>
    repeatOffenders.value.filter((row) => row.flagged).slice(0, 5),
);
</script>

<template>
    <Head title="Dashboard — Disciplinary Management" />

    <div class="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">
            Dashboard
        </h1>

        <!-- Stats (clickable -> filtered Disciplinary Log directory) -->
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
                v-for="card in statCards"
                :key="card.label"
                :href="`/demo/disciplinary/records${card.query}`"
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

        <!-- Chart + repeat offenders -->
        <div class="grid gap-6 lg:grid-cols-2">
            <!-- Vertical bars: cases by severity -->
            <div class="rounded-xl border border-slate-200 bg-white p-5">
                <h2 class="font-semibold text-slate-900">Cases by severity</h2>
                <p class="mt-0.5 text-xs text-slate-500">
                    Disciplinary records grouped by severity level
                </p>

                <div class="mt-8 flex h-48 items-end gap-2 sm:gap-3">
                    <div
                        v-for="row in severityCounts"
                        :key="row.severity"
                        class="relative flex min-w-0 flex-1 flex-col items-center justify-end self-stretch"
                    >
                        <span
                            class="absolute -top-5 left-1/2 -translate-x-1/2 text-[11px] font-semibold text-slate-600 tabular-nums"
                        >
                            {{ row.count }}
                        </span>
                        <div
                            class="w-full max-w-9 rounded-t-md bg-blue-600 transition-colors duration-200 hover:bg-blue-500"
                            :title="`${row.severity}: ${row.count} cases`"
                            :style="{
                                height: `${(row.count / maxSeverityCount) * 88}%`,
                            }"
                        ></div>
                    </div>
                </div>
                <div class="mt-1.5 flex gap-2 sm:gap-3">
                    <div
                        v-for="row in severityCounts"
                        :key="row.severity"
                        class="min-w-0 flex-1"
                    >
                        <p
                            class="truncate text-center text-[10px] leading-tight text-slate-500"
                        >
                            {{ row.severity }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Repeat offenders flagged for offboarding -->
            <div class="rounded-xl border border-slate-200 bg-white p-5">
                <div class="flex items-center justify-between">
                    <h2 class="font-semibold text-slate-900">
                        Repeat offenders
                    </h2>
                    <Link
                        href="/demo/disciplinary/records?tab=repeat"
                        class="inline-flex items-center gap-1 text-xs font-medium text-blue-600 transition-colors hover:text-blue-800"
                    >
                        View all
                        <ArrowUpRight class="size-3.5" />
                    </Link>
                </div>

                <div class="mt-4 space-y-3">
                    <div
                        v-for="offender in flagged"
                        :key="offender.employee_id"
                        class="rounded-lg border border-slate-100 bg-slate-50/60 px-4 py-3"
                    >
                        <div class="flex items-center justify-between gap-3">
                            <div class="min-w-0">
                                <p
                                    class="truncate text-sm font-medium text-slate-800"
                                >
                                    {{ offender.name }}
                                </p>
                                <p
                                    class="mt-0.5 truncate text-xs text-slate-500"
                                >
                                    {{ offender.position }} ·
                                    {{ offender.department }}
                                </p>
                            </div>
                            <span
                                class="shrink-0 rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700"
                            >
                                {{ offender.recordCount }} case{{
                                    offender.recordCount === 1 ? '' : 's'
                                }}
                            </span>
                        </div>
                        <div class="mt-2.5 flex items-center justify-between">
                            <div class="flex items-center gap-1.5">
                                <span
                                    v-for="severity in [
                                        'Serious',
                                        'Moderate',
                                        'Minor',
                                    ]"
                                    :key="severity"
                                    class="inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium"
                                    :class="
                                        severity === 'Serious'
                                            ? 'border-red-200 bg-red-50 text-red-700'
                                            : severity === 'Moderate'
                                              ? 'border-amber-200 bg-amber-50 text-amber-700'
                                              : 'border-blue-200 bg-blue-50 text-blue-700'
                                    "
                                >
                                    {{ severity }}
                                </span>
                            </div>
                            <span
                                class="text-xs font-medium text-slate-600 tabular-nums"
                            >
                                {{ offender.seriousCount }} serious
                            </span>
                        </div>
                    </div>

                    <p
                        v-if="flagged.length === 0"
                        class="py-6 text-center text-sm text-slate-500"
                    >
                        No repeat offenders right now.
                    </p>
                </div>
            </div>
        </div>

        <!-- Quick action -->
        <Link
            href="/demo/disciplinary/records"
            class="group flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50/60 p-5 transition-colors duration-200 hover:border-blue-300 hover:bg-blue-50"
        >
            <div class="flex items-center gap-3">
                <span class="rounded-lg bg-blue-600 p-2.5 text-white shadow-sm">
                    <ShieldAlert class="size-5" />
                </span>
                <div>
                    <p class="text-sm font-semibold text-slate-900">
                        Review the disciplinary log
                    </p>
                    <p class="text-xs text-slate-500">
                        Log warnings and incidents fairly, move cases through
                        review, and escalate repeat offenders to Separation &
                        Offboarding when needed.
                    </p>
                </div>
            </div>
            <ArrowUpRight
                class="size-4 text-blue-600 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
        </Link>
    </div>
</template>
