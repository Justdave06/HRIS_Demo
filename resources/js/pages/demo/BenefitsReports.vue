<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { FileBarChart2, FileSpreadsheet, Search } from '@lucide/vue';
import { computed, ref } from 'vue';
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
import { useDemoBenefits } from '@/composables/useDemoBenefits';
import type { BenefitsEmployee } from '@/composables/useDemoBenefits';
import type { DemoBenefitPlan, DemoEnrollment } from '@/types';

const props = defineProps<{
    employees: BenefitsEmployee[];
    plans: DemoBenefitPlan[];
    enrollments: DemoEnrollment[];
}>();

const { rows, planSummary, formatMoney } = useDemoBenefits(
    props.employees,
    props.plans,
    props.enrollments,
);

/* ------------------------------------------------------------------ */
/* Report type + filters                                               */
/* ------------------------------------------------------------------ */

const reportTypes = [
    { value: 'enrollment', label: 'Enrollment Summary Report' },
    { value: 'contributions', label: 'Contributions Report' },
    { value: 'plans', label: 'Plan Cost Report' },
    { value: 'allowances', label: 'Allowances Report' },
] as const;

type ReportType = (typeof reportTypes)[number]['value'];

const reportType = ref<ReportType>('enrollment');
const search = ref('');

const term = computed(() => search.value.trim().toLowerCase());

const match = (name: string): boolean =>
    term.value === '' || name.toLowerCase().includes(term.value);

const enrollmentRows = computed(() =>
    rows.value
        .filter(
            (row) =>
                match(row.employee_name) ||
                match(row.plan) ||
                match(row.department),
        )
        .map((row, index) => ({
            no: index + 1,
            name: row.employee_name,
            department: row.department,
            plan: row.plan,
            coverage: row.coverage,
            employee_cost: row.employee_cost,
            employer_cost: row.employer_cost,
            status: row.status,
        })),
);

// Contributions Report: one row per employee with their government shares.
const contributionRows = computed(() => {
    const govRows = rows.value.filter((row) => row.plan_type === 'Government');
    const byEmployee = new Map<
        number,
        {
            name: string;
            department: string;
            sss: number;
            philhealth: number;
            pagibig: number;
        }
    >();

    for (const row of govRows) {
        const entry = byEmployee.get(row.employee_id) ?? {
            name: row.employee_name,
            department: row.department,
            sss: 0,
            philhealth: 0,
            pagibig: 0,
        };

        if (row.plan === 'SSS') {
            entry.sss = row.employee_cost;
        } else if (row.plan === 'PhilHealth') {
            entry.philhealth = row.employee_cost;
        } else if (row.plan === 'Pag-IBIG') {
            entry.pagibig = row.employee_cost;
        }

        byEmployee.set(row.employee_id, entry);
    }

    return [...byEmployee.values()]
        .filter((row) => match(row.name))
        .map((row, index) => ({
            no: index + 1,
            name: row.name,
            department: row.department,
            sss: row.sss,
            philhealth: row.philhealth,
            pagibig: row.pagibig,
            total:
                Math.round((row.sss + row.philhealth + row.pagibig) * 100) /
                100,
        }));
});

const planCostRows = computed(() =>
    planSummary()
        .filter((plan) => match(plan.name))
        .map((plan, index) => {
            const employeeCost = rows.value
                .filter((row) => row.plan_id === plan.id)
                .reduce((sum, row) => sum + row.employee_cost, 0);

            return {
                no: index + 1,
                plan: plan.name,
                type: plan.type,
                enrolled: plan.enrolled,
                employee_cost: Math.round(employeeCost * 100) / 100,
                employer_cost: plan.employer_cost,
                total:
                    Math.round((employeeCost + plan.employer_cost) * 100) / 100,
            };
        }),
);

const allowanceRows = computed(() =>
    rows.value
        .filter((row) => row.plan_type === 'Allowance')
        .filter((row) => match(row.employee_name) || match(row.plan))
        .map((row, index) => ({
            no: index + 1,
            name: row.employee_name,
            department: row.department,
            plan: row.plan,
            amount: row.employer_cost,
            status: row.status,
        })),
);

/* ------------------------------------------------------------------ */
/* Generate / export                                                   */
/* ------------------------------------------------------------------ */

const showPreview = ref(false);

const documentColumns = computed<
    { key: string; label: string; numeric?: boolean }[]
>(() => {
    if (reportType.value === 'enrollment') {
        return [
            { key: 'no', label: 'No.' },
            { key: 'name', label: 'Employee' },
            { key: 'department', label: 'Department' },
            { key: 'plan', label: 'Plan' },
            { key: 'coverage', label: 'Coverage' },
            { key: 'employee_cost', label: 'Employee Cost', numeric: true },
            { key: 'employer_cost', label: 'Employer Cost', numeric: true },
            { key: 'status', label: 'Status' },
        ];
    }

    if (reportType.value === 'contributions') {
        return [
            { key: 'no', label: 'No.' },
            { key: 'name', label: 'Employee' },
            { key: 'department', label: 'Department' },
            { key: 'sss', label: 'SSS', numeric: true },
            { key: 'philhealth', label: 'PhilHealth', numeric: true },
            { key: 'pagibig', label: 'Pag-IBIG', numeric: true },
            { key: 'total', label: 'Total', numeric: true },
        ];
    }

    if (reportType.value === 'plans') {
        return [
            { key: 'no', label: 'No.' },
            { key: 'plan', label: 'Plan' },
            { key: 'type', label: 'Type' },
            { key: 'enrolled', label: 'Enrolled', numeric: true },
            { key: 'employee_cost', label: 'Employee Cost', numeric: true },
            { key: 'employer_cost', label: 'Employer Cost', numeric: true },
            { key: 'total', label: 'Total', numeric: true },
        ];
    }

    return [
        { key: 'no', label: 'No.' },
        { key: 'name', label: 'Employee' },
        { key: 'department', label: 'Department' },
        { key: 'plan', label: 'Allowance' },
        { key: 'amount', label: 'Monthly Amount', numeric: true },
        { key: 'status', label: 'Status' },
    ];
});

const documentRows = computed<Record<string, string | number>[]>(() => {
    if (reportType.value === 'enrollment') {
        return enrollmentRows.value;
    }

    if (reportType.value === 'contributions') {
        return contributionRows.value;
    }

    if (reportType.value === 'plans') {
        return planCostRows.value;
    }

    return allowanceRows.value;
});

const documentTitle = computed(
    () =>
        reportTypes.find((type) => type.value === reportType.value)?.label ??
        'Benefits Report',
);

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
    link.download = `benefits-${reportType.value}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const typeTone: Record<string, string> = {
    Government: 'bg-blue-50 text-blue-700 border-blue-200',
    Company: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Allowance: 'bg-violet-50 text-violet-700 border-violet-200',
};

const statusTone: Record<string, string> = {
    Enrolled: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
};
</script>

<template>
    <Head title="Reports — Benefits Administration" />

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
                    placeholder="Search name or plan…"
                    class="pl-9"
                />
            </div>
        </div>

        <!-- ================= ENROLLMENT ================= -->
        <div
            v-if="reportType === 'enrollment'"
            class="rounded-xl border border-slate-200 bg-white shadow-sm"
        >
            <div class="flex items-center justify-between border-b px-5 py-4">
                <h2 class="font-semibold text-slate-900">
                    Enrollment summary report
                </h2>
                <span
                    class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                >
                    {{ enrollmentRows.length }} enrollments
                </span>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full min-w-[950px] text-sm">
                    <thead>
                        <tr
                            class="border-b text-left text-xs tracking-wide text-muted-foreground uppercase"
                        >
                            <th class="px-4 py-3 font-medium">No.</th>
                            <th class="px-4 py-3 font-medium">Employee</th>
                            <th class="px-4 py-3 font-medium">Department</th>
                            <th class="px-4 py-3 font-medium">Plan</th>
                            <th class="px-4 py-3 font-medium">Coverage</th>
                            <th class="px-4 py-3 text-right font-medium">
                                Employee cost
                            </th>
                            <th class="px-4 py-3 text-right font-medium">
                                Employer cost
                            </th>
                            <th class="px-4 py-3 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="row in enrollmentRows"
                            :key="`${row.no}-${row.name}-${row.plan}`"
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
                                {{ row.plan }}
                            </td>
                            <td class="px-4 py-3 text-muted-foreground">
                                {{ row.coverage }}
                            </td>
                            <td
                                class="px-4 py-3 text-right text-muted-foreground tabular-nums"
                            >
                                {{ formatMoney(row.employee_cost) }}
                            </td>
                            <td
                                class="px-4 py-3 text-right text-muted-foreground tabular-nums"
                            >
                                {{ formatMoney(row.employer_cost) }}
                            </td>
                            <td class="px-4 py-3">
                                <span
                                    class="inline-flex rounded-full border px-2 py-0.5 text-xs font-medium"
                                    :class="statusTone[row.status]"
                                >
                                    {{ row.status }}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- ================= CONTRIBUTIONS ================= -->
        <div
            v-else-if="reportType === 'contributions'"
            class="rounded-xl border border-slate-200 bg-white shadow-sm"
        >
            <div class="flex items-center justify-between border-b px-5 py-4">
                <h2 class="font-semibold text-slate-900">
                    Contributions report
                </h2>
                <span
                    class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                >
                    {{ contributionRows.length }} employees
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
                            <th class="px-4 py-3 text-right font-medium">
                                SSS
                            </th>
                            <th class="px-4 py-3 text-right font-medium">
                                PhilHealth
                            </th>
                            <th class="px-4 py-3 text-right font-medium">
                                Pag-IBIG
                            </th>
                            <th class="px-4 py-3 text-right font-medium">
                                Total
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="row in contributionRows"
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
                            <td
                                class="px-4 py-3 text-right text-muted-foreground tabular-nums"
                            >
                                {{ formatMoney(row.sss) }}
                            </td>
                            <td
                                class="px-4 py-3 text-right text-muted-foreground tabular-nums"
                            >
                                {{ formatMoney(row.philhealth) }}
                            </td>
                            <td
                                class="px-4 py-3 text-right text-muted-foreground tabular-nums"
                            >
                                {{ formatMoney(row.pagibig) }}
                            </td>
                            <td
                                class="px-4 py-3 text-right font-semibold text-slate-900 tabular-nums"
                            >
                                {{ formatMoney(row.total) }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- ================= PLAN COST ================= -->
        <div
            v-else-if="reportType === 'plans'"
            class="rounded-xl border border-slate-200 bg-white shadow-sm"
        >
            <div class="flex items-center justify-between border-b px-5 py-4">
                <h2 class="font-semibold text-slate-900">Plan cost report</h2>
                <span
                    class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                >
                    {{ planCostRows.length }} plans
                </span>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full min-w-[800px] text-sm">
                    <thead>
                        <tr
                            class="border-b text-left text-xs tracking-wide text-muted-foreground uppercase"
                        >
                            <th class="px-4 py-3 font-medium">No.</th>
                            <th class="px-4 py-3 font-medium">Plan</th>
                            <th class="px-4 py-3 font-medium">Type</th>
                            <th class="px-4 py-3 text-right font-medium">
                                Enrolled
                            </th>
                            <th class="px-4 py-3 text-right font-medium">
                                Employee cost
                            </th>
                            <th class="px-4 py-3 text-right font-medium">
                                Employer cost
                            </th>
                            <th class="px-4 py-3 text-right font-medium">
                                Total
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="row in planCostRows"
                            :key="row.plan"
                            class="border-b transition-colors last:border-0 hover:bg-muted/40"
                        >
                            <td
                                class="px-4 py-3 text-muted-foreground tabular-nums"
                            >
                                {{ row.no }}
                            </td>
                            <td class="px-4 py-3 font-medium text-slate-900">
                                {{ row.plan }}
                            </td>
                            <td class="px-4 py-3">
                                <span
                                    class="inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium"
                                    :class="typeTone[row.type]"
                                >
                                    {{ row.type }}
                                </span>
                            </td>
                            <td class="px-4 py-3 text-right tabular-nums">
                                {{ row.enrolled }}
                            </td>
                            <td
                                class="px-4 py-3 text-right text-muted-foreground tabular-nums"
                            >
                                {{ formatMoney(row.employee_cost) }}
                            </td>
                            <td
                                class="px-4 py-3 text-right text-muted-foreground tabular-nums"
                            >
                                {{ formatMoney(row.employer_cost) }}
                            </td>
                            <td
                                class="px-4 py-3 text-right font-semibold text-slate-900 tabular-nums"
                            >
                                {{ formatMoney(row.total) }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- ================= ALLOWANCES ================= -->
        <div
            v-else
            class="rounded-xl border border-slate-200 bg-white shadow-sm"
        >
            <div class="flex items-center justify-between border-b px-5 py-4">
                <h2 class="font-semibold text-slate-900">Allowances report</h2>
                <span
                    class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                >
                    {{ allowanceRows.length }} allowances
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
                            <th class="px-4 py-3 font-medium">Allowance</th>
                            <th class="px-4 py-3 text-right font-medium">
                                Monthly amount
                            </th>
                            <th class="px-4 py-3 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="row in allowanceRows"
                            :key="`${row.no}-${row.plan}`"
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
                                {{ row.plan }}
                            </td>
                            <td
                                class="px-4 py-3 text-right font-semibold text-slate-900 tabular-nums"
                            >
                                {{ formatMoney(row.amount) }}
                            </td>
                            <td class="px-4 py-3">
                                <span
                                    class="inline-flex rounded-full border px-2 py-0.5 text-xs font-medium"
                                    :class="statusTone[row.status]"
                                >
                                    {{ row.status }}
                                </span>
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
        :heading="`${documentTitle} — ${documentRows.length} record${documentRows.length === 1 ? '' : 's'}`"
        subtitle="Official benefits document · ready to print"
        @close="showPreview = false"
    >
        <AttendanceReportDocument
            :title="documentTitle"
            :period="`As of ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`"
            system="Benefits Administration System"
            :columns="documentColumns"
            :rows="documentRows"
            note="Government contributions (SSS, PhilHealth, Pag-IBIG) use the same rates as Payroll, so the deduction lines stay consistent with payslips."
        />
    </RecordPrintModal>
</template>
