export type EmployeeFormState = {
    personal: {
        photo: string;
        lastName: string;
        firstName: string;
        middleName: string;
        suffix: string;
        birthDate: string;
        age: string;
        birthplace: string;
        gender: string;
        civilStatus: string;
        citizenship: string;
        religion: string;
        height: string;
        weight: string;
        classification: string;
        address: string;
        zipCode: string;
        phone: string;
        email: string;
        dateHired: string;
        department: string;
        employmentType: string;
        position: string;
        spouse: string;
        father: string;
        mother: string;
        emergencyName: string;
        emergencyRelation: string;
        emergencyPhone: string;
    };
    dependents: Record<string, string>[];
    education: Record<string, string>[];
    employment: Record<string, string>[];
    characterRefs: Record<string, string>[];
    trainings: Record<string, string>[];
    gov: {
        darbc: string;
        biometric: string;
        atm: string;
        tin: string;
        pagibig: string;
        philhealth: string;
        sss: string;
    };
    residentCert: {
        type: string;
        number: string;
        issuedAt: string;
        issuedOn: string;
    };
    licenses: Record<string, string>[];
};

export function defaultState(): EmployeeFormState {
    return {
        personal: {
            photo: '',
            lastName: '',
            firstName: '',
            middleName: '',
            suffix: '',
            birthDate: '',
            age: '',
            birthplace: '',
            gender: '',
            civilStatus: '',
            citizenship: 'Filipino',
            religion: '',
            height: '',
            weight: '',
            classification: '',
            address: '',
            zipCode: '',
            phone: '',
            email: '',
            dateHired: '',
            department: '',
            employmentType: 'Regular',
            position: '',
            spouse: '',
            father: '',
            mother: '',
            emergencyName: '',
            emergencyRelation: '',
            emergencyPhone: '',
        },
        dependents: [],
        education: [],
        employment: [],
        characterRefs: [],
        trainings: [],
        gov: {
            darbc: '',
            biometric: '',
            atm: '',
            tin: '',
            pagibig: '',
            philhealth: '',
            sss: '',
        },
        residentCert: {
            type: '',
            number: '',
            issuedAt: '',
            issuedOn: '',
        },
        licenses: [],
    };
}

export function mergeState(
    base: EmployeeFormState,
    patch: Partial<EmployeeFormState>,
): EmployeeFormState {
    return {
        ...base,
        ...patch,
        personal: { ...base.personal, ...(patch.personal ?? {}) },
        gov: { ...base.gov, ...(patch.gov ?? {}) },
        residentCert: { ...base.residentCert, ...(patch.residentCert ?? {}) },
    };
}
