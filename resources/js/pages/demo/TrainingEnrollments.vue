<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import {
    Award,
    BadgeCheck,
    BookOpen,
    FileBarChart2,
    FileSpreadsheet,
    Info,
    Play,
    Plus,
    Search,
    Users,
    X,
} from '@lucide/vue';
import { computed, reactive, ref, watch } from 'vue';
import { toast } from 'vue-sonner';
import AttendanceReportDocument from '@/components/demo/AttendanceReportDocument.vue';
import PaginationBar from '@/components/demo/PaginationBar.vue';
import RecordPrintModal from '@/components/demo/RecordPrintModal.vue';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { cn } from '@/lib/utils';
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

const {
    rows,
    courseRows,
    addCourse,
    enroll,
    start,
    complete,
    withdraw,
    formatMoney,
} = useDemoTraining(allEmployees.value, props.courses, props.enrollments);

const categories = computed(() =>
    [...new Set(props.courses.map((course) => course.category))].sort(),
);

/* ------------------------------------------------------------------ */
/* Query-param pre-fill so dashboard stat cards can deep-link into a   */
/* filtered directory: ?tab=courses, ?status=active, ?category=…      */
/* ------------------------------------------------------------------ */

function queryParam(name: string): string | null {
    if (typeof window === 'undefined') {
        return null;
    }

    return new URLSearchParams(window.location.search).get(name);
}

const statusOptions = ['Enrolled', 'In Progress', 'Completed'] as const;
type StatusOption = (typeof statusOptions)[number];

function initialTab(): 'courses' | 'enrollments' {
    const tab = queryParam('tab');

    return tab === 'courses' ? 'courses' : 'enrollments';
}

function initialStatus(): string {
    const status = queryParam('status');

    if (status === 'active') {
        return 'active';
    }

    return statusOptions.includes(status as StatusOption)
        ? (status ?? 'all')
        : 'all';
}

function initialCategory(): string {
    const category = queryParam('category');

    return category && categories.value.includes(category) ? category : 'all';
}

/* ------------------------------------------------------------------ */
/* Tabs — same sticky, full-width style as the other modules' pages   */
/* ------------------------------------------------------------------ */

const tabs = [
    { key: 'courses', label: 'Courses', icon: BookOpen },
    { key: 'enrollments', label: 'Enrollments', icon: Users },
] as const;

type TabKey = (typeof tabs)[number]['key'];

const activeTab = ref<TabKey>(initialTab());

/* ------------------------------------------------------------------ */
/* Filters                                                            */
/* ------------------------------------------------------------------ */

const statusFilter = ref(initialStatus());
const categoryFilter = ref(initialCategory());
const search = ref('');

const statusOptionsAll = ['active', ...statusOptions] as const;

const filtered = computed(() => {
    const term = search.value.trim().toLowerCase();

    return rows.value.filter(
        (row) =>
            (statusFilter.value === 'all' ||
                (statusFilter.value === 'active'
                    ? row.status === 'Enrolled' || row.status === 'In Progress'
                    : row.status === statusFilter.value)) &&
            (categoryFilter.value === 'all' ||
                row.category === categoryFilter.value) &&
            (term === '' ||
                row.name.toLowerCase().includes(term) ||
                row.no.toLowerCase().includes(term) ||
                row.title.toLowerCase().includes(term) ||
                row.department.toLowerCase().includes(term)),
    );
});

const coursesFiltered = computed(() => {
    const term = search.value.trim().toLowerCase();

    return courseRows.value.filter(
        (course) =>
            (categoryFilter.value === 'all' ||
                course.category === categoryFilter.value) &&
            (term === '' ||
                course.title.toLowerCase().includes(term) ||
                course.code.toLowerCase().includes(term)),
    );
});

const statusTone: Record<string, string> = {
    Enrolled: 'bg-blue-50 text-blue-700 border-blue-200',
    'In Progress': 'bg-amber-50 text-amber-700 border-amber-200',
    Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

/* ------------------------------------------------------------------ */
/* Pagination                                                          */
/* ------------------------------------------------------------------ */

const PAGE_SIZE = 10;

const coursePage = ref(1);
const enrollmentPage = ref(1);

const pagedCourses = computed(() => {
    const start = (coursePage.value - 1) * PAGE_SIZE;

    return coursesFiltered.value.slice(start, start + PAGE_SIZE);
});

const pagedEnrollments = computed(() => {
    const start = (enrollmentPage.value - 1) * PAGE_SIZE;

    return filtered.value.slice(start, start + PAGE_SIZE);
});

/* Changing any filter jumps back to the first page. */
watch([statusFilter, categoryFilter, search], () => {
    coursePage.value = 1;
    enrollmentPage.value = 1;
});

watch(activeTab, () => {
    coursePage.value = 1;
    enrollmentPage.value = 1;
});

/* ------------------------------------------------------------------ */
/* New course modal                                                    */
/* ------------------------------------------------------------------ */

const showCourseModal = ref(false);

const courseDraft = reactive({
    title: '',
    category: '',
    provider: 'Internal L&D',
    venue: '',
    start: '',
    end: '',
    hours: 8,
    cost: 0,
    certificate: true,
});

function openCourseModal(): void {
    courseDraft.title = '';
    courseDraft.category = '';
    courseDraft.provider = 'Internal L&D';
    courseDraft.venue = '';
    courseDraft.start = '';
    courseDraft.end = '';
    courseDraft.hours = 8;
    courseDraft.cost = 0;
    courseDraft.certificate = true;
    showCourseModal.value = true;
}

function saveCourse(): void {
    if (!courseDraft.title.trim()) {
        toast.error('Give the course a title');

        return;
    }

    if (!courseDraft.category) {
        toast.error('Choose a category');

        return;
    }

    if (!courseDraft.start || !courseDraft.end) {
        toast.error('Set the course start and end dates');

        return;
    }

    if (courseDraft.end < courseDraft.start) {
        toast.error('End date must be after the start date');

        return;
    }

    addCourse({
        title: courseDraft.title.trim(),
        category: courseDraft.category,
        provider: courseDraft.provider.trim() || 'Internal L&D',
        venue: courseDraft.venue.trim(),
        start: courseDraft.start,
        end: courseDraft.end,
        hours: courseDraft.hours,
        cost: courseDraft.cost,
        certificate: courseDraft.certificate,
    });

    toast.success(
        `${courseDraft.title.trim()} added to the training calendar (demo)`,
    );
    showCourseModal.value = false;
}

/* ------------------------------------------------------------------ */
/* New enrollment modal                                                */
/* ------------------------------------------------------------------ */

const showModal = ref(false);
const draftEmployee = ref('');
const draftCourse = ref('');

const draftCourseOption = computed(() =>
    props.courses.find((course) => course.id === Number(draftCourse.value)),
);

function openModal(): void {
    draftEmployee.value = '';
    draftCourse.value = '';
    showModal.value = true;
}

function saveEnrollment(): void {
    if (!draftEmployee.value) {
        toast.error('Choose the employee to enroll');

        return;
    }

    if (!draftCourse.value) {
        toast.error('Choose the course');

        return;
    }

    const course = props.courses.find(
        (item) => item.id === Number(draftCourse.value),
    );

    enroll({
        employee_id: Number(draftEmployee.value),
        course_id: Number(draftCourse.value),
    });

    toast.success(`Enrolled in ${course?.title ?? 'course'} (demo)`);
    showModal.value = false;
}

/* ------------------------------------------------------------------ */
/* Actions                                                            */
/* ------------------------------------------------------------------ */

function startRow(id: number): void {
    start(id);
    toast.success('Enrollment marked In Progress');
}

function completeRow(id: number): void {
    complete(id);
    toast.success('Course completed — certificate issued');
}

function withdrawRow(id: number): void {
    withdraw(id);
    toast('Enrollment withdrawn');
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
        course: row.title,
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
        'Employee',
        'Department',
        'Course',
        'Category',
        'Schedule',
        'Status',
        'Score',
        'Certificate',
    ];
    const rowsCsv = reportRows.value.map((row) => [
        row.no,
        row.name,
        row.department,
        row.course,
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
    link.download = 'training-enrollments.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
}
</script>

<template>
    <Head title="Courses & Enrollment — Training & Development" />

    <div class="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <!-- Header -->
        <div
            class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
            <div>
                <h1 class="text-2xl font-bold tracking-tight text-slate-900">
                    Courses & Enrollment
                </h1>
                <p class="mt-1 text-sm text-slate-500">
                    Plan the Q3 2026 calendar, enroll employees, and track each
                    course to completion. Completed trainings are recorded on
                    the employee's profile with a certificate.
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

        <!-- How training works -->
        <div
            class="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/60 p-4 text-sm text-blue-900"
        >
            <Info class="mt-0.5 size-4 shrink-0 text-blue-600" />
            <div class="text-xs leading-relaxed">
                <p class="font-semibold text-slate-900">How this page works</p>
                <p class="mt-1 text-slate-600">
                    Courses run on the
                    <span class="font-medium">Q3 2026 calendar</span>. Finished
                    courses are marked
                    <span class="font-medium">Completed</span> with a score and
                    a certificate number; the course running this week is
                    <span class="font-medium">In Progress</span>, and upcoming
                    courses are still <span class="font-medium">Enrolled</span>.
                    Every completed training is written to the employee's
                    training history, and course titles match the Performance
                    module's skill-gap suggestions.
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

        <!-- Courses tab -->
        <div v-if="activeTab === 'courses'" class="flex flex-col gap-6">
            <!-- Filters -->
            <div
                class="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
                <Select v-model="categoryFilter">
                    <SelectTrigger class="w-48">
                        <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All categories</SelectItem>
                        <SelectItem
                            v-for="category in categories"
                            :key="category"
                            :value="category"
                        >
                            {{ category }}
                        </SelectItem>
                    </SelectContent>
                </Select>

                <div class="relative w-64">
                    <Search
                        class="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                        v-model="search"
                        placeholder="Search course or code…"
                        class="pl-9"
                    />
                </div>
            </div>

            <!-- Courses table -->
            <div class="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div
                    class="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4"
                >
                    <div class="flex items-center gap-3">
                        <h2 class="font-semibold text-slate-900">
                            Q3 2026 training calendar
                        </h2>
                        <span
                            class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                        >
                            {{ coursesFiltered.length }} course{{
                                coursesFiltered.length === 1 ? '' : 's'
                            }}
                        </span>
                    </div>
                    <Button
                        class="bg-blue-600 hover:bg-blue-700"
                        size="sm"
                        @click="openCourseModal"
                    >
                        <Plus class="size-4" />
                        New course
                    </Button>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full min-w-[1000px] text-sm">
                        <thead>
                            <tr
                                class="border-b text-left text-xs tracking-wide text-muted-foreground uppercase"
                            >
                                <th class="px-4 py-3 font-medium">Course</th>
                                <th class="px-4 py-3 font-medium">Category</th>
                                <th class="px-4 py-3 font-medium">Schedule</th>
                                <th class="px-4 py-3 font-medium">Seats</th>
                                <th class="px-4 py-3 text-right font-medium">
                                    Cost
                                </th>
                                <th class="px-4 py-3 font-medium">
                                    Certificate
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="course in pagedCourses"
                                :key="course.id"
                                class="border-b transition-colors last:border-0 hover:bg-muted/40"
                            >
                                <td class="px-4 py-3">
                                    <p class="font-medium text-slate-900">
                                        {{ course.title }}
                                    </p>
                                    <p class="text-xs text-muted-foreground">
                                        {{ course.code }} ·
                                        {{ course.provider }} ·
                                        {{ course.venue }}
                                    </p>
                                </td>
                                <td class="px-4 py-3">
                                    <span
                                        class="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600"
                                    >
                                        {{ course.category }}
                                    </span>
                                </td>
                                <td
                                    class="px-4 py-3 text-muted-foreground tabular-nums"
                                >
                                    {{ course.start }} → {{ course.end }}
                                    <span
                                        class="block text-xs text-muted-foreground"
                                    >
                                        {{ course.hours }} hours
                                    </span>
                                </td>
                                <td class="px-4 py-3">
                                    <div class="flex items-center gap-2">
                                        <div
                                            class="h-1.5 w-20 overflow-hidden rounded-full bg-slate-200"
                                        >
                                            <div
                                                class="h-full rounded-full bg-blue-500"
                                                :style="{
                                                    width: `${Math.min(100, Math.round((course.enrolled / course.capacity) * 100))}%`,
                                                }"
                                            ></div>
                                        </div>
                                        <span
                                            class="text-xs font-medium text-slate-600 tabular-nums"
                                        >
                                            {{ course.enrolled }}/{{
                                                course.capacity
                                            }}
                                        </span>
                                    </div>
                                </td>
                                <td
                                    class="px-4 py-3 text-right text-muted-foreground tabular-nums"
                                >
                                    {{
                                        course.cost === 0
                                            ? 'Free'
                                            : formatMoney(course.cost)
                                    }}
                                </td>
                                <td class="px-4 py-3">
                                    <span
                                        v-if="course.certificate"
                                        class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700"
                                    >
                                        <Award class="size-3.5" />
                                        Cert issued
                                    </span>
                                    <span v-else class="text-muted-foreground">
                                        —
                                    </span>
                                </td>
                            </tr>
                            <tr v-if="coursesFiltered.length === 0">
                                <td
                                    colspan="6"
                                    class="px-4 py-10 text-center text-sm text-muted-foreground"
                                >
                                    No courses match the selected filters.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <PaginationBar
                    :total="coursesFiltered.length"
                    :page-size="PAGE_SIZE"
                    v-model:page="coursePage"
                />
            </div>
        </div>

        <!-- Enrollments tab -->
        <div v-else class="flex flex-col gap-6">
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
                        <SelectItem value="active">
                            Active (enrolled + in progress)
                        </SelectItem>
                        <SelectItem
                            v-for="option in statusOptionsAll"
                            :key="option"
                            :value="option"
                        >
                            {{ option }}
                        </SelectItem>
                    </SelectContent>
                </Select>

                <Select v-model="categoryFilter">
                    <SelectTrigger class="w-48">
                        <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All categories</SelectItem>
                        <SelectItem
                            v-for="category in categories"
                            :key="category"
                            :value="category"
                        >
                            {{ category }}
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

            <!-- Enrollments table -->
            <div class="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div
                    class="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4"
                >
                    <h2 class="font-semibold text-slate-900">
                        Course enrollments
                    </h2>
                    <div class="flex items-center gap-3">
                        <span
                            class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                        >
                            {{ filtered.length }} enrollment{{
                                filtered.length === 1 ? '' : 's'
                            }}
                        </span>
                        <Button
                            class="bg-blue-600 hover:bg-blue-700"
                            size="sm"
                            @click="openModal"
                        >
                            <Plus class="size-4" />
                            New enrollment
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
                                <th class="px-4 py-3 font-medium">Course</th>
                                <th class="px-4 py-3 font-medium">Status</th>
                                <th class="px-4 py-3 font-medium">Score</th>
                                <th class="px-4 py-3 font-medium">
                                    Certificate
                                </th>
                                <th class="px-4 py-3 text-right font-medium">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="(row, index) in pagedEnrollments"
                                :key="row.id"
                                class="border-b transition-colors last:border-0 hover:bg-muted/40"
                            >
                                <td
                                    class="px-4 py-3 text-muted-foreground tabular-nums"
                                >
                                    {{
                                        (enrollmentPage - 1) * PAGE_SIZE +
                                        index +
                                        1
                                    }}
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
                                    <p class="text-slate-700">
                                        {{ row.title }}
                                    </p>
                                    <p class="text-xs text-muted-foreground">
                                        {{ row.course_code }} ·
                                        {{ row.start }} → {{ row.end }}
                                    </p>
                                </td>
                                <td class="px-4 py-3">
                                    <span
                                        class="inline-flex rounded-full border px-2 py-0.5 text-xs font-medium"
                                        :class="statusTone[row.status]"
                                    >
                                        {{ row.status }}
                                    </span>
                                </td>
                                <td class="px-4 py-3">
                                    <span
                                        v-if="row.score !== null"
                                        class="font-medium text-slate-900 tabular-nums"
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
                                        class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700"
                                    >
                                        <BadgeCheck class="size-3.5" />
                                        {{ row.certificate_no }}
                                    </span>
                                    <span v-else class="text-muted-foreground">
                                        —
                                    </span>
                                </td>
                                <td class="px-4 py-3 text-right">
                                    <div class="flex justify-end gap-2">
                                        <Link
                                            :href="
                                                row.employee_id >= 1001
                                                    ? `/demo/training/records/session/${row.employee_id}`
                                                    : `/demo/training/records/${row.employee_id}`
                                            "
                                            class="inline-flex items-center rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                                        >
                                            View
                                        </Link>
                                        <Button
                                            v-if="row.status === 'Enrolled'"
                                            size="sm"
                                            class="bg-blue-600 hover:bg-blue-700"
                                            @click="startRow(row.id)"
                                        >
                                            <Play class="size-3.5" />
                                            Start
                                        </Button>
                                        <Button
                                            v-if="row.status === 'In Progress'"
                                            size="sm"
                                            class="bg-emerald-600 hover:bg-emerald-700"
                                            @click="completeRow(row.id)"
                                        >
                                            <BadgeCheck class="size-3.5" />
                                            Complete
                                        </Button>
                                        <Button
                                            v-if="
                                                row.status === 'Enrolled' ||
                                                row.status === 'In Progress'
                                            "
                                            variant="outline"
                                            size="sm"
                                            class="text-slate-600 shadow-none hover:bg-slate-50 hover:text-slate-900"
                                            @click="withdrawRow(row.id)"
                                        >
                                            Withdraw
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="filtered.length === 0">
                                <td
                                    colspan="7"
                                    class="px-4 py-10 text-center text-sm text-muted-foreground"
                                >
                                    No enrollments match the selected filters.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <PaginationBar
                    :total="filtered.length"
                    :page-size="PAGE_SIZE"
                    v-model:page="enrollmentPage"
                />
            </div>
        </div>
    </div>

    <!-- Generate report preview -->
    <RecordPrintModal
        v-if="showPreview"
        :heading="`Training Enrollment Summary — ${reportRows.length} enrollment${reportRows.length === 1 ? '' : 's'}`"
        subtitle="Official training document · ready to print"
        @close="showPreview = false"
    >
        <AttendanceReportDocument
            title="Training Enrollment Summary"
            :period="`As of ${printedOn}`"
            system="Training & Development System"
            :columns="[
                { key: 'no', label: 'No.' },
                { key: 'name', label: 'Employee' },
                { key: 'department', label: 'Department' },
                { key: 'course', label: 'Course' },
                { key: 'category', label: 'Category' },
                { key: 'schedule', label: 'Schedule' },
                { key: 'status', label: 'Status' },
                { key: 'score', label: 'Score' },
                { key: 'certificate', label: 'Certificate' },
            ]"
            :rows="reportRows"
            note="Completed courses issue a certificate number recorded on the employee's training history; course titles match skill gaps flagged by the Performance module."
        />
    </RecordPrintModal>

    <!-- New enrollment modal -->
    <Teleport to="body">
        <div
            v-if="showModal"
            class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm sm:p-8"
            @click.self="showModal = false"
        >
            <div
                class="flex max-h-[90vh] w-full max-w-xl flex-col rounded-2xl bg-white shadow-2xl"
            >
                <div
                    class="flex items-center justify-between border-b px-6 py-4"
                >
                    <div>
                        <h3 class="text-base font-bold text-slate-900">
                            New enrollment
                        </h3>
                        <p class="text-xs text-muted-foreground">
                            Starts as Enrolled — mark In Progress once the
                            course begins.
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
                        <div class="flex flex-col gap-1.5">
                            <label
                                class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                            >
                                Employee
                            </label>
                            <Select v-model="draftEmployee">
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

                        <div class="flex flex-col gap-1.5">
                            <label
                                class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                            >
                                Course
                            </label>
                            <Select v-model="draftCourse">
                                <SelectTrigger class="w-full">
                                    <SelectValue placeholder="Choose course" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem
                                        v-for="course in courses"
                                        :key="course.id"
                                        :value="String(course.id)"
                                    >
                                        {{ course.code }} — {{ course.title }}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <p
                                v-if="draftCourseOption"
                                class="text-xs text-slate-500"
                            >
                                {{ draftCourseOption.start }} →
                                {{ draftCourseOption.end }} ·
                                {{ draftCourseOption.venue }}
                            </p>
                        </div>
                    </div>
                </div>

                <div class="flex justify-end gap-2 border-t px-6 py-4">
                    <Button variant="ghost" @click="showModal = false">
                        Cancel
                    </Button>
                    <Button
                        class="bg-blue-600 hover:bg-blue-700"
                        @click="saveEnrollment"
                    >
                        <Plus class="size-4" />
                        Enroll
                    </Button>
                </div>
            </div>
        </div>
    </Teleport>

    <!-- New course modal -->
    <Teleport to="body">
        <div
            v-if="showCourseModal"
            class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm sm:p-8"
            @click.self="showCourseModal = false"
        >
            <div
                class="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl"
            >
                <div
                    class="flex items-center justify-between border-b px-6 py-4"
                >
                    <div>
                        <h3 class="text-base font-bold text-slate-900">
                            New course
                        </h3>
                        <p class="text-xs text-muted-foreground">
                            Lands on the Q3 2026 calendar with the next
                            available TRN code.
                        </p>
                    </div>
                    <button
                        type="button"
                        class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        aria-label="Close"
                        @click="showCourseModal = false"
                    >
                        <X class="size-5" />
                    </button>
                </div>

                <div class="overflow-y-auto px-6 py-5">
                    <div class="grid gap-4 sm:grid-cols-2 sm:gap-5">
                        <div class="flex flex-col gap-1.5 sm:col-span-2">
                            <Label>Course title</Label>
                            <Input
                                v-model="courseDraft.title"
                                placeholder="e.g. Effective Business Writing"
                            />
                        </div>

                        <div class="flex flex-col gap-1.5">
                            <Label>Category</Label>
                            <Select v-model="courseDraft.category">
                                <SelectTrigger class="w-full">
                                    <SelectValue
                                        placeholder="Select category"
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem
                                        v-for="category in categories"
                                        :key="category"
                                        :value="category"
                                    >
                                        {{ category }}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div class="flex flex-col gap-1.5">
                            <Label>Provider</Label>
                            <Input v-model="courseDraft.provider" />
                        </div>

                        <div class="flex flex-col gap-1.5 sm:col-span-2">
                            <Label>Venue</Label>
                            <Input
                                v-model="courseDraft.venue"
                                placeholder="e.g. Training Room A or Zoom"
                            />
                        </div>

                        <div class="flex flex-col gap-1.5">
                            <Label>Start date</Label>
                            <Input v-model="courseDraft.start" type="date" />
                        </div>

                        <div class="flex flex-col gap-1.5">
                            <Label>End date</Label>
                            <Input v-model="courseDraft.end" type="date" />
                        </div>

                        <div class="flex flex-col gap-1.5">
                            <Label>Hours</Label>
                            <Input
                                v-model.number="courseDraft.hours"
                                type="number"
                                min="1"
                            />
                        </div>

                        <div class="flex flex-col gap-1.5">
                            <Label>Cost (₱)</Label>
                            <Input
                                v-model.number="courseDraft.cost"
                                type="number"
                                min="0"
                            />
                            <p class="text-xs text-slate-500">
                                0 means free / in-house.
                            </p>
                        </div>

                        <label class="flex items-center gap-2.5 sm:col-span-2">
                            <Checkbox
                                v-model:checked="courseDraft.certificate"
                            />
                            <span class="text-sm text-slate-700">
                                Issue a certificate on completion
                            </span>
                        </label>
                    </div>
                </div>

                <div class="flex justify-end gap-2 border-t px-6 py-4">
                    <Button variant="ghost" @click="showCourseModal = false">
                        Cancel
                    </Button>
                    <Button
                        class="bg-blue-600 hover:bg-blue-700"
                        @click="saveCourse"
                    >
                        <Plus class="size-4" />
                        Add course
                    </Button>
                </div>
            </div>
        </div>
    </Teleport>
</template>
