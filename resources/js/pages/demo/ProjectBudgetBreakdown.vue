<script setup lang="ts">
import { ChevronRight, Plus, Printer, Search, Trash2, X } from '@lucide/vue';
import { defaultDocument, useScrollLock } from '@vueuse/core';
import { computed, ref, watch } from 'vue';
import { toast } from 'vue-sonner';
import AttendanceReportDocument from '@/components/demo/AttendanceReportDocument.vue';
import RecordPrintModal from '@/components/demo/RecordPrintModal.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import {
    lineTotal,
    makeSeedBudgetItems,
    useDemoBudgetSpending,
} from '@/composables/useDemoBudgetSpending';
import type {
    BudgetItem,
    BudgetType,
} from '@/composables/useDemoBudgetSpending';
import { exportSheet } from '@/lib/exportExcel';
import type { DemoProjectRow } from '@/types';

/*
 * Tab panel of ProjectView: filterable budget table with an "Add spending"
 * modal. The parent owns the header and the report/export actions — this
 * component exposes generateReport() and exportExcel() to it.
 *
 * The table lists one row per receipt, so a slip added here shows up as its
 * own line. Seeded lines come from the project's approved budget; added
 * receipts are session-backed (see useDemoBudgetSpending).
 */
const props = defineProps<{
    project: DemoProjectRow;
}>();

const budgetTypes = ['All', 'Materials', 'Labor'] as const;
type BudgetFilter = (typeof budgetTypes)[number];

const selectedType = ref<BudgetFilter>('All');
const search = ref('');
const selectedDate = ref('2026-09-30');
const showPreview = ref(false);
const showAddSpending = ref(false);
const showDetail = ref(false);
const selectedItem = ref<ReceiptGroup | null>(null);

// The modal is a plain div (not a reka Dialog), so lock the page behind it.
const pageScrollLocked = useScrollLock(defaultDocument?.body);

watch(showAddSpending, (open) => {
    pageScrollLocked.value = open;
});

/** Receipt-level details, shared by every line on the same slip. */
type ReceiptForm = {
    type: BudgetType;
    category: string;
    vendor: string;
    receiptNo: string;
    costCenter: string;
    date: string;
};

/** One editable row of the "Add spending" receipt table. */
type LineRow = {
    id: number;
    description: string;
    quantity: number;
    price: number;
};

function emptyReceiptForm(): ReceiptForm {
    return {
        type: 'Materials',
        category: '',
        vendor: '',
        receiptNo: '',
        costCenter: '',
        date: '',
    };
}

function createLineRow(): LineRow {
    return {
        id: Date.now() + Math.random(),
        description: '',
        quantity: 1,
        price: 0,
    };
}

const typeConfig = {
    Materials: {
        categoryLabel: 'Category',
        quantityLabel: 'QTY',
        vendorLabel: 'Vendor name',
        vendorPlaceholder: 'e.g. IT Supply Co.',
        receiptLabel: 'Receipt #',
        costCenterLabel: 'Cost center',
        costCenterPlaceholder: 'Select cost center',
        unit: 'unit',
    },
    Labor: {
        categoryLabel: 'Work description',
        quantityLabel: 'QTY (days)',
        vendorLabel: 'Personnel / Provider',
        vendorPlaceholder: 'e.g. BluePeak Consulting',
        receiptLabel: 'Invoice / OR #',
        costCenterLabel: 'Assigned team / Cost center',
        costCenterPlaceholder: 'Select assigned team',
        unit: 'day',
    },
} as const;

/** Cost centers / assigned teams that can carry a project expense. */
const COST_CENTERS = [
    'Procurement',
    'Infrastructure',
    'Project Delivery',
    'HR Enablement',
    'Data Migration',
    'Operations',
    'General',
] as const;

function quantityLabel(item: Pick<BudgetItem, 'quantity' | 'unit'>): string {
    const quantity = Number(item.quantity || 0);

    return `${quantity} ${item.unit}${quantity === 1 ? '' : 's'}`;
}

/** Amounts on the receipt keep two decimals, like the printed slip. */
function money(value: number): string {
    return Number(value || 0).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

/*
 * Seeded lines are derived from the project's approved budget on every mount;
 * receipts added in this session are merged in from sessionStorage, so
 * switching tabs and coming back no longer drops them.
 *
 * Added receipts lead the list (newest first), so a slip you just saved is
 * row 1 — the seeded lines follow in their original order.
 */
const { receipts: savedReceipts, addReceipt } = useDemoBudgetSpending(
    props.project.id,
);

const budgetItems = computed<BudgetItem[]>(() => [
    ...[...savedReceipts.value].reverse(),
    ...makeSeedBudgetItems(Number(props.project.budget || 0)),
]);
/*
 * "Add spending" records one receipt: the slip's own details (vendor,
 * receipt #, date) sit above a table of line items. "Add item" appends
 * another row to that table.
 */
const receiptForm = ref<ReceiptForm>(emptyReceiptForm());
const lineRows = ref<LineRow[]>([createLineRow()]);

const formConfig = computed(() => typeConfig[receiptForm.value.type]);

/**
 * Categories already on the books for the chosen type — additional spending is
 * booked into one of them rather than inventing a new one.
 */
const categoryOptions = computed(() => {
    const seen = new Set<string>();

    return budgetItems.value
        .filter((item) => item.type === receiptForm.value.type)
        .map((item) => item.category)
        .filter((category) => {
            if (seen.has(category)) {
                return false;
            }

            seen.add(category);

            return true;
        });
});

// Each type has its own categories, so a type switch clears the pick.
watch(
    () => receiptForm.value.type,
    () => {
        receiptForm.value.category = '';
    },
);

const receiptDraftTotal = computed(() =>
    lineRows.value.reduce((sum, row) => sum + lineTotal(row), 0),
);

/** "Add item" — one more line row on the receipt. */
function addLineRow(): void {
    lineRows.value.push(createLineRow());
}

function removeLineRow(index: number): void {
    lineRows.value.splice(index, 1);

    if (lineRows.value.length === 0) {
        lineRows.value.push(createLineRow());
    }
}

function resetSpendingForm(): void {
    receiptForm.value = emptyReceiptForm();
    lineRows.value = [createLineRow()];
}

function closeAddSpending(): void {
    showAddSpending.value = false;
    resetSpendingForm();
}

/** Rows with something on them — untouched extra rows are ignored. */
function filledLineRows(): LineRow[] {
    return lineRows.value.filter(
        (row) => row.description.trim() !== '' || Number(row.price) > 0,
    );
}

function saveSpending(): void {
    const rows = filledLineRows();

    if (rows.length === 0) {
        toast.error('Nothing to save yet — add at least one item first');

        return;
    }

    if (receiptForm.value.category === '') {
        toast.error(`Pick a ${formConfig.value.categoryLabel.toLowerCase()}`);

        return;
    }

    if (rows.some((row) => row.description.trim() === '')) {
        toast.error('Every line on the receipt needs a description');

        return;
    }

    if (
        rows.some(
            (row) =>
                !Number.isFinite(Number(row.quantity)) ||
                Number(row.quantity) <= 0,
        )
    ) {
        toast.error('Quantity must be at least 1');

        return;
    }

    if (
        rows.some(
            (row) =>
                !Number.isFinite(Number(row.price)) || Number(row.price) < 0,
        )
    ) {
        toast.error('Enter a valid unit price (0 or more)');

        return;
    }

    const { type, category, vendor, receiptNo, costCenter, date } =
        receiptForm.value;

    /*
     * One receipt, many lines — a shared receiptId keeps the slip together on
     * a single row of the breakdown table.
     */
    const receiptId = `receipt-${Date.now()}`;

    addReceipt(
        rows.map((row) => ({
            receiptId,
            id: Date.now() + Math.random(),
            category,
            description: row.description.trim(),
            type,
            vendor: vendor.trim() || 'N/A',
            receiptNo: receiptNo.trim() || 'N/A',
            costCenter: costCenter.trim() || 'General',
            quantity: Number(row.quantity),
            unit: typeConfig[type].unit,
            price: Number(row.price),
            date: date || new Date().toISOString().slice(0, 10),
        })),
    );

    const savedCount = rows.length;

    closeAddSpending();
    toast.success(
        `Receipt saved — ${savedCount} line${savedCount === 1 ? '' : 's'} added (demo)`,
    );
}

/** One receipt: the slip's details plus each line printed on it. */
type ReceiptGroup = {
    key: string;
    category: string;
    type: BudgetType;
    vendor: string;
    vendors: string[];
    costCenter: string;
    costCenters: string[];
    quantity: number;
    unit: string;
    amount: number;
    receipts: string[];
    date: string;
    items: BudgetItem[];
};

function unique(values: string[]): string[] {
    return [...new Set(values.filter((value) => value.trim() !== ''))];
}

/** Names as themselves, trimmed to a readable cell when a category has many. */
function nameListLabel(names: string[]): string {
    if (names.length === 0) {
        return 'N/A';
    }

    if (names.length <= 2) {
        return names.join(', ');
    }

    return `${names.slice(0, 2).join(', ')} +${names.length - 2}`;
}

/*
 * One group per receipt — a new slip gets its own row rather than growing the
 * row of the category it was booked into.
 */
const receiptGroups = computed<ReceiptGroup[]>(() => {
    const grouped = new Map<string, BudgetItem[]>();

    for (const item of budgetItems.value) {
        const key = item.receiptId;
        const bucket = grouped.get(key);

        if (bucket) {
            bucket.push(item);
        } else {
            grouped.set(key, [item]);
        }
    }

    return [...grouped.entries()].map(([key, items]) => {
        const vendors = unique(items.map((item) => item.vendor));
        const costCenters = unique(items.map((item) => item.costCenter));
        const receipts = unique(items.map((item) => item.receiptNo));
        const dates = items
            .map((item) => item.date)
            .filter(Boolean)
            .sort();

        return {
            key,
            category: items[0].category,
            type: items[0].type,
            vendor: nameListLabel(vendors),
            vendors,
            costCenter: nameListLabel(costCenters),
            costCenters,
            quantity: items.reduce(
                (sum, item) => sum + Number(item.quantity || 0),
                0,
            ),
            unit: items[0].unit,
            amount: items.reduce((sum, item) => sum + lineTotal(item), 0),
            receipts,
            date: dates.at(-1) ?? '',
            items,
        };
    });
});

const filteredReceipts = computed(() => {
    const query = search.value.trim().toLowerCase();

    return receiptGroups.value.filter((group) => {
        const matchesType =
            selectedType.value === 'All' || group.type === selectedType.value;
        const matchesQuery =
            query === '' ||
            [
                group.category,
                group.vendor,
                group.costCenter,
                group.type,
                ...group.receipts,
                ...group.items.map((item) => item.description),
            ]
                .join(' ')
                .toLowerCase()
                .includes(query);

        return matchesType && matchesQuery;
    });
});

/*
 * The approved budget is an attribute of the project, not a sum of the
 * receipts below it — adding spending must never move it.
 */
const approvedBudget = computed(() => Number(props.project.budget || 0));

/** What the receipts actually add up to — what the share column is measured against. */
const totalSpend = computed(() =>
    budgetItems.value.reduce((sum, row) => sum + lineTotal(row), 0),
);

/** How far spend runs past the approved budget — zero while it is within it. */
const shortfall = computed(() =>
    Math.max(0, totalSpend.value - approvedBudget.value),
);

const isOverBudget = computed(() => shortfall.value > 0);

const materialsTotal = computed(() =>
    budgetItems.value
        .filter((row) => row.type === 'Materials')
        .reduce((sum, row) => sum + lineTotal(row), 0),
);

const laborTotal = computed(() =>
    budgetItems.value
        .filter((row) => row.type === 'Labor')
        .reduce((sum, row) => sum + lineTotal(row), 0),
);

/*
 * One row per receipt — a saved slip adds a row here, and its lines stay
 * listed in the drawer.
 */
const tableRows = computed(() =>
    filteredReceipts.value.map((group, index) => ({
        no: index + 1,
        group,
        category: group.category,
        type: group.type,
        vendor: group.vendor,
        receiptNo: group.receipts.join(', '),
        costCenter: group.costCenter,
        quantity: quantityLabel(group),
        amount: group.amount,
        share: `${((group.amount / Math.max(totalSpend.value, 1)) * 100).toFixed(1)}%`,
        date: group.date,
    })),
);

const receiptTotal = computed(() => selectedItem.value?.amount ?? 0);

function openDetail(group: ReceiptGroup): void {
    selectedItem.value = group;
    showDetail.value = true;
}

function generateReport(): void {
    showPreview.value = true;
}

/** Prints just the open receipt slip — see the print styles at the bottom. */
function printReceipt(): void {
    window.print();
}

function exportExcel(): void {
    const headers = [
        'No.',
        'Category',
        'Type',
        'Vendor',
        'Receipt #',
        'Cost Center',
        'Qty',
        'Amount',
        '% of Total',
        'Date',
    ];
    const rows = tableRows.value.map((row) => [
        row.no,
        row.category,
        row.type,
        row.vendor,
        row.receiptNo,
        row.costCenter,
        row.quantity,
        row.amount,
        row.share,
        row.date,
    ]);

    exportSheet(
        `${props.project.name.replaceAll(' ', '-').toLowerCase()}-budget-breakdown`,
        'Budget Breakdown',
        headers,
        rows,
    );
}

defineExpose({ generateReport, exportExcel });

const summaryLabel = computed(() => {
    if (selectedType.value === 'Materials') {
        return 'Materials';
    }

    if (selectedType.value === 'Labor') {
        return 'Labor';
    }

    return 'Budget breakdown';
});
</script>

<template>
    <div class="flex flex-col gap-6">
        <div class="grid gap-4 md:grid-cols-3">
            <div
                class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
                <p
                    class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                >
                    Total
                </p>
                <p class="mt-2 text-3xl font-bold text-slate-900 tabular-nums">
                    ₱{{ approvedBudget.toLocaleString() }}
                </p>
                <p class="mt-1 text-xs text-slate-500">
                    Approved project budget
                    <span v-if="isOverBudget" class="font-medium text-red-600">
                        · Short: ₱{{ shortfall.toLocaleString() }}
                    </span>
                </p>
            </div>

            <div
                class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
                <p
                    class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                >
                    Materials
                </p>
                <p class="mt-2 text-3xl font-bold text-slate-900 tabular-nums">
                    ₱{{ materialsTotal.toLocaleString() }}
                </p>
                <p class="mt-1 text-xs text-slate-500">
                    Inventory, software and equipment
                </p>
            </div>

            <div
                class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
                <p
                    class="text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                >
                    Labor
                </p>
                <p class="mt-2 text-3xl font-bold text-slate-900 tabular-nums">
                    ₱{{ laborTotal.toLocaleString() }}
                </p>
                <p class="mt-1 text-xs text-slate-500">
                    Implementation and support services
                </p>
            </div>
        </div>

        <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div
                class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
            >
                <div class="flex w-full flex-wrap items-center gap-3">
                    <Select v-model="selectedType" class="w-40">
                        <SelectTrigger class="w-40">
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem
                                v-for="type in budgetTypes"
                                :key="type"
                                :value="type"
                            >
                                {{ type }}
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    <div class="relative w-full max-w-xl flex-1">
                        <Search
                            class="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400"
                        />
                        <Input
                            v-model="search"
                            placeholder="Search category, vendor or receipt #"
                            class="pl-9"
                        />
                    </div>

                    <div class="flex items-center gap-2">
                        <label class="text-xs font-medium text-slate-500"
                            >Date</label
                        >
                        <input
                            v-model="selectedDate"
                            type="date"
                            class="h-10 rounded-md border border-slate-200 bg-white px-2.5 text-sm text-slate-700 transition outline-none focus:border-blue-400"
                        />
                    </div>
                </div>
            </div>
        </div>

        <div class="flex justify-end">
            <Button variant="outline" @click="showAddSpending = true">
                <Plus class="size-4" />
                Add spending
            </Button>
        </div>

        <div class="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div class="flex items-center justify-between border-b px-5 py-4">
                <h2 class="font-semibold text-slate-900">{{ summaryLabel }}</h2>
                <span
                    class="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 tabular-nums"
                >
                    {{ tableRows.length }} receipt{{
                        tableRows.length === 1 ? '' : 's'
                    }}
                </span>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full min-w-[900px] text-sm">
                    <thead>
                        <tr
                            class="border-b text-left text-xs tracking-wide text-slate-500 uppercase"
                        >
                            <th class="px-4 py-3 font-medium">No.</th>
                            <th class="px-4 py-3 font-medium">Category</th>
                            <th class="px-4 py-3 font-medium">Type</th>
                            <th class="px-4 py-3 font-medium">Vendor</th>
                            <th class="px-4 py-3 font-medium">Cost center</th>
                            <th class="px-4 py-3 text-right font-medium">
                                Qty
                            </th>
                            <th class="px-4 py-3 text-right font-medium">
                                Amount
                            </th>
                            <th class="px-4 py-3 text-right font-medium">
                                Share
                            </th>
                            <th class="px-4 py-3 font-medium">Date</th>
                            <th class="px-4 py-3">
                                <span class="sr-only">Details</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="row in tableRows"
                            :key="row.group.key"
                            class="cursor-pointer border-b transition-colors last:border-0 hover:bg-slate-50"
                            @click="openDetail(row.group)"
                        >
                            <td class="px-4 py-3 text-slate-500 tabular-nums">
                                {{ row.no }}
                            </td>
                            <td class="px-4 py-3 font-medium text-slate-900">
                                {{ row.category }}
                            </td>
                            <td class="px-4 py-3">
                                <span
                                    class="inline-flex rounded-full border px-2 py-0.5 text-xs font-medium"
                                    :class="
                                        row.type === 'Materials'
                                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                            : 'border-blue-200 bg-blue-50 text-blue-700'
                                    "
                                >
                                    {{ row.type }}
                                </span>
                            </td>
                            <td
                                class="px-4 py-3 text-slate-600"
                                :title="row.group.vendors.join(', ')"
                            >
                                {{ row.vendor }}
                            </td>
                            <td
                                class="px-4 py-3 text-slate-600"
                                :title="row.group.costCenters.join(', ')"
                            >
                                {{ row.costCenter }}
                            </td>
                            <td
                                class="px-4 py-3 text-right text-slate-600 tabular-nums"
                            >
                                {{ row.quantity }}
                            </td>
                            <td
                                class="px-4 py-3 text-right font-medium text-slate-900 tabular-nums"
                            >
                                ₱{{ row.amount.toLocaleString() }}
                            </td>
                            <td
                                class="px-4 py-3 text-right text-slate-600 tabular-nums"
                            >
                                {{ row.share }}
                            </td>
                            <td class="px-4 py-3 text-slate-600 tabular-nums">
                                {{ row.date }}
                            </td>
                            <td class="px-4 py-3 text-right">
                                <ChevronRight
                                    class="ml-auto size-4 text-slate-300"
                                />
                            </td>
                        </tr>
                        <tr v-if="tableRows.length === 0">
                            <td
                                colspan="10"
                                class="px-4 py-10 text-center text-sm text-slate-500"
                            >
                                No receipts match the selected filter.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <div
        v-if="showAddSpending"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
        @click.self="closeAddSpending"
    >
        <div
            class="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl bg-white p-6 shadow-2xl"
        >
            <div class="mb-5 flex shrink-0 items-center justify-between">
                <div>
                    <h3 class="text-lg font-bold text-slate-900">
                        Add spending
                    </h3>
                    <p class="text-sm text-slate-500">
                        One receipt — vendor details, then a row per line on the
                        slip
                    </p>
                </div>
                <button
                    type="button"
                    class="inline-flex size-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                    @click="closeAddSpending"
                    aria-label="Close"
                >
                    <X class="size-4" />
                </button>
            </div>

            <div class="flex min-h-0 flex-1 flex-col gap-4">
                <div class="grid shrink-0 gap-4 md:grid-cols-2">
                    <div>
                        <label
                            class="mb-1 block text-xs font-medium text-slate-600"
                            >Type</label
                        >
                        <Select v-model="receiptForm.type">
                            <SelectTrigger class="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Materials"
                                    >Materials</SelectItem
                                >
                                <SelectItem value="Labor">Labor</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label
                            class="mb-1 block text-xs font-medium text-slate-600"
                            >{{ formConfig.categoryLabel }}</label
                        >
                        <Select v-model="receiptForm.category">
                            <SelectTrigger class="w-full">
                                <SelectValue
                                    :placeholder="`Select existing ${formConfig.categoryLabel.toLowerCase()}`"
                                />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem
                                    v-for="option in categoryOptions"
                                    :key="option"
                                    :value="option"
                                >
                                    {{ option }}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label
                            class="mb-1 block text-xs font-medium text-slate-600"
                            >{{ formConfig.vendorLabel }}</label
                        >
                        <Input
                            v-model="receiptForm.vendor"
                            :placeholder="formConfig.vendorPlaceholder"
                        />
                    </div>
                    <div>
                        <label
                            class="mb-1 block text-xs font-medium text-slate-600"
                            >{{ formConfig.receiptLabel }}</label
                        >
                        <Input v-model="receiptForm.receiptNo" />
                    </div>
                    <div>
                        <label
                            class="mb-1 block text-xs font-medium text-slate-600"
                            >Spending date</label
                        >
                        <input
                            v-model="receiptForm.date"
                            type="date"
                            class="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 transition outline-none focus:border-blue-400"
                        />
                    </div>
                    <div>
                        <label
                            class="mb-1 block text-xs font-medium text-slate-600"
                            >{{ formConfig.costCenterLabel }}</label
                        >
                        <Select v-model="receiptForm.costCenter">
                            <SelectTrigger class="w-full">
                                <SelectValue
                                    :placeholder="
                                        formConfig.costCenterPlaceholder
                                    "
                                />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem
                                    v-for="center in COST_CENTERS"
                                    :key="center"
                                    :value="center"
                                >
                                    {{ center }}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <!-- Line items — "Add item" appends another row -->
                <div
                    class="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-slate-200"
                >
                    <div class="max-h-[560px] min-h-0 flex-1 overflow-auto">
                        <table
                            class="w-full min-w-[560px] border-collapse text-sm"
                        >
                            <thead>
                                <tr
                                    class="sticky top-0 z-10 border-b bg-slate-50 text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                                >
                                    <th
                                        class="w-24 px-3 py-2 text-left font-medium"
                                    >
                                        {{ formConfig.quantityLabel }}
                                    </th>
                                    <th class="px-3 py-2 text-left font-medium">
                                        Description
                                    </th>
                                    <th
                                        class="w-32 px-3 py-2 text-right font-medium"
                                    >
                                        Unit Price
                                    </th>
                                    <th
                                        class="w-32 px-3 py-2 text-right font-medium"
                                    >
                                        Amount
                                    </th>
                                    <th class="w-12 px-2 py-2">
                                        <span class="sr-only">Remove</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="divide-y">
                                <tr
                                    v-for="(row, index) in lineRows"
                                    :key="row.id"
                                >
                                    <td class="px-3 py-2 align-top">
                                        <Input
                                            v-model.number="row.quantity"
                                            type="number"
                                            min="1"
                                        />
                                    </td>
                                    <td class="px-3 py-2 align-top">
                                        <Input v-model="row.description" />
                                    </td>
                                    <td class="px-3 py-2 align-top">
                                        <Input
                                            v-model.number="row.price"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                        />
                                    </td>
                                    <td
                                        class="px-3 py-2 text-right align-top text-sm font-semibold text-slate-900 tabular-nums"
                                    >
                                        {{ money(lineTotal(row)) }}
                                    </td>
                                    <td class="px-2 py-2 text-right align-top">
                                        <button
                                            type="button"
                                            class="inline-flex size-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                                            :aria-label="`Remove item ${index + 1}`"
                                            @click="removeLineRow(index)"
                                        >
                                            <Trash2 class="size-4" />
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div
                        class="flex shrink-0 items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-3 py-2"
                    >
                        <button
                            type="button"
                            class="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                            @click.stop.prevent="addLineRow"
                        >
                            <Plus class="size-3.5" />
                            Add item
                        </button>
                        <span class="text-xs text-slate-500">
                            {{ lineRows.length }} row{{
                                lineRows.length === 1 ? '' : 's'
                            }}
                        </span>
                    </div>
                </div>

                <div
                    class="flex shrink-0 items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3"
                >
                    <span class="text-sm text-slate-600">Receipt total</span>
                    <span
                        class="text-base font-bold text-slate-900 tabular-nums"
                    >
                        ₱{{ money(receiptDraftTotal) }}
                    </span>
                </div>

                <div class="flex shrink-0 flex-wrap justify-end gap-2 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        @click="closeAddSpending"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        class="bg-blue-600 hover:bg-blue-700"
                        @click="saveSpending"
                    >
                        Save spending
                    </Button>
                </div>
            </div>
        </div>
    </div>

    <RecordPrintModal
        v-if="showPreview"
        :heading="`${project.name} — Budget breakdown`"
        subtitle="Project cost summary · ready to print"
        @close="showPreview = false"
    >
        <AttendanceReportDocument
            :title="`${project.name} Budget Breakdown`"
            :period="`As of ${selectedDate}`"
            system="Project Management System"
            :columns="[
                { key: 'category', label: 'Category' },
                { key: 'type', label: 'Type' },
                { key: 'vendor', label: 'Vendor' },
                { key: 'receiptNo', label: 'Receipt #' },
                { key: 'costCenter', label: 'Cost Center' },
                { key: 'amount', label: 'Amount', numeric: true },
                { key: 'share', label: 'Share' },
                { key: 'date', label: 'Date' },
            ]"
            :rows="
                tableRows.map((row) => ({
                    category: row.category,
                    type: row.type,
                    vendor: row.vendor,
                    receiptNo: row.receiptNo,
                    costCenter: row.costCenter,
                    amount: row.amount,
                    share: row.share,
                    date: row.date,
                }))
            "
            :note="`${selectedType} filter • total approved budget ₱${project.budget.toLocaleString()} • ${selectedDate}`"
        />
    </RecordPrintModal>

    <Sheet v-model:open="showDetail">
        <SheetContent class="receipt-sheet w-full sm:max-w-xl">
            <template v-if="selectedItem">
                <SheetHeader>
                    <SheetTitle class="text-center">
                        {{ selectedItem.category }}
                    </SheetTitle>
                </SheetHeader>

                <div
                    id="receipt-print-area"
                    class="relative mx-4 mb-4 flex flex-1 flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 font-mono text-sm shadow-sm"
                >
                    <div class="absolute top-4 right-4 print:hidden">
                        <Button
                            variant="outline"
                            size="sm"
                            @click="printReceipt"
                        >
                            <Printer class="size-3.5" />
                            Print
                        </Button>
                    </div>

                    <!-- On screen the drawer header carries the category; print needs its own copy. -->
                    <h2
                        class="hidden text-center text-sm font-bold text-slate-900 print:block"
                    >
                        {{ selectedItem.category }}
                    </h2>

                    <h3
                        class="text-center text-[11px] font-semibold tracking-wide text-slate-900 uppercase"
                    >
                        Expenses Summary
                    </h3>

                    <div class="flex flex-col gap-2">
                        <div
                            class="flex items-baseline gap-3 text-[11px] text-slate-600"
                        >
                            <span class="shrink-0 tracking-wide uppercase">
                                VENDOR
                            </span>
                            <span
                                class="min-w-0 truncate font-medium text-slate-900"
                                :title="selectedItem.vendors.join(', ')"
                            >
                                {{ selectedItem.vendor }}
                            </span>
                        </div>
                        <div
                            class="flex items-baseline gap-3 text-[11px] text-slate-600"
                        >
                            <span class="shrink-0 tracking-wide uppercase">
                                RECEIPT #
                            </span>
                            <span
                                class="min-w-0 truncate font-medium text-slate-900 tabular-nums"
                            >
                                {{ selectedItem.receipts.join(', ') }}
                            </span>
                        </div>
                        <div
                            class="flex items-baseline gap-3 text-[11px] text-slate-600"
                        >
                            <span class="shrink-0 tracking-wide uppercase">
                                DATE
                            </span>
                            <span
                                class="font-medium text-slate-900 tabular-nums"
                            >
                                {{ selectedItem.date }}
                            </span>
                        </div>
                    </div>

                    <!-- Line items -->
                    <div class="overflow-x-auto">
                        <table class="w-full min-w-0 border-collapse text-sm">
                            <thead>
                                <tr
                                    class="border-y border-slate-300 text-[11px] font-medium tracking-wide text-slate-500 uppercase"
                                >
                                    <th class="py-2 pr-3 text-left font-medium">
                                        QTY
                                    </th>
                                    <th class="py-2 pr-3 text-left font-medium">
                                        Description
                                    </th>
                                    <th
                                        class="py-2 pr-3 text-right font-medium"
                                    >
                                        Unit Price
                                    </th>
                                    <th class="py-2 text-right font-medium">
                                        Amount
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="line in selectedItem.items"
                                    :key="line.id"
                                    class="border-b border-slate-100 align-top"
                                >
                                    <td
                                        class="py-2 pr-3 text-slate-600 tabular-nums"
                                    >
                                        {{
                                            Number(
                                                line.quantity || 0,
                                            ).toLocaleString()
                                        }}
                                    </td>
                                    <td class="py-2 pr-3">
                                        <span
                                            class="break-words text-slate-900"
                                        >
                                            {{
                                                line.description ||
                                                line.category
                                            }}
                                        </span>
                                        <span
                                            class="block text-[11px] text-slate-500"
                                        >
                                            {{ line.vendor }} ·
                                            {{ line.receiptNo }}
                                        </span>
                                    </td>
                                    <td
                                        class="py-2 pr-3 text-right text-slate-600 tabular-nums"
                                    >
                                        {{ money(line.price) }}
                                    </td>
                                    <td
                                        class="py-2 text-right font-semibold text-slate-900 tabular-nums"
                                    >
                                        {{ money(lineTotal(line)) }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div
                        class="mt-auto border-t-2 border-dashed border-slate-400 pt-3"
                    >
                        <div
                            class="flex items-center justify-between text-base font-bold text-slate-900"
                        >
                            <span>TOTAL</span>
                            <span class="tabular-nums"
                                >₱{{ money(receiptTotal) }}</span
                            >
                        </div>
                        <p
                            class="mt-1 text-right text-xs text-slate-500 tabular-nums"
                        >
                            {{
                                (
                                    (receiptTotal / Math.max(totalSpend, 1)) *
                                    100
                                ).toFixed(1)
                            }}% of project spend
                        </p>
                    </div>
                </div>
            </template>
        </SheetContent>
    </Sheet>
</template>

<style>
/*
 * Printing from the receipt drawer outputs only the slip: the rest of the
 * app and the drawer chrome step aside, and the slip returns to normal flow.
 */
@media print {
    /*
     * No page margin means no room for the browser's own header/footer, so
     * the document title (project name) is left out of the printout. The slip
     * below brings its own padding instead.
     */
    @page {
        margin: 0;
    }

    body * {
        visibility: hidden;
    }

    #receipt-print-area,
    #receipt-print-area * {
        visibility: visible;
    }

    body {
        height: auto !important;
        overflow: visible !important;
    }

    [data-slot='sheet-overlay'] {
        display: none !important;
    }

    .receipt-sheet {
        position: static !important;
        height: auto !important;
        width: 100% !important;
        max-width: none !important;
        gap: 0 !important;
        border: 0 !important;
        padding: 0 !important;
        box-shadow: none !important;
    }

    #receipt-print-area {
        width: 100% !important;
        margin: 0 !important;
        border: 0 !important;
        padding: 16mm 14mm !important;
        box-shadow: none !important;
    }
}
</style>
