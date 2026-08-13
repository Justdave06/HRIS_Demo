<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { ArrowLeft, Banknote, HeartHandshake, ShieldCheck } from '@lucide/vue';
import { computed } from 'vue';
import { useDemoBenefits } from '@/composables/useDemoBenefits';
import type { BenefitsEmployee } from '@/composables/useDemoBenefits';
import { useDemoEmployees } from '@/composables/useDemoEmployees';
import { useDemoLoans } from '@/composables/useDemoLoans';
import type { DemoBenefitPlan, DemoEnrollment } from '@/types';

const props = defineProps<{
    employee: {
        id: number;
        no: string;
        name: string;
        department: string;
        position: string;
    };
    employees: BenefitsEmployee[];
    plans: DemoBenefitPlan[];
    enrollments: DemoEnrollment[];
}>();

// Session-added employees (no server record) hydrate from sessionStorage, so
// the name and record shown here match the Employee Management module.
const { employeeFor, addedEmployees } = useDemoEmployees();

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

const displayEmployee = computed(
    () => employeeFor(props.employee.id) ?? props.employee,
);

// Session enrollments (filed from the portal / by staff) join the seeded
// list, so this page always reflects the latest state.
const { rows, formatMoney } = useDemoBenefits(
    allEmployees.value,
    props.plans,
    props.enrollments,
);

const { applications } = useDemoLoans();

const enrollments = computed(() =>
    rows.value.filter((row) => row.employee_id === props.employee.id),
);

const loans = computed(() =>
    applications.value.filter((loan) => loan.employee_id === props.employee.id),
);

const costs = computed(() => {
    const employeeCost = enrollments.value.reduce(
        (sum, row) => sum + row.employee_cost,
        0,
    );
    const employerCost = enrollments.value.reduce(
        (sum, row) => sum + row.employer_cost,
        0,
    );
    const outstanding = loans.value.reduce(
        (sum, loan) => (loan.status === 'Approved' ? sum + loan.amount : sum),
        0,
    );

    return { employeeCost, employerCost, outstanding };
});

const typeTone: Record<string, string> = {
    Government: 'bg-blue-50 text-blue-700 border-blue-200',
    Company: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Allowance: 'bg-violet-50 text-violet-700 border-violet-200',
};

const enrollmentTone: Record<string, string> = {
    Enrolled: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
    Declined: 'bg-red-50 text-red-700 border-red-200',
};

const loanTone: Record<string, string> = {
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
    Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Declined: 'bg-red-50 text-red-700 border-red-200',
};
</script>

<template>
    <Head :title="`${displayEmployee.name} — Benefits Record`" />

    <div class="mx-auto flex w-full max-w-7xl flex-col gap-6 pb-16">
        <!-- Header -->
        <div>
            <Link
                href="/demo/benefits/plans"
                class="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-blue-600"
            >
                <ArrowLeft class="size-3.5" />
                Back to Benefit Plans
            </Link>
            <div
                class="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
            >
                <div>
                    <h1
                        class="text-2xl font-bold tracking-tight text-slate-900"
                    >
                        {{ displayEmployee.name }}
                    </h1>
                    <p class="mt-1 text-sm text-slate-500">
                        {{ displayEmployee.no }} ·
                        {{ displayEmployee.position || '—' }} ·
                        {{ displayEmployee.department || '—' }}
                    </p>
                    <p class="mt-0.5 text-xs text-slate-400">
                        Benefits record · read-only overview
                    </p>
                </div>
                <span
                    class="inline-flex w-fit items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                >
                    <ShieldCheck class="size-3.5" />
                    Benefits Administration
                </span>
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
                        Active enrollments
                    </p>
                    <HeartHandshake class="size-4 text-emerald-600" />
                </div>
                <p class="mt-2 text-3xl font-bold text-slate-900 tabular-nums">
                    {{
                        enrollments.filter((row) => row.status === 'Enrolled')
                            .length
                    }}
                </p>
                <p class="mt-1 text-xs text-slate-500">
                    {{ enrollments.length }} total on file
                </p>
            </div>

            <div
                class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
                <div class="flex items-center justify-between">
                    <p
                        class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                    >
                        Employee cost / mo
                    </p>
                    <Banknote class="size-4 text-slate-500" />
                </div>
                <p class="mt-2 text-3xl font-bold text-slate-900 tabular-nums">
                    {{ formatMoney(costs.employeeCost, 0) }}
                </p>
                <p class="mt-1 text-xs text-slate-500">
                    Deducted from the payslip
                </p>
            </div>

            <div
                class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
                <div class="flex items-center justify-between">
                    <p
                        class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                    >
                        Employer cost / mo
                    </p>
                    <HeartHandshake class="size-4 text-blue-600" />
                </div>
                <p class="mt-2 text-3xl font-bold text-slate-900 tabular-nums">
                    {{ formatMoney(costs.employerCost, 0) }}
                </p>
                <p class="mt-1 text-xs text-slate-500">Paid by the company</p>
            </div>

            <div
                class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
                <div class="flex items-center justify-between">
                    <p
                        class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                    >
                        Loans outstanding
                    </p>
                    <Banknote class="size-4 text-amber-600" />
                </div>
                <p class="mt-2 text-3xl font-bold text-slate-900 tabular-nums">
                    {{ formatMoney(costs.outstanding, 0) }}
                </p>
                <p class="mt-1 text-xs text-slate-500">
                    Recovered from final pay if separated
                </p>
            </div>
        </div>

        <!-- Enrollments -->
        <div class="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div class="border-b px-5 py-4">
                <h2 class="font-semibold text-slate-900">Enrollments</h2>
                <p class="mt-0.5 text-xs text-slate-500">
                    Every benefit plan this employee is on, pending, or was
                    declined — with the monthly employee / employer share.
                </p>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full min-w-[720px] text-sm">
                    <thead>
                        <tr
                            class="border-b text-left text-xs tracking-wide text-muted-foreground uppercase"
                        >
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
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="row in enrollments"
                            :key="row.id"
                            class="border-b transition-colors last:border-0"
                        >
                            <td class="px-4 py-3">
                                <p class="font-medium text-slate-900">
                                    {{ row.plan }}
                                </p>
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
                                    :class="enrollmentTone[row.status]"
                                >
                                    {{ row.status }}
                                </span>
                            </td>
                        </tr>
                        <tr v-if="enrollments.length === 0">
                            <td
                                colspan="6"
                                class="px-4 py-10 text-center text-sm text-muted-foreground"
                            >
                                No enrollments on file.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Loans -->
        <div class="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div class="border-b px-5 py-4">
                <h2 class="font-semibold text-slate-900">Loans</h2>
                <p class="mt-0.5 text-xs text-slate-500">
                    Loan applications filed by the employee — approved loans
                    deduct monthly from payslips, and the unpaid balance is
                    recovered from offboarding final pay.
                </p>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full min-w-[720px] text-sm">
                    <thead>
                        <tr
                            class="border-b text-left text-xs tracking-wide text-muted-foreground uppercase"
                        >
                            <th class="px-4 py-3 font-medium">Type</th>
                            <th class="px-4 py-3 text-right font-medium">
                                Amount
                            </th>
                            <th class="px-4 py-3 text-right font-medium">
                                Monthly
                            </th>
                            <th class="px-4 py-3 font-medium">Term</th>
                            <th class="px-4 py-3 font-medium">Applied</th>
                            <th class="px-4 py-3 font-medium">Decided</th>
                            <th class="px-4 py-3 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="loan in loans"
                            :key="loan.id"
                            class="border-b transition-colors last:border-0"
                        >
                            <td class="px-4 py-3">
                                <p class="font-medium text-slate-900">
                                    {{ loan.type }}
                                </p>
                                <p class="text-xs text-slate-500">
                                    {{ loan.purpose }}
                                </p>
                            </td>
                            <td
                                class="px-4 py-3 text-right text-muted-foreground tabular-nums"
                            >
                                {{ formatMoney(loan.amount, 0) }}
                            </td>
                            <td
                                class="px-4 py-3 text-right text-muted-foreground tabular-nums"
                            >
                                {{ formatMoney(loan.monthly, 0) }}
                            </td>
                            <td
                                class="px-4 py-3 text-muted-foreground tabular-nums"
                            >
                                {{ loan.terms }} mo
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
                                    :class="loanTone[loan.status]"
                                >
                                    {{ loan.status }}
                                </span>
                            </td>
                        </tr>
                        <tr v-if="loans.length === 0">
                            <td
                                colspan="7"
                                class="px-4 py-10 text-center text-sm text-muted-foreground"
                            >
                                No loan applications on file.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Quick link back -->
        <Link
            href="/demo/benefits/plans"
            class="group flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50/60 p-5 transition-colors duration-200 hover:border-blue-300 hover:bg-blue-50"
        >
            <div class="flex items-center gap-3">
                <span class="rounded-lg bg-blue-600 p-2.5 text-white shadow-sm">
                    <ArrowLeft class="size-5" />
                </span>
                <div>
                    <p class="text-sm font-semibold text-slate-900">
                        Back to Benefit Plans
                    </p>
                    <p class="text-xs text-slate-500">
                        Review enrollments and loan applications, or open any
                        employee's full record.
                    </p>
                </div>
            </div>
            <ArrowLeft
                class="size-4 rotate-180 text-blue-600 transition-transform duration-200 group-hover:translate-x-0.5"
            />
        </Link>
    </div>
</template>
