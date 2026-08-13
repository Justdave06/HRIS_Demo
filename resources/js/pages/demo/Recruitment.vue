<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import {
    ArrowLeft,
    ArrowRight,
    Briefcase,
    CalendarCheck2,
    CheckCircle2,
    ChevronRight,
    Circle,
    UserCheck,
    Users,
} from '@lucide/vue';
import { computed, ref } from 'vue';
import { toast } from 'vue-sonner';
import StatCard from '@/components/demo/StatCard.vue';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { DemoCandidate, DemoJob, DemoOnboarding } from '@/types';

const props = defineProps<{
    jobs: DemoJob[];
    candidates: DemoCandidate[];
    onboarding: DemoOnboarding[];
    stats: {
        openJobs: number;
        totalApplicants: number;
        candidates: number;
        interviews: number;
        hired: number;
    };
}>();

const stages = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired'] as const;

const candidates = ref<DemoCandidate[]>(
    props.candidates.map((c) => ({ ...c })),
);

const candidatesByStage = computed(() =>
    stages.map((stage) => candidates.value.filter((c) => c.stage === stage)),
);

function move(candidate: DemoCandidate, direction: -1 | 1): void {
    const current = stages.indexOf(candidate.stage as (typeof stages)[number]);
    const next = current + direction;

    if (next < 0) {
        return;
    }

    if (next >= stages.length) {
        toast.success(
            `${candidate.name} is hired! In a real system this creates an Employee record.`,
        );

        return;
    }

    candidate.stage = stages[next];
    toast(`${candidate.name} moved to ${stages[next]}`);
}

const onboarding = ref<DemoOnboarding[]>(
    props.onboarding.map((o) => ({
        ...o,
        tasks: o.tasks.map((t) => ({ ...t })),
    })),
);

function toggleTask(group: DemoOnboarding, taskIndex: number): void {
    const task = group.tasks[taskIndex];

    if (!task) {
        return;
    }

    task.done = !task.done;
    const done = group.tasks.filter((t) => t.done).length;
    group.progress = Math.round((done / group.tasks.length) * 100);
}
</script>

<template>
    <Head title="Recruitment & Onboarding" />

    <div class="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <!-- Header -->
        <h1 class="text-2xl font-bold tracking-tight">
            Recruitment & Onboarding
        </h1>

        <!-- Stats -->
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
                label="Open positions"
                :value="stats.openJobs"
                hint="Jobs we are hiring for"
                :icon="Briefcase"
                tone="navy"
            />
            <StatCard
                label="Candidates in the pipeline"
                :value="stats.candidates"
                hint="People applying right now"
                :icon="Users"
                tone="blue"
            />
            <StatCard
                label="Interviews this week"
                :value="stats.interviews"
                hint="Scheduled to talk to us"
                :icon="CalendarCheck2"
                tone="amber"
            />
            <StatCard
                label="Hired recently"
                :value="stats.hired"
                hint="Ready to become employees"
                :icon="UserCheck"
                tone="green"
            />
        </div>

        <!-- Pipeline -->
        <div class="rounded-xl border bg-card shadow-sm">
            <div class="border-b p-4">
                <h2 class="font-semibold">Applicant tracking</h2>
            </div>
            <div class="grid gap-3 overflow-x-auto p-4 md:grid-cols-5">
                <div
                    v-for="(stage, stageIndex) in stages"
                    :key="stage"
                    class="min-w-[200px] rounded-xl border bg-muted/40 p-3"
                >
                    <div class="flex items-center justify-between">
                        <p
                            class="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
                        >
                            {{ stage }}
                        </p>
                        <Badge variant="secondary">
                            {{ candidatesByStage[stageIndex].length }}
                        </Badge>
                    </div>
                    <div class="mt-3 space-y-2">
                        <div
                            v-for="candidate in candidatesByStage[stageIndex]"
                            :key="candidate.id"
                            class="rounded-lg border bg-card p-3 shadow-sm transition-shadow hover:shadow-md"
                        >
                            <p class="text-sm font-medium">
                                {{ candidate.name }}
                            </p>
                            <p class="mt-0.5 text-xs text-muted-foreground">
                                {{ candidate.job }}
                            </p>
                            <p
                                class="mt-1 text-[11px] text-muted-foreground/70"
                            >
                                Applied {{ candidate.applied_on }}
                            </p>
                            <div
                                class="mt-2 flex items-center justify-between border-t pt-2"
                            >
                                <button
                                    type="button"
                                    class="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
                                    :disabled="stageIndex === 0"
                                    @click="move(candidate, -1)"
                                >
                                    <ArrowLeft class="size-3.5" />
                                    Back
                                </button>
                                <button
                                    type="button"
                                    class="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-500/10"
                                    :class="
                                        candidate.stage === 'Hired' &&
                                        'pointer-events-none opacity-40'
                                    "
                                    @click="move(candidate, 1)"
                                >
                                    {{
                                        candidate.stage === 'Offer'
                                            ? 'Hire!'
                                            : 'Next'
                                    }}
                                    <ArrowRight class="size-3.5" />
                                </button>
                            </div>
                        </div>
                        <p
                            v-if="candidatesByStage[stageIndex].length === 0"
                            class="py-4 text-center text-xs text-muted-foreground"
                        >
                            No candidates here yet
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div class="grid gap-6 lg:grid-cols-5">
            <!-- Open positions -->
            <div class="rounded-xl border bg-card p-5 shadow-sm lg:col-span-2">
                <h2 class="font-semibold">Job postings</h2>
                <div class="mt-4 space-y-3">
                    <div
                        v-for="job in jobs"
                        :key="job.id"
                        class="rounded-lg border bg-muted/40 px-4 py-3"
                    >
                        <div class="flex items-center justify-between gap-2">
                            <p class="text-sm font-medium">{{ job.title }}</p>
                            <Badge variant="secondary">Open</Badge>
                        </div>
                        <p class="mt-1 text-xs text-muted-foreground">
                            {{ job.department }}
                        </p>
                        <div
                            class="mt-2 flex gap-4 text-xs text-muted-foreground"
                        >
                            <span>{{ job.openings }} opening(s)</span>
                            <span>{{ job.applicants }} applicants</span>
                            <span>Posted {{ job.posted }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Onboarding -->
            <div class="rounded-xl border bg-card p-5 shadow-sm lg:col-span-3">
                <h2 class="font-semibold">Onboarding checklists</h2>
                <div class="mt-4 space-y-4">
                    <div
                        v-for="group in onboarding"
                        :key="group.employee_id"
                        class="rounded-lg border p-4"
                    >
                        <div
                            class="flex flex-wrap items-center justify-between gap-2"
                        >
                            <div>
                                <p class="text-sm font-medium">
                                    {{ group.name }}
                                    <span class="text-muted-foreground">
                                        · {{ group.position }}
                                    </span>
                                </p>
                                <p class="text-xs text-muted-foreground">
                                    Started {{ group.start_date }}
                                </p>
                            </div>
                            <Badge
                                variant="secondary"
                                class="border-transparent bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300"
                            >
                                {{ group.progress }}% done
                            </Badge>
                        </div>
                        <div
                            class="mt-3 h-2 overflow-hidden rounded-full bg-muted"
                        >
                            <div
                                class="h-full rounded-full bg-blue-600 transition-all duration-300"
                                :style="{ width: `${group.progress}%` }"
                            ></div>
                        </div>
                        <ul class="mt-3 space-y-1.5">
                            <li
                                v-for="(task, taskIndex) in group.tasks"
                                :key="task.label"
                            >
                                <button
                                    type="button"
                                    class="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm transition-colors hover:bg-muted"
                                    @click="toggleTask(group, taskIndex)"
                                >
                                    <CheckCircle2
                                        v-if="task.done"
                                        class="size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                                    />
                                    <Circle
                                        v-else
                                        class="size-4 shrink-0 text-muted-foreground/60"
                                    />
                                    <span
                                        :class="
                                            cn(
                                                task.done &&
                                                    'text-muted-foreground line-through',
                                            )
                                        "
                                    >
                                        {{ task.label }}
                                    </span>
                                    <ChevronRight
                                        class="ml-auto size-3.5 text-muted-foreground/50"
                                    />
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
