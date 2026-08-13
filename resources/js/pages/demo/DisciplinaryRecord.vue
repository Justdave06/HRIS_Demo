<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import {
    AlertTriangle,
    ArrowLeft,
    ArrowUpRight,
    Check,
    FileBarChart2,
    FileSpreadsheet,
    FileX,
    Send,
    ShieldAlert,
    UserX,
} from '@lucide/vue';
import { computed, ref } from 'vue';
import { toast } from 'vue-sonner';
import AttendanceReportDocument from '@/components/demo/AttendanceReportDocument.vue';
import RecordPrintModal from '@/components/demo/RecordPrintModal.vue';
import { Button } from '@/components/ui/button';
import { useDemoDisciplinary } from '@/composables/useDemoDisciplinary';
import type { DisciplinaryEmployee } from '@/composables/useDemoDisciplinary';
import { useDemoEmployees } from '@/composables/useDemoEmployees';
import type { DemoDisciplinaryRecord } from '@/types';

const props = defineProps<{
    employee: {
        id: number;
        no: string;
        name: string;
        department: string;
        position: string;
    };
    employees: DisciplinaryEmployee[];
    records: DemoDisciplinaryRecord[];
}>();

// Session-added employees (no server record) hydrate from sessionStorage, so
// the name and record shown here match the Employee Management module.
const { employeeFor } = useDemoEmployees();

const displayEmployee = computed(
    () => employeeFor(props.employee.id) ?? props.employee,
);

const {
    rows,
    escalatedEmployeeIds,
    handedOffIds,
    repeatOffenders,
    handoff,
} = useDemoDisciplinary(props.employees, props.records);

/* ------------------------------------------------------------------ */
/* This employee's disciplinary history                               */
/* ------------------------------------------------------------------ */

const history = computed(() =>
    rows.value
        .filter((row) => row.employee_id === displayEmployee.value.id)
        .sort((a, b) => (a.date < b.date ? -1 : 1)),
);

const open = computed(() =>
    history.value.filter(
        (row) => row.status === 'Logged' || row.status === 'Under Review',
    ),
);

const serious = computed(
    () => history.value.filter((row) => row.severity === 'Serious').length,
);

const flagged = computed(
    () =>
        escalatedEmployeeIds.value.includes(displayEmployee.value.id) ||
        repeatOffenders.value.find(
            (offender) => offender.employee_id === displayEmployee.value.id,
        )?.flagged,
);

/** True once this employee's dismissal has been sent to Offboarding. */
const handedOff = computed(() =>
    handedOffIds.value.includes(displayEmployee.value.id),
);

/** Send the dismissal to Separation & Offboarding — no redirect, the
 *  termination case lands in the register for the offboarding staff. */
function sendHandoff(): void {
    handoff(displayEmployee.value.id);
    toast.success(
        `${displayEmployee.value.name} handed off to Separation & Offboarding — the termination case is in the register for the offboarding staff to process`,
    );
}

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
/* Generate / export                                                   */
/* ------------------------------------------------------------------ */

const showPreview = ref(false);

const reportRows = computed(() =>
    history.value.map((row, index) => ({
        no: index + 1,
        date: row.date,
        type: row.type,
        severity: row.severity,
        category: row.category,
        action: row.action,
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
        'Date',
        'Type',
        'Severity',
        'Category',
        'Action',
        'Status',
    ];
    const rowsCsv = reportRows.value.map((row) => [
        row.no,
        row.date,
        row.type,
        row.severity,
        row.category,
        row.action,
        row.status,
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
    link.download = `${displayEmployee.value.name.replaceAll(' ', '-').toLowerCase()}-disciplinary-record.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
}
</script>

<template>
    <Head :title="`${displayEmployee.name} — Disciplinary Record`" />

    <div class="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <!-- Header -->
        <div
            class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
            <div>
                <Link
                    href="/demo/disciplinary/records"
                    class="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-blue-600"
                >
                    <ArrowLeft class="size-3.5" />
                    Back to Disciplinary Log
                </Link>
                <h1
                    class="mt-2 text-2xl font-bold tracking-tight text-slate-900"
                >
                    {{ displayEmployee.name }}
                </h1>
                <p class="mt-1 text-sm text-slate-500">
                    {{ displayEmployee.no }} ·
                    {{ displayEmployee.position }} ·
                    {{ displayEmployee.department }}
                </p>
                <p class="mt-0.5 text-xs text-slate-400">
                    Disciplinary history · case log on file
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

        <!-- Summary -->
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div
                class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
                <div class="flex items-center justify-between">
                    <p
                        class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                    >
                        Cases on file
                    </p>
                    <span class="rounded-lg bg-blue-50 p-2 text-blue-700">
                        <ShieldAlert class="size-4" />
                    </span>
                </div>
                <p class="mt-2 text-3xl font-bold text-slate-900 tabular-nums">
                    {{ history.length }}
                </p>
                <p class="mt-1 text-xs text-slate-500">
                    Incidents and warnings logged
                </p>
            </div>

            <div
                class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
                <div class="flex items-center justify-between">
                    <p
                        class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                    >
                        Open cases
                    </p>
                    <span class="rounded-lg bg-amber-50 p-2 text-amber-700">
                        <AlertTriangle class="size-4" />
                    </span>
                </div>
                <p class="mt-2 text-3xl font-bold text-slate-900 tabular-nums">
                    {{ open.length }}
                </p>
                <p class="mt-1 text-xs text-slate-500">
                    Logged or under review
                </p>
            </div>

            <div
                class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
                <div class="flex items-center justify-between">
                    <p
                        class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                    >
                        Serious cases
                    </p>
                    <span class="rounded-lg bg-red-50 p-2 text-red-700">
                        <FileX class="size-4" />
                    </span>
                </div>
                <p class="mt-2 text-3xl font-bold text-slate-900 tabular-nums">
                    {{ serious }}
                </p>
                <p class="mt-1 text-xs text-slate-500">
                    Negligence, insubordination, harassment
                </p>
            </div>

            <div
                class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
                <div class="flex items-center justify-between">
                    <p
                        class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                    >
                        Offboarding flag
                    </p>
                    <span
                        class="rounded-lg p-2"
                        :class="
                            flagged
                                ? 'bg-red-50 text-red-700'
                                : 'bg-slate-100 text-slate-500'
                        "
                    >
                        <UserX class="size-4" />
                    </span>
                </div>
                <p
                    class="mt-2 text-3xl font-bold tabular-nums"
                    :class="flagged ? 'text-red-600' : 'text-slate-900'"
                >
                    {{ flagged ? 'Yes' : 'No' }}
                </p>
                <p class="mt-1 text-xs text-slate-500">
                    Escalated to Separation & Offboarding
                </p>
                <Button
                    v-if="flagged"
                    variant="outline"
                    :disabled="handedOff"
                    class="mt-3 w-full"
                    :class="
                        handedOff
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50'
                            : 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
                    "
                    :title="
                        handedOff
                            ? 'Sent to Separation & Offboarding — the offboarding staff processes this case'
                            : 'Send the dismissal to Separation & Offboarding for processing'
                    "
                    @click="sendHandoff"
                >
                    <Check v-if="handedOff" class="size-3.5" />
                    <Send v-else class="size-3.5" />
                    {{ handedOff ? 'Sent to Offboarding' : 'Send to Offboarding' }}
                </Button>
            </div>
        </div>

        <!-- Case history table -->
        <div class="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div class="flex items-center justify-between border-b px-5 py-4">
                <h2 class="font-semibold text-slate-900">Case history</h2>
                <span
                    class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                >
                    {{ history.length }} record{{
                        history.length === 1 ? '' : 's'
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
                            <th class="px-4 py-3 font-medium">Date</th>
                            <th class="px-4 py-3 font-medium">Type</th>
                            <th class="px-4 py-3 font-medium">Severity</th>
                            <th class="px-4 py-3 font-medium">Category</th>
                            <th class="px-4 py-3 font-medium">Action taken</th>
                            <th class="px-4 py-3 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(row, index) in history"
                            :key="row.id"
                            class="border-b transition-colors last:border-0 hover:bg-muted/40"
                        >
                            <td
                                class="px-4 py-3 text-muted-foreground tabular-nums"
                            >
                                {{ index + 1 }}
                            </td>
                            <td
                                class="px-4 py-3 text-muted-foreground tabular-nums"
                            >
                                {{ row.date }}
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
                                {{ row.category }}
                            </td>
                            <td class="px-4 py-3 text-muted-foreground">
                                {{ row.action }}
                            </td>
                            <td class="px-4 py-3">
                                <span
                                    class="inline-flex rounded-full border px-2 py-0.5 text-xs font-medium"
                                    :class="statusTone[row.status]"
                                >
                                    {{ row.status }}
                                </span>
                            </td>
                        </tr>
                        <tr v-if="history.length === 0">
                            <td
                                colspan="7"
                                class="px-4 py-10 text-center text-sm text-muted-foreground"
                            >
                                No disciplinary records on file for this
                                employee — clean record.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Quick link back -->
        <Link
            href="/demo/disciplinary/records"
            class="group flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50/60 p-5 transition-colors duration-200 hover:border-blue-300 hover:bg-blue-50"
        >
            <div class="flex items-center gap-3">
                <span class="rounded-lg bg-blue-600 p-2.5 text-white shadow-sm">
                    <ArrowLeft class="size-5" />
                </span>
                <div>
                    <p class="text-sm font-semibold text-slate-900">
                        Back to Disciplinary Log
                    </p>
                    <p class="text-xs text-slate-500">
                        Review all cases or log a new record.
                    </p>
                </div>
            </div>
            <ArrowUpRight
                class="size-4 text-blue-600 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
        </Link>
    </div>

    <!-- Generate report preview -->
    <RecordPrintModal
        v-if="showPreview"
        :heading="`Disciplinary Record — ${displayEmployee.name}`"
        subtitle="Official disciplinary document · ready to print"
        @close="showPreview = false"
    >
        <AttendanceReportDocument
            title="Employee Disciplinary Record"
            :period="`As of ${printedOn}`"
            system="Disciplinary Management System"
            :columns="[
                { key: 'no', label: 'No.' },
                { key: 'date', label: 'Date' },
                { key: 'type', label: 'Type' },
                { key: 'severity', label: 'Severity' },
                { key: 'category', label: 'Category' },
                { key: 'action', label: 'Action Taken' },
                { key: 'status', label: 'Status' },
            ]"
            :rows="reportRows"
            :note="`${displayEmployee.name} — ${displayEmployee.position}, ${displayEmployee.department}. Escalated cases and repeated serious issues are handed to Separation & Offboarding.`"
        />
    </RecordPrintModal>
</template>
