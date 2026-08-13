<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3';
import { KeyRound, Mail } from '@lucide/vue';
import { ref } from 'vue';
import { toast } from 'vue-sonner';
import EmployeeForm from '@/components/demo/EmployeeForm.vue';
import type { EmployeeFormState } from '@/components/demo/employeeFormState';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDemoEmployees } from '@/composables/useDemoEmployees';
import { useDemoPortal } from '@/composables/useDemoPortal';

defineProps<{
    departments: string[];
}>();

const { addEmployee } = useDemoEmployees();
const { setCredentials } = useDemoPortal();

// Hiring details — HR creates the employee's portal login (email + temporary
// password) and sets their starting salary + leave balance here, which is
// what Payroll, Leave and the Employee Portal read.
const portalEmail = ref('');
const portalPassword = ref('');
const salary = ref<number>(0);
const leaveBalance = ref<number>(0);

function onSave(state: EmployeeFormState): void {
    if (!portalEmail.value.trim()) {
        toast.error("Create the employee's portal email first");

        return;
    }

    if (!portalPassword.value.trim()) {
        toast.error("Create the employee's temporary password first");

        return;
    }

    if (portalPassword.value.trim().length < 6) {
        toast.error('Temporary password must be at least 6 characters');

        return;
    }

    const employee = addEmployee(state, {
        email: portalEmail.value.trim(),
        salary: Number(salary.value) || 0,
        leave_balance: Number(leaveBalance.value) || 0,
    });
    setCredentials(
        employee.id,
        portalEmail.value.trim(),
        portalPassword.value.trim(),
    );

    toast.success(
        `${employee.name} — added to the directory with portal login and compensation set (demo)`,
    );
    router.visit('/demo/employees');
}
</script>

<template>
    <Head title="Add Employee — Employee Information Management" />

    <div class="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <EmployeeForm
            heading="Add Employee"
            save-label="Save employee"
            back-label="Back to Employee Management"
            back-href="/demo/employees"
            :departments="departments"
            :extra-tab="{ label: 'Hiring details', icon: KeyRound }"
            @save="onSave"
        >
            <template #extra>
                <div
                    class="rounded-xl border border-blue-200 bg-blue-50/60 p-6"
                >
                    <div class="flex items-center gap-2">
                        <KeyRound class="size-4 text-blue-700" />
                        <h2 class="font-semibold text-slate-900">
                            Hiring details
                        </h2>
                    </div>
                    <p class="mt-0.5 text-xs text-slate-600">
                        Create the employee's portal login (email + temporary
                        password) and set their starting monthly salary and
                        leave balance — Payroll, Leave and the Employee Portal
                        read these.
                    </p>
                    <div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div class="flex flex-col gap-1.5">
                            <Label for="portal-email">Portal email</Label>
                            <div class="relative">
                                <Mail
                                    class="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                                />
                                <Input
                                    id="portal-email"
                                    v-model="portalEmail"
                                    type="email"
                                    placeholder="employee@company.com"
                                    class="pl-9"
                                />
                            </div>
                        </div>
                        <div class="flex flex-col gap-1.5">
                            <Label for="portal-password"
                                >Temporary password</Label
                            >
                            <div class="relative">
                                <KeyRound
                                    class="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                                />
                                <Input
                                    id="portal-password"
                                    v-model="portalPassword"
                                    type="text"
                                    placeholder="e.g. Firstname2026!"
                                    class="pl-9"
                                />
                            </div>
                        </div>
                        <div class="flex flex-col gap-1.5">
                            <Label for="salary">Monthly salary (₱)</Label>
                            <Input
                                id="salary"
                                v-model.number="salary"
                                type="number"
                                min="0"
                                placeholder="e.g. 25000"
                            />
                        </div>
                        <div class="flex flex-col gap-1.5">
                            <Label for="leave-balance"
                                >Leave balance (days)</Label
                            >
                            <Input
                                id="leave-balance"
                                v-model.number="leaveBalance"
                                type="number"
                                min="0"
                                placeholder="e.g. 15"
                            />
                        </div>
                    </div>
                </div>
            </template>
        </EmployeeForm>
    </div>
</template>
