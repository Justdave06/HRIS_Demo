import { ref } from 'vue';
import type { DemoAccount } from '@/types';

const STORAGE_KEY = 'hris-demo-account';

const selected = ref<DemoAccount | null>(loadFromStorage());

function loadFromStorage(): DemoAccount | null {
    if (typeof window === 'undefined') {
        return null;
    }

    try {
        const raw = localStorage.getItem(STORAGE_KEY);

        return raw ? (JSON.parse(raw) as DemoAccount) : null;
    } catch {
        return null;
    }
}

function persist(account: DemoAccount | null): void {
    if (typeof window === 'undefined') {
        return;
    }

    if (account) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(account));
    } else {
        localStorage.removeItem(STORAGE_KEY);
    }
}

export function useDemoAccount() {
    function selectAccount(account: DemoAccount): void {
        selected.value = account;
        persist(account);
    }

    function clearAccount(): void {
        selected.value = null;
        persist(null);
    }

    return {
        account: selected,
        selectAccount,
        clearAccount,
    };
}
