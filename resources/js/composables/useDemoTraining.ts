import { computed, ref } from 'vue';
import type {
    DemoTrainingCourse,
    DemoTrainingCourseRow,
    DemoTrainingEnrollment,
    DemoTrainingRow,
} from '@/types';

/*
 * Training engine (Module 8). Every enrollment is enriched with the
 * employee's record and the course details, and each course is enriched with
 * enrollment counts:
 *
 *   status         = Enrolled → In Progress → Completed (session actions)
 *   score          = 1-100 exam score, only when Completed
 *   certificate    = issued certificate number, only when Completed
 *   completion_rate = completed / enrolled per course
 *
 * Session-backed like every other demo store: new enrollments, Start /
 * Complete actions and withdrawals survive navigation in the same tab, gone
 * when the tab closes. No database.
 */

const ADDED_KEY = 'hris-demo-added-enrollments';
const STATUS_KEY = 'hris-demo-enrollment-statuses';
const EXTRAS_KEY = 'hris-demo-enrollment-extras';
const REMOVED_KEY = 'hris-demo-removed-enrollments';
const ADDED_COURSES_KEY = 'hris-demo-added-courses';

export type TrainingEmployee = {
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

export type EnrollmentDraft = {
    course_id: number;
    employee_id: number;
};

export type CourseDraft = {
    title: string;
    category: string;
    provider: string;
    venue: string;
    start: string;
    end: string;
    hours: number;
    cost: number;
    certificate: boolean;
};

export function useDemoTraining(
    employees: TrainingEmployee[],
    courses: DemoTrainingCourse[],
    seeded: DemoTrainingEnrollment[],
) {
    const added = ref<DemoTrainingEnrollment[]>(
        loadStored<DemoTrainingEnrollment[]>(ADDED_KEY, []),
    );
    const statusOverrides = ref<
        Record<number, DemoTrainingEnrollment['status']>
    >(
        loadStored<Record<number, DemoTrainingEnrollment['status']>>(
            STATUS_KEY,
            {},
        ),
    );
    /** Score / completion date / certificate number written by actions. */
    const extras = ref<Record<number, Partial<DemoTrainingEnrollment>>>(
        loadStored(EXTRAS_KEY, {}),
    );
    const removed = ref<number[]>(loadStored<number[]>(REMOVED_KEY, []));

    /** Courses added from the form (session-only, like added enrollments). */
    const addedCourses = ref<DemoTrainingCourse[]>(
        loadStored<DemoTrainingCourse[]>(ADDED_COURSES_KEY, []),
    );

    /** Seeded catalog + session-added courses. */
    const allCourses = computed<DemoTrainingCourse[]>(() => [
        ...courses,
        ...addedCourses.value,
    ]);

    /** Effective status: an action override wins over the seeded value. */
    function statusFor(
        enrollment: DemoTrainingEnrollment,
    ): DemoTrainingEnrollment['status'] {
        return statusOverrides.value[enrollment.id] ?? enrollment.status;
    }

    /** Every enrollment (seeded + session-added), enriched with the records. */
    const rows = ref<DemoTrainingRow[]>([]);

    function rebuild(): void {
        const all: DemoTrainingEnrollment[] = [
            ...seeded.filter((item) => !removed.value.includes(item.id)),
            ...added.value,
        ];
        const out: DemoTrainingRow[] = [];

        for (const enrollment of all) {
            const employee = employees.find(
                (row) => row.id === enrollment.employee_id,
            );
            const course = allCourses.value.find(
                (item) => item.id === enrollment.course_id,
            );

            if (!employee || !course) {
                continue;
            }

            const effective = {
                ...enrollment,
                ...(extras.value[enrollment.id] ?? {}),
                status: statusFor(enrollment),
            };

            out.push({
                ...effective,
                no: employee.no,
                name: employee.name,
                department: employee.department,
                position: employee.position,
                course_code: course.code,
                title: course.title,
                category: course.category,
                venue: course.venue,
                start: course.start,
                end: course.end,
                hours: course.hours,
                certificate: course.certificate,
            });
        }

        rows.value = out;
    }

    rebuild();

    /** Every course, enriched with enrollment counts for the catalog. */
    const courseRows = ref<DemoTrainingCourseRow[]>([]);

    function rebuildCourses(): void {
        const out: DemoTrainingCourseRow[] = [];

        for (const course of allCourses.value) {
            const enrolled = rows.value.filter(
                (row) => row.course_id === course.id,
            );
            const completed = enrolled.filter(
                (row) => row.status === 'Completed',
            );

            out.push({
                ...course,
                enrolled: enrolled.length,
                completed: completed.length,
                completion_rate:
                    enrolled.length === 0
                        ? 0
                        : Math.round(
                              (completed.length / enrolled.length) * 100,
                          ),
                capacity: enrolled.length + 1 + (course.id % 4),
            });
        }

        courseRows.value = out;
    }

    rebuildCourses();

    function nextId(): number {
        const highest = [...seeded, ...added.value].reduce(
            (max, item) => Math.max(max, item.id),
            1000,
        );

        return highest + 1;
    }

    function nextCourseId(): number {
        return (
            allCourses.value.reduce(
                (max, course) => Math.max(max, course.id),
                100,
            ) + 1
        );
    }

    /** Add a new course to the calendar (session-persisted). */
    function addCourse(draft: CourseDraft): DemoTrainingCourse {
        const id = nextCourseId();
        const course: DemoTrainingCourse = {
            id,
            code: `TRN-${100 + id}`,
            title: draft.title,
            category: draft.category,
            provider: draft.provider,
            venue: draft.venue,
            start: draft.start,
            end: draft.end,
            hours: draft.hours,
            cost: draft.cost,
            certificate: draft.certificate,
        };

        addedCourses.value.unshift(course);
        saveStored(ADDED_COURSES_KEY, addedCourses.value);
        rebuildCourses();

        return course;
    }

    /** Enroll an employee in a course — starts as Enrolled. */
    function enroll(draft: EnrollmentDraft): DemoTrainingEnrollment {
        const enrollment: DemoTrainingEnrollment = {
            id: nextId(),
            course_id: draft.course_id,
            employee_id: draft.employee_id,
            status: 'Enrolled',
            score: null,
            completed_on: null,
            certificate_no: null,
        };

        added.value.unshift(enrollment);
        saveStored(ADDED_KEY, added.value);
        rebuild();
        rebuildCourses();

        return enrollment;
    }

    /** Move an Enrolled employee into the course (session-persisted). */
    function start(id: number): void {
        statusOverrides.value[id] = 'In Progress';
        saveStored(STATUS_KEY, statusOverrides.value);
        rebuild();
        rebuildCourses();
    }

    /** Complete a course — locks in the score and issues the certificate. */
    function complete(id: number): void {
        const row = rows.value.find((item) => item.id === id);

        statusOverrides.value[id] = 'Completed';
        saveStored(STATUS_KEY, statusOverrides.value);

        extras.value[id] = {
            score: 75 + ((id * 7) % 21),
            completed_on: row?.end ?? null,
            certificate_no: `CERT-${String(id).padStart(4, '0')}`,
        };
        saveStored(EXTRAS_KEY, extras.value);

        rebuild();
        rebuildCourses();
    }

    /** Withdraw an enrollment (session-persisted). */
    function withdraw(id: number): void {
        if (seeded.some((item) => item.id === id)) {
            removed.value.push(id);
            saveStored(REMOVED_KEY, removed.value);
        } else {
            added.value = added.value.filter((item) => item.id !== id);
            saveStored(ADDED_KEY, added.value);
        }

        rebuild();
        rebuildCourses();
    }

    function formatMoney(value: number, decimals = 0): string {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        }).format(value);
    }

    return {
        rows,
        courseRows,
        addCourse,
        enroll,
        start,
        complete,
        withdraw,
        formatMoney,
    };
}
