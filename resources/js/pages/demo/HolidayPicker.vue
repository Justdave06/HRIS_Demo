<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { CalendarCheck2, ChevronLeft, ChevronRight } from '@lucide/vue';
import { computed, ref } from 'vue';
import { toast } from 'vue-sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useDemoHolidays } from '@/composables/useDemoHolidays';
import { cn } from '@/lib/utils';
import type { DemoHolidayPay } from '@/types';

defineProps<{
    departments: string[];
}>();

const { declaredHolidays, declare, remove } = useDemoHolidays();

/* ------------------------------------------------------------------ */
/* Declaration form                                                    */
/* ------------------------------------------------------------------ */

const now = new Date();
const todayIso = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
const viewYear = ref(now.getFullYear());
const viewMonth = ref(now.getMonth()); // 0-based
const selectedDates = ref<string[]>([]);
const reason = ref('');
const scope = ref<'all' | 'department'>('all');
const department = ref('');
const pay = ref<DemoHolidayPay>('Paid as regular working day');

const payOptions: DemoHolidayPay[] = [
    'Paid as regular working day',
    'Special non-working rate',
    'No work, no pay (excused)',
];

// Short labels shown in the declared-holidays table (the dropdown keeps the
// full official terms).
const payShortLabel: Record<DemoHolidayPay, string> = {
    'Paid as regular working day': 'Regular pay',
    'Special non-working rate': 'Special rate',
    'No work, no pay (excused)': 'No work, no pay',
};

function pad(value: number): string {
    return String(value).padStart(2, '0');
}

const monthLabel = computed(() =>
    new Date(viewYear.value, viewMonth.value, 1).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
    }),
);

const calendarCells = computed<
    { iso: string; day: number; inMonth: boolean; past: boolean }[]
>(() => {
    const firstDay = new Date(viewYear.value, viewMonth.value, 1).getDay();
    const daysInMonth = new Date(
        viewYear.value,
        viewMonth.value + 1,
        0,
    ).getDate();
    const cells: {
        iso: string;
        day: number;
        inMonth: boolean;
        past: boolean;
    }[] = [];

    for (let i = 0; i < firstDay; i += 1) {
        cells.push({ iso: '', day: 0, inMonth: false, past: false });
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
        const iso = `${viewYear.value}-${pad(viewMonth.value + 1)}-${pad(day)}`;

        cells.push({ iso, day, inMonth: true, past: iso < todayIso });
    }

    return cells;
});

const isSelected = (iso: string): boolean => selectedDates.value.includes(iso);

function toggleDate(iso: string): void {
    // Past dates cannot become holidays — they are locked in the grid too.
    if (iso < todayIso) {
        return;
    }

    selectedDates.value = isSelected(iso)
        ? selectedDates.value.filter((date) => date !== iso)
        : [...selectedDates.value, iso];
}

function changeMonth(delta: number): void {
    const date = new Date(viewYear.value, viewMonth.value + delta, 1);
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Never navigate back to a month that has already passed.
    if (date < currentMonth) {
        return;
    }

    viewYear.value = date.getFullYear();
    viewMonth.value = date.getMonth();
}

function formatDate(iso: string): string {
    return new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    });
}

function submitDeclaration(): void {
    if (selectedDates.value.length === 0) {
        toast.error('Pick at least one date on the calendar');

        return;
    }

    if (scope.value === 'department' && !department.value) {
        toast.error('Choose which department the holiday applies to');

        return;
    }

    const holiday = declare({
        dates: selectedDates.value,
        reason: reason.value,
        scope: scope.value,
        department: scope.value === 'department' ? department.value : null,
        pay: pay.value,
    });

    toast.success(
        `${holiday.dates.length} date${holiday.dates.length === 1 ? '' : 's'} declared as ${holiday.pay}`,
    );

    selectedDates.value = [];
    reason.value = '';
}
</script>

<template>
    <Head title="Holiday Picker — Time & Attendance" />

    <div class="flex w-full flex-col gap-6">
        <div>
            <h1 class="text-2xl font-bold tracking-tight text-slate-900">
                Holiday Picker
            </h1>
            <p class="mt-1 text-sm text-slate-500">
                Declare an abrupt, non-national holiday — earthquake, severe
                structural damage, force majeure. Declared dates are marked on
                the DTR cards automatically.
            </p>
        </div>

        <!-- Slimmer form column so the declared-holidays table gets room -->
        <div class="grid gap-6 lg:grid-cols-4">
            <!-- Left: declaration form -->
            <div
                class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-1"
            >
                <div class="flex items-center gap-2">
                    <span
                        class="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700"
                    >
                        <CalendarCheck2 class="size-4" />
                    </span>
                    <h2 class="font-semibold text-slate-900">
                        Declare a holiday
                    </h2>
                </div>

                <!-- Calendar (always visible multi-select picker) -->
                <div
                    class="mt-4 rounded-xl border border-slate-200 bg-slate-50/60 p-4"
                >
                    <div class="flex items-center justify-between">
                        <p class="text-sm font-semibold text-slate-800">
                            {{ monthLabel }}
                        </p>
                        <div class="flex gap-1">
                            <button
                                type="button"
                                class="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-800"
                                aria-label="Previous month"
                                @click="changeMonth(-1)"
                            >
                                <ChevronLeft class="size-4" />
                            </button>
                            <button
                                type="button"
                                class="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-800"
                                aria-label="Next month"
                                @click="changeMonth(1)"
                            >
                                <ChevronRight class="size-4" />
                            </button>
                        </div>
                    </div>

                    <div
                        class="mt-3 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold tracking-wide text-slate-400 uppercase"
                    >
                        <span>Sun</span>
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                    </div>

                    <div class="mt-1 grid grid-cols-7 gap-1">
                        <button
                            v-for="(cell, index) in calendarCells"
                            :key="index"
                            type="button"
                            :disabled="!cell.inMonth || cell.past"
                            :class="
                                cn(
                                    'flex h-9 items-center justify-center rounded-lg text-sm transition-colors',
                                    !cell.inMonth && 'invisible',
                                    cell.past &&
                                        'cursor-not-allowed text-slate-300',
                                    cell.inMonth &&
                                        !cell.past &&
                                        !isSelected(cell.iso) &&
                                        'text-slate-700 hover:bg-blue-100',
                                    isSelected(cell.iso) &&
                                        'bg-blue-600 font-semibold text-white shadow-sm',
                                )
                            "
                            @click="toggleDate(cell.iso)"
                        >
                            {{ cell.day }}
                        </button>
                    </div>
                </div>

                <!-- Details -->
                <div class="mt-4 space-y-4">
                    <div class="flex flex-col gap-1.5">
                        <label
                            class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                        >
                            Reason
                        </label>
                        <Input
                            v-model="reason"
                            placeholder="e.g. Severe structural damage after the earthquake"
                        />
                    </div>

                    <div class="grid gap-4">
                        <div class="flex flex-col gap-1.5">
                            <label
                                class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                            >
                                Applies to
                            </label>
                            <Select v-model="scope">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select scope" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All employees
                                    </SelectItem>
                                    <SelectItem value="department">
                                        Specific department
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div
                            v-if="scope === 'department'"
                            class="flex flex-col gap-1.5"
                        >
                            <label
                                class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                            >
                                Department
                            </label>
                            <Select v-model="department">
                                <SelectTrigger>
                                    <SelectValue
                                        placeholder="Choose department"
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem
                                        v-for="option in departments"
                                        :key="option"
                                        :value="option"
                                    >
                                        {{ option }}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div class="flex flex-col gap-1.5">
                        <label
                            class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                        >
                            Payment treatment
                        </label>
                        <Select v-model="pay">
                            <SelectTrigger>
                                <SelectValue placeholder="Select treatment" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem
                                    v-for="option in payOptions"
                                    :key="option"
                                    :value="option"
                                >
                                    {{ option }}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button
                        class="w-full bg-blue-600 hover:bg-blue-700"
                        :disabled="selectedDates.length === 0"
                        @click="submitDeclaration"
                    >
                        <CalendarCheck2 class="size-4" />
                        Declare holiday
                    </Button>
                </div>
            </div>

            <!-- Right: declared holidays -->
            <div
                class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-3"
            >
                <div class="flex items-center gap-2">
                    <span
                        class="flex size-8 items-center justify-center rounded-lg bg-amber-50 text-amber-700"
                    >
                        <CalendarCheck2 class="size-4" />
                    </span>
                    <h2 class="font-semibold text-slate-900">
                        Declared holidays
                    </h2>
                    <span
                        class="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                    >
                        {{ declaredHolidays.length }}
                    </span>
                </div>
                <div class="mt-4 overflow-x-auto">
                    <table class="w-full min-w-[640px] text-sm">
                        <thead>
                            <tr
                                class="border-b border-slate-200 text-left text-xs font-medium tracking-wide text-slate-500 uppercase"
                            >
                                <th class="px-4 py-3">Date</th>
                                <th class="px-4 py-3">Reason</th>
                                <th class="px-4 py-3">Scope</th>
                                <th class="px-4 py-3">Pay treatment</th>
                                <th class="px-4 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="holiday in declaredHolidays"
                                :key="holiday.id"
                                class="border-b border-slate-200 align-top last:border-0"
                            >
                                <td
                                    class="px-4 py-3 whitespace-nowrap text-slate-700"
                                >
                                    {{
                                        holiday.dates
                                            .map(formatDate)
                                            .join(' · ')
                                    }}
                                </td>
                                <td class="px-4 py-3 text-slate-700">
                                    {{ holiday.reason }}
                                </td>
                                <td
                                    class="px-4 py-3 whitespace-nowrap text-slate-700"
                                >
                                    {{
                                        holiday.scope === 'all'
                                            ? 'All employees'
                                            : holiday.department
                                    }}
                                </td>
                                <td
                                    class="px-4 py-3 whitespace-nowrap text-slate-700"
                                >
                                    {{ payShortLabel[holiday.pay] }}
                                </td>
                                <td class="px-4 py-3">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        class="text-slate-600 shadow-none hover:bg-slate-50 hover:text-slate-900"
                                        @click="remove(holiday.id)"
                                    >
                                        Remove
                                    </Button>
                                </td>
                            </tr>
                            <tr v-if="declaredHolidays.length === 0">
                                <td
                                    colspan="5"
                                    class="px-4 py-10 text-center text-sm text-slate-500"
                                >
                                    No declared holidays yet. Pick dates on the
                                    left and declare one — it shows up here and
                                    on the DTR cards.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
