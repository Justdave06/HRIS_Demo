<script setup lang="ts">
import { computed } from 'vue';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type Status =
    | 'Present'
    | 'Late'
    | 'On Leave'
    | 'Absent'
    | 'Not Yet In'
    | 'Active'
    | 'Inactive'
    | 'Probationary'
    | 'Applied'
    | 'Screening'
    | 'Interview'
    | 'Offer'
    | 'Hired'
    | 'Approved'
    | 'Pending'
    | 'Paid'
    | 'Open'
    | 'Complete'
    | 'Incomplete'
    | 'Regular'
    | 'Contractual';

const styles: Record<Status, string> = {
    Present:
        'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
    Late: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
    'On Leave':
        'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
    Absent: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300',
    'Not Yet In':
        'bg-slate-100 text-slate-600 dark:bg-slate-500/15 dark:text-slate-300',
    Active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
    Inactive:
        'bg-slate-200 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300',
    Probationary:
        'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
    Applied:
        'bg-slate-100 text-slate-600 dark:bg-slate-500/15 dark:text-slate-300',
    Screening:
        'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300',
    Interview:
        'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
    Offer: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
    Hired: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
    Approved:
        'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
    Pending:
        'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
    Paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
    Open: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
    Complete:
        'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
    Incomplete:
        'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
    Regular:
        'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
    Contractual: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
};

const props = defineProps<{
    status: string;
}>();

const classes = computed(
    () =>
        styles[props.status as Status] ??
        'bg-slate-100 text-slate-600 dark:bg-slate-500/15 dark:text-slate-300',
);
</script>

<template>
    <Badge
        variant="secondary"
        :class="cn('border-transparent font-medium', classes)"
    >
        {{ status }}
    </Badge>
</template>
