<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import {
    CalendarCheck2,
    Clock,
    LogIn,
    LogOut,
    Search,
    Timer,
    UserX,
    Users,
    Wallet,
} from '@lucide/vue';
import { computed, ref, watch } from 'vue';
import { toast } from 'vue-sonner';
import StatCard from '@/components/demo/StatCard.vue';
import StatusBadge from '@/components/demo/StatusBadge.vue';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDemoAccount } from '@/composables/useDemoAccount';
import { useInitials } from '@/composables/useInitials';
import { hub } from '@/routes/demo';

type RosterRow = {
    employee_id: number;
    name: string;
    department: string;
    position: string;
    time_in: string | null;
    time_out: string | null;
    status: string;
};

type WeeklyRow = {
    employee_id: number;
    name: string;
    department: string;
    hours: number | null;
    status: string;
};

const props = defineProps<{
    attendance: RosterRow[];
    weeklyHours: WeeklyRow[];
    stats: {
        atWork: number;
        late: number;
        onLeave: number;
        notIn: number;
    };
}>();

const { account } = useDemoAccount();
const { getInitials } = useInitials();

const search = ref('');
const roster = computed(() => {
    const term = search.value.trim().toLowerCase();

    return props.attendance.filter(
        (row) =>
            term === '' ||
            row.name.toLowerCase().includes(term) ||
            row.department.toLowerCase().includes(term),
    );
});

// Clock in/out demo (persisted in localStorage per account).
const CLOCK_PREFIX = 'hris-demo-clock-';
const clock = ref<{ timeIn: string | null; timeOut: string | null }>({
    timeIn: null,
    timeOut: null,
});

// Reload the clock whenever the signed-in account changes.
watch(
    () => account.value?.id,
    (id) => {
        clock.value = { timeIn: null, timeOut: null };

        if (!id) {
            return;
        }

        try {
            const saved = localStorage.getItem(CLOCK_PREFIX + id);

            if (saved) {
                clock.value = JSON.parse(saved);
            }
        } catch {
            clock.value = { timeIn: null, timeOut: null };
        }
    },
    { immediate: true },
);

function nowTime(): string {
    return new Date().toLocaleTimeString('en-PH', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
}

function clockIn(): void {
    if (!account.value) {
        toast.error('Pick a demo account first');

        return;
    }

    clock.value = { timeIn: nowTime(), timeOut: null };
    localStorage.setItem(
        CLOCK_PREFIX + account.value.id,
        JSON.stringify(clock.value),
    );
    toast.success(
        `Clocked in as ${account.value.name} at ${clock.value.timeIn}`,
    );
}

function clockOut(): void {
    if (!account.value || !clock.value.timeIn) {
        return;
    }

    clock.value.timeOut = nowTime();
    localStorage.setItem(
        CLOCK_PREFIX + account.value.id,
        JSON.stringify(clock.value),
    );
    toast.success(`Clocked out at ${clock.value.timeOut} — nice day's work!`);
}

const isMine = (employeeId: number): boolean =>
    account.value?.id === employeeId;
</script>

<template>
    <Head title="Time & Attendance" />

    <div class="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <!-- Header -->
        <h1 class="text-2xl font-bold tracking-tight">Time & Attendance</h1>

        <!-- Stats -->
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
                label="At work today"
                :value="stats.atWork"
                hint="Clocked in and present"
                :icon="Users"
                tone="green"
            />
            <StatCard
                label="Late today"
                :value="stats.late"
                hint="Arrived after 8:30 AM"
                :icon="Timer"
                tone="amber"
            />
            <StatCard
                label="On leave today"
                :value="stats.onLeave"
                hint="Approved by Leave Management"
                :icon="CalendarCheck2"
                tone="blue"
            />
            <StatCard
                label="Not in yet"
                :value="stats.notIn"
                hint="Absent or still expected"
                :icon="UserX"
                tone="red"
            />
        </div>

        <div class="grid gap-6 lg:grid-cols-3">
            <!-- Roster -->
            <div class="rounded-xl border bg-card shadow-sm lg:col-span-2">
                <div
                    class="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                    <h2 class="font-semibold">Today's DTR</h2>
                    <div class="relative w-full sm:max-w-xs">
                        <Search
                            class="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                        />
                        <Input
                            v-model="search"
                            placeholder="Search name or department…"
                            class="pl-9"
                        />
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full min-w-[640px] text-sm">
                        <thead>
                            <tr
                                class="border-b text-left text-xs tracking-wide text-muted-foreground uppercase"
                            >
                                <th class="px-4 py-3 font-medium">Employee</th>
                                <th class="px-4 py-3 font-medium">
                                    Department
                                </th>
                                <th class="px-4 py-3 font-medium">In</th>
                                <th class="px-4 py-3 font-medium">Out</th>
                                <th class="px-4 py-3 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="row in roster"
                                :key="row.employee_id"
                                class="border-b transition-colors last:border-0"
                                :class="
                                    isMine(row.employee_id)
                                        ? 'bg-blue-50/70 dark:bg-blue-500/10'
                                        : 'hover:bg-muted/50'
                                "
                            >
                                <td class="px-4 py-3">
                                    <div class="flex items-center gap-3">
                                        <Avatar
                                            class="size-8 overflow-hidden rounded-lg"
                                        >
                                            <AvatarFallback
                                                class="rounded-lg bg-blue-600 text-[10px] font-semibold text-white"
                                            >
                                                {{ getInitials(row.name) }}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p class="font-medium">
                                                {{ row.name }}
                                            </p>
                                            <p
                                                class="text-xs text-muted-foreground"
                                            >
                                                {{ row.position }}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-4 py-3 text-muted-foreground">
                                    {{ row.department }}
                                </td>
                                <td class="px-4 py-3">
                                    {{ row.time_in ?? '—' }}
                                </td>
                                <td class="px-4 py-3">
                                    {{ row.time_out ?? '—' }}
                                </td>
                                <td class="px-4 py-3">
                                    <StatusBadge :status="row.status" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Right column -->
            <div class="flex flex-col gap-6">
                <!-- Clock card -->
                <div class="rounded-xl border bg-card p-5 shadow-sm">
                    <div class="flex items-center gap-2">
                        <Clock
                            class="size-4 text-blue-600 dark:text-blue-400"
                        />
                        <h2 class="font-semibold">Biometric clock — try it</h2>
                    </div>

                    <template v-if="account">
                        <div
                            class="mt-4 flex items-center gap-3 rounded-xl border bg-muted/40 p-3"
                        >
                            <Avatar class="size-10 overflow-hidden rounded-xl">
                                <AvatarFallback
                                    class="rounded-xl bg-blue-600 text-xs font-bold text-white"
                                >
                                    {{ getInitials(account.name) }}
                                </AvatarFallback>
                            </Avatar>
                            <div class="min-w-0">
                                <p class="truncate text-sm font-semibold">
                                    {{ account.name }}
                                </p>
                                <p
                                    class="truncate text-xs text-muted-foreground"
                                >
                                    {{ account.role }}
                                </p>
                            </div>
                        </div>

                        <div class="mt-4 grid grid-cols-2 gap-3 text-center">
                            <div class="rounded-lg border bg-muted/40 py-3">
                                <p
                                    class="text-[11px] tracking-wide text-muted-foreground uppercase"
                                >
                                    Time in
                                </p>
                                <p class="mt-1 font-bold">
                                    {{ clock.timeIn ?? '—' }}
                                </p>
                            </div>
                            <div class="rounded-lg border bg-muted/40 py-3">
                                <p
                                    class="text-[11px] tracking-wide text-muted-foreground uppercase"
                                >
                                    Time out
                                </p>
                                <p class="mt-1 font-bold">
                                    {{ clock.timeOut ?? '—' }}
                                </p>
                            </div>
                        </div>

                        <div class="mt-4 flex gap-2">
                            <Button
                                class="flex-1"
                                :disabled="!!clock.timeIn && !clock.timeOut"
                                @click="clockIn"
                            >
                                <LogIn class="size-4" />
                                Clock in
                            </Button>
                            <Button
                                variant="outline"
                                class="flex-1"
                                :disabled="!clock.timeIn || !!clock.timeOut"
                                @click="clockOut"
                            >
                                <LogOut class="size-4" />
                                Clock out
                            </Button>
                        </div>
                    </template>

                    <div v-else class="mt-4">
                        <p class="text-sm text-muted-foreground">
                            Pick a demo account first so we know who is clocking
                            in.
                        </p>
                        <Button class="mt-3" as-child>
                            <Link :href="hub()">Pick an account</Link>
                        </Button>
                    </div>
                </div>

                <!-- Weekly hours -->
                <div class="rounded-xl border bg-card p-5 shadow-sm">
                    <div class="flex items-center gap-2">
                        <Wallet
                            class="size-4 text-emerald-600 dark:text-emerald-400"
                        />
                        <h2 class="font-semibold">Hours this week</h2>
                    </div>
                    <ul class="mt-3 max-h-72 space-y-1 overflow-y-auto pr-1">
                        <li
                            v-for="row in weeklyHours"
                            :key="row.employee_id"
                            class="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm hover:bg-muted/50"
                        >
                            <span class="truncate font-medium">
                                {{ row.name }}
                            </span>
                            <span
                                class="ml-3 shrink-0 text-muted-foreground tabular-nums"
                            >
                                <template v-if="row.hours !== null">
                                    {{ row.hours }} hrs
                                </template>
                                <span v-else class="italic">
                                    {{
                                        row.status === 'On Leave'
                                            ? 'on leave'
                                            : 'away'
                                    }}
                                </span>
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
