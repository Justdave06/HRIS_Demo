export type DemoAccount = {
    id: number;
    name: string;
    role: string;
    department: string;
    email: string;
    color: string;
    /** Module slug this account opens when logging in (1-10). */
    module: string;
};

export type DemoModule = {
    slug: string;
    name: string;
    short: string;
    description: string;
    status: 'available' | 'soon';
};

export type DemoModuleLink = {
    module: string;
    note: string;
};

export type DemoModuleLinks = {
    sends: DemoModuleLink[];
    receives: DemoModuleLink[];
};

export type DemoEmployee = {
    id: number;
    no: string;
    name: string;
    department: string;
    position: string;
    status: 'Active' | 'Probationary' | 'On Leave';
    employment_type: 'Regular' | 'Probationary' | 'Contractual';
    file_status: 'Complete' | 'Incomplete';
    email: string;
    phone: string;
    hire_date: string;
    birth_date: string;
    gender: string;
    address: string;
    emergency: {
        name: string;
        relation: string;
        phone: string;
    };
    manager: string;
    salary: number;
    leave_balance: number;
    trainings: number;
};

export type DemoAttendance = {
    employee_id: number;
    time_in: string | null;
    time_out: string | null;
    status: 'Present' | 'Late' | 'On Leave' | 'Absent' | 'Not Yet In';
};

export type DemoJob = {
    id: number;
    title: string;
    department: string;
    openings: number;
    applicants: number;
    posted: string;
};

export type DemoCandidate = {
    id: number;
    name: string;
    job: string;
    stage: 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Hired';
    applied_on: string;
};

export type DemoOnboardingTask = {
    label: string;
    done: boolean;
};

export type DemoOnboarding = {
    employee_id: number;
    name: string;
    position: string;
    start_date: string;
    progress: number;
    tasks: DemoOnboardingTask[];
};
