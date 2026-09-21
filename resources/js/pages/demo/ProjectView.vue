<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import {
    ArrowLeft,
    FileBarChart2,
    FolderKanban,
    ArrowUpRight,
} from '@lucide/vue';
import { computed, ref } from 'vue';
import { toast } from 'vue-sonner';
import { Button } from '@/components/ui/button';
import { useDemoEmployees } from '@/composables/useDemoEmployees';
import { useDemoProjects } from '@/composables/useDemoProjects';
import type { ProjectEmployee } from '@/composables/useDemoProjects';
import ProjectBudgetBreakdown from '@/pages/demo/ProjectBudgetBreakdown.vue';
import ProjectDetail from '@/pages/demo/ProjectDetail.vue';
import type { DemoProject, DemoProjectStatus } from '@/types';

const props = defineProps<{
    project: DemoProject;
    employees: ProjectEmployee[];
    projects: DemoProject[];
    initialTab?: 'detail' | 'budget';
}>();

type ProjectTab = 'detail' | 'budget';

const tabs = [
    { key: 'detail' as const, label: 'Project detail', icon: FolderKanban },
    { key: 'budget' as const, label: 'Budget breakdown', icon: FileBarChart2 },
];

const activeTab = ref<ProjectTab>(
    props.initialTab === 'budget' ? 'budget' : 'detail',
);

function switchTab(tab: ProjectTab): void {
    activeTab.value = tab;
}

// Session-added employees (Employee Management module) join the pickers.
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

const { rows, setStatus, toggleMilestone } = useDemoProjects(
    allEmployees.value,
    props.projects,
);

// The composable owns the live project (session-aware); the server prop is
// only the fallback for a freshly added session project before it hydrates.
const current = computed(
    () =>
        rows.value.find((row) => row.id === props.project.id) ??
        ({
            ...props.project,
            lead_name: 'Unassigned',
            team_names: [],
            team_count: 0,
            progress: 0,
            overdue: false,
        } as (typeof rows.value)[number]),
);

const statusTone: Record<string, string> = {
    Active: 'bg-blue-50 text-blue-700 border-blue-200',
    Planning: 'bg-amber-50 text-amber-700 border-amber-200',
    'On Hold': 'bg-slate-100 text-slate-700 border-slate-200',
    Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Cancelled: 'bg-red-50 text-red-700 border-red-200',
};

function changeStatus(status: DemoProjectStatus): void {
    setStatus(current.value.id, status);
    toast.success(`Project marked ${status} (demo)`);
}

/* Toggling a milestone is its own feedback — the checkbox changes on click. */
function toggle(index: number): void {
    toggleMilestone(current.value.id, index);
}

/* ------------------------------------------------------------------ */
/* Header actions — delegated to whichever tab is active               */
/* ------------------------------------------------------------------ */

const detailRef = ref<InstanceType<typeof ProjectDetail> | null>(null);
const budgetRef = ref<InstanceType<typeof ProjectBudgetBreakdown> | null>(null);

function generateReport(): void {
    if (activeTab.value === 'detail') {
        detailRef.value?.generateReport();

        return;
    }

    budgetRef.value?.generateReport();
}

function exportExcel(): void {
    if (activeTab.value === 'detail') {
        detailRef.value?.exportExcel();

        return;
    }

    budgetRef.value?.exportExcel();
}
</script>

<template>
    <Head :title="`${current.name} — Project Management`" />

    <div class="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <!-- Header -->
        <div
            class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
            <div>
                <Link
                    href="/demo/projects/registry"
                    class="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-blue-600"
                >
                    <ArrowLeft class="size-3.5" />
                    Back to Project Registry
                </Link>
                <h1
                    class="mt-2 text-2xl font-bold tracking-tight text-slate-900"
                >
                    {{ current.name }}
                </h1>
                <div
                    class="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-slate-500"
                >
                    <span
                        class="inline-flex rounded-full border px-2 py-0.5 text-xs font-medium"
                        :class="
                            statusTone[current.status] ??
                            'border-slate-200 bg-slate-50 text-slate-600'
                        "
                    >
                        {{ current.status }}
                    </span>
                    <span
                        v-if="current.overdue"
                        class="inline-flex rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700"
                    >
                        Overdue
                    </span>
                    <span>{{ current.department }}</span>
                </div>
            </div>
            <div class="flex flex-wrap gap-2">
                <Button variant="outline" @click="generateReport">
                    <FileBarChart2 class="size-4" />
                    Generate report
                </Button>
                <Button
                    class="bg-blue-600 hover:bg-blue-700"
                    @click="exportExcel"
                >
                    <ArrowUpRight class="size-4" />
                    Export to Excel
                </Button>
            </div>
        </div>

        <!-- Tabs: sticky, compact, left-aligned -->
        <div
            class="sticky top-2 z-20 inline-flex w-fit rounded-xl border bg-card p-1 shadow-sm"
        >
            <button
                v-for="tab in tabs"
                :key="tab.key"
                type="button"
                class="inline-flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors"
                :class="
                    activeTab === tab.key
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                "
                @click="switchTab(tab.key)"
            >
                <component :is="tab.icon" class="size-4" />
                {{ tab.label }}
            </button>
        </div>
        <ProjectDetail
            v-if="activeTab === 'detail'"
            ref="detailRef"
            :project="current"
            :employees="allEmployees"
            @change-status="changeStatus"
            @toggle-milestone="toggle"
            @switch-tab="switchTab('budget')"
        />

        <ProjectBudgetBreakdown v-else ref="budgetRef" :project="current" />
    </div>
</template>
