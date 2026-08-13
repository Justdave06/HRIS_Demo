<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import {
    ArrowLeft,
    ArrowUpRight,
    Banknote,
    CalendarDays,
    CheckCircle2,
    ClipboardCheck,
    FileSpreadsheet,
    LogOut,
    ShieldAlert,
    UserX,
} from '@lucide/vue';
import { computed } from 'vue';
import { toast } from 'vue-sonner';
import { Button } from '@/components/ui/button';
import { useDemoDisciplinary } from '@/composables/useDemoDisciplinary';
import { useDemoEmployees } from '@/composables/useDemoEmployees';
import { useDemoOffboarding } from '@/composables/useDemoOffboarding';
import type { OffboardingEmployee } from '@/composables/useDemoOffboarding';
import { cn } from '@/lib/utils';
import type {
    DemoDisciplinaryRecord,
    DemoOffboardingCase,
    DemoOffboardingRow,
} from '@/types';

const props = defineProps<{
    employee: {
        id: number;
        no: string;
        name: string;
        department: string;
        position: string;
    };
    employees: OffboardingEmployee[];
    cases: DemoOffboardingCase[];
    disciplinary: DemoDisciplinaryRecord[];
}>();

// Session-added employees (no server record) hydrate from sessionStorage,
// so the name and record shown here match the Employee Management module.
const { employeeFor } = useDemoEmployees();

const displayEmployee = computed(
    () => employeeFor(props.employee.id) ?? props.employee,
);

const allEmployees = computed<OffboardingEmployee[]>(() => {
    const added = employeeFor(props.employee.id);

    return [
        ...props.employees,
        ...(added
            ? [
                  {
                      id: added.id,
                      no: added.no,
                      name: added.name,
                      department: added.department,
                      position: added.position,
                      employment_type: added.employment_type,
                      salary: added.salary,
                      leave_balance: added.leave_balance,
                  },
              ]
            : []),
    ];
});

// Live Disciplinary handoff (Module 9) — seeded + session-escalated cases.
const { escalatedEmployeeIds } = useDemoDisciplinary(
    allEmployees.value,
    props.disciplinary,
);

const { rows, toggleTask } = useDemoOffboarding(
    allEmployees.value,
    props.cases,
    escalatedEmployeeIds.value.map((employee_id) => ({ employee_id })),
);

const row = computed<DemoOffboardingRow | undefined>(() =>
    rows.value.find((caseRow) => caseRow.employee_id === props.employee.id),
);

const statusTone: Record<string, string> = {
    Requested: 'bg-blue-50 text-blue-700 border-blue-200',
    'In Clearance': 'bg-amber-50 text-amber-700 border-amber-200',
    'Final Pay': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const pipeline = [
    'Requested',
    'In Clearance',
    'Final Pay',
    'Completed',
] as const;

const currentStage = computed(() =>
    row.value ? pipeline.indexOf(row.value.status) : -1,
);

const finalPayLines = computed(() => {
    if (!row.value) {
        return [];
    }

    const pay = row.value.finalPay;

    return [
        { label: 'Basic pay up to exit date', amount: pay.basic },
        { label: 'Unused leave conversion', amount: pay.leave_conversion },
        { label: 'Prorated 13th month', amount: pay.thirteenth_month },
        { label: 'Gross final pay', amount: pay.gross, emphasized: true },
        { label: 'SSS contribution', amount: -pay.sss },
        { label: 'PhilHealth contribution', amount: -pay.philhealth },
        { label: 'Pag-IBIG contribution', amount: -pay.pagibig },
        { label: 'Withholding tax', amount: -pay.tax },
        { label: 'Advances & loan recovery', amount: -pay.advances },
        { label: 'Net final pay', amount: pay.net, emphasized: true },
    ];
});

function formatMoney(value: number): string {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}

function toggle(index: number): void {
    if (row.value) {
        toggleTask(row.value.id, index);
    }
}

// Opens the read-only employee record overview — kept inside this module
// so the user stays in Separation & Offboarding (no edit actions).
function employeeProfileHref(): string {
    return props.employee.id >= 1001
        ? `/demo/offboarding/employees/session/${props.employee.id}`
        : `/demo/offboarding/employees/${props.employee.id}`;
}

function exportFinalPay(): void {
    if (!row.value) {
        return;
    }

    const headers = ['Item', 'Amount'];
    const lines = finalPayLines.value.map((line) => [line.label, line.amount]);
    const csv =
        '\uFEFF' +
        [headers, ...lines]
            .map((cells) =>
                cells
                    .map((cell) => `"${String(cell).replaceAll('"', '""')}"`)
                    .join(','),
            )
            .join('\n');
    const url = URL.createObjectURL(
        new Blob([csv], { type: 'text/csv;charset=utf-8;' }),
    );
    const link = document.createElement('a');

    link.href = url;
    link.download = `${displayEmployee.value.name.replaceAll(' ', '-').toLowerCase()}-final-pay.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success('Final pay breakdown exported (demo)');
}
</script>

<template>
    <Head :title="`${displayEmployee.name} — Offboarding Case`" />

    <div class="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <!-- Header -->
        <div
            class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
            <div>
                <Link
                    href="/demo/offboarding/cases"
                    class="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-blue-600"
                >
                    <ArrowLeft class="size-3.5" />
                    Back to Offboarding Register
                </Link>
                <h1
                    class="mt-2 text-2xl font-bold tracking-tight text-slate-900"
                >
                    {{ displayEmployee.name }}
                </h1>
                <p class="mt-1 text-sm text-slate-500">
                    {{ displayEmployee.no }} · {{ displayEmployee.position }} ·
                    {{ displayEmployee.department }}
                </p>
                <p class="mt-0.5 text-xs text-slate-400">
                    Separation & offboarding case
                </p>
            </div>
            <div class="flex flex-wrap gap-2">
                <Button variant="outline" @click="exportFinalPay">
                    <FileSpreadsheet class="size-4" />
                    Export final pay
                </Button>
                <Link
                    :href="employeeProfileHref()"
                    class="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
                >
                    Employee record
                    <ArrowUpRight class="ml-1.5 size-4" />
                </Link>
            </div>
        </div>

        <!-- Empty state: no case on file -->
        <div
            v-if="!row"
            class="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm"
        >
            <span
                class="mx-auto flex size-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500"
            >
                <LogOut class="size-6" />
            </span>
            <h2 class="mt-4 font-semibold text-slate-900">
                No separation case on file
            </h2>
            <p class="mx-auto mt-1 max-w-md text-sm text-slate-500">
                {{ displayEmployee.name }} has no active or archived separation
                case. Start one from the Offboarding Register.
            </p>
            <Link
                href="/demo/offboarding/cases"
                class="mt-5 inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
            >
                Go to Offboarding Register
            </Link>
        </div>

        <template v-else>
            <!-- Summary -->
            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div
                    class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                    <div class="flex items-center justify-between">
                        <p
                            class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                        >
                            Status
                        </p>
                        <span class="rounded-lg bg-blue-50 p-2 text-blue-700">
                            <LogOut class="size-4" />
                        </span>
                    </div>
                    <p
                        class="mt-2 text-3xl font-bold text-slate-900 tabular-nums"
                    >
                        {{ row.status }}
                    </p>
                    <p class="mt-1 text-xs text-slate-500">
                        {{ row.type }} · requested by {{ row.requested_by }} on
                        {{ row.requested_on }}
                    </p>
                </div>

                <div
                    class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                    <div class="flex items-center justify-between">
                        <p
                            class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                        >
                            Last working day
                        </p>
                        <span class="rounded-lg bg-amber-50 p-2 text-amber-700">
                            <CalendarDays class="size-4" />
                        </span>
                    </div>
                    <p
                        class="mt-2 text-3xl font-bold text-slate-900 tabular-nums"
                    >
                        {{ row.exit_date }}
                    </p>
                    <p class="mt-1 text-xs text-slate-500">
                        Final day of employment
                    </p>
                </div>

                <div
                    class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                    <div class="flex items-center justify-between">
                        <p
                            class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                        >
                            Clearance
                        </p>
                        <span
                            class="rounded-lg bg-indigo-50 p-2 text-indigo-700"
                        >
                            <ClipboardCheck class="size-4" />
                        </span>
                    </div>
                    <p
                        class="mt-2 text-3xl font-bold text-slate-900 tabular-nums"
                    >
                        {{ row.progress }}%
                    </p>
                    <p class="mt-1 text-xs text-slate-500">
                        {{ row.tasks.filter((task) => task.done).length }}
                        of {{ row.tasks.length }} tasks complete
                    </p>
                </div>

                <div
                    class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                    <div class="flex items-center justify-between">
                        <p
                            class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                        >
                            Final pay
                        </p>
                        <span
                            class="rounded-lg bg-emerald-50 p-2 text-emerald-700"
                        >
                            <Banknote class="size-4" />
                        </span>
                    </div>
                    <p
                        class="mt-2 text-3xl font-bold text-slate-900 tabular-nums"
                    >
                        {{
                            row.status === 'Final Pay' ||
                            row.status === 'Completed'
                                ? formatMoney(row.finalPay.net)
                                : 'Pending'
                        }}
                    </p>
                    <p class="mt-1 text-xs text-slate-500">
                        Settled with Payroll when ready
                    </p>
                </div>
            </div>

            <!-- Handoff note from Disciplinary -->
            <div
                v-if="row.flagged"
                class="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/60 p-4 text-sm text-red-900"
            >
                <ShieldAlert class="mt-0.5 size-4 shrink-0 text-red-600" />
                <div class="text-xs leading-relaxed">
                    <p class="font-semibold text-slate-900">
                        Handoff from Disciplinary
                    </p>
                    <p class="mt-1 text-slate-600">
                        This separation came from an escalated disciplinary case
                        (Module 9). Review the case notes on file before
                        finalizing.
                    </p>
                </div>
            </div>

            <div class="grid gap-6 lg:grid-cols-2">
                <!-- Clearance checklist -->
                <div class="rounded-xl border border-slate-200 bg-white p-5">
                    <div class="flex items-center justify-between">
                        <h2 class="font-semibold text-slate-900">
                            Exit clearance
                        </h2>
                        <span
                            class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                        >
                            {{ row.progress }}% complete
                        </span>
                    </div>
                    <p class="mt-0.5 text-xs text-slate-500">
                        Check items off as each department clears the employee.
                    </p>

                    <ul class="mt-4 space-y-2">
                        <li
                            v-for="(task, index) in row.tasks"
                            :key="task.label"
                        >
                            <button
                                type="button"
                                class="flex w-full items-start gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors"
                                :class="
                                    cn(
                                        task.done
                                            ? 'border-emerald-200 bg-emerald-50/60'
                                            : 'border-slate-200 bg-white hover:bg-slate-50',
                                    )
                                "
                                @click="toggle(index)"
                            >
                                <span
                                    class="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border"
                                    :class="
                                        task.done
                                            ? 'border-emerald-500 bg-emerald-500 text-white'
                                            : 'border-slate-300 text-transparent'
                                    "
                                >
                                    <CheckCircle2 class="size-3" />
                                </span>
                                <span
                                    class="text-sm"
                                    :class="
                                        task.done
                                            ? 'text-slate-400 line-through'
                                            : 'text-slate-700'
                                    "
                                >
                                    {{ task.label }}
                                </span>
                            </button>
                        </li>
                    </ul>

                    <p class="mt-3 text-[11px] text-slate-400">
                        Toggled items are kept in this browser tab only (demo).
                    </p>
                </div>

                <!-- Final pay breakdown -->
                <div class="rounded-xl border border-slate-200 bg-white p-5">
                    <div class="flex items-center justify-between">
                        <h2 class="font-semibold text-slate-900">Final pay</h2>
                        <span
                            class="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium"
                            :class="statusTone[row.status]"
                        >
                            {{ row.status }}
                        </span>
                    </div>
                    <p class="mt-0.5 text-xs text-slate-500">
                        Computed from the employee record — salary, unused leave
                        and statutory deductions.
                    </p>

                    <div class="mt-4 space-y-1.5">
                        <div
                            v-for="line in finalPayLines"
                            :key="line.label"
                            class="flex items-center justify-between gap-3 rounded-md px-3 py-2 text-sm"
                            :class="
                                line.emphasized
                                    ? 'bg-slate-100 font-semibold text-slate-900'
                                    : 'text-slate-600'
                            "
                        >
                            <span>{{ line.label }}</span>
                            <span
                                class="tabular-nums"
                                :class="
                                    line.amount < 0
                                        ? 'text-red-600'
                                        : line.emphasized
                                          ? 'text-slate-900'
                                          : 'text-slate-700'
                                "
                            >
                                {{ formatMoney(line.amount) }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pipeline timeline -->
            <div class="rounded-xl border border-slate-200 bg-white p-5">
                <h2 class="font-semibold text-slate-900">Case timeline</h2>
                <p class="mt-0.5 text-xs text-slate-500">
                    Requested → In Clearance → Final Pay → Completed
                </p>
                <ol
                    class="mt-5 flex flex-col gap-0 sm:flex-row sm:items-center"
                >
                    <li
                        v-for="(stage, index) in pipeline"
                        :key="stage"
                        class="relative flex flex-1 items-center gap-3 sm:flex-col sm:items-start"
                    >
                        <div
                            class="flex items-center gap-3 sm:flex-col sm:items-start"
                        >
                            <span
                                class="flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                                :class="
                                    index < currentStage
                                        ? 'bg-emerald-500 text-white'
                                        : index === currentStage
                                          ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                                          : 'bg-slate-100 text-slate-400'
                                "
                            >
                                <CheckCircle2
                                    v-if="index < currentStage"
                                    class="size-4"
                                />
                                <template v-else>{{ index + 1 }}</template>
                            </span>
                            <div>
                                <p
                                    class="text-sm font-medium"
                                    :class="
                                        index <= currentStage
                                            ? 'text-slate-900'
                                            : 'text-slate-400'
                                    "
                                >
                                    {{ stage }}
                                </p>
                                <p class="text-[10px] text-slate-400">
                                    {{
                                        index < currentStage
                                            ? 'Done'
                                            : index === currentStage
                                              ? 'Current stage'
                                              : 'Up next'
                                    }}
                                </p>
                            </div>
                        </div>
                        <span
                            v-if="index < pipeline.length - 1"
                            class="mx-1 hidden h-px flex-1 bg-slate-200 sm:block"
                        ></span>
                    </li>
                </ol>
            </div>

            <!-- Reason -->
            <div
                class="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-5"
            >
                <span
                    class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500"
                >
                    <UserX class="size-4" />
                </span>
                <div>
                    <p class="text-sm font-semibold text-slate-900">
                        Reason for separation
                    </p>
                    <p class="mt-1 text-sm text-slate-600">
                        {{ row.reason }}
                    </p>
                    <p class="mt-2 text-xs text-slate-400">
                        {{ row.type }} · requested by {{ row.requested_by }} on
                        {{ row.requested_on }} · last working day
                        {{ row.exit_date }}
                    </p>
                </div>
            </div>
        </template>

        <!-- Quick link back -->
        <Link
            href="/demo/offboarding/cases"
            class="group flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50/60 p-5 transition-colors duration-200 hover:border-blue-300 hover:bg-blue-50"
        >
            <div class="flex items-center gap-3">
                <span class="rounded-lg bg-blue-600 p-2.5 text-white shadow-sm">
                    <ArrowLeft class="size-5" />
                </span>
                <div>
                    <p class="text-sm font-semibold text-slate-900">
                        Back to Offboarding Register
                    </p>
                    <p class="text-xs text-slate-500">
                        Review all separation cases or start a new one.
                    </p>
                </div>
            </div>
            <ArrowUpRight
                class="size-4 text-blue-600 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
        </Link>
    </div>
</template>
