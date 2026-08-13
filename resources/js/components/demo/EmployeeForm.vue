<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import {
    ArrowLeft,
    Award,
    BookOpen,
    Briefcase,
    Camera,
    Eraser,
    FileText,
    GraduationCap,
    Save,
    ShieldCheck,
    User,
    UserCheck,
    Users,
} from '@lucide/vue';
import { computed, reactive, ref, watch } from 'vue';
import { onMounted } from 'vue';
import { toast } from 'vue-sonner';
import RecordFormModal from '@/components/demo/RecordFormModal.vue';
import RecordTable from '@/components/demo/RecordTable.vue';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useInitials } from '@/composables/useInitials';
import { cn } from '@/lib/utils';
import { defaultState, mergeState } from './employeeFormState';
import type { EmployeeFormState } from './employeeFormState';

/* ------------------------------------------------------------------ */
/* Props                                                               */
/* ------------------------------------------------------------------ */

const props = withDefaults(
    defineProps<{
        heading: string;
        description?: string;
        saveLabel?: string;
        backLabel?: string;
        backHref?: string;
        departments: string[];
        /** Pre-filled state (edit mode). Leave empty for a blank 201 file. */
        initial?: EmployeeFormState;
        /** localStorage key to auto-save drafts, or null to disable. */
        persistKey?: string | null;
    }>(),
    {
        description: '',
        saveLabel: 'Save',
        backLabel: '',
        backHref: '',
        initial: undefined,
        persistKey: null,
    },
);

const emit = defineEmits<{
    save: [state: EmployeeFormState];
}>();

const { getInitials } = useInitials();

/*
 * Deep-clone without structuredClone: Inertia props and Vue reactive state
 * are proxies, which structuredClone cannot clone (throws DataCloneError).
 */
function deepClone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value)) as T;
}

/* ------------------------------------------------------------------ */
/* State (draft persisted to localStorage when a persistKey is given)  */
/* ------------------------------------------------------------------ */

function loadInitial(): EmployeeFormState {
    const fallback = props.initial ? deepClone(props.initial) : defaultState();

    if (!props.persistKey || typeof window === 'undefined') {
        return fallback;
    }

    try {
        const raw = localStorage.getItem(props.persistKey);

        if (!raw) {
            return fallback;
        }

        return mergeState(
            fallback,
            JSON.parse(raw) as Partial<EmployeeFormState>,
        );
    } catch {
        return fallback;
    }
}

const state = reactive<EmployeeFormState>(loadInitial());

watch(
    state,
    (value) => {
        if (props.persistKey) {
            localStorage.setItem(props.persistKey, JSON.stringify(value));
        }
    },
    { deep: true },
);

function clearForm(): void {
    Object.assign(
        state,
        props.initial ? deepClone(props.initial) : defaultState(),
    );
    openForm.value = null;

    if (props.persistKey) {
        localStorage.removeItem(props.persistKey);
    }

    toast.success('Form cleared');
}

function saveForm(): void {
    if (!state.personal.firstName.trim() && !state.personal.lastName.trim()) {
        toast.error('Add at least a first or last name before saving');

        return;
    }

    emit('save', deepClone(state));
}

/* ------------------------------------------------------------------ */
/* Tabs (sticky and wrapping — never scrollable)                       */
/* ------------------------------------------------------------------ */

const tabs = [
    { key: 'personal', label: 'Personal data', icon: User },
    { key: 'dependents', label: 'Dependents', icon: Users },
    { key: 'education', label: 'Education', icon: GraduationCap },
    { key: 'employment', label: 'Employment', icon: Briefcase },
    { key: 'characterRefs', label: 'References', icon: UserCheck },
    { key: 'trainings', label: 'Training', icon: BookOpen },
    { key: 'gov', label: 'Gov. record', icon: ShieldCheck },
    { key: 'licenses', label: 'Licenses', icon: Award },
] as const;

type TabKey = (typeof tabs)[number]['key'];

type RecordTabKey = Exclude<TabKey, 'personal' | 'gov'>;

const activeTab = ref<TabKey>('personal');

/* ------------------------------------------------------------------ */
/* Record tables: draft form + add / edit / delete                     */
/* ------------------------------------------------------------------ */

const draftDefaults: Record<RecordTabKey, Record<string, string>> = {
    dependents: { id: '', fullName: '', birthDate: '' },
    education: {
        level: '',
        school: '',
        yearGraduated: '',
        degree: '',
        skills: '',
    },
    employment: { company: '', position: '', from: '', to: '' },
    characterRefs: { company: '', position: '', from: '', to: '' },
    trainings: {
        id: '',
        name: '',
        description: '',
        venue: '',
        from: '',
        to: '',
        certificate: '',
    },
    licenses: {
        id: '',
        name: '',
        number: '',
        rating: '',
        dateTaken: '',
        validity: '',
    },
};

const draft = reactive<Record<string, string>>({});
const openForm = ref<{ tab: RecordTabKey; editing: number | null } | null>(
    null,
);

function nextId(rows: Record<string, string>[], prefix: string): string {
    return `${prefix}-${String(rows.length + 1).padStart(3, '0')}`;
}

function openAdd(tab: RecordTabKey): void {
    Object.assign(draft, draftDefaults[tab]);

    if (tab === 'dependents') {
        draft.id = nextId(state.dependents, 'DEP');
    }

    if (tab === 'trainings') {
        draft.id = nextId(state.trainings, 'TRN');
    }

    if (tab === 'licenses') {
        draft.id = nextId(state.licenses, 'LIC');
    }

    openForm.value = { tab, editing: null };
}

function openEdit(tab: RecordTabKey, index: number): void {
    Object.assign(draft, state[tab][index]);
    openForm.value = { tab, editing: index };
}

function saveRecord(): void {
    const form = openForm.value;

    if (!form) {
        return;
    }

    if (form.editing === null) {
        state[form.tab].push({ ...draft });
        toast.success('Record added (demo)');
    } else {
        state[form.tab][form.editing] = { ...draft };
        toast.success('Record updated (demo)');
    }

    openForm.value = null;
}

function removeRecord(tab: RecordTabKey, index: number): void {
    state[tab].splice(index, 1);
    toast.success('Record removed');
}

/* ------------------------------------------------------------------ */
/* Personal data helpers                                               */
/* ------------------------------------------------------------------ */

const fileInput = ref<HTMLInputElement | null>(null);

function onPhotoPicked(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
        return;
    }

    if (!file.type.startsWith('image/')) {
        toast.error('Please choose an image file');

        return;
    }

    const reader = new FileReader();

    reader.onload = () => {
        state.personal.photo = String(reader.result ?? '');
        toast.success('Profile picture preview ready (demo)');
    };
    reader.readAsDataURL(file);
    input.value = '';
}

const fullName = () =>
    [
        state.personal.firstName,
        state.personal.middleName,
        state.personal.lastName,
    ]
        .filter(Boolean)
        .join(' ') || 'New employee';

const recordCount = computed(
    () =>
        state.dependents.length +
        state.education.length +
        state.employment.length +
        state.trainings.length +
        state.licenses.length,
);

/* ------------------------------------------------------------------ */
/* Personal data field definitions                                     */
/* ------------------------------------------------------------------ */

type PersonalField = {
    id: string;
    label: string;
    model: keyof EmployeeFormState['personal'];
    type?: 'text' | 'date' | 'email';
    disabled?: boolean;
    selectOptions?: string[];
};

// Exact 201-file order: surname first, then first, middle, suffix, etc.
const personalFields: PersonalField[] = [
    { id: 'p-last', label: 'Last name', model: 'lastName' },
    { id: 'p-first', label: 'First name', model: 'firstName' },
    { id: 'p-middle', label: 'Middle name', model: 'middleName' },
    { id: 'p-suffix', label: 'Suffix', model: 'suffix' },
    { id: 'p-hired', label: 'Date hired', model: 'dateHired', type: 'date' },
    {
        id: 'p-dept',
        label: 'Department assignment',
        model: 'department',
        selectOptions: props.departments,
    },
    { id: 'p-height', label: 'Height (cm)', model: 'height' },
    { id: 'p-weight', label: 'Weight (kg)', model: 'weight' },
    {
        id: 'p-classification',
        label: 'Classification',
        model: 'classification',
    },
    {
        id: 'p-emptype',
        label: 'Emp type',
        model: 'employmentType',
        selectOptions: ['Regular', 'Probationary', 'Contractual'],
    },
    { id: 'p-birth', label: 'Birthdate', model: 'birthDate', type: 'date' },
    { id: 'p-age', label: 'Age', model: 'age', disabled: true },
    { id: 'p-birthplace', label: 'Birthplace', model: 'birthplace' },
    {
        id: 'p-gender',
        label: 'Gender',
        model: 'gender',
        selectOptions: ['Female', 'Male', 'Prefer not to say'],
    },
    { id: 'p-phone', label: 'Contact number', model: 'phone' },
    { id: 'p-address', label: 'Address', model: 'address' },
    { id: 'p-zip', label: 'Zip code', model: 'zipCode' },
    { id: 'p-email', label: 'Email address', model: 'email', type: 'email' },
    {
        id: 'p-civil',
        label: 'Civil status',
        model: 'civilStatus',
        selectOptions: [
            'Single',
            'Married',
            'Widowed',
            'Separated',
            'Divorced',
        ],
    },
    {
        id: 'p-citizenship',
        label: 'Citizenship',
        model: 'citizenship',
        selectOptions: ['Filipino', 'American', 'Chinese', 'Japanese', 'Other'],
    },
    { id: 'p-religion', label: 'Religion', model: 'religion' },
];

// Age is derived from the birthdate, like a real 201 file.
function computeAge(birthDate: string): string {
    if (!birthDate) {
        return '';
    }

    const birth = new Date(`${birthDate}T00:00:00`);

    if (Number.isNaN(birth.getTime())) {
        return '';
    }

    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const monthDiff = now.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
        age -= 1;
    }

    return age > 0 ? String(age) : '';
}

watch(
    () => state.personal.birthDate,
    (value) => {
        state.personal.age = computeAge(value);
    },
);

onMounted(() => {
    state.personal.age = computeAge(state.personal.birthDate);
});

const familyFields: {
    id: string;
    label: string;
    model: keyof EmployeeFormState['personal'];
}[] = [
    { id: 'f-spouse', label: 'Spouse', model: 'spouse' },
    { id: 'f-father', label: "Father's name", model: 'father' },
    { id: 'f-mother', label: "Mother's name", model: 'mother' },
];

const emergencyFields: {
    id: string;
    label: string;
    model: keyof EmployeeFormState['personal'];
}[] = [
    { id: 'e-name', label: 'Contact person', model: 'emergencyName' },
    { id: 'e-relation', label: 'Relation', model: 'emergencyRelation' },
    { id: 'e-phone', label: 'Contact number', model: 'emergencyPhone' },
];
</script>

<template>
    <div class="mx-auto flex w-full max-w-7xl flex-col gap-6 pb-24">
        <!-- Header -->
        <div>
            <Button
                v-if="backHref"
                variant="ghost"
                size="sm"
                class="-ml-2 w-fit"
                @click="router.visit(backHref)"
            >
                <ArrowLeft class="size-4" />
                {{ backLabel }}
            </Button>
            <div
                class="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"
            >
                <div class="flex flex-col gap-1">
                    <h1 class="text-2xl font-bold tracking-tight">
                        {{ heading }}
                    </h1>
                    <p v-if="description" class="text-sm text-muted-foreground">
                        {{ description }}
                    </p>
                </div>
                <div class="flex shrink-0 items-center gap-2">
                    <slot name="actions" />
                </div>
            </div>
        </div>

        <!-- Tabs: sticky, full-width single row, each tab flexes equally -->
        <div
            class="sticky top-2 z-20 flex w-full rounded-xl border bg-card p-1.5 shadow-sm"
        >
            <button
                v-for="tab in tabs"
                :key="tab.key"
                type="button"
                class="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors"
                :class="
                    cn(
                        activeTab === tab.key
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    )
                "
                @click="activeTab = tab.key"
            >
                <component :is="tab.icon" class="size-4" />
                {{ tab.label }}
            </button>
        </div>

        <!-- ============ 1. PERSONAL DATA ============ -->
        <section v-if="activeTab === 'personal'" class="grid gap-6">
            <!-- Profile picture -->
            <div class="rounded-xl border bg-card p-6 shadow-sm">
                <h2 class="font-semibold">Profile picture</h2>
                <div class="mt-4 flex items-center gap-5">
                    <Avatar class="size-24 overflow-hidden rounded-2xl">
                        <AvatarFallback
                            class="rounded-2xl bg-blue-600 text-2xl font-bold text-white"
                        >
                            {{ getInitials(fullName()) }}
                        </AvatarFallback>
                    </Avatar>
                    <div class="flex flex-col gap-2">
                        <input
                            ref="fileInput"
                            type="file"
                            accept="image/*"
                            class="hidden"
                            @change="onPhotoPicked"
                        />
                        <Button
                            variant="outline"
                            size="sm"
                            @click="fileInput?.click()"
                        >
                            <Camera class="size-4" />
                            Upload photo
                        </Button>
                        <Button
                            v-if="state.personal.photo"
                            variant="ghost"
                            size="sm"
                            @click="state.personal.photo = ''"
                        >
                            Remove photo
                        </Button>
                    </div>
                </div>
                <img
                    v-if="state.personal.photo"
                    :src="state.personal.photo"
                    alt="Profile preview"
                    class="mt-4 max-h-48 rounded-xl border object-contain"
                />
            </div>

            <!-- Personal information -->
            <div class="rounded-xl border bg-card p-6 shadow-sm">
                <h2 class="font-semibold">Personal information</h2>
                <div class="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div
                        v-for="item in personalFields"
                        :key="item.id"
                        class="grid gap-2"
                    >
                        <Label :for="item.id">{{ item.label }}</Label>
                        <Select
                            v-if="item.selectOptions"
                            v-model="state.personal[item.model]"
                        >
                            <SelectTrigger :id="item.id">
                                <SelectValue
                                    :placeholder="`Select ${item.label.toLowerCase()}`"
                                />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem
                                    v-for="opt in item.selectOptions"
                                    :key="opt"
                                    :value="opt"
                                >
                                    {{ opt }}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <Input
                            v-else
                            :id="item.id"
                            v-model="state.personal[item.model]"
                            :type="item.type ?? 'text'"
                            :disabled="item.disabled"
                        />
                    </div>
                </div>
            </div>

            <!-- Family / dependent information -->
            <div class="rounded-xl border bg-card p-6 shadow-sm">
                <h2 class="font-semibold">Family / dependent information</h2>
                <div class="mt-5 grid gap-4 sm:grid-cols-3">
                    <div
                        v-for="item in familyFields"
                        :key="item.id"
                        class="grid gap-2"
                    >
                        <Label :for="item.id">{{ item.label }}</Label>
                        <Input
                            :id="item.id"
                            v-model="state.personal[item.model]"
                        />
                    </div>
                </div>
            </div>

            <!-- In case of emergency -->
            <div
                class="rounded-xl border border-blue-200 bg-card p-6 shadow-sm dark:border-blue-500/30"
            >
                <h2 class="font-semibold">In case of emergency</h2>
                <div class="mt-5 grid gap-4 sm:grid-cols-3">
                    <div
                        v-for="item in emergencyFields"
                        :key="item.id"
                        class="grid gap-2"
                    >
                        <Label :for="item.id">{{ item.label }}</Label>
                        <Input
                            :id="item.id"
                            v-model="state.personal[item.model]"
                        />
                    </div>
                </div>
            </div>
        </section>

        <!-- ============ 2. DEPENDENT RECORD ============ -->
        <section v-if="activeTab === 'dependents'" class="grid gap-4">
            <RecordTable
                title="Dependents"
                :columns="[
                    { key: 'id', label: 'Dependent ID' },
                    { key: 'fullName', label: 'Full name' },
                    { key: 'birthDate', label: 'Birth date' },
                ]"
                :rows="state.dependents"
                @add="openAdd('dependents')"
                @edit="openEdit('dependents', $event)"
                @remove="removeRecord('dependents', $event)"
            />
        </section>

        <!-- ============ 3. EDUCATIONAL BACKGROUND ============ -->
        <section v-if="activeTab === 'education'" class="grid gap-4">
            <RecordTable
                title="Educational background"
                :columns="[
                    { key: 'level', label: 'Educational level' },
                    { key: 'school', label: 'School name' },
                    { key: 'yearGraduated', label: 'Year graduated' },
                    { key: 'degree', label: 'Degree received' },
                    { key: 'skills', label: 'Special skills' },
                ]"
                :rows="state.education"
                @add="openAdd('education')"
                @edit="openEdit('education', $event)"
                @remove="removeRecord('education', $event)"
            />
        </section>

        <!-- ============ 4. EMPLOYMENT RECORD ============ -->
        <section v-if="activeTab === 'employment'" class="grid gap-4">
            <RecordTable
                title="Employment history"
                :columns="[
                    { key: 'company', label: 'Company name' },
                    { key: 'position', label: 'Position' },
                    { key: 'from', label: 'Date from' },
                    { key: 'to', label: 'Date to' },
                ]"
                :rows="state.employment"
                @add="openAdd('employment')"
                @edit="openEdit('employment', $event)"
                @remove="removeRecord('employment', $event)"
            />
        </section>

        <!-- ============ 5. CHARACTER REFERENCES ============ -->
        <section v-if="activeTab === 'characterRefs'" class="grid gap-4">
            <RecordTable
                title="Character references"
                :columns="[
                    { key: 'company', label: 'Company name' },
                    { key: 'position', label: 'Position' },
                    { key: 'from', label: 'Date from' },
                    { key: 'to', label: 'Date to' },
                ]"
                :rows="state.characterRefs"
                @add="openAdd('characterRefs')"
                @edit="openEdit('characterRefs', $event)"
                @remove="removeRecord('characterRefs', $event)"
            />
        </section>

        <!-- ============ 6. TRAINING RECORD ============ -->
        <section v-if="activeTab === 'trainings'" class="grid gap-4">
            <RecordTable
                title="Training records"
                :columns="[
                    { key: 'id', label: 'Training ID' },
                    { key: 'name', label: 'Training name' },
                    { key: 'description', label: 'Description' },
                    { key: 'venue', label: 'Venue' },
                    { key: 'from', label: 'Date from' },
                    { key: 'to', label: 'Date to' },
                    { key: 'certificate', label: 'Certificate' },
                ]"
                :rows="state.trainings"
                @add="openAdd('trainings')"
                @edit="openEdit('trainings', $event)"
                @remove="removeRecord('trainings', $event)"
            />
        </section>

        <!-- ============ 7. EMPLOYEE & GOV. RECORD ============ -->
        <section v-if="activeTab === 'gov'" class="grid gap-6">
            <div class="rounded-xl border bg-card p-6 shadow-sm">
                <div class="flex items-center gap-2">
                    <ShieldCheck
                        class="size-4 text-blue-600 dark:text-blue-400"
                    />
                    <h2 class="font-semibold">
                        Employee &amp; government records
                    </h2>
                </div>
                <div class="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div class="grid gap-2">
                        <Label for="g-darbc">DARBC ID</Label>
                        <Input id="g-darbc" v-model="state.gov.darbc" />
                    </div>
                    <div class="grid gap-2">
                        <Label for="g-biometric">Biometric</Label>
                        <Input id="g-biometric" v-model="state.gov.biometric" />
                    </div>
                    <div class="grid gap-2">
                        <Label for="g-atm">ATM number</Label>
                        <Input id="g-atm" v-model="state.gov.atm" />
                    </div>
                    <div class="grid gap-2">
                        <Label for="g-tin">TIN</Label>
                        <Input id="g-tin" v-model="state.gov.tin" />
                    </div>
                    <div class="grid gap-2">
                        <Label for="g-pagibig">Pag-IBIG</Label>
                        <Input id="g-pagibig" v-model="state.gov.pagibig" />
                    </div>
                    <div class="grid gap-2">
                        <Label for="g-philhealth">PhilHealth</Label>
                        <Input
                            id="g-philhealth"
                            v-model="state.gov.philhealth"
                        />
                    </div>
                    <div class="grid gap-2">
                        <Label for="g-sss">SSS</Label>
                        <Input id="g-sss" v-model="state.gov.sss" />
                    </div>
                </div>
            </div>

            <!-- Residential certificate -->
            <div
                class="rounded-xl border border-blue-200 bg-card p-6 shadow-sm dark:border-blue-500/30"
            >
                <div class="flex items-center gap-2">
                    <FileText class="size-4 text-blue-600 dark:text-blue-400" />
                    <h2 class="font-semibold">Residential certificate</h2>
                </div>
                <div class="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div class="grid gap-2">
                        <Label>Cert. type</Label>
                        <Select v-model="state.residentCert.type">
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Cedula">
                                    Cedula (Community Tax Certificate)
                                </SelectItem>
                                <SelectItem value="Barangay Clearance">
                                    Barangay Clearance
                                </SelectItem>
                                <SelectItem value="Police Clearance">
                                    Police Clearance
                                </SelectItem>
                                <SelectItem value="NBI Clearance">
                                    NBI Clearance
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div class="grid gap-2">
                        <Label for="rc-number">Cert. number</Label>
                        <Input
                            id="rc-number"
                            v-model="state.residentCert.number"
                        />
                    </div>
                    <div class="grid gap-2">
                        <Label for="rc-issuedAt">Issued at</Label>
                        <Input
                            id="rc-issuedAt"
                            v-model="state.residentCert.issuedAt"
                        />
                    </div>
                    <div class="grid gap-2">
                        <Label for="rc-issuedOn">Issued on</Label>
                        <Input
                            id="rc-issuedOn"
                            v-model="state.residentCert.issuedOn"
                            type="date"
                        />
                    </div>
                </div>
            </div>
        </section>

        <!-- ============ 8. LICENSES ATTAINED ============ -->
        <section v-if="activeTab === 'licenses'" class="grid gap-4">
            <RecordTable
                title="Licenses attained"
                :columns="[
                    { key: 'id', label: 'License ID' },
                    { key: 'name', label: 'License name' },
                    { key: 'number', label: 'License number' },
                    { key: 'rating', label: 'Rating' },
                    { key: 'dateTaken', label: 'Date taken' },
                    { key: 'validity', label: 'Date of validity' },
                ]"
                :rows="state.licenses"
                @add="openAdd('licenses')"
                @edit="openEdit('licenses', $event)"
                @remove="removeRecord('licenses', $event)"
            />
        </section>

        <!-- Sticky save bar (single set of Save / Clear actions) -->
        <div
            class="sticky bottom-4 z-10 flex flex-col gap-3 rounded-xl border bg-card/95 p-4 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between"
        >
            <div class="flex items-center gap-3">
                <Avatar class="size-10 overflow-hidden rounded-xl">
                    <AvatarFallback
                        class="rounded-xl bg-blue-600 text-xs font-bold text-white"
                    >
                        {{ getInitials(fullName()) }}
                    </AvatarFallback>
                </Avatar>
                <div class="min-w-0">
                    <p class="truncate text-sm font-semibold">
                        {{ fullName() }}
                    </p>
                    <p class="truncate text-xs text-muted-foreground">
                        {{ recordCount }} record(s)
                    </p>
                </div>
            </div>
            <div class="flex gap-2">
                <Button variant="outline" @click="clearForm">
                    <Eraser class="size-4" />
                    Clear form
                </Button>
                <Button class="bg-blue-600 hover:bg-blue-700" @click="saveForm">
                    <Save class="size-4" />
                    {{ saveLabel }}
                </Button>
            </div>
        </div>
    </div>

    <!-- Add / edit record modal -->
    <RecordFormModal
        v-if="openForm"
        :tab="openForm.tab"
        :editing="openForm.editing !== null"
        v-model:draft="draft"
        @save="saveRecord"
        @cancel="openForm = null"
    />
</template>
