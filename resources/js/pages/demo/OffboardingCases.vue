<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import {
    Archive,
    ArrowRight,
    ChevronRight,
    FileBarChart2,
    FileSpreadsheet,
    Info,
    LogOut,
    Pencil,
    Plus,
    Search,
    ShieldAlert,
    X,
} from '@lucide/vue';
import { computed, reactive, ref, watch } from 'vue';
import { toast } from 'vue-sonner';
import AttendanceReportDocument from '@/components/demo/AttendanceReportDocument.vue';
import PaginationBar from '@/components/demo/PaginationBar.vue';
import RecordPrintModal from '@/components/demo/RecordPrintModal.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useDemoDisciplinary } from '@/composables/useDemoDisciplinary';
import { useDemoEmployees } from '@/composables/useDemoEmployees';
import {
    OFFBOARDING_TYPES,
    useDemoOffboarding,
} from '@/composables/useDemoOffboarding';
import type { OffboardingEmployee } from '@/composables/useDemoOffboarding';
import { cn } from '@/lib/utils';
import type {
    DemoDisciplinaryRecord,
    DemoOffboardingCase,
    DemoOffboardingRow,
} from '@/types';

const props = defineProps<{
    employees: OffboardingEmployee[];
    cases: DemoOffboardingCase[];
    disciplinary: DemoDisciplinaryRecord[];
}>();

// Demo employees added from the Employee Management module (in-memory only)
// join the directory here too, so a separation can be started for anyone.
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

// The live handoff from Disciplinary (Module 9): seeded escalated cases plus
// any case escalated during this session — so dismissing an employee here
// flags them in Offboarding instantly.
const { escalatedEmployeeIds } = useDemoDisciplinary(
    allEmployees.value,
    props.disciplinary,
);

const flaggedIds = computed(() => new Set(escalatedEmployeeIds.value));

const { rows, eligibleEmployees, addCase, updateCase, advance, remove } =
    useDemoOffboarding(
        allEmployees.value,
        props.cases,
        escalatedEmployeeIds.value.map((employee_id) => ({ employee_id })),
    );

/* ------------------------------------------------------------------ */
/* Query-param pre-fill so dashboard stat cards can deep-link into a   */
/* filtered register: ?tab=archived, ?status=open, ?type=Termination…  */
/* ------------------------------------------------------------------ */

function queryParam(name: string): string | null {
    if (typeof window === 'undefined') {
        return null;
    }

    return new URLSearchParams(window.location.search).get(name);
}

const typeOptions = OFFBOARDING_TYPES as readonly string[];

function initialTab(): 'active' | 'archived' {
    return queryParam('tab') === 'archived' ? 'archived' : 'active';
}

function initialStatus(): string {
    const status = queryParam('status');

    if (
        status === 'open' ||
        status === 'Requested' ||
        status === 'In Clearance' ||
        status === 'Final Pay' ||
        status === 'Completed'
    ) {
        return status;
    }

    return 'all';
}

function initialType(): string {
    const type = queryParam('type');

    return typeOptions.includes(type ?? '') ? (type as string) : 'all';
}

/* ------------------------------------------------------------------ */
/* Tabs — same sticky, full-width style as the other modules' pages   */
/* ------------------------------------------------------------------ */

const tabs = [
    { key: 'active', label: 'Active Cases', icon: LogOut },
    { key: 'archived', label: 'Archived', icon: Archive },
] as const;

type TabKey = (typeof tabs)[number]['key'];

const activeTab = ref<TabKey>(initialTab());

/* ------------------------------------------------------------------ */
/* Filters                                                            */
/* ------------------------------------------------------------------ */

const statusFilter = ref(initialStatus());
const typeFilter = ref(initialType());
const search = ref('');

const statusOptions = [
    'open',
    'Requested',
    'In Clearance',
    'Final Pay',
    'Completed',
];

const filtered = computed(() => {
    const term = search.value.trim().toLowerCase();

    return rows.value.filter(
        (row) =>
            (activeTab.value === 'active'
                ? row.status !== 'Completed'
                : row.status === 'Completed') &&
            (statusFilter.value === 'all' ||
                (statusFilter.value === 'open'
                    ? row.status !== 'Completed'
                    : row.status === statusFilter.value)) &&
            (typeFilter.value === 'all' || row.type === typeFilter.value) &&
            (term === '' ||
                row.name.toLowerCase().includes(term) ||
                row.no.toLowerCase().includes(term) ||
                row.department.toLowerCase().includes(term) ||
                row.position.toLowerCase().includes(term)),
    );
});

const statusTone: Record<string, string> = {
    Requested: 'bg-blue-50 text-blue-700 border-blue-200',
    'In Clearance': 'bg-amber-50 text-amber-700 border-amber-200',
    'Final Pay': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const typeTone: Record<string, string> = {
    Resignation: 'border-blue-200 bg-blue-50 text-blue-700',
    Termination: 'border-red-200 bg-red-50 text-red-700',
    'End of Contract': 'border-amber-200 bg-amber-50 text-amber-700',
    Retirement: 'border-slate-200 bg-slate-50 text-slate-600',
};

/* ------------------------------------------------------------------ */
/* Pagination                                                          */
/* ------------------------------------------------------------------ */

const PAGE_SIZE = 10;
const page = ref(1);

const paged = computed(() => {
    const start = (page.value - 1) * PAGE_SIZE;

    return filtered.value.slice(start, start + PAGE_SIZE);
});

watch([activeTab, statusFilter, typeFilter, search], () => {
    page.value = 1;
});

/* ------------------------------------------------------------------ */
/* New separation modal                                                */
/* ------------------------------------------------------------------ */

const showModal = ref(false);
/** The case being edited, or null when opening a new separation. */
const editingId = ref<number | null>(null);
const isEditing = computed(() => editingId.value !== null);

function todayIso(): string {
    return new Date().toISOString().slice(0, 10);
}

const draft = reactive({
    employee_id: '',
    type: 'Resignation' as DemoOffboardingRow['type'],
    requested_by: 'Employee' as 'Employee' | 'HR / Management',
    requested_on: '',
    exit_date: '',
    reason: '',
});

/** Who files a separation depends on the type — employee resigns, HR acts. */
function requesterForType(
    type: DemoOffboardingRow['type'],
): 'Employee' | 'HR / Management' {
    return type === 'Resignation' || type === 'Retirement'
        ? 'Employee'
        : 'HR / Management';
}

// Pre-fill the requester when the separation type changes (new cases only).
watch(
    () => draft.type,
    (type) => {
        if (!isEditing.value) {
            draft.requested_by = requesterForType(type);
        }
    },
);

const draftEmployee = computed(() =>
    allEmployees.value.find((row) => row.id === Number(draft.employee_id)),
);

const draftFlagged = computed(() =>
    draftEmployee.value ? flaggedIds.value.has(draftEmployee.value.id) : false,
);

function openModal(): void {
    editingId.value = null;
    draft.employee_id = '';
    draft.type = 'Resignation';
    draft.requested_by = requesterForType(draft.type);
    draft.requested_on = todayIso();
    draft.exit_date = '';
    draft.reason = '';
    showModal.value = true;
}

function openEdit(row: (typeof rows.value)[number]): void {
    editingId.value = row.id;
    draft.employee_id = String(row.employee_id);
    draft.type = row.type;
    draft.requested_by = row.requested_by;
    draft.requested_on = row.requested_on;
    draft.exit_date = row.exit_date;
    draft.reason = row.reason;
    showModal.value = true;
}

function saveCase(): void {
    if (!draft.employee_id) {
        toast.error('Choose the employee');

        return;
    }

    if (!draft.exit_date) {
        toast.error('Set the last working day');

        return;
    }

    if (isEditing.value) {
        updateCase(editingId.value as number, {
            type: draft.type,
            exit_date: draft.exit_date,
            reason: draft.reason,
        });
        toast.success(
            `Separation updated — ${draftEmployee.value?.name ?? 'case'} (demo)`,
        );
    } else {
        addCase({
            employee_id: Number(draft.employee_id),
            type: draft.type,
            requested_by: draft.requested_by,
            requested_on: draft.requested_on || todayIso(),
            exit_date: draft.exit_date,
            reason: draft.reason,
        });
        toast.success(
            `${draftEmployee.value?.name ?? 'Employee'} — separation started as ${draft.type} (demo)`,
        );
    }

    showModal.value = false;
    editingId.value = null;
}

function watchEmployeeType(): void {
    // Flagged employees usually leave by termination — pre-fill it.
    if (draftFlagged.value) {
        draft.type = 'Termination';
    }
}

/* ------------------------------------------------------------------ */
/* Status — advanced from inside the Update modal, not the table      */
/* ------------------------------------------------------------------ */

const offboardingPipeline = [
    'Requested',
    'In Clearance',
    'Final Pay',
    'Completed',
] as const;

const editingRow = computed(() =>
    editingId.value === null
        ? undefined
        : rows.value.find((row) => row.id === editingId.value),
);

function nextStatusLabel(row: (typeof rows.value)[number]): string {
    return (
        offboardingPipeline[offboardingPipeline.indexOf(row.status) + 1] ??
        row.status
    );
}

function advanceFromModal(): void {
    if (!editingRow.value) {
        return;
    }

    advance(editingRow.value.id);
    toast.success(
        `${editingRow.value.name} — moved to ${nextStatusLabel(editingRow.value)} (demo)`,
    );
}

function removeRow(id: number): void {
    remove(id);
    toast('Case withdrawn from the register');
}

function caseHref(row: (typeof rows.value)[number]): string {
    return row.employee_id >= 1001
        ? `/demo/offboarding/cases/session/${row.employee_id}`
        : `/demo/offboarding/cases/${row.employee_id}`;
}

function formatMoney(value: number, decimals = 0): string {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value);
}

function finalPayLabel(row: (typeof rows.value)[number]): string {
    if (row.status === 'Final Pay' || row.status === 'Completed') {
        return formatMoney(row.finalPay.net);
    }

    return 'Pending';
}

/* ------------------------------------------------------------------ */
/* Generate / export                                                   */
/* ------------------------------------------------------------------ */

const showPreview = ref(false);

const reportRows = computed(() =>
    filtered.value.map((row, index) => ({
        no: index + 1,
        name: row.name,
        department: row.department,
        type: row.type,
        requester: row.requested_by,
        requested: row.requested_on,
        exit: row.exit_date,
        progress: `${row.progress}%`,
        status: row.status,
        finalPay: finalPayLabel(row),
    })),
);

const printedOn = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
});

function exportExcel(): void {
    const headers = [
        'No.',
        'Employee',
        'Department',
        'Type',
        'Requested by',
        'Requested',
        'Exit date',
        'Clearance',
        'Status',
        'Final pay',
    ];
    const rowsCsv = reportRows.value.map((row) => [
        row.no,
        row.name,
        row.department,
        row.type,
        row.requester,
        row.requested,
        row.exit,
        row.progress,
        row.status,
        row.finalPay,
    ]);
    const csv =
        '\uFEFF' +
        [headers, ...rowsCsv]
            .map((row) =>
                row
                    .map((cell) => `"${String(cell).replaceAll('"', '""')}"`)
                    .join(','),
            )
            .join('\n');
    const url = URL.createObjectURL(
        new Blob([csv], { type: 'text/csv;charset=utf-8;' }),
    );
    const link = document.createElement('a');

    link.href = url;
    link.download = `offboarding-${activeTab.value}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
}
</script>

<template>
    <Head title="Offboarding Register — Separation & Offboarding" />

    <div class="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <!-- Header -->
        <div
            class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
            <div>
                <h1 class="text-2xl font-bold tracking-tight text-slate-900">
                    Offboarding Register
                </h1>
                <p class="mt-1 text-sm text-slate-500">
                    Start a separation, work through the clearance checklist,
                    compute final pay — and archive the employee record when
                    it's done.
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

        <!-- How offboarding works -->
        <div
            class="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/60 p-4 text-sm text-blue-900"
        >
            <Info class="mt-0.5 size-4 shrink-0 text-blue-600" />
            <div class="text-xs leading-relaxed">
                <p class="font-semibold text-slate-900">How this page works</p>
                <p class="mt-1 text-slate-600">
                    The
                    <span class="font-medium">employee</span> files a
                    resignation or retirement; HR / Management initiates
                    terminations and contract ends. HR works every case through
                    <span class="font-medium">Requested</span> →
                    <span class="font-medium">In Clearance</span> →
                    <span class="font-medium">Final Pay</span> →
                    <span class="font-medium">Completed</span> (archived) from
                    the Update action — terminations arrive from escalated
                    <span class="font-medium">Disciplinary</span> cases, and
                    final pay is computed from salary and unused leave.
                </p>
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
                    cn(
                        activeTab === tab.key
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    )
                "
                @click="activeTab = tab.key"
            >
                <component :is="tab.icon" class="size-4" />
                {{ tab.label }}
            </button>
        </div>

        <div class="flex flex-col gap-6">
            <!-- Filters -->
            <div
                class="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
                <Select v-model="statusFilter">
                    <SelectTrigger class="w-48">
                        <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        <SelectItem value="open">Active cases</SelectItem>
                        <SelectItem
                            v-for="status in statusOptions"
                            :key="status"
                            :value="status"
                        >
                            {{ status }}
                        </SelectItem>
                    </SelectContent>
                </Select>

                <Select v-model="typeFilter">
                    <SelectTrigger class="w-48">
                        <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All types</SelectItem>
                        <SelectItem
                            v-for="type in OFFBOARDING_TYPES"
                            :key="type"
                            :value="type"
                        >
                            {{ type }}
                        </SelectItem>
                    </SelectContent>
                </Select>

                <div class="relative w-64">
                    <Search
                        class="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                        v-model="search"
                        placeholder="Search employee, ID or department…"
                        class="pl-9"
                    />
                </div>
            </div>

            <!-- Register table -->
            <div class="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div
                    class="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4"
                >
                    <h2 class="font-semibold text-slate-900">
                        {{
                            activeTab === 'active'
                                ? 'Active cases'
                                : 'Archived cases'
                        }}
                    </h2>
                    <div class="flex items-center gap-3">
                        <span
                            class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                        >
                            {{ filtered.length }} case{{
                                filtered.length === 1 ? '' : 's'
                            }}
                        </span>
                        <Button
                            class="bg-blue-600 hover:bg-blue-700"
                            size="sm"
                            @click="openModal"
                        >
                            <Plus class="size-4" />
                            New separation
                        </Button>
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full min-w-[1150px] text-sm">
                        <thead>
                            <tr
                                class="border-b text-left text-xs tracking-wide text-muted-foreground uppercase"
                            >
                                <th class="px-4 py-3 font-medium">No.</th>
                                <th class="px-4 py-3 font-medium">Employee</th>
                                <th class="px-4 py-3 font-medium">Type</th>
                                <th class="px-4 py-3 font-medium">Requested</th>
                                <th class="px-4 py-3 font-medium">Exit date</th>
                                <th class="px-4 py-3 font-medium">Clearance</th>
                                <th class="px-4 py-3 font-medium">Status</th>
                                <th class="px-4 py-3 font-medium">Final pay</th>
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
                                    <div class="flex items-center gap-2">
                                        <p class="font-medium text-slate-900">
                                            {{ row.name }}
                                        </p>
                                        <span
                                            v-if="row.flagged"
                                            class="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-1.5 py-0.5 text-[10px] font-medium text-red-700"
                                            title="Escalated disciplinary case on file"
                                        >
                                            <ShieldAlert class="size-3" />
                                            Disciplinary
                                        </span>
                                    </div>
                                    <p class="text-xs text-muted-foreground">
                                        {{ row.position }} ·
                                        {{ row.department }}
                                    </p>
                                </td>
                                <td class="px-4 py-3">
                                    <span
                                        class="inline-flex rounded-full border px-2 py-0.5 text-[11px] font-medium whitespace-nowrap"
                                        :class="typeTone[row.type]"
                                    >
                                        {{ row.type }}
                                    </span>
                                </td>
                                <td
                                    class="px-4 py-3 text-muted-foreground tabular-nums"
                                >
                                    {{ row.requested_on }}
                                    <p class="not-tabular text-[10px]">
                                        by {{ row.requested_by }}
                                    </p>
                                </td>
                                <td
                                    class="px-4 py-3 text-muted-foreground tabular-nums"
                                >
                                    {{ row.exit_date }}
                                </td>
                                <td class="px-4 py-3">
                                    <div class="w-28">
                                        <div
                                            class="h-1.5 w-full overflow-hidden rounded-full bg-slate-200"
                                        >
                                            <div
                                                class="h-full rounded-full bg-blue-600"
                                                :style="{
                                                    width: `${row.progress}%`,
                                                }"
                                            ></div>
                                        </div>
                                        <p
                                            class="mt-1 text-[10px] text-muted-foreground tabular-nums"
                                        >
                                            {{ row.progress }}%
                                        </p>
                                    </div>
                                </td>
                                <td class="px-4 py-3">
                                    <span
                                        class="inline-flex rounded-full border px-2 py-0.5 text-xs font-medium"
                                        :class="statusTone[row.status]"
                                    >
                                        {{ row.status }}
                                    </span>
                                </td>
                                <td
                                    class="px-4 py-3 font-medium text-slate-700 tabular-nums"
                                >
                                    {{ finalPayLabel(row) }}
                                </td>
                                <td class="px-4 py-3 text-right">
                                    <div class="flex justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            class="text-slate-600 shadow-none hover:bg-slate-50 hover:text-slate-900"
                                            @click="openEdit(row)"
                                        >
                                            <Pencil class="size-3.5" />
                                            Update
                                        </Button>
                                        <Link
                                            :href="caseHref(row)"
                                            class="inline-flex items-center rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                                        >
                                            View
                                        </Link>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            class="text-slate-600 shadow-none hover:bg-slate-50 hover:text-slate-900"
                                            @click="removeRow(row.id)"
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="filtered.length === 0">
                                <td
                                    colspan="9"
                                    class="px-4 py-10 text-center text-sm text-muted-foreground"
                                >
                                    No separation cases match the selected
                                    filters.
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
    </div>

    <!-- Generate report preview -->
    <RecordPrintModal
        v-if="showPreview"
        :heading="`Separation Register — ${reportRows.length} case${reportRows.length === 1 ? '' : 's'}`"
        subtitle="Official separation & offboarding document · ready to print"
        @close="showPreview = false"
    >
        <AttendanceReportDocument
            title="Separation & Offboarding Register"
            :period="`As of ${printedOn}`"
            system="Separation & Offboarding System"
            :columns="[
                { key: 'no', label: 'No.' },
                { key: 'name', label: 'Employee' },
                { key: 'department', label: 'Department' },
                { key: 'type', label: 'Type' },
                { key: 'requester', label: 'Requested By' },
                { key: 'requested', label: 'Requested' },
                { key: 'exit', label: 'Exit Date' },
                { key: 'progress', label: 'Clearance' },
                { key: 'status', label: 'Status' },
                { key: 'finalPay', label: 'Final Pay' },
            ]"
            :rows="reportRows"
            note="Cases move Requested → In Clearance → Final Pay → Completed; final pay is settled with Payroll and completed records are archived safely."
        />
    </RecordPrintModal>

    <!-- New separation / update modal -->
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
                                    ? 'Update separation case'
                                    : 'New separation'
                            }}
                        </h3>
                        <p class="text-xs text-muted-foreground">
                            {{
                                isEditing
                                    ? 'Update case details, or advance it through clearance, final pay and archiving.'
                                    : 'Starts as Requested — HR works it through clearance, final pay and archiving.'
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

                <div
                    v-if="isEditing && editingRow"
                    class="border-b border-slate-100 bg-slate-50/70 px-6 py-4"
                >
                    <div class="flex items-center justify-between gap-3">
                        <div>
                            <p
                                class="text-[11px] font-semibold tracking-wide text-slate-500 uppercase"
                            >
                                Stage
                            </p>
                            <p
                                class="mt-0.5 text-sm font-medium text-slate-900"
                            >
                                {{ editingRow.status }}
                            </p>
                        </div>
                        <Button
                            v-if="editingRow.status !== 'Completed'"
                            class="bg-blue-600 hover:bg-blue-700"
                            size="sm"
                            @click="advanceFromModal"
                        >
                            <ArrowRight class="size-4" />
                            Advance to {{ nextStatusLabel(editingRow) }}
                        </Button>
                    </div>
                    <div class="mt-3 flex flex-wrap items-center gap-1.5">
                        <template
                            v-for="(stage, index) in offboardingPipeline"
                            :key="stage"
                        >
                            <span
                                class="rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                                :class="
                                    index ===
                                    offboardingPipeline.indexOf(
                                        editingRow.status,
                                    )
                                        ? 'bg-blue-600 text-white'
                                        : index <
                                            offboardingPipeline.indexOf(
                                                editingRow.status,
                                            )
                                          ? 'bg-emerald-100 text-emerald-700'
                                          : 'bg-slate-200 text-slate-500'
                                "
                            >
                                {{ stage }}
                            </span>
                            <ChevronRight
                                v-if="index < offboardingPipeline.length - 1"
                                class="size-3.5 text-slate-300"
                            />
                        </template>
                    </div>
                    <p class="mt-2 text-[11px] text-slate-500">
                        Who requests: {{ editingRow.requested_by }} filed this
                        {{ editingRow.type.toLowerCase() }}. HR advances the
                        stage as clearance and final pay are settled.
                    </p>
                </div>

                <div class="overflow-y-auto px-6 py-5">
                    <div class="grid gap-4 sm:grid-cols-2 sm:gap-5">
                        <div class="flex flex-col gap-1.5 sm:col-span-2">
                            <Label>Employee</Label>
                            <Select
                                v-model="draft.employee_id"
                                :disabled="isEditing"
                                @update:model-value="watchEmployeeType"
                            >
                                <SelectTrigger class="w-full">
                                    <SelectValue
                                        placeholder="Choose employee"
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem
                                        v-for="employee in eligibleEmployees"
                                        :key="employee.id"
                                        :value="String(employee.id)"
                                    >
                                        {{ employee.name }} · {{ employee.no }}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <p
                                v-if="draftFlagged"
                                class="flex items-center gap-1.5 text-xs text-red-600"
                            >
                                <ShieldAlert class="size-3.5" />
                                Escalated disciplinary case on file — usually
                                ends employment.
                            </p>
                        </div>

                        <div class="flex flex-col gap-1.5">
                            <Label>Type</Label>
                            <Select v-model="draft.type">
                                <SelectTrigger class="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem
                                        v-for="type in OFFBOARDING_TYPES"
                                        :key="type"
                                        :value="type"
                                    >
                                        {{ type }}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <p
                                v-if="!isEditing"
                                class="text-[11px] text-muted-foreground"
                            >
                                Resignations & retirements are filed by the
                                employee; terminations & contract ends by HR.
                            </p>
                        </div>

                        <div class="flex flex-col gap-1.5">
                            <Label>Requested by</Label>
                            <Select
                                v-model="draft.requested_by"
                                :disabled="isEditing"
                            >
                                <SelectTrigger class="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Employee">
                                        Employee
                                    </SelectItem>
                                    <SelectItem value="HR / Management">
                                        HR / Management
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div class="flex flex-col gap-1.5">
                            <Label>Last working day</Label>
                            <Input v-model="draft.exit_date" type="date" />
                        </div>

                        <div class="flex flex-col gap-1.5 sm:col-span-2">
                            <Label>Reason</Label>
                            <textarea
                                v-model="draft.reason"
                                rows="3"
                                placeholder="Why is the employee leaving…"
                                class="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            ></textarea>
                        </div>
                    </div>
                </div>

                <div class="flex justify-end gap-2 border-t px-6 py-4">
                    <Button variant="ghost" @click="showModal = false">
                        Cancel
                    </Button>
                    <Button
                        class="bg-blue-600 hover:bg-blue-700"
                        @click="saveCase"
                    >
                        <Plus class="size-4" />
                        {{ isEditing ? 'Save changes' : 'Start separation' }}
                    </Button>
                </div>
            </div>
        </div>
    </Teleport>
</template>
