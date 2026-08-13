import {
    CalendarCheck2,
    Clock,
    Gift,
    GraduationCap,
    LayoutDashboard,
    LogOut,
    ShieldAlert,
    TrendingUp,
    UserPlus,
    Users,
    Wallet,
} from '@lucide/vue';
import type { LucideIcon } from '@lucide/vue';

export const moduleIcons: Record<string, LucideIcon> = {
    dashboard: LayoutDashboard,
    employees: Users,
    recruitment: UserPlus,
    attendance: Clock,
    leave: CalendarCheck2,
    payroll: Wallet,
    benefits: Gift,
    performance: TrendingUp,
    training: GraduationCap,
    disciplinary: ShieldAlert,
    offboarding: LogOut,
};
