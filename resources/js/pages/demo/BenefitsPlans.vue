<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import {
    FileBarChart2,
    FileSpreadsheet,
    HeartHandshake,
    Search,
    X,
} from '@lucide/vue';
import { computed, ref } from 'vue';
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
import { useDemoBenefits } from '@/composables/useDemoBenefits';
import type { BenefitsEmployee } from '@/composables/useDemoBenefits';
import type { DemoBenefitPlan, DemoEnrollment } from '@/types';

const props = defineProps<{
    employees: BenefitsEmployee[];
    plans: DemoBenefitPlan[];
    enrollments: DemoEnrollment[];
}>();

const { rows, addEnrollment, confirm, remove, planSummary, formatMoney } =
    useDemoBenefits(props.employees, props.plans, props.enrollments);

/* ------------------------------------------------------------------ */
/* Filters                                                            */
/* ------------------------------------------------------------------ */

const planFilter = ref('all');
const statusFilter = ref('all');
const search = ref('');

const filtered = computed(() => {
    const term = search.value.trim().toLowerCase();

    return rows.value.filter(
        (row) =>
            (planFilter.value === 'all' ||
                row.plan_id === Number(planFilter.value)) &&
            (statusFilter.value === 'all' ||
                row.status === statusFilter.value) &&
            (term === '' ||
                row.employee_name.toLowerCase().includes(term) ||
                row.employee_no.toLowerCase().includes(term) ||
                row.plan.toLowerCase().includes(term)),
    );
});

const typeTone: Record<string, string> = {
    Government: 'bg-blue-50 text-blue-700 border-blue-200',
    Company: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Allowance: 'bg-violet-50 text-violet-700 border-violet-200',
};

const statusTone: Record<string, string> = {
    Enrolled: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
};

/* ------------------------------------------------------------------ */
/* Enroll modal                                                        */
/* ------------------------------------------------------------------ */

const showModal = ref(false);
const draftEmployee = ref('');
const draftPlan = ref('');
const draftCoverage = ref<'Employee' | 'Employee + dependents'>('Employee');
const draftEffective = ref('');

const draftEmployeeOption = computed(() =>
    props.employees.find((row) => row.id === Number(draftEmployee.value)),
);

function openModal(): void {
    draftEmployee.value = '';
    draftPlan.value = '';
    draftCoverage.value = 'Employee';
    draftEffective.value = new Date().toISOString().slice(0, 10);
    showModal.value = true;
}

function submit(): void {
    if (!draftEmployee.value) {
        toast.error('Choose the employee to enroll');

        return;
    }

    if (!draftPlan.value) {
        toast.error('Choose a benefit plan');

        return;
    }

    if (!draftEffective.value) {
        toast.error('Pick the effective date');

        return;
    }

    const enrollment = addEnrollment({
        employee_id: Number(draftEmployee.value),
        plan_id: Number(draftPlan.value),
        coverage: draftCoverage.value,
        effective: draftEffective.value,
    });
    const plan = props.plans.find((row) => row.id === enrollment.plan_id);

    toast.success(
        `${draftEmployeeOption.value?.name ?? 'Employee'} enrolled in ${plan?.name ?? 'plan'} — pending confirmation`,
    );
    showModal.value = false;
}

/* ------------------------------------------------------------------ */
/* Actions                                                            */
/* ------------------------------------------------------------------ */

function confirmRow(id: number): void {
    confirm(id);
    toast.success('Enrollment confirmed — benefits are now active');
}

function removeRow(id: number): void {
    remove(id);
    toast('Enrollment withdrawn');
}

/* ------------------------------------------------------------------ */
/* Generate / export                                                   */
/* ------------------------------------------------------------------ */

const showPreview = ref(false);

const reportRows = computed(() =>
    filtered.value.map((row, index) => ({
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
        'Plan',
        'Coverage',
        'Employee Cost',
        'Employer Cost',
        'Status',
    ];
    const rowsCsv = reportRows.value.map((row) => [
        row.no,
        row.name,
        row.department,
        row.plan,
        row.coverage,
        row.employee_cost,
        row.employer_cost,
        row.status,
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
    link.download = 'benefit-enrollments.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
}
</script>

<template>
    <Head title="Benefit Plans — Benefits Administration" />

    <div class="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <!-- Header -->
        <div
            class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
            <div>
                <h1 class="text-2xl font-bold tracking-tight text-slate-900">
                    Benefit Plans
                </h1>
                <p class="mt-1 text-sm text-slate-500">
                    Government contributions use the same rates as Payroll, so
                    the deduction lines stay consistent with payslips.
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
                <Button
                    class="bg-blue-600 hover:bg-blue-700"
                    @click="openModal"
                >
                    <HeartHandshake class="size-4" />
                    Enroll
                </Button>
            </div>
        </div>

        <!-- Plans strip -->
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div
                v-for="plan in planSummary()"
                :key="plan.id"
                class="flex flex-col gap-1.5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
                <div class="flex items-center justify-between gap-2">
                    <p class="font-semibold text-slate-900">{{ plan.name }}</p>
                    <span
                        class="inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium"
                        :class="typeTone[plan.type]"
                    >
                        {{ plan.type }}
                    </span>
                </div>
                <p class="line-clamp-2 text-xs text-slate-500">
                    {{ plan.description }}
                </p>
                <div
                    class="mt-auto flex items-center justify-between pt-1 text-xs text-slate-600"
                >
                    <span class="tabular-nums">
                        {{ plan.enrolled }} enrolled
                    </span>
                    <span class="tabular-nums">
                        {{ formatMoney(plan.employer_cost, 0) }}/mo
                    </span>
                </div>
            </div>
        </div>

        <!-- Filters -->
        <div
            class="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
        >
            <Select v-model="planFilter">
                <SelectTrigger class="w-48">
                    <SelectValue placeholder="All plans" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All plans</SelectItem>
                    <SelectItem
                        v-for="plan in plans"
                        :key="plan.id"
                        :value="String(plan.id)"
                    >
                        {{ plan.name }}
                    </SelectItem>
                </SelectContent>
            </Select>

            <Select v-model="statusFilter">
                <SelectTrigger class="w-40">
                    <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="Enrolled">Enrolled</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
            </Select>

            <div class="relative w-64">
                <Search
                    class="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                    v-model="search"
                    placeholder="Search employee, ID or plan…"
                    class="pl-9"
                />
            </div>
        </div>

        <!-- Enrollments table -->
        <div class="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div class="flex items-center justify-between border-b px-5 py-4">
                <h2 class="font-semibold text-slate-900">Enrollments</h2>
                <span
                    class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                >
                    {{ filtered.length }} enrollment{{
                        filtered.length === 1 ? '' : 's'
                    }}
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
                            <th class="px-4 py-3 font-medium">Plan</th>
                            <th class="px-4 py-3 font-medium">Coverage</th>
                            <th class="px-4 py-3 font-medium">Effective</th>
                            <th class="px-4 py-3 text-right font-medium">
                                Employee cost
                            </th>
                            <th class="px-4 py-3 text-right font-medium">
                                Employer cost
                            </th>
                            <th class="px-4 py-3 font-medium">Status</th>
                            <th class="px-4 py-3 text-right font-medium">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(row, index) in filtered"
                            :key="row.id"
                            class="border-b transition-colors last:border-0 hover:bg-muted/40"
                        >
                            <td
                                class="px-4 py-3 text-muted-foreground tabular-nums"
                            >
                                {{ index + 1 }}
                            </td>
                            <td class="px-4 py-3">
                                <p class="font-medium text-slate-900">
                                    {{ row.employee_name }}
                                </p>
                                <p class="text-xs text-muted-foreground">
                                    {{ row.position }} ·
                                    {{ row.department }}
                                </p>
                            </td>
                            <td class="px-4 py-3">
                                <p class="text-slate-700">{{ row.plan }}</p>
                                <span
                                    class="mt-0.5 inline-flex rounded-full border px-1.5 py-px text-[10px] font-medium"
                                    :class="typeTone[row.plan_type]"
                                >
                                    {{ row.plan_type }}
                                </span>
                            </td>
                            <td class="px-4 py-3 text-muted-foreground">
                                {{ row.coverage }}
                            </td>
                            <td
                                class="px-4 py-3 text-muted-foreground tabular-nums"
                            >
                                {{ row.effective }}
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
                            <td class="px-4 py-3 text-right">
                                <div class="flex justify-end gap-2">
                                    <Button
                                        v-if="row.status === 'Pending'"
                                        size="sm"
                                        class="bg-blue-600 hover:bg-blue-700"
                                        @click="confirmRow(row.id)"
                                    >
                                        Confirm
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        class="text-slate-600 shadow-none hover:bg-slate-50 hover:text-slate-900"
                                        @click="removeRow(row.id)"
                                    >
                                        Remove
                                    </Button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="filtered.length === 0">
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
        </div>
    </div>

    <!-- Generate report preview -->
    <RecordPrintModal
        v-if="showPreview"
        :heading="`Benefits Enrollment Summary — ${reportRows.length} enrollments`"
        subtitle="Official benefits document · ready to print"
        @close="showPreview = false"
    >
        <AttendanceReportDocument
            title="Benefits Enrollment Summary"
            :period="`As of ${printedOn}`"
            system="Benefits Administration System"
            :columns="[
                { key: 'no', label: 'No.' },
                { key: 'name', label: 'Employee' },
                { key: 'department', label: 'Department' },
                { key: 'plan', label: 'Plan' },
                { key: 'coverage', label: 'Coverage' },
                { key: 'employee_cost', label: 'Employee Cost', numeric: true },
                { key: 'employer_cost', label: 'Employer Cost', numeric: true },
                { key: 'status', label: 'Status' },
            ]"
            :rows="reportRows"
            note="Government contributions (SSS, PhilHealth, Pag-IBIG) use the same rates as Payroll, so the deduction lines stay consistent with payslips."
        />
    </RecordPrintModal>

    <!-- Enroll modal -->
    <Teleport to="body">
        <div
            v-if="showModal"
            class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm sm:p-8"
            @click.self="showModal = false"
        >
            <div
                class="flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl bg-white shadow-2xl"
            >
                <div
                    class="flex items-center justify-between border-b px-6 py-4"
                >
                    <div>
                        <h3 class="text-base font-bold text-slate-900">
                            New enrollment
                        </h3>
                        <p class="text-xs text-muted-foreground">
                            Starts as Pending — confirm to activate.
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

                <div class="space-y-4 overflow-y-auto px-6 py-5">
                    <div class="flex flex-col gap-1.5">
                        <label
                            class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                        >
                            Employee
                        </label>
                        <Select v-model="draftEmployee">
                            <SelectTrigger>
                                <SelectValue placeholder="Choose employee" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem
                                    v-for="employee in employees"
                                    :key="employee.id"
                                    :value="String(employee.id)"
                                >
                                    {{ employee.name }} · {{ employee.no }}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <p
                            v-if="draftEmployeeOption"
                            class="text-xs text-slate-500"
                        >
                            {{ draftEmployeeOption.position }} ·
                            {{ draftEmployeeOption.department }}
                        </p>
                    </div>

                    <div class="flex flex-col gap-1.5">
                        <label
                            class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                        >
                            Benefit plan
                        </label>
                        <Select v-model="draftPlan">
                            <SelectTrigger>
                                <SelectValue placeholder="Choose plan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem
                                    v-for="plan in plans"
                                    :key="plan.id"
                                    :value="String(plan.id)"
                                >
                                    {{ plan.name }} · {{ plan.type }}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div class="flex flex-col gap-1.5">
                        <label
                            class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                        >
                            Coverage
                        </label>
                        <Select v-model="draftCoverage">
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Employee">
                                    Employee
                                </SelectItem>
                                <SelectItem value="Employee + dependents">
                                    Employee + dependents
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div class="flex flex-col gap-1.5">
                        <label
                            class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                        >
                            Effective date
                        </label>
                        <Input v-model="draftEffective" type="date" />
                    </div>
                </div>

                <div class="flex justify-end gap-2 border-t px-6 py-4">
                    <Button variant="ghost" @click="showModal = false">
                        Cancel
                    </Button>
                    <Button
                        class="bg-blue-600 hover:bg-blue-700"
                        @click="submit"
                    >
                        <HeartHandshake class="size-4" />
                        Save enrollment
                    </Button>
                </div>
            </div>
        </div>
    </Teleport>
</template>
