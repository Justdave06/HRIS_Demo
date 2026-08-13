<script setup lang="ts">
import { ChevronLeft, ChevronRight } from '@lucide/vue';
import { computed } from 'vue';
import { Button } from '@/components/ui/button';

const props = withDefaults(
    defineProps<{
        /** Total number of rows across all pages. */
        total: number;
        /** Current page (1-based). */
        page: number;
        pageSize?: number;
    }>(),
    { pageSize: 10 },
);

const emit = defineEmits<{
    'update:page': [page: number];
}>();

const pageCount = computed(() =>
    Math.max(1, Math.ceil(props.total / props.pageSize)),
);

const start = computed(() =>
    props.total === 0 ? 0 : (props.page - 1) * props.pageSize + 1,
);

const end = computed(() => Math.min(props.total, props.page * props.pageSize));

type PageItem = number | '…';

/** Compact page-number list: first, last, and a window around the current page. */
const pages = computed<PageItem[]>(() => {
    const count = pageCount.value;
    const current = props.page;

    if (count <= 7) {
        return Array.from({ length: count }, (_, index) => index + 1);
    }

    const items: PageItem[] = [1];

    if (current > 3) {
        items.push('…');
    }

    for (
        let page = Math.max(2, current - 1);
        page <= Math.min(count - 1, current + 1);
        page += 1
    ) {
        items.push(page);
    }

    if (current < count - 2) {
        items.push('…');
    }

    items.push(count);

    return items;
});
</script>

<template>
    <div
        v-if="pageCount > 1"
        class="flex flex-wrap items-center justify-between gap-3 border-t px-5 py-3"
    >
        <p class="text-xs text-muted-foreground">
            Showing
            <span class="font-medium text-foreground tabular-nums">
                {{ start }}
            </span>
            –
            <span class="font-medium text-foreground tabular-nums">
                {{ end }}
            </span>
            of
            <span class="font-medium text-foreground tabular-nums">
                {{ total }}
            </span>
        </p>

        <div class="flex items-center gap-1">
            <Button
                variant="outline"
                size="icon-sm"
                aria-label="Previous page"
                :disabled="page <= 1"
                @click="emit('update:page', page - 1)"
            >
                <ChevronLeft class="size-4" />
            </Button>

            <template v-for="(item, index) in pages" :key="index">
                <span
                    v-if="item === '…'"
                    class="px-1 text-xs text-muted-foreground"
                >
                    …
                </span>
                <Button
                    v-else
                    size="icon-sm"
                    :variant="item === page ? 'default' : 'outline'"
                    :aria-label="`Page ${item}`"
                    @click="emit('update:page', item)"
                >
                    {{ item }}
                </Button>
            </template>

            <Button
                variant="outline"
                size="icon-sm"
                aria-label="Next page"
                :disabled="page >= pageCount"
                @click="emit('update:page', page + 1)"
            >
                <ChevronRight class="size-4" />
            </Button>
        </div>
    </div>
</template>
