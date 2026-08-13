<script setup lang="ts">
import { Printer, X } from '@lucide/vue';
import type { EmployeeFormState } from '@/components/demo/employeeFormState';
import RecordDocument from '@/components/demo/RecordDocument.vue';
import { Button } from '@/components/ui/button';
import type { DemoEmployee } from '@/types';

type Document = {
    employee: DemoEmployee;
    record: EmployeeFormState;
};

withDefaults(
    defineProps<{
        documents?: Document[];
        heading?: string;
        subtitle?: string;
    }>(),
    {
        documents: () => [],
        heading: '',
        subtitle: '',
    },
);

const emit = defineEmits<{
    close: [];
}>();

function printReport(): void {
    window.print();
}
</script>

<template>
    <Teleport to="body">
        <div
            id="report-overlay"
            class="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm"
        >
            <div
                class="sticky top-0 z-10 flex flex-col gap-3 border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between print:hidden"
            >
                <div>
                    <h2 class="text-sm font-bold">
                        {{
                            heading ||
                            `Report preview — ${documents.length} ${
                                documents.length === 1
                                    ? 'employee'
                                    : 'employees'
                            }`
                        }}
                    </h2>
                    <p class="text-xs text-muted-foreground">
                        {{ subtitle || 'Documents are ready to print.' }}
                    </p>
                </div>
                <div class="flex gap-2">
                    <Button variant="outline" @click="emit('close')">
                        <X class="size-4" />
                        Close
                    </Button>
                    <Button
                        class="bg-blue-600 hover:bg-blue-700"
                        @click="printReport"
                    >
                        <Printer class="size-4" />
                        Print
                    </Button>
                </div>
            </div>

            <div id="report-print-area" class="mx-auto max-w-3xl px-4 py-8">
                <slot>
                    <div
                        v-for="(doc, index) in documents"
                        :key="doc.employee.id"
                        class="report-document"
                        :class="
                            index > 0
                                ? 'print:break-before-page'
                                : 'print:break-before-auto'
                        "
                    >
                        <RecordDocument
                            :employee="doc.employee"
                            :record="doc.record"
                        />
                    </div>
                </slot>
            </div>
        </div>
    </Teleport>
</template>

<style>
/* Print only the report documents; hide the rest of the app. */
@media print {
    body * {
        visibility: hidden;
    }

    #report-overlay {
        position: static !important;
        inset: auto !important;
        z-index: auto !important;
        overflow: visible !important;
        background: transparent !important;
        backdrop-filter: none !important;
    }

    #report-print-area,
    #report-print-area * {
        visibility: visible;
    }

    #report-print-area {
        position: static !important;
        width: 100% !important;
        max-width: none !important;
        padding: 0 !important;
        margin: 0 !important;
    }
}
</style>
