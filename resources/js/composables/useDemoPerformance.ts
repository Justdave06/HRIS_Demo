import { ref } from 'vue';
import type {
    DemoPerformanceGoal,
    DemoPerformanceGoalRow,
    DemoPerformanceReview,
    DemoPerformanceRow,
} from '@/types';

/*
 * Performance engine (Module 7). Every review is enriched with the employee's
 * record and the derived outputs that the rest of the system consumes:
 *
 *   overall     = average of the five criteria (1-5, one decimal)
 *   rating      = label band (Outstanding → Unsatisfactory)
 *   raise       = merit increase handed to Payroll (5% / 3% / none) based on
 *                 the overall rating, applied to the Employee Records salary
 *   gaps        = criteria rated 2 or below, each mapped to the training that
 *                 the Training module should schedule
 *
 * Session-backed like every other demo store: new reviews, Submit / Finalize
 * and withdrawals survive navigation in the same tab, gone when the tab
 * closes. No database.
 */

const ADDED_KEY = 'hris-demo-added-reviews';
const STATUS_KEY = 'hris-demo-review-statuses';
const REMOVED_KEY = 'hris-demo-removed-reviews';

export type PerformanceEmployee = {
    id: number;
    no: string;
    name: string;
    department: string;
    position: string;
    salary: number;
};

/** The five rating criteria — kept in display order everywhere. */
export const PERFORMANCE_CRITERIA = [
    { key: 'job_knowledge', label: 'Job Knowledge' },
    { key: 'quality', label: 'Quality of Work' },
    { key: 'productivity', label: 'Productivity' },
    { key: 'teamwork', label: 'Teamwork' },
    { key: 'initiative', label: 'Initiative' },
] as const;

/** Training each low-rated criterion points to (feeds the Training module). */
const GAP_TRAININGS: Record<string, string> = {
    job_knowledge: 'Advanced Job Skills Training',
    quality: 'Quality Assurance & Attention to Detail',
    productivity: 'Time Management & Productivity',
    teamwork: 'Team Collaboration Workshop',
    initiative: 'Leadership & Initiative',
};

function loadStored<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') {
        return fallback;
    }

    try {
        const raw = window.sessionStorage.getItem(key);

        return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
        return fallback;
    }
}

function saveStored(key: string, value: unknown): void {
    if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(key, JSON.stringify(value));
    }
}

function round1(value: number): number {
    return Math.round(value * 10) / 10;
}

function round2(value: number): number {
    return Math.round(value * 100) / 100;
}

export type ReviewDraft = {
    employee_id: number;
    period: string;
    job_knowledge: number;
    quality: number;
    productivity: number;
    teamwork: number;
    initiative: number;
    comments: string;
};

export function useDemoPerformance(
    employees: PerformanceEmployee[],
    seeded: DemoPerformanceReview[],
    goals: DemoPerformanceGoal[],
) {
    const added = ref<DemoPerformanceReview[]>(
        loadStored<DemoPerformanceReview[]>(ADDED_KEY, []),
    );
    const statusOverrides = ref<
        Record<number, DemoPerformanceReview['status']>
    >(
        loadStored<Record<number, DemoPerformanceReview['status']>>(
            STATUS_KEY,
            {},
        ),
    );
    const removed = ref<number[]>(loadStored<number[]>(REMOVED_KEY, []));

    /** 1-5 band the overall rating falls into. */
    function ratingLabel(overall: number): string {
        if (overall >= 4.5) {
            return 'Outstanding';
        }

        if (overall >= 3.5) {
            return 'Exceeds Expectations';
        }

        if (overall >= 2.5) {
            return 'Meets Expectations';
        }

        if (overall >= 1.5) {
            return 'Needs Improvement';
        }

        return 'Unsatisfactory';
    }

    /** Merit raise handed to Payroll: 5% for stars, 3% for strong reviews. */
    function raisePct(overall: number): number {
        if (overall >= 4.5) {
            return 0.05;
        }

        if (overall >= 4.0) {
            return 0.03;
        }

        return 0;
    }

    /** Low-rated criteria (<= 2) with the training each one needs. */
    function gapsFor(review: DemoPerformanceReview) {
        const gaps: { criterion: string; training: string }[] = [];

        for (const criterion of PERFORMANCE_CRITERIA) {
            if (review[criterion.key] <= 2) {
                gaps.push({
                    criterion: criterion.label,
                    training: GAP_TRAININGS[criterion.key],
                });
            }
        }

        return gaps;
    }

    /** Effective status: override wins over the seeded value. */
    function statusFor(
        review: DemoPerformanceReview,
    ): DemoPerformanceReview['status'] {
        return statusOverrides.value[review.id] ?? review.status;
    }

    /** Every review (seeded + session-added), enriched with record + outputs. */
    const rows = ref<DemoPerformanceRow[]>([]);

    function rebuild(): void {
        const all: DemoPerformanceReview[] = [
            ...seeded.filter((item) => !removed.value.includes(item.id)),
            ...added.value,
        ];
        const out: DemoPerformanceRow[] = [];

        for (const review of all) {
            const employee = employees.find(
                (row) => row.id === review.employee_id,
            );

            if (!employee) {
                continue;
            }

            const overall = round1(
                (review.job_knowledge +
                    review.quality +
                    review.productivity +
                    review.teamwork +
                    review.initiative) /
                    5,
            );
            const pct = raisePct(overall);
            const amount = round2(employee.salary * pct);

            out.push({
                ...review,
                status: statusFor(review),
                no: employee.no,
                name: employee.name,
                department: employee.department,
                position: employee.position,
                salary: employee.salary,
                overall,
                rating_label: ratingLabel(overall),
                raise_pct: pct,
                raise_amount: amount,
                new_salary: round2(employee.salary + amount),
                gaps: gapsFor(review),
            });
        }

        rows.value = out;
    }

    rebuild();

    function nextId(): number {
        const highest = [...seeded, ...added.value].reduce(
            (max, item) => Math.max(max, item.id),
            1000,
        );

        return highest + 1;
    }

    /** Open a new review — starts as Draft, awaiting submission. */
    function addReview(draft: ReviewDraft): DemoPerformanceReview {
        const review: DemoPerformanceReview = {
            id: nextId(),
            employee_id: draft.employee_id,
            period: draft.period,
            job_knowledge: draft.job_knowledge,
            quality: draft.quality,
            productivity: draft.productivity,
            teamwork: draft.teamwork,
            initiative: draft.initiative,
            status: 'Draft',
            reviewer: 'Liza Fernandez',
            comments: draft.comments,
        };

        added.value.unshift(review);
        saveStored(ADDED_KEY, added.value);
        rebuild();

        return review;
    }

    /** Send a Draft review for approval (session-persisted). */
    function submit(id: number): void {
        statusOverrides.value[id] = 'Submitted';
        saveStored(STATUS_KEY, statusOverrides.value);
        rebuild();
    }

    /** Finalize a review — locks the rating and its outputs (session-persisted). */
    function finalize(id: number): void {
        statusOverrides.value[id] = 'Finalized';
        saveStored(STATUS_KEY, statusOverrides.value);
        rebuild();
    }

    /** Withdraw a review (session-persisted). */
    function remove(id: number): void {
        if (seeded.some((item) => item.id === id)) {
            removed.value.push(id);
            saveStored(REMOVED_KEY, removed.value);
        } else {
            added.value = added.value.filter((item) => item.id !== id);
            saveStored(ADDED_KEY, added.value);
        }

        rebuild();
    }

    /** Every goal, enriched with the employee's record. */
    const goalRows = ref<DemoPerformanceGoalRow[]>([]);

    function rebuildGoals(): void {
        const out: DemoPerformanceGoalRow[] = [];

        for (const goal of goals) {
            const employee = employees.find(
                (row) => row.id === goal.employee_id,
            );

            if (!employee) {
                continue;
            }

            out.push({
                ...goal,
                no: employee.no,
                name: employee.name,
                department: employee.department,
                position: employee.position,
            });
        }

        goalRows.value = out;
    }

    rebuildGoals();

    function formatMoney(value: number, decimals = 0): string {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        }).format(value);
    }

    return {
        rows,
        goalRows,
        addReview,
        submit,
        finalize,
        remove,
        ratingLabel,
        formatMoney,
    };
}
