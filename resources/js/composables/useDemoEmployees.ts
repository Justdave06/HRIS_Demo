import { ref } from 'vue';
import type { EmployeeFormState } from '@/components/demo/employeeFormState';
import { defaultState } from '@/components/demo/employeeFormState';
import type { DemoEmployee } from '@/types';

/*
 * Demo employees added from the Add Employee form.
 *
 * Backed by sessionStorage so a Save survives navigating back to the
 * directory (even across a full page load), but nothing persists beyond
 * the browser tab: closing the tab, exiting Chrome, or opening a new tab
 * discards every added record. No database, no localStorage.
 */
const STORAGE_KEY = 'hris-demo-added-employees';
const FORMS_KEY = 'hris-demo-added-forms';

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

const addedEmployees = ref<DemoEmployee[]>(
    loadStored<DemoEmployee[]>(STORAGE_KEY, []),
);

// Full 201-file form state per added employee id, kept alongside the
// directory rows so the View page can pre-fill every tab.
const addedForms = ref<Record<number, EmployeeFormState>>(
    loadStored<Record<number, EmployeeFormState>>(FORMS_KEY, {}),
);

function todayIso(): string {
    return new Date().toISOString().slice(0, 10);
}

function fullName(state: EmployeeFormState): string {
    return (
        [
            state.personal.firstName,
            state.personal.middleName,
            state.personal.lastName,
        ]
            .filter(Boolean)
            .join(' ') || 'New employee'
    );
}

function employmentType(
    state: EmployeeFormState,
): DemoEmployee['employment_type'] {
    const type = state.personal.employmentType;

    if (type === 'Probationary' || type === 'Contractual') {
        return type;
    }

    return 'Regular';
}

export function useDemoEmployees() {
    function nextId(): number {
        // Highest id already in the store (seeded 1-30, added ones 1001+).
        const highest = addedEmployees.value.reduce(
            (max, employee) => Math.max(max, employee.id),
            1000,
        );

        return highest + 1;
    }

    function addEmployee(state: EmployeeFormState): DemoEmployee {
        const id = nextId();

        const employee: DemoEmployee = {
            id,
            no: `EMP-${String(id).padStart(4, '0')}`,
            name: fullName(state),
            department: state.personal.department.trim() || 'Human Resources',
            position: state.personal.position.trim() || 'Staff',
            status: 'Active',
            employment_type: employmentType(state),
            file_status: 'Incomplete',
            email: state.personal.email,
            phone: state.personal.phone,
            hire_date: state.personal.dateHired || todayIso(),
            birth_date: state.personal.birthDate,
            gender: state.personal.gender,
            address: state.personal.address,
            emergency: {
                name: state.personal.emergencyName,
                relation: state.personal.emergencyRelation,
                phone: state.personal.emergencyPhone,
            },
            manager: '',
            salary: 0,
            leave_balance: 0,
            trainings: 0,
        };

        addedEmployees.value.push(employee);
        addedForms.value[id] = state;
        saveStored(STORAGE_KEY, addedEmployees.value);
        saveStored(FORMS_KEY, addedForms.value);

        return employee;
    }

    /** Full 201-file form state for a session-added employee, if any. */
    function formFor(id: number): EmployeeFormState | undefined {
        return addedForms.value[id];
    }

    /** Directory row for a session-added employee, if any. */
    function employeeFor(id: number): DemoEmployee | undefined {
        return addedEmployees.value.find((employee) => employee.id === id);
    }

    /** Blank 201-file shape (same defaults as the add form). */
    function blankForm(): EmployeeFormState {
        return defaultState();
    }

    return { addedEmployees, addEmployee, formFor, employeeFor, blankForm };
}
