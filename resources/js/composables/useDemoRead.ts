import { ref } from 'vue';

/*
 * Read-state store for the demo's tab badges (e.g. the Enrollments / Loan
 * applications tab counts on Benefits & Loans). A badge shows how many rows
 * are still unread — opening a row via its View action marks it read, and
 * once everything has been read the badge disappears until a new record
 * arrives.
 *
 * Session-backed like every other demo store: read marks survive navigation
 * in the same tab, gone when the tab closes. No database.
 */

const READ_KEY = 'hris-demo-read-keys';

function loadReadKeys(): Set<string> {
    if (typeof window === 'undefined') {
        return new Set();
    }

    try {
        const raw = window.sessionStorage.getItem(READ_KEY);

        return new Set(raw ? (JSON.parse(raw) as string[]) : []);
    } catch {
        return new Set();
    }
}

const readKeys = ref<Set<string>>(loadReadKeys());

function saveReadKeys(): void {
    if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(
            READ_KEY,
            JSON.stringify([...readKeys.value]),
        );
    }
}

export function useDemoRead() {
    /** True once the row was opened via its View action. */
    function isRead(key: string): boolean {
        return readKeys.value.has(key);
    }

    /** Mark a row as read (session-persisted). */
    function markRead(key: string): void {
        if (readKeys.value.has(key)) {
            return;
        }

        readKeys.value = new Set(readKeys.value).add(key);
        saveReadKeys();
    }

    /** How many of the given row keys are still unread — the badge count. */
    function unreadCount(keys: string[]): number {
        return keys.filter((key) => !readKeys.value.has(key)).length;
    }

    return { isRead, markRead, unreadCount };
}
