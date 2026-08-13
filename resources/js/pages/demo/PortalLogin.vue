<script setup lang="ts">
import { Head, Link, router } from '@inertiajs/vue3';
import { ArrowLeft, KeyRound, LogIn, Mail, Sparkles } from '@lucide/vue';
import { onMounted, ref } from 'vue';
import { toast } from 'vue-sonner';
import AppLogoIcon from '@/components/AppLogoIcon.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDemoLight } from '@/composables/useDemoLight';
import {
    DEMO_PORTAL_PASSWORD,
    useDemoPortal,
} from '@/composables/useDemoPortal';

const props = defineProps<{
    employees: { id: number; no: string; name: string; email: string }[];
}>();

// The portal always renders light so it shares the same white canvas.
useDemoLight();

const { ensureSeeded, authenticate, login, sessionId } = useDemoPortal();

// Sample employees can log in out of the box with the demo password.
ensureSeeded(props.employees);

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

onMounted(() => {
    if (sessionId.value !== null) {
        router.visit('/demo/portal/dashboard', { replace: true });
    }
});

function submit(): void {
    if (!email.value.trim() || !password.value) {
        error.value = 'Enter your email and password to continue.';

        return;
    }

    loading.value = true;
    const employeeId = authenticate(email.value, password.value);
    loading.value = false;

    if (employeeId === null) {
        error.value =
            'No account matches that email and password. Try again — sample employees use the demo password below, employees added by HR use the credentials HR created.';

        return;
    }

    login(employeeId);
    toast.success('Welcome to the employee portal (demo)');
    router.visit('/demo/portal/dashboard');
}
</script>

<template>
    <Head title="Employee Portal — HRIS Demo" />

    <div class="flex min-h-screen flex-col bg-background">
        <div class="flex flex-1 items-center justify-center px-4 py-10">
            <div class="w-full max-w-md">
                <!-- Brand -->
                <div class="flex flex-col items-center text-center">
                    <div
                        class="flex size-14 items-center justify-center rounded-2xl bg-blue-700 text-white shadow-lg"
                    >
                        <AppLogoIcon class="size-8 fill-current" />
                    </div>
                    <h1 class="mt-5 text-2xl font-bold tracking-tight">
                        Employee Portal
                    </h1>
                    <p class="mt-1 text-sm text-muted-foreground">
                        Sign in with the email and temporary password HR created
                        when you were hired.
                    </p>
                </div>

                <!-- Login card -->
                <div class="mt-8 rounded-2xl border bg-card p-6 shadow-sm">
                    <form class="space-y-4" @submit.prevent="submit">
                        <div class="flex flex-col gap-1.5">
                            <Label for="portal-email">Email</Label>
                            <div class="relative">
                                <Mail
                                    class="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                                />
                                <Input
                                    id="portal-email"
                                    v-model="email"
                                    type="email"
                                    placeholder="you@company.com"
                                    class="pl-9"
                                    autocomplete="username"
                                />
                            </div>
                        </div>

                        <div class="flex flex-col gap-1.5">
                            <Label for="portal-password">
                                Temporary password
                            </Label>
                            <div class="relative">
                                <KeyRound
                                    class="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                                />
                                <Input
                                    id="portal-password"
                                    v-model="password"
                                    type="password"
                                    placeholder="••••••••"
                                    class="pl-9"
                                    autocomplete="current-password"
                                />
                            </div>
                        </div>

                        <p
                            v-if="error"
                            class="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700"
                        >
                            {{ error }}
                        </p>

                        <Button
                            type="submit"
                            class="w-full bg-blue-600 hover:bg-blue-700"
                            :disabled="loading"
                        >
                            <LogIn class="size-4" />
                            {{ loading ? 'Signing in…' : 'Log in to portal' }}
                        </Button>
                    </form>
                </div>

                <!-- Sample credentials hint -->
                <div
                    class="mt-4 rounded-xl border border-blue-200 bg-blue-50/60 p-4 text-xs leading-relaxed text-slate-600"
                >
                    <p
                        class="flex items-center gap-1.5 font-semibold text-slate-900"
                    >
                        <Sparkles class="size-3.5 text-blue-600" />
                        Sample accounts (demo)
                    </p>
                    <p class="mt-1">
                        Every sample employee logs in with their email and the
                        password
                        <span
                            class="rounded bg-white px-1.5 py-0.5 font-mono font-semibold text-blue-700"
                        >
                            {{ DEMO_PORTAL_PASSWORD }}
                        </span>
                    </p>
                    <p class="mt-1">
                        Employees added in Employee Management use the email and
                        temporary password HR created.
                    </p>
                </div>

                <div class="mt-6 text-center">
                    <Link
                        href="/"
                        class="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-blue-600"
                    >
                        <ArrowLeft class="size-3.5" />
                        Back to demo hub
                    </Link>
                </div>
            </div>
        </div>
    </div>
</template>
