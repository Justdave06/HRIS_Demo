<script setup lang="ts">
import { computed } from 'vue';

type Column = {
    key: string;
    label: string;
    numeric?: boolean;
};

const props = withDefaults(
    defineProps<{
        title: string;
        period: string;
        columns: Column[];
        rows: Record<string, string | number>[];
        note?: string;
        /** Subtitle under the DARBC HRIS seal (per-module system name). */
        system?: string;
    }>(),
    {
        system: 'Time & Attendance Management System',
    },
);

const totals = computed(() => {
    const out: Record<string, string | number> = {};

    for (const column of props.columns) {
        if (!column.numeric) {
            continue;
        }

        const sum = props.rows.reduce(
            (total, row) => total + (Number(row[column.key]) || 0),
            0,
        );

        out[column.key] = Math.round(sum * 100) / 100;
    }

    return out;
});
</script>

<template>
    <article
        class="w-full max-w-full min-w-0 bg-white break-words text-slate-900 shadow-xl print:shadow-none"
    >
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
                {{ system }}
            </p>
            <p class="mt-1 text-xs text-slate-500">
                Human Resources Department
            </p>

            <div class="mt-6 border-y-2 border-slate-800 py-3">
                <h1 class="text-xl font-black tracking-wide uppercase">
                    {{ title }}
                </h1>
                <p class="mt-1 text-xs text-slate-600">
                    Period: {{ period }} · {{ rows.length }} record{{
                        rows.length === 1 ? '' : 's'
                    }}
                </p>
            </div>
        </header>

        <div class="px-6 pb-8">
            <table
                class="w-full min-w-0 table-fixed border-collapse text-[11px] break-words"
            >
                <thead>
                    <tr
                        class="border-b-2 border-slate-800 text-left text-[10px] text-slate-700 uppercase"
                    >
                        <th
                            v-for="column in columns"
                            :key="column.key"
                            class="py-1.5 pr-2 font-bold break-words last:pr-0"
                        >
                            {{ column.label }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(row, index) in rows"
                        :key="index"
                        class="border-b border-slate-200"
                    >
                        <td
                            v-for="column in columns"
                            :key="column.key"
                            class="py-1 pr-2 align-top break-words text-slate-600 last:pr-0"
                            :class="
                                column.numeric
                                    ? 'tabular-nums'
                                    : column.key === 'name'
                                      ? 'font-medium'
                                      : ''
                            "
                        >
                            {{ row[column.key] }}
                        </td>
                    </tr>
                    <tr v-if="rows.length === 0">
                        <td
                            :colspan="columns.length"
                            class="py-5 text-center text-xs text-slate-400 italic"
                        >
                            No records in this period.
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td
                            v-for="column in columns"
                            :key="column.key"
                            class="border-t-2 border-slate-800 py-1.5 pr-2 text-[10px] font-black tracking-wide uppercase last:pr-0"
                            :class="
                                column.numeric ? 'text-right tabular-nums' : ''
                            "
                        >
                            <template v-if="column.numeric">
                                {{ totals[column.key] }}
                            </template>
                            <template v-else-if="column.key === 'no'">
                                Total
                            </template>
                        </td>
                    </tr>
                </tfoot>
            </table>

            <p
                v-if="note"
                class="mt-4 text-[10px] break-words text-slate-500 italic"
            >
                {{ note }}
            </p>

            <!-- Signature block -->
            <section class="mt-10 grid grid-cols-2 gap-x-10 gap-y-6 text-xs">
                <div>
                    <div
                        class="border-t border-slate-400 pt-1.5 text-[10px] font-semibold text-slate-600"
                    >
                        Prepared by: Timekeeper
                    </div>
                </div>
                <div>
                    <div
                        class="border-t border-slate-400 pt-1.5 text-[10px] font-semibold text-slate-600"
                    >
                        Noted by: HR Manager
                    </div>
                </div>
            </section>
        </div>
    </article>
</template>
