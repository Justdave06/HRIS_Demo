import { ref } from 'vue';
import type { DemoJob } from '@/types';

/*
 * Demo vacancies added from the Add Vacancy form.
 *
 * Backed by sessionStorage so an added vacancy survives navigating around
 * the module (even across a full page load), but nothing persists beyond
 * the browser tab: closing the tab, exiting Chrome, or opening a new tab
 * discards every added vacancy. No database, no localStorage.
 */
const STORAGE_KEY = 'hris-demo-added-vacancies';
const STATUS_KEY = 'hris-demo-vacancy-statuses';
const INTERVIEW_KEY = 'hris-demo-interview-schedules';

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

const addedVacancies = ref<DemoJob[]>(loadStored<DemoJob[]>(STORAGE_KEY, []));

// Status overrides per vacancy id, so seeded vacancies can be updated too.
const statusOverrides = ref<Record<number, DemoJob['status']>>(
    loadStored<Record<number, DemoJob['status']>>(STATUS_KEY, {}),
);

// Interview schedules set by the recruiter, keyed by candidate id. These
// feed the Interview Schedule report, so a report can always be generated
// from real (settable) data.
const interviewOverrides = ref<Record<number, string>>(
    loadStored<Record<number, string>>(INTERVIEW_KEY, {}),
);

function todayIso(): string {
    return new Date().toISOString().slice(0, 10);
}

export type VacancyDraft = {
    title: string;
    position: string;
    department: string;
    salary: string;
    employment_type: DemoJob['employment_type'];
    attachment: string;
};

export function useDemoVacancies() {
    function nextId(): number {
        // Seeded vacancies are 1-6; added ones start at 1001.
        const highest = addedVacancies.value.reduce(
            (max, vacancy) => Math.max(max, vacancy.id),
            1000,
        );

        return highest + 1;
    }

    function addVacancy(draft: VacancyDraft): DemoJob {
        const vacancy: DemoJob = {
            id: nextId(),
            title: draft.title.trim() || 'New vacancy',
            position: draft.position.trim() || draft.title.trim() || 'Staff',
            department: draft.department.trim() || 'Human Resources',
            openings: 1,
            applicants: 0,
            shortlisted: 0,
            hired: 0,
            posted: todayIso(),
            employment_type: draft.employment_type,
            salary: draft.salary.trim() || 'To be discussed',
            status: 'Open',
            attachment: draft.attachment,
        };

        addedVacancies.value.push(vacancy);
        saveStored(STORAGE_KEY, addedVacancies.value);

        return vacancy;
    }

    function removeVacancy(id: number): void {
        addedVacancies.value = addedVacancies.value.filter(
            (vacancy) => vacancy.id !== id,
        );
        saveStored(STORAGE_KEY, addedVacancies.value);

        // Drop any status override for the removed vacancy.
        delete statusOverrides.value[id];
        saveStored(STATUS_KEY, statusOverrides.value);
    }

    /** Set the status (Open / On Hold / Closed) for a vacancy. */
    function setStatus(id: number, status: DemoJob['status']): void {
        statusOverrides.value[id] = status;
        saveStored(STATUS_KEY, statusOverrides.value);
    }

    /** Effective status: override wins over the seeded value. */
    function statusFor(vacancy: DemoJob): DemoJob['status'] {
        return statusOverrides.value[vacancy.id] ?? vacancy.status;
    }

    /** Set or clear the interview schedule for a candidate. */
    function setInterview(candidateId: number, datetime: string): void {
        if (datetime.trim() === '') {
            delete interviewOverrides.value[candidateId];
        } else {
            interviewOverrides.value[candidateId] = datetime.trim();
        }

        saveStored(INTERVIEW_KEY, interviewOverrides.value);
    }

    /** All interview schedule overrides set in this session. */
    function interviewSchedules(): Record<number, string> {
        return { ...interviewOverrides.value };
    }

    return {
        addedVacancies,
        addVacancy,
        removeVacancy,
        setStatus,
        statusFor,
        setInterview,
        interviewSchedules,
    };
}
