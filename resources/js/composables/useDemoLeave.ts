import { ref } from 'vue';
import type { DemoLeaveRequest, DemoLeaveStatus } from '@/types';

/*
 * Leave requests filed from the New Request modal, plus Approve/Decline
 * overrides applied to seeded requests.
 *
 * Session-backed like every other demo store: survives navigation and reloads
 * in the same tab, gone when the tab closes. No database.
 */
const STORAGE_KEY = 'hris-demo-added-leave';
const STATUS_KEY = 'hris-demo-leave-statuses';

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

const addedRequests = ref<DemoLeaveRequest[]>(
    loadStored<DemoLeaveRequest[]>(STORAGE_KEY, []),
);

// Status overrides per request id, so seeded requests can be approved or
// declined too. Approving marks the days off in Attendance (per the module
// interconnection map) and feeds Payroll as paid/unpaid leave.
const statusOverrides = ref<Record<number, DemoLeaveStatus>>(
    loadStored<Record<number, DemoLeaveStatus>>(STATUS_KEY, {}),
);

export type LeaveDraft = {
    employee_id: number;
    type: DemoLeaveRequest['type'];
    from: string;
    to: string;
    days: number;
    reason: string;
};

export function useDemoLeave() {
    function nextId(): number {
        const highest = addedRequests.value.reduce(
            (max, request) => Math.max(max, request.id),
            1000,
        );

        return highest + 1;
    }

    function addRequest(draft: LeaveDraft): DemoLeaveRequest {
        const request: DemoLeaveRequest = {
            id: nextId(),
            employee_id: draft.employee_id,
            type: draft.type,
            from: draft.from,
            to: draft.to,
            days: draft.days,
            status: 'Pending',
            reason: draft.reason.trim() || 'Leave request',
        };

        addedRequests.value.unshift(request);
        saveStored(STORAGE_KEY, addedRequests.value);

        return request;
    }

    /** Approve or decline a request (works for seeded + added requests). */
    function setStatus(id: number, status: DemoLeaveStatus): void {
        statusOverrides.value[id] = status;
        saveStored(STATUS_KEY, statusOverrides.value);
    }

    /** Effective status: override wins over the seeded value. */
    function statusFor(request: DemoLeaveRequest): DemoLeaveStatus {
        return statusOverrides.value[request.id] ?? request.status;
    }

    return { addedRequests, addRequest, setStatus, statusFor };
}
