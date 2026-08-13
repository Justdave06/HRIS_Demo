import type { DemoHoliday } from '@/types';

/*
 * Deterministic time-and-attendance data for the demo.
 *
 * No database, so every day grid, tardiness count and overtime hour is
 * derived from the employee id + the day number with stable modulo patterns.
 * The same employee always gets the same (plausible) record, which keeps the
 * DTR card, the reports and the export in sync with each other.
 */

export type DtrDay = {
    day: number;
    date: string;
    weekday: string;
    rest: boolean;
    holiday: DemoHoliday | null;
    amIn: string | null;
    amOut: string | null;
    pmIn: string | null;
    pmOut: string | null;
    total: number | null;
    late: boolean;
};

export type RangeStats = {
    workingDays: number;
    presentDays: number;
    lateDays: number;
    absentDays: number;
    lateMinutes: number;
    otDays: number;
    otHours: number;
};

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

function pad(value: number): string {
    return String(value).padStart(2, '0');
}

function addMinutes(time: string, minutes: number): string {
    const [hours, mins] = time.split(':').map(Number);
    const total = (hours * 60 + mins + minutes + 1440) % 1440;

    return `${pad(Math.floor(total / 60))}:${pad(total % 60)}`;
}

function hoursBetween(from: string, to: string): number {
    const [fh, fm] = from.split(':').map(Number);
    const [th, tm] = to.split(':').map(Number);

    return (th * 60 + tm - (fh * 60 + fm)) / 60;
}

function isWeekend(date: Date): boolean {
    const day = date.getDay();

    return day === 0 || day === 6;
}

function isLateDay(employeeId: number, dayIndex: number): boolean {
    return (employeeId + dayIndex) % 7 === 0;
}

function isAbsentDay(employeeId: number, dayIndex: number): boolean {
    return (employeeId + dayIndex) % 9 === 0;
}

export function useDemoDtr() {
    /**
     * The full DTR grid (day 1..N) for a month, shaped like the classic
     * Philippine Daily Time Record: AM in/out, PM in/out and total hours,
     * with rest days blank and declared holidays marked.
     */
    function dtrDays(
        employeeId: number,
        baseIn: string,
        baseOut: string,
        monthIso: string,
        holidays: DemoHoliday[],
        department: string,
    ): DtrDay[] {
        const [year, month] = monthIso.split('-').map(Number);
        const daysInMonth = new Date(year, month, 0).getDate();
        const days: DtrDay[] = [];

        for (let day = 1; day <= daysInMonth; day += 1) {
            const date = new Date(year, month - 1, day);
            const dateIso = `${year}-${pad(month)}-${pad(day)}`;
            const rest = isWeekend(date);
            const holiday =
                holidays.find(
                    (item) =>
                        item.dates.includes(dateIso) &&
                        (item.scope === 'all' ||
                            item.department === department),
                ) ?? null;

            let amIn: string | null = null;
            let amOut: string | null = null;
            let pmIn: string | null = null;
            let pmOut: string | null = null;
            let total: number | null = null;
            let late = false;

            if (!rest && !holiday && !isAbsentDay(employeeId, day)) {
                late = isLateDay(employeeId, day);
                const lateMinutes = late
                    ? 8 + ((employeeId * 3 + day) % 22)
                    : 0;

                amIn = addMinutes(
                    baseIn,
                    lateMinutes + ((employeeId + day) % 4),
                );
                amOut = '12:00';
                pmIn = '13:00';
                pmOut = addMinutes(baseOut, (employeeId + day) % 3);
                total =
                    Math.round(
                        (hoursBetween(amIn, amOut) +
                            hoursBetween(pmIn, pmOut)) *
                            100,
                    ) / 100;
            }

            days.push({
                day,
                date: dateIso,
                weekday: WEEKDAYS[date.getDay()],
                rest,
                holiday,
                amIn,
                amOut,
                pmIn,
                pmOut,
                total,
                late,
            });
        }

        return days;
    }

    /**
     * Aggregates tardiness / overtime / presence over a date range. Used by
     * the Attendance Manager report and the Tardiness & Overtime reports.
     */
    function rangeStats(
        employeeId: number,
        startIso: string,
        endIso: string,
    ): RangeStats {
        const start = new Date(`${startIso}T00:00:00`);
        const end = new Date(`${endIso}T00:00:00`);
        const stats: RangeStats = {
            workingDays: 0,
            presentDays: 0,
            lateDays: 0,
            absentDays: 0,
            lateMinutes: 0,
            otDays: 0,
            otHours: 0,
        };

        // The modulo seeds use the day of the month (like the DTR card), so
        // a report over one month agrees with that month's DTR card.
        while (start <= end) {
            const day = start.getDate();

            if (!isWeekend(start)) {
                stats.workingDays += 1;

                if (isAbsentDay(employeeId, day)) {
                    stats.absentDays += 1;
                } else if (isLateDay(employeeId, day)) {
                    stats.lateDays += 1;
                    stats.lateMinutes += 5 + ((employeeId * 3 + day) % 25);
                } else {
                    stats.presentDays += 1;
                }

                if ((employeeId * 2 + day) % 6 === 0) {
                    stats.otDays += 1;
                    stats.otHours +=
                        Math.round(
                            (0.5 + ((employeeId + day) % 3) * 0.5) * 100,
                        ) / 100;
                }
            }

            start.setDate(start.getDate() + 1);
        }

        return stats;
    }

    return { dtrDays, rangeStats };
}
