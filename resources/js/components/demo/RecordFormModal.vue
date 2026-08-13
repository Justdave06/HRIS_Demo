<script setup lang="ts">
import { FileUp, Save, X } from '@lucide/vue';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { toast } from 'vue-sonner';
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

type RecordTab =
    | 'dependents'
    | 'education'
    | 'employment'
    | 'characterRefs'
    | 'trainings'
    | 'licenses';

const props = defineProps<{
    tab: RecordTab;
    editing: boolean;
}>();

const draft = defineModel<Record<string, string>>('draft', { required: true });

const emit = defineEmits<{
    save: [];
    cancel: [];
}>();

const titles: Record<RecordTab, [string, string]> = {
    dependents: ['Add dependent', 'Update dependent'],
    education: ['Add educational background', 'Update educational background'],
    employment: ['Add previous employment', 'Update employment record'],
    characterRefs: ['Add character reference', 'Update character reference'],
    trainings: ['Add training', 'Update training record'],
    licenses: ['Add license', 'Update license record'],
};

const title = computed(() => titles[props.tab][props.editing ? 1 : 0]);

// Certificate is a proof-of-completion document: pick a file, keep its name.
const certificateInput = ref<HTMLInputElement | null>(null);

function onCertificatePicked(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
        draft.value.certificate = file.name;
        toast.success('Certificate file attached (demo)');
    }

    input.value = '';
}

function onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
        emit('cancel');
    }
}

onMounted(() => window.addEventListener('keydown', onKeydown));
onUnmounted(() => window.removeEventListener('keydown', onKeydown));
</script>

<template>
    <Teleport to="body">
        <div
            class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm sm:p-8"
            @click.self="emit('cancel')"
        >
            <div class="w-full max-w-2xl rounded-2xl bg-card shadow-2xl">
                <!-- Header -->
                <div
                    class="flex items-center justify-between border-b px-6 py-4"
                >
                    <h3 class="text-base font-bold">{{ title }}</h3>
                    <button
                        type="button"
                        class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        aria-label="Close"
                        @click="emit('cancel')"
                    >
                        <X class="size-5" />
                    </button>
                </div>

                <!-- Body: fields per record type -->
                <div class="px-6 py-5">
                    <!-- Dependents -->
                    <div
                        v-if="tab === 'dependents'"
                        class="grid gap-4 sm:grid-cols-3"
                    >
                        <div class="grid gap-2">
                            <Label for="dep-id">Dependent ID</Label>
                            <Input id="dep-id" v-model="draft.id" disabled />
                        </div>
                        <div class="grid gap-2">
                            <Label for="dep-name">Full name</Label>
                            <Input id="dep-name" v-model="draft.fullName" />
                        </div>
                        <div class="grid gap-2">
                            <Label for="dep-birth">Birth date</Label>
                            <Input
                                id="dep-birth"
                                v-model="draft.birthDate"
                                type="date"
                            />
                        </div>
                    </div>

                    <!-- Educational background -->
                    <div
                        v-else-if="tab === 'education'"
                        class="grid gap-4 sm:grid-cols-2"
                    >
                        <div class="grid gap-2">
                            <Label>Educational level</Label>
                            <Select v-model="draft.level">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Elementary">
                                        Elementary
                                    </SelectItem>
                                    <SelectItem value="High School">
                                        High School
                                    </SelectItem>
                                    <SelectItem value="Senior High School">
                                        Senior High School
                                    </SelectItem>
                                    <SelectItem value="Vocational">
                                        Vocational
                                    </SelectItem>
                                    <SelectItem value="College">
                                        College
                                    </SelectItem>
                                    <SelectItem value="Postgraduate">
                                        Postgraduate
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div class="grid gap-2">
                            <Label for="edu-school">School name</Label>
                            <Input id="edu-school" v-model="draft.school" />
                        </div>
                        <div class="grid gap-2">
                            <Label for="edu-year">Year graduated</Label>
                            <Input
                                id="edu-year"
                                v-model="draft.yearGraduated"
                            />
                        </div>
                        <div class="grid gap-2">
                            <Label for="edu-degree">Degree received</Label>
                            <Input id="edu-degree" v-model="draft.degree" />
                        </div>
                        <div class="grid gap-2 sm:col-span-2">
                            <Label for="edu-skills">Special skills</Label>
                            <Input id="edu-skills" v-model="draft.skills" />
                        </div>
                    </div>

                    <!-- Employment record -->
                    <div
                        v-else-if="tab === 'employment'"
                        class="grid gap-4 sm:grid-cols-2"
                    >
                        <div class="grid gap-2">
                            <Label for="emp-company">Company name</Label>
                            <Input id="emp-company" v-model="draft.company" />
                        </div>
                        <div class="grid gap-2">
                            <Label for="emp-position">Position</Label>
                            <Input id="emp-position" v-model="draft.position" />
                        </div>
                        <div class="grid gap-2">
                            <Label for="emp-from">Date from</Label>
                            <Input
                                id="emp-from"
                                v-model="draft.from"
                                type="month"
                            />
                        </div>
                        <div class="grid gap-2">
                            <Label for="emp-to">Date to</Label>
                            <Input
                                id="emp-to"
                                v-model="draft.to"
                                type="month"
                            />
                        </div>
                    </div>

                    <!-- Character references -->
                    <div
                        v-else-if="tab === 'characterRefs'"
                        class="grid gap-4 sm:grid-cols-2"
                    >
                        <div class="grid gap-2">
                            <Label for="ref-company">Company name</Label>
                            <Input id="ref-company" v-model="draft.company" />
                        </div>
                        <div class="grid gap-2">
                            <Label for="ref-position">Position</Label>
                            <Input id="ref-position" v-model="draft.position" />
                        </div>
                        <div class="grid gap-2">
                            <Label for="ref-from">Date from</Label>
                            <Input
                                id="ref-from"
                                v-model="draft.from"
                                type="month"
                            />
                        </div>
                        <div class="grid gap-2">
                            <Label for="ref-to">Date to</Label>
                            <Input
                                id="ref-to"
                                v-model="draft.to"
                                type="month"
                            />
                        </div>
                    </div>

                    <!-- Training record -->
                    <div
                        v-else-if="tab === 'trainings'"
                        class="grid gap-4 sm:grid-cols-2"
                    >
                        <div class="grid gap-2">
                            <Label for="trn-id">Training ID</Label>
                            <Input id="trn-id" v-model="draft.id" disabled />
                        </div>
                        <div class="grid gap-2">
                            <Label for="trn-name">Training name</Label>
                            <Input id="trn-name" v-model="draft.name" />
                        </div>
                        <div class="grid gap-2 sm:col-span-2">
                            <Label for="trn-desc">Description</Label>
                            <Input id="trn-desc" v-model="draft.description" />
                        </div>
                        <div class="grid gap-2">
                            <Label for="trn-venue">Venue</Label>
                            <Input id="trn-venue" v-model="draft.venue" />
                        </div>
                        <div class="grid gap-2 sm:col-span-2">
                            <Label>Certificate (proof)</Label>
                            <input
                                ref="certificateInput"
                                type="file"
                                accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                                class="hidden"
                                @change="onCertificatePicked"
                            />
                            <div class="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    @click="certificateInput?.click()"
                                >
                                    <FileUp class="size-4" />
                                    {{
                                        draft.certificate
                                            ? 'Replace file'
                                            : 'Choose file'
                                    }}
                                </Button>
                                <span
                                    v-if="draft.certificate"
                                    class="truncate text-xs text-muted-foreground"
                                    :title="draft.certificate"
                                >
                                    {{ draft.certificate }}
                                </span>
                                <button
                                    v-if="draft.certificate"
                                    type="button"
                                    class="text-xs font-medium text-blue-600 transition-colors hover:text-blue-800"
                                    @click="draft.certificate = ''"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                        <div class="grid gap-2">
                            <Label for="trn-from">Date from</Label>
                            <Input
                                id="trn-from"
                                v-model="draft.from"
                                type="date"
                            />
                        </div>
                        <div class="grid gap-2">
                            <Label for="trn-to">Date to</Label>
                            <Input id="trn-to" v-model="draft.to" type="date" />
                        </div>
                    </div>

                    <!-- Licenses -->
                    <div
                        v-else-if="tab === 'licenses'"
                        class="grid gap-4 sm:grid-cols-2"
                    >
                        <div class="grid gap-2">
                            <Label for="lic-id">License ID</Label>
                            <Input id="lic-id" v-model="draft.id" disabled />
                        </div>
                        <div class="grid gap-2">
                            <Label for="lic-name">License name</Label>
                            <Input id="lic-name" v-model="draft.name" />
                        </div>
                        <div class="grid gap-2">
                            <Label for="lic-number">License number</Label>
                            <Input id="lic-number" v-model="draft.number" />
                        </div>
                        <div class="grid gap-2">
                            <Label for="lic-rating">Rating</Label>
                            <Input id="lic-rating" v-model="draft.rating" />
                        </div>
                        <div class="grid gap-2">
                            <Label for="lic-taken">Date taken</Label>
                            <Input
                                id="lic-taken"
                                v-model="draft.dateTaken"
                                type="date"
                            />
                        </div>
                        <div class="grid gap-2">
                            <Label for="lic-validity">Date of validity</Label>
                            <Input
                                id="lic-validity"
                                v-model="draft.validity"
                                type="date"
                            />
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="flex justify-end gap-2 border-t px-6 py-4">
                    <Button variant="ghost" @click="emit('cancel')">
                        Cancel
                    </Button>
                    <Button
                        class="bg-blue-600 hover:bg-blue-700"
                        @click="emit('save')"
                    >
                        <Save class="size-4" />
                        Save record
                    </Button>
                </div>
            </div>
        </div>
    </Teleport>
</template>
