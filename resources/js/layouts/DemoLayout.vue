<script setup lang="ts">
import { Link, router, usePage } from '@inertiajs/vue3';
import {
    ChevronsUpDown,
    Clock,
    FileText,
    LayoutDashboard,
    LogIn,
    LogOut,
    Sparkles,
    UserPlus,
    Users,
} from '@lucide/vue';
import type { LucideIcon } from '@lucide/vue';
import { computed } from 'vue';
import { toast } from 'vue-sonner';
import AppLogoIcon from '@/components/AppLogoIcon.vue';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarRail,
    SidebarSeparator,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';
import { useCurrentUrl } from '@/composables/useCurrentUrl';
import { useDemoAccount } from '@/composables/useDemoAccount';
import { useDemoLight } from '@/composables/useDemoLight';
import { useInitials } from '@/composables/useInitials';
import { cn } from '@/lib/utils';
import { hub } from '@/routes/demo';
import modules from '@/routes/demo/modules';
import type { DemoAccount } from '@/types';

// The demo always renders light so every module page shares the same white
// canvas, regardless of the user's appearance preference.
useDemoLight();

const page = usePage();
const demoAccounts = computed(
    () => (page.props.demoAccounts as DemoAccount[]) ?? [],
);
const { account, selectAccount, clearAccount } = useDemoAccount();
const { getInitials } = useInitials();
const { currentUrl, isCurrentUrl, isCurrentOrParentUrl } = useCurrentUrl();

/*
 * Each module gets its own sidebar — no other module appears in it.
 * The active module is derived from the current URL.
 */
const soonModules = [
    'leave',
    'payroll',
    'benefits',
    'performance',
    'training',
    'disciplinary',
    'offboarding',
];

type ModuleNavItem = {
    slug: string;
    title: string;
    href: string;
    icon: LucideIcon;
};

const moduleNav: Record<string, ModuleNavItem[]> = {
    employees: [
        {
            slug: 'dashboard',
            title: 'Dashboard',
            href: '/demo/employees/dashboard',
            icon: LayoutDashboard,
        },
        {
            slug: 'management',
            title: 'Employee Management',
            href: '/demo/employees',
            icon: Users,
        },
        {
            slug: 'reports',
            title: 'Reports',
            href: '/demo/employees/reports',
            icon: FileText,
        },
    ],
    recruitment: [
        {
            slug: 'overview',
            title: 'Overview',
            href: '/demo/recruitment',
            icon: UserPlus,
        },
    ],
    attendance: [
        {
            slug: 'overview',
            title: 'Overview',
            href: '/demo/attendance',
            icon: Clock,
        },
    ],
};

const currentModule = computed<string | null>(() => {
    const path = currentUrl.value;

    if (path.startsWith('/demo/employees')) {
        return 'employees';
    }

    if (path.startsWith('/demo/recruitment')) {
        return 'recruitment';
    }

    if (path.startsWith('/demo/attendance')) {
        return 'attendance';
    }

    const match = path.match(/^\/demo\/modules\/([a-z]+)/);

    return match ? match[1] : null;
});

const navItems = computed<ModuleNavItem[]>(() => {
    const slug = currentModule.value;

    if (!slug) {
        return [];
    }

    if (moduleNav[slug]) {
        return moduleNav[slug];
    }

    // Coming-soon modules only show a preview entry.
    if (soonModules.includes(slug)) {
        return [
            {
                slug: 'preview',
                title: 'Preview',
                href: modules.show(slug).url,
                icon: Sparkles,
            },
        ];
    }

    return [];
});

function isItemActive(item: ModuleNavItem): boolean {
    // On the Employee module, Dashboard / Reports are exact matches while
    // Employee Management covers the list, profile and add pages.
    if (currentModule.value === 'employees') {
        if (item.slug === 'dashboard' || item.slug === 'reports') {
            return isCurrentUrl(item.href);
        }

        if (item.slug === 'management') {
            return (
                currentUrl.value.startsWith('/demo/employees') &&
                !currentUrl.value.startsWith('/demo/employees/dashboard') &&
                !currentUrl.value.startsWith('/demo/employees/reports')
            );
        }
    }

    return isCurrentOrParentUrl(item.href);
}

function switchAccount(selected: DemoAccount): void {
    selectAccount(selected);
    toast.success(`Signed in as ${selected.name} (demo)`);
}

function exitDemo(): void {
    clearAccount();
    toast('Demo account cleared');
    router.visit(hub());
}
</script>

<template>
    <SidebarProvider>
        <Sidebar collapsible="icon" variant="inset" class="print:hidden">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" as-child>
                            <Link :href="hub()">
                                <div
                                    class="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground"
                                >
                                    <AppLogoIcon
                                        class="size-5 fill-current text-white"
                                    />
                                </div>
                                <div class="ml-1 grid flex-1 text-left text-sm">
                                    <span
                                        class="mb-0.5 truncate leading-tight font-semibold"
                                        >HRIS Demo</span
                                    >
                                    <span
                                        class="truncate text-xs text-sidebar-foreground/60"
                                    >
                                        Human Resources System
                                    </span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup class="px-2 py-0">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                as-child
                                :is-active="isCurrentUrl(hub())"
                                tooltip="Accounts & Log in"
                            >
                                <Link :href="hub()">
                                    <LogIn />
                                    <span>Accounts & Log in</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                    <SidebarSeparator class="mx-2 my-2" />
                    <SidebarMenu>
                        <SidebarMenuItem
                            v-for="item in navItems"
                            :key="item.slug"
                        >
                            <SidebarMenuButton
                                as-child
                                :is-active="isItemActive(item)"
                                :tooltip="item.title"
                            >
                                <Link :href="item.href">
                                    <component :is="item.icon" />
                                    <span>{{ item.title }}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger as-child>
                                <SidebarMenuButton
                                    size="lg"
                                    class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                >
                                    <Avatar
                                        class="size-8 overflow-hidden rounded-lg"
                                    >
                                        <AvatarFallback
                                            class="rounded-lg bg-blue-600 font-semibold text-white"
                                        >
                                            {{ getInitials(account?.name) }}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div
                                        class="grid flex-1 text-left text-sm leading-tight"
                                    >
                                        <span class="truncate font-medium">{{
                                            account?.name ?? 'Pick an account'
                                        }}</span>
                                        <span
                                            class="truncate text-xs text-sidebar-foreground/60"
                                        >
                                            {{
                                                account?.role ??
                                                'No account selected'
                                            }}
                                        </span>
                                    </div>
                                    <ChevronsUpDown class="ml-auto size-4" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                class="w-(--reka-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                                align="end"
                                :side-offset="4"
                            >
                                <DropdownMenuLabel class="p-0 font-normal">
                                    <div
                                        class="flex items-center gap-2 px-1 py-1.5 text-left text-sm"
                                    >
                                        <Users class="size-4" />
                                        Switch demo account
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup
                                    class="max-h-64 overflow-y-auto"
                                >
                                    <DropdownMenuItem
                                        v-for="demoAccount in demoAccounts"
                                        :key="demoAccount.id"
                                        :class="
                                            cn(
                                                'cursor-pointer',
                                                demoAccount.id ===
                                                    account?.id && 'bg-accent',
                                            )
                                        "
                                        @select="switchAccount(demoAccount)"
                                    >
                                        <Avatar
                                            class="size-6 overflow-hidden rounded-md"
                                        >
                                            <AvatarFallback
                                                class="rounded-md text-[10px] font-semibold text-white"
                                                :style="{
                                                    backgroundColor:
                                                        demoAccount.color,
                                                }"
                                            >
                                                {{
                                                    getInitials(
                                                        demoAccount.name,
                                                    )
                                                }}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div class="grid flex-1 leading-tight">
                                            <span class="text-sm font-medium">
                                                {{ demoAccount.name }}
                                            </span>
                                            <span
                                                class="text-xs text-muted-foreground"
                                            >
                                                {{ demoAccount.role }}
                                            </span>
                                        </div>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    class="cursor-pointer"
                                    @select="exitDemo"
                                >
                                    <LogOut class="size-4" />
                                    Exit demo
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>

        <SidebarInset class="overflow-x-hidden">
            <header
                class="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/70 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4 print:hidden"
            >
                <div class="flex w-full items-center gap-2">
                    <SidebarTrigger class="-ml-1" />
                    <div class="ml-auto flex items-center gap-3">
                        <span
                            class="hidden items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 sm:inline-flex dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300"
                        >
                            <Sparkles class="size-3.5" />
                            Demo mode · no login needed
                        </span>
                        <Link
                            v-if="account"
                            :href="hub()"
                            class="hidden items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs font-medium text-blue-700 shadow-sm transition-colors hover:bg-blue-50 md:inline-flex dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300 dark:hover:bg-blue-500/20"
                        >
                            <LogIn class="size-3.5" />
                            Switch account
                        </Link>
                    </div>
                </div>
            </header>

            <main class="flex flex-1 flex-col gap-4 p-4 md:p-6">
                <slot />
            </main>

            <footer
                class="border-t border-sidebar-border/70 px-6 py-4 text-center text-xs text-muted-foreground print:hidden"
            >
                HRIS Demo — everything here is sample data. Nothing is saved.
            </footer>
        </SidebarInset>
        <Toaster />
    </SidebarProvider>
</template>
