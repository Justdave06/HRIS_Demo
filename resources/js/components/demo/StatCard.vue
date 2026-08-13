<script setup lang="ts">
import type { LucideIcon } from '@lucide/vue';
import { cn } from '@/lib/utils';

type Tone = 'navy' | 'blue' | 'green' | 'amber' | 'red';

const toneClasses: Record<Tone, string> = {
    navy: 'bg-primary/10 text-primary dark:bg-blue-500/15 dark:text-blue-300',
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300',
    green:
        'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300',
    red: 'bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-300',
};

type Props = {
    label: string;
    value: string | number;
    hint?: string;
    icon: LucideIcon;
    tone?: Tone;
};

withDefaults(defineProps<Props>(), {
    tone: 'navy',
});
</script>

<template>
    <div
        class="group rounded-xl border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-ring/40 hover:shadow-md"
    >
        <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
                <p class="truncate text-sm font-medium text-muted-foreground">
                    {{ label }}
                </p>
                <p
                    class="mt-2 text-3xl font-bold tracking-tight text-foreground"
                >
                    {{ value }}
                </p>
                <p
                    v-if="hint"
                    class="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground"
                >
                    {{ hint }}
                </p>
            </div>
            <div
                class="shrink-0 rounded-lg p-2.5 transition-transform duration-200 group-hover:scale-110"
                :class="cn(toneClasses[tone])"
            >
                <component :is="icon" class="size-5" />
            </div>
        </div>
    </div>
</template>
