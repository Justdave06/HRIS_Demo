<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import {
    ArrowLeft,
    Award,
    BookOpen,
    Briefcase,
    GraduationCap,
    ShieldCheck,
    User,
    UserCheck,
    Users,
} from '@lucide/vue';
import { computed, ref } from 'vue';
import type { EmployeeFormState } from '@/components/demo/employeeFormState';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useDemoEmployees } from '@/composables/useDemoEmployees';
import { useInitials } from '@/composables/useInitials';
import { cn } from '@/lib/utils';
import type { DemoEmployee } from '@/types';

const props = defineProps<{
    employee: DemoEmployee;
    record: EmployeeFormState | null;
}>();

const { employeeFor, formFor, blankForm } = useDemoEmployees();
const { getInitials } = useInitials();

// For session-added employees the server sends a placeholder row; use the
// real directory row kept in sessionStorage so the name and details match.
const displayEmployee = computed<DemoEmployee>(
    () => employeeFor(props.employee.id) ?? props.employee,
);

// The 201 file pre-filled with the employee's records on file. Seeded
// employees get it from the server; session-added employees (no server
// record) hydrate it from sessionStorage, falling back to a blank 201.
const record = computed<EmployeeFormState>(() => {
    if (props.record) {
        return JSON.parse(JSON.stringify(props.record)) as EmployeeFormState;
    }

    return formFor(props.employee.id) ?? blankForm();
});

const fullName = computed(() => displayEmployee.value.name);

// Back to the separation case this overview was opened from (stays inside
// the Separation & Offboarding module).
const backHref = computed(() =>
    props.employee.id >= 1001
        ? `/demo/offboarding/cases/session/${props.employee.id}`
        : `/demo/offboarding/cases/${props.employee.id}`,
);

function formatMoney(value: number): string {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

/* ------------------------------------------------------------------ */
/* Summary cards from the directory record                             */
/* ------------------------------------------------------------------ */

const summaryCards = computed(() => {
    const employee = displayEmployee.value;

    return [
        { label: 'Status', value: employee.status },
        { label: 'Employment type', value: employee.employment_type },
        { label: 'Date hired', value: employee.hire_date || '—' },
        {
            label: 'Monthly salary',
            value: employee.salary > 0 ? formatMoney(employee.salary) : '—',
        },
        {
            label: 'Leave balance',
            value: `${employee.leave_balance} day${employee.leave_balance === 1 ? '' : 's'}`,
        },
        { label: '201 file', value: employee.file_status },
    ];
});

/* ------------------------------------------------------------------ */
/* Tabs — same set as the editable 201 file, read-only                 */
/* ------------------------------------------------------------------ */

const tabs = [
    { key: 'personal', label: 'Personal data', icon: User },
    { key: 'dependents', label: 'Dependents', icon: Users },
    { key: 'education', label: 'Education', icon: GraduationCap },
    { key: 'employment', label: 'Employment', icon: Briefcase },
    { key: 'characterRefs', label: 'References', icon: UserCheck },
    { key: 'trainings', label: 'Training', icon: BookOpen },
    { key: 'gov', label: 'Gov. record', icon: ShieldCheck },
    { key: 'licenses', label: 'Licenses', icon: Award },
] as const;

type TabKey = (typeof tabs)[number]['key'];

const activeTab = ref<TabKey>('personal');

/* ------------------------------------------------------------------ */
/* Personal data (201 file) read-only sections                         */
/* ------------------------------------------------------------------ */

type Field = { label: string; value: string };

function pair(label: string, value: string): Field {
    return { label, value: value || '—' };
}

const personalSections = computed(() => {
    const p = record.value.personal;

    return [
        {
            title: 'Personal information',
            fields: [
                pair('Last name', p.lastName),
                pair('First name', p.firstName),
                pair('Middle name', p.middleName),
                pair('Suffix', p.suffix),
                pair('Date hired', p.dateHired),
                pair('Department', p.department),
                pair('Classification', p.classification),
                pair('Emp type', p.employmentType),
                pair('Birthdate', p.birthDate),
                pair('Age', p.age),
                pair('Birthplace', p.birthplace),
                pair('Gender', p.gender),
                pair('Contact number', p.phone),
                pair('Address', p.address),
                pair('Zip code', p.zipCode),
                pair('Email address', p.email),
                pair('Civil status', p.civilStatus),
                pair('Citizenship', p.citizenship),
                pair('Religion', p.religion),
            ],
        },
        {
            title: 'Family / dependent information',
            fields: [
                pair('Spouse', p.spouse),
                pair("Father's name", p.father),
                pair("Mother's name", p.mother),
            ],
        },
        {
            title: 'In case of emergency',
            fields: [
                pair('Contact person', p.emergencyName),
                pair('Relation', p.emergencyRelation),
                pair('Contact number', p.emergencyPhone),
            ],
        },
    ];
});

/* ------------------------------------------------------------------ */
/* Record tables (read-only — no add / edit / delete)                  */
/* ------------------------------------------------------------------ */

type RecordTabKey = Exclude<TabKey, 'personal' | 'gov'>;

const tableDefs: Record<
    RecordTabKey,
    { columns: { key: string; label: string }[] }
> = {
    dependents: {
        columns: [
            { key: 'id', label: 'Dependent ID' },
            { key: 'fullName', label: 'Full name' },
            { key: 'birthDate', label: 'Birth date' },
        ],
    },
    education: {
        columns: [
            { key: 'level', label: 'Educational level' },
            { key: 'school', label: 'School name' },
            { key: 'yearGraduated', label: 'Year graduated' },
            { key: 'degree', label: 'Degree received' },
            { key: 'skills', label: 'Special skills' },
        ],
    },
    employment: {
        columns: [
            { key: 'company', label: 'Company name' },
            { key: 'position', label: 'Position' },
            { key: 'from', label: 'Date from' },
            { key: 'to', label: 'Date to' },
        ],
    },
    characterRefs: {
        columns: [
            { key: 'company', label: 'Company name' },
            { key: 'position', label: 'Position' },
            { key: 'from', label: 'Date from' },
            { key: 'to', label: 'Date to' },
        ],
    },
    trainings: {
        columns: [
            { key: 'id', label: 'Training ID' },
            { key: 'name', label: 'Training name' },
            { key: 'description', label: 'Description' },
            { key: 'venue', label: 'Venue' },
            { key: 'from', label: 'Date from' },
            { key: 'to', label: 'Date to' },
            { key: 'certificate', label: 'Certificate' },
        ],
    },
    licenses: {
        columns: [
            { key: 'id', label: 'License ID' },
            { key: 'name', label: 'License name' },
            { key: 'number', label: 'License number' },
            { key: 'rating', label: 'Rating' },
            { key: 'dateTaken', label: 'Date taken' },
            { key: 'validity', label: 'Date of validity' },
        ],
    },
};

function rowsFor(tab: RecordTabKey): Record<string, string>[] {
    return record.value[tab] as Record<string, string>[];
}
</script>

<template>
    <Head :title="`${displayEmployee.name} — Employee Overview`" />

    <div class="mx-auto flex w-full max-w-7xl flex-col gap-6 pb-16">
        <!-- Header -->
        <div>
            <Link
                :href="backHref"
                class="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-blue-600"
            >
                <ArrowLeft class="size-3.5" />
                Back to separation case
            </Link>
            <div
                class="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
            >
                <div class="flex items-center gap-4">
                    <Avatar class="size-16 overflow-hidden rounded-2xl">
                        <img
                            v-if="record.personal.photo"
                            :src="record.personal.photo"
                            :alt="displayEmployee.name"
                            class="size-full object-cover"
                        />
                        <AvatarFallback
                            v-else
                            class="rounded-2xl bg-blue-600 text-xl font-bold text-white"
                        >
                            {{ getInitials(fullName) }}
                        </AvatarFallback>
                    </Avatar>
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
                            Read-only overview · Separation &amp; Offboarding
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Summary cards -->
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div
                v-for="card in summaryCards"
                :key="card.label"
                class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
                <p
                    class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                >
                    {{ card.label }}
                </p>
                <p
                    class="mt-1 text-lg font-semibold text-slate-900 tabular-nums"
                >
                    {{ card.value }}
                </p>
            </div>
        </div>

        <!-- Tabs: sticky, compact, left-aligned -->
        <div
            class="sticky top-2 z-20 inline-flex w-fit rounded-xl border bg-card p-1 shadow-sm"
        >
            <button
                v-for="tab in tabs"
                :key="tab.key"
                type="button"
                class="inline-flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors"
                :class="
                    cn(
                        activeTab === tab.key
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    )
                "
                @click="activeTab = tab.key"
            >
                <component :is="tab.icon" class="size-4" />
                {{ tab.label }}
            </button>
        </div>

        <!-- ============ PERSONAL DATA ============ -->
        <section v-if="activeTab === 'personal'" class="grid gap-6">
            <div
                v-for="section in personalSections"
                :key="section.title"
                class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
                <h2 class="font-semibold text-slate-900">
                    {{ section.title }}
                </h2>
                <div
                    class="mt-5 grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3"
                >
                    <div
                        v-for="field in section.fields"
                        :key="field.label"
                        class="min-w-0"
                    >
                        <p
                            class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                        >
                            {{ field.label }}
                        </p>
                        <p class="mt-0.5 text-sm break-words text-slate-800">
                            {{ field.value }}
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- ============ RECORD TABLES (read-only) ============ -->
        <section
            v-for="tab in [
                'dependents',
                'education',
                'employment',
                'characterRefs',
                'trainings',
                'licenses',
            ] as RecordTabKey[]"
            :key="tab"
        >
            <div
                v-if="activeTab === tab"
                class="rounded-xl border border-slate-200 bg-white shadow-sm"
            >
                <div class="border-b px-5 py-4">
                    <h3 class="font-semibold text-slate-900">
                        {{
                            {
                                dependents: 'Dependents',
                                education: 'Educational background',
                                employment: 'Employment history',
                                characterRefs: 'Character references',
                                trainings: 'Training records',
                                licenses: 'Licenses attained',
                            }[tab]
                        }}
                    </h3>
                    <p class="mt-0.5 text-xs text-slate-500">
                        Read-only — manage these records from the employee's 201
                        file in Employee Management.
                    </p>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full min-w-[560px] text-sm">
                        <thead>
                            <tr
                                class="border-b text-left text-xs tracking-wide text-slate-500 uppercase"
                            >
                                <th
                                    v-for="column in tableDefs[tab].columns"
                                    :key="column.key"
                                    class="px-4 py-3 font-medium"
                                >
                                    {{ column.label }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="(row, index) in rowsFor(tab)"
                                :key="index"
                                class="border-b transition-colors last:border-0"
                            >
                                <td
                                    v-for="column in tableDefs[tab].columns"
                                    :key="column.key"
                                    class="px-4 py-3 text-slate-600"
                                >
                                    {{ row[column.key] || '—' }}
                                </td>
                            </tr>
                            <tr v-if="rowsFor(tab).length === 0">
                                <td
                                    :colspan="tableDefs[tab].columns.length"
                                    class="px-4 py-10 text-center text-sm text-slate-500"
                                >
                                    No records on file.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>

        <!-- ============ GOV RECORD ============ -->
        <section v-if="activeTab === 'gov'" class="grid gap-6">
            <div
                class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
                <div class="flex items-center gap-2">
                    <ShieldCheck class="size-4 text-blue-600" />
                    <h2 class="font-semibold text-slate-900">
                        Employee &amp; government records
                    </h2>
                </div>
                <div
                    class="mt-5 grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3"
                >
                    <div
                        v-for="field in [
                            { label: 'DARBC ID', value: record.gov.darbc },
                            { label: 'Biometric', value: record.gov.biometric },
                            { label: 'ATM number', value: record.gov.atm },
                            { label: 'TIN', value: record.gov.tin },
                            { label: 'Pag-IBIG', value: record.gov.pagibig },
                            {
                                label: 'PhilHealth',
                                value: record.gov.philhealth,
                            },
                            { label: 'SSS', value: record.gov.sss },
                        ]"
                        :key="field.label"
                        class="min-w-0"
                    >
                        <p
                            class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                        >
                            {{ field.label }}
                        </p>
                        <p class="mt-0.5 text-sm break-words text-slate-800">
                            {{ field.value || '—' }}
                        </p>
                    </div>
                </div>
            </div>

            <div
                class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
                <h2 class="font-semibold text-slate-900">
                    Residential certificate
                </h2>
                <div
                    class="mt-5 grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-4"
                >
                    <div
                        v-for="field in [
                            {
                                label: 'Cert. type',
                                value: record.residentCert.type,
                            },
                            {
                                label: 'Cert. number',
                                value: record.residentCert.number,
                            },
                            {
                                label: 'Issued at',
                                value: record.residentCert.issuedAt,
                            },
                            {
                                label: 'Issued on',
                                value: record.residentCert.issuedOn,
                            },
                        ]"
                        :key="field.label"
                        class="min-w-0"
                    >
                        <p
                            class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                        >
                            {{ field.label }}
                        </p>
                        <p class="mt-0.5 text-sm break-words text-slate-800">
                            {{ field.value || '—' }}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>
