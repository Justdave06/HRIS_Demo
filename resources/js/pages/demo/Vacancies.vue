<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import {
    CalendarClock,
    Eye,
    FileText,
    FileUp,
    Plus,
    Search,
    Trash2,
    X,
} from '@lucide/vue';
import { computed, reactive, ref, watch } from 'vue';
import { toast } from 'vue-sonner';
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
import { useDemoVacancies } from '@/composables/useDemoVacancies';
import type { VacancyDraft } from '@/composables/useDemoVacancies';
import { cn } from '@/lib/utils';
import type { DemoCandidate, DemoJob } from '@/types';

const props = defineProps<{
    jobs: DemoJob[];
    candidates: DemoCandidate[];
    departments: string[];
    positions: string[];
    stats: {
        vacant: number;
        totalApplicants: number;
        shortlisted: number;
        hiredThisMonth: number;
    };
}>();

const {
    addedVacancies,
    addVacancy,
    interviewSchedules,
    removeVacancy,
    setInterview,
    setStatus,
    statusFor,
} = useDemoVacancies();

const allJobs = computed(() => [...props.jobs, ...addedVacancies.value]);

function initialParam(name: string): string {
    if (typeof window === 'undefined') {
        return 'all';
    }

    return new URLSearchParams(window.location.search).get(name) ?? 'all';
}

const search = ref('');
const department = ref('all');
const employmentType = ref('all');
const statusFilter = ref(initialParam('status'));

const typeOptions = ['Regular', 'Probationary', 'Contractual'] as const;

const filtered = computed(() => {
    const term = search.value.trim().toLowerCase();

    return allJobs.value.filter(
        (job) =>
            (department.value === 'all' ||
                job.department === department.value) &&
            (employmentType.value === 'all' ||
                job.employment_type === employmentType.value) &&
            (statusFilter.value === 'all' ||
                statusFor(job) === statusFilter.value) &&
            (term === '' ||
                job.title.toLowerCase().includes(term) ||
                job.position.toLowerCase().includes(term) ||
                job.department.toLowerCase().includes(term)),
    );
});

function applicantsFor(jobId: number): DemoCandidate[] {
    return props.candidates.filter((c) => c.vacancy_id === jobId);
}

/* ------------------------------------------------------------------ */
/* Add vacancy modal                                                    */
/* ------------------------------------------------------------------ */

const showAdd = ref(false);
const attachmentInput = ref<HTMLInputElement | null>(null);

const draft = reactive<VacancyDraft>({
    title: '',
    position: '',
    department: '',
    salary: '',
    employment_type: 'Regular',
    attachment: '',
});

function openAdd(): void {
    Object.assign(draft, {
        title: '',
        position: '',
        department: '',
        salary: '',
        employment_type: 'Regular',
        attachment: '',
    });
    showAdd.value = true;
}

function onAttachmentPicked(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
        draft.attachment = file.name;
        toast.success('Hiring document attached (demo)');
    }

    input.value = '';
}

function saveVacancy(): void {
    if (!draft.title.trim()) {
        toast.error('Add at least a job title before saving');

        return;
    }

    const vacancy = addVacancy(draft);
    toast.success(`${vacancy.title} — vacancy added (demo)`);
    showAdd.value = false;
}

/* ------------------------------------------------------------------ */
/* View vacancy modal                                                   */
/* ------------------------------------------------------------------ */

const viewing = ref<DemoJob | null>(null);
const showDocument = ref(false);

const viewApplicants = computed(() =>
    viewing.value ? applicantsFor(viewing.value.id) : [],
);

// Viewable applicant attachment (application form / resume).
const viewingApplicant = ref<DemoCandidate | null>(null);

function openApplicantDocument(candidate: DemoCandidate): void {
    viewingApplicant.value = candidate;
}

// Interview scheduling for applicants.
const schedulingFor = ref<DemoCandidate | null>(null);
const interviewDate = ref('');
const interviewTime = ref('');

/** Effective interview schedule: session override wins over seeded data. */
function interviewFor(candidate: DemoCandidate): string | null {
    return interviewSchedules()[candidate.id] ?? candidate.interview_on ?? null;
}

function openSchedule(candidate: DemoCandidate): void {
    const existing = interviewFor(candidate);

    if (existing) {
        const [date, time] = existing.split(' ');
        interviewDate.value = date ?? '';
        interviewTime.value = time ?? '';
    } else {
        interviewDate.value = '';
        interviewTime.value = '';
    }

    schedulingFor.value = candidate;
}

function saveInterview(): void {
    if (!schedulingFor.value) {
        return;
    }

    const datetime = [interviewDate.value, interviewTime.value]
        .filter(Boolean)
        .join(' ');

    if (!interviewDate.value.trim() || !interviewTime.value.trim()) {
        toast.error('Set both the interview date and time');

        return;
    }

    setInterview(schedulingFor.value.id, datetime);
    toast.success(
        `${schedulingFor.value.name} — interview set for ${datetime} (demo)`,
    );
    schedulingFor.value = null;
}

function clearInterview(candidate: DemoCandidate): void {
    setInterview(candidate.id, '');
    toast.success(`${candidate.name} — interview schedule cleared (demo)`);
}

function openView(job: DemoJob): void {
    viewing.value = job;
    showDocument.value = false;
}

const stageCounts = computed(() => {
    const counts = { Applied: 0, Shortlisted: 0, Interview: 0, Hired: 0 };

    for (const candidate of viewApplicants.value) {
        counts[candidate.stage] += 1;
    }

    return counts;
});

function onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
        showAdd.value = false;
        viewing.value = null;
        showDocument.value = false;
        viewingApplicant.value = null;
        schedulingFor.value = null;
    }
}

watch(showAdd, (open) => {
    if (open) {
        window.addEventListener('keydown', onKeydown);
    } else {
        window.removeEventListener('keydown', onKeydown);
    }
});

watch(viewing, (job) => {
    if (job) {
        window.addEventListener('keydown', onKeydown);
    } else {
        window.removeEventListener('keydown', onKeydown);
    }
});

watch(schedulingFor, (candidate) => {
    if (candidate) {
        window.addEventListener('keydown', onKeydown);
    } else {
        window.removeEventListener('keydown', onKeydown);
    }
});

const statusTone: Record<DemoJob['status'], string> = {
    Open: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'On Hold': 'bg-amber-50 text-amber-700 border-amber-200',
    Closed: 'bg-slate-100 text-slate-600 border-slate-200',
};

const stageTone: Record<DemoCandidate['stage'], string> = {
    Applied: 'bg-slate-100 text-slate-600',
    Shortlisted: 'bg-amber-50 text-amber-700',
    Interview: 'bg-blue-50 text-blue-700',
    Hired: 'bg-emerald-50 text-emerald-700',
};
</script>

<template>
    <Head title="Vacancy Management — Recruitment & Onboarding" />

    <div class="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <!-- Header -->
        <div
            class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
            <h1 class="text-2xl font-bold tracking-tight text-slate-900">
                Vacancy Management
            </h1>
            <Button
                class="shrink-0 bg-blue-600 hover:bg-blue-700"
                @click="openAdd"
            >
                <Plus class="size-4" />
                Add vacancy
            </Button>
        </div>

        <!-- Filters -->
        <div
            class="flex flex-wrap gap-3 rounded-xl border bg-white p-4 shadow-sm"
        >
            <div class="relative w-64">
                <Search
                    class="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                    v-model="search"
                    placeholder="Search title, position, department…"
                    class="pl-9"
                />
            </div>
            <Select v-model="department">
                <SelectTrigger class="w-52">
                    <SelectValue placeholder="All departments" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All departments</SelectItem>
                    <SelectItem
                        v-for="dept in departments"
                        :key="dept"
                        :value="dept"
                    >
                        {{ dept }}
                    </SelectItem>
                </SelectContent>
            </Select>
            <Select v-model="employmentType">
                <SelectTrigger class="w-48">
                    <SelectValue placeholder="All employment types" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All employment types</SelectItem>
                    <SelectItem
                        v-for="option in typeOptions"
                        :key="option"
                        :value="option"
                    >
                        {{ option }}
                    </SelectItem>
                </SelectContent>
            </Select>
            <Select v-model="statusFilter">
                <SelectTrigger class="w-44">
                    <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="On Hold">On Hold</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
            </Select>
        </div>

        <!-- Vacancies table -->
        <div class="rounded-xl border bg-white shadow-sm">
            <div class="flex items-center justify-between border-b px-5 py-4">
                <h2 class="font-semibold text-slate-900">Job vacancies</h2>
                <span
                    class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                >
                    {{ filtered.length }} vacancy/ies
                </span>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full min-w-[900px] text-sm">
                    <thead>
                        <tr
                            class="border-b text-left text-xs tracking-wide text-muted-foreground uppercase"
                        >
                            <th class="px-4 py-3 font-medium">Vacancy</th>
                            <th class="px-4 py-3 font-medium">Department</th>
                            <th class="px-4 py-3 font-medium">Type</th>
                            <th class="px-4 py-3 font-medium">Salary</th>
                            <th class="px-4 py-3 font-medium">Applicants</th>
                            <th class="px-4 py-3 font-medium">Shortlisted</th>
                            <th class="px-4 py-3 font-medium">Hired</th>
                            <th class="px-4 py-3 font-medium">Status</th>
                            <th class="px-4 py-3 text-right font-medium">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="job in filtered"
                            :key="job.id"
                            class="border-b transition-colors last:border-0 hover:bg-muted/40"
                        >
                            <td class="px-4 py-3">
                                <div class="min-w-0">
                                    <p class="font-medium text-slate-900">
                                        {{ job.title }}
                                    </p>
                                    <p class="text-xs text-muted-foreground">
                                        {{ job.position }} · posted
                                        {{ job.posted }}
                                    </p>
                                </div>
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
                                <span class="font-medium">
                                    {{
                                        applicantsFor(job.id).length ||
                                        job.applicants
                                    }}
                                </span>
                            </td>
                            <td class="px-4 py-3 tabular-nums">
                                {{
                                    applicantsFor(job.id).filter(
                                        (c) => c.stage === 'Shortlisted',
                                    ).length || job.shortlisted
                                }}
                            </td>
                            <td class="px-4 py-3 tabular-nums">
                                {{
                                    applicantsFor(job.id).filter(
                                        (c) => c.stage === 'Hired',
                                    ).length || job.hired
                                }}
                            </td>
                            <td class="px-4 py-3">
                                <Select
                                    :model-value="statusFor(job)"
                                    @update:model-value="
                                        (value) => {
                                            const status =
                                                value as DemoJob['status'];
                                            setStatus(job.id, status);
                                            toast.success(
                                                `${job.title} — status updated to ${status} (demo)`,
                                            );
                                        }
                                    "
                                >
                                    <SelectTrigger
                                        class="h-8 w-32 border-transparent bg-transparent"
                                        :class="
                                            cn(
                                                'text-xs font-medium',
                                                statusTone[statusFor(job)],
                                            )
                                        "
                                    >
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Open">
                                            Open
                                        </SelectItem>
                                        <SelectItem value="On Hold">
                                            On Hold
                                        </SelectItem>
                                        <SelectItem value="Closed">
                                            Closed
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </td>
                            <td class="px-4 py-3">
                                <div class="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        class="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50"
                                        @click="openView(job)"
                                    >
                                        <Eye class="size-3.5" />
                                        View
                                    </button>
                                    <button
                                        type="button"
                                        class="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                                        @click="
                                            removeVacancy(job.id);
                                            toast.success(
                                                `${job.title} — vacancy removed (demo)`,
                                            );
                                        "
                                    >
                                        <Trash2 class="size-3.5" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="filtered.length === 0">
                            <td
                                colspan="9"
                                class="px-4 py-10 text-center text-sm text-muted-foreground"
                            >
                                No vacancies match your filters.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Add vacancy modal -->
    <Teleport to="body">
        <div
            v-if="showAdd"
            class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm sm:p-8"
            @click.self="showAdd = false"
        >
            <div class="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
                <!-- Header -->
                <div
                    class="flex items-center justify-between border-b px-6 py-4"
                >
                    <h3 class="text-base font-bold text-slate-900">
                        Add vacancy
                    </h3>
                    <button
                        type="button"
                        class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        aria-label="Close"
                        @click="showAdd = false"
                    >
                        <X class="size-5" />
                    </button>
                </div>

                <!-- Body -->
                <div class="grid gap-4 px-6 py-5 sm:grid-cols-2">
                    <div class="grid gap-2">
                        <Label for="v-title">Job title</Label>
                        <Input
                            id="v-title"
                            v-model="draft.title"
                            placeholder="e.g. Software Engineer"
                        />
                    </div>
                    <div class="grid gap-2">
                        <Label for="v-position">Position</Label>
                        <Input
                            id="v-position"
                            v-model="draft.position"
                            placeholder="e.g. Junior Software Engineer"
                        />
                    </div>
                    <div class="grid gap-2">
                        <Label>Department</Label>
                        <Select v-model="draft.department">
                            <SelectTrigger>
                                <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem
                                    v-for="dept in departments"
                                    :key="dept"
                                    :value="dept"
                                >
                                    {{ dept }}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div class="grid gap-2">
                        <Label for="v-salary">Salary</Label>
                        <Input
                            id="v-salary"
                            v-model="draft.salary"
                            placeholder="e.g. ₱30,000 – ₱40,000"
                        />
                    </div>
                    <div class="grid gap-2">
                        <Label>Employment type</Label>
                        <Select v-model="draft.employment_type">
                            <SelectTrigger>
                                <SelectValue
                                    placeholder="Select employment type"
                                />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem
                                    v-for="option in typeOptions"
                                    :key="option"
                                    :value="option"
                                >
                                    {{ option }}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div class="grid gap-2 sm:col-span-2">
                        <Label>Hiring document (attachment)</Label>
                        <p
                            class="text-xs leading-relaxed text-muted-foreground"
                        >
                            This is not an online job posting — attach the
                            document you already prepared (header,
                            qualifications and requirements) in your document
                            tool.
                        </p>
                        <input
                            id="v-document"
                            ref="attachmentInput"
                            type="file"
                            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                            class="hidden"
                            @change="onAttachmentPicked"
                        />
                        <div class="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                @click="attachmentInput?.click()"
                            >
                                <FileUp class="size-4" />
                                {{
                                    draft.attachment
                                        ? 'Replace document'
                                        : 'Choose file'
                                }}
                            </Button>
                            <span
                                v-if="draft.attachment"
                                class="truncate text-xs text-muted-foreground"
                                :title="draft.attachment"
                            >
                                {{ draft.attachment }}
                            </span>
                            <button
                                v-if="draft.attachment"
                                type="button"
                                class="text-xs font-medium text-blue-600 transition-colors hover:text-blue-800"
                                @click="draft.attachment = ''"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="flex justify-end gap-2 border-t px-6 py-4">
                    <Button variant="ghost" @click="showAdd = false">
                        Cancel
                    </Button>
                    <Button
                        class="bg-blue-600 hover:bg-blue-700"
                        @click="saveVacancy"
                    >
                        Save vacancy
                    </Button>
                </div>
            </div>
        </div>
    </Teleport>

    <!-- View vacancy modal -->
    <Teleport to="body">
        <div
            v-if="viewing"
            class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm sm:p-8"
            @click.self="viewing = null"
        >
            <div
                class="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-2xl"
            >
                <!-- Header -->
                <div
                    class="flex items-center justify-between border-b px-6 py-4"
                >
                    <div class="min-w-0">
                        <h3 class="truncate text-base font-bold text-slate-900">
                            {{ viewing.title }}
                        </h3>
                        <p class="text-xs text-muted-foreground">
                            {{ viewing.position }} · {{ viewing.department }} ·
                            {{ viewing.employment_type }} · {{ viewing.salary }}
                        </p>
                    </div>
                    <button
                        type="button"
                        class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        aria-label="Close"
                        @click="viewing = null"
                    >
                        <X class="size-5" />
                    </button>
                </div>

                <!-- Body -->
                <div class="overflow-y-auto px-6 py-5">
                    <!-- Hiring document -->
                    <div
                        class="flex items-center justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50/60 px-4 py-3"
                    >
                        <div class="flex min-w-0 items-center gap-3">
                            <span class="rounded-lg bg-blue-600 p-2 text-white">
                                <FileText class="size-4" />
                            </span>
                            <div class="min-w-0">
                                <p
                                    class="truncate text-sm font-semibold text-slate-900"
                                >
                                    Hiring document
                                </p>
                                <p
                                    class="truncate text-xs text-muted-foreground"
                                    :title="viewing.attachment"
                                >
                                    {{
                                        viewing.attachment ||
                                        'No document attached'
                                    }}
                                </p>
                            </div>
                        </div>
                        <Button
                            v-if="viewing.attachment"
                            variant="outline"
                            size="sm"
                            @click="showDocument = true"
                        >
                            <Eye class="size-4" />
                            View document
                        </Button>
                    </div>

                    <!-- Applicant summary -->
                    <div class="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <div
                            v-for="stage in [
                                'Applied',
                                'Shortlisted',
                                'Interview',
                                'Hired',
                            ]"
                            :key="stage"
                            class="rounded-lg border p-3 text-center"
                        >
                            <p
                                class="text-2xl font-bold text-slate-900 tabular-nums"
                            >
                                {{
                                    stageCounts[
                                        stage as keyof typeof stageCounts
                                    ]
                                }}
                            </p>
                            <p class="mt-0.5 text-xs text-muted-foreground">
                                {{ stage }}
                            </p>
                        </div>
                    </div>

                    <!-- Applicants -->
                    <div class="mt-5">
                        <h4 class="text-sm font-semibold text-slate-900">
                            Applicants
                            <span class="font-normal text-muted-foreground">
                                ({{ viewApplicants.length }})
                            </span>
                        </h4>
                        <div
                            v-if="viewApplicants.length > 0"
                            class="mt-3 divide-y rounded-xl border"
                        >
                            <div
                                v-for="candidate in viewApplicants"
                                :key="candidate.id"
                                class="flex items-center justify-between gap-3 px-4 py-3"
                            >
                                <div class="min-w-0">
                                    <p
                                        class="truncate text-sm font-medium text-slate-900"
                                    >
                                        {{ candidate.name }}
                                    </p>
                                    <p
                                        class="truncate text-xs text-muted-foreground"
                                    >
                                        Applied {{ candidate.applied_on }} ·
                                        {{ candidate.phone }}
                                    </p>
                                    <p
                                        v-if="candidate.attachment"
                                        class="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground"
                                    >
                                        <FileText class="size-3" />
                                        {{ candidate.attachment }}
                                    </p>
                                    <p
                                        v-if="interviewFor(candidate)"
                                        class="mt-0.5 inline-flex items-center gap-1 text-xs font-medium text-blue-700"
                                    >
                                        <CalendarClock class="size-3" />
                                        Interview: {{ interviewFor(candidate) }}
                                    </p>
                                </div>
                                <div class="flex shrink-0 items-center gap-2">
                                    <button
                                        v-if="candidate.attachment"
                                        type="button"
                                        class="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50"
                                        @click="
                                            openApplicantDocument(candidate)
                                        "
                                    >
                                        <Eye class="size-3.5" />
                                        View attachment
                                    </button>
                                    <button
                                        type="button"
                                        class="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50"
                                        @click="openSchedule(candidate)"
                                    >
                                        <CalendarClock class="size-3.5" />
                                        {{
                                            interviewFor(candidate)
                                                ? 'Reschedule'
                                                : 'Schedule interview'
                                        }}
                                    </button>
                                    <button
                                        v-if="interviewFor(candidate)"
                                        type="button"
                                        class="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                                        @click="clearInterview(candidate)"
                                    >
                                        <X class="size-3.5" />
                                    </button>
                                    <span
                                        class="rounded-full px-2.5 py-1 text-xs font-medium"
                                        :class="stageTone[candidate.stage]"
                                    >
                                        {{ candidate.stage }}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <p
                            v-else
                            class="mt-3 rounded-xl border border-dashed px-4 py-6 text-center text-sm text-muted-foreground"
                        >
                            No applicants for this vacancy yet.
                        </p>
                    </div>
                </div>

                <!-- Footer -->
                <div class="flex justify-end gap-2 border-t px-6 py-4">
                    <Button variant="ghost" @click="viewing = null">
                        Close
                    </Button>
                </div>
            </div>
        </div>
    </Teleport>

    <!-- Hiring document preview modal -->
    <Teleport to="body">
        <div
            v-if="showDocument && viewing"
            class="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-950/70 p-4 backdrop-blur-sm sm:p-8"
            @click.self="showDocument = false"
        >
            <div
                class="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
                <div
                    class="flex items-center justify-between border-b px-6 py-4"
                >
                    <h3 class="text-base font-bold text-slate-900">
                        {{ viewing.attachment }}
                    </h3>
                    <button
                        type="button"
                        class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        aria-label="Close"
                        @click="showDocument = false"
                    >
                        <X class="size-5" />
                    </button>
                </div>
                <div
                    class="max-h-[70vh] overflow-y-auto bg-slate-50 px-8 py-10"
                >
                    <!-- Official hiring notice preview -->
                    <div class="rounded-lg border bg-white p-8 shadow-sm">
                        <p
                            class="text-center text-sm font-bold tracking-widest text-slate-800 uppercase"
                        >
                            Hiring Notice
                        </p>
                        <p class="mt-1 text-center text-xs text-slate-500">
                            {{ viewing.title }} · {{ viewing.department }}
                        </p>

                        <div class="mt-6 border-t-2 border-slate-800 pt-4">
                            <h4
                                class="text-xs font-bold tracking-wide text-slate-800 uppercase"
                            >
                                Qualifications
                            </h4>
                            <ul
                                class="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700"
                            >
                                <li>
                                    Bachelor's degree relevant to the position
                                </li>
                                <li>
                                    At least 1 year of related work experience
                                </li>
                                <li>
                                    Good written and verbal communication skills
                                </li>
                            </ul>

                            <h4
                                class="mt-5 text-xs font-bold tracking-wide text-slate-800 uppercase"
                            >
                                Requirements
                            </h4>
                            <ul
                                class="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700"
                            >
                                <li>Resume / CV</li>
                                <li>Transcript of records</li>
                                <li>Valid government-issued ID</li>
                                <li>NBI clearance (for final candidates)</li>
                            </ul>

                            <p class="mt-6 text-xs text-slate-500">
                                Interested applicants may submit their
                                requirements to the Human Resources Department.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>

    <!-- Applicant attachment preview (application form / resume) -->
    <Teleport to="body">
        <div
            v-if="viewingApplicant"
            class="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-950/70 p-4 backdrop-blur-sm sm:p-8"
            @click.self="viewingApplicant = null"
        >
            <div
                class="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
                <div
                    class="flex items-center justify-between border-b px-6 py-4"
                >
                    <div class="min-w-0">
                        <h3 class="truncate text-base font-bold text-slate-900">
                            {{ viewingApplicant.attachment }}
                        </h3>
                        <p class="text-xs text-muted-foreground">
                            {{ viewingApplicant.name }} · applied for
                            {{ viewingApplicant.job }}
                        </p>
                    </div>
                    <button
                        type="button"
                        class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        aria-label="Close"
                        @click="viewingApplicant = null"
                    >
                        <X class="size-5" />
                    </button>
                </div>
                <div
                    class="max-h-[70vh] overflow-y-auto bg-slate-50 px-8 py-10"
                >
                    <!-- Simple sample document for demo purposes -->
                    <div
                        class="relative overflow-hidden rounded-lg border bg-white p-10 shadow-sm"
                    >
                        <span
                            class="pointer-events-none absolute inset-0 flex items-center justify-center"
                            aria-hidden="true"
                        >
                            <span
                                class="rotate-[-24deg] border-4 border-blue-200/60 px-6 py-2 text-3xl font-black tracking-[0.3em] text-blue-200/60 uppercase"
                            >
                                Sample
                            </span>
                        </span>

                        <p
                            class="text-center text-xs font-bold tracking-widest text-slate-500 uppercase"
                        >
                            {{ viewingApplicant.attachment }}
                        </p>
                        <p class="mt-1 text-center text-xs text-slate-400">
                            Sample view for demonstration — actual file opens in
                            the real system.
                        </p>

                        <div class="mt-8 border-t-2 border-slate-800 pt-5">
                            <p
                                class="text-center text-xl font-black tracking-tight text-slate-900"
                            >
                                {{ viewingApplicant.name }}
                            </p>
                            <p class="mt-1 text-center text-xs text-slate-500">
                                Applicant for {{ viewingApplicant.job }}
                            </p>
                        </div>

                        <dl
                            class="mt-8 grid grid-cols-2 gap-x-10 gap-y-4 text-sm"
                        >
                            <div>
                                <dt class="text-xs text-slate-500">
                                    Date applied
                                </dt>
                                <dd class="font-medium">
                                    {{ viewingApplicant.applied_on }}
                                </dd>
                            </div>
                            <div>
                                <dt class="text-xs text-slate-500">Stage</dt>
                                <dd class="font-medium">
                                    {{ viewingApplicant.stage }}
                                </dd>
                            </div>
                            <div>
                                <dt class="text-xs text-slate-500">
                                    Contact number
                                </dt>
                                <dd class="font-medium">
                                    {{ viewingApplicant.phone }}
                                </dd>
                            </div>
                            <div>
                                <dt class="text-xs text-slate-500">Email</dt>
                                <dd class="truncate font-medium">
                                    {{ viewingApplicant.email }}
                                </dd>
                            </div>
                        </dl>
                        <div class="mt-8 border-t border-slate-200 pt-4">
                            <h4
                                class="text-xs font-bold tracking-wide text-slate-800 uppercase"
                            >
                                Application details
                            </h4>
                            <p
                                class="mt-2 text-sm leading-relaxed text-slate-600"
                            >
                                This is where the applicant's attached document
                                (application form or resume) will be shown once
                                uploaded in the real system.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>

    <!-- Schedule interview modal -->
    <Teleport to="body">
        <div
            v-if="schedulingFor"
            class="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-slate-950/70 p-4 backdrop-blur-sm sm:p-8"
            @click.self="schedulingFor = null"
        >
            <div
                class="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
                <div
                    class="flex items-center justify-between border-b px-6 py-4"
                >
                    <div class="min-w-0">
                        <h3 class="text-base font-bold text-slate-900">
                            {{
                                interviewFor(schedulingFor)
                                    ? 'Reschedule interview'
                                    : 'Schedule interview'
                            }}
                        </h3>
                        <p class="truncate text-xs text-muted-foreground">
                            {{ schedulingFor.name }} ·
                            {{ schedulingFor.job }}
                        </p>
                    </div>
                    <button
                        type="button"
                        class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        aria-label="Close"
                        @click="schedulingFor = null"
                    >
                        <X class="size-5" />
                    </button>
                </div>

                <div class="grid gap-4 px-6 py-5">
                    <div class="grid gap-2">
                        <Label for="iv-date">Interview date</Label>
                        <Input
                            id="iv-date"
                            v-model="interviewDate"
                            type="date"
                        />
                    </div>
                    <div class="grid gap-2">
                        <Label for="iv-time">Interview time</Label>
                        <Input
                            id="iv-time"
                            v-model="interviewTime"
                            type="time"
                        />
                    </div>
                    <p class="text-xs leading-relaxed text-muted-foreground">
                        The schedule feeds the Interview Schedule report, so you
                        can always generate it from real data.
                    </p>
                </div>

                <div class="flex justify-end gap-2 border-t px-6 py-4">
                    <Button variant="ghost" @click="schedulingFor = null">
                        Cancel
                    </Button>
                    <Button
                        class="bg-blue-600 hover:bg-blue-700"
                        @click="saveInterview"
                    >
                        Save schedule
                    </Button>
                </div>
            </div>
        </div>
    </Teleport>
</template>
