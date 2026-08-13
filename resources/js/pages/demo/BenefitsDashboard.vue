<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import {
    ArrowUpRight,
    BadgeCheck,
    FileBarChart2,
    HandCoins,
    PiggyBank,
    Users,
} from '@lucide/vue';
import type { LucideIcon } from '@lucide/vue';
import { computed } from 'vue';
import { useDemoBenefits } from '@/composables/useDemoBenefits';
import type { BenefitsEmployee } from '@/composables/useDemoBenefits';
import { useDemoEmployees } from '@/composables/useDemoEmployees';
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

const { rows, planSummary, formatMoney } = useDemoBenefits(
    allEmployees.value,
    props.plans,
    props.enrollments,
);

const enrolledEmployees = computed(
    () => new Set(rows.value.map((row) => row.employee_id)).size,
);

const activePlans = computed(
    () => new Set(rows.value.map((row) => row.plan_id)).size,
);

const employeeCost = computed(() =>
    rows.value.reduce((sum, row) => sum + row.employee_cost, 0),
);

const employerCost = computed(() =>
    rows.value.reduce((sum, row) => sum + row.employer_cost, 0),
);

type StatCard = {
    label: string;
    value: string;
    icon: LucideIcon;
    iconClass: string;
    href: string;
};

const statCards: StatCard[] = [
    {
        label: 'Enrolled employees',
        value: String(enrolledEmployees.value),
        icon: Users,
        iconClass: 'bg-blue-50 text-blue-700',
        href: '/demo/benefits/plans',
    },
    {
        label: 'Active plans',
        value: String(activePlans.value),
        icon: BadgeCheck,
        iconClass: 'bg-emerald-50 text-emerald-700',
        href: '/demo/benefits/plans',
    },
    {
        label: 'Employee cost / month',
        value: formatMoney(employeeCost.value, 0),
        icon: HandCoins,
        iconClass: 'bg-amber-50 text-amber-700',
        href: '/demo/benefits/plans',
    },
    {
        label: 'Employer cost / month',
        value: formatMoney(employerCost.value, 0),
        icon: PiggyBank,
        iconClass: 'bg-indigo-50 text-indigo-700',
        href: '/demo/benefits/plans',
    },
];

// Top 5 plans by enrollment count for the vertical bar chart.
const planRows = computed(() =>
    planSummary()
        .map((plan) => ({ name: plan.name, count: plan.enrolled }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5),
);

const maxCount = computed(() =>
    Math.max(...planRows.value.map((row) => row.count), 1),
);

const recent = computed(() =>
    [...rows.value].sort((a, b) => b.id - a.id).slice(0, 5),
);

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
</script>

<template>
    <Head title="Dashboard — Benefits Administration" />

    <div class="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">
            Dashboard
        </h1>

        <!-- Stats (clickable -> benefit plans) -->
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
                v-for="card in statCards"
                :key="card.label"
                :href="card.href"
                class="group rounded-xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
            >
                <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0">
                        <p
                            class="truncate text-sm font-medium text-slate-500 group-hover:text-blue-600"
                        >
                            {{ card.label }}
                        </p>
                        <p
                            class="mt-2 text-3xl font-bold tracking-tight text-slate-900 tabular-nums"
                        >
                            {{ card.value }}
                        </p>
                    </div>
                    <span
                        class="shrink-0 rounded-lg p-2.5"
                        :class="card.iconClass"
                    >
                        <component :is="card.icon" class="size-5" />
                    </span>
                </div>
                <p
                    class="mt-3 inline-flex items-center gap-1 text-xs font-medium text-blue-600 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                >
                    View plans
                    <ArrowUpRight class="size-3.5" />
                </p>
            </Link>
        </div>

        <!-- Chart + recent enrollments -->
        <div class="grid gap-6 lg:grid-cols-2">
            <!-- Vertical bars: enrollment by plan -->
            <div class="rounded-xl border border-slate-200 bg-white p-5">
                <h2 class="font-semibold text-slate-900">Enrollment by plan</h2>
                <p class="mt-0.5 text-xs text-slate-500">
                    Employees covered per benefit plan
                </p>

                <div class="mt-8 flex h-48 items-end gap-2 sm:gap-3">
                    <div
                        v-for="row in planRows"
                        :key="row.name"
                        class="relative flex min-w-0 flex-1 flex-col items-center justify-end self-stretch"
                    >
                        <span
                            class="absolute -top-5 left-1/2 -translate-x-1/2 text-[11px] font-semibold text-slate-600 tabular-nums"
                        >
                            {{ row.count }}
                        </span>
                        <div
                            class="w-full max-w-9 rounded-t-md bg-blue-600 transition-colors duration-200 hover:bg-blue-500"
                            :title="`${row.name}: ${row.count} employee${row.count === 1 ? '' : 's'}`"
                            :style="{
                                height: `${(row.count / maxCount) * 88}%`,
                            }"
                        ></div>
                    </div>
                </div>
                <div class="mt-1.5 flex gap-2 sm:gap-3">
                    <div
                        v-for="row in planRows"
                        :key="row.name"
                        class="min-w-0 flex-1"
                    >
                        <p
                            class="truncate text-center text-[10px] leading-tight text-slate-500"
                            :title="row.name"
                        >
                            {{ row.name }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Recent enrollments -->
            <div class="rounded-xl border border-slate-200 bg-white p-5">
                <div class="flex items-center justify-between">
                    <h2 class="font-semibold text-slate-900">
                        Recent enrollments
                    </h2>
                    <Link
                        href="/demo/benefits/plans"
                        class="inline-flex items-center gap-1 text-xs font-medium text-blue-600 transition-colors hover:text-blue-800"
                    >
                        View all
                        <ArrowUpRight class="size-3.5" />
                    </Link>
                </div>

                <div class="mt-4 space-y-3">
                    <div
                        v-for="row in recent"
                        :key="row.id"
                        class="flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50/60 px-4 py-3"
                    >
                        <div class="min-w-0">
                            <p
                                class="truncate text-sm font-medium text-slate-800"
                            >
                                {{ row.employee_name }}
                            </p>
                            <p class="mt-0.5 truncate text-xs text-slate-500">
                                <span
                                    class="mr-1.5 inline-flex rounded-full border px-1.5 py-px text-[10px] font-medium"
                                    :class="typeTone[row.plan_type]"
                                >
                                    {{ row.plan_type }}
                                </span>
                                {{ row.plan }} · effective
                                {{ row.effective }}
                            </p>
                        </div>
                        <div class="flex shrink-0 items-center gap-2">
                            <span
                                class="rounded-full border px-2 py-0.5 text-xs font-medium"
                                :class="statusTone[row.status]"
                            >
                                {{ row.status }}
                            </span>
                        </div>
                    </div>

                    <p
                        v-if="recent.length === 0"
                        class="py-6 text-center text-sm text-slate-500"
                    >
                        No enrollments yet.
                    </p>
                </div>
            </div>
        </div>

        <!-- Quick action -->
        <Link
            href="/demo/benefits/plans"
            class="group flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50/60 p-5 transition-colors duration-200 hover:border-blue-300 hover:bg-blue-50"
        >
            <div class="flex items-center gap-3">
                <span class="rounded-lg bg-blue-600 p-2.5 text-white shadow-sm">
                    <FileBarChart2 class="size-5" />
                </span>
                <div>
                    <p class="text-sm font-semibold text-slate-900">
                        Manage benefit plans & enrollments
                    </p>
                    <p class="text-xs text-slate-500">
                        Enroll employees in government plans, HMO, and
                        allowances. Government contributions use the same rates
                        as Payroll, keeping the deduction lines consistent.
                    </p>
                </div>
            </div>
            <ArrowUpRight
                class="size-4 text-blue-600 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
        </Link>
    </div>
</template>
