<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3';
import { toast } from 'vue-sonner';
import EmployeeForm from '@/components/demo/EmployeeForm.vue';
import type { EmployeeFormState } from '@/components/demo/employeeFormState';
import { useDemoEmployees } from '@/composables/useDemoEmployees';

defineProps<{
    departments: string[];
}>();

const { addEmployee } = useDemoEmployees();

function onSave(state: EmployeeFormState): void {
    const employee = addEmployee(state);

    toast.success(`${employee.name} — added to the directory (demo)`);
    router.visit('/demo/employees');
}
</script>

<template>
    <Head title="Add Employee — Employee Information Management" />

    <EmployeeForm
        heading="Add Employee"
        save-label="Save employee"
        back-label="Back to Employee Management"
        back-href="/demo/employees"
        :departments="departments"
        @save="onSave"
    />
</template>
