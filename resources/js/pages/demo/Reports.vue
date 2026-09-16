<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { FileBarChart2, FileSpreadsheet, Search } from '@lucide/vue';
import { computed, ref, watch } from 'vue';
import RecordPrintModal from '@/components/demo/RecordPrintModal.vue';
import ReportSummaryDocument from '@/components/demo/ReportSummaryDocument.vue';
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
import { useDemoEmployees } from '@/composables/useDemoEmployees';
import { exportSheet } from '@/lib/exportExcel';
import type { DemoEmployee } from '@/types';

const props = defineProps<{
    employees: DemoEmployee[];
    departments: string[];
    positions: string[];
}>();

const reportTypes = [
    { value: 'masterlist', label: 'Employee Masterlist Report' },
    { value: 'file-status', label: '201 File Status Report' },
    { value: 'employment-status', label: 'Employment Status Report' },
] as const;

type ReportType = (typeof reportTypes)[number]['value'];

// Deep-linkable via the Reports dropdown on the Employee Management page.
function initialReportType(): ReportType {
    if (typeof window === 'undefined') {
        return 'masterlist';
    }

    const param = new URLSearchParams(window.location.search).get('type');

    return reportTypes.some((type) => type.value === param)
        ? (param as ReportType)
        : 'masterlist';
}

const reportType = ref<ReportType>(initialReportType());
const position = ref('all');
const department = ref('all');
const employmentType = ref('all');
const fileStatus = ref('all');
const search = ref('');

// Filters don't carry over between reports: switching types resets all of
// them so each report always starts from a clean/complete view.
watch(reportType, () => {
    search.value = '';
    position.value = 'all';
    department.value = 'all';
    employmentType.value = 'all';
    fileStatus.value = 'all';
});

// Session-added demo employees are merged in so they appear in reports too.
const { addedEmployees } = useDemoEmployees();

const allEmployees = computed(() => [
    ...props.employees,
    ...addedEmployees.value,
]);

const employmentTypeOptions = [
    'Regular',
    'Probationary',
    'Contractual',
] as const;
const fileStatusOptions = ['Complete', 'Incomplete'] as const;

// Heading for the flat 201 File Status table, reflecting the active filter.
const fileStatusTitle = computed(() => {
    if (fileStatus.value === 'all') {
        return 'All 201 files';
    }

    return `${fileStatus.value} 201 files`;
});

// Heading for the flat Employment Status table, reflecting the active filter.
const employmentStatusTitle = computed(() => {
    if (employmentType.value === 'all') {
        return 'All employees';
    }

    return `${employmentType.value} employees`;
});

const reportTypeLabel = computed(
    () =>
        reportTypes.find((type) => type.value === reportType.value)?.label ??
        'Employee report',
);

const filtered = computed(() => {
    const term = search.value.trim().toLowerCase();

    return allEmployees.value.filter(
        (employee) =>
            (position.value === 'all' ||
                employee.position === position.value) &&
            (department.value === 'all' ||
                employee.department === department.value) &&
            (employmentType.value === 'all' ||
                employee.employment_type === employmentType.value) &&
            (fileStatus.value === 'all' ||
                employee.file_status === fileStatus.value) &&
            (term === '' ||
                employee.name.toLowerCase().includes(term) ||
                employee.no.toLowerCase().includes(term) ||
                employee.position.toLowerCase().includes(term)),
    );
});

const showPreview = ref(false);
const previewEmployees = ref<DemoEmployee[]>([]);

function generate(): void {
    previewEmployees.value = [...filtered.value];
    showPreview.value = true;
}

function exportExcel(): void {
    // Status columns only belong to their own reports: the masterlist stays a
    // plain roster, employment status shows employee status, 201 file status
    // shows the 201 file status.
    const showEmployeeStatus = reportType.value === 'employment-status';
    const showFileStatus = reportType.value === 'file-status';
    const headers = [
        'No.',
        'Employee ID',
        'Name',
        'Position',
        'Department',
        ...(showEmployeeStatus ? ['Employee Status'] : []),
        'Date Hired',
        ...(showFileStatus ? ['201 File Status'] : []),
    ];
    const rows = filtered.value.map((employee, index) => [
        index + 1,
        employee.no,
        employee.name,
        employee.position,
        employee.department,
        ...(showEmployeeStatus ? [employee.employment_type] : []),
        employee.hire_date,
        ...(showFileStatus ? [employee.file_status] : []),
    ]);

    exportSheet('employee-report', 'Employees', headers, rows);
}
</script>

<template>
    <Head title="Reports — Employee Information Management" />

    <div class="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <!-- Header -->
        <div
            class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
            <h1 class="text-2xl font-bold tracking-tight">Reports</h1>
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

        <!-- Report type -->
        <div
            class="flex flex-wrap items-center gap-3 rounded-xl border bg-card p-4 shadow-sm"
        >
            <span class="text-sm font-medium">Report type</span>
            <Select v-model="reportType">
                <SelectTrigger class="w-72">
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
        </div>

        <!-- Filters + search (fixed width, even spacing — never stretched) -->
        <div
            class="flex flex-wrap gap-3 rounded-xl border bg-card p-4 shadow-sm"
        >
            <div class="relative w-64">
                <Search
                    class="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                    v-model="search"
                    placeholder="Search name, ID or position…"
                    class="pl-9"
                />
            </div>

            <Select v-model="position">
                <SelectTrigger class="w-56">
                    <SelectValue placeholder="All positions" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All positions</SelectItem>
                    <SelectItem
                        v-for="option in positions"
                        :key="option"
                        :value="option"
                    >
                        {{ option }}
                    </SelectItem>
                </SelectContent>
            </Select>

            <Select v-model="department">
                <SelectTrigger class="w-56">
                    <SelectValue placeholder="All departments" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All departments</SelectItem>
                    <SelectItem
                        v-for="option in departments"
                        :key="option"
                        :value="option"
                    >
                        {{ option }}
                    </SelectItem>
                </SelectContent>
            </Select>

            <Select
                v-if="reportType === 'employment-status'"
                v-model="employmentType"
            >
                <SelectTrigger class="w-56">
                    <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem
                        v-for="option in employmentTypeOptions"
                        :key="option"
                        :value="option"
                    >
                        {{ option }}
                    </SelectItem>
                </SelectContent>
            </Select>

            <Select v-if="reportType === 'file-status'" v-model="fileStatus">
                <SelectTrigger class="w-56">
                    <SelectValue placeholder="All 201 file statuses" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all"> All 201 file statuses </SelectItem>
                    <SelectItem
                        v-for="option in fileStatusOptions"
                        :key="option"
                        :value="option"
                    >
                        {{ option }}
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>

        <!-- Report table -->
        <div class="rounded-xl border bg-card shadow-sm">
            <div class="flex items-center justify-between border-b px-5 py-4">
                <h2 class="font-semibold">{{ reportTypeLabel }}</h2>
                <span
                    class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                >
                    {{ filtered.length }} records
                </span>
            </div>

            <!-- Masterlist: flat table -->
            <div v-if="reportType === 'masterlist'" class="overflow-x-auto">
                <table class="w-full min-w-[900px] text-sm">
                    <thead>
                        <tr
                            class="border-b text-left text-xs tracking-wide text-muted-foreground uppercase"
                        >
                            <th class="px-4 py-3 font-medium">No.</th>
                            <th class="px-4 py-3 font-medium">Employee ID</th>
                            <th class="px-4 py-3 font-medium">Name</th>
                            <th class="px-4 py-3 font-medium">Position</th>
                            <th class="px-4 py-3 font-medium">Department</th>
                            <th class="px-4 py-3 font-medium">Date hired</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(employee, index) in filtered"
                            :key="employee.id"
                            class="border-b transition-colors last:border-0 hover:bg-muted/40"
                        >
                            <td class="px-4 py-3 text-muted-foreground">
                                {{ index + 1 }}
                            </td>
                            <td class="px-4 py-3 font-medium">
                                {{ employee.no }}
                            </td>
                            <td class="px-4 py-3 font-medium">
                                {{ employee.name }}
                            </td>
                            <td class="px-4 py-3 text-muted-foreground">
                                {{ employee.position }}
                            </td>
                            <td class="px-4 py-3 text-muted-foreground">
                                {{ employee.department }}
                            </td>
                            <td class="px-4 py-3 text-muted-foreground">
                                {{ employee.hire_date }}
                            </td>
                        </tr>
                        <tr v-if="filtered.length === 0">
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

            <!-- 201 File Status: single flat table, driven by the filter -->
            <div v-else-if="reportType === 'file-status'" class="p-5">
                <div class="flex items-center gap-3">
                    <h3 class="font-semibold">{{ fileStatusTitle }}</h3>
                    <span
                        class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                    >
                        {{ filtered.length }}
                    </span>
                </div>
                <div class="mt-3 overflow-x-auto">
                    <table class="w-full min-w-[900px] text-sm">
                        <thead>
                            <tr
                                class="border-b text-left text-xs tracking-wide text-muted-foreground uppercase"
                            >
                                <th class="px-4 py-3 font-medium">No.</th>
                                <th class="px-4 py-3 font-medium">
                                    Employee ID
                                </th>
                                <th class="px-4 py-3 font-medium">Name</th>
                                <th class="px-4 py-3 font-medium">Position</th>
                                <th class="px-4 py-3 font-medium">
                                    Department
                                </th>
                                <th class="px-4 py-3 font-medium">
                                    Date hired
                                </th>
                                <th class="px-4 py-3 font-medium">
                                    201 file status
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="(employee, index) in filtered"
                                :key="employee.id"
                                class="border-b transition-colors last:border-0 hover:bg-muted/40"
                            >
                                <td class="px-4 py-3 text-muted-foreground">
                                    {{ index + 1 }}
                                </td>
                                <td class="px-4 py-3 font-medium">
                                    {{ employee.no }}
                                </td>
                                <td class="px-4 py-3 font-medium">
                                    {{ employee.name }}
                                </td>
                                <td class="px-4 py-3 text-muted-foreground">
                                    {{ employee.position }}
                                </td>
                                <td class="px-4 py-3 text-muted-foreground">
                                    {{ employee.department }}
                                </td>
                                <td class="px-4 py-3 text-muted-foreground">
                                    {{ employee.hire_date }}
                                </td>
                                <td class="px-4 py-3">
                                    <StatusBadge
                                        :status="employee.file_status"
                                    />
                                </td>
                            </tr>
                            <tr v-if="filtered.length === 0">
                                <td
                                    colspan="7"
                                    class="px-4 py-10 text-center text-sm text-muted-foreground"
                                >
                                    No records match the selected filters.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Employment Status: single flat table, driven by the filter -->
            <div v-else-if="reportType === 'employment-status'" class="p-5">
                <div class="flex items-center gap-3">
                    <h3 class="font-semibold">{{ employmentStatusTitle }}</h3>
                    <span
                        class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                    >
                        {{ filtered.length }}
                    </span>
                </div>
                <div class="mt-3 overflow-x-auto">
                    <table class="w-full min-w-[900px] text-sm">
                        <thead>
                            <tr
                                class="border-b text-left text-xs tracking-wide text-muted-foreground uppercase"
                            >
                                <th class="px-4 py-3 font-medium">No.</th>
                                <th class="px-4 py-3 font-medium">
                                    Employee ID
                                </th>
                                <th class="px-4 py-3 font-medium">Name</th>
                                <th class="px-4 py-3 font-medium">Position</th>
                                <th class="px-4 py-3 font-medium">
                                    Department
                                </th>
                                <th class="px-4 py-3 font-medium">
                                    Date hired
                                </th>
                                <th class="px-4 py-3 font-medium">
                                    Employee status
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="(employee, index) in filtered"
                                :key="employee.id"
                                class="border-b transition-colors last:border-0 hover:bg-muted/40"
                            >
                                <td class="px-4 py-3 text-muted-foreground">
                                    {{ index + 1 }}
                                </td>
                                <td class="px-4 py-3 font-medium">
                                    {{ employee.no }}
                                </td>
                                <td class="px-4 py-3 font-medium">
                                    {{ employee.name }}
                                </td>
                                <td class="px-4 py-3 text-muted-foreground">
                                    {{ employee.position }}
                                </td>
                                <td class="px-4 py-3 text-muted-foreground">
                                    {{ employee.department }}
                                </td>
                                <td class="px-4 py-3 text-muted-foreground">
                                    {{ employee.hire_date }}
                                </td>
                                <td class="px-4 py-3">
                                    <StatusBadge
                                        :status="employee.employment_type"
                                    />
                                </td>
                            </tr>
                            <tr v-if="filtered.length === 0">
                                <td
                                    colspan="7"
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
    </div>

    <!-- Print preview: official summary report matching the selected report type -->
    <RecordPrintModal
        v-if="showPreview"
        :heading="`${reportTypeLabel} preview — ${previewEmployees.length} employees`"
        subtitle="Official report · ready to print"
        @close="showPreview = false"
    >
        <ReportSummaryDocument
            :employees="previewEmployees"
            :variant="reportType"
        />
    </RecordPrintModal>
</template>
