<script setup lang="ts">
import { Link, router, usePage } from '@inertiajs/vue3';
import {
    BookOpen,
    CalendarCheck2,
    ChevronsUpDown,
    ClipboardCheck,
    Clock,
    FileText,
    LayoutDashboard,
    LogIn,
    LogOut,
    HeartHandshake,
    Sparkles,
    UserPlus,
    Users,
    Wallet,
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
const soonModules = ['disciplinary', 'offboarding'];

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
            slug: 'dashboard',
            title: 'Dashboard',
            href: '/demo/recruitment/dashboard',
            icon: LayoutDashboard,
        },
        {
            slug: 'vacancies',
            title: 'Vacancy Management',
            href: '/demo/recruitment/vacancies',
            icon: UserPlus,
        },
        {
            slug: 'reports',
            title: 'Reports',
            href: '/demo/recruitment/reports',
            icon: FileText,
        },
    ],
    attendance: [
        {
            slug: 'dashboard',
            title: 'Dashboard',
            href: '/demo/attendance/dashboard',
            icon: LayoutDashboard,
        },
        {
            slug: 'manager',
            title: 'Attendance Manager',
            href: '/demo/attendance/manager',
            icon: Clock,
        },
        {
            slug: 'holidays',
            title: 'Holiday Picker',
            href: '/demo/attendance/holidays',
            icon: CalendarCheck2,
        },
        {
            slug: 'reports',
            title: 'Reports',
            href: '/demo/attendance/reports',
            icon: FileText,
        },
    ],
    leave: [
        {
            slug: 'dashboard',
            title: 'Dashboard',
            href: '/demo/leave/dashboard',
            icon: LayoutDashboard,
        },
        {
            slug: 'requests',
            title: 'Leave Requests',
            href: '/demo/leave/requests',
            icon: CalendarCheck2,
        },
        {
            slug: 'reports',
            title: 'Reports',
            href: '/demo/leave/reports',
            icon: FileText,
        },
    ],
    payroll: [
        {
            slug: 'dashboard',
            title: 'Dashboard',
            href: '/demo/payroll/dashboard',
            icon: LayoutDashboard,
        },
        {
            slug: 'payslips',
            title: 'Payslips',
            href: '/demo/payroll/payslips',
            icon: Wallet,
        },
        {
            slug: 'reports',
            title: 'Reports',
            href: '/demo/payroll/reports',
            icon: FileText,
        },
    ],
    benefits: [
        {
            slug: 'dashboard',
            title: 'Dashboard',
            href: '/demo/benefits/dashboard',
            icon: LayoutDashboard,
        },
        {
            slug: 'plans',
            title: 'Benefit Plans',
            href: '/demo/benefits/plans',
            icon: HeartHandshake,
        },
        {
            slug: 'reports',
            title: 'Reports',
            href: '/demo/benefits/reports',
            icon: FileText,
        },
    ],
    performance: [
        {
            slug: 'dashboard',
            title: 'Dashboard',
            href: '/demo/performance/dashboard',
            icon: LayoutDashboard,
        },
        {
            slug: 'reviews',
            title: 'Goals & Reviews',
            href: '/demo/performance/reviews',
            icon: ClipboardCheck,
        },
        {
            slug: 'reports',
            title: 'Reports',
            href: '/demo/performance/reports',
            icon: FileText,
        },
    ],
    training: [
        {
            slug: 'dashboard',
            title: 'Dashboard',
            href: '/demo/training/dashboard',
            icon: LayoutDashboard,
        },
        {
            slug: 'enrollments',
            title: 'Courses & Enrollment',
            href: '/demo/training/enrollments',
            icon: BookOpen,
        },
        {
            slug: 'reports',
            title: 'Reports',
            href: '/demo/training/reports',
            icon: FileText,
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

    if (path.startsWith('/demo/leave')) {
        return 'leave';
    }

    if (path.startsWith('/demo/payroll')) {
        return 'payroll';
    }

    if (path.startsWith('/demo/benefits')) {
        return 'benefits';
    }

    if (path.startsWith('/demo/performance')) {
        return 'performance';
    }

    if (path.startsWith('/demo/training')) {
        return 'training';
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
    // Dashboard / Reports are exact matches while the management list covers
    // the list, profile and add pages of the module.
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

    if (currentModule.value === 'recruitment') {
        if (item.slug === 'dashboard' || item.slug === 'reports') {
            // The legacy /demo/recruitment URL also counts as the dashboard.
            return (
                isCurrentUrl(item.href) ||
                (item.slug === 'dashboard' && isCurrentUrl('/demo/recruitment'))
            );
        }

        if (item.slug === 'vacancies') {
            return (
                currentUrl.value.startsWith('/demo/recruitment') &&
                !currentUrl.value.startsWith('/demo/recruitment/dashboard') &&
                !currentUrl.value.startsWith('/demo/recruitment/reports')
            );
        }
    }

    if (currentModule.value === 'attendance') {
        if (
            item.slug === 'dashboard' ||
            item.slug === 'holidays' ||
            item.slug === 'reports'
        ) {
            // The legacy /demo/attendance URL also counts as the dashboard.
            return (
                isCurrentUrl(item.href) ||
                (item.slug === 'dashboard' && isCurrentUrl('/demo/attendance'))
            );
        }

        if (item.slug === 'manager') {
            return (
                currentUrl.value.startsWith('/demo/attendance') &&
                !currentUrl.value.startsWith('/demo/attendance/dashboard') &&
                !currentUrl.value.startsWith('/demo/attendance/holidays') &&
                !currentUrl.value.startsWith('/demo/attendance/reports')
            );
        }
    }

    if (currentModule.value === 'leave') {
        if (item.slug === 'dashboard' || item.slug === 'reports') {
            // The legacy /demo/leave URL also counts as the dashboard.
            return (
                isCurrentUrl(item.href) ||
                (item.slug === 'dashboard' && isCurrentUrl('/demo/leave'))
            );
        }

        if (item.slug === 'requests') {
            return (
                currentUrl.value.startsWith('/demo/leave') &&
                !currentUrl.value.startsWith('/demo/leave/dashboard') &&
                !currentUrl.value.startsWith('/demo/leave/reports')
            );
        }
    }

    if (currentModule.value === 'payroll') {
        if (item.slug === 'dashboard' || item.slug === 'reports') {
            // The legacy /demo/payroll URL also counts as the dashboard.
            return (
                isCurrentUrl(item.href) ||
                (item.slug === 'dashboard' && isCurrentUrl('/demo/payroll'))
            );
        }

        if (item.slug === 'payslips') {
            return (
                currentUrl.value.startsWith('/demo/payroll') &&
                !currentUrl.value.startsWith('/demo/payroll/dashboard') &&
                !currentUrl.value.startsWith('/demo/payroll/reports')
            );
        }
    }

    if (currentModule.value === 'benefits') {
        if (item.slug === 'dashboard' || item.slug === 'reports') {
            // The legacy /demo/benefits URL also counts as the dashboard.
            return (
                isCurrentUrl(item.href) ||
                (item.slug === 'dashboard' && isCurrentUrl('/demo/benefits'))
            );
        }

        if (item.slug === 'plans') {
            return (
                currentUrl.value.startsWith('/demo/benefits') &&
                !currentUrl.value.startsWith('/demo/benefits/dashboard') &&
                !currentUrl.value.startsWith('/demo/benefits/reports')
            );
        }
    }

    if (currentModule.value === 'performance') {
        if (item.slug === 'dashboard' || item.slug === 'reports') {
            // The legacy /demo/performance URL also counts as the dashboard.
            return (
                isCurrentUrl(item.href) ||
                (item.slug === 'dashboard' && isCurrentUrl('/demo/performance'))
            );
        }

        if (item.slug === 'reviews') {
            return (
                currentUrl.value.startsWith('/demo/performance') &&
                !currentUrl.value.startsWith('/demo/performance/dashboard') &&
                !currentUrl.value.startsWith('/demo/performance/reports')
            );
        }
    }

    if (currentModule.value === 'training') {
        if (item.slug === 'dashboard' || item.slug === 'reports') {
            // The legacy /demo/training URL also counts as the dashboard.
            return (
                isCurrentUrl(item.href) ||
                (item.slug === 'dashboard' && isCurrentUrl('/demo/training'))
            );
        }

        if (item.slug === 'enrollments') {
            return (
                currentUrl.value.startsWith('/demo/training') &&
                !currentUrl.value.startsWith('/demo/training/dashboard') &&
                !currentUrl.value.startsWith('/demo/training/reports')
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
