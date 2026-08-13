<script setup lang="ts">
import { Inbox, Send } from '@lucide/vue';
import type { DemoModuleLinks } from '@/types';

defineProps<{
    links: DemoModuleLinks;
}>();
</script>

<template>
    <div class="rounded-xl border bg-card p-5 shadow-sm">
        <div class="flex items-center gap-2">
            <span
                class="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300"
            >
                <Send class="size-4" />
            </span>
            <h3 class="text-sm font-semibold">How this module connects</h3>
        </div>

        <div class="mt-4 grid gap-4 md:grid-cols-2">
            <div>
                <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Sends data to
                </p>
                <ul class="mt-2 space-y-2">
                    <li
                        v-for="link in links.sends"
                        :key="link.module"
                        class="rounded-lg border bg-muted/40 px-3 py-2"
                    >
                        <p class="text-sm font-medium">{{ link.module }}</p>
                        <p class="text-xs text-muted-foreground">
                            {{ link.note }}
                        </p>
                    </li>
                </ul>
            </div>
            <div>
                <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Receives data from
                </p>
                <ul class="mt-2 space-y-2">
                    <li
                        v-for="link in links.receives"
                        :key="link.module"
                        class="rounded-lg border bg-muted/40 px-3 py-2"
                    >
                        <p class="text-sm font-medium">{{ link.module }}</p>
                        <p class="text-xs text-muted-foreground">
                            {{ link.note }}
                        </p>
                    </li>
                </ul>
            </div>
        </div>

        <p
            class="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground"
        >
            <Inbox class="size-3.5" />
            In this demo, data is pre-filled so you can click through — a real
            HRIS updates these automatically.
        </p>
    </div>
</template>
