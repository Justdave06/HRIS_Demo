<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { FileBarChart2, FileSpreadsheet, Search } from '@lucide/vue';
import { computed, ref } from 'vue';
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
import type { DemoEmployee } from '@/types';

const props = defineProps<{
    employees: DemoEmployee[];
    departments: string[];
    positions: string[];
}>();

const position = ref('all');
const department = ref('all');
const employmentType = ref('all');
const fileStatus = ref('all');
const search = ref('');

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
    const headers = [
        'No.',
        'Employee ID',
        'Name',
        'Position',
        'Department',
        'Employee Status',
        'Date Hired',
        '201 File Status',
    ];
    const rows = filtered.value.map((employee, index) => [
        index + 1,
        employee.no,
        employee.name,
        employee.position,
        employee.department,
        employee.status,
        employee.hire_date,
        employee.file_status,
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
    link.download = 'employee-report.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();

    // Revoke on the next tick so the download starts before the URL is freed.
    setTimeout(() => URL.revokeObjectURL(url), 1000);
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

            <Select v-model="employmentType">
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

            <Select v-model="fileStatus">
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
                <h2 class="font-semibold">Employee report</h2>
                <span
                    class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                >
                    {{ filtered.length }} records
                </span>
            </div>

            <div class="overflow-x-auto">
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
                            <th class="px-4 py-3 font-medium">
                                Employee status
                            </th>
                            <th class="px-4 py-3 font-medium">Date hired</th>
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
                            <td class="px-4 py-3">
                                <StatusBadge
                                    :status="employee.employment_type"
                                />
                            </td>
                            <td class="px-4 py-3 text-muted-foreground">
                                {{ employee.hire_date }}
                            </td>
                            <td class="px-4 py-3">
                                <StatusBadge :status="employee.file_status" />
                            </td>
                        </tr>
                        <tr v-if="filtered.length === 0">
                            <td
                                colspan="8"
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

    <!-- Print preview: official summary report with Regular/Probationary/Contractual tables -->
    <RecordPrintModal
        v-if="showPreview"
        :heading="`Report preview — ${previewEmployees.length} employees`"
        subtitle="Official employee masterlist · ready to print"
        @close="showPreview = false"
    >
        <ReportSummaryDocument :employees="previewEmployees" />
    </RecordPrintModal>
</template>
