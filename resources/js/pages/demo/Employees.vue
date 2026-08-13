<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3';
import { ArrowRight, Plus, Search } from '@lucide/vue';
import { computed, ref } from 'vue';
import StatusBadge from '@/components/demo/StatusBadge.vue';

const statusOptions = ['Regular', 'Probationary', 'Contractual'] as const;

type StatusOption = (typeof statusOptions)[number];
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useDemoEmployees } from '@/composables/useDemoEmployees';
import { useInitials } from '@/composables/useInitials';
import type { DemoEmployee } from '@/types';

type EmployeeRow = DemoEmployee & { today: string };

const props = defineProps<{
    employees: EmployeeRow[];
    departments: string[];
}>();

const { getInitials } = useInitials();

// Demo employees added from the Add Employee form (in-memory only).
const { addedEmployees } = useDemoEmployees();

const allEmployees = computed(() => [
    ...props.employees,
    ...addedEmployees.value,
]);

function openProfile(employee: DemoEmployee): void {
    // Added demo employees have no server record — their profile lives in
    // this session and is hydrated from sessionStorage on the view page.
    if (employee.id >= 1001) {
        router.visit(`/demo/employees/session/${employee.id}`);

        return;
    }

    router.visit(`/demo/employees/${employee.id}`);
}

const search = ref('');
const department = ref('all');

// Employment status pre-fill comes from the ?status= query param, so the
// dashboard stat cards can deep-link straight into a filtered directory.
function initialStatus(): string {
    if (typeof window === 'undefined') {
        return 'all';
    }

    const param = new URLSearchParams(window.location.search).get('status');

    return statusOptions.includes(param as StatusOption)
        ? (param ?? 'all')
        : 'all';
}

const status = ref(initialStatus());

const filtered = computed(() => {
    const term = search.value.trim().toLowerCase();

    return allEmployees.value.filter((employee) => {
        const matchesDepartment =
            department.value === 'all' ||
            employee.department === department.value;
        const matchesStatus =
            status.value === 'all' || employee.employment_type === status.value;
        const matchesSearch =
            term === '' ||
            employee.name.toLowerCase().includes(term) ||
            employee.no.toLowerCase().includes(term) ||
            employee.position.toLowerCase().includes(term);

        return matchesDepartment && matchesStatus && matchesSearch;
    });
});
</script>

<template>
    <Head title="Employee Information Management" />

    <div class="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <!-- Header -->
        <div
            class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
            <h1 class="text-2xl font-bold tracking-tight">
                Employee Management
            </h1>
            <Button
                class="shrink-0 bg-blue-600 hover:bg-blue-700"
                @click="router.visit('/demo/employees/create')"
            >
                <Plus class="size-4" />
                Add employee
            </Button>
        </div>

        <!-- List -->
        <div class="rounded-xl border bg-card shadow-sm">
            <div
                class="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between"
            >
                <div class="flex items-center gap-3">
                    <h2 class="font-semibold">Employment records</h2>
                    <span
                        class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                    >
                        {{ filtered.length }}
                    </span>
                </div>
                <div
                    class="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center"
                >
                    <div class="relative w-full sm:max-w-xs">
                        <Search
                            class="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                        />
                        <Input
                            v-model="search"
                            placeholder="Search name, ID or position…"
                            class="pl-9"
                        />
                    </div>
                    <Select v-model="status">
                        <SelectTrigger class="w-full sm:w-44">
                            <SelectValue placeholder="All statuses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All statuses</SelectItem>
                            <SelectItem
                                v-for="option in statusOptions"
                                :key="option"
                                :value="option"
                            >
                                {{ option }}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <Select v-model="department">
                        <SelectTrigger class="w-full sm:w-52">
                            <SelectValue placeholder="All departments" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                All departments
                            </SelectItem>
                            <SelectItem
                                v-for="dept in departments"
                                :key="dept"
                                :value="dept"
                            >
                                {{ dept }}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full min-w-[720px] text-sm">
                    <thead>
                        <tr
                            class="border-b text-left text-xs tracking-wide text-muted-foreground uppercase"
                        >
                            <th class="px-4 py-3 font-medium">Employee</th>
                            <th class="px-4 py-3 font-medium">Department</th>
                            <th class="px-4 py-3 font-medium">Position</th>
                            <th class="px-4 py-3 font-medium">Status</th>
                            <th
                                class="hidden px-4 py-3 font-medium lg:table-cell"
                            >
                                Contact
                            </th>
                            <th class="px-4 py-3 text-right font-medium">
                                Profile
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="employee in filtered"
                            :key="employee.id"
                            class="group border-b transition-colors last:border-0 hover:bg-muted/50"
                        >
                            <td class="px-4 py-3">
                                <div class="flex items-center gap-3">
                                    <Avatar
                                        class="size-9 overflow-hidden rounded-lg"
                                    >
                                        <AvatarFallback
                                            class="rounded-lg bg-blue-600 font-semibold text-white"
                                        >
                                            {{ getInitials(employee.name) }}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div class="min-w-0">
                                        <p class="truncate font-medium">
                                            {{ employee.name }}
                                        </p>
                                        <p
                                            class="text-xs text-muted-foreground"
                                        >
                                            {{ employee.no }}
                                        </p>
                                    </div>
                                </div>
                            </td>
                            <td class="px-4 py-3 text-muted-foreground">
                                {{ employee.department }}
                            </td>
                            <td class="px-4 py-3 text-muted-foreground">
                                {{ employee.position }}
                            </td>
                            <td class="px-4 py-3">
                                <StatusBadge
                                    :status="employee.employment_type"
                                />
                            </td>
                            <td
                                class="hidden px-4 py-3 text-muted-foreground lg:table-cell"
                            >
                                {{ employee.email }}
                            </td>
                            <td class="px-4 py-3 text-right">
                                <button
                                    type="button"
                                    class="inline-flex items-center gap-1 text-xs font-medium text-blue-600 transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                    @click="openProfile(employee)"
                                >
                                    View
                                    <ArrowRight
                                        class="size-3.5 transition-transform group-hover:translate-x-0.5"
                                    />
                                </button>
                            </td>
                        </tr>
                        <tr v-if="filtered.length === 0">
                            <td
                                colspan="6"
                                class="px-4 py-10 text-center text-sm text-muted-foreground"
                            >
                                No employees match your search.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
