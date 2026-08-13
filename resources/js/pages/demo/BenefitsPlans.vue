<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3';
import {
    Banknote,
    Eye,
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
import { useDemoEmployees } from '@/composables/useDemoEmployees';
import { useDemoLoans } from '@/composables/useDemoLoans';
import { cn } from '@/lib/utils';
import type { DemoBenefitPlan, DemoEnrollment } from '@/types';

const props = defineProps<{
    employees: BenefitsEmployee[];
    plans: DemoBenefitPlan[];
    enrollments: DemoEnrollment[];
}>();

// Employees added in Employee Management can be enrolled too.
const { addedEmployees } = useDemoEmployees();

const allEmployees = computed<BenefitsEmployee[]>(() => [
    ...props.employees,
    ...addedEmployees.value.map((employee) => ({
        id: employee.id,
        no: employee.no,
        name: employee.name,
        department: employee.department,
        position: employee.position,
        salary: employee.salary,
    })),
]);

const {
    rows,
    addEnrollment,
    confirm,
    decline,
    remove,
    planSummary,
    formatMoney,
} = useDemoBenefits(allEmployees.value, props.plans, props.enrollments);

// Loan applications filed from the Employee Portal — reviewed here.
const { applications, setStatus } = useDemoLoans();

const loanRows = computed(() =>
    applications.value.map((loan) => {
        const employee = allEmployees.value.find(
            (row) => row.id === loan.employee_id,
        );

        return {
            ...loan,
            no: employee?.no ?? 'EMP-0000',
            name: employee?.name ?? 'New employee',
            department: employee?.department ?? '—',
            position: employee?.position ?? '—',
        };
    }),
);

const loanStatusTone: Record<string, string> = {
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
    Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Declined: 'bg-red-50 text-red-700 border-red-200',
};

function approveLoan(id: number): void {
    setStatus(id, 'Approved');
    toast.success(
        'Loan approved — monthly amortization will deduct from payslips',
    );
}

function declineLoan(id: number): void {
    setStatus(id, 'Declined');
    toast.error('Loan application declined');
}

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
    Declined: 'bg-red-50 text-red-700 border-red-200',
};

/* ------------------------------------------------------------------ */
/* Tabs: Enrollments / Loan applications                               */
/* ------------------------------------------------------------------ */

const activeTab = ref<'enrollments' | 'loans'>('enrollments');

/* ------------------------------------------------------------------ */
/* Loan applications — tab filters                                     */
/* ------------------------------------------------------------------ */

const loanSearch = ref('');

const filteredLoans = computed(() => {
    const term = loanSearch.value.trim().toLowerCase();

    return loanRows.value.filter(
        (loan) =>
            term === '' ||
            loan.name.toLowerCase().includes(term) ||
            loan.type.toLowerCase().includes(term),
    );
});

/* ------------------------------------------------------------------ */
/* Employee benefits record — opens the full-page record view          */
/* ------------------------------------------------------------------ */

function openRecord(employeeId: number): void {
    // Session-added employees (id 1001+) hydrate their record from
    // sessionStorage on the record page.
    if (employeeId >= 1001) {
        router.visit(`/demo/benefits/employees/session/${employeeId}`);

        return;
    }

    router.visit(`/demo/benefits/employees/${employeeId}`);
}

/* ------------------------------------------------------------------ */
/* Enroll modal                                                        */
/* ------------------------------------------------------------------ */

const showModal = ref(false);
const draftEmployee = ref('');
const draftPlan = ref('');
const draftCoverage = ref<'Employee' | 'Employee + dependents'>('Employee');
const draftEffective = ref('');

const draftEmployeeOption = computed(() =>
    allEmployees.value.find((row) => row.id === Number(draftEmployee.value)),
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

function approveRow(id: number): void {
    confirm(id);
    toast.success('Enrollment approved — benefits are now active');
}

function declineRow(id: number): void {
    decline(id);
    toast.error('Enrollment declined');
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

        <!-- Tabs: Enrollments / Loan applications (compact, left-aligned) -->
        <div
            class="sticky top-2 z-20 inline-flex w-fit rounded-xl border bg-card p-1 shadow-sm"
        >
            <button
                type="button"
                class="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors"
                :class="
                    cn(
                        activeTab === 'enrollments'
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    )
                "
                @click="activeTab = 'enrollments'"
            >
                <HeartHandshake class="size-4" />
                Enrollments
                <span
                    class="rounded-full px-1.5 py-px text-[10px] font-semibold tabular-nums"
                    :class="
                        activeTab === 'enrollments'
                            ? 'bg-primary-foreground/20'
                            : 'bg-muted'
                    "
                >
                    {{ rows.length }}
                </span>
            </button>
            <button
                type="button"
                class="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors"
                :class="
                    cn(
                        activeTab === 'loans'
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    )
                "
                @click="activeTab = 'loans'"
            >
                <Banknote class="size-4" />
                Loan applications
                <span
                    class="rounded-full px-1.5 py-px text-[10px] font-semibold tabular-nums"
                    :class="
                        activeTab === 'loans'
                            ? 'bg-primary-foreground/20'
                            : 'bg-muted'
                    "
                >
                    {{ applications.length }}
                </span>
            </button>
        </div>

        <!-- ============ ENROLLMENTS TAB ============ -->
        <div v-if="activeTab === 'enrollments'" class="flex flex-col gap-4">
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
                        <SelectItem value="Declined">Declined</SelectItem>
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
                <div
                    class="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4"
                >
                    <div class="flex items-center gap-3">
                        <h2 class="font-semibold text-slate-900">
                            Enrollments
                        </h2>
                        <span
                            class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                        >
                            {{ filtered.length }} enrollment{{
                                filtered.length === 1 ? '' : 's'
                            }}
                        </span>
                    </div>
                    <Button
                        class="bg-blue-600 hover:bg-blue-700"
                        @click="openModal"
                    >
                        <HeartHandshake class="size-4" />
                        Enroll
                    </Button>
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
                                            variant="outline"
                                            size="sm"
                                            class="text-slate-600 shadow-none hover:bg-slate-50 hover:text-slate-900"
                                            @click="openRecord(row.employee_id)"
                                        >
                                            <Eye class="size-3.5" />
                                            View
                                        </Button>
                                        <template
                                            v-if="row.status === 'Pending'"
                                        >
                                            <Button
                                                size="sm"
                                                class="bg-blue-600 hover:bg-blue-700"
                                                @click="approveRow(row.id)"
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                class="text-slate-600 shadow-none hover:bg-slate-50 hover:text-slate-900"
                                                @click="declineRow(row.id)"
                                            >
                                                Decline
                                            </Button>
                                        </template>
                                        <Button
                                            v-else
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

        <!-- ============ LOAN APPLICATIONS TAB ============ -->
        <div v-if="activeTab === 'loans'" class="flex flex-col gap-4">
            <div class="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div
                    class="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4"
                >
                    <div>
                        <h2 class="font-semibold text-slate-900">
                            Loan applications
                        </h2>
                        <p class="mt-0.5 text-xs text-slate-500">
                            Filed by employees in the portal. Approved loans
                            deduct their monthly amortization from payslips, and
                            the unpaid balance is recovered from offboarding
                            final pay.
                        </p>
                    </div>
                    <div class="relative w-64">
                        <Search
                            class="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                        />
                        <Input
                            v-model="loanSearch"
                            placeholder="Search employee or loan type…"
                            class="pl-9"
                        />
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full min-w-[950px] text-sm">
                        <thead>
                            <tr
                                class="border-b text-left text-xs tracking-wide text-muted-foreground uppercase"
                            >
                                <th class="px-4 py-3 font-medium">No.</th>
                                <th class="px-4 py-3 font-medium">Employee</th>
                                <th class="px-4 py-3 font-medium">Loan type</th>
                                <th class="px-4 py-3 text-right font-medium">
                                    Amount
                                </th>
                                <th class="px-4 py-3 text-right font-medium">
                                    Term
                                </th>
                                <th class="px-4 py-3 text-right font-medium">
                                    Monthly
                                </th>
                                <th class="px-4 py-3 font-medium">Purpose</th>
                                <th class="px-4 py-3 font-medium">Applied</th>
                                <th class="px-4 py-3 font-medium">Decided</th>
                                <th class="px-4 py-3 font-medium">Status</th>
                                <th class="px-4 py-3 text-right font-medium">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="(loan, index) in filteredLoans"
                                :key="loan.id"
                                class="border-b transition-colors last:border-0 hover:bg-muted/40"
                            >
                                <td
                                    class="px-4 py-3 text-muted-foreground tabular-nums"
                                >
                                    {{ index + 1 }}
                                </td>
                                <td class="px-4 py-3">
                                    <p class="font-medium text-slate-900">
                                        {{ loan.name }}
                                    </p>
                                    <p class="text-xs text-muted-foreground">
                                        {{ loan.position }} ·
                                        {{ loan.department }}
                                    </p>
                                </td>
                                <td class="px-4 py-3 text-slate-700">
                                    {{ loan.type }}
                                </td>
                                <td
                                    class="px-4 py-3 text-right text-muted-foreground tabular-nums"
                                >
                                    {{ formatMoney(loan.amount, 0) }}
                                </td>
                                <td
                                    class="px-4 py-3 text-right text-muted-foreground tabular-nums"
                                >
                                    {{ loan.terms }} mo
                                </td>
                                <td
                                    class="px-4 py-3 text-right text-muted-foreground tabular-nums"
                                >
                                    {{ formatMoney(loan.monthly, 0) }}
                                </td>
                                <td
                                    class="max-w-48 truncate px-4 py-3 text-muted-foreground"
                                    :title="loan.purpose"
                                >
                                    {{ loan.purpose }}
                                </td>
                                <td
                                    class="px-4 py-3 text-muted-foreground tabular-nums"
                                >
                                    {{ loan.applied_on }}
                                </td>
                                <td
                                    class="px-4 py-3 text-muted-foreground tabular-nums"
                                >
                                    {{ loan.decided_on || '—' }}
                                </td>
                                <td class="px-4 py-3">
                                    <span
                                        class="inline-flex rounded-full border px-2 py-0.5 text-xs font-medium"
                                        :class="loanStatusTone[loan.status]"
                                    >
                                        {{ loan.status }}
                                    </span>
                                </td>
                                <td class="px-4 py-3 text-right">
                                    <div
                                        class="flex items-center justify-end gap-2"
                                    >
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            class="text-slate-600 shadow-none hover:bg-slate-50 hover:text-slate-900"
                                            @click="
                                                openRecord(loan.employee_id)
                                            "
                                        >
                                            <Eye class="size-3.5" />
                                            View
                                        </Button>
                                        <template
                                            v-if="loan.status === 'Pending'"
                                        >
                                            <Button
                                                size="sm"
                                                class="bg-blue-600 hover:bg-blue-700"
                                                @click="approveLoan(loan.id)"
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                class="text-slate-600 shadow-none hover:bg-slate-50 hover:text-slate-900"
                                                @click="declineLoan(loan.id)"
                                            >
                                                Decline
                                            </Button>
                                        </template>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="filteredLoans.length === 0">
                                <td
                                    colspan="11"
                                    class="px-4 py-10 text-center text-sm text-muted-foreground"
                                >
                                    No loan applications match — employees apply
                                    from the Employee Portal.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
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
                            Starts as Pending — approve to activate.
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
                                    v-for="employee in allEmployees"
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
