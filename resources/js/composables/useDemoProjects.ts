import { computed, ref } from 'vue';
import type {
    DemoProject,
    DemoProjectDraft,
    DemoProjectRow,
    DemoProjectStatus,
} from '@/types';

/*
 * Project Management engine (Module 11). Every project in the registry is
 * enriched with employee names (the lead + team pulled from Employee Records)
 * and a computed milestone progress:
 *
 *   status   = Planning → Active → On Hold → Completed | Cancelled (session actions)
 *   overdue  = end date passed while still Planning / Active / On Hold
 *
 * Session-backed like every other demo store: new projects, status changes,
 * milestone toggles and withdrawals survive navigation in the same tab, gone
 * when the tab closes. No database.
 */

const ADDED_KEY = 'hris-demo-added-projects';
const STATUS_KEY = 'hris-demo-project-statuses';
const MILESTONE_KEY = 'hris-demo-project-milestones';
const UPDATE_KEY = 'hris-demo-project-updates';
const REMOVED_KEY = 'hris-demo-removed-projects';

export const PROJECT_STATUSES: DemoProjectStatus[] = [
    'Planning',
    'Active',
    'On Hold',
    'Completed',
    'Cancelled',
];

export type ProjectEmployee = {
    id: number;
    no: string;
    name: string;
    department: string;
    position: string;
};

function loadStored<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') {
        return fallback;
    }

    try {
        const raw = window.sessionStorage.getItem(key);

        return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
        return fallback;
    }
}

function saveStored(key: string, value: unknown): void {
    if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(key, JSON.stringify(value));
    }
}

function isSameOrAfter(date: string, limit: string): boolean {
    return date >= limit;
}

export function useDemoProjects(
    employees: ProjectEmployee[],
    seeded: DemoProject[],
) {
    const added = ref<DemoProject[]>(
        loadStored<DemoProject[]>(ADDED_KEY, []),
    );
    const statusOverrides = ref<Record<number, DemoProjectStatus>>(
        loadStored<Record<number, DemoProjectStatus>>(STATUS_KEY, {}),
    );
    const milestoneOverrides = ref<
        Record<number, DemoProject['milestones']>
    >(
        loadStored<Record<number, DemoProject['milestones']>>(
            MILESTONE_KEY,
            {},
        ),
    );
    const updates = ref<Record<number, Partial<DemoProject>>>(
        loadStored<Record<number, Partial<DemoProject>>>(UPDATE_KEY, {}),
    );
    const removed = ref<number[]>(loadStored<number[]>(REMOVED_KEY, []));

    /** Effective status: an action override wins over the seeded value. */
    function statusFor(project: DemoProject): DemoProjectStatus {
        return statusOverrides.value[project.id] ?? project.status;
    }

    /** Effective milestones: a toggle override wins over the seeded list. */
    function milestonesFor(project: DemoProject): DemoProject['milestones'] {
        return milestoneOverrides.value[project.id] ?? project.milestones;
    }

    /** Every project (seeded + session-added), enriched with names + progress. */
    const rows = ref<DemoProjectRow[]>([]);

    function rebuild(): void {
        const all: DemoProject[] = [
            ...seeded.filter((item) => !removed.value.includes(item.id)),
            ...added.value,
        ];
        const out: DemoProjectRow[] = [];
        const today = new Date().toISOString().slice(0, 10);

        for (const project of all) {
            const lead = employees.find(
                (employee) => employee.id === project.lead_id,
            );
            const team = employees.filter((employee) =>
                project.team_ids.includes(employee.id),
            );

            const effective = {
                ...project,
                ...(updates.value[project.id] ?? {}),
                status: statusFor(project),
            };
            const milestones = milestonesFor(project);
            const done = milestones.filter((item) => item.completed).length;
            const status = effective.status;

            out.push({
                ...effective,
                milestones,
                lead_name: lead?.name ?? 'Unassigned',
                team_names: team.map((employee) => employee.name),
                team_count: team.length,
                progress:
                    milestones.length === 0
                        ? 0
                        : Math.round((done / milestones.length) * 100),
                overdue:
                    (status === 'Planning' ||
                        status === 'Active' ||
                        status === 'On Hold') &&
                    isSameOrAfter(today, effective.end_date),
            });
        }

        rows.value = out;
    }

    rebuild();

    /** Next project id: above every seeded and session-added id. */
    function nextId(): number {
        const highest = [...seeded, ...added.value].reduce(
            (max, item) => Math.max(max, item.id),
            1000,
        );

        return highest + 1;
    }

    /** Register a new project — defaults to Planning. */
    function addProject(draft: DemoProjectDraft): DemoProject {
        const project: DemoProject = {
            id: nextId(),
            name: draft.name,
            description: draft.description,
            start_date: draft.start_date,
            end_date: draft.end_date,
            status: draft.status,
            department: draft.department,
            lead_id: draft.lead_id,
            team_ids: draft.team_ids,
            milestones: [],
            budget: draft.budget,
        };

        added.value.unshift(project);
        saveStored(ADDED_KEY, added.value);
        rebuild();

        return project;
    }

    /** Edit a project's details (session-persisted). */
    function updateProject(
        id: number,
        patch: Partial<Omit<DemoProjectDraft, 'lead_id' | 'team_ids'>>,
    ): void {
        updates.value[id] = { ...patch };
        saveStored(UPDATE_KEY, updates.value);
        rebuild();
    }

    /** Change a project's status (session-persisted). */
    function setStatus(id: number, status: DemoProjectStatus): void {
        statusOverrides.value[id] = status;
        saveStored(STATUS_KEY, statusOverrides.value);
        rebuild();
    }

    /** Toggle one milestone's completion (session-persisted). */
    function toggleMilestone(id: number, index: number): void {
        const project = [...seeded, ...added.value].find(
            (item) => item.id === id,
        );

        if (!project) {
            return;
        }

        const milestones = milestonesFor(project).map(
            (milestone, milestoneIndex) =>
                milestoneIndex === index
                    ? { ...milestone, completed: !milestone.completed }
                    : { ...milestone },
        );

        milestoneOverrides.value[id] = milestones;
        saveStored(MILESTONE_KEY, milestoneOverrides.value);
        rebuild();
    }

    /** Withdraw a project from the registry (session-persisted). */
    function remove(id: number): void {
        if (seeded.some((item) => item.id === id)) {
            removed.value.push(id);
            saveStored(REMOVED_KEY, removed.value);
        } else {
            added.value = added.value.filter((item) => item.id !== id);
            saveStored(ADDED_KEY, added.value);
        }

        rebuild();
    }

    return {
        rows,
        addProject,
        updateProject,
        setStatus,
        toggleMilestone,
        remove,
    };
}