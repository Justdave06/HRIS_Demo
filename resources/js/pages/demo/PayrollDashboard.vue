<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import {
    ArrowUpRight,
    Banknote,
    Calculator,
    CircleDollarSign,
    FileBarChart2,
    Users,
} from '@lucide/vue';
import type { LucideIcon } from '@lucide/vue';
import { computed } from 'vue';
import { useDemoEmployees } from '@/composables/useDemoEmployees';
import { useDemoPayroll } from '@/composables/useDemoPayroll';
import type {
    PayrollEmployee,
    PayrollPeriod,
} from '@/composables/useDemoPayroll';

const props = defineProps<{
    employees: PayrollEmployee[];
    periods: PayrollPeriod[];
}>();

// Employees added in Employee Management join payroll too.
const { addedEmployees } = useDemoEmployees();

const allEmployees = computed<PayrollEmployee[]>(() => [
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

const { payslipsFor, formatMoney } = useDemoPayroll(
    allEmployees.value,
    props.periods,
);

const currentPeriod = computed(
    () => props.periods[props.periods.length - 1]?.value ?? '',
);

const currentPeriodLabel = computed(
    () => props.periods[props.periods.length - 1]?.label ?? '',
);

const payslips = computed(() => payslipsFor(currentPeriod.value));

const totalGross = computed(() =>
    payslips.value.reduce((sum, row) => sum + row.gross, 0),
);

const totalDeductions = computed(() =>
    payslips.value.reduce((sum, row) => sum + row.deductions, 0),
);

const totalNet = computed(() =>
    payslips.value.reduce((sum, row) => sum + row.net, 0),
);

const pendingCount = computed(
    () => payslips.value.filter((row) => row.status === 'Pending').length,
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
        label: 'Employees on payroll',
        value: String(allEmployees.value.length),
        icon: Users,
        iconClass: 'bg-blue-50 text-blue-700',
        href: '/demo/payroll/payslips',
    },
    {
        label: 'Gross payroll',
        value: formatMoney(totalGross.value, 0),
        icon: CircleDollarSign,
        iconClass: 'bg-emerald-50 text-emerald-700',
        href: '/demo/payroll/payslips',
    },
    {
        label: 'Deductions',
        value: formatMoney(totalDeductions.value, 0),
        icon: Calculator,
        iconClass: 'bg-amber-50 text-amber-700',
        href: '/demo/payroll/payslips',
    },
    {
        label: 'Net payroll',
        value: formatMoney(totalNet.value, 0),
        icon: Banknote,
        iconClass: 'bg-indigo-50 text-indigo-700',
        href: '/demo/payroll/payslips',
    },
];

// Top 5 departments by gross pay for the vertical bar chart.
const departmentRows = computed(() => {
    const byDepartment = new Map<string, number>();

    for (const row of payslips.value) {
        byDepartment.set(
            row.department,
            (byDepartment.get(row.department) ?? 0) + row.gross,
        );
    }

    return [...byDepartment.entries()]
        .map(([department, gross]) => ({ department, gross }))
        .sort((a, b) => b.gross - a.gross)
        .slice(0, 5);
});

const maxGross = computed(() =>
    Math.max(...departmentRows.value.map((row) => row.gross), 1),
);

const latestPayslips = computed(() =>
    [...payslips.value].sort((a, b) => b.net - a.net).slice(0, 5),
);

const statusTone: Record<string, string> = {
    Paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
};
</script>

<template>
    <Head title="Dashboard — Payroll Management" />

    <div class="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">
            Dashboard
        </h1>

        <!-- Stats (clickable -> payslips for the current period) -->
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
                    View payslips
                    <ArrowUpRight class="size-3.5" />
                </p>
            </Link>
        </div>

        <!-- Chart + latest payslips -->
        <div class="grid gap-6 lg:grid-cols-2">
            <!-- Vertical bars: payroll by department -->
            <div class="rounded-xl border border-slate-200 bg-white p-5">
                <h2 class="font-semibold text-slate-900">
                    Payroll by department
                </h2>
                <p class="mt-0.5 text-xs text-slate-500">
                    Gross pay for {{ currentPeriodLabel }}
                </p>

                <div class="mt-8 flex h-48 items-end gap-2 sm:gap-3">
                    <div
                        v-for="row in departmentRows"
                        :key="row.department"
                        class="relative flex min-w-0 flex-1 flex-col items-center justify-end self-stretch"
                    >
                        <span
                            class="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-slate-600 tabular-nums"
                        >
                            {{ formatMoney(row.gross, 0) }}
                        </span>
                        <div
                            class="w-full max-w-9 rounded-t-md bg-blue-600 transition-colors duration-200 hover:bg-blue-500"
                            :title="`${row.department}: ${formatMoney(row.gross)}`"
                            :style="{
                                height: `${(row.gross / maxGross) * 88}%`,
                            }"
                        ></div>
                    </div>
                </div>
                <div class="mt-1.5 flex gap-2 sm:gap-3">
                    <div
                        v-for="row in departmentRows"
                        :key="row.department"
                        class="min-w-0 flex-1"
                    >
                        <p
                            class="truncate text-center text-[10px] leading-tight text-slate-500"
                            :title="row.department"
                        >
                            {{ row.department }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Latest payslips -->
            <div class="rounded-xl border border-slate-200 bg-white p-5">
                <div class="flex items-center justify-between">
                    <h2 class="font-semibold text-slate-900">
                        Latest payslips
                    </h2>
                    <Link
                        href="/demo/payroll/payslips"
                        class="inline-flex items-center gap-1 text-xs font-medium text-blue-600 transition-colors hover:text-blue-800"
                    >
                        View all
                        <ArrowUpRight class="size-3.5" />
                    </Link>
                </div>

                <div class="mt-4 space-y-3">
                    <div
                        v-for="row in latestPayslips"
                        :key="row.employee_id"
                        class="flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50/60 px-4 py-3"
                    >
                        <div class="min-w-0">
                            <p
                                class="truncate text-sm font-medium text-slate-800"
                            >
                                {{ row.name }}
                            </p>
                            <p class="mt-0.5 truncate text-xs text-slate-500">
                                {{ row.position }} ·
                                {{ row.department }}
                            </p>
                        </div>
                        <div class="flex shrink-0 items-center gap-2">
                            <span
                                class="text-sm font-semibold text-slate-900 tabular-nums"
                            >
                                {{ formatMoney(row.net) }}
                            </span>
                            <span
                                class="rounded-full border px-2 py-0.5 text-xs font-medium"
                                :class="statusTone[row.status]"
                            >
                                {{ row.status }}
                            </span>
                        </div>
                    </div>

                    <p
                        v-if="latestPayslips.length === 0"
                        class="py-6 text-center text-sm text-slate-500"
                    >
                        No payslips yet.
                    </p>
                </div>
            </div>
        </div>

        <!-- Quick action -->
        <Link
            href="/demo/payroll/payslips"
            class="group flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50/60 p-5 transition-colors duration-200 hover:border-blue-300 hover:bg-blue-50"
        >
            <div class="flex items-center gap-3">
                <span class="rounded-lg bg-blue-600 p-2.5 text-white shadow-sm">
                    <FileBarChart2 class="size-5" />
                </span>
                <div>
                    <p class="text-sm font-semibold text-slate-900">
                        Run this month's payroll
                    </p>
                    <p class="text-xs text-slate-500">
                        {{ pendingCount }} payslip{{
                            pendingCount === 1 ? '' : 's'
                        }}
                        pending. Review every payslip, then run the payroll —
                        hours come from Attendance, unpaid days from declared
                        holidays.
                    </p>
                </div>
            </div>
            <ArrowUpRight
                class="size-4 text-blue-600 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
        </Link>
    </div>
</template>
