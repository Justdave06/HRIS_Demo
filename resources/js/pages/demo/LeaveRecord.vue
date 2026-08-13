<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { ArrowLeft, FileBarChart2, FileSpreadsheet } from '@lucide/vue';
import { computed, ref } from 'vue';
import AttendanceReportDocument from '@/components/demo/AttendanceReportDocument.vue';
import RecordPrintModal from '@/components/demo/RecordPrintModal.vue';
import { Button } from '@/components/ui/button';
import { useDemoEmployees } from '@/composables/useDemoEmployees';
import { useDemoLeave } from '@/composables/useDemoLeave';
import type { DemoLeaveRow } from '@/types';

const props = defineProps<{
    employee: {
        id: number;
        no: string;
        name: string;
        department: string;
        position: string;
        balance: number;
    };
    requests: DemoLeaveRow[];
}>();

const { addedRequests, statusFor, balanceFor } = useDemoLeave();

// Session-added employees (no server record) hydrate from sessionStorage,
// so the name and record shown here match the Employee Management module.
const { employeeFor } = useDemoEmployees();

const displayEmployee = computed(
    () => employeeFor(props.employee.id) ?? props.employee,
);

/* ------------------------------------------------------------------ */
/* History: seeded + session-added requests for this employee only     */
/* ------------------------------------------------------------------ */

const history = computed<DemoLeaveRow[]>(() => {
    const base: DemoLeaveRow[] = props.requests
        .filter((row) => row.employee_id === props.employee.id)
        .map((row) => ({ ...row, status: statusFor(row) }));
    const added: DemoLeaveRow[] = addedRequests.value
        .filter((row) => row.employee_id === props.employee.id)
        .map((row) => ({
            ...row,
            no: displayEmployee.value.no,
            name: displayEmployee.value.name,
            department: displayEmployee.value.department,
            position: displayEmployee.value.position,
            balance: balanceFor(props.employee.id, props.employee.balance),
            status: statusFor(row),
        }));

    return [...base, ...added].sort((a, b) => (a.from < b.from ? 1 : -1));
});

const statusTone: Record<string, string> = {
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
    Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Declined: 'bg-red-50 text-red-700 border-red-200',
};

const usedDays = computed(() =>
    history.value
        .filter((row) => row.status === 'Approved')
        .reduce((sum, row) => sum + row.days, 0),
);

const balance = computed(() =>
    balanceFor(props.employee.id, props.employee.balance),
);

const remaining = computed(() => Math.max(0, balance.value - usedDays.value));

// Per-type credits are derived deterministically from the total balance so
// the demo shows a realistic Vacation / Sick / Emergency split.
const typeBalances = computed(() => {
    const vacation = Math.ceil(balance.value * 0.5);
    const sick = Math.ceil(balance.value * 0.3);
    const emergency = Math.max(1, balance.value - vacation - sick);
    const credits = [
        { type: 'Vacation', credit: vacation },
        { type: 'Sick', credit: sick },
        { type: 'Emergency', credit: emergency },
    ];

    return credits.map((entry) => {
        const used = history.value
            .filter(
                (row) => row.status === 'Approved' && row.type === entry.type,
            )
            .reduce((sum, row) => sum + row.days, 0);

        return { ...entry, used, remaining: Math.max(0, entry.credit - used) };
    });
});

/* ------------------------------------------------------------------ */
/* Generate / export                                                   */
/* ------------------------------------------------------------------ */

const showPreview = ref(false);

const reportRows = computed(() =>
    history.value.map((row, index) => ({
        no: index + 1,
        type: row.type,
        from: row.from,
        to: row.to,
        days: row.days,
        status: row.status,
        reason: row.reason,
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
        'Leave Type',
        'From',
        'To',
        'Days',
        'Status',
        'Reason',
    ];
    const rows = reportRows.value.map((row) => [
        row.no,
        row.type,
        row.from,
        row.to,
        row.days,
        row.status,
        row.reason,
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
    link.download = `${displayEmployee.value.name.replaceAll(' ', '-').toLowerCase()}-leave-record.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
}
</script>

<template>
    <Head :title="`${displayEmployee.name} — Leave Record`" />

    <div class="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <!-- Header -->
        <div
            class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
            <div>
                <Link
                    href="/demo/leave/requests"
                    class="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-blue-600"
                >
                    <ArrowLeft class="size-3.5" />
                    Back to leave requests
                </Link>
                <h1
                    class="mt-2 text-2xl font-bold tracking-tight text-slate-900"
                >
                    {{ displayEmployee.name }}
                </h1>
                <p class="mt-1 text-sm text-slate-500">
                    {{ displayEmployee.no }} · {{ displayEmployee.position }} ·
                    {{ displayEmployee.department }}
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

        <!-- Balance summary -->
        <div class="grid gap-4 sm:grid-cols-3">
            <div
                class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
                <p
                    class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                >
                    Leave balance
                </p>
                <p class="mt-1 text-3xl font-bold text-slate-900 tabular-nums">
                    {{ balance }}
                    <span class="text-sm font-medium text-slate-500">
                        days
                    </span>
                </p>
            </div>
            <div
                class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
                <p
                    class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                >
                    Used (approved)
                </p>
                <p class="mt-1 text-3xl font-bold text-slate-900 tabular-nums">
                    {{ usedDays }}
                    <span class="text-sm font-medium text-slate-500">
                        days
                    </span>
                </p>
            </div>
            <div
                class="rounded-xl border border-blue-200 bg-blue-50/70 p-5 shadow-sm"
            >
                <p
                    class="text-[11px] font-medium tracking-wide text-blue-600 uppercase"
                >
                    Remaining
                </p>
                <p class="mt-1 text-3xl font-bold text-blue-700 tabular-nums">
                    {{ remaining }}
                    <span class="text-sm font-medium text-blue-500">days</span>
                </p>
            </div>
        </div>

        <!-- Per-type balances -->
        <div class="flex flex-wrap gap-2">
            <span
                v-for="entry in typeBalances"
                :key="entry.type"
                class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700"
            >
                {{ entry.type }}
                <span class="text-slate-400">·</span>
                <span class="tabular-nums">{{ entry.remaining }} left</span>
                <span class="text-slate-400">({{ entry.used }} used)</span>
            </span>
        </div>

        <!-- Leave history -->
        <div class="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div class="flex items-center justify-between border-b px-5 py-4">
                <h2 class="font-semibold text-slate-900">Leave history</h2>
                <span
                    class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                >
                    {{ history.length }} record{{
                        history.length === 1 ? '' : 's'
                    }}
                </span>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full min-w-[800px] text-sm">
                    <thead>
                        <tr
                            class="border-b text-left text-xs tracking-wide text-muted-foreground uppercase"
                        >
                            <th class="px-4 py-3 font-medium">No.</th>
                            <th class="px-4 py-3 font-medium">Leave type</th>
                            <th class="px-4 py-3 font-medium">From</th>
                            <th class="px-4 py-3 font-medium">To</th>
                            <th class="px-4 py-3 font-medium">Days</th>
                            <th class="px-4 py-3 font-medium">Status</th>
                            <th class="px-4 py-3 font-medium">Reason</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(row, index) in history"
                            :key="row.id"
                            class="border-b align-top transition-colors last:border-0 hover:bg-muted/40"
                        >
                            <td
                                class="px-4 py-3 text-muted-foreground tabular-nums"
                            >
                                {{ index + 1 }}
                            </td>
                            <td class="px-4 py-3 text-slate-700">
                                {{ row.type }}
                            </td>
                            <td class="px-4 py-3 text-slate-700 tabular-nums">
                                {{ row.from }}
                            </td>
                            <td class="px-4 py-3 text-slate-700 tabular-nums">
                                {{ row.to }}
                            </td>
                            <td class="px-4 py-3 text-slate-700 tabular-nums">
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
                            <td class="px-4 py-3 text-slate-600">
                                {{ row.reason }}
                            </td>
                        </tr>
                        <tr v-if="history.length === 0">
                            <td
                                colspan="7"
                                class="px-4 py-10 text-center text-sm text-muted-foreground"
                            >
                                No leave records yet for this employee.
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
        :heading="`Leave Record — ${displayEmployee.name}`"
        subtitle="Official leave document · ready to print"
        @close="showPreview = false"
    >
        <AttendanceReportDocument
            title="Employee Leave Record"
            :period="`As of ${printedOn}`"
            system="Leave Management System"
            :columns="[
                { key: 'no', label: 'No.' },
                { key: 'type', label: 'Leave Type' },
                { key: 'from', label: 'From' },
                { key: 'to', label: 'To' },
                { key: 'days', label: 'Days', numeric: true },
                { key: 'status', label: 'Status' },
                { key: 'reason', label: 'Reason' },
            ]"
            :rows="reportRows"
            :note="`${displayEmployee.name} — ${displayEmployee.position}, ${displayEmployee.department}. Leave balance: ${balance} days, ${usedDays} used (approved), ${remaining} remaining.`"
        />
    </RecordPrintModal>
</template>
