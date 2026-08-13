<script setup lang="ts">
import { Head, router, usePage } from '@inertiajs/vue3';
import { ArrowRight, LogIn, Sparkles } from '@lucide/vue';
import { computed } from 'vue';
import { toast } from 'vue-sonner';
import AppLogoIcon from '@/components/AppLogoIcon.vue';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useDemoAccount } from '@/composables/useDemoAccount';
import { useDemoLight } from '@/composables/useDemoLight';
import { useInitials } from '@/composables/useInitials';
import { moduleIcons } from '@/lib/demoModuleIcons';
import type { DemoAccount, DemoModule } from '@/types';

// The demo always renders light so every page shares the same white canvas,
// regardless of the user's appearance preference.
useDemoLight();

const page = usePage();
const accounts = computed(() => (page.props.accounts as DemoAccount[]) ?? []);
const modules = computed(() => (page.props.modules as DemoModule[]) ?? []);
const { account, selectAccount } = useDemoAccount();
const { getInitials } = useInitials();

const moduleOf = (slug: string): DemoModule | undefined =>
    modules.value.find((module) => module.slug === slug);

const moduleNumber = (slug: string): number =>
    modules.value.findIndex((module) => module.slug === slug) + 1;

const moduleHref = (slug: string): string => {
    if (slug === 'employees') {
        // Land on the module's dashboard.
        return '/demo/employees/dashboard';
    }

    if (slug === 'recruitment') {
        return '/demo/recruitment/dashboard';
    }

    if (slug === 'attendance') {
        return '/demo/attendance/dashboard';
    }

    if (slug === 'leave') {
        return '/demo/leave/dashboard';
    }

    if (slug === 'payroll') {
        return '/demo/payroll/dashboard';
    }

    if (slug === 'benefits') {
        return '/demo/benefits/dashboard';
    }

    return `/demo/modules/${slug}`;
};

function loginAs(demoAccount: DemoAccount): void {
    selectAccount(demoAccount);
    toast.success(
        `Signed in as ${demoAccount.name} — Module ${moduleNumber(demoAccount.module)}`,
    );
    router.visit(moduleHref(demoAccount.module));
}

function openModule(module: DemoModule): void {
    if (!account.value) {
        const first = accounts.value[0];

        if (first) {
            selectAccount(first);
            toast(`Signed in as ${first.name} (demo)`);
        }
    }

    router.visit(moduleHref(module.slug));
}
</script>

<template>
    <Head title="Log in — HRIS Demo" />

    <div class="min-h-screen bg-background">
        <div class="mx-auto max-w-6xl px-6 py-10 md:py-14">
            <!-- Brand -->
            <div class="flex flex-col items-center text-center">
                <div
                    class="flex size-14 items-center justify-center rounded-2xl bg-blue-700 text-white shadow-lg"
                >
                    <AppLogoIcon class="size-8 fill-current" />
                </div>
                <h1 class="mt-5 text-3xl font-bold tracking-tight md:text-4xl">
                    HRIS Demo
                </h1>
                <p class="mt-2 max-w-md text-sm text-muted-foreground">
                    Log in by picking who you are — 10 demo accounts, one per
                    module. No email, no password.
                </p>
                <span
                    class="mt-4 inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300"
                >
                    <Sparkles class="size-3.5" />
                    Demo mode · click an account to log in instantly
                </span>
            </div>

            <!-- Accounts with their module -->
            <div class="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <button
                    v-for="demoAccount in accounts"
                    :key="demoAccount.id"
                    type="button"
                    class="group flex flex-col items-start gap-3 rounded-xl border bg-card p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-400/60 hover:shadow-md"
                    :class="
                        demoAccount.id === account?.id &&
                        'border-blue-500 ring-2 ring-blue-500/20'
                    "
                    @click="loginAs(demoAccount)"
                >
                    <div class="flex w-full items-start justify-between gap-2">
                        <span
                            class="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform duration-200 group-hover:scale-110 dark:bg-blue-500/15 dark:text-blue-300"
                        >
                            <component
                                :is="moduleIcons[demoAccount.module]"
                                class="size-5"
                            />
                        </span>
                        <Badge
                            variant="secondary"
                            class="shrink-0"
                            :class="
                                moduleOf(demoAccount.module)?.status ===
                                'available'
                                    ? 'border-transparent bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
                                    : 'border-transparent bg-slate-100 text-slate-500 dark:bg-slate-500/15 dark:text-slate-300'
                            "
                        >
                            {{
                                moduleOf(demoAccount.module)?.status ===
                                'available'
                                    ? 'Live'
                                    : 'Soon'
                            }}
                        </Badge>
                    </div>

                    <div class="min-w-0">
                        <p
                            class="text-[11px] font-semibold tracking-wide text-blue-600 uppercase dark:text-blue-400"
                        >
                            Module {{ moduleNumber(demoAccount.module) }}
                        </p>
                        <p class="mt-0.5 truncate font-semibold">
                            {{ moduleOf(demoAccount.module)?.short }}
                        </p>
                    </div>

                    <div
                        class="mt-auto flex items-center gap-2.5 border-t pt-3"
                    >
                        <Avatar class="size-8 overflow-hidden rounded-lg">
                            <AvatarFallback
                                class="rounded-lg text-[10px] font-bold text-white"
                                :style="{
                                    backgroundColor: demoAccount.color,
                                }"
                            >
                                {{ getInitials(demoAccount.name) }}
                            </AvatarFallback>
                        </Avatar>
                        <div class="min-w-0">
                            <p class="truncate text-sm font-medium">
                                {{ demoAccount.name }}
                            </p>
                            <p class="truncate text-xs text-muted-foreground">
                                {{ demoAccount.role }}
                            </p>
                        </div>
                    </div>

                    <span
                        class="inline-flex items-center gap-1 text-xs font-medium text-blue-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-blue-400"
                    >
                        <LogIn class="size-3" />
                        Log in
                        <ArrowRight class="size-3" />
                    </span>
                </button>
            </div>

            <!-- All modules reference -->
            <section class="mt-12 rounded-xl border bg-muted/40 p-5">
                <h2 class="text-sm font-semibold">All 10 modules</h2>
                <p class="mt-1 text-xs text-muted-foreground">
                    Modules 1–6 are ready to explore. The rest show a preview of
                    what's coming — click any chip to take a look.
                </p>
                <div class="mt-3 flex flex-wrap gap-2">
                    <button
                        v-for="(module, index) in modules"
                        :key="module.slug"
                        type="button"
                        class="inline-flex items-center gap-1.5 rounded-lg border bg-card px-3 py-1.5 text-xs font-medium shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-400/60 hover:shadow-md"
                        @click="openModule(module)"
                    >
                        <component
                            :is="moduleIcons[module.slug]"
                            class="size-3.5 text-muted-foreground"
                        />
                        {{ index + 1 }}. {{ module.short }}
                        <span
                            class="font-semibold"
                            :class="
                                module.status === 'available'
                                    ? 'text-emerald-600 dark:text-emerald-400'
                                    : 'text-slate-400'
                            "
                        >
                            {{
                                module.status === 'available'
                                    ? '· live'
                                    : '· soon'
                            }}
                        </span>
                    </button>
                </div>
            </section>

            <footer
                class="mt-12 border-t pt-6 text-center text-xs text-muted-foreground"
            >
                <p>
                    HRIS Demo — all people and numbers are sample data. Nothing
                    is saved anywhere.
                </p>
                <p class="mt-1">
                    Every account opens its own module. You can switch accounts
                    anytime from the sidebar.
                </p>
            </footer>
        </div>
    </div>
</template>
