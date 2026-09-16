<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import {
    Eye,
    FileBarChart2,
    FileSpreadsheet,
    FolderKanban,
    Info,
    Pencil,
    Plus,
    Search,
    Trash2,
    UserPlus,
    X,
} from '@lucide/vue';
import { computed, reactive, ref, watch } from 'vue';
import { toast } from 'vue-sonner';
import AttendanceReportDocument from '@/components/demo/AttendanceReportDocument.vue';
import PaginationBar from '@/components/demo/PaginationBar.vue';
import RecordPrintModal from '@/components/demo/RecordPrintModal.vue';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { cn } from '@/lib/utils';
import type { DemoProject, DemoProjectStatus } from '@/types';

const props = defineProps<{
    employees: ProjectEmployee[];
    projects: DemoProject[];
}>();

// Demo employees added from the Employee Management module (in-memory only)
// join the pickers too, so a project can be assigned to anyone.
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

const uniqueDepartments = computed(() =>
    [...new Set(allEmployees.value.map((employee) => employee.department).filter(Boolean))].sort(),
);

const selectedLead = computed(() =>
    allEmployees.value.find(
        (employee) => String(employee.id) === draft.lead_id,
    ),
);

const teamCandidates = computed(() =>
    allEmployees.value.filter(
        (employee) => String(employee.id) !== draft.lead_id,
    ),
);

const chosenTeamMembers = computed(() =>
    teamCandidates.value.filter((employee) =>
        draft.team_ids.includes(employee.id),
    ),
);

const availableTeamMembers = computed(() =>
    teamCandidates.value.filter(
        (employee) => !draft.team_ids.includes(employee.id),
    ),
);

const {
    rows,
    addProject,
    updateProject,
    setStatus,
    remove,
} = useDemoProjects(allEmployees.value, props.projects);

/* ------------------------------------------------------------------ */
/* Query-param pre-fill so dashboard stat cards can deep-link into a   */
/* filtered registry: ?status=Active, ?overdue=1…                      */
/* ------------------------------------------------------------------ */

function queryParam(name: string): string | null {
    if (typeof window === 'undefined') {
        return null;
    }

    return new URLSearchParams(window.location.search).get(name);
}

function initialStatus(): string {
    const status = queryParam('status');

    if (
        status === 'Planning' ||
        status === 'Active' ||
        status === 'On Hold' ||
        status === 'Completed' ||
        status === 'Cancelled'
    ) {
        return status;
    }

    return 'all';
}

function initialOverdue(): boolean {
    return queryParam('overdue') === '1';
}

/* ------------------------------------------------------------------ */
/* Filters                                                            */
/* ------------------------------------------------------------------ */

const statusFilter = ref(initialStatus());
const departmentFilter = ref('all');
const overdueOnly = ref(initialOverdue());
const search = ref('');

const departments = computed(() =>
    [...new Set(rows.value.map((row) => row.department))].sort(),
);

const filtered = computed(() => {
    const term = search.value.trim().toLowerCase();

    return rows.value.filter(
        (row) =>
            (statusFilter.value === 'all' ||
                row.status === statusFilter.value) &&
            (departmentFilter.value === 'all' ||
                row.department === departmentFilter.value) &&
            (!overdueOnly.value || row.overdue) &&
            (term === '' ||
                row.name.toLowerCase().includes(term) ||
                row.lead_name.toLowerCase().includes(term) ||
                row.department.toLowerCase().includes(term)),
    );
});

/* ------------------------------------------------------------------ */
/* Pagination                                                          */
/* ------------------------------------------------------------------ */

const PAGE_SIZE = 10;
const page = ref(1);

const paged = computed(() => {
    const start = (page.value - 1) * PAGE_SIZE;

    return filtered.value.slice(start, start + PAGE_SIZE);
});

watch([statusFilter, departmentFilter, overdueOnly, search], () => {
    page.value = 1;
});

/* ------------------------------------------------------------------ */
/* New / edit project modal                                            */
/* ------------------------------------------------------------------ */

const showModal = ref(false);
const editingId = ref<number | null>(null);
const isEditing = computed(() => editingId.value !== null);

const draft = reactive({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    status: 'Planning' as DemoProjectStatus,
    department: '',
    lead_id: '',
    team_ids: [] as number[],
    budget: '',
});

function openModal(): void {
    editingId.value = null;
    draft.name = '';
    draft.description = '';
    draft.start_date = '';
    draft.end_date = '';
    draft.status = 'Planning';
    draft.department = '';
    draft.lead_id = '';
    draft.team_ids = [];
    draft.budget = '';
    showModal.value = true;
}

function openEdit(row: (typeof rows.value)[number]): void {
    editingId.value = row.id;
    draft.name = row.name;
    draft.description = row.description;
    draft.start_date = row.start_date;
    draft.end_date = row.end_date;
    draft.status = row.status;
    draft.department = row.department;
    draft.lead_id = String(row.lead_id);
    draft.team_ids = [...row.team_ids];
    draft.budget = String(row.budget);
    showModal.value = true;
}

function toggleTeam(employeeId: number): void {
    const index = draft.team_ids.indexOf(employeeId);

    if (index >= 0) {
        draft.team_ids.splice(index, 1);
    } else {
        draft.team_ids.push(employeeId);
    }
}

function saveProject(): void {
    if (!draft.name.trim()) {
        toast.error('Enter a project name');

        return;
    }

    if (!draft.department.trim()) {
        toast.error('Enter the owning department');

        return;
    }

    if (!draft.start_date || !draft.end_date) {
        toast.error('Set the start and end dates');

        return;
    }

    if (!draft.lead_id) {
        toast.error('Choose a project lead');

        return;
    }

    const payload = {
        name: draft.name.trim(),
        description: draft.description.trim(),
        start_date: draft.start_date,
        end_date: draft.end_date,
        department: draft.department.trim(),
        lead_id: Number(draft.lead_id),
        team_ids: draft.team_ids,
        budget: Number(draft.budget || 0),
    };

    if (isEditing.value) {
        updateProject(editingId.value as number, {
            name: payload.name,
            description: payload.description,
            start_date: payload.start_date,
            end_date: payload.end_date,
            department: payload.department,
            budget: payload.budget,
        });
        toast.success(`Project updated — ${draft.status} (demo)`);
    } else {
        addProject({ ...payload, status: draft.status });
        toast.success(`Project "${payload.name}" added to the registry (demo)`);
    }

    showModal.value = false;
    editingId.value = null;
}

/* ------------------------------------------------------------------ */
/* Status actions                                                      */
/* ------------------------------------------------------------------ */

function changeStatus(id: number, status: DemoProjectStatus): void {
    setStatus(id, status);
    toast.success(`Project marked ${status} (demo)`);
}

function removeRow(id: number, name: string): void {
    remove(id);
    toast(`"${name}" withdrawn from the registry`);
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
    filtered.value.map((row, index) => ({
        no: index + 1,
        name: row.name,
        department: row.department,
        lead: row.lead_name,
        team: row.team_count,
        start: row.start_date,
        end: row.end_date,
        status: row.status,
        progress: `${row.progress}%`,
    })),
);

function exportExcel(): void {
    const headers = [
        'No.',
        'Project',
        'Department',
        'Lead',
        'Team Size',
        'Start',
        'End',
        'Status',
        'Progress',
    ];
    const rowsCsv = reportRows.value.map((row) => [
        row.no,
        row.name,
        row.department,
        row.lead,
        row.team,
        row.start,
        row.end,
        row.status,
        row.progress,
    ]);

    exportSheet('project-registry', 'Project Registry', headers, rowsCsv);
}
</script>

<template>
    <Head title="Project Registry — Project Management" />

    <div class="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <!-- Header -->
        <div
            class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
            <div>
                <h1 class="text-2xl font-bold tracking-tight text-slate-900">
                    Project Registry
                </h1>
                <p class="mt-1 text-sm text-slate-500">
                    Keep every company project in one place — status, dates,
                    milestones and the team assigned to each one.
                </p>
            </div>
            <div class="flex flex-wrap gap-2">
                <Button variant="outline" @click="showPreview = true">
                    <FileBarChart2 class="size-4" />
                    Generate report
                </Button>
                <Button
                    class="bg-blue-600 hover:bg-blue-700"
                    @click="exportExcel"
                >
                    <FileSpreadsheet class="size-4" />
                    Export to Excel
                </Button>
            </div>
        </div>

        <!-- How this page works -->
        <div
            class="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/60 p-4 text-sm text-blue-900"
        >
            <Info class="mt-0.5 size-4 shrink-0 text-blue-600" />
            <div class="text-xs leading-relaxed">
                <p class="font-semibold text-slate-900">How this page works</p>
                <p class="mt-1 text-slate-600">
                    Projects move
                    <span class="font-medium">Planning</span> →
                    <span class="font-medium">Active</span> →
                    <span class="font-medium">Completed</span>, with
                    <span class="font-medium">On Hold</span> for paused work and
                    <span class="font-medium">Cancelled</span> for stopped work.
                    Leads and teams are pulled straight from
                    <span class="font-medium">Employee Records</span>, and
                    milestones power each project's progress bar.
                </p>
            </div>
        </div>

        <!-- Filters -->
        <div
            class="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
        >
            <Select v-model="statusFilter">
                <SelectTrigger class="w-44">
                    <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem
                        v-for="status in PROJECT_STATUSES"
                        :key="status"
                        :value="status"
                    >
                        {{ status }}
                    </SelectItem>
                </SelectContent>
            </Select>

            <Select v-model="departmentFilter">
                <SelectTrigger class="w-52">
                    <SelectValue placeholder="All departments" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All departments</SelectItem>
                    <SelectItem
                        v-for="department in departments"
                        :key="department"
                        :value="department"
                    >
                        {{ department }}
                    </SelectItem>
                </SelectContent>
            </Select>

            <label
                class="inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-xs font-medium transition-colors select-none"
                :class="
                    cn(
                        overdueOnly
                            ? 'border-red-200 bg-red-50 text-red-700'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
                    )
                "
            >
                <Checkbox
                    v-model="overdueOnly"
                    class="size-4 border-slate-400"
                />
                Overdue only
            </label>

            <div class="relative w-64">
                <Search
                    class="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                    v-model="search"
                    placeholder="Search project, lead or department…"
                    class="pl-9"
                />
            </div>
        </div>

        <!-- Registry table -->
        <div class="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div
                class="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4"
            >
                <h2 class="font-semibold text-slate-900">Projects</h2>
                <div class="flex items-center gap-3">
                    <span
                        v-if="filtered.length > 0"
                        class="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 tabular-nums dark:bg-blue-500/15 dark:text-blue-300"
                    >
                        {{ filtered.length }} project{{
                            filtered.length === 1 ? '' : 's'
                        }}
                    </span>
                    <Button
                        class="bg-blue-600 hover:bg-blue-700"
                        size="sm"
                        @click="openModal"
                    >
                        <Plus class="size-4" />
                        New project
                    </Button>
                </div>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full min-w-[1100px] text-sm">
                    <thead>
                        <tr
                            class="border-b text-left text-xs tracking-wide text-muted-foreground uppercase"
                        >
                            <th class="px-4 py-3 font-medium">No.</th>
                            <th class="px-4 py-3 font-medium">Project</th>
                            <th class="px-4 py-3 font-medium">Lead</th>
                            <th class="px-4 py-3 font-medium">Team</th>
                            <th class="px-4 py-3 font-medium">End date</th>
                            <th class="px-4 py-3 font-medium">Status</th>
                            <th class="px-4 py-3 font-medium">Progress</th>
                            <th class="px-4 py-3 text-right font-medium">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(row, index) in paged"
                            :key="row.id"
                            class="border-b transition-colors last:border-0 hover:bg-muted/40"
                        >
                            <td
                                class="px-4 py-3 text-muted-foreground tabular-nums"
                            >
                                {{ (page - 1) * PAGE_SIZE + index + 1 }}
                            </td>
                            <td class="px-4 py-3">
                                <p class="font-medium text-slate-900">
                                    {{ row.name }}
                                </p>
                                <p class="text-xs text-muted-foreground">
                                    {{ row.department }}
                                    <span
                                        v-if="row.overdue"
                                        class="ml-1 inline-flex rounded-full border border-red-200 bg-red-50 px-1.5 py-0.5 text-[10px] font-medium text-red-700"
                                    >
                                        Overdue
                                    </span>
                                </p>
                            </td>
                            <td class="px-4 py-3 text-slate-700">
                                {{ row.lead_name }}
                            </td>
                            <td class="px-4 py-3">
                                <span
                                    v-if="row.team_count > 0"
                                    class="text-muted-foreground tabular-nums"
                                >
                                    {{ row.team_count }} member{{
                                        row.team_count === 1 ? '' : 's'
                                    }}
                                </span>
                                <span
                                    v-else
                                    class="text-xs text-muted-foreground"
                                >
                                    —
                                </span>
                            </td>
                            <td
                                class="px-4 py-3 text-muted-foreground tabular-nums"
                            >
                                {{ row.end_date }}
                            </td>
                            <td class="px-4 py-3">
                                <Select
                                    :model-value="row.status"
                                    @update:model-value="
                                        (value) =>
                                            changeStatus(
                                                row.id,
                                                value as DemoProjectStatus,
                                            )
                                    "
                                >
                                    <SelectTrigger
                                        class="w-32 h-8 rounded-md border text-xs shadow-none"
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
                            </td>
                            <td class="px-4 py-3">
                                <div class="flex items-center gap-2">
                                    <div
                                        class="h-1.5 w-16 rounded-full bg-slate-200"
                                    >
                                        <div
                                            class="h-1.5 rounded-full bg-blue-600"
                                            :style="{
                                                width: `${row.progress}%`,
                                            }"
                                        ></div>
                                    </div>
                                    <span
                                        class="text-xs text-muted-foreground tabular-nums"
                                    >
                                        {{ row.progress }}%
                                    </span>
                                </div>
                            </td>
                            <td class="px-4 py-3 text-right">
                                <div class="flex items-center justify-end gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        class="size-8 shrink-0 text-slate-500 hover:bg-slate-100 hover:text-blue-600"
                                        title="Update"
                                        @click="openEdit(row)"
                                    >
                                        <Pencil class="size-4" />
                                    </Button>
                                    <Link
                                        :href="
                                            row.id >= 1001
                                                ? `/demo/projects/registry/session/${row.id}`
                                                : `/demo/projects/registry/${row.id}`
                                        "
                                        class="flex size-8 shrink-0 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-blue-600"
                                        title="View"
                                    >
                                        <Eye class="size-4" />
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        class="size-8 shrink-0 text-slate-500 hover:bg-red-50 hover:text-red-600"
                                        title="Delete"
                                        @click="removeRow(row.id, row.name)"
                                    >
                                        <Trash2 class="size-4" />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="filtered.length === 0">
                            <td
                                colspan="8"
                                class="px-4 py-10 text-center text-sm text-muted-foreground"
                            >
                                No projects match the selected filters.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <PaginationBar
                :total="filtered.length"
                :page-size="PAGE_SIZE"
                v-model:page="page"
            />
        </div>
    </div>

    <!-- Generate report preview -->
    <RecordPrintModal
        v-if="showPreview"
        :heading="`Project Registry — ${reportRows.length} project${reportRows.length === 1 ? '' : 's'}`"
        subtitle="Official project registry document · ready to print"
        @close="showPreview = false"
    >
        <AttendanceReportDocument
            title="Project Registry"
            :period="`As of ${printedOn}`"
            system="Project Management System"
            :columns="[
                { key: 'no', label: 'No.' },
                { key: 'name', label: 'Project' },
                { key: 'department', label: 'Department' },
                { key: 'lead', label: 'Lead' },
                { key: 'team', label: 'Team Size', numeric: true },
                { key: 'start', label: 'Start' },
                { key: 'end', label: 'End' },
                { key: 'status', label: 'Status' },
                { key: 'progress', label: 'Progress' },
            ]"
            :rows="reportRows"
            note="Projects move Planning → Active → Completed, with On Hold for paused work and Cancelled for stopped work. Teams are drawn from Employee Records."
        />
    </RecordPrintModal>

    <!-- New / edit project modal -->
    <Teleport to="body">
        <div
            v-if="showModal"
            class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm sm:p-8"
            @click.self="showModal = false"
        >
            <div
                class="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl"
            >
                <div
                    class="flex items-center justify-between border-b px-6 py-4"
                >
                    <div>
                        <h3 class="text-base font-bold text-slate-900">
                            {{
                                isEditing
                                    ? 'Edit project'
                                    : 'New project'
                            }}
                        </h3>
                        <p class="text-xs text-muted-foreground">
                            {{
                                isEditing
                                    ? 'Update the project details and milestones stay intact.'
                                    : 'Starts in the chosen status — milestones can be added later.'
                            }}
                        </p>
                    </div>
                    <button
                        type="button"
                        class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        aria-label="Close"
                        @click="showModal = false"
                    >
                        <X class="size-5" />
                    </button>
                </div>

                <div class="overflow-y-auto px-6 py-5">
                    <div class="grid gap-4 sm:grid-cols-2 sm:gap-5">
                        <div class="flex flex-col gap-1.5 sm:col-span-2">
                            <Label>Project name</Label>
                            <Input
                                v-model="draft.name"
                                placeholder="e.g. ERP Implementation — Phase 1"
                            />
                        </div>

                        <div class="flex flex-col gap-1.5 sm:col-span-2">
                            <Label>Description</Label>
                            <textarea
                                v-model="draft.description"
                                rows="3"
                                placeholder="What is this project about…"
                                class="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            ></textarea>
                        </div>

                        <div class="flex flex-col gap-1.5">
                            <Label>Start date</Label>
                            <Input v-model="draft.start_date" type="date" />
                        </div>

                        <div class="flex flex-col gap-1.5">
                            <Label>End date</Label>
                            <Input v-model="draft.end_date" type="date" />
                        </div>

                        <div class="flex flex-col gap-1.5">
                            <Label>Status</Label>
                            <Select v-model="draft.status">
                                <SelectTrigger class="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent
                                    :side="'bottom'"
                                    :side-flip="false"
                                >
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

                        <div class="flex flex-col gap-1.5">
                            <Label>Department</Label>
                            <Select v-model="draft.department">
                                <SelectTrigger class="w-full">
                                    <SelectValue
                                        placeholder="Choose department"
                                    />
                                </SelectTrigger>
                                <SelectContent
                                    :side="'bottom'"
                                    :side-flip="false"
                                >
                                    <SelectItem
                                        v-for="department in uniqueDepartments"
                                        :key="department"
                                        :value="department"
                                    >
                                        {{ department }}
                                    </SelectItem>
                                    <p
                                        v-if="uniqueDepartments.length === 0"
                                        class="px-2 py-1.5 text-xs text-muted-foreground"
                                    >
                                        No departments available.
                                    </p>
                                </SelectContent>
                            </Select>
                        </div>

                        <div class="flex flex-col gap-1.5">
                            <Label>Budget (₱)</Label>
                            <Input
                                v-model="draft.budget"
                                type="number"
                                min="0"
                                placeholder="e.g. 500000"
                            />
                        </div>

                        <div class="flex flex-col gap-1.5">
                            <Label>Project lead</Label>
                            <Select v-model="draft.lead_id">
                                <SelectTrigger class="w-full">
                                    <SelectValue placeholder="Choose lead" />
                                </SelectTrigger>
                                <SelectContent
                                    :side="'bottom'"
                                    :side-flip="false"
                                >
                                    <SelectItem
                                        v-for="employee in allEmployees"
                                        :key="employee.id"
                                        :value="String(employee.id)"
                                    >
                                        {{ employee.name }} ·
                                        {{ employee.position }}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div
                            v-if="selectedLead"
                            class="flex flex-col gap-2 sm:col-span-2"
                        >
                            <div class="flex flex-wrap items-center justify-between gap-2">
                                <Label>Team members</Label>
                                <span
                                    class="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 tabular-nums dark:bg-slate-800 dark:text-slate-300"
                                >
                                    {{ draft.team_ids.length }} of
                                    {{ teamCandidates.length }} assigned
                                </span>
                            </div>

                            <div
                                class="rounded-lg border border-slate-200 bg-slate-50/60 p-3"
                            >
                                <div
                                    v-if="chosenTeamMembers.length"
                                    class="grid gap-2 sm:grid-cols-2"
                                >
                                    <div
                                        v-for="member in chosenTeamMembers"
                                        :key="member.id"
                                        class="group flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-xs"
                                    >
                                        <span
                                            class="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white"
                                        >
                                            {{ member.name.charAt(0) }}
                                        </span>
                                        <div class="min-w-0 flex-1">
                                            <p
                                                class="truncate text-xs font-medium text-slate-800"
                                            >
                                                {{ member.name }}
                                            </p>
                                            <p
                                                class="truncate text-[10px] text-muted-foreground"
                                            >
                                                {{ member.position }} ·
                                                {{ member.department }}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            class="shrink-0 rounded-md p-1 text-muted-foreground/60 transition-colors hover:bg-red-50 hover:text-red-600"
                                            :aria-label="`Remove ${member.name}`"
                                            title="Remove"
                                            @click="toggleTeam(member.id)"
                                        >
                                            <Trash2 class="size-3.5" />
                                        </button>
                                    </div>
                                </div>

                                <p
                                    v-else
                                    class="py-3 text-center text-xs text-muted-foreground"
                                >
                                    No team members assigned yet — add members
                                    below.
                                </p>

                                <DropdownMenu>
                                    <DropdownMenuTrigger as-child>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            class="mt-3 gap-1.5 text-xs"
                                            :disabled="
                                                availableTeamMembers.length === 0
                                            "
                                        >
                                            <UserPlus class="size-3.5" />
                                            {{
                                                availableTeamMembers.length === 0
                                                    ? 'All members added'
                                                    : 'Add members'
                                            }}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent class="w-80">
                                        <DropdownMenuLabel>
                                            Available team members
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <div class="max-h-56 overflow-y-auto">
                                            <DropdownMenuItem
                                                v-for="employee in availableTeamMembers"
                                                :key="employee.id"
                                                @select.prevent="
                                                    toggleTeam(employee.id)
                                                "
                                                class="gap-2"
                                            >
                                                <Checkbox
                                                    :checked="false"
                                                    class="pointer-events-none"
                                                />
                                                <span class="min-w-0 flex-1">
                                                    <span
                                                        class="block truncate text-xs font-medium text-slate-800"
                                                    >
                                                        {{ employee.name }}
                                                    </span>
                                                    <span
                                                        class="block truncate text-[10px] text-muted-foreground"
                                                    >
                                                        {{ employee.position }} ·
                                                        {{ employee.department }}
                                                    </span>
                                                </span>
                                            </DropdownMenuItem>
                                            <p
                                                v-if="
                                                    availableTeamMembers.length ===
                                                    0
                                                "
                                                class="px-3 py-2 text-xs text-muted-foreground"
                                            >
                                                All available employees are
                                                already on the team.
                                            </p>
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                        <div
                            v-else
                            class="flex flex-col gap-1.5 sm:col-span-2"
                        >
                            <Label>Team members</Label>
                            <p
                                class="rounded-md border border-dashed border-slate-200 px-3 py-2 text-xs text-muted-foreground"
                            >
                                Choose a project lead first to assign team
                                members.
                            </p>
                        </div>
                    </div>
                </div>

                <div class="flex justify-end gap-2 border-t px-6 py-4">
                    <Button variant="ghost" @click="showModal = false">
                        Cancel
                    </Button>
                    <Button
                        class="bg-blue-600 hover:bg-blue-700"
                        @click="saveProject"
                    >
                        <FolderKanban class="size-4" />
                        {{ isEditing ? 'Save changes' : 'Add project' }}
                    </Button>
                </div>
            </div>
        </div>
    </Teleport>
</template>