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

/** Payment treatment for a declared (non-national) holiday. */
export type DemoHolidayPay =
    | 'Paid as regular working day'
    | 'Special non-working rate'
    | 'No work, no pay (excused)';

/** A holiday declared through the Holiday Picker (abrupt, non-national). */
export type DemoHoliday = {
    id: number;
    /** ISO dates (YYYY-MM-DD) — one declaration can cover several dates. */
    dates: string[];
    reason: string;
    /** 'all' applies to everyone; 'department' only to one department. */
    scope: 'all' | 'department';
    /** Required when scope === 'department'. */
    department: string | null;
    pay: DemoHolidayPay;
    declared_on: string;
};

export type DemoLeaveStatus = 'Pending' | 'Approved' | 'Declined';

export type DemoLeaveRequest = {
    id: number;
    employee_id: number;
    type: 'Vacation' | 'Sick' | 'Emergency' | 'Maternity' | 'Paternity';
    from: string;
    to: string;
    days: number;
    status: DemoLeaveStatus;
    reason: string;
};

/** Leave request enriched with the employee's record (module 4). */
export type DemoLeaveRow = DemoLeaveRequest & {
    no: string;
    name: string;
    department: string;
    position: string;
    balance: number;
};

export type DemoJob = {
    id: number;
    title: string;
    position: string;
    department: string;
    openings: number;
    applicants: number;
    shortlisted: number;
    hired: number;
    posted: string;
    /** Employment type for the vacancy: Regular / Probationary / Contractual. */
    employment_type: DemoEmployee['employment_type'];
    /** Monthly salary band, e.g. "₱28,000 – ₱35,000". */
    salary: string;
    status: 'Open' | 'On Hold' | 'Closed';
    /** Attached hiring document (file name) — the manual posting written by
     * the recruiter with header, qualifications and requirements. */
    attachment: string;
};

export type DemoCandidate = {
    id: number;
    name: string;
    vacancy_id: number;
    job: string;
    stage: 'Applied' | 'Shortlisted' | 'Interview' | 'Hired';
    applied_on: string;
    hired_on: string | null;
    /** Scheduled interview date/time for candidates at the Interview stage. */
    interview_on: string | null;
    /** Attached application form / resume file name (demo: name only). */
    attachment: string;
    phone: string;
    email: string;
};

/** Status of a computed payslip: Paid, or Pending while the run is open. */
export type DemoPayslipStatus = 'Paid' | 'Pending';

/** One employee's computed payslip for a pay period (module 5). */
export type DemoPayslip = {
    /** Pay period, e.g. '2026-08'. */
    period: string;
    /** Human label, e.g. 'August 2026'. */
    periodLabel: string;
    employee_id: number;
    no: string;
    name: string;
    department: string;
    position: string;
    /** Monthly base salary. */
    basic: number;
    otHours: number;
    otPay: number;
    /** Unpaid days: absences + no-work-no-pay declared holidays. */
    unpaidDays: number;
    unpaidDeduction: number;
    gross: number;
    sss: number;
    philhealth: number;
    pagibig: number;
    tax: number;
    deductions: number;
    net: number;
    status: DemoPayslipStatus;
};

/** Benefit plan offered by the company (module 6). */
export type DemoBenefitPlan = {
    id: number;
    name: string;
    type: 'Government' | 'Company' | 'Allowance';
    description: string;
};

export type DemoEnrollmentStatus = 'Enrolled' | 'Pending';

/** One employee's enrollment in a benefit plan (module 6). */
export type DemoEnrollment = {
    id: number;
    employee_id: number;
    plan_id: number;
    coverage: 'Employee' | 'Employee + dependents';
    effective: string;
    status: DemoEnrollmentStatus;
};

/** Enrollment enriched with the employee's record, plan and costs (module 6). */
export type DemoEnrollmentRow = DemoEnrollment & {
    employee_no: string;
    employee_name: string;
    department: string;
    position: string;
    plan: string;
    plan_type: DemoBenefitPlan['type'];
    employee_cost: number;
    employer_cost: number;
};

/** A performance review period (Module 7), e.g. '2026-H2'. */
export type DemoPerformancePeriod = {
    value: string;
    label: string;
    status: 'Finalized' | 'In Progress';
};

/** One employee's performance review for a period (Module 7). */
export type DemoPerformanceReview = {
    id: number;
    employee_id: number;
    /** Review period value, e.g. '2026-H2'. */
    period: string;
    job_knowledge: number;
    quality: number;
    productivity: number;
    teamwork: number;
    initiative: number;
    status: 'Draft' | 'Submitted' | 'Finalized';
    reviewer: string;
    comments: string;
};

/** Review enriched with the employee's record, overall rating and outputs. */
export type DemoPerformanceRow = DemoPerformanceReview & {
    no: string;
    name: string;
    department: string;
    position: string;
    salary: number;
    /** Average of the five criteria, rounded to one decimal. */
    overall: number;
    rating_label: string;
    /** Merit raise % handed to Payroll: 5 / 3 / 0 based on the rating. */
    raise_pct: number;
    raise_amount: number;
    new_salary: number;
    /** Low-rated criteria (<= 2) with the training suggested for each. */
    gaps: { criterion: string; training: string }[];
};

/** A goal set for an employee in the current cycle (Module 7). */
export type DemoPerformanceGoal = {
    id: number;
    employee_id: number;
    title: string;
    category: string;
    progress: number;
    due: string;
    status: 'On Track' | 'Behind' | 'At Risk';
};

/** Goal enriched with the employee's record (Module 7). */
export type DemoPerformanceGoalRow = DemoPerformanceGoal & {
    no: string;
    name: string;
    department: string;
    position: string;
};

/** A training course in the catalog (Module 8). */
export type DemoTrainingCourse = {
    id: number;
    code: string;
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

/** Course enriched with enrollment counts for the catalog view (Module 8). */
export type DemoTrainingCourseRow = DemoTrainingCourse & {
    enrolled: number;
    completed: number;
    completion_rate: number;
    /** Derived: enrolled + a few free seats, so utilization stays under 100%. */
    capacity: number;
};

/** One employee's enrollment in a course (Module 8). */
export type DemoTrainingEnrollment = {
    id: number;
    course_id: number;
    employee_id: number;
    status: 'Enrolled' | 'In Progress' | 'Completed';
    score: number | null;
    completed_on: string | null;
    certificate_no: string | null;
};

/** Enrollment enriched with employee + course records (Module 8). */
export type DemoTrainingRow = DemoTrainingEnrollment & {
    no: string;
    name: string;
    department: string;
    position: string;
    course_code: string;
    title: string;
    category: string;
    venue: string;
    start: string;
    end: string;
    hours: number;
    certificate: boolean;
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
