<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import {
    ArrowLeft,
    ArrowUpRight,
    FileBarChart2,
    Plus,
    Search,
    Trash2,
    X,
} from '@lucide/vue';
import { computed, ref } from 'vue';
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
import { exportSheet } from '@/lib/exportExcel';
import type { DemoProject } from '@/types';

const props = defineProps<{
    project: DemoProject;
}>();

type BudgetType = 'Materials' | 'Labor';

type BudgetItem = {
    id: number;
    category: string;
    type: BudgetType;
    vendor: string;
    costCenter: string;
    quantity: number;
    price: number;
    date: string;
};

const budgetTypes = ['All', 'Materials', 'Labor'] as const;
type BudgetFilter = (typeof budgetTypes)[number];

const selectedType = ref<BudgetFilter>('All');
const search = ref('');
const selectedDate = ref('2026-09-30');
const showPreview = ref(false);
const showAddSpending = ref(false);

const emptyItem = (): Omit<BudgetItem, 'id'> => ({
    category: '',
    type: 'Materials',
    vendor: '',
    costCenter: '',
    quantity: 1,
    price: 0,
    date: '',
});

function lineTotal(item: Pick<BudgetItem, 'quantity' | 'price'>): number {
    return Math.max(0, Number(item.quantity || 0) * Number(item.price || 0));
}

function makeSeedItems(totalBudget: number): BudgetItem[] {
    const ratios = [0.18, 0.22, 0.34, 0.15, 0.11];
    const amounts = ratios.map((ratio) => totalBudget * ratio);
    const remainder = totalBudget - amounts.reduce((sum, value) => sum + value, 0);
    amounts[0] += remainder;

    return [
        {
            id: 1,
            category: 'Software licenses',
            type: 'Materials',
            vendor: 'IT Supply Co.',
            costCenter: 'Procurement',
            quantity: 1,
            price: Math.round(amounts[0]),
            date: '2026-03-11',
        },
        {
            id: 2,
            category: 'Hardware equipment',
            type: 'Materials',
            vendor: 'MetroTech',
            costCenter: 'Infrastructure',
            quantity: 1,
            price: Math.round(amounts[1]),
            date: '2026-04-14',
        },
        {
            id: 3,
            category: 'Implementation labor',
            type: 'Labor',
            vendor: 'BluePeak Consulting',
            costCenter: 'Project Delivery',
            quantity: 1,
            price: Math.round(amounts[2]),
            date: '2026-05-09',
        },
        {
            id: 4,
            category: 'Training and onboarding',
            type: 'Labor',
            vendor: 'PeopleFirst Studio',
            costCenter: 'HR Enablement',
            quantity: 1,
            price: Math.round(amounts[3]),
            date: '2026-06-18',
        },
        {
            id: 5,
            category: 'Migration services',
            type: 'Labor',
            vendor: 'Nova Advisory',
            costCenter: 'Data Migration',
            quantity: 1,
            price: Math.round(amounts[4]),
            date: '2026-07-22',
        },
    ];
}

const budgetItems = ref<BudgetItem[]>(makeSeedItems(Number(props.project.budget || 0)));
const draftItems = ref<BudgetItem[]>([]);
const pendingItem = ref<BudgetItem>({
    id: Date.now(),
    ...emptyItem(),
});

function createPendingItem(): BudgetItem {
    return {
        id: Date.now() + Math.random(),
        ...emptyItem(),
    };
}

function addPendingItem(): void {
    const item = {
        ...pendingItem.value,
        category: pendingItem.value.category.trim(),
        vendor: pendingItem.value.vendor.trim(),
        costCenter: pendingItem.value.costCenter.trim(),
        quantity: Number(pendingItem.value.quantity) > 0 ? Number(pendingItem.value.quantity) : 1,
        price: Number(pendingItem.value.price) >= 0 ? Number(pendingItem.value.price) : 0,
    };

    if (!item.category) {
        return;
    }

    draftItems.value.push({
        ...item,
        vendor: item.vendor || 'N/A',
        costCenter: item.costCenter || 'General',
        id: Date.now() + Math.random(),
    });

    pendingItem.value = createPendingItem();
}

function removeDraftItem(index: number): void {
    draftItems.value.splice(index, 1);
}

function saveSpending(): void {
    if (draftItems.value.length === 0) {
        const item = { ...pendingItem.value, id: Date.now() + Math.random() };

        if (!item.category.trim()) {
            return;
        }

        budgetItems.value.push({
            ...item,
            category: item.category.trim(),
            vendor: item.vendor.trim() || 'N/A',
            costCenter: item.costCenter.trim() || 'General',
            quantity: Number(item.quantity) > 0 ? Number(item.quantity) : 1,
            price: Number(item.price) >= 0 ? Number(item.price) : 0,
            date: item.date || new Date().toISOString().slice(0, 10),
        });
    } else {
        budgetItems.value.push(
            ...draftItems.value.map((item) => ({
                ...item,
                category: item.category.trim(),
                vendor: item.vendor.trim() || 'N/A',
                costCenter: item.costCenter.trim() || 'General',
                quantity: Number(item.quantity) > 0 ? Number(item.quantity) : 1,
                price: Number(item.price) >= 0 ? Number(item.price) : 0,
                date: item.date || new Date().toISOString().slice(0, 10),
            })),
        );
    }

    draftItems.value = [];
    pendingItem.value = createPendingItem();
    showAddSpending.value = false;
}

const filteredRows = computed(() => {
    const query = search.value.trim().toLowerCase();

    return budgetItems.value.filter((row) => {
        const matchesType =
            selectedType.value === 'All' || row.type === selectedType.value;
        const matchesQuery =
            query === '' ||
            [row.category, row.vendor, row.costCenter, row.type]
                .join(' ')
                .toLowerCase()
                .includes(query);

        return matchesType && matchesQuery;
    });
});

const totalBudget = computed(() =>
    budgetItems.value.reduce((sum, row) => sum + lineTotal(row), 0),
);

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

const tableRows = computed(() =>
    filteredRows.value.map((row, index) => ({
        no: index + 1,
        category: row.category,
        type: row.type,
        vendor: row.vendor,
        costCenter: row.costCenter,
        quantity: row.quantity,
        amount: lineTotal(row),
        share: `${((lineTotal(row) / Math.max(totalBudget.value, 1)) * 100).toFixed(1)}%`,
        date: row.date,
    })),
);

function generateReport(): void {
    showPreview.value = true;
}

function exportExcel(): void {
    const headers = ['No.', 'Category', 'Type', 'Vendor', 'Cost Center', 'Qty', 'Amount', '% of Total', 'Date'];
    const rows = tableRows.value.map((row) => [
        row.no,
        row.category,
        row.type,
        row.vendor,
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
    <Head :title="`${project.name} — Budget Breakdown`" />

    <div class="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <Link
                    :href="`/demo/projects/registry/${project.id}`"
                    class="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-blue-600"
                >
                    <ArrowLeft class="size-3.5" />
                    Back to project
                </Link>
                <h1 class="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                    Budget Breakdown
                </h1>
                <p class="mt-1 text-sm text-slate-500">
                    {{ project.name }} · Total approved budget ₱{{ project.budget.toLocaleString() }}
                </p>
            </div>

            <div class="flex flex-wrap gap-2">
                <Button variant="outline" @click="generateReport">
                    <FileBarChart2 class="size-4" />
                    Generate report
                </Button>
                <Button class="bg-blue-600 hover:bg-blue-700" @click="exportExcel">
                    <ArrowUpRight class="size-4" />
                    Export to Excel
                </Button>
            </div>
        </div>

        <div class="grid gap-4 md:grid-cols-3">
            <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <p class="text-[11px] font-medium tracking-wide text-slate-500 uppercase">
                    Total
                </p>
                <p class="mt-2 text-3xl font-bold text-slate-900 tabular-nums">
                    ₱{{ totalBudget.toLocaleString() }}
                </p>
                <p class="mt-1 text-xs text-slate-500">Approved project budget</p>
            </div>

            <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <p class="text-[11px] font-medium tracking-wide text-slate-500 uppercase">
                    Materials
                </p>
                <p class="mt-2 text-3xl font-bold text-slate-900 tabular-nums">
                    ₱{{ materialsTotal.toLocaleString() }}
                </p>
                <p class="mt-1 text-xs text-slate-500">Inventory, software and equipment</p>
            </div>

            <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <p class="text-[11px] font-medium tracking-wide text-slate-500 uppercase">
                    Labor
                </p>
                <p class="mt-2 text-3xl font-bold text-slate-900 tabular-nums">
                    ₱{{ laborTotal.toLocaleString() }}
                </p>
                <p class="mt-1 text-xs text-slate-500">Implementation and support services</p>
            </div>
        </div>

        <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div class="flex w-full flex-wrap items-center gap-3">
                    <Select v-model="selectedType" class="w-40">
                        <SelectTrigger class="w-40">
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem v-for="type in budgetTypes" :key="type" :value="type">
                                {{ type }}
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    <div class="relative w-full max-w-xl flex-1">
                        <Search class="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            v-model="search"
                            placeholder="Search item or vendor"
                            class="pl-9"
                        />
                    </div>

                    <div class="flex items-center gap-2">
                        <label class="text-xs font-medium text-slate-500">Date</label>
                        <input
                            v-model="selectedDate"
                            type="date"
                            class="h-10 rounded-md border border-slate-200 bg-white px-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400"
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
                <span class="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 tabular-nums">
                    {{ tableRows.length }} line{{ tableRows.length === 1 ? '' : 's' }}
                </span>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full min-w-[900px] text-sm">
                    <thead>
                        <tr class="border-b text-left text-xs tracking-wide text-slate-500 uppercase">
                            <th class="px-4 py-3 font-medium">No.</th>
                            <th class="px-4 py-3 font-medium">Category</th>
                            <th class="px-4 py-3 font-medium">Type</th>
                            <th class="px-4 py-3 font-medium">Vendor</th>
                            <th class="px-4 py-3 font-medium">Cost center</th>
                            <th class="px-4 py-3 text-right font-medium">Qty</th>
                            <th class="px-4 py-3 text-right font-medium">Amount</th>
                            <th class="px-4 py-3 text-right font-medium">Share</th>
                            <th class="px-4 py-3 font-medium">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="row in tableRows"
                            :key="`${row.category}-${row.date}-${row.vendor}`"
                            class="border-b transition-colors last:border-0 hover:bg-slate-50"
                        >
                            <td class="px-4 py-3 text-slate-500 tabular-nums">{{ row.no }}</td>
                            <td class="px-4 py-3 font-medium text-slate-900">{{ row.category }}</td>
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
                            <td class="px-4 py-3 text-slate-600">{{ row.vendor }}</td>
                            <td class="px-4 py-3 text-slate-600">{{ row.costCenter }}</td>
                            <td class="px-4 py-3 text-right text-slate-600 tabular-nums">{{ row.quantity }}</td>
                            <td class="px-4 py-3 text-right font-medium text-slate-900 tabular-nums">
                                ₱{{ row.amount.toLocaleString() }}
                            </td>
                            <td class="px-4 py-3 text-right text-slate-600 tabular-nums">{{ row.share }}</td>
                            <td class="px-4 py-3 text-slate-600 tabular-nums">{{ row.date }}</td>
                        </tr>
                        <tr v-if="tableRows.length === 0">
                            <td colspan="9" class="px-4 py-10 text-center text-sm text-slate-500">
                                No budget items match the selected filter.
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
        @click.self="showAddSpending = false"
    >
        <div class="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
            <div class="mb-5 flex items-center justify-between">
                <div>
                    <h3 class="text-lg font-bold text-slate-900">Add spending</h3>
                    <p class="text-sm text-slate-500">Capture project purchases and vendor costs</p>
                </div>
                <button
                    type="button"
                    class="inline-flex size-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                    @click="showAddSpending = false"
                    aria-label="Close"
                >
                    <X class="size-4" />
                </button>
            </div>

            <div class="space-y-4">
                <div class="grid gap-4 md:grid-cols-2">
                    <div>
                        <label class="mb-1 block text-xs font-medium text-slate-600">Type</label>
                        <Select v-model="pendingItem.type">
                            <SelectTrigger class="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Materials">Materials</SelectItem>
                                <SelectItem value="Labor">Labor</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div class="md:col-span-2">
                        <label class="mb-1 block text-xs font-medium text-slate-600">Category</label>
                        <Input v-model="pendingItem.category" placeholder="e.g. Software licenses" />
                    </div>
                    <div>
                        <label class="mb-1 block text-xs font-medium text-slate-600">Vendor</label>
                        <Input v-model="pendingItem.vendor" placeholder="Vendor name" />
                    </div>
                    <div>
                        <label class="mb-1 block text-xs font-medium text-slate-600">Cost center</label>
                        <Input v-model="pendingItem.costCenter" placeholder="Procurement" />
                    </div>
                    <div>
                        <label class="mb-1 block text-xs font-medium text-slate-600">Quantity</label>
                        <Input v-model.number="pendingItem.quantity" type="number" min="1" />
                    </div>
                    <div>
                        <label class="mb-1 block text-xs font-medium text-slate-600">Price</label>
                        <Input v-model.number="pendingItem.price" type="number" min="0" step="0.01" />
                    </div>
                </div>

                <div class="flex justify-end">
                    <button
                        type="button"
                        class="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                        @click.stop.prevent="addPendingItem"
                    >
                        <Plus class="size-3.5" />
                        Add item
                    </button>
                </div>

                <div class="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <div class="flex items-center justify-between text-sm text-slate-600">
                        <span>Line total</span>
                        <span class="text-base font-bold text-slate-900 tabular-nums">
                            ₱{{ lineTotal(pendingItem).toLocaleString() }}
                        </span>
                    </div>
                </div>

                <div v-if="draftItems.length > 0" class="rounded-lg border border-slate-200">
                    <div class="flex items-center justify-between border-b px-3 py-2">
                        <span class="text-sm font-semibold text-slate-800">Pending items</span>
                        <span class="text-xs text-slate-500">{{ draftItems.length }} added</span>
                    </div>
                    <div class="divide-y">
                        <div v-for="(item, index) in draftItems" :key="item.id" class="flex items-center justify-between gap-3 px-3 py-2.5">
                            <div>
                                <p class="text-sm font-medium text-slate-800">{{ item.category }}</p>
                                <p class="text-xs text-slate-500 tabular-nums">
                                    {{ item.type }} · {{ item.quantity }} × ₱{{ item.price.toLocaleString() }}
                                </p>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="text-sm font-semibold text-slate-800 tabular-nums">
                                    ₱{{ lineTotal(item).toLocaleString() }}
                                </span>
                                <button type="button" class="inline-flex size-7 items-center justify-center rounded-md text-slate-500 hover:bg-red-50 hover:text-red-600" @click="removeDraftItem(index)">
                                    <Trash2 class="size-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex flex-wrap justify-end gap-2 pt-2">
                    <Button type="button" class="bg-blue-600 hover:bg-blue-700" @click="saveSpending">
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
                { key: 'costCenter', label: 'Cost Center' },
                { key: 'amount', label: 'Amount', numeric: true },
                { key: 'share', label: 'Share' },
                { key: 'date', label: 'Date' },
            ]"
            :rows="tableRows.map((row) => ({
                category: row.category,
                type: row.type,
                vendor: row.vendor,
                costCenter: row.costCenter,
                amount: row.amount,
                share: row.share,
                date: row.date,
            }))"
            :note="`${selectedType} filter • total approved budget ₱${project.budget.toLocaleString()} • ${selectedDate}`"
        />
    </RecordPrintModal>
</template>
