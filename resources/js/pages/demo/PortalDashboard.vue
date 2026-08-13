<script setup lang="ts">
import { Head, Link, router } from '@inertiajs/vue3';
import {
    Award,
    Banknote,
    BookOpen,
    CalendarCheck2,
    ClipboardCheck,
    Clock,
    HeartHandshake,
    LogOut,
    ShieldAlert,
    Target,
    User,
    X,
} from '@lucide/vue';
import { computed, onMounted, reactive, ref } from 'vue';
import { toast } from 'vue-sonner';
import AppLogoIcon from '@/components/AppLogoIcon.vue';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { useDemoDisciplinary } from '@/composables/useDemoDisciplinary';
import { useDemoEmployees } from '@/composables/useDemoEmployees';
import { useDemoLeave } from '@/composables/useDemoLeave';
import { useDemoLight } from '@/composables/useDemoLight';
import { useDemoLoans } from '@/composables/useDemoLoans';
import { LOAN_TYPES } from '@/composables/useDemoLoans';
import { useDemoOffboarding } from '@/composables/useDemoOffboarding';
import type { OffboardingEmployee } from '@/composables/useDemoOffboarding';
import { useDemoPayroll } from '@/composables/useDemoPayroll';
import { useDemoPortal } from '@/composables/useDemoPortal';
import { useDemoTraining } from '@/composables/useDemoTraining';
import { useInitials } from '@/composables/useInitials';
import type {
    DemoAttendance,
    DemoBenefitPlan,
    DemoDisciplinaryRecord,
    DemoEnrollment,
    DemoLeaveRequest,
    DemoLoanApplication,
    DemoOffboardingCase,
    DemoPayslip,
    DemoPerformanceGoal,
    DemoTrainingCourse,
    DemoTrainingEnrollment,
} from '@/types';

const props = defineProps<{
    employees: {
        id: number;
        no: string;
        name: string;
        department: string;
        position: string;
        status: string;
        employment_type: string;
        hire_date: string;
        salary: number;
        leave_balance: number;
        email: string;
        trainings: number;
        photo?: string;
    }[];
    attendance: DemoAttendance[];
    leave: DemoLeaveRequest[];
    periods: {
        value: string;
        label: string;
        status: 'Paid' | 'Pending';
    }[];
    goals: DemoPerformanceGoal[];
    trainings: DemoTrainingEnrollment[];
    courses: Record<number, DemoTrainingCourse>;
    disciplinary: DemoDisciplinaryRecord[];
    offboarding: DemoOffboardingCase[];
    plans: DemoBenefitPlan[];
    enrollments: DemoEnrollment[];
}>();

// The portal always renders light so it shares the same white canvas.
useDemoLight();

const { sessionId, logout } = useDemoPortal();
const { addedEmployees } = useDemoEmployees();
const { addedRequests, addRequest, statusFor, balanceFor } = useDemoLeave();
const { applyLoan, applicationsFor } = useDemoLoans();
const { getInitials } = useInitials();

// Session-added employees (HR added them in Employee Management) join the
// directory too, so they can log in with the credentials HR created.
const allEmployees = computed(() => [
    ...props.employees,
    ...addedEmployees.value.map((employee) => ({
        id: employee.id,
        no: employee.no,
        name: employee.name,
        department: employee.department,
        position: employee.position,
        status: employee.status,
        employment_type: employee.employment_type,
        hire_date: employee.hire_date,
        salary: employee.salary,
        leave_balance: employee.leave_balance,
        email: employee.email,
        trainings: employee.trainings,
        photo: employee.photo,
    })),
]);

// Benefit enrollments are enriched with the plan + monthly cost (same rates
// as Payroll), and session enrollments filed here join the seeded list.
const { rows: benefitRows, addEnrollment } = useDemoBenefits(
    allEmployees.value,
    props.plans,
    props.enrollments,
);

// The "My record" section is session-aware: a disciplinary case escalated or
// marked for dismissal during this session shows up here, and once HR hands
// the employee off to Separation & Offboarding the pending termination case
// appears too — mirroring what the modules show.
const { rows: disciplinaryRows, handedOffIds } = useDemoDisciplinary(
    allEmployees.value,
    props.disciplinary,
);

const { rows: offboardingRows } = useDemoOffboarding(
    allEmployees.value as OffboardingEmployee[],
    props.offboarding,
    handedOffIds.value.map((employee_id) => ({ employee_id })),
);

// Payslips and trainings come from the same live engines as the Payroll and
// Training modules, so a payslip HR marks Paid (or runs payroll) and a
// training enrollment/status change made during the session reflect here.
const { payslipsFor } = useDemoPayroll(allEmployees.value, props.periods);

const { rows: trainingRows } = useDemoTraining(
    allEmployees.value,
    Object.values(props.courses),
    props.trainings,
);

const employee = computed(() =>
    allEmployees.value.find((row) => row.id === sessionId.value),
);

onMounted(() => {
    if (sessionId.value === null) {
        router.visit('/demo/portal', { replace: true });
    }
});

function signOut(): void {
    logout();
    toast('Signed out of the employee portal');
    router.visit('/demo/portal');
}

/* ------------------------------------------------------------------ */
/* Derived data for this employee                                      */
/* ------------------------------------------------------------------ */

const myAttendance = computed<DemoAttendance | undefined>(() =>
    props.attendance.find((row) => row.employee_id === sessionId.value),
);

// Requests filed from the portal (session) join the server list, so a
// request filed here shows up immediately and lands in HR's Leave module
// for approval.
const myLeave = computed<DemoLeaveRequest[]>(() => {
    const base = props.leave.filter(
        (row) => row.employee_id === sessionId.value,
    );
    const added = addedRequests.value.filter(
        (row) => row.employee_id === sessionId.value,
    );

    return [...base, ...added].map((row) => ({
        ...row,
        status: statusFor(row),
    }));
});

const myPayslips = computed<DemoPayslip[]>(() => {
    if (sessionId.value === null) {
        return [];
    }

    return props.periods
        .map((period) =>
            payslipsFor(period.value).find(
                (row) => row.employee_id === sessionId.value,
            ),
        )
        .filter((row): row is DemoPayslip => row !== undefined);
});

const myGoals = computed<DemoPerformanceGoal[]>(() =>
    props.goals.filter((row) => row.employee_id === sessionId.value),
);

const myTrainings = computed(() =>
    trainingRows.value.filter(
        (row) => row.employee_id === sessionId.value,
    ),
);

const myDisciplinary = computed<DemoDisciplinaryRecord[]>(() =>
    disciplinaryRows.value.filter(
        (row) => row.employee_id === sessionId.value,
    ),
);

const myOffboarding = computed<DemoOffboardingCase | undefined>(() =>
    offboardingRows.value.find(
        (row) => row.employee_id === sessionId.value,
    ),
);

/** True when the separation was auto-created by a Disciplinary handoff. */
const handedOffCase = computed(
    () =>
        myOffboarding.value !== undefined &&
        myOffboarding.value.id >= 900000,
);

const leaveBalance = computed(() =>
    employee.value
        ? balanceFor(employee.value.id, employee.value.leave_balance)
        : 0,
);

const latestPayslip = computed(() => myPayslips.value[0]);

const myLoans = computed<DemoLoanApplication[]>(() =>
    sessionId.value === null ? [] : applicationsFor(sessionId.value),
);

const monthlyLoanDeduction = computed(() =>
    myLoans.value.reduce(
        (sum, loan) => (loan.status === 'Approved' ? sum + loan.monthly : sum),
        0,
    ),
);

const myEnrollments = computed(() =>
    benefitRows.value.filter((row) => row.employee_id === sessionId.value),
);

/* ------------------------------------------------------------------ */
/* Request leave — files into HR's Leave module (Pending)              */
/* ------------------------------------------------------------------ */

const leaveTypes = [
    'Vacation',
    'Sick',
    'Emergency',
    'Maternity',
    'Paternity',
] as const;

const showLeaveModal = ref(false);
const leaveDraft = reactive<{
    type: DemoLeaveRequest['type'];
    from: string;
    to: string;
    reason: string;
}>({
    type: 'Vacation',
    from: '',
    to: '',
    reason: '',
});

const leaveDays = computed(() => {
    if (!leaveDraft.from || !leaveDraft.to) {
        return 0;
    }

    let count = 0;
    const start = new Date(`${leaveDraft.from}T00:00:00`);
    const end = new Date(`${leaveDraft.to}T00:00:00`);

    while (start <= end) {
        const day = start.getDay();

        if (day !== 0 && day !== 6) {
            count += 1;
        }

        start.setDate(start.getDate() + 1);
    }

    return count;
});

function openLeaveModal(): void {
    leaveDraft.type = 'Vacation';
    leaveDraft.from = '';
    leaveDraft.to = '';
    leaveDraft.reason = '';
    showLeaveModal.value = true;
}

function submitLeave(): void {
    if (!leaveDraft.from || !leaveDraft.to) {
        toast.error('Pick the start and end dates');

        return;
    }

    if (leaveDraft.to < leaveDraft.from) {
        toast.error('End date cannot be before the start date');

        return;
    }

    if (leaveDays.value === 0) {
        toast.error('The dates fall on weekends only — pick working days');

        return;
    }

    if (sessionId.value === null) {
        toast.error('Sign in to file a leave request');

        return;
    }

    addRequest({
        employee_id: sessionId.value,
        type: leaveDraft.type,
        from: leaveDraft.from,
        to: leaveDraft.to,
        days: leaveDays.value,
        reason: leaveDraft.reason,
    });

    toast.success(
        `Leave request filed — ${leaveDays.value} day${leaveDays.value === 1 ? '' : 's'}, pending HR approval`,
    );
    showLeaveModal.value = false;
}

/* ------------------------------------------------------------------ */
/* Enroll in a benefit — goes to HR's Benefits module (Pending)        */
/* ------------------------------------------------------------------ */

const showBenefitsModal = ref(false);
const benefitDraft = reactive<{
    plan_id: number | '';
    coverage: DemoEnrollment['coverage'];
    effective: string;
}>({
    plan_id: '',
    coverage: 'Employee',
    effective: '',
});

function openBenefitsModal(): void {
    benefitDraft.plan_id = '';
    benefitDraft.coverage = 'Employee';
    benefitDraft.effective = new Date().toISOString().slice(0, 10);
    showBenefitsModal.value = true;
}

function submitEnrollment(): void {
    if (sessionId.value === null) {
        toast.error('Sign in to enroll in a benefit');

        return;
    }

    if (benefitDraft.plan_id === '') {
        toast.error('Choose a benefit plan');

        return;
    }

    if (!benefitDraft.effective) {
        toast.error('Pick the effective date');

        return;
    }

    const plan = props.plans.find((row) => row.id === benefitDraft.plan_id);

    addEnrollment({
        employee_id: sessionId.value,
        plan_id: benefitDraft.plan_id,
        coverage: benefitDraft.coverage,
        effective: benefitDraft.effective,
    });

    toast.success(`Enrolled in ${plan?.name ?? 'plan'} — pending HR approval`);
    showBenefitsModal.value = false;
}

/* ------------------------------------------------------------------ */
/* Apply for a loan — goes to HR's Benefits module (Pending)           */
/* ------------------------------------------------------------------ */

const showLoanModal = ref(false);
const loanDraft = reactive<{
    type: DemoLoanApplication['type'];
    amount: number;
    purpose: string;
    terms: number;
}>({
    type: 'SSS Salary Loan',
    amount: 0,
    purpose: '',
    terms: 12,
});

const loanMonthly = computed(() =>
    loanDraft.amount > 0 && loanDraft.terms > 0
        ? Math.round((loanDraft.amount / loanDraft.terms) * 100) / 100
        : 0,
);

function openLoanModal(): void {
    loanDraft.type = 'SSS Salary Loan';
    loanDraft.amount = 0;
    loanDraft.purpose = '';
    loanDraft.terms = 12;
    showLoanModal.value = true;
}

function submitLoan(): void {
    if (sessionId.value === null) {
        toast.error('Sign in to apply for a loan');

        return;
    }

    if (!loanDraft.amount || loanDraft.amount <= 0) {
        toast.error('Enter the loan amount');

        return;
    }

    applyLoan({
        employee_id: sessionId.value,
        type: loanDraft.type,
        amount: loanDraft.amount,
        purpose: loanDraft.purpose,
        terms: loanDraft.terms,
    });

    toast.success(`${loanDraft.type} application filed — pending HR approval`);
    showLoanModal.value = false;
}

/* ------------------------------------------------------------------ */
/* Formatting + tones                                                  */
/* ------------------------------------------------------------------ */

function formatMoney(value: number): string {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

const loanTone: Record<string, string> = {
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
    Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Declined: 'bg-red-50 text-red-700 border-red-200',
};

const benefitsTone: Record<string, string> = {
    Enrolled: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
    Declined: 'bg-red-50 text-red-700 border-red-200',
};

const leaveTone: Record<string, string> = {
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
    Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Declined: 'bg-red-50 text-red-700 border-red-200',
};

const goalTone: Record<string, string> = {
    'On Track': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Behind: 'bg-amber-50 text-amber-700 border-amber-200',
    'At Risk': 'bg-red-50 text-red-700 border-red-200',
};

const goalBarTone: Record<string, string> = {
    'On Track': 'bg-emerald-500',
    Behind: 'bg-amber-500',
    'At Risk': 'bg-red-500',
};

const payslipTone: Record<string, string> = {
    Paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
};
</script>

<template>
    <Head title="Employee Portal — HRIS Demo" />

    <div class="min-h-screen bg-background">
        <!-- Top bar -->
        <header class="sticky top-0 z-20 border-b bg-card/95 backdrop-blur">
            <div
                class="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-6"
            >
                <div class="flex items-center gap-3">
                    <div
                        class="flex size-9 items-center justify-center rounded-lg bg-blue-700 text-white"
                    >
                        <AppLogoIcon class="size-5 fill-current" />
                    </div>
                    <div class="leading-tight">
                        <p class="text-sm font-semibold">HRIS Demo</p>
                        <p class="text-xs text-muted-foreground">
                            Employee Portal
                        </p>
                    </div>
                </div>
                <div class="flex items-center gap-3">
                    <template v-if="employee">
                        <Avatar class="size-8 overflow-hidden rounded-lg">
                            <AvatarImage
                                v-if="employee.photo"
                                :src="employee.photo"
                                :alt="employee.name"
                                class="object-cover"
                            />
                            <AvatarFallback
                                v-else
                                class="rounded-lg bg-blue-600 text-xs font-bold text-white"
                            >
                                {{ getInitials(employee.name) }}
                            </AvatarFallback>
                        </Avatar>
                        <div class="hidden text-right leading-tight sm:block">
                            <p class="text-sm font-medium">
                                {{ employee.name }}
                            </p>
                            <p class="text-xs text-muted-foreground">
                                {{ employee.no }}
                            </p>
                        </div>
                    </template>
                    <Button
                        variant="outline"
                        size="sm"
                        class="text-slate-600 shadow-none hover:bg-slate-50 hover:text-slate-900"
                        @click="signOut"
                    >
                        <LogOut class="size-3.5" />
                        Log out
                    </Button>
                </div>
            </div>
        </header>

        <main class="mx-auto max-w-6xl px-6 py-8">
            <template v-if="employee">
                <!-- Greeting -->
                <div
                    class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
                >
                    <div>
                        <p
                            class="text-[11px] font-semibold tracking-wide text-blue-600 uppercase"
                        >
                            Employee self-service
                        </p>
                        <h1 class="mt-1 text-2xl font-bold tracking-tight">
                            Welcome back, {{ employee.name }}
                        </h1>
                        <p class="mt-1 text-sm text-muted-foreground">
                            {{ employee.no }} · {{ employee.position }} ·
                            {{ employee.department }}
                        </p>
                    </div>
                    <span
                        class="inline-flex w-fit rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                    >
                        {{ employee.status }} · {{ employee.employment_type }}
                    </span>
                </div>

                <!-- Stat cards -->
                <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div
                        class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                        <div class="flex items-center justify-between">
                            <p
                                class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                            >
                                Leave balance
                            </p>
                            <CalendarCheck2 class="size-4 text-blue-600" />
                        </div>
                        <p
                            class="mt-2 text-3xl font-bold text-slate-900 tabular-nums"
                        >
                            {{ leaveBalance }}
                            <span class="text-sm font-medium text-slate-500">
                                days
                            </span>
                        </p>
                    </div>

                    <div
                        class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                        <div class="flex items-center justify-between">
                            <p
                                class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                            >
                                Attendance today
                            </p>
                            <Clock class="size-4 text-amber-600" />
                        </div>
                        <p
                            class="mt-2 text-3xl font-bold text-slate-900 tabular-nums"
                        >
                            {{ myAttendance?.status ?? 'Not Yet In' }}
                        </p>
                        <p class="mt-1 text-xs text-slate-500">
                            {{
                                myAttendance?.time_in
                                    ? `In ${myAttendance.time_in} · Out ${myAttendance.time_out ?? '—'}`
                                    : 'No time in recorded yet'
                            }}
                        </p>
                    </div>

                    <div
                        class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                        <div class="flex items-center justify-between">
                            <p
                                class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                            >
                                Latest payslip
                            </p>
                            <Banknote class="size-4 text-emerald-600" />
                        </div>
                        <p
                            class="mt-2 text-3xl font-bold text-slate-900 tabular-nums"
                        >
                            {{
                                latestPayslip
                                    ? formatMoney(latestPayslip.net)
                                    : '—'
                            }}
                        </p>
                        <p class="mt-1 text-xs text-slate-500">
                            {{
                                latestPayslip
                                    ? `${latestPayslip.period} · ${latestPayslip.status}`
                                    : 'No payslip on file'
                            }}
                        </p>
                    </div>

                    <div
                        class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                        <div class="flex items-center justify-between">
                            <p
                                class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                            >
                                Active goals
                            </p>
                            <Target class="size-4 text-indigo-600" />
                        </div>
                        <p
                            class="mt-2 text-3xl font-bold text-slate-900 tabular-nums"
                        >
                            {{ myGoals.length }}
                        </p>
                        <p class="mt-1 text-xs text-slate-500">
                            H2 2026 performance cycle
                        </p>
                    </div>
                </div>

                <!-- Sections -->
                <div class="mt-8 grid gap-6 lg:grid-cols-2">
                    <!-- Profile -->
                    <section
                        class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                        <div class="flex items-center gap-2">
                            <User class="size-4 text-blue-600" />
                            <h2 class="font-semibold">My profile</h2>
                        </div>
                        <dl
                            class="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm"
                        >
                            <div>
                                <dt
                                    class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                                >
                                    Email
                                </dt>
                                <dd class="mt-0.5 break-words text-slate-800">
                                    {{ employee.email || '—' }}
                                </dd>
                            </div>
                            <div>
                                <dt
                                    class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                                >
                                    Date hired
                                </dt>
                                <dd class="mt-0.5 text-slate-800">
                                    {{ employee.hire_date || '—' }}
                                </dd>
                            </div>
                            <div>
                                <dt
                                    class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                                >
                                    Employment type
                                </dt>
                                <dd class="mt-0.5 text-slate-800">
                                    {{ employee.employment_type }}
                                </dd>
                            </div>
                            <div>
                                <dt
                                    class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                                >
                                    Monthly salary
                                </dt>
                                <dd class="mt-0.5 text-slate-800 tabular-nums">
                                    {{
                                        employee.salary > 0
                                            ? formatMoney(employee.salary)
                                            : '—'
                                    }}
                                </dd>
                            </div>
                        </dl>
                    </section>

                    <!-- Leave -->
                    <section
                        class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                        <div class="flex items-center justify-between gap-3">
                            <div class="flex items-center gap-2">
                                <CalendarCheck2 class="size-4 text-blue-600" />
                                <h2 class="font-semibold">My leave</h2>
                            </div>
                            <Button
                                size="sm"
                                class="bg-blue-600 hover:bg-blue-700"
                                @click="openLeaveModal"
                            >
                                <CalendarCheck2 class="size-3.5" />
                                Request leave
                            </Button>
                        </div>
                        <p class="mt-0.5 text-xs text-slate-500">
                            {{ leaveBalance }} day{{
                                leaveBalance === 1 ? '' : 's'
                            }}{{ ' ' }}of leave balance on file. Requests go to
                            HR for approval.
                        </p>
                        <ul class="mt-3 space-y-2">
                            <li
                                v-for="request in myLeave.slice(0, 4)"
                                :key="request.id"
                                class="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                            >
                                <div class="min-w-0">
                                    <p class="font-medium text-slate-800">
                                        {{ request.type }} leave
                                    </p>
                                    <p class="text-xs text-slate-500">
                                        {{ request.from }} – {{ request.to }} ·
                                        {{ request.days }} day{{
                                            request.days === 1 ? '' : 's'
                                        }}
                                    </p>
                                </div>
                                <span
                                    class="inline-flex shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium"
                                    :class="leaveTone[request.status]"
                                >
                                    {{ request.status }}
                                </span>
                            </li>
                            <li
                                v-if="myLeave.length === 0"
                                class="rounded-lg border border-dashed border-slate-200 px-3 py-4 text-center text-xs text-slate-400"
                            >
                                No leave requests on file — request one above.
                            </li>
                        </ul>
                    </section>

                    <!-- Loans -->
                    <section
                        class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                        <div class="flex items-center justify-between gap-3">
                            <div class="flex items-center gap-2">
                                <Banknote class="size-4 text-emerald-600" />
                                <h2 class="font-semibold">My loans</h2>
                            </div>
                            <Button
                                size="sm"
                                class="bg-blue-600 hover:bg-blue-700"
                                @click="openLoanModal"
                            >
                                <Banknote class="size-3.5" />
                                Apply for loan
                            </Button>
                        </div>
                        <p class="mt-0.5 text-xs text-slate-500">
                            Applications go to HR (Benefits) for approval.
                            Approved loans deduct
                            {{ formatMoney(monthlyLoanDeduction) }}/mo from your
                            payslip.
                        </p>
                        <ul class="mt-3 space-y-2">
                            <li
                                v-for="loan in myLoans.slice(0, 4)"
                                :key="loan.id"
                                class="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                            >
                                <div class="min-w-0">
                                    <p class="font-medium text-slate-800">
                                        {{ loan.type }}
                                    </p>
                                    <p class="text-xs text-slate-500">
                                        {{ formatMoney(loan.amount) }} ·
                                        {{ loan.terms }} month{{
                                            loan.terms === 1 ? '' : 's'
                                        }}
                                        · {{ formatMoney(loan.monthly) }}/mo
                                    </p>
                                </div>
                                <span
                                    class="inline-flex shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium"
                                    :class="loanTone[loan.status]"
                                >
                                    {{ loan.status }}
                                </span>
                            </li>
                            <li
                                v-if="myLoans.length === 0"
                                class="rounded-lg border border-dashed border-slate-200 px-3 py-4 text-center text-xs text-slate-400"
                            >
                                No loan applications — apply for one above.
                            </li>
                        </ul>
                    </section>

                    <!-- Benefits -->
                    <section
                        class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                        <div class="flex items-center justify-between gap-3">
                            <div class="flex items-center gap-2">
                                <HeartHandshake
                                    class="size-4 text-emerald-600"
                                />
                                <h2 class="font-semibold">My benefits</h2>
                            </div>
                            <Button
                                size="sm"
                                class="bg-blue-600 hover:bg-blue-700"
                                @click="openBenefitsModal"
                            >
                                <HeartHandshake class="size-3.5" />
                                Enroll in benefit
                            </Button>
                        </div>
                        <p class="mt-0.5 text-xs text-slate-500">
                            Enrollments go to HR (Benefits) for approval.
                        </p>
                        <ul class="mt-3 space-y-2">
                            <li
                                v-for="enrollment in myEnrollments.slice(0, 4)"
                                :key="enrollment.id"
                                class="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                            >
                                <div class="min-w-0">
                                    <p class="font-medium text-slate-800">
                                        {{ enrollment.plan }}
                                    </p>
                                    <p class="text-xs text-slate-500">
                                        {{ enrollment.coverage }} ·
                                        {{
                                            formatMoney(
                                                enrollment.employee_cost,
                                            )
                                        }}
                                        /mo · since
                                        {{ enrollment.effective }}
                                    </p>
                                </div>
                                <span
                                    class="inline-flex shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium"
                                    :class="benefitsTone[enrollment.status]"
                                >
                                    {{ enrollment.status }}
                                </span>
                            </li>
                            <li
                                v-if="myEnrollments.length === 0"
                                class="rounded-lg border border-dashed border-slate-200 px-3 py-4 text-center text-xs text-slate-400"
                            >
                                No benefit enrollments — enroll above.
                            </li>
                        </ul>
                    </section>

                    <!-- Payslips -->
                    <section
                        class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                        <div class="flex items-center gap-2">
                            <Banknote class="size-4 text-emerald-600" />
                            <h2 class="font-semibold">My payslips</h2>
                        </div>
                        <ul class="mt-3 space-y-2">
                            <li
                                v-for="payslip in myPayslips.slice(0, 3)"
                                :key="payslip.period"
                                class="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                            >
                                <div>
                                    <p class="font-medium text-slate-800">
                                        {{ payslip.period }}
                                    </p>
                                    <p class="text-xs text-slate-500">
                                        Gross
                                        {{ formatMoney(payslip.gross) }}
                                    </p>
                                </div>
                                <div class="text-right">
                                    <p
                                        class="font-semibold text-slate-900 tabular-nums"
                                    >
                                        {{ formatMoney(payslip.net) }}
                                    </p>
                                    <span
                                        class="inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium"
                                        :class="payslipTone[payslip.status]"
                                    >
                                        {{ payslip.status }}
                                    </span>
                                </div>
                            </li>
                            <li
                                v-if="myPayslips.length === 0"
                                class="rounded-lg border border-dashed border-slate-200 px-3 py-4 text-center text-xs text-slate-400"
                            >
                                No payslips on file.
                            </li>
                        </ul>
                    </section>

                    <!-- Goals -->
                    <section
                        class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                        <div class="flex items-center gap-2">
                            <Target class="size-4 text-indigo-600" />
                            <h2 class="font-semibold">My goals</h2>
                        </div>
                        <ul class="mt-3 space-y-3">
                            <li
                                v-for="goal in myGoals.slice(0, 4)"
                                :key="goal.id"
                                class="rounded-lg border border-slate-200 px-3 py-2.5"
                            >
                                <div
                                    class="flex items-center justify-between gap-3"
                                >
                                    <p
                                        class="text-sm font-medium text-slate-800"
                                    >
                                        {{ goal.title }}
                                    </p>
                                    <span
                                        class="inline-flex shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium"
                                        :class="goalTone[goal.status]"
                                    >
                                        {{ goal.status }}
                                    </span>
                                </div>
                                <div class="mt-2 flex items-center gap-2">
                                    <div
                                        class="h-1.5 w-full overflow-hidden rounded-full bg-slate-200"
                                    >
                                        <div
                                            class="h-full rounded-full"
                                            :class="goalBarTone[goal.status]"
                                            :style="{
                                                width: `${goal.progress}%`,
                                            }"
                                        ></div>
                                    </div>
                                    <span
                                        class="text-xs font-medium text-slate-600 tabular-nums"
                                    >
                                        {{ goal.progress }}%
                                    </span>
                                </div>
                            </li>
                            <li
                                v-if="myGoals.length === 0"
                                class="rounded-lg border border-dashed border-slate-200 px-3 py-4 text-center text-xs text-slate-400"
                            >
                                No goals set for this cycle.
                            </li>
                        </ul>
                    </section>

                    <!-- Trainings -->
                    <section
                        class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                        <div class="flex items-center gap-2">
                            <BookOpen class="size-4 text-amber-600" />
                            <h2 class="font-semibold">My trainings</h2>
                        </div>
                        <ul class="mt-3 space-y-2">
                            <li
                                v-for="training in myTrainings.slice(0, 4)"
                                :key="training.id"
                                class="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                            >
                                <div class="min-w-0">
                                    <p
                                        class="truncate font-medium text-slate-800"
                                    >
                                        {{ training.title }}
                                    </p>
                                    <p class="text-xs text-slate-500">
                                        {{ training.status }}
                                    </p>
                                </div>
                                <span
                                    v-if="training.certificate_no"
                                    class="inline-flex shrink-0 items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700"
                                >
                                    <Award class="size-3" />
                                    Cert. {{ training.certificate_no }}
                                </span>
                            </li>
                            <li
                                v-if="myTrainings.length === 0"
                                class="rounded-lg border border-dashed border-slate-200 px-3 py-4 text-center text-xs text-slate-400"
                            >
                                No training enrollments on file.
                            </li>
                        </ul>
                    </section>

                    <!-- Record: disciplinary + offboarding -->
                    <section
                        class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                        <div class="flex items-center gap-2">
                            <ClipboardCheck class="size-4 text-slate-600" />
                            <h2 class="font-semibold">My record</h2>
                        </div>
                        <div class="mt-3 space-y-3">
                            <div
                                class="flex items-start gap-3 rounded-lg border border-slate-200 px-3 py-2.5"
                            >
                                <ShieldAlert
                                    class="mt-0.5 size-4 shrink-0 text-slate-500"
                                />
                                <div>
                                    <p
                                        class="text-sm font-medium text-slate-800"
                                    >
                                        Disciplinary record
                                    </p>
                                    <p class="text-xs text-slate-500">
                                        {{
                                            myDisciplinary.length === 0
                                                ? 'No disciplinary cases on file.'
                                                : `${myDisciplinary.length} case${myDisciplinary.length === 1 ? '' : 's'} — latest: ${myDisciplinary[0].status}`
                                        }}
                                    </p>
                                </div>
                            </div>
                            <div
                                class="flex items-start gap-3 rounded-lg border border-slate-200 px-3 py-2.5"
                            >
                                <LogOut
                                    class="mt-0.5 size-4 shrink-0 text-slate-500"
                                />
                                <div>
                                    <p
                                        class="text-sm font-medium text-slate-800"
                                    >
                                        Separation status
                                    </p>
                                    <p
                                        v-if="myOffboarding"
                                        class="text-xs text-slate-500"
                                    >
                                        {{ myOffboarding.type }} —
                                        {{ myOffboarding.status }} (exit
                                        {{ myOffboarding.exit_date }})
                                    </p>
                                    <span
                                        v-if="handedOffCase"
                                        class="mt-1.5 inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-700"
                                    >
                                        <ShieldAlert class="size-3" />
                                        Handed off from Disciplinary —
                                        pending processing
                                    </span>
                                    <p
                                        v-else
                                        class="text-xs text-slate-500"
                                    >
                                        No separation on file.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <footer
                    class="mt-10 border-t pt-6 text-center text-xs text-muted-foreground"
                >
                    <p>
                        HRIS Demo — everything here is sample data. The portal
                        shows your own records only; nothing is saved.
                    </p>
                    <p class="mt-1">
                        <Link
                            href="/"
                            class="font-medium text-blue-600 hover:underline"
                        >
                            Back to demo hub
                        </Link>
                    </p>
                </footer>
            </template>

            <template v-else>
                <div class="py-20 text-center">
                    <h2 class="text-lg font-semibold">Not signed in</h2>
                    <p class="mt-1 text-sm text-muted-foreground">
                        Log in with your employee email and temporary password.
                    </p>
                    <Link
                        href="/demo/portal"
                        class="mt-5 inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                    >
                        Go to portal login
                    </Link>
                </div>
            </template>
        </main>
    </div>

    <!-- Enroll in a benefit modal -->
    <Teleport to="body">
        <div
            v-if="showBenefitsModal"
            class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm sm:p-8"
            @click.self="showBenefitsModal = false"
        >
            <div
                class="flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl bg-white shadow-2xl"
            >
                <div
                    class="flex items-center justify-between border-b px-6 py-4"
                >
                    <div>
                        <h3 class="text-base font-bold text-slate-900">
                            Enroll in a benefit
                        </h3>
                        <p class="text-xs text-slate-500">
                            Filed for {{ employee?.name }} — goes to HR
                            (Benefits) for approval.
                        </p>
                    </div>
                    <button
                        type="button"
                        class="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900"
                        aria-label="Close"
                        @click="showBenefitsModal = false"
                    >
                        <X class="size-5" />
                    </button>
                </div>

                <div class="space-y-4 overflow-y-auto px-6 py-5">
                    <div class="flex flex-col gap-1.5">
                        <label
                            class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                        >
                            Benefit plan
                        </label>
                        <Select v-model="benefitDraft.plan_id">
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
                        <Select v-model="benefitDraft.coverage">
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
                        <Input v-model="benefitDraft.effective" type="date" />
                    </div>
                </div>

                <div class="flex justify-end gap-2 border-t px-6 py-4">
                    <Button variant="ghost" @click="showBenefitsModal = false">
                        Cancel
                    </Button>
                    <Button
                        class="bg-blue-600 hover:bg-blue-700"
                        @click="submitEnrollment"
                    >
                        <HeartHandshake class="size-4" />
                        Submit enrollment
                    </Button>
                </div>
            </div>
        </div>
    </Teleport>

    <!-- Apply for a loan modal -->
    <Teleport to="body">
        <div
            v-if="showLoanModal"
            class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm sm:p-8"
            @click.self="showLoanModal = false"
        >
            <div
                class="flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl bg-white shadow-2xl"
            >
                <div
                    class="flex items-center justify-between border-b px-6 py-4"
                >
                    <div>
                        <h3 class="text-base font-bold text-slate-900">
                            Apply for a loan
                        </h3>
                        <p class="text-xs text-slate-500">
                            Filed for {{ employee?.name }} — goes to HR
                            (Benefits) for approval.
                        </p>
                    </div>
                    <button
                        type="button"
                        class="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900"
                        aria-label="Close"
                        @click="showLoanModal = false"
                    >
                        <X class="size-5" />
                    </button>
                </div>

                <div class="space-y-4 overflow-y-auto px-6 py-5">
                    <div class="flex flex-col gap-1.5">
                        <label
                            class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                        >
                            Loan type
                        </label>
                        <Select v-model="loanDraft.type">
                            <SelectTrigger>
                                <SelectValue placeholder="Choose type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem
                                    v-for="option in LOAN_TYPES"
                                    :key="option"
                                    :value="option"
                                >
                                    {{ option }}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="flex flex-col gap-1.5">
                            <label
                                class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                            >
                                Amount (₱)
                            </label>
                            <Input
                                v-model.number="loanDraft.amount"
                                type="number"
                                min="0"
                                placeholder="e.g. 50000"
                            />
                        </div>
                        <div class="flex flex-col gap-1.5">
                            <label
                                class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                            >
                                Term (months)
                            </label>
                            <Input
                                v-model.number="loanDraft.terms"
                                type="number"
                                min="1"
                                placeholder="e.g. 12"
                            />
                        </div>
                    </div>

                    <p
                        v-if="loanMonthly > 0"
                        class="rounded-lg bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700"
                    >
                        {{ formatMoney(loanMonthly) }}/month for
                        {{ loanDraft.terms }} month{{
                            loanDraft.terms === 1 ? '' : 's'
                        }}
                    </p>

                    <div class="flex flex-col gap-1.5">
                        <label
                            class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                        >
                            Purpose
                        </label>
                        <Input
                            v-model="loanDraft.purpose"
                            placeholder="e.g. Tuition, medical, home repair"
                        />
                    </div>
                </div>

                <div class="flex justify-end gap-2 border-t px-6 py-4">
                    <Button variant="ghost" @click="showLoanModal = false">
                        Cancel
                    </Button>
                    <Button
                        class="bg-blue-600 hover:bg-blue-700"
                        @click="submitLoan"
                    >
                        <Banknote class="size-4" />
                        Submit application
                    </Button>
                </div>
            </div>
        </div>
    </Teleport>

    <!-- Request leave modal -->
    <Teleport to="body">
        <div
            v-if="showLeaveModal"
            class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm sm:p-8"
            @click.self="showLeaveModal = false"
        >
            <div
                class="flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl bg-white shadow-2xl"
            >
                <div
                    class="flex items-center justify-between border-b px-6 py-4"
                >
                    <div>
                        <h3 class="text-base font-bold text-slate-900">
                            Request leave
                        </h3>
                        <p class="text-xs text-slate-500">
                            Filed for {{ employee?.name }} — goes to HR for
                            approval.
                        </p>
                    </div>
                    <button
                        type="button"
                        class="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900"
                        aria-label="Close"
                        @click="showLeaveModal = false"
                    >
                        <X class="size-5" />
                    </button>
                </div>

                <div class="space-y-4 overflow-y-auto px-6 py-5">
                    <div class="flex flex-col gap-1.5">
                        <label
                            class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                        >
                            Leave type
                        </label>
                        <Select v-model="leaveDraft.type">
                            <SelectTrigger>
                                <SelectValue placeholder="Choose type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem
                                    v-for="option in leaveTypes"
                                    :key="option"
                                    :value="option"
                                >
                                    {{ option }}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="flex flex-col gap-1.5">
                            <label
                                class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                            >
                                From
                            </label>
                            <Input v-model="leaveDraft.from" type="date" />
                        </div>
                        <div class="flex flex-col gap-1.5">
                            <label
                                class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                            >
                                To
                            </label>
                            <Input v-model="leaveDraft.to" type="date" />
                        </div>
                    </div>

                    <p
                        v-if="leaveDays > 0"
                        class="rounded-lg bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700"
                    >
                        {{ leaveDays }} working day{{
                            leaveDays === 1 ? '' : 's'
                        }}
                        ({{ leaveDraft.from }} – {{ leaveDraft.to }})
                    </p>

                    <div class="flex flex-col gap-1.5">
                        <label
                            class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                        >
                            Reason
                        </label>
                        <Input
                            v-model="leaveDraft.reason"
                            placeholder="e.g. Family trip, medical appointment"
                        />
                    </div>
                </div>

                <div class="flex justify-end gap-2 border-t px-6 py-4">
                    <Button variant="ghost" @click="showLeaveModal = false">
                        Cancel
                    </Button>
                    <Button
                        class="bg-blue-600 hover:bg-blue-700"
                        @click="submitLeave"
                    >
                        <CalendarCheck2 class="size-4" />
                        Submit request
                    </Button>
                </div>
            </div>
        </div>
    </Teleport>
</template>
