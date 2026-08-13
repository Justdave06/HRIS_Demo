<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { FileBarChart2, FileSpreadsheet, Search, Timer } from '@lucide/vue';
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
import { useDemoDtr } from '@/composables/useDemoDtr';

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

const { rangeStats } = useDemoDtr();

/* ------------------------------------------------------------------ */
/* Filters                                                             */
/* ------------------------------------------------------------------ */

const reportTypes = [
    { value: 'tardiness', label: 'Tardiness Report' },
    { value: 'overtime', label: 'Overtime Report' },
] as const;

type ReportType = (typeof reportTypes)[number]['value'];

const reportType = ref<ReportType>('tardiness');
const startDate = ref('');
const endDate = ref('');
const search = ref('');

onMounted(() => {
    const now = new Date();
    const first = new Date(now.getFullYear(), now.getMonth(), 1);

    startDate.value = first.toISOString().slice(0, 10);
    endDate.value = now.toISOString().slice(0, 10);
});

const rows = computed(() => {
    const term = search.value.trim().toLowerCase();

    return props.attendance
        .filter(
            (row) =>
                term === '' ||
                row.name.toLowerCase().includes(term) ||
                row.no.toLowerCase().includes(term) ||
                row.department.toLowerCase().includes(term),
        )
        .map((row) => {
            const stats = rangeStats(
                row.employee_id,
                startDate.value,
                endDate.value,
            );

            return {
                no: row.no,
                name: row.name,
                position: row.position,
                department: row.department,
                lateDays: stats.lateDays,
                lateMinutes: stats.lateMinutes,
                otDays: stats.otDays,
                otHours: stats.otHours,
            };
        })
        .sort((a, b) =>
            reportType.value === 'tardiness'
                ? b.lateMinutes - a.lateMinutes
                : b.otHours - a.otHours,
        );
});

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

/* ------------------------------------------------------------------ */
/* Generate / export                                                   */
/* ------------------------------------------------------------------ */

const showPreview = ref(false);

const documentColumns = computed(() =>
    reportType.value === 'tardiness'
        ? [
              { key: 'no', label: 'Emp. ID' },
              { key: 'name', label: 'Employee' },
              { key: 'position', label: 'Position' },
              { key: 'department', label: 'Department' },
              { key: 'lateDays', label: 'Late Days', numeric: true },
              { key: 'lateMinutes', label: 'Late Mins.', numeric: true },
          ]
        : [
              { key: 'no', label: 'Emp. ID' },
              { key: 'name', label: 'Employee' },
              { key: 'position', label: 'Position' },
              { key: 'department', label: 'Department' },
              { key: 'otDays', label: 'OT Days', numeric: true },
              { key: 'otHours', label: 'OT Hours', numeric: true },
          ],
);

const documentRows = computed<Record<string, string | number>[]>(() =>
    rows.value.map((row): Record<string, string | number> =>
        reportType.value === 'tardiness'
            ? {
                  no: row.no,
                  name: row.name,
                  position: row.position,
                  department: row.department,
                  lateDays: row.lateDays,
                  lateMinutes: row.lateMinutes,
              }
            : {
                  no: row.no,
                  name: row.name,
                  position: row.position,
                  department: row.department,
                  otDays: row.otDays,
                  otHours: row.otHours,
              },
    ),
);

const documentTitle = computed(
    () =>
        reportTypes.find((type) => type.value === reportType.value)?.label ??
        'Attendance Report',
);

function generate(): void {
    if (!startDate.value || !endDate.value) {
        toast.error('Pick a start and end date first');

        return;
    }

    showPreview.value = true;
}

function exportExcel(): void {
    const headers =
        reportType.value === 'tardiness'
            ? [
                  'Emp. ID',
                  'Employee',
                  'Position',
                  'Department',
                  'Late Days',
                  'Late Minutes',
              ]
            : [
                  'Emp. ID',
                  'Employee',
                  'Position',
                  'Department',
                  'OT Days',
                  'OT Hours',
              ];
    const payload =
        reportType.value === 'tardiness'
            ? rows.value.map((row) => [
                  row.no,
                  row.name,
                  row.position,
                  row.department,
                  row.lateDays,
                  row.lateMinutes,
              ])
            : rows.value.map((row) => [
                  row.no,
                  row.name,
                  row.position,
                  row.department,
                  row.otDays,
                  row.otHours,
              ]);
    const csv =
        '\uFEFF' +
        [headers, ...payload]
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
    link.download = 'attendance-report.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
}
</script>

<template>
    <Head title="Reports — Time & Attendance" />

    <div class="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <!-- Header -->
        <div
            class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
            <h1 class="text-2xl font-bold tracking-tight text-slate-900">
                Reports
            </h1>
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

        <!-- Filters -->
        <div
            class="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
        >
            <Select v-model="reportType">
                <SelectTrigger class="w-56">
                    <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem
                        v-for="type in reportTypes"
                        :key="type.value"
                        :value="type.value"
                    >
                        {{ type.label }}
                    </SelectItem>
                </SelectContent>
            </Select>

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

        <!-- Report table -->
        <div class="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div class="flex items-center justify-between border-b px-5 py-4">
                <h2
                    class="flex items-center gap-2 font-semibold text-slate-900"
                >
                    <Timer
                        class="size-4 text-blue-600"
                        :class="
                            reportType === 'overtime' ? 'text-amber-600' : ''
                        "
                    />
                    {{
                        reportType === 'tardiness'
                            ? 'Tardiness report'
                            : 'Overtime report'
                    }}
                </h2>
                <span
                    class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                >
                    {{ rows.length }} employees · {{ periodLabel() }}
                </span>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full min-w-[800px] text-sm">
                    <thead>
                        <tr
                            class="border-b text-left text-xs tracking-wide text-muted-foreground uppercase"
                        >
                            <th class="px-4 py-3 font-medium">No.</th>
                            <th class="px-4 py-3 font-medium">Employee</th>
                            <th class="px-4 py-3 font-medium">Position</th>
                            <th class="px-4 py-3 font-medium">Department</th>
                            <template v-if="reportType === 'tardiness'">
                                <th class="px-4 py-3 font-medium">Late days</th>
                                <th class="px-4 py-3 font-medium">
                                    Total minutes late
                                </th>
                            </template>
                            <template v-else>
                                <th class="px-4 py-3 font-medium">OT days</th>
                                <th class="px-4 py-3 font-medium">
                                    Total OT hours
                                </th>
                            </template>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(row, index) in rows"
                            :key="row.no"
                            class="border-b transition-colors last:border-0 hover:bg-muted/40"
                        >
                            <td
                                class="px-4 py-3 text-muted-foreground tabular-nums"
                            >
                                {{ index + 1 }}
                            </td>
                            <td class="px-4 py-3 font-medium text-slate-900">
                                {{ row.name }}
                            </td>
                            <td class="px-4 py-3 text-muted-foreground">
                                {{ row.position }}
                            </td>
                            <td class="px-4 py-3 text-muted-foreground">
                                {{ row.department }}
                            </td>
                            <template v-if="reportType === 'tardiness'">
                                <td class="px-4 py-3 tabular-nums">
                                    {{ row.lateDays }}
                                </td>
                                <td class="px-4 py-3 tabular-nums">
                                    <span
                                        v-if="row.lateMinutes > 0"
                                        class="font-semibold text-red-600"
                                    >
                                        {{ row.lateMinutes }} min
                                    </span>
                                    <span v-else class="text-muted-foreground">
                                        —
                                    </span>
                                </td>
                            </template>
                            <template v-else>
                                <td class="px-4 py-3 tabular-nums">
                                    {{ row.otDays }}
                                </td>
                                <td class="px-4 py-3 tabular-nums">
                                    <span
                                        v-if="row.otHours > 0"
                                        class="font-semibold text-emerald-600"
                                    >
                                        {{ row.otHours }} hrs
                                    </span>
                                    <span v-else class="text-muted-foreground">
                                        —
                                    </span>
                                </td>
                            </template>
                        </tr>
                        <tr v-if="rows.length === 0">
                            <td
                                colspan="6"
                                class="px-4 py-10 text-center text-sm text-muted-foreground"
                            >
                                No records match the selected filters.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Official report preview -->
    <RecordPrintModal
        v-if="showPreview"
        :heading="`${documentTitle} — ${rows.length} employees`"
        subtitle="Official attendance document · ready to print"
        @close="showPreview = false"
    >
        <AttendanceReportDocument
            :title="documentTitle"
            :period="periodLabel()"
            :columns="documentColumns"
            :rows="documentRows"
            :note="
                reportType === 'tardiness'
                    ? 'Late arrivals are counted against the 8:30 AM cut-off.'
                    : 'Overtime hours are counted beyond the standard 8-hour shift.'
            "
        />
    </RecordPrintModal>
</template>
