<script setup lang="ts">
import { Pencil, Plus, Trash2 } from '@lucide/vue';
import { Button } from '@/components/ui/button';

type Column = {
    key: string;
    label: string;
};

withDefaults(
    defineProps<{
        title: string;
        subtitle?: string;
        columns: Column[];
        rows: Record<string, string>[];
        addLabel?: string;
        emptyText?: string;
    }>(),
    {
        addLabel: 'Add record',
        emptyText: 'No records yet — add the first one.',
    },
);

const emit = defineEmits<{
    add: [];
    edit: [index: number];
    remove: [index: number];
}>();
</script>

<template>
    <div class="rounded-xl border bg-card shadow-sm">
        <div
            class="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4"
        >
            <div>
                <h3 class="font-semibold">{{ title }}</h3>
                <p v-if="subtitle" class="mt-0.5 text-xs text-muted-foreground">
                    {{ subtitle }}
                </p>
            </div>
            <div class="flex items-center gap-3">
                <span
                    class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                >
                    {{ rows.length }}
                </span>
                <Button size="sm" @click="emit('add')">
                    <Plus class="size-4" />
                    {{ addLabel }}
                </Button>
            </div>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full min-w-[560px] text-sm">
                <thead>
                    <tr
                        class="border-b text-left text-xs tracking-wide text-muted-foreground uppercase"
                    >
                        <th
                            v-for="column in columns"
                            :key="column.key"
                            class="px-4 py-3 font-medium"
                        >
                            {{ column.label }}
                        </th>
                        <th class="px-4 py-3 text-right font-medium">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(row, index) in rows"
                        :key="index"
                        class="border-b transition-colors last:border-0 hover:bg-muted/40"
                    >
                        <td
                            v-for="column in columns"
                            :key="column.key"
                            class="px-4 py-3 text-muted-foreground"
                        >
                            {{ row[column.key] || '—' }}
                        </td>
                        <td class="px-4 py-3">
                            <div class="flex items-center justify-end gap-1">
                                <button
                                    type="button"
                                    class="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-500/10"
                                    @click="emit('edit', index)"
                                >
                                    <Pencil class="size-3.5" />
                                    Update
                                </button>
                                <button
                                    type="button"
                                    class="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                                    @click="emit('remove', index)"
                                >
                                    <Trash2 class="size-3.5" />
                                    Delete
                                </button>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="rows.length === 0">
                        <td
                            :colspan="columns.length + 1"
                            class="px-4 py-10 text-center text-sm text-muted-foreground"
                        >
                            {{ emptyText }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
