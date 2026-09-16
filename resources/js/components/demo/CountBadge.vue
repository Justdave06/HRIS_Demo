<script setup lang="ts">
import { cn } from '@/lib/utils';

const props = withDefaults(
    defineProps<{
        /** The number (or short count text) to show. */
        value: number | string;
        /** Extra classes when a context needs to tweak the look. */
        class?: string;
    }>(),
    { class: '' },
);
</script>

<template>
    <!-- Hidden entirely at zero — a 0 badge is noise. -->
    <span
        v-if="Number(value) !== 0"
        class="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 tabular-nums dark:bg-blue-500/15 dark:text-blue-300"
        :class="cn(props.class)"
    >
        {{ value }}
    </span>
</template>
