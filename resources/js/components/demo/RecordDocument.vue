<script setup lang="ts">
import { computed } from 'vue';
import type { EmployeeFormState } from '@/components/demo/employeeFormState';
import { useInitials } from '@/composables/useInitials';
import type { DemoEmployee } from '@/types';

const props = defineProps<{
    employee: DemoEmployee;
    record: EmployeeFormState;
}>();

const { getInitials } = useInitials();

const personal = computed(() => props.record.personal);

const fullName = computed(() =>
    [
        personal.value.firstName,
        personal.value.middleName,
        personal.value.lastName,
    ]
        .filter(Boolean)
        .join(' '),
);

const printedOn = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
});

function value(text: string | undefined | null): string {
    return text && text.trim() !== '' ? text : '—';
}

function emptyText(rows: unknown[]): string {
    return rows.length === 0 ? 'No records on file.' : '';
}
</script>

<template>
    <article class="bg-white text-slate-900 shadow-xl print:shadow-none">
        <!-- Letterhead -->
        <header class="border-b-4 border-blue-700 px-8 pt-8 pb-4">
            <div class="flex items-start justify-between gap-6">
                <div>
                    <p class="text-lg font-black tracking-tight text-blue-800">
                        DARBC HRIS
                    </p>
                    <p class="text-xs text-slate-500">
                        Employee Information Management System
                    </p>
                </div>
                <div class="text-right">
                    <p class="text-xs text-slate-500">Document type</p>
                    <p class="text-sm font-bold">201 FILE</p>
                    <p class="mt-1 text-xs text-slate-500">
                        Printed {{ printedOn }}
                    </p>
                </div>
            </div>
        </header>

        <!-- Page 1: profile + personal records -->
        <div class="px-8 py-6">
            <section>
                <div class="flex items-center gap-5">
                    <div
                        class="flex size-20 shrink-0 items-center justify-center rounded-full border-2 border-blue-800 text-xl font-black text-blue-800"
                    >
                        {{ getInitials(fullName) }}
                    </div>
                    <div class="min-w-0 flex-1">
                        <h1 class="text-2xl font-black tracking-tight">
                            {{ fullName }}
                        </h1>
                        <p class="mt-1 text-sm font-semibold text-slate-700">
                            {{ employee.position }}
                        </p>
                        <div
                            class="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-600"
                        >
                            <span>
                                <span class="font-semibold">Employee No.:</span>
                                {{ employee.no }}
                            </span>
                            <span>
                                <span class="font-semibold">Department:</span>
                                {{ employee.department }}
                            </span>
                            <span>
                                <span class="font-semibold">Status:</span>
                                {{ employee.employment_type }}
                            </span>
                            <span>
                                <span class="font-semibold">Date hired:</span>
                                {{ employee.hire_date }}
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Personal information -->
            <section class="mt-8">
                <h2
                    class="border-b border-slate-300 pb-1 text-sm font-black tracking-wide text-slate-800 uppercase"
                >
                    Personal information
                </h2>
                <dl
                    class="mt-3 grid grid-cols-2 gap-x-10 gap-y-2 text-sm md:grid-cols-3"
                >
                    <div>
                        <dt class="text-xs text-slate-500">Birth date</dt>
                        <dd class="font-medium">
                            {{ value(personal.birthDate) }}
                        </dd>
                    </div>
                    <div>
                        <dt class="text-xs text-slate-500">Gender</dt>
                        <dd class="font-medium">
                            {{ value(personal.gender) }}
                        </dd>
                    </div>
                    <div>
                        <dt class="text-xs text-slate-500">Civil status</dt>
                        <dd class="font-medium">
                            {{ value(personal.civilStatus) }}
                        </dd>
                    </div>
                    <div>
                        <dt class="text-xs text-slate-500">Citizenship</dt>
                        <dd class="font-medium">
                            {{ value(personal.citizenship) }}
                        </dd>
                    </div>
                    <div>
                        <dt class="text-xs text-slate-500">Religion</dt>
                        <dd class="font-medium">
                            {{ value(personal.religion) }}
                        </dd>
                    </div>
                    <div>
                        <dt class="text-xs text-slate-500">Mobile number</dt>
                        <dd class="font-medium">{{ value(personal.phone) }}</dd>
                    </div>
                    <div class="col-span-2">
                        <dt class="text-xs text-slate-500">Home address</dt>
                        <dd class="font-medium">
                            {{ value(personal.address) }}
                        </dd>
                    </div>
                    <div>
                        <dt class="text-xs text-slate-500">Email address</dt>
                        <dd class="font-medium">{{ value(personal.email) }}</dd>
                    </div>
                </dl>
            </section>

            <!-- Family / dependents -->
            <section class="mt-8">
                <h2
                    class="border-b border-slate-300 pb-1 text-sm font-black tracking-wide text-slate-800 uppercase"
                >
                    Family / dependents
                </h2>
                <p
                    v-if="emptyText(record.dependents)"
                    class="mt-2 text-sm text-slate-400 italic"
                >
                    {{ emptyText(record.dependents) }}
                </p>
                <table
                    v-else
                    class="mt-3 w-full table-fixed border-collapse text-[11px]"
                >
                    <thead>
                        <tr
                            class="border-b-2 border-slate-400 text-left text-[10px] text-slate-500 uppercase"
                        >
                            <th class="py-1.5 pr-2 font-semibold break-words">
                                Full name
                            </th>
                            <th class="py-1.5 pr-2 font-semibold break-words">
                                Relationship
                            </th>
                            <th class="py-1 font-semibold break-words">
                                Birth date
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="dependent in record.dependents"
                            :key="dependent.id"
                            class="border-b border-slate-200"
                        >
                            <td class="py-1 pr-2 font-medium break-words">
                                {{ dependent.fullName }}
                            </td>
                            <td class="py-1 pr-2 break-words text-slate-600">
                                {{ dependent.relation ?? 'Dependent' }}
                            </td>
                            <td class="py-1 text-slate-600">
                                {{ value(dependent.birthDate) }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <!-- Educational background -->
            <section class="mt-8">
                <h2
                    class="border-b border-slate-300 pb-1 text-sm font-black tracking-wide text-slate-800 uppercase"
                >
                    Educational background
                </h2>
                <p
                    v-if="emptyText(record.education)"
                    class="mt-2 text-sm text-slate-400 italic"
                >
                    {{ emptyText(record.education) }}
                </p>
                <table
                    v-else
                    class="mt-3 w-full table-fixed border-collapse text-[11px]"
                >
                    <thead>
                        <tr
                            class="border-b-2 border-slate-400 text-left text-[10px] text-slate-500 uppercase"
                        >
                            <th class="py-1 pr-2 font-semibold">Level</th>
                            <th class="py-1 pr-2 font-semibold">School</th>
                            <th class="py-1 pr-2 font-semibold">Degree</th>
                            <th class="py-1 font-semibold">Year graduated</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="row in record.education"
                            :key="row.id ?? row.level + row.school"
                            class="border-b border-slate-200"
                        >
                            <td class="py-1 pr-2 font-medium">
                                {{ row.level }}
                            </td>
                            <td class="py-1 pr-2 text-slate-600">
                                {{ row.school }}
                            </td>
                            <td class="py-1 pr-2 text-slate-600">
                                {{ value(row.degree) }}
                            </td>
                            <td class="py-1 text-slate-600">
                                {{ value(row.yearGraduated) }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <!-- Employment record -->
            <section class="mt-8">
                <h2
                    class="border-b border-slate-300 pb-1 text-sm font-black tracking-wide text-slate-800 uppercase"
                >
                    Employment record
                </h2>
                <p
                    v-if="emptyText(record.employment)"
                    class="mt-2 text-sm text-slate-400 italic"
                >
                    {{ emptyText(record.employment) }}
                </p>
                <table
                    v-else
                    class="mt-3 w-full table-fixed border-collapse text-[11px]"
                >
                    <thead>
                        <tr
                            class="border-b-2 border-slate-400 text-left text-[10px] text-slate-500 uppercase"
                        >
                            <th class="py-1 pr-2 font-semibold">Company</th>
                            <th class="py-1 pr-2 font-semibold">Position</th>
                            <th class="py-1 pr-2 font-semibold">From</th>
                            <th class="py-1 font-semibold">To</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="row in record.employment"
                            :key="row.id ?? row.company + row.position"
                            class="border-b border-slate-200"
                        >
                            <td class="py-1 pr-2 font-medium">
                                {{ row.company }}
                            </td>
                            <td class="py-1 pr-2 text-slate-600">
                                {{ row.position }}
                            </td>
                            <td class="py-1 pr-2 text-slate-600">
                                {{ row.from }}
                            </td>
                            <td class="py-1 text-slate-600">
                                {{ value(row.to) }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <!-- Character references -->
            <section class="mt-8">
                <h2
                    class="border-b border-slate-300 pb-1 text-sm font-black tracking-wide text-slate-800 uppercase"
                >
                    Character references
                </h2>
                <p
                    v-if="emptyText(record.characterRefs)"
                    class="mt-2 text-sm text-slate-400 italic"
                >
                    {{ emptyText(record.characterRefs) }}
                </p>
                <table
                    v-else
                    class="mt-3 w-full table-fixed border-collapse text-[11px]"
                >
                    <thead>
                        <tr
                            class="border-b-2 border-slate-400 text-left text-[10px] text-slate-500 uppercase"
                        >
                            <th class="py-1 pr-2 font-semibold">Company</th>
                            <th class="py-1 pr-2 font-semibold">Position</th>
                            <th class="py-1 pr-2 font-semibold">From</th>
                            <th class="py-1 font-semibold">To</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="row in record.characterRefs"
                            :key="row.id ?? row.company + row.position"
                            class="border-b border-slate-200"
                        >
                            <td class="py-1 pr-2 font-medium">
                                {{ row.company }}
                            </td>
                            <td class="py-1 pr-2 text-slate-600">
                                {{ row.position }}
                            </td>
                            <td class="py-1 pr-2 text-slate-600">
                                {{ row.from }}
                            </td>
                            <td class="py-1 text-slate-600">
                                {{ value(row.to) }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <!-- Training record -->
            <section class="mt-8">
                <h2
                    class="border-b border-slate-300 pb-1 text-sm font-black tracking-wide text-slate-800 uppercase"
                >
                    Training record
                </h2>
                <p
                    v-if="emptyText(record.trainings)"
                    class="mt-2 text-sm text-slate-400 italic"
                >
                    {{ emptyText(record.trainings) }}
                </p>
                <table
                    v-else
                    class="mt-3 w-full table-fixed border-collapse text-[11px]"
                >
                    <thead>
                        <tr
                            class="border-b-2 border-slate-400 text-left text-[10px] text-slate-500 uppercase"
                        >
                            <th class="py-1 pr-2 font-semibold">Training</th>
                            <th class="py-1 pr-2 font-semibold">
                                Venue / provider
                            </th>
                            <th class="py-1 font-semibold">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="row in record.trainings"
                            :key="row.id ?? row.name"
                            class="border-b border-slate-200"
                        >
                            <td class="py-1 pr-2 font-medium">
                                {{ row.name }}
                            </td>
                            <td class="py-1 pr-2 text-slate-600">
                                {{ value(row.venue) }}
                            </td>
                            <td class="py-1 text-slate-600">
                                {{ value(row.from) }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <!-- Government records -->
            <section class="mt-8">
                <h2
                    class="border-b border-slate-300 pb-1 text-sm font-black tracking-wide text-slate-800 uppercase"
                >
                    Employee &amp; government records
                </h2>
                <dl
                    class="mt-3 grid grid-cols-2 gap-x-10 gap-y-2 text-sm md:grid-cols-3"
                >
                    <div>
                        <dt class="text-xs text-slate-500">DARBC ID</dt>
                        <dd class="font-medium">
                            {{ value(record.gov.darbc) }}
                        </dd>
                    </div>
                    <div>
                        <dt class="text-xs text-slate-500">Biometric</dt>
                        <dd class="font-medium">
                            {{ value(record.gov.biometric) }}
                        </dd>
                    </div>
                    <div>
                        <dt class="text-xs text-slate-500">ATM number</dt>
                        <dd class="font-medium">{{ value(record.gov.atm) }}</dd>
                    </div>
                    <div>
                        <dt class="text-xs text-slate-500">TIN</dt>
                        <dd class="font-medium">{{ value(record.gov.tin) }}</dd>
                    </div>
                    <div>
                        <dt class="text-xs text-slate-500">Pag-IBIG</dt>
                        <dd class="font-medium">
                            {{ value(record.gov.pagibig) }}
                        </dd>
                    </div>
                    <div>
                        <dt class="text-xs text-slate-500">PhilHealth</dt>
                        <dd class="font-medium">
                            {{ value(record.gov.philhealth) }}
                        </dd>
                    </div>
                    <div>
                        <dt class="text-xs text-slate-500">SSS</dt>
                        <dd class="font-medium">{{ value(record.gov.sss) }}</dd>
                    </div>
                    <div>
                        <dt class="text-xs text-slate-500">
                            {{ value(record.residentCert.type) }}
                        </dt>
                        <dd class="font-medium">
                            {{ value(record.residentCert.number) }}
                        </dd>
                    </div>
                </dl>
            </section>

            <!-- Licenses -->
            <section class="mt-8">
                <h2
                    class="border-b border-slate-300 pb-1 text-sm font-black tracking-wide text-slate-800 uppercase"
                >
                    Licenses attained
                </h2>
                <p
                    v-if="emptyText(record.licenses)"
                    class="mt-2 text-sm text-slate-400 italic"
                >
                    {{ emptyText(record.licenses) }}
                </p>
                <table
                    v-else
                    class="mt-3 w-full table-fixed border-collapse text-[11px]"
                >
                    <thead>
                        <tr
                            class="border-b-2 border-slate-400 text-left text-[10px] text-slate-500 uppercase"
                        >
                            <th class="py-1 pr-2 font-semibold">License</th>
                            <th class="py-1 pr-2 font-semibold">Number</th>
                            <th class="py-1 font-semibold">Date taken</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="row in record.licenses"
                            :key="row.id ?? row.name"
                            class="border-b border-slate-200"
                        >
                            <td class="py-1 pr-2 font-medium">
                                {{ row.name }}
                            </td>
                            <td class="py-1 pr-2 text-slate-600">
                                {{ value(row.number) }}
                            </td>
                            <td class="py-1 text-slate-600">
                                {{ value(row.dateTaken) }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <!-- Emergency contact -->
            <section class="mt-8">
                <h2
                    class="border-b border-slate-300 pb-1 text-sm font-black tracking-wide text-slate-800 uppercase"
                >
                    In case of emergency
                </h2>
                <dl
                    class="mt-3 grid grid-cols-2 gap-x-10 gap-y-2 text-sm md:grid-cols-3"
                >
                    <div>
                        <dt class="text-xs text-slate-500">Contact person</dt>
                        <dd class="font-medium">
                            {{ value(personal.emergencyName) }}
                        </dd>
                    </div>
                    <div>
                        <dt class="text-xs text-slate-500">Relation</dt>
                        <dd class="font-medium">
                            {{ value(personal.emergencyRelation) }}
                        </dd>
                    </div>
                    <div>
                        <dt class="text-xs text-slate-500">Contact number</dt>
                        <dd class="font-medium">
                            {{ value(personal.emergencyPhone) }}
                        </dd>
                    </div>
                </dl>
            </section>

            <!-- Signatures -->
            <section class="mt-12 grid grid-cols-2 gap-x-12 gap-y-8 text-sm">
                <div>
                    <div
                        class="border-t border-slate-400 pt-2 text-xs font-semibold text-slate-600"
                    >
                        Employee signature
                    </div>
                </div>
                <div>
                    <div
                        class="border-t border-slate-400 pt-2 text-xs font-semibold text-slate-600"
                    >
                        HR representative
                    </div>
                </div>
            </section>
        </div>
    </article>
</template>
