/*
 * Reset the demo to a fresh state: every record created during testing lives
 * in sessionStorage (added employees, leave requests, payslips, balances,
 * offboarding cases, portal credentials, status changes…) and the selected
 * demo account is kept in localStorage. Clearing all of them returns the
 * system to its out-of-the-box state — the seeded sample data stays, but
 * nothing you created during a test run survives.
 */
export function resetDemoData(): void {
    if (typeof window === 'undefined') {
        return;
    }

    const keysToRemove: string[] = [];

    for (let i = 0; i < window.sessionStorage.length; i += 1) {
        const key = window.sessionStorage.key(i);

        if (key?.startsWith('hris-demo-')) {
            keysToRemove.push(key);
        }
    }

    for (const key of keysToRemove) {
        window.sessionStorage.removeItem(key);
    }

    // The selected demo account persists in localStorage — clear it so the
    // fresh run starts at the account login screen with no one signed in.
    window.localStorage.removeItem('hris-demo-account');
}
