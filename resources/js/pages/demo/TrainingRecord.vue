<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import {
    ArrowLeft,
    ArrowUpRight,
    Award,
    BookOpen,
    FileBarChart2,
    FileSpreadsheet,
    GraduationCap,
} from '@lucide/vue';
import { computed, ref } from 'vue';
import AttendanceReportDocument from '@/components/demo/AttendanceReportDocument.vue';
import RecordPrintModal from '@/components/demo/RecordPrintModal.vue';
import { Button } from '@/components/ui/button';
import { useDemoTraining } from '@/composables/useDemoTraining';
import type { TrainingEmployee } from '@/composables/useDemoTraining';
import type { DemoTrainingCourse, DemoTrainingEnrollment } from '@/types';

const props = defineProps<{
    employee: {
        id: number;
        no: string;
        name: string;
        department: string;
        position: string;
    };
    employees: TrainingEmployee[];
    courses: DemoTrainingCourse[];
    enrollments: DemoTrainingEnrollment[];
}>();

const { rows } = useDemoTraining(
    props.employees,
    props.courses,
    props.enrollments,
);

/* ------------------------------------------------------------------ */
/* This employee's training history                                   */
/* ------------------------------------------------------------------ */

const history = computed(() =>
    rows.value
        .filter((row) => row.employee_id === props.employee.id)
        .sort((a, b) => (a.start < b.start ? -1 : 1)),
);

const completed = computed(() =>
    history.value.filter((row) => row.status === 'Completed'),
);

const averageScore = computed(() => {
    if (completed.value.length === 0) {
        return '—';
    }

    const total = completed.value.reduce(
        (sum, row) => sum + (row.score ?? 0),
        0,
    );

    return `${Math.round(total / completed.value.length)}`;
});

const statusTone: Record<string, string> = {
    Enrolled: 'bg-blue-50 text-blue-700 border-blue-200',
    'In Progress': 'bg-amber-50 text-amber-700 border-amber-200',
    Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

/* ------------------------------------------------------------------ */
/* Generate / export                                                   */
/* ------------------------------------------------------------------ */

const showPreview = ref(false);

const reportRows = computed(() =>
    history.value.map((row, index) => ({
        no: index + 1,
        course: row.title,
        code: row.course_code,
        category: row.category,
        schedule: `${row.start} → ${row.end}`,
        status: row.status,
        score: row.score ?? '—',
        certificate: row.certificate_no ?? '—',
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
        'Course',
        'Code',
        'Category',
        'Schedule',
        'Status',
        'Score',
        'Certificate',
    ];
    const rowsCsv = reportRows.value.map((row) => [
        row.no,
        row.course,
        row.code,
        row.category,
        row.schedule,
        row.status,
        row.score,
        row.certificate,
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
    link.download = `${props.employee.name.replaceAll(' ', '-').toLowerCase()}-training-history.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
}
</script>

<template>
    <Head :title="`${employee.name} — Training History`" />

    <div class="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <!-- Header -->
        <div
            class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
            <div>
                <Link
                    href="/demo/training/enrollments"
                    class="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-blue-600"
                >
                    <ArrowLeft class="size-3.5" />
                    Back to Courses & Enrollment
                </Link>
                <h1
                    class="mt-2 text-2xl font-bold tracking-tight text-slate-900"
                >
                    {{ employee.name }}
                </h1>
                <p class="mt-1 text-sm text-slate-500">
                    {{ employee.no }} · {{ employee.position }} ·
                    {{ employee.department }}
                </p>
                <p class="mt-0.5 text-xs text-slate-400">
                    Training history · Q3 2026 calendar
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
                        Enrollments
                    </p>
                    <span class="rounded-lg bg-blue-50 p-2 text-blue-700">
                        <BookOpen class="size-4" />
                    </span>
                </div>
                <p class="mt-2 text-3xl font-bold text-slate-900 tabular-nums">
                    {{ history.length }}
                </p>
                <p class="mt-1 text-xs text-slate-500">Courses this quarter</p>
            </div>

            <div
                class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
                <div class="flex items-center justify-between">
                    <p
                        class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                    >
                        Completed
                    </p>
                    <span class="rounded-lg bg-emerald-50 p-2 text-emerald-700">
                        <GraduationCap class="size-4" />
                    </span>
                </div>
                <p class="mt-2 text-3xl font-bold text-slate-900 tabular-nums">
                    {{ completed.length }}
                </p>
                <p class="mt-1 text-xs text-slate-500">With passing scores</p>
            </div>

            <div
                class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
                <div class="flex items-center justify-between">
                    <p
                        class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                    >
                        Average score
                    </p>
                    <span class="rounded-lg bg-indigo-50 p-2 text-indigo-700">
                        <FileBarChart2 class="size-4" />
                    </span>
                </div>
                <p class="mt-2 text-3xl font-bold text-slate-900 tabular-nums">
                    {{ averageScore }}
                </p>
                <p class="mt-1 text-xs text-slate-500">
                    Across completed courses
                </p>
            </div>

            <div
                class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
                <div class="flex items-center justify-between">
                    <p
                        class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                    >
                        Certificates
                    </p>
                    <span class="rounded-lg bg-amber-50 p-2 text-amber-700">
                        <Award class="size-4" />
                    </span>
                </div>
                <p class="mt-2 text-3xl font-bold text-slate-900 tabular-nums">
                    {{ completed.length }}
                </p>
                <p class="mt-1 text-xs text-slate-500">
                    Issued certificate numbers
                </p>
            </div>
        </div>

        <!-- Training history table -->
        <div class="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div class="flex items-center justify-between border-b px-5 py-4">
                <h2 class="font-semibold text-slate-900">Training history</h2>
                <span
                    class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                >
                    {{ history.length }} enrollment{{
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
                            v-for="(row, index) in history"
                            :key="row.id"
                            class="border-b transition-colors last:border-0 hover:bg-muted/40"
                        >
                            <td
                                class="px-4 py-3 text-muted-foreground tabular-nums"
                            >
                                {{ index + 1 }}
                            </td>
                            <td class="px-4 py-3">
                                <p class="text-slate-700">{{ row.title }}</p>
                                <p class="text-xs text-muted-foreground">
                                    {{ row.course_code }}
                                </p>
                            </td>
                            <td class="px-4 py-3">
                                <span
                                    class="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600"
                                >
                                    {{ row.category }}
                                </span>
                            </td>
                            <td
                                class="px-4 py-3 text-muted-foreground tabular-nums"
                            >
                                {{ row.start }} → {{ row.end }}
                            </td>
                            <td class="px-4 py-3">
                                <span
                                    class="inline-flex rounded-full border px-2 py-0.5 text-xs font-medium"
                                    :class="statusTone[row.status]"
                                >
                                    {{ row.status }}
                                </span>
                            </td>
                            <td class="px-4 py-3 text-right tabular-nums">
                                <span
                                    v-if="row.score !== null"
                                    class="font-semibold"
                                    :class="
                                        row.score >= 75
                                            ? 'text-emerald-600'
                                            : 'text-amber-600'
                                    "
                                >
                                    {{ row.score }}
                                </span>
                                <span v-else class="text-muted-foreground">
                                    —
                                </span>
                            </td>
                            <td class="px-4 py-3">
                                <span
                                    v-if="row.certificate_no"
                                    class="text-xs font-medium text-emerald-700 tabular-nums"
                                >
                                    {{ row.certificate_no }}
                                </span>
                                <span v-else class="text-muted-foreground">
                                    —
                                </span>
                            </td>
                        </tr>
                        <tr v-if="history.length === 0">
                            <td
                                colspan="7"
                                class="px-4 py-10 text-center text-sm text-muted-foreground"
                            >
                                No training on file for this employee yet.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Quick link back -->
        <Link
            href="/demo/training/enrollments"
            class="group flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50/60 p-5 transition-colors duration-200 hover:border-blue-300 hover:bg-blue-50"
        >
            <div class="flex items-center gap-3">
                <span class="rounded-lg bg-blue-600 p-2.5 text-white shadow-sm">
                    <ArrowLeft class="size-5" />
                </span>
                <div>
                    <p class="text-sm font-semibold text-slate-900">
                        Back to Courses & Enrollment
                    </p>
                    <p class="text-xs text-slate-500">
                        Enroll more employees or run the training reports.
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
        :heading="`Training History — ${employee.name}`"
        subtitle="Official training document · ready to print"
        @close="showPreview = false"
    >
        <AttendanceReportDocument
            title="Employee Training History"
            :period="`As of ${printedOn}`"
            system="Training & Development System"
            :columns="[
                { key: 'no', label: 'No.' },
                { key: 'course', label: 'Course' },
                { key: 'code', label: 'Code' },
                { key: 'category', label: 'Category' },
                { key: 'schedule', label: 'Schedule' },
                { key: 'status', label: 'Status' },
                { key: 'score', label: 'Score' },
                { key: 'certificate', label: 'Certificate' },
            ]"
            :rows="reportRows"
            :note="`${employee.name} — ${employee.position}, ${employee.department}. Completed courses issue a certificate number recorded on the employee record; scores are out of 100.`"
        />
    </RecordPrintModal>
</template>
