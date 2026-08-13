<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { FileBarChart2, FileSpreadsheet, Search, X } from '@lucide/vue';
import { computed, ref } from 'vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useDemoVacancies } from '@/composables/useDemoVacancies';
import type { DemoCandidate, DemoJob, DemoOnboarding } from '@/types';

const props = defineProps<{
    jobs: DemoJob[];
    candidates: DemoCandidate[];
    onboarding: DemoOnboarding[];
    departments: string[];
    positions: string[];
    stats: {
        vacant: number;
        totalApplicants: number;
        shortlisted: number;
        hiredThisMonth: number;
    };
}>();

// Session-added vacancies are merged in so they appear in reports too, and
// recruiter-set interview schedules feed the interview report.
const { addedVacancies, interviewSchedules } = useDemoVacancies();

const allJobs = computed(() => [...props.jobs, ...addedVacancies.value]);

/** Effective interview schedule: recruiter-set override wins over seeded. */
function interviewFor(candidate: DemoCandidate): string | null {
    return interviewSchedules()[candidate.id] ?? candidate.interview_on ?? null;
}

/* ------------------------------------------------------------------ */
/* Report type                                                         */
/* ------------------------------------------------------------------ */

const reportTypes = [
    {
        value: 'vacancy',
        label: 'Job Vacancy Report',
    },
    {
        value: 'applicants',
        label: 'Applicant Master List',
    },
    {
        value: 'interviews',
        label: 'Interview Schedule Report',
    },
    {
        value: 'hiring',
        label: 'Hiring Summary',
    },
    {
        value: 'onboarding',
        label: 'Onboarding Report',
    },
] as const;

type ReportType = (typeof reportTypes)[number]['value'];

const reportType = ref<ReportType>('vacancy');

const search = ref('');

const filteredJobs = computed(() => {
    const term = search.value.trim().toLowerCase();

    if (reportType.value !== 'vacancy') {
        return allJobs.value;
    }

    return allJobs.value.filter(
        (job) =>
            term === '' ||
            job.title.toLowerCase().includes(term) ||
            job.position.toLowerCase().includes(term),
    );
});

const filteredCandidates = computed(() => {
    const term = search.value.trim().toLowerCase();

    return props.candidates.filter(
        (candidate) =>
            term === '' ||
            candidate.name.toLowerCase().includes(term) ||
            candidate.job.toLowerCase().includes(term),
    );
});

const interviewCandidates = computed(() =>
    props.candidates
        .filter((candidate) => candidate.stage === 'Interview')
        .map((candidate) => ({
            ...candidate,
            interview_on: interviewFor(candidate),
        })),
);

const hiredCandidates = computed(() =>
    props.candidates.filter((candidate) => candidate.stage === 'Hired'),
);

const allCandidates = computed(() =>
    [...props.candidates].sort((a, b) => a.name.localeCompare(b.name)),
);

const stageTone: Record<DemoCandidate['stage'], string> = {
    Applied: 'bg-slate-100 text-slate-600',
    Shortlisted: 'bg-amber-50 text-amber-700',
    Interview: 'bg-blue-50 text-blue-700',
    Hired: 'bg-emerald-50 text-emerald-700',
};

const statusTone: Record<DemoJob['status'], string> = {
    Open: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'On Hold': 'bg-amber-50 text-amber-700 border-amber-200',
    Closed: 'bg-slate-100 text-slate-600 border-slate-200',
};

/* ------------------------------------------------------------------ */
/* Generate / export                                                   */
/* ------------------------------------------------------------------ */

const showPreview = ref(false);
const previewType = ref<ReportType>('vacancy');

function generate(): void {
    previewType.value = reportType.value;
    showPreview.value = true;
}

function exportExcel(): void {
    const headerMap: Record<ReportType, string[]> = {
        vacancy: [
            'No.',
            'Job Title',
            'Position',
            'Department',
            'Employment Type',
            'Salary',
            'Applicants',
            'Shortlisted',
            'Hired',
            'Status',
        ],
        applicants: [
            'No.',
            'Applicant',
            'Vacancy',
            'Stage',
            'Date Applied',
            'Phone',
            'Email',
            'Attachment',
        ],
        interviews: ['No.', 'Applicant', 'Vacancy', 'Interview Schedule'],
        hiring: ['No.', 'Applicant', 'Vacancy', 'Date Hired', 'Contact'],
        onboarding: ['No.', 'New Hire', 'Position', 'Start Date', 'Progress'],
    };

    const rowMap: Record<ReportType, unknown[][]> = {
        vacancy: filteredJobs.value.map((job, index) => [
            index + 1,
            job.title,
            job.position,
            job.department,
            job.employment_type,
            job.salary,
            job.applicants,
            job.shortlisted,
            job.hired,
            job.status,
        ]),
        applicants: filteredCandidates.value.map((candidate, index) => [
            index + 1,
            candidate.name,
            candidate.job,
            candidate.stage,
            candidate.applied_on,
            candidate.phone,
            candidate.email,
            candidate.attachment,
        ]),
        interviews: interviewCandidates.value.map((candidate, index) => [
            index + 1,
            candidate.name,
            candidate.job,
            candidate.interview_on ?? 'TBD',
        ]),
        hiring: hiredCandidates.value.map((candidate, index) => [
            index + 1,
            candidate.name,
            candidate.job,
            candidate.hired_on ?? '—',
            candidate.phone,
        ]),
        onboarding: props.onboarding.map((group, index) => [
            index + 1,
            group.name,
            group.position,
            group.start_date,
            `${group.progress}%`,
        ]),
    };

    const csv =
        '\uFEFF' +
        [headerMap[reportType.value], ...rowMap[reportType.value]]
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
    link.download = 'recruitment-report.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const printedOn = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
});

const previewTitle = computed(
    () =>
        reportTypes.find((type) => type.value === previewType.value)?.label ??
        'Report',
);
</script>

<template>
    <Head title="Reports — Recruitment & Onboarding" />

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

        <!-- Report type selector + search -->
        <div
            class="flex flex-wrap gap-3 rounded-xl border bg-white p-4 shadow-sm"
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
                    placeholder="Search name or title…"
                    class="pl-9"
                />
            </div>
        </div>

        <!-- ================= JOB VACANCY REPORT ================= -->
        <div
            v-if="reportType === 'vacancy'"
            class="rounded-xl border bg-white shadow-sm"
        >
            <div class="flex items-center justify-between border-b px-5 py-4">
                <h2 class="font-semibold text-slate-900">Job vacancy report</h2>
                <span
                    class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                >
                    {{ filteredJobs.length }} vacancy/ies
                </span>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full min-w-[1000px] text-sm">
                    <thead>
                        <tr
                            class="border-b text-left text-xs tracking-wide text-muted-foreground uppercase"
                        >
                            <th class="px-4 py-3 font-medium">No.</th>
                            <th class="px-4 py-3 font-medium">Job title</th>
                            <th class="px-4 py-3 font-medium">Position</th>
                            <th class="px-4 py-3 font-medium">Department</th>
                            <th class="px-4 py-3 font-medium">Type</th>
                            <th class="px-4 py-3 font-medium">Salary</th>
                            <th class="px-4 py-3 font-medium">Applicants</th>
                            <th class="px-4 py-3 font-medium">Shortlisted</th>
                            <th class="px-4 py-3 font-medium">Hired</th>
                            <th class="px-4 py-3 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(job, index) in filteredJobs"
                            :key="job.id"
                            class="border-b transition-colors last:border-0 hover:bg-muted/40"
                        >
                            <td
                                class="px-4 py-3 text-muted-foreground tabular-nums"
                            >
                                {{ index + 1 }}
                            </td>
                            <td class="px-4 py-3 font-medium text-slate-900">
                                {{ job.title }}
                            </td>
                            <td class="px-4 py-3 text-muted-foreground">
                                {{ job.position }}
                            </td>
                            <td class="px-4 py-3 text-muted-foreground">
                                {{ job.department }}
                            </td>
                            <td class="px-4 py-3 text-muted-foreground">
                                {{ job.employment_type }}
                            </td>
                            <td
                                class="px-4 py-3 text-muted-foreground tabular-nums"
                            >
                                {{ job.salary }}
                            </td>
                            <td class="px-4 py-3 tabular-nums">
                                {{ job.applicants }}
                            </td>
                            <td class="px-4 py-3 tabular-nums">
                                {{ job.shortlisted }}
                            </td>
                            <td class="px-4 py-3 tabular-nums">
                                {{ job.hired }}
                            </td>
                            <td class="px-4 py-3">
                                <span
                                    class="inline-flex rounded-full border px-2 py-0.5 text-xs font-medium"
                                    :class="statusTone[job.status]"
                                >
                                    {{ job.status }}
                                </span>
                            </td>
                        </tr>
                        <tr v-if="filteredJobs.length === 0">
                            <td
                                colspan="10"
                                class="px-4 py-10 text-center text-sm text-muted-foreground"
                            >
                                No vacancies match the selected filters.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- ================= APPLICANT MASTER LIST ================= -->
        <div
            v-else-if="reportType === 'applicants'"
            class="rounded-xl border bg-white shadow-sm"
        >
            <div class="flex items-center justify-between border-b px-5 py-4">
                <h2 class="font-semibold text-slate-900">
                    Applicant master list
                </h2>
                <span
                    class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                >
                    {{ allCandidates.length }} applicants
                </span>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full min-w-[900px] text-sm">
                    <thead>
                        <tr
                            class="border-b text-left text-xs tracking-wide text-muted-foreground uppercase"
                        >
                            <th class="px-4 py-3 font-medium">No.</th>
                            <th class="px-4 py-3 font-medium">Applicant</th>
                            <th class="px-4 py-3 font-medium">Vacancy</th>
                            <th class="px-4 py-3 font-medium">Stage</th>
                            <th class="px-4 py-3 font-medium">Date applied</th>
                            <th class="px-4 py-3 font-medium">Contact</th>
                            <th class="px-4 py-3 font-medium">Attachment</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(candidate, index) in allCandidates"
                            :key="candidate.id"
                            class="border-b transition-colors last:border-0 hover:bg-muted/40"
                        >
                            <td
                                class="px-4 py-3 text-muted-foreground tabular-nums"
                            >
                                {{ index + 1 }}
                            </td>
                            <td class="px-4 py-3 font-medium text-slate-900">
                                {{ candidate.name }}
                            </td>
                            <td class="px-4 py-3 text-muted-foreground">
                                {{ candidate.job }}
                            </td>
                            <td class="px-4 py-3">
                                <span
                                    class="rounded-full px-2.5 py-1 text-xs font-medium"
                                    :class="stageTone[candidate.stage]"
                                >
                                    {{ candidate.stage }}
                                </span>
                            </td>
                            <td
                                class="px-4 py-3 text-muted-foreground tabular-nums"
                            >
                                {{ candidate.applied_on }}
                            </td>
                            <td class="px-4 py-3 text-muted-foreground">
                                {{ candidate.phone }}
                            </td>
                            <td class="px-4 py-3 text-muted-foreground">
                                {{ candidate.attachment }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- ================= INTERVIEW SCHEDULE REPORT ================= -->
        <div
            v-else-if="reportType === 'interviews'"
            class="rounded-xl border bg-white shadow-sm"
        >
            <div class="flex items-center justify-between border-b px-5 py-4">
                <h2 class="font-semibold text-slate-900">
                    Interview schedule report
                </h2>
                <span
                    class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                >
                    {{ interviewCandidates.length }} interviews
                </span>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full min-w-[700px] text-sm">
                    <thead>
                        <tr
                            class="border-b text-left text-xs tracking-wide text-muted-foreground uppercase"
                        >
                            <th class="px-4 py-3 font-medium">No.</th>
                            <th class="px-4 py-3 font-medium">Applicant</th>
                            <th class="px-4 py-3 font-medium">Vacancy</th>
                            <th class="px-4 py-3 font-medium">
                                Interview schedule
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(candidate, index) in interviewCandidates"
                            :key="candidate.id"
                            class="border-b transition-colors last:border-0 hover:bg-muted/40"
                        >
                            <td
                                class="px-4 py-3 text-muted-foreground tabular-nums"
                            >
                                {{ index + 1 }}
                            </td>
                            <td class="px-4 py-3 font-medium text-slate-900">
                                {{ candidate.name }}
                            </td>
                            <td class="px-4 py-3 text-muted-foreground">
                                {{ candidate.job }}
                            </td>
                            <td class="px-4 py-3 font-medium tabular-nums">
                                {{ candidate.interview_on ?? 'TBD' }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- ================= HIRING SUMMARY ================= -->
        <div
            v-else-if="reportType === 'hiring'"
            class="rounded-xl border bg-white shadow-sm"
        >
            <div class="flex items-center justify-between border-b px-5 py-4">
                <h2 class="font-semibold text-slate-900">Hiring summary</h2>
                <span
                    class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                >
                    {{ hiredCandidates.length }} hired
                </span>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full min-w-[700px] text-sm">
                    <thead>
                        <tr
                            class="border-b text-left text-xs tracking-wide text-muted-foreground uppercase"
                        >
                            <th class="px-4 py-3 font-medium">No.</th>
                            <th class="px-4 py-3 font-medium">Applicant</th>
                            <th class="px-4 py-3 font-medium">Vacancy</th>
                            <th class="px-4 py-3 font-medium">Date hired</th>
                            <th class="px-4 py-3 font-medium">Contact</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(candidate, index) in hiredCandidates"
                            :key="candidate.id"
                            class="border-b transition-colors last:border-0 hover:bg-muted/40"
                        >
                            <td
                                class="px-4 py-3 text-muted-foreground tabular-nums"
                            >
                                {{ index + 1 }}
                            </td>
                            <td class="px-4 py-3 font-medium text-slate-900">
                                {{ candidate.name }}
                            </td>
                            <td class="px-4 py-3 text-muted-foreground">
                                {{ candidate.job }}
                            </td>
                            <td class="px-4 py-3 font-medium tabular-nums">
                                {{ candidate.hired_on ?? '—' }}
                            </td>
                            <td class="px-4 py-3 text-muted-foreground">
                                {{ candidate.phone }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- ================= ONBOARDING REPORT ================= -->
        <div v-else class="rounded-xl border bg-white shadow-sm">
            <div class="flex items-center justify-between border-b px-5 py-4">
                <h2 class="font-semibold text-slate-900">Onboarding report</h2>
                <span
                    class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                >
                    {{ onboarding.length }} new hires
                </span>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full min-w-[700px] text-sm">
                    <thead>
                        <tr
                            class="border-b text-left text-xs tracking-wide text-muted-foreground uppercase"
                        >
                            <th class="px-4 py-3 font-medium">No.</th>
                            <th class="px-4 py-3 font-medium">New hire</th>
                            <th class="px-4 py-3 font-medium">Position</th>
                            <th class="px-4 py-3 font-medium">Start date</th>
                            <th class="px-4 py-3 font-medium">Progress</th>
                            <th class="px-4 py-3 font-medium">Tasks done</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(group, index) in onboarding"
                            :key="group.employee_id"
                            class="border-b transition-colors last:border-0 hover:bg-muted/40"
                        >
                            <td
                                class="px-4 py-3 text-muted-foreground tabular-nums"
                            >
                                {{ index + 1 }}
                            </td>
                            <td class="px-4 py-3 font-medium text-slate-900">
                                {{ group.name }}
                            </td>
                            <td class="px-4 py-3 text-muted-foreground">
                                {{ group.position }}
                            </td>
                            <td
                                class="px-4 py-3 text-muted-foreground tabular-nums"
                            >
                                {{ group.start_date }}
                            </td>
                            <td class="px-4 py-3">
                                <div class="flex items-center gap-2">
                                    <div
                                        class="h-2 w-24 overflow-hidden rounded-full bg-muted"
                                    >
                                        <div
                                            class="h-full rounded-full bg-blue-600"
                                            :style="{
                                                width: `${group.progress}%`,
                                            }"
                                        ></div>
                                    </div>
                                    <span
                                        class="text-xs font-medium text-muted-foreground tabular-nums"
                                    >
                                        {{ group.progress }}%
                                    </span>
                                </div>
                            </td>
                            <td
                                class="px-4 py-3 text-muted-foreground tabular-nums"
                            >
                                {{
                                    group.tasks.filter((task) => task.done)
                                        .length
                                }}
                                /
                                {{ group.tasks.length }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Report preview modal -->
    <Teleport to="body">
        <div
            v-if="showPreview"
            class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm sm:p-8"
            @click.self="showPreview = false"
        >
            <div
                class="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-2xl"
            >
                <div
                    class="flex items-center justify-between border-b px-6 py-4"
                >
                    <div>
                        <h3 class="text-base font-bold text-slate-900">
                            {{ previewTitle }}
                        </h3>
                        <p class="text-xs text-muted-foreground">
                            Official document preview · {{ printedOn }}
                        </p>
                    </div>
                    <button
                        type="button"
                        class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        aria-label="Close"
                        @click="showPreview = false"
                    >
                        <X class="size-5" />
                    </button>
                </div>

                <div class="overflow-y-auto px-8 py-6">
                    <div class="rounded-lg border bg-white p-8 shadow-sm">
                        <!-- Letterhead -->
                        <div class="text-center">
                            <p
                                class="text-sm font-bold tracking-widest text-slate-800 uppercase"
                            >
                                Republic of the Philippines
                            </p>
                            <p
                                class="mt-1 text-sm font-bold tracking-wide text-slate-700 uppercase"
                            >
                                DARBC HRIS
                            </p>
                            <p class="text-xs text-slate-500">
                                Human Resources Department
                            </p>
                            <div class="mt-5 border-y-2 border-slate-800 py-3">
                                <h1
                                    class="text-lg font-black tracking-wide uppercase"
                                >
                                    {{ previewTitle }}
                                </h1>
                                <p class="mt-1 text-xs text-slate-600">
                                    As of {{ printedOn }}
                                </p>
                            </div>
                        </div>

                        <!-- Vacancy report body -->
                        <table
                            v-if="previewType === 'vacancy'"
                            class="mt-6 w-full border-collapse text-sm"
                        >
                            <thead>
                                <tr
                                    class="border-b-2 border-slate-800 text-left text-xs text-slate-700 uppercase"
                                >
                                    <th class="py-2 pr-3 font-bold">No.</th>
                                    <th class="py-2 pr-3 font-bold">
                                        Job Title
                                    </th>
                                    <th class="py-2 pr-3 font-bold">
                                        Department
                                    </th>
                                    <th class="py-2 pr-3 font-bold">Type</th>
                                    <th class="py-2 pr-3 font-bold">
                                        Applicants
                                    </th>
                                    <th class="py-2 pr-3 font-bold">
                                        Shortlisted
                                    </th>
                                    <th class="py-2 font-bold">Hired</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="(job, index) in filteredJobs"
                                    :key="job.id"
                                    class="border-b border-slate-200"
                                >
                                    <td
                                        class="py-1.5 pr-3 text-slate-600 tabular-nums"
                                    >
                                        {{ index + 1 }}
                                    </td>
                                    <td class="py-1.5 pr-3 font-medium">
                                        {{ job.title }}
                                    </td>
                                    <td class="py-1.5 pr-3 text-slate-600">
                                        {{ job.department }}
                                    </td>
                                    <td class="py-1.5 pr-3 text-slate-600">
                                        {{ job.employment_type }}
                                    </td>
                                    <td
                                        class="py-1.5 pr-3 text-slate-600 tabular-nums"
                                    >
                                        {{ job.applicants }}
                                    </td>
                                    <td
                                        class="py-1.5 pr-3 text-slate-600 tabular-nums"
                                    >
                                        {{ job.shortlisted }}
                                    </td>
                                    <td
                                        class="py-1.5 text-slate-600 tabular-nums"
                                    >
                                        {{ job.hired }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <!-- Applicant master list body -->
                        <table
                            v-else-if="previewType === 'applicants'"
                            class="mt-6 w-full border-collapse text-sm"
                        >
                            <thead>
                                <tr
                                    class="border-b-2 border-slate-800 text-left text-xs text-slate-700 uppercase"
                                >
                                    <th class="py-2 pr-3 font-bold">No.</th>
                                    <th class="py-2 pr-3 font-bold">
                                        Applicant
                                    </th>
                                    <th class="py-2 pr-3 font-bold">Vacancy</th>
                                    <th class="py-2 pr-3 font-bold">Stage</th>
                                    <th class="py-2 pr-3 font-bold">
                                        Date Applied
                                    </th>
                                    <th class="py-2 font-bold">Contact</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="(candidate, index) in allCandidates"
                                    :key="candidate.id"
                                    class="border-b border-slate-200"
                                >
                                    <td
                                        class="py-1.5 pr-3 text-slate-600 tabular-nums"
                                    >
                                        {{ index + 1 }}
                                    </td>
                                    <td class="py-1.5 pr-3 font-medium">
                                        {{ candidate.name }}
                                    </td>
                                    <td class="py-1.5 pr-3 text-slate-600">
                                        {{ candidate.job }}
                                    </td>
                                    <td class="py-1.5 pr-3 text-slate-600">
                                        {{ candidate.stage }}
                                    </td>
                                    <td
                                        class="py-1.5 pr-3 text-slate-600 tabular-nums"
                                    >
                                        {{ candidate.applied_on }}
                                    </td>
                                    <td class="py-1.5 text-slate-600">
                                        {{ candidate.phone }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <!-- Interview schedule body -->
                        <table
                            v-else-if="previewType === 'interviews'"
                            class="mt-6 w-full border-collapse text-sm"
                        >
                            <thead>
                                <tr
                                    class="border-b-2 border-slate-800 text-left text-xs text-slate-700 uppercase"
                                >
                                    <th class="py-2 pr-3 font-bold">No.</th>
                                    <th class="py-2 pr-3 font-bold">
                                        Applicant
                                    </th>
                                    <th class="py-2 pr-3 font-bold">Vacancy</th>
                                    <th class="py-2 font-bold">
                                        Interview Schedule
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="(
                                        candidate, index
                                    ) in interviewCandidates"
                                    :key="candidate.id"
                                    class="border-b border-slate-200"
                                >
                                    <td
                                        class="py-1.5 pr-3 text-slate-600 tabular-nums"
                                    >
                                        {{ index + 1 }}
                                    </td>
                                    <td class="py-1.5 pr-3 font-medium">
                                        {{ candidate.name }}
                                    </td>
                                    <td class="py-1.5 pr-3 text-slate-600">
                                        {{ candidate.job }}
                                    </td>
                                    <td class="py-1.5 text-slate-600">
                                        {{ candidate.interview_on ?? 'TBD' }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <!-- Hiring summary body -->
                        <table
                            v-else-if="previewType === 'hiring'"
                            class="mt-6 w-full border-collapse text-sm"
                        >
                            <thead>
                                <tr
                                    class="border-b-2 border-slate-800 text-left text-xs text-slate-700 uppercase"
                                >
                                    <th class="py-2 pr-3 font-bold">No.</th>
                                    <th class="py-2 pr-3 font-bold">
                                        Applicant
                                    </th>
                                    <th class="py-2 pr-3 font-bold">Vacancy</th>
                                    <th class="py-2 pr-3 font-bold">
                                        Date Hired
                                    </th>
                                    <th class="py-2 font-bold">Contact</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="(
                                        candidate, index
                                    ) in hiredCandidates"
                                    :key="candidate.id"
                                    class="border-b border-slate-200"
                                >
                                    <td
                                        class="py-1.5 pr-3 text-slate-600 tabular-nums"
                                    >
                                        {{ index + 1 }}
                                    </td>
                                    <td class="py-1.5 pr-3 font-medium">
                                        {{ candidate.name }}
                                    </td>
                                    <td class="py-1.5 pr-3 text-slate-600">
                                        {{ candidate.job }}
                                    </td>
                                    <td
                                        class="py-1.5 pr-3 text-slate-600 tabular-nums"
                                    >
                                        {{ candidate.hired_on ?? '—' }}
                                    </td>
                                    <td class="py-1.5 text-slate-600">
                                        {{ candidate.phone }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <!-- Onboarding body -->
                        <table
                            v-else
                            class="mt-6 w-full border-collapse text-sm"
                        >
                            <thead>
                                <tr
                                    class="border-b-2 border-slate-800 text-left text-xs text-slate-700 uppercase"
                                >
                                    <th class="py-2 pr-3 font-bold">No.</th>
                                    <th class="py-2 pr-3 font-bold">
                                        New Hire
                                    </th>
                                    <th class="py-2 pr-3 font-bold">
                                        Position
                                    </th>
                                    <th class="py-2 pr-3 font-bold">
                                        Start Date
                                    </th>
                                    <th class="py-2 font-bold">Progress</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="(group, index) in onboarding"
                                    :key="group.employee_id"
                                    class="border-b border-slate-200"
                                >
                                    <td
                                        class="py-1.5 pr-3 text-slate-600 tabular-nums"
                                    >
                                        {{ index + 1 }}
                                    </td>
                                    <td class="py-1.5 pr-3 font-medium">
                                        {{ group.name }}
                                    </td>
                                    <td class="py-1.5 pr-3 text-slate-600">
                                        {{ group.position }}
                                    </td>
                                    <td
                                        class="py-1.5 pr-3 text-slate-600 tabular-nums"
                                    >
                                        {{ group.start_date }}
                                    </td>
                                    <td class="py-1.5 text-slate-600">
                                        {{ group.progress }}%
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <div class="mt-12 grid grid-cols-2 gap-x-12 text-sm">
                            <div>
                                <div
                                    class="border-t border-slate-400 pt-2 text-xs font-semibold text-slate-600"
                                >
                                    Prepared by: Recruitment Specialist
                                </div>
                            </div>
                            <div>
                                <div
                                    class="border-t border-slate-400 pt-2 text-xs font-semibold text-slate-600"
                                >
                                    Noted by: HR Manager
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex justify-end gap-2 border-t px-6 py-4">
                    <Button variant="ghost" @click="showPreview = false">
                        Close
                    </Button>
                </div>
            </div>
        </div>
    </Teleport>
</template>
