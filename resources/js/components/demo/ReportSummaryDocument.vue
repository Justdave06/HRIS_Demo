<script setup lang="ts">
import { computed } from 'vue';
import type { DemoEmployee } from '@/types';

const props = withDefaults(
    defineProps<{
        employees: DemoEmployee[];
        variant?: 'masterlist' | 'employment-status' | 'file-status';
    }>(),
    {
        variant: 'masterlist',
    },
);

const title = computed(() => {
    if (props.variant === 'file-status') {
        return '201 File Status Report';
    }

    if (props.variant === 'employment-status') {
        return 'Employment Status Report';
    }

    return 'Employee Masterlist Report';
});

// Each report prints the same flat table, but only the status report that
// owns it adds its status column (masterlist stays a plain roster).
const statusColumn = computed<
    | {
          label: string;
          value: (employee: DemoEmployee) => string;
      }
    | undefined
>(() => {
    if (props.variant === 'file-status') {
        return { label: '201 File Status', value: (e) => e.file_status };
    }

    if (props.variant === 'employment-status') {
        return { label: 'Employee Status', value: (e) => e.employment_type };
    }

    return undefined;
});

const printedOn = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
});
</script>

<template>
    <article class="bg-white text-slate-900 shadow-xl print:shadow-none">
        <!-- Official letterhead (Philippine certification format) -->
        <header class="px-8 pt-10 pb-6 text-center">
            <p
                class="text-sm font-bold tracking-widest text-slate-800 uppercase"
            >
                Republic of the Philippines
            </p>
            <p
                class="mt-1 text-sm font-bold tracking-wide text-slate-700 uppercase"
            >
                Department of Labor and Employment
            </p>
            <p class="mt-1 text-sm text-slate-600">
                Regional Office No. XII (SOCCSKSARGEN)
            </p>
            <p class="text-sm text-slate-600">Isulan, Sultan Kudarat</p>
            <div
                class="mx-auto mt-4 flex size-16 items-center justify-center rounded-full border-2 border-slate-800"
            >
                <span class="text-xs font-black tracking-tight text-slate-800">
                    DARBC
                </span>
            </div>
            <p class="mt-4 text-lg font-black tracking-tight text-blue-800">
                DARBC HRIS
            </p>
            <p class="text-xs text-slate-500">
                Employee Information Management System
            </p>
            <p class="mt-1 text-xs text-slate-500">
                Human Resources Department
            </p>

            <div class="mt-6 border-y-2 border-slate-800 py-3">
                <h1 class="text-xl font-black tracking-wide uppercase">
                    {{ title }}
                </h1>
                <p class="mt-1 text-xs text-slate-600">
                    As of {{ printedOn }} · Total of {{ employees.length }}
                    employees
                </p>
            </div>
        </header>

        <!-- One flat table for every report variant; status column only on
             the report that owns it -->
        <div class="px-8 pb-10">
            <table class="w-full table-fixed border-collapse text-[11px]">
                <thead>
                    <tr
                        class="border-b-2 border-slate-800 text-left text-[10px] text-slate-700 uppercase"
                    >
                        <th class="py-1.5 pr-2 font-bold break-words">No.</th>
                        <th class="py-1.5 pr-2 font-bold break-words">
                            Employee ID
                        </th>
                        <th class="py-1.5 pr-2 font-bold break-words">Name</th>
                        <th class="py-1.5 pr-2 font-bold break-words">
                            Position
                        </th>
                        <th class="py-1.5 pr-2 font-bold break-words">
                            Department
                        </th>
                        <th class="py-1.5 pr-2 font-bold break-words">
                            Date Hired
                        </th>
                        <th
                            v-if="statusColumn"
                            class="py-1.5 font-bold break-words"
                        >
                            {{ statusColumn.label }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(employee, rowIndex) in employees"
                        :key="employee.id"
                        class="border-b border-slate-200"
                    >
                        <td class="py-1 pr-2 text-slate-600 tabular-nums">
                            {{ rowIndex + 1 }}
                        </td>
                        <td class="py-1 pr-2 font-medium">
                            {{ employee.no }}
                        </td>
                        <td class="py-1 pr-2 font-medium break-words">
                            {{ employee.name }}
                        </td>
                        <td class="py-1 pr-2 break-words text-slate-600">
                            {{ employee.position }}
                        </td>
                        <td class="py-1 pr-2 break-words text-slate-600">
                            {{ employee.department }}
                        </td>
                        <td class="py-1 text-slate-600 tabular-nums">
                            {{ employee.hire_date }}
                        </td>
                        <td v-if="statusColumn" class="py-1">
                            {{ statusColumn.value(employee) }}
                        </td>
                    </tr>
                    <tr>
                        <td
                            :colspan="statusColumn ? 7 : 6"
                            class="border-b-2 border-slate-800 py-1.5 pr-2 text-right text-[10px] font-bold tracking-wide uppercase"
                        >
                            Total: {{ employees.length }} employee{{
                                employees.length === 1 ? '' : 's'
                            }}
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Signature block -->
            <section class="mt-14 grid grid-cols-2 gap-x-12 gap-y-8 text-sm">
                <div>
                    <div
                        class="border-t border-slate-400 pt-2 text-xs font-semibold text-slate-600"
                    >
                        Prepared by: HR Representative
                    </div>
                </div>
                <div>
                    <div
                        class="border-t border-slate-400 pt-2 text-xs font-semibold text-slate-600"
                    >
                        Noted by: HR Manager
                    </div>
                </div>
            </section>
        </div>
    </article>
</template>
