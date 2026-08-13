<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import {
    AlertTriangle,
    Check,
    FileBarChart2,
    FileSpreadsheet,
    FileX,
    Info,
    Pencil,
    Plus,
    Search,
    Send,
    ShieldAlert,
    UserX,
    Users,
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
import {
    DISCIPLINARY_ACTIONS,
    DISCIPLINARY_CATEGORIES,
    DISCIPLINARY_SEVERITIES,
    useDemoDisciplinary,
} from '@/composables/useDemoDisciplinary';
import type { DisciplinaryEmployee } from '@/composables/useDemoDisciplinary';
import { useDemoEmployees } from '@/composables/useDemoEmployees';
import { cn } from '@/lib/utils';
import type { DemoDisciplinaryRecord } from '@/types';

const props = defineProps<{
    employees: DisciplinaryEmployee[];
    records: DemoDisciplinaryRecord[];
}>();

// Demo employees added from the Employee Management module (in-memory only)
// join the directory here too, so a case can be logged for anyone.
const { addedEmployees } = useDemoEmployees();

const allEmployees = computed<DisciplinaryEmployee[]>(() => [
    ...props.employees,
    ...addedEmployees.value.map((employee) => ({
        id: employee.id,
        no: employee.no,
        name: employee.name,
        department: employee.department,
        position: employee.position,
    })),
]);

const {
    rows,
    handedOffIds,
    repeatOffenders,
    addRecord,
    updateRecord,
    remove,
    handoff,
} = useDemoDisciplinary(allEmployees.value, props.records);

/** True once the employee's dismissal has been sent to Offboarding. */
function isHandedOff(employeeId: number): boolean {
    return handedOffIds.value.includes(employeeId);
}

/** Send the dismissal to Separation & Offboarding — no redirect, the
 *  termination case lands in the register for the offboarding staff. */
function sendHandoff(employeeId: number, name: string): void {
    handoff(employeeId);
    toast.success(
        `${name} handed off to Separation & Offboarding — the termination case is in the register for the offboarding staff to process`,
    );
}

/* ------------------------------------------------------------------ */
/* Query-param pre-fill so dashboard stat cards can deep-link into a   */
/* filtered directory: ?tab=repeat, ?status=open, ?type=warning…      */
/* ------------------------------------------------------------------ */

function queryParam(name: string): string | null {
    if (typeof window === 'undefined') {
        return null;
    }

    return new URLSearchParams(window.location.search).get(name);
}

const typeOptions = ['Incident', 'Warning'] as const;
type TypeOption = (typeof typeOptions)[number];

function initialTab(): 'log' | 'repeat' {
    return queryParam('tab') === 'repeat' ? 'repeat' : 'log';
}

function initialStatus(): string {
    const status = queryParam('status');

    if (status === 'open') {
        return 'open';
    }

    if (
        status === 'Logged' ||
        status === 'Under Review' ||
        status === 'Resolved' ||
        status === 'Escalated'
    ) {
        return status;
    }

    return 'all';
}

function initialType(): string {
    const type = queryParam('type');

    return typeOptions.includes(type as TypeOption) ? (type ?? 'all') : 'all';
}

/* ------------------------------------------------------------------ */
/* Tabs — same sticky, full-width style as the other modules' pages   */
/* ------------------------------------------------------------------ */

const tabs = [
    { key: 'log', label: 'Case Log', icon: ShieldAlert },
    { key: 'repeat', label: 'Repeat Offenders', icon: Users },
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
    'Logged',
    'Under Review',
    'Resolved',
    'Escalated',
];

const filtered = computed(() => {
    const term = search.value.trim().toLowerCase();

    return rows.value.filter(
        (row) =>
            (statusFilter.value === 'all' ||
                (statusFilter.value === 'open'
                    ? row.status === 'Logged' || row.status === 'Under Review'
                    : row.status === statusFilter.value)) &&
            (typeFilter.value === 'all' || row.type === typeFilter.value) &&
            (term === '' ||
                row.name.toLowerCase().includes(term) ||
                row.no.toLowerCase().includes(term) ||
                row.category.toLowerCase().includes(term) ||
                row.department.toLowerCase().includes(term)),
    );
});

const offendersFiltered = computed(() => {
    const term = search.value.trim().toLowerCase();

    return repeatOffenders.value.filter(
        (offender) =>
            term === '' ||
            offender.name.toLowerCase().includes(term) ||
            offender.no.toLowerCase().includes(term) ||
            offender.department.toLowerCase().includes(term),
    );
});

const severityTone: Record<string, string> = {
    Serious: 'bg-red-50 text-red-700 border-red-200',
    Moderate: 'bg-amber-50 text-amber-700 border-amber-200',
    Minor: 'bg-blue-50 text-blue-700 border-blue-200',
};

const statusTone: Record<string, string> = {
    Logged: 'bg-blue-50 text-blue-700 border-blue-200',
    'Under Review': 'bg-amber-50 text-amber-700 border-amber-200',
    Resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Escalated: 'bg-red-50 text-red-700 border-red-200',
};

/* ------------------------------------------------------------------ */
/* Pagination                                                          */
/* ------------------------------------------------------------------ */

const PAGE_SIZE = 10;

const logPage = ref(1);
const offenderPage = ref(1);

const pagedLog = computed(() => {
    const start = (logPage.value - 1) * PAGE_SIZE;

    return filtered.value.slice(start, start + PAGE_SIZE);
});

const pagedOffenders = computed(() => {
    const start = (offenderPage.value - 1) * PAGE_SIZE;

    return offendersFiltered.value.slice(start, start + PAGE_SIZE);
});

/* Changing any filter jumps back to the first page. */
watch([statusFilter, typeFilter, search], () => {
    logPage.value = 1;
    offenderPage.value = 1;
});

watch(activeTab, () => {
    logPage.value = 1;
    offenderPage.value = 1;
});

/* ------------------------------------------------------------------ */
/* New record modal                                                    */
/* ------------------------------------------------------------------ */

const showModal = ref(false);
/** The record being edited, or null when logging a new one. */
const editingId = ref<number | null>(null);
const isEditing = computed(() => editingId.value !== null);

const draft = reactive({
    employee_id: '',
    type: 'Warning' as 'Incident' | 'Warning',
    severity: 'Minor' as 'Minor' | 'Moderate' | 'Serious',
    category: '',
    date: '',
    description: '',
    action: '',
    status: 'Logged' as DemoDisciplinaryRecord['status'],
});

const draftEmployee = computed(() =>
    allEmployees.value.find((row) => row.id === Number(draft.employee_id)),
);

function openModal(): void {
    editingId.value = null;
    draft.employee_id = '';
    draft.type = 'Warning';
    draft.severity = 'Minor';
    draft.category = '';
    draft.date = '';
    draft.description = '';
    draft.action = 'Verbal warning';
    draft.status = 'Logged';
    showModal.value = true;
}

function openEdit(row: (typeof rows.value)[number]): void {
    editingId.value = row.id;
    draft.employee_id = String(row.employee_id);
    draft.type = row.type;
    draft.severity = row.severity;
    draft.category = row.category;
    draft.date = row.date;
    draft.description = row.description;
    draft.action = row.action;
    draft.status = row.status;
    showModal.value = true;
}

function saveRecord(): void {
    if (!draft.employee_id) {
        toast.error('Choose the employee');

        return;
    }

    if (!draft.category) {
        toast.error('Choose a category');

        return;
    }

    if (!draft.date) {
        toast.error('Set the date of the incident or warning');

        return;
    }

    if (isEditing.value) {
        updateRecord(
            editingId.value as number,
            {
                type: draft.type,
                severity: draft.severity,
                category: draft.category,
                date: draft.date,
                description: draft.description,
                action: draft.action,
            },
            draft.status,
        );
        toast.success(`Case updated — status: ${draft.status} (demo)`);
    } else {
        addRecord({
            employee_id: Number(draft.employee_id),
            type: draft.type,
            severity: draft.severity,
            category: draft.category,
            date: draft.date,
            description: draft.description,
            action: draft.action,
        });
        toast.success(
            `${draftEmployee.value?.name ?? 'Employee'} — ${draft.type} logged as ${draft.severity.toLowerCase()} (demo)`,
        );
    }

    showModal.value = false;
    editingId.value = null;
}

/* ------------------------------------------------------------------ */
/* Actions                                                            */
/* ------------------------------------------------------------------ */

function removeRow(id: number): void {
    remove(id);
    toast('Record withdrawn');
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
        severity: row.severity,
        category: row.category,
        date: row.date,
        status: row.status,
        action: row.action,
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
        'Severity',
        'Category',
        'Date',
        'Status',
        'Action',
    ];
    const rowsCsv = reportRows.value.map((row) => [
        row.no,
        row.name,
        row.department,
        row.type,
        row.severity,
        row.category,
        row.date,
        row.status,
        row.action,
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
    link.download = 'disciplinary-log.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
}
</script>

<template>
    <Head title="Disciplinary Log — Disciplinary Management" />

    <div class="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <!-- Header -->
        <div
            class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
            <div>
                <h1 class="text-2xl font-bold tracking-tight text-slate-900">
                    Disciplinary Log
                </h1>
                <p class="mt-1 text-sm text-slate-500">
                    Record warnings and incidents fairly, move cases through
                    review, and escalate repeat offenders to Separation &
                    Offboarding when needed.
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

        <!-- How disciplinary works -->
        <div
            class="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/60 p-4 text-sm text-blue-900"
        >
            <Info class="mt-0.5 size-4 shrink-0 text-blue-600" />
            <div class="text-xs leading-relaxed">
                <p class="font-semibold text-slate-900">How this page works</p>
                <p class="mt-1 text-slate-600">
                    Every case starts
                    <span class="font-medium">Logged</span> → moves to
                    <span class="font-medium">Under Review</span> → then
                    <span class="font-medium">Resolved</span> or
                    <span class="font-medium">Escalated</span>. Escalated cases
                    (and employees with repeated serious issues) are flagged for
                    <span class="font-medium">Separation & Offboarding</span>.
                    Warnings cover tardiness and absenteeism; incidents cover
                    policy violations, misconduct, negligence, insubordination
                    and harassment.
                </p>
            </div>
        </div>

        <!-- Tabs: sticky, full-width single row, each tab flexes equally -->
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

        <!-- Case Log tab -->
        <div v-if="activeTab === 'log'" class="flex flex-col gap-6">
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
                        <SelectItem value="open">
                            Open (logged + in review)
                        </SelectItem>
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
                        <SelectItem value="Incident">Incident</SelectItem>
                        <SelectItem value="Warning">Warning</SelectItem>
                    </SelectContent>
                </Select>

                <div class="relative w-64">
                    <Search
                        class="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                        v-model="search"
                        placeholder="Search employee, ID or category…"
                        class="pl-9"
                    />
                </div>
            </div>

            <!-- Log table -->
            <div class="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div
                    class="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4"
                >
                    <h2 class="font-semibold text-slate-900">Case log</h2>
                    <div class="flex items-center gap-3">
                        <span
                            class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                        >
                            {{ filtered.length }} record{{
                                filtered.length === 1 ? '' : 's'
                            }}
                        </span>
                        <Button
                            class="bg-blue-600 hover:bg-blue-700"
                            size="sm"
                            @click="openModal"
                        >
                            <Plus class="size-4" />
                            New record
                        </Button>
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full min-w-[1050px] text-sm">
                        <thead>
                            <tr
                                class="border-b text-left text-xs tracking-wide text-muted-foreground uppercase"
                            >
                                <th class="px-4 py-3 font-medium">No.</th>
                                <th class="px-4 py-3 font-medium">Employee</th>
                                <th class="px-4 py-3 font-medium">Type</th>
                                <th class="px-4 py-3 font-medium">Severity</th>
                                <th class="px-4 py-3 font-medium">Category</th>
                                <th class="px-4 py-3 font-medium">Date</th>
                                <th class="px-4 py-3 font-medium">Status</th>
                                <th class="px-4 py-3 text-right font-medium">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="(row, index) in pagedLog"
                                :key="row.id"
                                class="border-b transition-colors last:border-0 hover:bg-muted/40"
                            >
                                <td
                                    class="px-4 py-3 text-muted-foreground tabular-nums"
                                >
                                    {{ (logPage - 1) * PAGE_SIZE + index + 1 }}
                                </td>
                                <td class="px-4 py-3">
                                    <p class="font-medium text-slate-900">
                                        {{ row.name }}
                                    </p>
                                    <p class="text-xs text-muted-foreground">
                                        {{ row.position }} ·
                                        {{ row.department }}
                                    </p>
                                </td>
                                <td class="px-4 py-3">
                                    <span
                                        class="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium"
                                        :class="
                                            row.type === 'Warning'
                                                ? 'border-amber-200 bg-amber-50 text-amber-700'
                                                : 'border-red-200 bg-red-50 text-red-700'
                                        "
                                    >
                                        <component
                                            :is="
                                                row.type === 'Warning'
                                                    ? AlertTriangle
                                                    : FileX
                                            "
                                            class="size-3.5"
                                        />
                                        {{ row.type }}
                                    </span>
                                </td>
                                <td class="px-4 py-3">
                                    <span
                                        class="inline-flex rounded-full border px-2 py-0.5 text-xs font-medium"
                                        :class="severityTone[row.severity]"
                                    >
                                        {{ row.severity }}
                                    </span>
                                </td>
                                <td class="px-4 py-3 text-slate-700">
                                    <p>{{ row.category }}</p>
                                    <p class="text-xs text-muted-foreground">
                                        {{ row.action }}
                                    </p>
                                </td>
                                <td
                                    class="px-4 py-3 text-muted-foreground tabular-nums"
                                >
                                    {{ row.date }}
                                </td>
                                <td class="px-4 py-3">
                                    <span
                                        class="inline-flex rounded-full border px-2 py-0.5 text-xs font-medium"
                                        :class="statusTone[row.status]"
                                    >
                                        {{ row.status }}
                                    </span>
                                </td>
                                <td class="px-4 py-3 text-right">
                                    <div class="flex justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            class="shrink-0 text-slate-600 shadow-none whitespace-nowrap hover:bg-slate-50 hover:text-slate-900"
                                            @click="openEdit(row)"
                                        >
                                            <Pencil class="size-3.5" />
                                            Update
                                        </Button>
                                        <Link
                                            :href="
                                                row.employee_id >= 1001
                                                    ? `/demo/disciplinary/records/session/${row.employee_id}`
                                                    : `/demo/disciplinary/records/${row.employee_id}`
                                            "
                                            class="inline-flex shrink-0 items-center rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium whitespace-nowrap text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                                        >
                                            View
                                        </Link>
                                        <Button
                                            v-if="
                                                row.status === 'Logged' ||
                                                row.status === 'Under Review'
                                            "
                                            variant="outline"
                                            size="sm"
                                            class="shrink-0 text-slate-600 shadow-none whitespace-nowrap hover:bg-slate-50 hover:text-slate-900"
                                            @click="removeRow(row.id)"
                                        >
                                            Remove
                                        </Button>
                                        <Button
                                            v-if="
                                                row.status === 'Escalated' ||
                                                row.action ===
                                                    'Dismissal recommendation'
                                            "
                                            size="sm"
                                            variant="outline"
                                            :disabled="isHandedOff(row.employee_id)"
                                            class="shrink-0 shadow-none whitespace-nowrap"
                                            :class="
                                                isHandedOff(row.employee_id)
                                                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50'
                                                    : 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
                                            "
                                            :title="
                                                isHandedOff(row.employee_id)
                                                    ? 'Sent to Separation & Offboarding — the offboarding staff processes this case'
                                                    : 'Send the dismissal to Separation & Offboarding for processing'
                                            "
                                            @click="
                                                sendHandoff(
                                                    row.employee_id,
                                                    row.name,
                                                )
                                            "
                                        >
                                            <Check
                                                v-if="isHandedOff(row.employee_id)"
                                                class="size-3.5"
                                            />
                                            <Send v-else class="size-3.5" />
                                            {{
                                                isHandedOff(row.employee_id)
                                                    ? 'Sent'
                                                    : 'Hand off'
                                            }}
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="filtered.length === 0">
                                <td
                                    colspan="8"
                                    class="px-4 py-10 text-center text-sm text-muted-foreground"
                                >
                                    No records match the selected filters.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <PaginationBar
                    :total="filtered.length"
                    :page-size="PAGE_SIZE"
                    v-model:page="logPage"
                />
            </div>
        </div>

        <!-- Repeat Offenders tab -->
        <div v-else class="flex flex-col gap-6">
            <div class="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div
                    class="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4"
                >
                    <div class="flex items-center gap-3">
                        <h2 class="font-semibold text-slate-900">
                            Repeat offenders
                        </h2>
                        <span
                            class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                        >
                            {{ offendersFiltered.length }} employee{{
                                offendersFiltered.length === 1 ? '' : 's'
                            }}
                        </span>
                    </div>
                    <div class="relative w-64">
                        <Search
                            class="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                        />
                        <Input
                            v-model="search"
                            placeholder="Search employee…"
                            class="pl-9"
                        />
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full min-w-[800px] text-sm">
                        <thead>
                            <tr
                                class="border-b text-left text-xs tracking-wide text-muted-foreground uppercase"
                            >
                                <th class="px-4 py-3 font-medium">No.</th>
                                <th class="px-4 py-3 font-medium">Employee</th>
                                <th class="px-4 py-3 text-right font-medium">
                                    Records
                                </th>
                                <th class="px-4 py-3 text-right font-medium">
                                    Serious
                                </th>
                                <th class="px-4 py-3 text-right font-medium">
                                    Open cases
                                </th>
                                <th class="px-4 py-3 font-medium">Status</th>
                                <th class="px-4 py-3 text-right font-medium">
                                    Profile
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="(offender, index) in pagedOffenders"
                                :key="offender.employee_id"
                                class="border-b transition-colors last:border-0 hover:bg-muted/40"
                            >
                                <td
                                    class="px-4 py-3 text-muted-foreground tabular-nums"
                                >
                                    {{
                                        (offenderPage - 1) * PAGE_SIZE +
                                        index +
                                        1
                                    }}
                                </td>
                                <td class="px-4 py-3">
                                    <p class="font-medium text-slate-900">
                                        {{ offender.name }}
                                    </p>
                                    <p class="text-xs text-muted-foreground">
                                        {{ offender.position }} ·
                                        {{ offender.department }}
                                    </p>
                                </td>
                                <td
                                    class="px-4 py-3 text-right font-semibold text-slate-900 tabular-nums"
                                >
                                    {{ offender.recordCount }}
                                </td>
                                <td
                                    class="px-4 py-3 text-right tabular-nums"
                                    :class="
                                        offender.seriousCount > 0
                                            ? 'font-semibold text-red-600'
                                            : 'text-muted-foreground'
                                    "
                                >
                                    {{ offender.seriousCount }}
                                </td>
                                <td
                                    class="px-4 py-3 text-right tabular-nums"
                                    :class="
                                        offender.openCount > 0
                                            ? 'font-medium text-amber-600'
                                            : 'text-muted-foreground'
                                    "
                                >
                                    {{ offender.openCount }}
                                </td>
                                <td class="px-4 py-3">
                                    <span
                                        v-if="offender.flagged"
                                        class="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700"
                                    >
                                        <UserX class="size-3.5" />
                                        Flagged for offboarding
                                    </span>
                                    <span
                                        v-else
                                        class="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600"
                                    >
                                        On file
                                    </span>
                                </td>
                                <td class="px-4 py-3 text-right">
                                    <Link
                                        :href="
                                            offender.employee_id >= 1001
                                                ? `/demo/disciplinary/records/session/${offender.employee_id}`
                                                : `/demo/disciplinary/records/${offender.employee_id}`
                                        "
                                        class="inline-flex items-center rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                                    >
                                        View
                                    </Link>
                                </td>
                            </tr>
                            <tr v-if="offendersFiltered.length === 0">
                                <td
                                    colspan="7"
                                    class="px-4 py-10 text-center text-sm text-muted-foreground"
                                >
                                    No employees with disciplinary records match
                                    the search.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <PaginationBar
                    :total="offendersFiltered.length"
                    :page-size="PAGE_SIZE"
                    v-model:page="offenderPage"
                />
            </div>
        </div>
    </div>

    <!-- Generate report preview -->
    <RecordPrintModal
        v-if="showPreview"
        :heading="`Disciplinary Case Log — ${reportRows.length} record${reportRows.length === 1 ? '' : 's'}`"
        subtitle="Official disciplinary document · ready to print"
        @close="showPreview = false"
    >
        <AttendanceReportDocument
            title="Disciplinary Case Log"
            :period="`As of ${printedOn}`"
            system="Disciplinary Management System"
            :columns="[
                { key: 'no', label: 'No.' },
                { key: 'name', label: 'Employee' },
                { key: 'department', label: 'Department' },
                { key: 'type', label: 'Type' },
                { key: 'severity', label: 'Severity' },
                { key: 'category', label: 'Category' },
                { key: 'date', label: 'Date' },
                { key: 'status', label: 'Status' },
                { key: 'action', label: 'Action Taken' },
            ]"
            :rows="reportRows"
            note="Cases move Logged → Under Review → Resolved; escalated cases and repeated serious issues are handed to Separation & Offboarding."
        />
    </RecordPrintModal>

    <!-- New record modal -->
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
                                    ? 'Update disciplinary record'
                                    : 'New disciplinary record'
                            }}
                        </h3>
                        <p class="text-xs text-muted-foreground">
                            {{
                                isEditing
                                    ? 'Update the case details — action taken, severity or category.'
                                    : 'Starts as Logged — review, then resolve or escalate.'
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
                            <Label>Employee</Label>
                            <Select
                                v-model="draft.employee_id"
                                :disabled="isEditing"
                            >
                                <SelectTrigger class="w-full">
                                    <SelectValue
                                        placeholder="Choose employee"
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem
                                        v-for="employee in allEmployees"
                                        :key="employee.id"
                                        :value="String(employee.id)"
                                    >
                                        {{ employee.name }} ·
                                        {{ employee.no }}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div
                            v-if="isEditing"
                            class="flex flex-col gap-1.5 sm:col-span-2"
                        >
                            <Label>Status</Label>
                            <Select v-model="draft.status">
                                <SelectTrigger class="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Logged">
                                        Logged
                                    </SelectItem>
                                    <SelectItem value="Under Review">
                                        Under Review
                                    </SelectItem>
                                    <SelectItem value="Resolved">
                                        Resolved
                                    </SelectItem>
                                    <SelectItem value="Escalated">
                                        Escalated
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div class="flex flex-col gap-1.5">
                            <Label>Type</Label>
                            <Select v-model="draft.type">
                                <SelectTrigger class="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Warning">
                                        Warning
                                    </SelectItem>
                                    <SelectItem value="Incident">
                                        Incident
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div class="flex flex-col gap-1.5">
                            <Label>Severity</Label>
                            <Select v-model="draft.severity">
                                <SelectTrigger class="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem
                                        v-for="severity in DISCIPLINARY_SEVERITIES"
                                        :key="severity"
                                        :value="severity"
                                    >
                                        {{ severity }}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div class="flex flex-col gap-1.5">
                            <Label>Category</Label>
                            <Select v-model="draft.category">
                                <SelectTrigger class="w-full">
                                    <SelectValue
                                        placeholder="Select category"
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem
                                        v-for="category in DISCIPLINARY_CATEGORIES"
                                        :key="category"
                                        :value="category"
                                    >
                                        {{ category }}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div class="flex flex-col gap-1.5">
                            <Label>Date</Label>
                            <Input v-model="draft.date" type="date" />
                        </div>

                        <div class="flex flex-col gap-1.5 sm:col-span-2">
                            <Label>Action taken</Label>
                            <Select v-model="draft.action">
                                <SelectTrigger class="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem
                                        v-for="action in DISCIPLINARY_ACTIONS"
                                        :key="action"
                                        :value="action"
                                    >
                                        {{ action }}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div class="flex flex-col gap-1.5 sm:col-span-2">
                            <Label>Description</Label>
                            <textarea
                                v-model="draft.description"
                                rows="3"
                                placeholder="What happened…"
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
                        @click="saveRecord"
                    >
                        <Plus class="size-4" />
                        {{ isEditing ? 'Save changes' : 'Log record' }}
                    </Button>
                </div>
            </div>
        </div>
    </Teleport>
</template>
