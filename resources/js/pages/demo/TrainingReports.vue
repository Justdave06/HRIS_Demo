<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { FileBarChart2, FileSpreadsheet, Search } from '@lucide/vue';
import { computed, ref, watch } from 'vue';
import AttendanceReportDocument from '@/components/demo/AttendanceReportDocument.vue';
import PaginationBar from '@/components/demo/PaginationBar.vue';
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
import { useDemoEmployees } from '@/composables/useDemoEmployees';
import { useDemoTraining } from '@/composables/useDemoTraining';
import type { TrainingEmployee } from '@/composables/useDemoTraining';
import type { DemoTrainingCourse, DemoTrainingEnrollment } from '@/types';

const props = defineProps<{
    employees: TrainingEmployee[];
    courses: DemoTrainingCourse[];
    enrollments: DemoTrainingEnrollment[];
}>();

// Employees added in Employee Management can be enrolled too.
const { addedEmployees } = useDemoEmployees();

const allEmployees = computed<TrainingEmployee[]>(() => [
    ...props.employees,
    ...addedEmployees.value.map((employee) => ({
        id: employee.id,
        no: employee.no,
        name: employee.name,
        department: employee.department,
        position: employee.position,
    })),
]);

const { rows, courseRows } = useDemoTraining(
    allEmployees.value,
    props.courses,
    props.enrollments,
);

/* ------------------------------------------------------------------ */
/* Report type + filters                                               */
/* ------------------------------------------------------------------ */

const reportTypes = [
    { value: 'enrollments', label: 'Enrollment Report' },
    { value: 'completion', label: 'Completion & Scores Report' },
    { value: 'certificates', label: 'Certificate Register' },
    { value: 'summary', label: 'Course Summary Report' },
] as const;

type ReportType = (typeof reportTypes)[number]['value'];

const reportType = ref<ReportType>('enrollments');
const search = ref('');

const term = computed(() => search.value.trim().toLowerCase());

const match = (name: string): boolean =>
    term.value === '' || name.toLowerCase().includes(term.value);

const statusTone: Record<string, string> = {
    Enrolled: 'bg-blue-50 text-blue-700 border-blue-200',
    'In Progress': 'bg-amber-50 text-amber-700 border-amber-200',
    Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const enrollmentRows = computed(() =>
    rows.value
        .filter((row) => match(row.name) || match(row.title))
        .map((row, index) => ({
            no: index + 1,
            name: row.name,
            department: row.department,
            course: row.title,
            category: row.category,
            schedule: `${row.start} → ${row.end}`,
            status: row.status,
            score: row.score ?? '—',
            certificate: row.certificate_no ?? '—',
        })),
);

const completionRows = computed(() =>
    rows.value
        .filter(
            (row) =>
                row.status === 'Completed' &&
                (match(row.name) || match(row.title)),
        )
        .map((row, index) => ({
            no: index + 1,
            name: row.name,
            department: row.department,
            course: row.title,
            score: row.score ?? 0,
            completed_on: row.completed_on ?? row.end,
            certificate: row.certificate_no ?? '—',
        })),
);

const certificateRows = computed(() =>
    rows.value
        .filter(
            (row) =>
                row.status === 'Completed' &&
                row.certificate_no &&
                (match(row.name) || match(row.title)),
        )
        .map((row, index) => ({
            no: index + 1,
            certificate: row.certificate_no ?? '',
            name: row.name,
            department: row.department,
            course: row.title,
            completed_on: row.completed_on ?? row.end,
        })),
);

const summaryRows = computed(() =>
    courseRows.value
        .filter((course) => match(course.title) || match(course.code))
        .map((course, index) => ({
            no: index + 1,
            course: course.title,
            code: course.code,
            category: course.category,
            schedule: `${course.start} → ${course.end}`,
            enrolled: course.enrolled,
            completed: course.completed,
            rate: course.completion_rate,
        })),
);

/* ------------------------------------------------------------------ */
/* Pagination                                                          */
/* ------------------------------------------------------------------ */

const PAGE_SIZE = 10;
const reportPage = ref(1);

function paged<T>(rows: T[]): T[] {
    const start = (reportPage.value - 1) * PAGE_SIZE;

    return rows.slice(start, start + PAGE_SIZE);
}

watch([reportType, search], () => {
    reportPage.value = 1;
});

/* ------------------------------------------------------------------ */
/* Generate / export                                                   */
/* ------------------------------------------------------------------ */

const showPreview = ref(false);

const documentColumns = computed<
    { key: string; label: string; numeric?: boolean }[]
>(() => {
    if (reportType.value === 'enrollments') {
        return [
            { key: 'no', label: 'No.' },
            { key: 'name', label: 'Employee' },
            { key: 'department', label: 'Department' },
            { key: 'course', label: 'Course' },
            { key: 'category', label: 'Category' },
            { key: 'schedule', label: 'Schedule' },
            { key: 'status', label: 'Status' },
            { key: 'score', label: 'Score' },
            { key: 'certificate', label: 'Certificate' },
        ];
    }

    if (reportType.value === 'completion') {
        return [
            { key: 'no', label: 'No.' },
            { key: 'name', label: 'Employee' },
            { key: 'department', label: 'Department' },
            { key: 'course', label: 'Course' },
            { key: 'score', label: 'Score', numeric: true },
            { key: 'completed_on', label: 'Completed' },
            { key: 'certificate', label: 'Certificate' },
        ];
    }

    if (reportType.value === 'certificates') {
        return [
            { key: 'no', label: 'No.' },
            { key: 'certificate', label: 'Cert. No.' },
            { key: 'name', label: 'Employee' },
            { key: 'department', label: 'Department' },
            { key: 'course', label: 'Course' },
            { key: 'completed_on', label: 'Completed' },
        ];
    }

    return [
        { key: 'no', label: 'No.' },
        { key: 'course', label: 'Course' },
        { key: 'code', label: 'Code' },
        { key: 'category', label: 'Category' },
        { key: 'schedule', label: 'Schedule' },
        { key: 'enrolled', label: 'Enrolled', numeric: true },
        { key: 'completed', label: 'Completed', numeric: true },
        { key: 'rate', label: 'Rate %', numeric: true },
    ];
});

const documentRows = computed<Record<string, string | number>[]>(() => {
    if (reportType.value === 'enrollments') {
        return enrollmentRows.value;
    }

    if (reportType.value === 'completion') {
        return completionRows.value;
    }

    if (reportType.value === 'certificates') {
        return certificateRows.value;
    }

    return summaryRows.value;
});

const documentTitle = computed(
    () =>
        reportTypes.find((type) => type.value === reportType.value)?.label ??
        'Training Report',
);

const documentNote = computed(() => {
    if (reportType.value === 'completion') {
        return 'Scores are out of 100; courses completed with a score of 75 or higher are considered passing.';
    }

    if (reportType.value === 'certificates') {
        return "Certificate numbers are issued in order of completion and recorded on each employee's training history.";
    }

    if (reportType.value === 'summary') {
        return 'Completion rate is the share of enrolled employees who completed the course.';
    }

    return 'Enrollment status follows the course calendar: finished courses are Completed, the current course is In Progress, upcoming courses are Enrolled.';
});

function generate(): void {
    showPreview.value = true;
}

function exportExcel(): void {
    const headers = documentColumns.value.map((column) => column.label);
    const payload = documentRows.value.map((row) =>
        documentColumns.value.map((column) => row[column.key] ?? ''),
    );
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
    link.download = `training-${reportType.value}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
}
</script>

<template>
    <Head title="Reports — Training & Development" />

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
            class="flex flex-wrap gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
        >
            <Select v-model="reportType">
                <SelectTrigger class="w-64">
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

            <div class="relative w-64">
                <Search
                    class="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                    v-model="search"
                    placeholder="Search employee or course…"
                    class="pl-9"
                />
            </div>
        </div>

        <!-- ================= ENROLLMENTS ================= -->
        <div
            v-if="reportType === 'enrollments'"
            class="rounded-xl border border-slate-200 bg-white shadow-sm"
        >
            <div class="flex items-center justify-between border-b px-5 py-4">
                <h2 class="font-semibold text-slate-900">Enrollment report</h2>
                <span
                    class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                >
                    {{ enrollmentRows.length }} enrollments
                </span>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full min-w-[1000px] text-sm">
                    <thead>
                        <tr
                            class="border-b text-left text-xs tracking-wide text-muted-foreground uppercase"
                        >
                            <th class="px-4 py-3 font-medium">No.</th>
                            <th class="px-4 py-3 font-medium">Employee</th>
                            <th class="px-4 py-3 font-medium">Department</th>
                            <th class="px-4 py-3 font-medium">Course</th>
                            <th class="px-4 py-3 font-medium">Category</th>
                            <th class="px-4 py-3 font-medium">Schedule</th>
                            <th class="px-4 py-3 font-medium">Status</th>
                            <th class="px-4 py-3 text-right font-medium">
                                Score
                            </th>
                            <th class="px-4 py-3 font-medium">Certificate</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="row in paged(enrollmentRows)"
                            :key="row.no"
                            class="border-b transition-colors last:border-0 hover:bg-muted/40"
                        >
                            <td
                                class="px-4 py-3 text-muted-foreground tabular-nums"
                            >
                                {{ row.no }}
                            </td>
                            <td class="px-4 py-3 font-medium text-slate-900">
                                {{ row.name }}
                            </td>
                            <td class="px-4 py-3 text-muted-foreground">
                                {{ row.department }}
                            </td>
                            <td class="px-4 py-3 text-slate-700">
                                {{ row.course }}
                            </td>
                            <td class="px-4 py-3 text-muted-foreground">
                                {{ row.category }}
                            </td>
                            <td
                                class="px-4 py-3 text-muted-foreground tabular-nums"
                            >
                                {{ row.schedule }}
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
                                class="px-4 py-3 text-right text-muted-foreground tabular-nums"
                            >
                                {{ row.score }}
                            </td>
                            <td
                                class="px-4 py-3 text-muted-foreground tabular-nums"
                            >
                                {{ row.certificate }}
                            </td>
                        </tr>
                        <tr v-if="enrollmentRows.length === 0">
                            <td
                                colspan="9"
                                class="px-4 py-10 text-center text-sm text-muted-foreground"
                            >
                                No enrollments match the selected filters.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <PaginationBar
                :total="enrollmentRows.length"
                :page-size="PAGE_SIZE"
                v-model:page="reportPage"
            />
        </div>

        <!-- ================= COMPLETION & SCORES ================= -->
        <div
            v-else-if="reportType === 'completion'"
            class="rounded-xl border border-slate-200 bg-white shadow-sm"
        >
            <div class="flex items-center justify-between border-b px-5 py-4">
                <h2 class="font-semibold text-slate-900">
                    Completion & scores report
                </h2>
                <span
                    class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                >
                    {{ completionRows.length }} completed
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
                            <th class="px-4 py-3 font-medium">Department</th>
                            <th class="px-4 py-3 font-medium">Course</th>
                            <th class="px-4 py-3 text-right font-medium">
                                Score
                            </th>
                            <th class="px-4 py-3 font-medium">Completed on</th>
                            <th class="px-4 py-3 font-medium">Certificate</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="row in paged(completionRows)"
                            :key="row.no"
                            class="border-b transition-colors last:border-0 hover:bg-muted/40"
                        >
                            <td
                                class="px-4 py-3 text-muted-foreground tabular-nums"
                            >
                                {{ row.no }}
                            </td>
                            <td class="px-4 py-3 font-medium text-slate-900">
                                {{ row.name }}
                            </td>
                            <td class="px-4 py-3 text-muted-foreground">
                                {{ row.department }}
                            </td>
                            <td class="px-4 py-3 text-slate-700">
                                {{ row.course }}
                            </td>
                            <td class="px-4 py-3 text-right tabular-nums">
                                <span
                                    class="font-semibold"
                                    :class="
                                        row.score >= 75
                                            ? 'text-emerald-600'
                                            : 'text-amber-600'
                                    "
                                >
                                    {{ row.score }}
                                </span>
                            </td>
                            <td
                                class="px-4 py-3 text-muted-foreground tabular-nums"
                            >
                                {{ row.completed_on }}
                            </td>
                            <td
                                class="px-4 py-3 text-xs font-medium text-emerald-700 tabular-nums"
                            >
                                {{ row.certificate }}
                            </td>
                        </tr>
                        <tr v-if="completionRows.length === 0">
                            <td
                                colspan="7"
                                class="px-4 py-10 text-center text-sm text-muted-foreground"
                            >
                                No completed courses for the selected filters.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <PaginationBar
                :total="completionRows.length"
                :page-size="PAGE_SIZE"
                v-model:page="reportPage"
            />
        </div>

        <!-- ================= CERTIFICATE REGISTER ================= -->
        <div
            v-else-if="reportType === 'certificates'"
            class="rounded-xl border border-slate-200 bg-white shadow-sm"
        >
            <div class="flex items-center justify-between border-b px-5 py-4">
                <h2 class="font-semibold text-slate-900">
                    Certificate register
                </h2>
                <span
                    class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                >
                    {{ certificateRows.length }} certificates
                </span>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full min-w-[800px] text-sm">
                    <thead>
                        <tr
                            class="border-b text-left text-xs tracking-wide text-muted-foreground uppercase"
                        >
                            <th class="px-4 py-3 font-medium">No.</th>
                            <th class="px-4 py-3 font-medium">
                                Certificate no.
                            </th>
                            <th class="px-4 py-3 font-medium">Employee</th>
                            <th class="px-4 py-3 font-medium">Department</th>
                            <th class="px-4 py-3 font-medium">Course</th>
                            <th class="px-4 py-3 font-medium">Completed on</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="row in paged(certificateRows)"
                            :key="row.no"
                            class="border-b transition-colors last:border-0 hover:bg-muted/40"
                        >
                            <td
                                class="px-4 py-3 text-muted-foreground tabular-nums"
                            >
                                {{ row.no }}
                            </td>
                            <td
                                class="px-4 py-3 text-xs font-medium text-emerald-700 tabular-nums"
                            >
                                {{ row.certificate }}
                            </td>
                            <td class="px-4 py-3 font-medium text-slate-900">
                                {{ row.name }}
                            </td>
                            <td class="px-4 py-3 text-muted-foreground">
                                {{ row.department }}
                            </td>
                            <td class="px-4 py-3 text-slate-700">
                                {{ row.course }}
                            </td>
                            <td
                                class="px-4 py-3 text-muted-foreground tabular-nums"
                            >
                                {{ row.completed_on }}
                            </td>
                        </tr>
                        <tr v-if="certificateRows.length === 0">
                            <td
                                colspan="6"
                                class="px-4 py-10 text-center text-sm text-muted-foreground"
                            >
                                No certificates issued for the selected filters.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <PaginationBar
                :total="certificateRows.length"
                :page-size="PAGE_SIZE"
                v-model:page="reportPage"
            />
        </div>

        <!-- ================= COURSE SUMMARY ================= -->
        <div
            v-else
            class="rounded-xl border border-slate-200 bg-white shadow-sm"
        >
            <div class="flex items-center justify-between border-b px-5 py-4">
                <h2 class="font-semibold text-slate-900">
                    Course summary report
                </h2>
                <span
                    class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                >
                    {{ summaryRows.length }} courses
                </span>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full min-w-[900px] text-sm">
                    <thead>
                        <tr
                            class="border-b text-left text-xs tracking-wide text-muted-foreground uppercase"
                        >
                            <th class="px-4 py-3 font-medium">No.</th>
                            <th class="px-4 py-3 font-medium">Course</th>
                            <th class="px-4 py-3 font-medium">Category</th>
                            <th class="px-4 py-3 font-medium">Schedule</th>
                            <th class="px-4 py-3 text-right font-medium">
                                Enrolled
                            </th>
                            <th class="px-4 py-3 text-right font-medium">
                                Completed
                            </th>
                            <th class="px-4 py-3 text-right font-medium">
                                Completion %
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="row in paged(summaryRows)"
                            :key="row.no"
                            class="border-b transition-colors last:border-0 hover:bg-muted/40"
                        >
                            <td
                                class="px-4 py-3 text-muted-foreground tabular-nums"
                            >
                                {{ row.no }}
                            </td>
                            <td class="px-4 py-3">
                                <p class="font-medium text-slate-900">
                                    {{ row.course }}
                                </p>
                                <p class="text-xs text-muted-foreground">
                                    {{ row.code }}
                                </p>
                            </td>
                            <td class="px-4 py-3 text-muted-foreground">
                                {{ row.category }}
                            </td>
                            <td
                                class="px-4 py-3 text-muted-foreground tabular-nums"
                            >
                                {{ row.schedule }}
                            </td>
                            <td
                                class="px-4 py-3 text-right text-muted-foreground tabular-nums"
                            >
                                {{ row.enrolled }}
                            </td>
                            <td
                                class="px-4 py-3 text-right text-muted-foreground tabular-nums"
                            >
                                {{ row.completed }}
                            </td>
                            <td class="px-4 py-3 text-right">
                                <span
                                    class="inline-flex rounded-full border px-2 py-0.5 text-xs font-medium"
                                    :class="
                                        row.rate >= 75
                                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                            : 'border-amber-200 bg-amber-50 text-amber-700'
                                    "
                                >
                                    {{ row.rate }}%
                                </span>
                            </td>
                        </tr>
                        <tr v-if="summaryRows.length === 0">
                            <td
                                colspan="7"
                                class="px-4 py-10 text-center text-sm text-muted-foreground"
                            >
                                No courses match the selected filters.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <PaginationBar
                :total="summaryRows.length"
                :page-size="PAGE_SIZE"
                v-model:page="reportPage"
            />
        </div>
    </div>

    <!-- Official report preview -->
    <RecordPrintModal
        v-if="showPreview"
        :heading="`${documentTitle} — ${documentRows.length} record${documentRows.length === 1 ? '' : 's'}`"
        subtitle="Official training document · ready to print"
        @close="showPreview = false"
    >
        <AttendanceReportDocument
            :title="documentTitle"
            :period="`As of ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`"
            system="Training & Development System"
            :columns="documentColumns"
            :rows="documentRows"
            :note="documentNote"
        />
    </RecordPrintModal>
</template>
