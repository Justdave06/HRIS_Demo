<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { Printer } from '@lucide/vue';
import { computed, ref } from 'vue';
import { toast } from 'vue-sonner';
import EmployeeForm from '@/components/demo/EmployeeForm.vue';
import type { EmployeeFormState } from '@/components/demo/employeeFormState';
import RecordPrintModal from '@/components/demo/RecordPrintModal.vue';
import { Button } from '@/components/ui/button';
import { useDemoEmployees } from '@/composables/useDemoEmployees';
import type { DemoEmployee } from '@/types';

type Training = {
    title: string;
    date: string;
    provider: string;
};

const props = defineProps<{
    employee: DemoEmployee;
    departments: string[];
    trainings: Training[];
    record: EmployeeFormState | null;
}>();

const { addedEmployees, blankForm, employeeFor, formFor } =
    useDemoEmployees();
const showPreview = ref(false);

// TEMP DIAGNOSTIC — remove after debugging
console.log('[detail] employee id:', props.employee.id);
console.log('[detail] addedEmployees:', addedEmployees.value);
console.log('[detail] formFor:', formFor(props.employee.id) ?? 'MISSING');

// For session-added employees the server sends a placeholder row; use the
// real directory row kept in sessionStorage so the name and details match.
const displayEmployee = computed<DemoEmployee>(
    () => employeeFor(props.employee.id) ?? props.employee,
);

// The 201 file pre-filled with the employee's records on file. Seeded
// employees get it from the server; session-added employees (no server
// record) hydrate it from sessionStorage, falling back to a blank 201.
// JSON round-trip instead of structuredClone: Inertia props are reactive
// proxies, which structuredClone cannot clone.
const record = computed<EmployeeFormState>(() => {
    if (props.record) {
        return JSON.parse(JSON.stringify(props.record));
    }

    return formFor(props.employee.id) ?? blankForm();
});

const initial = computed<EmployeeFormState>(() =>
    JSON.parse(JSON.stringify(record.value)),
);

function onSave(): void {
    toast.success(`${displayEmployee.value.name} — changes saved (demo)`);
}
</script>

<template>
    <Head :title="`${displayEmployee.name} — Employee Records`" />

    <EmployeeForm
        :heading="displayEmployee.name"
        :description="`${displayEmployee.no} · ${displayEmployee.department}`"
        save-label="Save changes"
        back-label="Back to all employees"
        back-href="/demo/employees"
        :departments="departments"
        :initial="initial"
        @save="onSave"
    >
        <template #actions>
            <Button
                class="bg-blue-600 hover:bg-blue-700"
                @click="showPreview = true"
            >
                <Printer class="size-4" />
                Generate report
            </Button>
        </template>
    </EmployeeForm>

    <RecordPrintModal
        v-if="showPreview"
        :documents="[{ employee: displayEmployee, record }]"
        @close="showPreview = false"
    />
</template>
