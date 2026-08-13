<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { ArrowLeft, CheckCircle2, Sparkles } from '@lucide/vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { moduleIcons } from '@/lib/demoModuleIcons';
import { hub } from '@/routes/demo';
import type { DemoModule } from '@/types';

type ModuleWithFeatures = DemoModule & { features: string[] };

defineProps<{
    module: ModuleWithFeatures;
}>();
</script>

<template>
    <Head :title="`${module.name} — Coming soon`" />

    <div class="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <Button variant="ghost" size="sm" class="-ml-2 w-fit" as-child>
            <Link :href="hub()">
                <ArrowLeft class="size-4" />
                Back to accounts
            </Link>
        </Button>

        <div
            class="flex flex-col gap-5 rounded-xl border bg-card p-8 shadow-sm sm:flex-row sm:items-center"
        >
            <span
                class="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:bg-blue-500/15 dark:text-blue-300"
            >
                <component :is="moduleIcons[module.slug]" class="size-8" />
            </span>
            <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-2">
                    <h1 class="text-2xl font-bold tracking-tight">
                        {{ module.name }}
                    </h1>
                    <Badge
                        variant="secondary"
                        class="border-transparent bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
                    >
                        <Sparkles class="mr-1 size-3" />
                        Coming soon
                    </Badge>
                </div>
                <p
                    class="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground"
                >
                    {{ module.description }}
                </p>
            </div>
        </div>

        <div class="grid gap-6 md:grid-cols-2">
            <div class="rounded-xl border bg-card p-6 shadow-sm">
                <h2 class="font-semibold">What it will include</h2>
                <ul class="mt-4 space-y-3">
                    <li
                        v-for="feature in module.features"
                        :key="feature"
                        class="flex items-start gap-2.5 text-sm"
                    >
                        <CheckCircle2
                            class="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                        />
                        {{ feature }}
                    </li>
                </ul>
            </div>

            <div
                class="rounded-xl border border-blue-200 bg-blue-50 p-5 text-sm text-blue-900 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-100"
            >
                <p class="font-semibold">Want this module next?</p>
                <p class="mt-1">
                    Module 1–3 are live. Tell us which of the remaining modules
                    to build first.
                </p>
            </div>
        </div>
    </div>
</template>
