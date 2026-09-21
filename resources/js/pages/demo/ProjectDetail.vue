<script setup lang="ts">
import {
    CalendarClock,
    Check,
    Circle,
    CircleDollarSign,
    FolderKanban,
    UserRoundCheck,
    Users,
} from '@lucide/vue';
import { computed, ref } from 'vue';
import AttendanceReportDocument from '@/components/demo/AttendanceReportDocument.vue';
import RecordPrintModal from '@/components/demo/RecordPrintModal.vue';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    PROJECT_STATUSES,
} from '@/composables/useDemoProjects';
import type { ProjectEmployee } from '@/composables/useDemoProjects';
import { exportSheet } from '@/lib/exportExcel';
import type { DemoProjectRow, DemoProjectStatus } from '@/types';

/*
 * Tab panel of ProjectView: summary, description, milestones and team for the
 * active project. The parent owns the header, the session store and the tab
 * bar — status and milestone actions are emitted back to it.
 */
const props = defineProps<{
    project: DemoProjectRow;
    employees: ProjectEmployee[];
}>();

const emit = defineEmits<{
    (e: 'change-status', status: DemoProjectStatus): void;
    (e: 'toggle-milestone', index: number): void;
    (e: 'switch-tab'): void;
}>();

const teamMembers = computed(() =>
    props.project.team_names.map((name) => ({
        name,
        position:
            props.employees.find((employee) => employee.name === name)
                ?.position ?? '',
        no: props.employees.find((employee) => employee.name === name)?.no ?? '',
    })),
);

/* ------------------------------------------------------------------ */
/* Generate / export (triggered from the ProjectView header)           */
/* ------------------------------------------------------------------ */

const showPreview = ref(false);

const printedOn = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
});

const reportRows = computed(() =>
    props.project.milestones.map((milestone, index) => ({
        no: index + 1,
        name: milestone.name,
        due: milestone.due_date,
        status: milestone.completed ? 'Completed' : 'Pending',
    })),
);

function generateReport(): void {
    showPreview.value = true;
}

function exportExcel(): void {
    const headers = ['No.', 'Milestone', 'Due Date', 'Status'];
    const rowsCsv = reportRows.value.map((row) => [
        row.no,
        row.name,
        row.due,
        row.status,
    ]);

    exportSheet(
        `${props.project.name.replaceAll(' ', '-').toLowerCase()}-milestones`,
        'Project Milestones',
        headers,
        rowsCsv,
    );
}

defineExpose({ generateReport, exportExcel });
</script>

<template>
    <div class="flex flex-col gap-6">
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
                    {{ project.progress }}%
                </p>
                <p class="mt-1 text-xs text-slate-500">Milestones completed</p>
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
                    {{ project.team_count }}
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
                    {{ project.milestones.length }}
                </p>
                <p class="mt-1 text-xs text-slate-500">
                    {{ project.milestones.filter((m) => m.completed).length }}
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
                <p class="mt-2 text-3xl font-bold text-slate-900 tabular-nums">
                    ₱{{ project.budget.toLocaleString() }}
                </p>
                <p class="mt-1 text-xs text-slate-500">Total approved budget</p>
                <button
                    type="button"
                    class="mt-3 inline-flex items-center text-xs font-medium text-blue-600 transition-colors hover:text-blue-700"
                    @click="emit('switch-tab')"
                >
                    Budget Breakdown
                </button>
            </div>
        </div>

        <!-- Details + milestones -->
        <div class="grid gap-6 lg:grid-cols-2">
            <div class="flex flex-col gap-6">
                <!-- Description -->
                <div class="rounded-xl border border-slate-200 bg-white p-5">
                    <h2 class="font-semibold text-slate-900">Description</h2>
                    <p class="mt-2 text-sm leading-relaxed text-slate-600">
                        {{
                            project.description ||
                            'No description on file for this project.'
                        }}
                    </p>

                    <div
                        class="mt-5 flex items-center justify-between gap-3 border-t pt-4"
                    >
                        <div>
                            <p class="text-xs font-medium text-slate-500">
                                Timeline
                            </p>
                            <p
                                class="mt-0.5 text-sm font-medium text-slate-900 tabular-nums"
                            >
                                {{ project.start_date }} →
                                {{ project.end_date }}
                            </p>
                        </div>
                        <div class="flex items-center gap-2">
                            <p class="text-xs text-slate-500">Change status</p>
                            <Select
                                :model-value="project.status"
                                @update:model-value="
                                    (value) =>
                                        emit(
                                            'change-status',
                                            value as DemoProjectStatus,
                                        )
                                "
                            >
                                <SelectTrigger
                                    class="h-8 w-32 rounded-md border text-xs shadow-none"
                                >
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
                        <h2 class="font-semibold text-slate-900">Milestones</h2>
                        <span
                            class="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 tabular-nums"
                        >
                            {{ project.progress }}%
                        </span>
                    </div>
                    <div class="mt-4">
                        <div
                            v-for="(milestone, index) in project.milestones"
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
                                @click="emit('toggle-milestone', index)"
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
                            v-if="project.milestones.length === 0"
                            class="py-6 text-center text-sm text-slate-500"
                        >
                            No milestones added yet — add them when you edit the
                            project.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Team -->
            <div class="h-fit rounded-xl border border-slate-200 bg-white p-5">
                <div class="flex items-center justify-between">
                    <h2 class="font-semibold text-slate-900">Team</h2>
                    <span
                        class="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700"
                    >
                        <UserRoundCheck class="size-3.5" />
                        {{ project.team_count }} assigned
                    </span>
                </div>

                <div class="mt-4 space-y-2">
                    <div
                        class="flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-50/60 px-3.5 py-2.5"
                    >
                        <span
                            class="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white"
                        >
                            {{ project.lead_name.charAt(0) }}
                        </span>
                        <div class="min-w-0 flex-1">
                            <p
                                class="truncate text-sm font-medium text-slate-900"
                            >
                                {{ project.lead_name }}
                            </p>
                            <p
                                class="truncate text-[11px] text-muted-foreground"
                            >
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
                            <p
                                class="truncate text-sm font-medium text-slate-800"
                            >
                                {{ member.name }}
                            </p>
                            <p
                                class="truncate text-[11px] text-muted-foreground"
                            >
                                {{ member.position }}
                                <span v-if="member.no">· {{ member.no }}</span>
                            </p>
                        </div>
                    </div>

                    <p
                        v-if="project.team_count === 0"
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
        :heading="`${project.name} — ${reportRows.length} milestone${reportRows.length === 1 ? '' : 's'}`"
        subtitle="Official project document · ready to print"
        @close="showPreview = false"
    >
        <AttendanceReportDocument
            :title="`Project: ${project.name}`"
            :period="`As of ${printedOn}`"
            system="Project Management System"
            :columns="[
                { key: 'no', label: 'No.' },
                { key: 'name', label: 'Milestone' },
                { key: 'due', label: 'Due Date' },
                { key: 'status', label: 'Status' },
            ]"
            :rows="reportRows"
            :note="`${project.status} · ${project.department} · Lead: ${project.lead_name} · Budget ₱${project.budget.toLocaleString()}`"
        />
    </RecordPrintModal>
</template>
