<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import {
    CalendarCheck2,
    FileBarChart2,
    FileSpreadsheet,
    Printer,
    Search,
    X,
} from '@lucide/vue';
import { computed, onMounted, ref } from 'vue';
import { toast } from 'vue-sonner';
import AttendanceReportDocument from '@/components/demo/AttendanceReportDocument.vue';
import RecordPrintModal from '@/components/demo/RecordPrintModal.vue';
import StatusBadge from '@/components/demo/StatusBadge.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useDemoDtr } from '@/composables/useDemoDtr';
import { useDemoHolidays } from '@/composables/useDemoHolidays';

type RosterRow = {
    employee_id: number;
    no: string;
    name: string;
    department: string;
    position: string;
    time_in: string | null;
    time_out: string | null;
    status: string;
};

const props = defineProps<{
    attendance: RosterRow[];
    departments: string[];
}>();

const { declaredHolidays } = useDemoHolidays();
const { dtrDays, rangeStats } = useDemoDtr();

/* ------------------------------------------------------------------ */
/* Filters                                                             */
/* ------------------------------------------------------------------ */

const search = ref('');
const startDate = ref('');
const endDate = ref('');
const statusFilter = ref('all');

const statusOptions = [
    'Present',
    'Late',
    'Absent',
    'On Leave',
    'Not Yet In',
] as const;

onMounted(() => {
    // Default range: the current month so far.
    const now = new Date();
    const first = new Date(now.getFullYear(), now.getMonth(), 1);

    startDate.value = first.toISOString().slice(0, 10);
    endDate.value = now.toISOString().slice(0, 10);

    // Stat cards on the dashboard arrive with ?status=... to pre-filter.
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');

    if (status && (statusOptions as readonly string[]).includes(status)) {
        statusFilter.value = status;
    }
});

const filtered = computed(() => {
    const term = search.value.trim().toLowerCase();

    return props.attendance.filter(
        (row) =>
            (statusFilter.value === 'all' ||
                row.status === statusFilter.value) &&
            (term === '' ||
                row.name.toLowerCase().includes(term) ||
                row.no.toLowerCase().includes(term) ||
                row.department.toLowerCase().includes(term)),
    );
});

/* ------------------------------------------------------------------ */
/* DTR card                                                            */
/* ------------------------------------------------------------------ */

const dtrEmployee = ref<RosterRow | null>(null);

// The DTR card always renders a real month: the selected range's month, or
// the current month when the range was cleared.
const dtrMonth = computed(() => {
    const rangeMonth = (startDate.value || endDate.value || '').slice(0, 7);

    if (rangeMonth.length === 7) {
        return rangeMonth;
    }

    const now = new Date();

    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
});

const dtrDaysFor = computed(() => {
    const employee = dtrEmployee.value;

    if (!employee) {
        return [];
    }

    return dtrDays(
        employee.employee_id,
        employee.time_in ?? '08:00',
        employee.time_out ?? '17:00',
        dtrMonth.value,
        declaredHolidays.value,
        employee.department,
    );
});

const dtrMonthLabel = computed(() => {
    if (!dtrMonth.value) {
        return '';
    }

    const [year, month] = dtrMonth.value.split('-').map(Number);

    return new Date(year, month - 1, 1).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
    });
});

const dtrTotals = computed(() =>
    dtrDaysFor.value.reduce((sum, day) => sum + (day.total ?? 0), 0),
);

function printDtr(): void {
    window.print();
}

/* ------------------------------------------------------------------ */
/* Generate / export                                                   */
/* ------------------------------------------------------------------ */

const showPreview = ref(false);

const reportRows = computed(() =>
    filtered.value.map((row, index) => {
        const stats = rangeStats(
            row.employee_id,
            startDate.value,
            endDate.value,
        );

        return {
            no: index + 1,
            name: row.name,
            position: row.position,
            department: row.department,
            present: stats.presentDays,
            late: stats.lateDays,
            absent: stats.absentDays,
            otHours: stats.otHours,
        };
    }),
);

function periodLabel(): string {
    if (!startDate.value || !endDate.value) {
        return '—';
    }

    const start = new Date(`${startDate.value}T00:00:00`).toLocaleDateString(
        'en-US',
        { month: 'short', day: 'numeric' },
    );
    const end = new Date(`${endDate.value}T00:00:00`).toLocaleDateString(
        'en-US',
        { month: 'short', day: 'numeric', year: 'numeric' },
    );

    return `${start} – ${end}`;
}

function generate(): void {
    if (!startDate.value || !endDate.value) {
        toast.error('Pick a start and end date first');

        return;
    }

    showPreview.value = true;
}

function exportExcel(): void {
    const headers = [
        'No.',
        'Employee',
        'Position',
        'Department',
        'Present Days',
        'Late Days',
        'Absent Days',
        'OT Hours',
    ];
    const rows = reportRows.value.map((row) => [
        row.no,
        row.name,
        row.position,
        row.department,
        row.present,
        row.late,
        row.absent,
        row.otHours,
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
    link.download = 'attendance-dtr-report.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
}
</script>

<template>
    <Head title="Attendance Manager — Time & Attendance" />

    <div class="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <!-- Header -->
        <div
            class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
            <div>
                <h1 class="text-2xl font-bold tracking-tight text-slate-900">
                    Attendance Manager
                </h1>
                <p class="mt-1 text-sm text-slate-500">
                    Daily roster with print-ready DTR cards — the hours here
                    feed Payroll (Module 5).
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
            </div>
        </div>

        <!-- Filters: date range + status + search -->
        <div
            class="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
        >
            <div class="flex flex-col gap-1.5">
                <label
                    class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                >
                    Start date
                </label>
                <Input v-model="startDate" type="date" class="w-44" />
            </div>
            <div class="flex flex-col gap-1.5">
                <label
                    class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                >
                    End date
                </label>
                <Input v-model="endDate" type="date" class="w-44" />
            </div>

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

            <div class="relative w-64">
                <Search
                    class="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                    v-model="search"
                    placeholder="Search name, ID or department…"
                    class="pl-9"
                />
            </div>
        </div>

        <!-- Roster table -->
        <div class="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div class="flex items-center justify-between border-b px-5 py-4">
                <h2 class="font-semibold text-slate-900">Today's roster</h2>
                <span
                    class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                >
                    {{ filtered.length }} employee{{
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
                            <th class="px-4 py-3 font-medium">Department</th>
                            <th class="px-4 py-3 font-medium">In</th>
                            <th class="px-4 py-3 font-medium">Out</th>
                            <th class="px-4 py-3 font-medium">Status</th>
                            <th class="px-4 py-3 text-right font-medium">
                                DTR
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(row, index) in filtered"
                            :key="row.employee_id"
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
                                    {{ row.position }}
                                </p>
                            </td>
                            <td class="px-4 py-3 text-muted-foreground">
                                {{ row.department }}
                            </td>
                            <td class="px-4 py-3 tabular-nums">
                                {{ row.time_in ?? '—' }}
                            </td>
                            <td class="px-4 py-3 tabular-nums">
                                {{ row.time_out ?? '—' }}
                            </td>
                            <td class="px-4 py-3">
                                <StatusBadge :status="row.status" />
                            </td>
                            <td class="px-4 py-3 text-right">
                                <Button
                                    size="sm"
                                    class="bg-blue-600 hover:bg-blue-700"
                                    @click="dtrEmployee = row"
                                >
                                    <CalendarCheck2 class="size-3.5" />
                                    View DTR
                                </Button>
                            </td>
                        </tr>
                        <tr v-if="filtered.length === 0">
                            <td
                                colspan="7"
                                class="px-4 py-10 text-center text-sm text-muted-foreground"
                            >
                                No employees match the selected filters.
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
        :heading="`Daily Time Record Report — ${reportRows.length} employees`"
        subtitle="Official attendance summary · ready to print"
        @close="showPreview = false"
    >
        <AttendanceReportDocument
            title="Daily Time Record Report"
            :period="periodLabel()"
            :columns="[
                { key: 'no', label: 'No.' },
                { key: 'name', label: 'Employee' },
                { key: 'position', label: 'Position' },
                { key: 'department', label: 'Department' },
                { key: 'present', label: 'Present', numeric: true },
                { key: 'late', label: 'Late', numeric: true },
                { key: 'absent', label: 'Absent', numeric: true },
                { key: 'otHours', label: 'OT Hours', numeric: true },
            ]"
            :rows="reportRows"
            note="Declared holidays are marked on the individual DTR cards."
        />
    </RecordPrintModal>

    <!-- Print-ready DTR card -->
    <Teleport to="body">
        <div
            v-if="dtrEmployee"
            id="dtr-overlay"
            class="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm sm:p-8"
        >
            <div class="mx-auto max-w-4xl">
                <div
                    class="sticky top-0 z-10 flex items-center justify-between rounded-t-2xl border-b border-slate-200 bg-white px-5 py-4 print:hidden"
                >
                    <div>
                        <h3 class="text-base font-bold text-slate-900">
                            Daily Time Record — {{ dtrEmployee.name }}
                        </h3>
                        <p class="text-xs text-muted-foreground">
                            {{ dtrMonthLabel }} · print-ready DTR card
                        </p>
                    </div>
                    <div class="flex gap-2">
                        <Button variant="ghost" @click="dtrEmployee = null">
                            <X class="size-4" />
                            Close
                        </Button>
                        <Button
                            class="bg-blue-600 hover:bg-blue-700"
                            @click="printDtr"
                        >
                            <Printer class="size-4" />
                            Print
                        </Button>
                    </div>
                </div>

                <!-- The DTR sheet -->
                <div
                    id="dtr-sheet"
                    class="rounded-b-2xl bg-white px-6 py-8 shadow-2xl sm:px-10"
                >
                    <div class="text-center">
                        <p
                            class="text-xs font-bold tracking-widest text-slate-700 uppercase"
                        >
                            Republic of the Philippines
                        </p>
                        <p
                            class="mt-0.5 text-xs font-bold tracking-wide text-slate-600 uppercase"
                        >
                            DARBC HRIS — Human Resources Department
                        </p>
                        <h2
                            class="mt-3 border-y-2 border-slate-800 py-2 text-lg font-black tracking-wide uppercase"
                        >
                            Daily Time Record
                        </h2>
                        <p class="mt-2 text-xs text-slate-500">
                            For the month of {{ dtrMonthLabel }}
                        </p>
                    </div>

                    <div
                        class="mt-5 grid gap-x-10 gap-y-2 border border-slate-300 p-4 text-sm sm:grid-cols-2"
                    >
                        <p>
                            <span class="font-semibold">EMPLOYEE'S NAME:</span>
                            <span
                                class="ml-2 font-medium underline underline-offset-4"
                            >
                                {{ dtrEmployee.name }}
                            </span>
                        </p>
                        <p>
                            <span class="font-semibold">POSITION:</span>
                            <span
                                class="ml-2 font-medium underline underline-offset-4"
                            >
                                {{ dtrEmployee.position }}
                            </span>
                        </p>
                        <p>
                            <span class="font-semibold">DEPARTMENT:</span>
                            <span
                                class="ml-2 font-medium underline underline-offset-4"
                            >
                                {{ dtrEmployee.department }}
                            </span>
                        </p>
                        <p>
                            <span class="font-semibold">EMPLOYEE NO.:</span>
                            <span
                                class="ml-2 font-medium underline underline-offset-4"
                            >
                                {{ dtrEmployee.no }}
                            </span>
                        </p>
                    </div>

                    <table class="mt-5 w-full border-collapse text-[13px]">
                        <thead>
                            <tr class="bg-slate-100">
                                <th
                                    class="border border-slate-400 px-2 py-1.5 text-left text-[11px] font-bold tracking-wide uppercase"
                                >
                                    Day
                                </th>
                                <th
                                    class="border border-slate-400 px-2 py-1.5 text-center text-[11px] font-bold tracking-wide uppercase"
                                >
                                    A.M. In
                                </th>
                                <th
                                    class="border border-slate-400 px-2 py-1.5 text-center text-[11px] font-bold tracking-wide uppercase"
                                >
                                    A.M. Out
                                </th>
                                <th
                                    class="border border-slate-400 px-2 py-1.5 text-center text-[11px] font-bold tracking-wide uppercase"
                                >
                                    P.M. In
                                </th>
                                <th
                                    class="border border-slate-400 px-2 py-1.5 text-center text-[11px] font-bold tracking-wide uppercase"
                                >
                                    P.M. Out
                                </th>
                                <th
                                    class="border border-slate-400 px-2 py-1.5 text-center text-[11px] font-bold tracking-wide uppercase"
                                >
                                    Total
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="day in dtrDaysFor"
                                :key="day.day"
                                class="tabular-nums"
                                :class="
                                    day.late
                                        ? 'bg-red-50/60'
                                        : day.holiday
                                          ? 'bg-amber-50/70'
                                          : ''
                                "
                            >
                                <td class="border border-slate-300 px-2 py-1">
                                    <span class="font-medium">
                                        {{ day.day }}
                                    </span>
                                    <span
                                        class="ml-1 text-[10px] text-slate-500"
                                    >
                                        {{ day.weekday }}
                                    </span>
                                </td>
                                <template v-if="day.rest">
                                    <td
                                        colspan="5"
                                        class="border border-slate-300 px-2 py-1 text-center text-[11px] text-slate-400 italic"
                                    >
                                        REST DAY
                                    </td>
                                </template>
                                <template v-else-if="day.holiday">
                                    <td
                                        colspan="5"
                                        class="border border-slate-300 px-2 py-1 text-center text-[11px] font-semibold text-amber-700"
                                    >
                                        HOLIDAY — {{ day.holiday.reason }} ·
                                        {{ day.holiday.pay }}
                                    </td>
                                </template>
                                <template v-else-if="!day.amIn">
                                    <td
                                        colspan="5"
                                        class="border border-slate-300 px-2 py-1 text-center text-[11px] text-slate-400 italic"
                                    >
                                        ABSENT
                                    </td>
                                </template>
                                <template v-else>
                                    <td
                                        class="border border-slate-300 px-2 py-1 text-center"
                                        :class="
                                            day.late
                                                ? 'font-semibold text-red-600'
                                                : ''
                                        "
                                    >
                                        {{ day.amIn }}
                                    </td>
                                    <td
                                        class="border border-slate-300 px-2 py-1 text-center"
                                    >
                                        {{ day.amOut }}
                                    </td>
                                    <td
                                        class="border border-slate-300 px-2 py-1 text-center"
                                    >
                                        {{ day.pmIn }}
                                    </td>
                                    <td
                                        class="border border-slate-300 px-2 py-1 text-center"
                                    >
                                        {{ day.pmOut }}
                                    </td>
                                    <td
                                        class="border border-slate-300 px-2 py-1 text-center font-medium"
                                    >
                                        {{ day.total?.toFixed(2) }}
                                    </td>
                                </template>
                            </tr>
                            <tr class="bg-slate-100 font-bold">
                                <td
                                    colspan="5"
                                    class="border border-slate-400 px-2 py-1.5 text-right text-[11px] tracking-wide uppercase"
                                >
                                    Total hours this month
                                </td>
                                <td
                                    class="border border-slate-400 px-2 py-1.5 text-center"
                                >
                                    {{ dtrTotals.toFixed(2) }}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div class="mt-8 grid grid-cols-2 gap-x-12 gap-y-6 text-sm">
                        <div>
                            <p class="text-xs text-slate-500">
                                Certified true and correct:
                            </p>
                            <div
                                class="mt-8 border-t border-slate-400 pt-2 text-xs font-semibold text-slate-600"
                            >
                                Employee's Signature
                            </div>
                        </div>
                        <div>
                            <p class="text-xs text-slate-500">Approved:</p>
                            <div
                                class="mt-8 border-t border-slate-400 pt-2 text-xs font-semibold text-slate-600"
                            >
                                Department Head
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<style>
/* Print only the DTR sheet; hide the rest of the app. */
@media print {
    body * {
        visibility: hidden;
    }

    #dtr-overlay {
        position: static !important;
        inset: auto !important;
        z-index: auto !important;
        overflow: visible !important;
        background: transparent !important;
        backdrop-filter: none !important;
    }

    #dtr-sheet,
    #dtr-sheet * {
        visibility: visible;
    }

    #dtr-sheet {
        position: static !important;
        max-width: none !important;
        box-shadow: none !important;
        margin: 0 auto !important;
        border-radius: 0 !important;
    }
}
</style>
