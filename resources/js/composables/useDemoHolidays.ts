import { ref } from 'vue';
import type { DemoHoliday, DemoHolidayPay } from '@/types';

/*
 * Holidays declared from the Holiday Picker (abrupt, non-national holidays:
 * earthquakes, structural damage, force majeure, etc.).
 *
 * Session-backed like every other demo store: declarations survive navigating
 * around the module and page reloads in the same tab, but closing the tab or
 * exiting Chrome discards them. No database, no localStorage.
 */
const STORAGE_KEY = 'hris-demo-declared-holidays';

function loadStored(): DemoHoliday[] {
    if (typeof window === 'undefined') {
        return [];
    }

    try {
        const raw = window.sessionStorage.getItem(STORAGE_KEY);

        return raw ? (JSON.parse(raw) as DemoHoliday[]) : [];
    } catch {
        return [];
    }
}

function saveStored(value: DemoHoliday[]): void {
    if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    }
}

const declaredHolidays = ref<DemoHoliday[]>(loadStored());

export type HolidayDraft = {
    dates: string[];
    reason: string;
    scope: DemoHoliday['scope'];
    department: string | null;
    pay: DemoHolidayPay;
};

export function useDemoHolidays() {
    function nextId(): number {
        const highest = declaredHolidays.value.reduce(
            (max, holiday) => Math.max(max, holiday.id),
            1000,
        );

        return highest + 1;
    }

    /** Declare a holiday covering one or more dates (bulk selection). */
    function declare(draft: HolidayDraft): DemoHoliday {
        const holiday: DemoHoliday = {
            id: nextId(),
            dates: [...new Set(draft.dates)].sort(),
            reason: draft.reason.trim() || 'Unscheduled holiday',
            scope: draft.scope,
            department: draft.scope === 'department' ? draft.department : null,
            pay: draft.pay,
            declared_on: new Date().toISOString().slice(0, 10),
        };

        // Newest first, so the right-hand container shows the latest pick.
        declaredHolidays.value.unshift(holiday);
        saveStored(declaredHolidays.value);

        return holiday;
    }

    function remove(id: number): void {
        declaredHolidays.value = declaredHolidays.value.filter(
            (holiday) => holiday.id !== id,
        );
        saveStored(declaredHolidays.value);
    }

    /** Holidays that apply to a given date and department (DTR marking). */
    function holidaysFor(date: string, department: string): DemoHoliday[] {
        return declaredHolidays.value.filter(
            (holiday) =>
                holiday.dates.includes(date) &&
                (holiday.scope === 'all' || holiday.department === department),
        );
    }

    return { declaredHolidays, declare, remove, holidaysFor };
}
