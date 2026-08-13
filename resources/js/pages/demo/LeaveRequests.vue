<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import {
    CalendarCheck2,
    FileBarChart2,
    FileSpreadsheet,
    Plus,
    Search,
    X,
} from '@lucide/vue';
import { computed, onMounted, ref } from 'vue';
import { toast } from 'vue-sonner';
import AttendanceReportDocument from '@/components/demo/AttendanceReportDocument.vue';
import RecordPrintModal from '@/components/demo/RecordPrintModal.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useDemoLeave } from '@/composables/useDemoLeave';
import type { DemoLeaveRequest, DemoLeaveRow } from '@/types';

type EmployeeOption = {
    id: number;
    no: string;
    name: string;
    department: string;
    position: string;
    balance: number;
};

const props = defineProps<{
    requests: DemoLeaveRow[];
    employees: EmployeeOption[];
    types: string[];
    stats: {
        total: number;
        pending: number;
        approved: number;
        onLeaveToday: number;
    };
}>();

const { addedRequests, addRequest, setStatus, statusFor } = useDemoLeave();

/* ------------------------------------------------------------------ */
/* Merged list + filters                                               */
/* ------------------------------------------------------------------ */

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

const search = ref('');
const statusFilter = ref('all');
const typeFilter = ref('all');

const statusOptions = ['Pending', 'Approved', 'Declined'] as const;

onMounted(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');

    if (status && (statusOptions as readonly string[]).includes(status)) {
        statusFilter.value = status;
    }
});

const filtered = computed(() => {
    const term = search.value.trim().toLowerCase();

    return allRequests.value.filter(
        (row) =>
            (statusFilter.value === 'all' ||
                row.status === statusFilter.value) &&
            (typeFilter.value === 'all' || row.type === typeFilter.value) &&
            (term === '' ||
                row.name.toLowerCase().includes(term) ||
                row.no.toLowerCase().includes(term)),
    );
});

const statusTone: Record<string, string> = {
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
    Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Declined: 'bg-red-50 text-red-700 border-red-200',
};

/* ------------------------------------------------------------------ */
/* Approve / Decline                                                   */
/* ------------------------------------------------------------------ */

function approve(request: DemoLeaveRow): void {
    setStatus(request.id, 'Approved');
    toast.success(
        `${request.name}'s ${request.type} leave approved — day${request.days === 1 ? '' : 's'} marked off in Attendance`,
    );
}

function decline(request: DemoLeaveRow): void {
    setStatus(request.id, 'Declined');
    toast.error(`${request.name}'s ${request.type} leave declined`);
}

/* ------------------------------------------------------------------ */
/* New request modal                                                   */
/* ------------------------------------------------------------------ */

const showModal = ref(false);
const draftEmployee = ref('');
const draftType = ref(props.types[0] ?? 'Vacation');
const draftFrom = ref('');
const draftTo = ref('');
const draftReason = ref('');

const draftEmployeeOption = computed(() =>
    props.employees.find((row) => row.id === Number(draftEmployee.value)),
);

const draftDays = computed(() => {
    if (!draftFrom.value || !draftTo.value) {
        return 0;
    }

    let count = 0;
    const start = new Date(`${draftFrom.value}T00:00:00`);
    const end = new Date(`${draftTo.value}T00:00:00`);

    while (start <= end) {
        const day = start.getDay();

        if (day !== 0 && day !== 6) {
            count += 1;
        }

        start.setDate(start.getDate() + 1);
    }

    return count;
});

function openModal(): void {
    draftEmployee.value = '';
    draftType.value = props.types[0] ?? 'Vacation';
    draftFrom.value = '';
    draftTo.value = '';
    draftReason.value = '';
    showModal.value = true;
}

function submitRequest(): void {
    if (!draftEmployee.value) {
        toast.error('Choose the employee filing the leave');

        return;
    }

    if (!draftFrom.value || !draftTo.value) {
        toast.error('Pick the start and end dates');

        return;
    }

    if (draftTo.value < draftFrom.value) {
        toast.error('End date cannot be before the start date');

        return;
    }

    if (draftDays.value === 0) {
        toast.error('The dates fall on weekends only — pick working days');

        return;
    }

    const request: DemoLeaveRequest = addRequest({
        employee_id: Number(draftEmployee.value),
        type: draftType.value as DemoLeaveRequest['type'],
        from: draftFrom.value,
        to: draftTo.value,
        days: draftDays.value,
        reason: draftReason.value,
    });

    toast.success(
        `Leave request filed for ${draftEmployeeOption.value?.name ?? 'employee'} (${request.days} day${request.days === 1 ? '' : 's'})`,
    );
    showModal.value = false;
}

/* ------------------------------------------------------------------ */
/* Generate / export                                                   */
/* ------------------------------------------------------------------ */

const showPreview = ref(false);

function generate(): void {
    showPreview.value = true;
}

const reportRows = computed(() =>
    filtered.value.map((row, index) => ({
        no: index + 1,
        name: row.name,
        department: row.department,
        type: row.type,
        from: row.from,
        to: row.to,
        days: row.days,
        status: row.status,
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
        'Leave Type',
        'From',
        'To',
        'Days',
        'Status',
    ];
    const rows = reportRows.value.map((row) => [
        row.no,
        row.name,
        row.department,
        row.type,
        row.from,
        row.to,
        row.days,
        row.status,
    ]);
    const csv =
        '\uFEFF' +
        [headers, ...rows]
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
    link.download = 'leave-requests.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
}
</script>

<template>
    <Head title="Leave Requests — Leave Management" />

    <div class="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <!-- Header -->
        <div
            class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
            <div>
                <h1 class="text-2xl font-bold tracking-tight text-slate-900">
                    Leave Requests
                </h1>
                <p class="mt-1 text-sm text-slate-500">
                    Approve or decline requests. Approved leave marks the day
                    off in Attendance and is settled in Payroll as paid or
                    unpaid leave.
                </p>
            </div>
            <div class="flex flex-wrap gap-2">
                <Button variant="outline" @click="generate">
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
                <Button
                    class="bg-blue-600 hover:bg-blue-700"
                    @click="openModal"
                >
                    <Plus class="size-4" />
                    New request
                </Button>
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
                        v-for="option in statusOptions"
                        :key="option"
                        :value="option"
                    >
                        {{ option }}
                    </SelectItem>
                </SelectContent>
            </Select>

            <Select v-model="typeFilter">
                <SelectTrigger class="w-44">
                    <SelectValue placeholder="All leave types" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All leave types</SelectItem>
                    <SelectItem
                        v-for="option in types"
                        :key="option"
                        :value="option"
                    >
                        {{ option }}
                    </SelectItem>
                </SelectContent>
            </Select>

            <div class="relative w-64">
                <Search
                    class="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                    v-model="search"
                    placeholder="Search name or employee ID…"
                    class="pl-9"
                />
            </div>
        </div>

        <!-- Requests table -->
        <div class="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div class="flex items-center justify-between border-b px-5 py-4">
                <h2 class="font-semibold text-slate-900">All requests</h2>
                <span
                    class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                >
                    {{ filtered.length }} request{{
                        filtered.length === 1 ? '' : 's'
                    }}
                </span>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full min-w-[900px] text-sm">
                    <thead>
                        <tr
                            class="border-b text-left text-xs tracking-wide text-muted-foreground uppercase"
                        >
                            <th class="px-4 py-3 font-medium">No.</th>
                            <th class="px-4 py-3 font-medium">Employee</th>
                            <th class="px-4 py-3 font-medium">Type</th>
                            <th class="px-4 py-3 font-medium">Dates</th>
                            <th class="px-4 py-3 font-medium">Days</th>
                            <th class="px-4 py-3 font-medium">Status</th>
                            <th class="px-4 py-3 text-right font-medium">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(row, index) in filtered"
                            :key="row.id"
                            class="border-b transition-colors last:border-0 hover:bg-muted/40"
                        >
                            <td
                                class="px-4 py-3 text-muted-foreground tabular-nums"
                            >
                                {{ index + 1 }}
                            </td>
                            <td class="px-4 py-3">
                                <p class="font-medium text-slate-900">
                                    {{ row.name }}
                                </p>
                                <p class="text-xs text-muted-foreground">
                                    {{ row.position }} · balance
                                    {{ row.balance }} day{{
                                        row.balance === 1 ? '' : 's'
                                    }}
                                </p>
                            </td>
                            <td class="px-4 py-3 text-muted-foreground">
                                {{ row.type }}
                            </td>
                            <td
                                class="px-4 py-3 text-muted-foreground tabular-nums"
                            >
                                {{ row.from }} – {{ row.to }}
                            </td>
                            <td class="px-4 py-3 tabular-nums">
                                {{ row.days }}
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
                                    <Link
                                        :href="`/demo/leave/records/${row.employee_id}`"
                                        class="inline-flex items-center rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                                    >
                                        View
                                    </Link>
                                    <template v-if="row.status === 'Pending'">
                                        <Button
                                            size="sm"
                                            class="bg-blue-600 hover:bg-blue-700"
                                            @click="approve(row)"
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            class="text-slate-600 shadow-none hover:bg-slate-50 hover:text-slate-900"
                                            @click="decline(row)"
                                        >
                                            Decline
                                        </Button>
                                    </template>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="filtered.length === 0">
                            <td
                                colspan="7"
                                class="px-4 py-10 text-center text-sm text-muted-foreground"
                            >
                                No leave requests match the selected filters.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Generate report preview -->
    <RecordPrintModal
        v-if="showPreview"
        :heading="`Leave Summary Report — ${reportRows.length} requests`"
        subtitle="Official leave document · ready to print"
        @close="showPreview = false"
    >
        <AttendanceReportDocument
            title="Leave Summary Report"
            :period="`As of ${printedOn}`"
            system="Leave Management System"
            :columns="[
                { key: 'no', label: 'No.' },
                { key: 'name', label: 'Employee' },
                { key: 'department', label: 'Department' },
                { key: 'type', label: 'Leave Type' },
                { key: 'from', label: 'From' },
                { key: 'to', label: 'To' },
                { key: 'days', label: 'Days', numeric: true },
                { key: 'status', label: 'Status' },
            ]"
            :rows="reportRows"
            note="Approved leave marks the employee's day off in Attendance and is settled as paid or unpaid leave in Payroll."
        />
    </RecordPrintModal>

    <!-- New request modal -->
    <Teleport to="body">
        <div
            v-if="showModal"
            class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm sm:p-8"
            @click.self="showModal = false"
        >
            <div
                class="flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl bg-white shadow-2xl"
            >
                <div
                    class="flex items-center justify-between border-b px-6 py-4"
                >
                    <div>
                        <h3 class="text-base font-bold text-slate-900">
                            New leave request
                        </h3>
                        <p class="text-xs text-muted-foreground">
                            File a request — it starts as Pending.
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

                <div class="space-y-4 overflow-y-auto px-6 py-5">
                    <div class="flex flex-col gap-1.5">
                        <label
                            class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                        >
                            Employee
                        </label>
                        <Select v-model="draftEmployee">
                            <SelectTrigger>
                                <SelectValue placeholder="Choose employee" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem
                                    v-for="employee in employees"
                                    :key="employee.id"
                                    :value="String(employee.id)"
                                >
                                    {{ employee.name }} · {{ employee.no }}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <p
                            v-if="draftEmployeeOption"
                            class="text-xs text-slate-500"
                        >
                            {{ draftEmployeeOption.position }} ·
                            {{ draftEmployeeOption.department }} · balance
                            {{ draftEmployeeOption.balance }} day{{
                                draftEmployeeOption.balance === 1 ? '' : 's'
                            }}
                        </p>
                    </div>

                    <div class="flex flex-col gap-1.5">
                        <label
                            class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                        >
                            Leave type
                        </label>
                        <Select v-model="draftType">
                            <SelectTrigger>
                                <SelectValue placeholder="Choose type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem
                                    v-for="option in types"
                                    :key="option"
                                    :value="option"
                                >
                                    {{ option }}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="flex flex-col gap-1.5">
                            <label
                                class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                            >
                                From
                            </label>
                            <Input v-model="draftFrom" type="date" />
                        </div>
                        <div class="flex flex-col gap-1.5">
                            <label
                                class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                            >
                                To
                            </label>
                            <Input v-model="draftTo" type="date" />
                        </div>
                    </div>

                    <p
                        v-if="draftDays > 0"
                        class="rounded-lg bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700"
                    >
                        {{ draftDays }} working day{{
                            draftDays === 1 ? '' : 's'
                        }}
                        ({{ draftFrom }} – {{ draftTo }})
                    </p>

                    <div class="flex flex-col gap-1.5">
                        <label
                            class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                        >
                            Reason
                        </label>
                        <Input
                            v-model="draftReason"
                            placeholder="e.g. Family trip, medical appointment"
                        />
                    </div>
                </div>

                <div class="flex justify-end gap-2 border-t px-6 py-4">
                    <Button variant="ghost" @click="showModal = false">
                        Cancel
                    </Button>
                    <Button
                        class="bg-blue-600 hover:bg-blue-700"
                        @click="submitRequest"
                    >
                        <CalendarCheck2 class="size-4" />
                        Save request
                    </Button>
                </div>
            </div>
        </div>
    </Teleport>
</template>
