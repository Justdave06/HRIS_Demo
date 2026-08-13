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
    /** Profile photo (data URL) uploaded on the 201 file — added employees only. */
    photo?: string;
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
    /** Monthly loan amortization (approved Benefits loans) — 0 when none. */
    loan: number;
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

export type DemoEnrollmentStatus = 'Enrolled' | 'Pending' | 'Declined';

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

/** One disciplinary case on the log (Module 9). */
export type DemoDisciplinaryRecord = {
    id: number;
    employee_id: number;
    type: 'Incident' | 'Warning';
    severity: 'Minor' | 'Moderate' | 'Serious';
    category: string;
    date: string;
    description: string;
    action: string;
    status: 'Logged' | 'Under Review' | 'Resolved' | 'Escalated';
};

/** Record enriched with the employee's record (Module 9). */
export type DemoDisciplinaryRow = DemoDisciplinaryRecord & {
    no: string;
    name: string;
    department: string;
    position: string;
};

/** An employee with multiple cases, flagged for offboarding review (Module 9). */
export type DemoRepeatOffender = {
    employee_id: number;
    no: string;
    name: string;
    department: string;
    position: string;
    recordCount: number;
    seriousCount: number;
    openCount: number;
    /** Escalated, or enough cases to warrant offboarding review. */
    flagged: boolean;
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

/** Pipeline stage of a separation case (Module 10). */
export type DemoOffboardingStatus =
    'Requested' | 'In Clearance' | 'Final Pay' | 'Completed';

/** Why the employee is leaving (Module 10). */
export type DemoOffboardingType =
    'Resignation' | 'Termination' | 'End of Contract' | 'Retirement';

/** Who filed the separation: the employee, or HR / Management. */
export type DemoOffboardingRequester = 'Employee' | 'HR / Management';

/** One item on the exit clearance checklist (Module 10). */
export type DemoClearanceTask = {
    label: string;
    done: boolean;
};

/**
 * Computed final-pay breakdown for a separation (Module 10). Mirrors the
 * payroll engine so the numbers add up: gross = basic + leave conversion +
 * prorated 13th month; net = gross − statutory deductions − advances.
 */
export type DemoFinalPay = {
    /** Basic pay for the days worked up to the exit date. */
    basic: number;
    /** Unused leave balance converted to cash. */
    leave_conversion: number;
    /** Prorated 13th-month pay for the current year. */
    thirteenth_month: number;
    gross: number;
    sss: number;
    philhealth: number;
    pagibig: number;
    tax: number;
    deductions: number;
    /** Outstanding cash advances / company loans to recover. */
    advances: number;
    net: number;
};

/** What the employee is borrowing (Benefits module loan programs). */
export type DemoLoanType =
    | 'SSS Salary Loan'
    | 'Pag-IBIG Multi-Purpose'
    | 'Company Loan'
    | 'Cash Advance';

export type DemoLoanStatus = 'Pending' | 'Approved' | 'Declined';

/**
 * A loan application — filed by the employee in the portal, reviewed by HR
 * in the Benefits module. Approved loans deduct monthly from payslips and
 * the unpaid balance is recovered from offboarding final pay.
 */
export type DemoLoanApplication = {
    id: number;
    employee_id: number;
    type: DemoLoanType;
    /** Principal amount borrowed. */
    amount: number;
    purpose: string;
    /** Repayment term in months. */
    terms: number;
    /** Straight-line monthly amortization = amount / terms. */
    monthly: number;
    applied_on: string;
    status: DemoLoanStatus;
    /** When HR approved or declined the application. */
    decided_on: string | null;
};

/** One separation case on the offboarding register (Module 10). */
export type DemoOffboardingCase = {
    id: number;
    employee_id: number;
    type: DemoOffboardingType;
    /** Who filed the separation — employee resignation vs. HR / Management. */
    requested_by: DemoOffboardingRequester;
    requested_on: string;
    exit_date: string;
    reason: string;
    status: DemoOffboardingStatus;
    tasks: DemoClearanceTask[];
};

/** Draft captured by the New separation modal (Module 10). */
export type DemoOffboardingDraft = {
    employee_id: number;
    type: DemoOffboardingType;
    requested_by: DemoOffboardingRequester;
    requested_on: string;
    exit_date: string;
    reason: string;
};

/** Case enriched with the employee record, progress and final pay (Module 10). */
export type DemoOffboardingRow = DemoOffboardingCase & {
    no: string;
    name: string;
    department: string;
    position: string;
    employment_type: DemoEmployee['employment_type'];
    salary: number;
    leave_balance: number;
    /** Percent of clearance tasks completed. */
    progress: number;
    finalPay: DemoFinalPay;
    /** True when the employee has an escalated disciplinary case (Module 9). */
    flagged: boolean;
    /** Completed cases are archived in the register. */
    archived: boolean;
};
