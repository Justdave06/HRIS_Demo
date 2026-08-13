import { ref } from 'vue';
import type { DemoEmployee } from '@/types';

/*
 * Employee Portal — employees log in with the email + temporary password HR
 * created when they were hired (Add Employee in Employee Management).
 *
 * Session-backed like every other demo store: credentials and the logged-in
 * session survive navigation in the same tab, gone when the tab closes.
 * Seeded demo employees get sample credentials on first visit so the portal
 * works out of the box.
 */

const CRED_KEY = 'hris-demo-portal-credentials';
const SESSION_KEY = 'hris-demo-portal-session';

/** Temporary password every seeded sample employee can log in with. */
export const DEMO_PORTAL_PASSWORD = 'demo1234';

export type PortalCredentials = {
    email: string;
    password: string;
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

const credentials = ref<Record<number, PortalCredentials>>(
    loadStored<Record<number, PortalCredentials>>(CRED_KEY, {}),
);

const sessionId = ref<number | null>(
    loadStored<number | null>(SESSION_KEY, null),
);

export function useDemoPortal() {
    /** Seed sample credentials for the seeded employees (first visit only). */
    function ensureSeeded(
        employees: Pick<DemoEmployee, 'id' | 'email'>[],
    ): void {
        let changed = false;

        for (const employee of employees) {
            if (!employee.email) {
                continue;
            }

            if (!credentials.value[employee.id]) {
                credentials.value[employee.id] = {
                    email: employee.email,
                    password: DEMO_PORTAL_PASSWORD,
                };
                changed = true;
            }
        }

        if (changed) {
            saveStored(CRED_KEY, credentials.value);
        }
    }

    /** HR creates the employee's portal login (email + temporary password). */
    function setCredentials(
        employeeId: number,
        email: string,
        password: string,
    ): void {
        credentials.value[employeeId] = {
            email: email.trim(),
            password,
        };
        saveStored(CRED_KEY, credentials.value);
    }

    function credentialsFor(employeeId: number): PortalCredentials | undefined {
        return credentials.value[employeeId];
    }

    /** Validate an email + password; returns the employee id or null. */
    function authenticate(email: string, password: string): number | null {
        const normalized = email.trim().toLowerCase();

        for (const [id, cred] of Object.entries(credentials.value)) {
            if (
                cred.email.trim().toLowerCase() === normalized &&
                cred.password === password
            ) {
                return Number(id);
            }
        }

        return null;
    }

    /** Sign the employee into the portal (session-persisted). */
    function login(employeeId: number): void {
        sessionId.value = employeeId;
        saveStored(SESSION_KEY, employeeId);
    }

    function logout(): void {
        sessionId.value = null;
        saveStored(SESSION_KEY, null);
    }

    return {
        credentials,
        ensureSeeded,
        setCredentials,
        credentialsFor,
        authenticate,
        sessionId,
        login,
        logout,
    };
}
