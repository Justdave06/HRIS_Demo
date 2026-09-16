<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import {
    ArrowLeft,
    ArrowUpRight,
    CalendarClock,
    Check,
    Circle,
    CircleDollarSign,
    FolderKanban,
    UserRoundCheck,
    Users,
} from '@lucide/vue';
import { computed, ref } from 'vue';
import { toast } from 'vue-sonner';
import AttendanceReportDocument from '@/components/demo/AttendanceReportDocument.vue';
import RecordPrintModal from '@/components/demo/RecordPrintModal.vue';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useDemoEmployees } from '@/composables/useDemoEmployees';
import {
    PROJECT_STATUSES,
    useDemoProjects,
} from '@/composables/useDemoProjects';
import type { ProjectEmployee } from '@/composables/useDemoProjects';
import { exportSheet } from '@/lib/exportExcel';
import type { DemoProject, DemoProjectStatus } from '@/types';

const props = defineProps<{
    project: DemoProject;
    employees: ProjectEmployee[];
    projects: DemoProject[];
}>();

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

const teamMembers = computed(() =>
    current.value.team_names.map((name, index) => ({
        name,
        position:
            allEmployees.value.find((employee) => employee.name === name)
                ?.position ?? '',
        no: allEmployees.value.find((employee) => employee.name === name)?.no ?? '',
    })),
);

function changeStatus(status: DemoProjectStatus): void {
    setStatus(current.value.id, status);
    toast.success(`Project marked ${status} (demo)`);
}

function toggle(index: number): void {
    toggleMilestone(current.value.id, index);
    toast('Milestone status updated (demo)');
}

/* ------------------------------------------------------------------ */
/* Generate / export                                                   */
/* ------------------------------------------------------------------ */

const showPreview = ref(false);

const printedOn = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
});

const reportRows = computed(() =>
    current.value.milestones.map((milestone, index) => ({
        no: index + 1,
        name: milestone.name,
        due: milestone.due_date,
        status: milestone.completed ? 'Completed' : 'Pending',
    })),
);

function exportExcel(): void {
    const headers = ['No.', 'Milestone', 'Due Date', 'Status'];
    const rowsCsv = reportRows.value.map((row) => [
        row.no,
        row.name,
        row.due,
        row.status,
    ]);

    exportSheet(
        `${current.value.name.replaceAll(' ', '-').toLowerCase()}-milestones`,
        'Project Milestones',
        headers,
        rowsCsv,
    );
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
                <div class="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-slate-500">
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
                <Button variant="outline" @click="showPreview = true">
                    <FolderKanban class="size-4" />
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

        <!-- Summary -->
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div
                class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
                <div class="flex items-center justify-between">
                    <p
                        class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                    >
                        Progress
                    </p>
                    <span class="rounded-lg bg-blue-50 p-2 text-blue-700">
                        <FolderKanban class="size-4" />
                    </span>
                </div>
                <p class="mt-2 text-3xl font-bold text-slate-900 tabular-nums">
                    {{ current.progress }}%
                </p>
                <p class="mt-1 text-xs text-slate-500">
                    Milestones completed
                </p>
            </div>

            <div
                class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
                <div class="flex items-center justify-between">
                    <p
                        class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                    >
                        Team size
                    </p>
                    <span class="rounded-lg bg-indigo-50 p-2 text-indigo-700">
                        <Users class="size-4" />
                    </span>
                </div>
                <p class="mt-2 text-3xl font-bold text-slate-900 tabular-nums">
                    {{ current.team_count }}
                </p>
                <p class="mt-1 text-xs text-slate-500">
                    Members assigned to the project
                </p>
            </div>

            <div
                class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
                <div class="flex items-center justify-between">
                    <p
                        class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                    >
                        Milestones
                    </p>
                    <span class="rounded-lg bg-amber-50 p-2 text-amber-700">
                        <CalendarClock class="size-4" />
                    </span>
                </div>
                <p class="mt-2 text-3xl font-bold text-slate-900 tabular-nums">
                    {{ current.milestones.length }}
                </p>
                <p class="mt-1 text-xs text-slate-500">
                    {{ current.milestones.filter((m) => m.completed).length }}
                    done
                </p>
            </div>

            <div
                class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
                <div class="flex items-center justify-between">
                    <p
                        class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                    >
                        Budget
                    </p>
                    <span class="rounded-lg bg-emerald-50 p-2 text-emerald-700">
                        <CircleDollarSign class="size-4" />
                    </span>
                </div>
                <p
                    class="mt-2 text-3xl font-bold text-slate-900 tabular-nums"
                >
                    ₱{{ current.budget.toLocaleString() }}
                </p>
                <p class="mt-1 text-xs text-slate-500">
                    Total approved budget
                </p>
            </div>
        </div>

        <!-- Details + milestones -->
        <div class="grid gap-6 lg:grid-cols-2">
            <div class="flex flex-col gap-6">
                <!-- Description -->
                <div class="rounded-xl border border-slate-200 bg-white p-5">
                    <h2 class="font-semibold text-slate-900">Description</h2>
                    <p
                        class="mt-2 text-sm leading-relaxed text-slate-600"
                    >
                        {{
                            current.description ||
                            'No description on file for this project.'
                        }}
                    </p>

                    <div class="mt-5 flex items-center justify-between gap-3 border-t pt-4">
                        <div>
                            <p class="text-xs font-medium text-slate-500">
                                Timeline
                            </p>
                            <p class="mt-0.5 text-sm font-medium text-slate-900 tabular-nums">
                                {{ current.start_date }} → {{ current.end_date }}
                            </p>
                        </div>
                        <div class="flex items-center gap-2">
                            <p class="text-xs text-slate-500">Change status</p>
                            <Select
                                :model-value="current.status"
                                @update:model-value="
                                    (value) =>
                                        changeStatus(value as DemoProjectStatus)
                                "
                            >
                                <SelectTrigger class="w-32 h-8 rounded-md border text-xs shadow-none">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem
                                        v-for="status in PROJECT_STATUSES"
                                        :key="status"
                                        :value="status"
                                    >
                                        {{ status }}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <!-- Milestones -->
                <div class="rounded-xl border border-slate-200 bg-white p-5">
                    <div class="flex items-center justify-between">
                        <h2 class="font-semibold text-slate-900">
                            Milestones
                        </h2>
                        <span
                            class="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 tabular-nums"
                        >
                            {{ current.progress }}%
                        </span>
                    </div>
                    <div class="mt-4">
                        <div
                            v-for="(milestone, index) in current.milestones"
                            :key="index"
                            class="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/60 px-3.5 py-2.5"
                            :class="{ 'mt-2': index > 0 }"
                        >
                            <button
                                type="button"
                                class="shrink-0 text-slate-400 transition-colors hover:text-blue-600"
                                :title="
                                    milestone.completed
                                        ? 'Mark as pending'
                                        : 'Mark as completed'
                                "
                                @click="toggle(index)"
                            >
                                <Check
                                    v-if="milestone.completed"
                                    class="size-5 text-emerald-600"
                                />
                                <Circle v-else class="size-5" />
                            </button>
                            <div class="min-w-0 flex-1">
                                <p
                                    class="truncate text-sm font-medium"
                                    :class="
                                        milestone.completed
                                            ? 'text-slate-400 line-through'
                                            : 'text-slate-800'
                                    "
                                >
                                    {{ milestone.name }}
                                </p>
                                <p
                                    class="text-[11px] text-muted-foreground tabular-nums"
                                >
                                    Due {{ milestone.due_date }}
                                </p>
                            </div>
                        </div>

                        <p
                            v-if="current.milestones.length === 0"
                            class="py-6 text-center text-sm text-slate-500"
                        >
                            No milestones added yet — add them when you edit the
                            project.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Team -->
            <div class="rounded-xl border border-slate-200 bg-white p-5 h-fit">
                <div class="flex items-center justify-between">
                    <h2 class="font-semibold text-slate-900">
                        Team
                    </h2>
                    <span
                        class="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700"
                    >
                        <UserRoundCheck class="size-3.5" />
                        {{ current.team_count }} assigned
                    </span>
                </div>

                <div class="mt-4 space-y-2">
                    <div
                        class="flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-50/60 px-3.5 py-2.5"
                    >
                        <span
                            class="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white"
                        >
                            {{ current.lead_name.charAt(0) }}
                        </span>
                        <div class="min-w-0 flex-1">
                            <p class="truncate text-sm font-medium text-slate-900">
                                {{ current.lead_name }}
                            </p>
                            <p class="truncate text-[11px] text-muted-foreground">
                                Project lead
                            </p>
                        </div>
                    </div>

                    <div
                        v-for="member in teamMembers"
                        :key="member.name"
                        class="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/60 px-3.5 py-2.5"
                    >
                        <span
                            class="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-500 text-xs font-bold text-white"
                        >
                            {{ member.name.charAt(0) }}
                        </span>
                        <div class="min-w-0 flex-1">
                            <p class="truncate text-sm font-medium text-slate-800">
                                {{ member.name }}
                            </p>
                            <p class="truncate text-[11px] text-muted-foreground">
                                {{ member.position }}
                                <span v-if="member.no">· {{ member.no }}</span>
                            </p>
                        </div>
                    </div>

                    <p
                        v-if="current.team_count === 0"
                        class="py-6 text-center text-sm text-slate-500"
                    >
                        No team members assigned yet.
                    </p>
                </div>
            </div>
        </div>
    </div>

    <!-- Generate report preview -->
    <RecordPrintModal
        v-if="showPreview"
        :heading="`${current.name} — ${reportRows.length} milestone${reportRows.length === 1 ? '' : 's'}`"
        subtitle="Official project document · ready to print"
        @close="showPreview = false"
    >
        <AttendanceReportDocument
            :title="`Project: ${current.name}`"
            :period="`As of ${printedOn}`"
            system="Project Management System"
            :columns="[
                { key: 'no', label: 'No.' },
                { key: 'name', label: 'Milestone' },
                { key: 'due', label: 'Due Date' },
                { key: 'status', label: 'Status' },
            ]"
            :rows="reportRows"
            :note="`${current.status} · ${current.department} · Lead: ${current.lead_name} · Budget ₱${current.budget.toLocaleString()}`"
        />
    </RecordPrintModal>
</template>