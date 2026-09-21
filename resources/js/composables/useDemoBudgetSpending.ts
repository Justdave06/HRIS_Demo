import { computed, ref } from 'vue';

/*
 * Project budget spending (Module 11). "Add spending" records one receipt: a
 * slip whose lines share the vendor, receipt number, date, category and cost
 * center. Each receipt carries its own `receiptId`, so the breakdown table can
 * list one row per receipt instead of folding every slip into its category.
 *
 * Session-backed like every other demo store: added receipts survive
 * navigation in the same tab (switching tabs no longer wipes them), gone when
 * the tab closes. No database.
 */

const STORED_KEY = 'hris-demo-project-spending';

export type BudgetType = 'Materials' | 'Labor';

export type BudgetItem = {
    /** Receipt this line belongs to — the table lists one row per receipt. */
    receiptId: string;
    id: number;
    category: string;
    /** Line text as it reads on the vendor's slip. */
    description: string;
    type: BudgetType;
    vendor: string;
    /** Number printed on the vendor's receipt / OR — typed in by hand. */
    receiptNo: string;
    costCenter: string;
    quantity: number;
    unit: string;
    price: number;
    date: string;
};

/** Saved receipts per project id. */
type StoredSpending = Record<number, BudgetItem[]>;

function loadStored(): StoredSpending {
    if (typeof window === 'undefined') {
        return {};
    }

    try {
        const raw = window.sessionStorage.getItem(STORED_KEY);

        return raw ? (JSON.parse(raw) as StoredSpending) : {};
    } catch {
        return {};
    }
}

function saveStored(value: StoredSpending): void {
    if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(STORED_KEY, JSON.stringify(value));
    }
}

/** Line amount: quantity × price, floored at zero. */
export function lineTotal(
    item: Pick<BudgetItem, 'quantity' | 'price'>,
): number {
    return Math.max(0, Number(item.quantity || 0) * Number(item.price || 0));
}

/*
 * The slips already on the books when a project is opened: the approved budget
 * spread across five receipts. Shared by the budget tab and the reports module
 * so both read the same expenses.
 */
const SEED_RATIOS = [0.18, 0.22, 0.34, 0.15, 0.11];

export function makeSeedBudgetItems(totalBudget: number): BudgetItem[] {
    const amounts = SEED_RATIOS.map((ratio) => totalBudget * ratio);
    const remainder =
        totalBudget - amounts.reduce((sum, value) => sum + value, 0);
    amounts[0] += remainder;

    return [
        {
            receiptId: 'seed-1',
            id: 1,
            category: 'Software licenses',
            description: 'Annual IDE and design tool subscriptions',
            type: 'Materials',
            vendor: 'IT Supply Co.',
            receiptNo: 'OR-2026-0417',
            costCenter: 'Procurement',
            quantity: 1,
            unit: 'unit',
            price: Math.round(amounts[0]),
            date: '2026-03-11',
        },
        {
            receiptId: 'seed-2',
            id: 2,
            category: 'Hardware equipment',
            description: 'Laptops, docking stations and monitors',
            type: 'Materials',
            vendor: 'MetroTech',
            receiptNo: 'OR-2026-0623',
            costCenter: 'Infrastructure',
            quantity: 1,
            unit: 'unit',
            price: Math.round(amounts[1]),
            date: '2026-04-14',
        },
        {
            receiptId: 'seed-3',
            id: 3,
            category: 'Implementation labor',
            description: 'Sprint delivery and system configuration',
            type: 'Labor',
            vendor: 'BluePeak Consulting',
            receiptNo: 'INV-2026-0158',
            costCenter: 'Project Delivery',
            quantity: 1,
            unit: 'day',
            price: Math.round(amounts[2]),
            date: '2026-05-09',
        },
        {
            receiptId: 'seed-4',
            id: 4,
            category: 'Training and onboarding',
            description: 'Role-based onboarding workshops',
            type: 'Labor',
            vendor: 'PeopleFirst Studio',
            receiptNo: 'INV-2026-0247',
            costCenter: 'HR Enablement',
            quantity: 1,
            unit: 'day',
            price: Math.round(amounts[3]),
            date: '2026-06-18',
        },
        {
            receiptId: 'seed-5',
            id: 5,
            category: 'Migration services',
            description: 'Legacy data extraction and validation',
            type: 'Labor',
            vendor: 'Nova Advisory',
            receiptNo: 'INV-2026-0311',
            costCenter: 'Data Migration',
            quantity: 1,
            unit: 'day',
            price: Math.round(amounts[4]),
            date: '2026-07-22',
        },
    ];
}

/**
 * Everything booked to one project: receipts added this session (newest
 * first) on top of the seeded slips. Reads the store directly, so report pages
 * can show expenses for every project without mounting the budget tab.
 */
export function budgetItemsForProject(
    projectId: number,
    approvedBudget: number,
): BudgetItem[] {
    const saved = loadStored()[projectId] ?? [];

    return [...[...saved].reverse(), ...makeSeedBudgetItems(approvedBudget)];
}

export function useDemoBudgetSpending(projectId: number) {
    const stored = ref<StoredSpending>(loadStored());

    /** Receipts added to this project in this session. */
    const receipts = computed<BudgetItem[]>(
        () => stored.value[projectId] ?? [],
    );

    /** Book one receipt — every line is stored under the same receiptId. */
    function addReceipt(items: BudgetItem[]): void {
        if (items.length === 0) {
            return;
        }

        stored.value = {
            ...stored.value,
            [projectId]: [...receipts.value, ...items],
        };
        saveStored(stored.value);
    }

    return { receipts, addReceipt };
}
