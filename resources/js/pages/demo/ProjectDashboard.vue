<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import {
    ArrowUpRight,
    CheckCircle2,
    Clock,
    FolderKanban,
    PauseCircle,
} from '@lucide/vue';
import type { LucideIcon } from '@lucide/vue';
import { computed } from 'vue';
import { useDemoEmployees } from '@/composables/useDemoEmployees';
import { useDemoProjects } from '@/composables/useDemoProjects';
import type { ProjectEmployee } from '@/composables/useDemoProjects';
import type { DemoProject } from '@/types';

const props = defineProps<{
    employees: ProjectEmployee[];
    projects: DemoProject[];
}>();

const { addedEmployees } = useDemoEmployees();

const allEmployees = computed<ProjectEmployee[]>(() => [
    ...props.employees,
    ...addedEmployees.value.map((employee) => ({
        id: employee.id,
        no: employee.no,
        name: employee.name,
        department: employee.department,
        position: employee.position,
    })),
]);

const { rows } = useDemoProjects(allEmployees.value, props.projects);

const activeCount = computed(
    () => rows.value.filter((row) => row.status === 'Active').length,
);

const planningCount = computed(
    () => rows.value.filter((row) => row.status === 'Planning').length,
);

const completedCount = computed(
    () => rows.value.filter((row) => row.status === 'Completed').length,
);

const overdueCount = computed(
    () => rows.value.filter((row) => row.overdue).length,
);

type StatCard = {
    label: string;
    value: string;
    icon: LucideIcon;
    iconClass: string;
    query: string;
};

const statCards: StatCard[] = [
    {
        label: 'Active projects',
        value: String(activeCount.value),
        icon: FolderKanban,
        iconClass: 'bg-blue-50 text-blue-700',
        query: '?status=Active',
    },
    {
        label: 'In planning',
        value: String(planningCount.value),
        icon: Clock,
        iconClass: 'bg-amber-50 text-amber-700',
        query: '?status=Planning',
    },
    {
        label: 'Completed',
        value: String(completedCount.value),
        icon: CheckCircle2,
        iconClass: 'bg-emerald-50 text-emerald-700',
        query: '?status=Completed',
    },
    {
        label: 'Overdue',
        value: String(overdueCount.value),
        icon: PauseCircle,
        iconClass: 'bg-red-50 text-red-700',
        query: '?overdue=1',
    },
];

// Projects by status for the bar chart.
const statusCounts = computed(() => {
    const order = ['Active', 'Planning', 'On Hold', 'Completed', 'Cancelled'];
    const counts = order.map((status) => ({
        status,
        count: rows.value.filter((row) => row.status === status).length,
    }));

    return counts.filter((row) => row.count > 0);
});

const maxStatusCount = computed(() =>
    Math.max(...statusCounts.value.map((c) => c.count), 1),
);

// Most recent projects first.
const recentProjects = computed(() =>
    [...rows.value]
        .sort((a, b) => b.start_date.localeCompare(a.start_date))
        .slice(0, 5),
);

const statusTone: Record<string, string> = {
    Active: 'bg-blue-50 text-blue-700 border-blue-200',
    Planning: 'bg-amber-50 text-amber-700 border-amber-200',
    'On Hold': 'bg-slate-100 text-slate-700 border-slate-200',
    Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Cancelled: 'bg-red-50 text-red-700 border-red-200',
};
</script>

<template>
    <Head title="Dashboard — Project Management" />

    <div class="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">
            Dashboard
        </h1>

        <!-- Stats (clickable -> filtered Project Registry) -->
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
                v-for="card in statCards"
                :key="card.label"
                :href="`/demo/projects/registry${card.query}`"
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
                    View registry
                    <ArrowUpRight class="size-3.5" />
                </p>
            </Link>
        </div>

        <!-- Chart + recent projects -->
        <div class="grid gap-6 lg:grid-cols-2">
            <!-- Vertical bars: projects by status -->
            <div class="rounded-xl border border-slate-200 bg-white p-5">
                <h2 class="font-semibold text-slate-900">Projects by status</h2>
                <p class="mt-0.5 text-xs text-slate-500">
                    Registry breakdown by current project lifecycle stage
                </p>

                <div class="mt-8 flex h-48 items-end gap-2 sm:gap-3">
                    <div
                        v-for="row in statusCounts"
                        :key="row.status"
                        class="relative flex min-w-0 flex-1 flex-col items-center justify-end self-stretch"
                    >
                        <span
                            class="absolute -top-5 left-1/2 -translate-x-1/2 text-[11px] font-semibold text-slate-600 tabular-nums"
                        >
                            {{ row.count }}
                        </span>
                        <div
                            class="w-full max-w-9 rounded-t-md bg-blue-600 transition-colors duration-200 hover:bg-blue-500"
                            :title="`${row.status}: ${row.count} project${row.count === 1 ? '' : 's'}`"
                            :style="{
                                height: `${(row.count / maxStatusCount) * 88}%`,
                            }"
                        ></div>
                    </div>
                </div>
                <div class="mt-1.5 flex gap-2 sm:gap-3">
                    <div
                        v-for="row in statusCounts"
                        :key="row.status"
                        class="min-w-0 flex-1"
                    >
                        <p
                            class="truncate text-center text-[10px] leading-tight text-slate-500"
                        >
                            {{ row.status }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Recent projects -->
            <div class="rounded-xl border border-slate-200 bg-white p-5">
                <div class="flex items-center justify-between">
                    <h2 class="font-semibold text-slate-900">
                        Recent projects
                    </h2>
                    <Link
                        href="/demo/projects/registry"
                        class="inline-flex items-center gap-1 text-xs font-medium text-blue-600 transition-colors hover:text-blue-800"
                    >
                        View all
                        <ArrowUpRight class="size-3.5" />
                    </Link>
                </div>

                <div class="mt-4 space-y-3">
                    <div
                        v-for="project in recentProjects"
                        :key="project.id"
                        class="rounded-lg border border-slate-100 bg-slate-50/60 px-4 py-3"
                    >
                        <div class="flex items-center justify-between gap-3">
                            <div class="min-w-0">
                                <p
                                    class="truncate text-sm font-medium text-slate-800"
                                >
                                    {{ project.name }}
                                </p>
                                <p
                                    class="mt-0.5 truncate text-xs text-slate-500"
                                >
                                    {{ project.lead_name }} &middot;
                                    {{ project.department }}
                                </p>
                            </div>
                            <span
                                class="shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium"
                                :class="
                                    statusTone[project.status] ??
                                    'border-slate-200 bg-slate-50 text-slate-600'
                                "
                            >
                                {{ project.status }}
                            </span>
                        </div>
                        <div class="mt-2.5">
                            <div class="flex items-center justify-between text-xs text-slate-500">
                                <span>{{ project.progress }}% milestones</span>
                                <span class="tabular-nums">{{ project.team_count }} member{{ project.team_count === 1 ? '' : 's' }}</span>
                            </div>
                            <div class="mt-1 h-1.5 w-full rounded-full bg-slate-200">
                                <div
                                    class="h-1.5 rounded-full bg-blue-600 transition-all duration-300"
                                    :style="{ width: `${project.progress}%` }"
                                ></div>
                            </div>
                        </div>
                    </div>

                    <p
                        v-if="recentProjects.length === 0"
                        class="py-6 text-center text-sm text-slate-500"
                    >
                        No projects in the registry yet.
                    </p>
                </div>
            </div>
        </div>

        <!-- Quick action -->
        <Link
            href="/demo/projects/registry"
            class="group flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50/60 p-5 transition-colors duration-200 hover:border-blue-300 hover:bg-blue-50"
        >
            <div class="flex items-center gap-3">
                <span class="rounded-lg bg-blue-600 p-2.5 text-white shadow-sm">
                    <FolderKanban class="size-5" />
                </span>
                <div>
                    <p class="text-sm font-semibold text-slate-900">
                        Open the project registry
                    </p>
                    <p class="text-xs text-slate-500">
                        View, add and manage company projects, track milestones, assign team members and update statuses.
                    </p>
                </div>
            </div>
            <ArrowUpRight
                class="size-4 text-blue-600 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
        </Link>
    </div>
</template>
