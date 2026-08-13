<?php

namespace App\Support;

/**
 * Demo data for the HRIS demo.
 *
 * Everything here is hard-coded on purpose: the demo runs without a database
 * so anyone can click through the modules and see how they connect.
 */
class DemoData
{
    /**
     * The 10 demo accounts shown on the simple login screen.
     *
     * Each account maps to one module (1-10): logging in as an account
     * automatically opens that account's module.
     */
    public static function accounts(): array
    {
        return [
            ['id' => 1, 'name' => 'Maria Santos', 'role' => 'HR Manager', 'department' => 'Human Resources', 'email' => 'maria.santos@demo.hris', 'color' => '#1d4ed8', 'module' => 'employees'],
            ['id' => 2, 'name' => 'Juan Dela Cruz', 'role' => 'Recruitment Specialist', 'department' => 'Human Resources', 'email' => 'juan.delacruz@demo.hris', 'color' => '#2563eb', 'module' => 'recruitment'],
            ['id' => 3, 'name' => 'Ana Reyes', 'role' => 'Timekeeper', 'department' => 'Operations', 'email' => 'ana.reyes@demo.hris', 'color' => '#3b82f6', 'module' => 'attendance'],
            ['id' => 4, 'name' => 'Jose Ramirez', 'role' => 'Leave Administrator', 'department' => 'Human Resources', 'email' => 'jose.ramirez@demo.hris', 'color' => '#0ea5e9', 'module' => 'leave'],
            ['id' => 5, 'name' => 'Carla Mendoza', 'role' => 'Payroll Officer', 'department' => 'Finance', 'email' => 'carla.mendoza@demo.hris', 'color' => '#0284c7', 'module' => 'payroll'],
            ['id' => 6, 'name' => 'Miguel Torres', 'role' => 'Benefits Administrator', 'department' => 'Human Resources', 'email' => 'miguel.torres@demo.hris', 'color' => '#1e40af', 'module' => 'benefits'],
            ['id' => 7, 'name' => 'Liza Fernandez', 'role' => 'Performance Specialist', 'department' => 'Human Resources', 'email' => 'liza.fernandez@demo.hris', 'color' => '#6366f1', 'module' => 'performance'],
            ['id' => 8, 'name' => 'Ramon Villanueva', 'role' => 'Training Coordinator', 'department' => 'Human Resources', 'email' => 'ramon.villanueva@demo.hris', 'color' => '#4f46e5', 'module' => 'training'],
            ['id' => 9, 'name' => 'Grace Aquino', 'role' => 'Compliance Officer', 'department' => 'Legal & Compliance', 'email' => 'grace.aquino@demo.hris', 'color' => '#0f172a', 'module' => 'disciplinary'],
            ['id' => 10, 'name' => 'Paolo Garcia', 'role' => 'HR Assistant', 'department' => 'Human Resources', 'email' => 'paolo.garcia@demo.hris', 'color' => '#0891b2', 'module' => 'offboarding'],
        ];
    }

    /** Employee master records (Module 1). Account ids 1-10 match employees 1-10. */
    public static function employees(): array
    {
        return [
            ['id' => 1, 'no' => 'EMP-0001', 'name' => 'Maria Santos', 'department' => 'Human Resources', 'position' => 'HR Manager', 'status' => 'Active', 'email' => 'maria.santos@company.com', 'phone' => '0917 123 4001', 'hire_date' => '2019-03-11', 'birth_date' => '1988-07-14', 'gender' => 'Female', 'address' => '24 Rosewood St., Quezon City', 'emergency' => ['name' => 'Ramon Santos', 'relation' => 'Husband', 'phone' => '0918 765 4001'], 'manager' => 'Grace Aquino', 'salary' => 85000, 'leave_balance' => 12, 'trainings' => 6],
            ['id' => 2, 'no' => 'EMP-0002', 'name' => 'Juan Dela Cruz', 'department' => 'Human Resources', 'position' => 'Recruitment Specialist', 'status' => 'Active', 'email' => 'juan.delacruz@company.com', 'phone' => '0917 123 4002', 'hire_date' => '2021-08-02', 'birth_date' => '1993-02-09', 'gender' => 'Male', 'address' => '118 Mabini St., Manila', 'emergency' => ['name' => 'Luz Dela Cruz', 'relation' => 'Mother', 'phone' => '0918 765 4002'], 'manager' => 'Maria Santos', 'salary' => 42000, 'leave_balance' => 9, 'trainings' => 4],
            ['id' => 3, 'no' => 'EMP-0003', 'name' => 'Ana Reyes', 'department' => 'Finance', 'position' => 'Payroll Officer', 'status' => 'Active', 'email' => 'ana.reyes@company.com', 'phone' => '0917 123 4003', 'hire_date' => '2020-01-20', 'birth_date' => '1990-11-30', 'gender' => 'Female', 'address' => '7 Luna St., Pasig City', 'emergency' => ['name' => 'Carlos Reyes', 'relation' => 'Father', 'phone' => '0918 765 4003'], 'manager' => 'Ricardo Alonzo', 'salary' => 48000, 'leave_balance' => 10, 'trainings' => 3],
            ['id' => 4, 'no' => 'EMP-0004', 'name' => 'Jose Ramirez', 'department' => 'Operations', 'position' => 'Timekeeper', 'status' => 'Active', 'email' => 'jose.ramirez@company.com', 'phone' => '0917 123 4004', 'hire_date' => '2022-05-16', 'birth_date' => '1995-04-22', 'gender' => 'Male', 'address' => '55 Sampaguita Rd., Caloocan', 'emergency' => ['name' => 'Teresa Ramirez', 'relation' => 'Wife', 'phone' => '0918 765 4004'], 'manager' => 'Olive Santiago', 'salary' => 38000, 'leave_balance' => 8, 'trainings' => 2],
            ['id' => 5, 'no' => 'EMP-0005', 'name' => 'Carla Mendoza', 'department' => 'Human Resources', 'position' => 'Benefits Admin', 'status' => 'Active', 'email' => 'carla.mendoza@company.com', 'phone' => '0917 123 4005', 'hire_date' => '2021-11-08', 'birth_date' => '1992-09-17', 'gender' => 'Female', 'address' => '302 Acacia Ave., Taguig', 'emergency' => ['name' => 'Eduardo Mendoza', 'relation' => 'Brother', 'phone' => '0918 765 4005'], 'manager' => 'Maria Santos', 'salary' => 44000, 'leave_balance' => 11, 'trainings' => 4],
            ['id' => 6, 'no' => 'EMP-0006', 'name' => 'Miguel Torres', 'department' => 'Information Technology', 'position' => 'IT Manager', 'status' => 'Active', 'email' => 'miguel.torres@company.com', 'phone' => '0917 123 4006', 'hire_date' => '2018-07-02', 'birth_date' => '1987-03-05', 'gender' => 'Male', 'address' => '88 A. Bonifacio Ave., Mandaluyong', 'emergency' => ['name' => 'Sandra Torres', 'relation' => 'Wife', 'phone' => '0918 765 4006'], 'manager' => 'Grace Aquino', 'salary' => 95000, 'leave_balance' => 14, 'trainings' => 7],
            ['id' => 7, 'no' => 'EMP-0007', 'name' => 'Liza Fernandez', 'department' => 'Human Resources', 'position' => 'Training Coordinator', 'status' => 'Active', 'email' => 'liza.fernandez@company.com', 'phone' => '0917 123 4007', 'hire_date' => '2020-10-12', 'birth_date' => '1991-06-28', 'gender' => 'Female', 'address' => '14 Ilang-Ilang St., Makati', 'emergency' => ['name' => 'Belen Fernandez', 'relation' => 'Mother', 'phone' => '0918 765 4007'], 'manager' => 'Maria Santos', 'salary' => 43000, 'leave_balance' => 10, 'trainings' => 5],
            ['id' => 8, 'no' => 'EMP-0008', 'name' => 'Ramon Villanueva', 'department' => 'Legal & Compliance', 'position' => 'Compliance Officer', 'status' => 'Active', 'email' => 'ramon.villanueva@company.com', 'phone' => '0917 123 4008', 'hire_date' => '2019-09-30', 'birth_date' => '1985-12-02', 'gender' => 'Male', 'address' => '19 Katipunan Ave., Quezon City', 'emergency' => ['name' => 'Lorna Villanueva', 'relation' => 'Sister', 'phone' => '0918 765 4008'], 'manager' => 'Grace Aquino', 'salary' => 62000, 'leave_balance' => 13, 'trainings' => 6],
            ['id' => 9, 'no' => 'EMP-0009', 'name' => 'Grace Aquino', 'department' => 'Executive Office', 'position' => 'Chief Executive', 'status' => 'Active', 'email' => 'grace.aquino@company.com', 'phone' => '0917 123 4009', 'hire_date' => '2016-04-18', 'birth_date' => '1979-01-25', 'gender' => 'Female', 'address' => '1 Executive Dr., BGC, Taguig', 'emergency' => ['name' => 'Art Aquino', 'relation' => 'Husband', 'phone' => '0918 765 4009'], 'manager' => 'Board of Directors', 'salary' => 120000, 'leave_balance' => 15, 'trainings' => 8],
            ['id' => 10, 'no' => 'EMP-0010', 'name' => 'Paolo Garcia', 'department' => 'Information Technology', 'position' => 'Software Engineer', 'status' => 'Probationary', 'email' => 'paolo.garcia@company.com', 'phone' => '0917 123 4010', 'hire_date' => '2026-08-03', 'birth_date' => '1998-05-19', 'gender' => 'Male', 'address' => '203 Rizal St., Marikina', 'emergency' => ['name' => 'Connie Garcia', 'relation' => 'Mother', 'phone' => '0918 765 4010'], 'manager' => 'Miguel Torres', 'salary' => 40000, 'leave_balance' => 5, 'trainings' => 1],
            ['id' => 11, 'no' => 'EMP-0011', 'name' => 'Ricardo Alonzo', 'department' => 'Finance', 'position' => 'Senior Accountant', 'status' => 'Active', 'email' => 'ricardo.alonzo@company.com', 'phone' => '0917 123 4011', 'hire_date' => '2017-06-05', 'birth_date' => '1986-08-15', 'gender' => 'Male', 'address' => '76 Jupiter St., Makati', 'emergency' => ['name' => 'Mercy Alonzo', 'relation' => 'Wife', 'phone' => '0918 765 4011'], 'manager' => 'Grace Aquino', 'salary' => 70000, 'leave_balance' => 14, 'trainings' => 5],
            ['id' => 12, 'no' => 'EMP-0012', 'name' => 'Sofia Villar', 'department' => 'Finance', 'position' => 'Financial Analyst', 'status' => 'Active', 'email' => 'sofia.villar@company.com', 'phone' => '0917 123 4012', 'hire_date' => '2022-02-14', 'birth_date' => '1996-10-03', 'gender' => 'Female', 'address' => '9 Saturn St., Pasig', 'emergency' => ['name' => 'Rene Villar', 'relation' => 'Father', 'phone' => '0918 765 4012'], 'manager' => 'Ricardo Alonzo', 'salary' => 46000, 'leave_balance' => 7, 'trainings' => 3],
            ['id' => 13, 'no' => 'EMP-0013', 'name' => 'Daniel Cruz', 'department' => 'Finance', 'position' => 'Accountant', 'status' => 'On Leave', 'email' => 'daniel.cruz@company.com', 'phone' => '0917 123 4013', 'hire_date' => '2023-01-09', 'birth_date' => '1994-12-11', 'gender' => 'Male', 'address' => '41 Mercury Rd., Taguig', 'emergency' => ['name' => 'Elena Cruz', 'relation' => 'Mother', 'phone' => '0918 765 4013'], 'manager' => 'Ricardo Alonzo', 'salary' => 42000, 'leave_balance' => 6, 'trainings' => 2],
            ['id' => 14, 'no' => 'EMP-0014', 'name' => 'Karen Lim', 'department' => 'Sales', 'position' => 'Sales Manager', 'status' => 'Active', 'email' => 'karen.lim@company.com', 'phone' => '0917 123 4014', 'hire_date' => '2019-11-25', 'birth_date' => '1990-04-07', 'gender' => 'Female', 'address' => '210 Orchid St., Quezon City', 'emergency' => ['name' => 'Philip Lim', 'relation' => 'Husband', 'phone' => '0918 765 4014'], 'manager' => 'Grace Aquino', 'salary' => 68000, 'leave_balance' => 12, 'trainings' => 5],
            ['id' => 15, 'no' => 'EMP-0015', 'name' => 'Mark Navarro', 'department' => 'Sales', 'position' => 'Sales Representative', 'status' => 'Active', 'email' => 'mark.navarro@company.com', 'phone' => '0917 123 4015', 'hire_date' => '2023-07-17', 'birth_date' => '1997-03-29', 'gender' => 'Male', 'address' => '15 Gumamela St., Calamba', 'emergency' => ['name' => 'Nora Navarro', 'relation' => 'Mother', 'phone' => '0918 765 4015'], 'manager' => 'Karen Lim', 'salary' => 35000, 'leave_balance' => 7, 'trainings' => 2],
            ['id' => 16, 'no' => 'EMP-0016', 'name' => 'Andrea Salazar', 'department' => 'Sales', 'position' => 'Sales Representative', 'status' => 'Active', 'email' => 'andrea.salazar@company.com', 'phone' => '0917 123 4016', 'hire_date' => '2024-03-04', 'birth_date' => '1999-08-21', 'gender' => 'Female', 'address' => '33 Molave St., San Pedro', 'emergency' => ['name' => 'Tony Salazar', 'relation' => 'Father', 'phone' => '0918 765 4016'], 'manager' => 'Karen Lim', 'salary' => 32000, 'leave_balance' => 8, 'trainings' => 1],
            ['id' => 17, 'no' => 'EMP-0017', 'name' => 'Kevin Reyes', 'department' => 'Marketing', 'position' => 'Marketing Manager', 'status' => 'Active', 'email' => 'kevin.reyes@company.com', 'phone' => '0917 123 4017', 'hire_date' => '2020-06-22', 'birth_date' => '1991-09-13', 'gender' => 'Male', 'address' => '102 A. Flores St., Mandaluyong', 'emergency' => ['name' => 'Diana Reyes', 'relation' => 'Wife', 'phone' => '0918 765 4017'], 'manager' => 'Grace Aquino', 'salary' => 65000, 'leave_balance' => 11, 'trainings' => 4],
            ['id' => 18, 'no' => 'EMP-0018', 'name' => 'Nina Bautista', 'department' => 'Marketing', 'position' => 'Marketing Specialist', 'status' => 'Active', 'email' => 'nina.bautista@company.com', 'phone' => '0917 123 4018', 'hire_date' => '2022-09-26', 'birth_date' => '1995-11-08', 'gender' => 'Female', 'address' => '47 Champaca St., Quezon City', 'emergency' => ['name' => 'George Bautista', 'relation' => 'Father', 'phone' => '0918 765 4018'], 'manager' => 'Kevin Reyes', 'salary' => 40000, 'leave_balance' => 9, 'trainings' => 3],
            ['id' => 19, 'no' => 'EMP-0019', 'name' => 'Leo Domingo', 'department' => 'Marketing', 'position' => 'Graphic Designer', 'status' => 'Probationary', 'email' => 'leo.domingo@company.com', 'phone' => '0917 123 4019', 'hire_date' => '2026-07-20', 'birth_date' => '1998-01-30', 'gender' => 'Male', 'address' => '12 Yakal St., Makati', 'emergency' => ['name' => 'Fe Domingo', 'relation' => 'Mother', 'phone' => '0918 765 4019'], 'manager' => 'Kevin Reyes', 'salary' => 34000, 'leave_balance' => 4, 'trainings' => 1],
            ['id' => 20, 'no' => 'EMP-0020', 'name' => 'Teresa Ramos', 'department' => 'Customer Support', 'position' => 'Support Lead', 'status' => 'Active', 'email' => 'teresa.ramos@company.com', 'phone' => '0917 123 4020', 'hire_date' => '2021-04-19', 'birth_date' => '1993-07-16', 'gender' => 'Female', 'address' => '220 Narra Ave., Las Piñas', 'emergency' => ['name' => 'Julio Ramos', 'relation' => 'Husband', 'phone' => '0918 765 4020'], 'manager' => 'Grace Aquino', 'salary' => 45000, 'leave_balance' => 10, 'trainings' => 4],
            ['id' => 21, 'no' => 'EMP-0021', 'name' => 'Ben Ocampo', 'department' => 'Customer Support', 'position' => 'Support Agent', 'status' => 'Active', 'email' => 'ben.ocampo@company.com', 'phone' => '0917 123 4021', 'hire_date' => '2023-10-02', 'birth_date' => '1996-05-24', 'gender' => 'Male', 'address' => '61 Banyan St., Parañaque', 'emergency' => ['name' => 'Pilar Ocampo', 'relation' => 'Mother', 'phone' => '0918 765 4021'], 'manager' => 'Teresa Ramos', 'salary' => 28000, 'leave_balance' => 6, 'trainings' => 2],
            ['id' => 22, 'no' => 'EMP-0022', 'name' => 'Jenny Flores', 'department' => 'Customer Support', 'position' => 'Support Agent', 'status' => 'Probationary', 'email' => 'jenny.flores@company.com', 'phone' => '0917 123 4022', 'hire_date' => '2026-08-05', 'birth_date' => '2000-02-11', 'gender' => 'Female', 'address' => '18 Acacia St., Bacoor', 'emergency' => ['name' => 'Bert Flores', 'relation' => 'Father', 'phone' => '0918 765 4022'], 'manager' => 'Teresa Ramos', 'salary' => 26000, 'leave_balance' => 3, 'trainings' => 0],
            ['id' => 23, 'no' => 'EMP-0023', 'name' => 'Carlo Villanueva', 'department' => 'Information Technology', 'position' => 'Network Engineer', 'status' => 'Active', 'email' => 'carlo.villanueva@company.com', 'phone' => '0917 123 4023', 'hire_date' => '2020-12-07', 'birth_date' => '1992-03-18', 'gender' => 'Male', 'address' => '96 Pine St., Baguio', 'emergency' => ['name' => 'Gina Villanueva', 'relation' => 'Sister', 'phone' => '0918 765 4023'], 'manager' => 'Miguel Torres', 'salary' => 55000, 'leave_balance' => 9, 'trainings' => 4],
            ['id' => 24, 'no' => 'EMP-0024', 'name' => 'Bea Castillo', 'department' => 'Information Technology', 'position' => 'QA Tester', 'status' => 'Active', 'email' => 'bea.castillo@company.com', 'phone' => '0917 123 4024', 'hire_date' => '2022-08-15', 'birth_date' => '1997-06-02', 'gender' => 'Female', 'address' => '74 Molave St., Marikina', 'emergency' => ['name' => 'Rey Castillo', 'relation' => 'Father', 'phone' => '0918 765 4024'], 'manager' => 'Miguel Torres', 'salary' => 38000, 'leave_balance' => 8, 'trainings' => 2],
            ['id' => 25, 'no' => 'EMP-0025', 'name' => 'Eric Manalo', 'department' => 'Information Technology', 'position' => 'DevOps Engineer', 'status' => 'Active', 'email' => 'eric.manalo@company.com', 'phone' => '0917 123 4025', 'hire_date' => '2021-05-31', 'birth_date' => '1994-09-27', 'gender' => 'Male', 'address' => '25 Banaba St., Cainta', 'emergency' => ['name' => 'Lito Manalo', 'relation' => 'Father', 'phone' => '0918 765 4025'], 'manager' => 'Miguel Torres', 'salary' => 60000, 'leave_balance' => 9, 'trainings' => 5],
            ['id' => 26, 'no' => 'EMP-0026', 'name' => 'Olive Santiago', 'department' => 'Operations', 'position' => 'Operations Manager', 'status' => 'Active', 'email' => 'olive.santiago@company.com', 'phone' => '0917 123 4026', 'hire_date' => '2018-10-08', 'birth_date' => '1988-12-05', 'gender' => 'Female', 'address' => '130 Mahogany St., Quezon City', 'emergency' => ['name' => 'Sam Santiago', 'relation' => 'Husband', 'phone' => '0918 765 4026'], 'manager' => 'Grace Aquino', 'salary' => 72000, 'leave_balance' => 13, 'trainings' => 6],
            ['id' => 27, 'no' => 'EMP-0027', 'name' => 'Tom Aguilar', 'department' => 'Operations', 'position' => 'Warehouse Supervisor', 'status' => 'Active', 'email' => 'tom.aguilar@company.com', 'phone' => '0917 123 4027', 'hire_date' => '2020-02-24', 'birth_date' => '1990-08-08', 'gender' => 'Male', 'address' => '5 Eucalyptus St., Valenzuela', 'emergency' => ['name' => 'Mila Aguilar', 'relation' => 'Wife', 'phone' => '0918 765 4027'], 'manager' => 'Olive Santiago', 'salary' => 39000, 'leave_balance' => 10, 'trainings' => 3],
            ['id' => 28, 'no' => 'EMP-0028', 'name' => 'Iris Marquez', 'department' => 'Legal & Compliance', 'position' => 'Legal Associate', 'status' => 'Active', 'email' => 'iris.marquez@company.com', 'phone' => '0917 123 4028', 'hire_date' => '2023-03-20', 'birth_date' => '1995-10-09', 'gender' => 'Female', 'address' => '53 Laurel St., San Juan', 'emergency' => ['name' => 'Cesar Marquez', 'relation' => 'Father', 'phone' => '0918 765 4028'], 'manager' => 'Ramon Villanueva', 'salary' => 50000, 'leave_balance' => 7, 'trainings' => 3],
            ['id' => 29, 'no' => 'EMP-0029', 'name' => 'Ryan Dizon', 'department' => 'Executive Office', 'position' => 'Executive Assistant', 'status' => 'Active', 'email' => 'ryan.dizon@company.com', 'phone' => '0917 123 4029', 'hire_date' => '2022-07-11', 'birth_date' => '1996-04-14', 'gender' => 'Male', 'address' => '39 Firetree St., Mandaluyong', 'emergency' => ['name' => 'Aida Dizon', 'relation' => 'Mother', 'phone' => '0918 765 4029'], 'manager' => 'Grace Aquino', 'salary' => 37000, 'leave_balance' => 8, 'trainings' => 2],
            ['id' => 30, 'no' => 'EMP-0030', 'name' => 'Sam Yap', 'department' => 'Information Technology', 'position' => 'Data Analyst', 'status' => 'Probationary', 'email' => 'sam.yap@company.com', 'phone' => '0917 123 4030', 'hire_date' => '2026-07-27', 'birth_date' => '1999-12-01', 'gender' => 'Male', 'address' => '88 Alimango St., Pasig', 'emergency' => ['name' => 'Helen Yap', 'relation' => 'Mother', 'phone' => '0918 765 4030'], 'manager' => 'Miguel Torres', 'salary' => 36000, 'leave_balance' => 4, 'trainings' => 1],
        ];
    }

    /**
     * Employment type per employee (Module 1 dashboard).
     *
     * Kept separate from the employee records so the master records stay
     * focused on identity; the dashboard groups headcount by type.
     */
    public static function employmentTypes(): array
    {
        return [
            1 => 'Regular', 2 => 'Regular', 3 => 'Regular', 4 => 'Regular', 5 => 'Regular',
            6 => 'Regular', 7 => 'Regular', 8 => 'Regular', 9 => 'Regular', 10 => 'Probationary',
            11 => 'Regular', 12 => 'Regular', 13 => 'Regular', 14 => 'Regular', 15 => 'Contractual',
            16 => 'Contractual', 17 => 'Regular', 18 => 'Regular', 19 => 'Probationary', 20 => 'Regular',
            21 => 'Contractual', 22 => 'Probationary', 23 => 'Regular', 24 => 'Contractual', 25 => 'Regular',
            26 => 'Regular', 27 => 'Contractual', 28 => 'Regular', 29 => 'Regular', 30 => 'Probationary',
        ];
    }

    /** Today's attendance (Module 3). One record per employee. */
    public static function attendance(): array
    {
        $statuses = [
            'Present', 'Present', 'Present', 'Late', 'On Leave', 'Present',
            'Present', 'Absent', 'Present', 'Present', 'Present', 'Late',
            'On Leave', 'Present', 'Present', 'Not Yet In', 'Present', 'Present',
            'Present', 'Late', 'Present', 'Not Yet In', 'Present', 'Present',
            'Present', 'Present', 'Absent', 'On Leave', 'Present', 'Late',
        ];

        return array_map(fn ($i, $status) => [
            'employee_id' => $i + 1,
            'time_in' => match ($status) {
                'Present' => '08:0'.($i % 5),
                'Late' => '08:3'.($i % 4),
                default => null,
            },
            'time_out' => match ($status) {
                'Present', 'Late' => '17:0'.($i % 6),
                default => null,
            },
            'status' => $status,
        ], array_keys($statuses), $statuses);
    }

    /** Hours worked this week per employee (feeds Payroll in a real system). */
    public static function weeklyHours(): array
    {
        $hours = [];

        foreach (self::employees() as $employee) {
            $attendance = collect(self::attendance())->firstWhere('employee_id', $employee['id']);
            $working = in_array($attendance['status'], ['Present', 'Late'], true);

            $hours[$employee['id']] = $working
                ? 40 - ($employee['id'] % 5) * 1.5
                : 40 - ($employee['id'] % 5) * 1.5 - 8;
        }

        return $hours;
    }

    /**
     * Job vacancies (Module 2 - Recruitment).
     *
     * Each vacancy carries a manually-prepared hiring document (the file the
     * recruiter wrote in their document app: header, qualifications and
     * requirements) — attachments are stored by file name only, matching the
     * demo's "nothing is uploaded" rule.
     */
    public static function openJobs(): array
    {
        return [
            ['id' => 1, 'title' => 'Software Engineer', 'position' => 'Software Engineer', 'department' => 'Information Technology', 'openings' => 2, 'applicants' => 18, 'shortlisted' => 6, 'hired' => 1, 'posted' => '2026-07-14', 'employment_type' => 'Regular', 'salary' => '₱45,000 – ₱60,000', 'status' => 'Open', 'attachment' => 'Software_Engineer_Hiring_Notice.pdf'],
            ['id' => 2, 'title' => 'Sales Representative', 'position' => 'Sales Representative', 'department' => 'Sales', 'openings' => 3, 'applicants' => 24, 'shortlisted' => 9, 'hired' => 2, 'posted' => '2026-07-02', 'employment_type' => 'Contractual', 'salary' => '₱22,000 – ₱30,000', 'status' => 'Open', 'attachment' => 'Sales_Rep_Hiring_Notice.pdf'],
            ['id' => 3, 'title' => 'HR Associate', 'position' => 'HR Associate', 'department' => 'Human Resources', 'openings' => 1, 'applicants' => 31, 'shortlisted' => 10, 'hired' => 1, 'posted' => '2026-06-28', 'employment_type' => 'Regular', 'salary' => '₱28,000 – ₱35,000', 'status' => 'On Hold', 'attachment' => 'HR_Associate_Hiring_Notice.pdf'],
            ['id' => 4, 'title' => 'Customer Support Agent', 'position' => 'Support Agent', 'department' => 'Customer Support', 'openings' => 4, 'applicants' => 19, 'shortlisted' => 7, 'hired' => 1, 'posted' => '2026-07-21', 'employment_type' => 'Contractual', 'salary' => '₱18,000 – ₱24,000', 'status' => 'Open', 'attachment' => 'CS_Agent_Hiring_Notice.pdf'],
            ['id' => 5, 'title' => 'Accountant', 'position' => 'Accountant', 'department' => 'Finance', 'openings' => 1, 'applicants' => 14, 'shortlisted' => 4, 'hired' => 0, 'posted' => '2026-08-01', 'employment_type' => 'Regular', 'salary' => '₱38,000 – ₱48,000', 'status' => 'Open', 'attachment' => 'Accountant_Hiring_Notice.pdf'],
            ['id' => 6, 'title' => 'QA Tester', 'position' => 'QA Tester', 'department' => 'Information Technology', 'openings' => 1, 'applicants' => 9, 'shortlisted' => 3, 'hired' => 0, 'posted' => '2026-08-04', 'employment_type' => 'Probationary', 'salary' => '₱25,000 – ₱32,000', 'status' => 'Open', 'attachment' => 'QA_Tester_Hiring_Notice.pdf'],
        ];
    }

    /**
     * Applicants in the hiring pipeline (Module 2).
     *
     * Stages are: Applied -> Shortlisted -> Interview -> Hired. Each applicant
     * belongs to a vacancy via vacancy_id. "Hired this month" uses the
     * hire date, not the application date.
     */
    public static function candidates(): array
    {
        return [
            ['id' => 1, 'name' => 'Aaron Lim', 'vacancy_id' => 1, 'job' => 'Software Engineer', 'stage' => 'Applied', 'applied_on' => '2026-08-11', 'hired_on' => null, 'interview_on' => null, 'attachment' => 'Aaron_Lim_Application_Form.pdf', 'phone' => '0917 111 2201', 'email' => 'aaron.lim@mail.com'],
            ['id' => 2, 'name' => 'Bianca Uy', 'vacancy_id' => 1, 'job' => 'Software Engineer', 'stage' => 'Shortlisted', 'applied_on' => '2026-08-09', 'hired_on' => null, 'interview_on' => null, 'attachment' => 'Bianca_Uy_Resume.pdf', 'phone' => '0917 111 2202', 'email' => 'bianca.uy@mail.com'],
            ['id' => 3, 'name' => 'Christian Tan', 'vacancy_id' => 1, 'job' => 'Software Engineer', 'stage' => 'Interview', 'applied_on' => '2026-08-05', 'hired_on' => null, 'interview_on' => '2026-08-14 10:00', 'attachment' => 'Christian_Tan_Application_Form.pdf', 'phone' => '0917 111 2203', 'email' => 'christian.tan@mail.com'],
            ['id' => 4, 'name' => 'Dana Yu', 'vacancy_id' => 1, 'job' => 'Software Engineer', 'stage' => 'Hired', 'applied_on' => '2026-08-01', 'hired_on' => '2026-08-12', 'interview_on' => null, 'attachment' => 'Dana_Yu_Resume.pdf', 'phone' => '0917 111 2204', 'email' => 'dana.yu@mail.com'],
            ['id' => 5, 'name' => 'Erika Sison', 'vacancy_id' => 2, 'job' => 'Sales Representative', 'stage' => 'Applied', 'applied_on' => '2026-08-10', 'hired_on' => null, 'interview_on' => null, 'attachment' => 'Erika_Sison_Application_Form.pdf', 'phone' => '0917 111 2205', 'email' => 'erika.sison@mail.com'],
            ['id' => 6, 'name' => 'Francis Go', 'vacancy_id' => 2, 'job' => 'Sales Representative', 'stage' => 'Shortlisted', 'applied_on' => '2026-08-08', 'hired_on' => null, 'interview_on' => null, 'attachment' => 'Francis_Go_Resume.pdf', 'phone' => '0917 111 2206', 'email' => 'francis.go@mail.com'],
            ['id' => 7, 'name' => 'Gina Ong', 'vacancy_id' => 2, 'job' => 'Sales Representative', 'stage' => 'Interview', 'applied_on' => '2026-08-04', 'hired_on' => null, 'interview_on' => '2026-08-13 14:00', 'attachment' => 'Gina_Ong_Application_Form.pdf', 'phone' => '0917 111 2207', 'email' => 'gina.ong@mail.com'],
            ['id' => 8, 'name' => 'Henry Chua', 'vacancy_id' => 2, 'job' => 'Sales Representative', 'stage' => 'Hired', 'applied_on' => '2026-07-30', 'hired_on' => '2026-08-07', 'interview_on' => null, 'attachment' => 'Henry_Chua_Resume.pdf', 'phone' => '0917 111 2208', 'email' => 'henry.chua@mail.com'],
            ['id' => 9, 'name' => 'Isabel Lao', 'vacancy_id' => 3, 'job' => 'HR Associate', 'stage' => 'Shortlisted', 'applied_on' => '2026-08-07', 'hired_on' => null, 'interview_on' => null, 'attachment' => 'Isabel_Lao_Application_Form.pdf', 'phone' => '0917 111 2209', 'email' => 'isabel.lao@mail.com'],
            ['id' => 10, 'name' => 'Jason Co', 'vacancy_id' => 3, 'job' => 'HR Associate', 'stage' => 'Interview', 'applied_on' => '2026-08-02', 'hired_on' => null, 'interview_on' => '2026-08-15 09:30', 'attachment' => 'Jason_Co_Resume.pdf', 'phone' => '0917 111 2210', 'email' => 'jason.co@mail.com'],
            ['id' => 11, 'name' => 'Karen Sy', 'vacancy_id' => 3, 'job' => 'HR Associate', 'stage' => 'Hired', 'applied_on' => '2026-07-28', 'hired_on' => '2026-08-03', 'interview_on' => null, 'attachment' => 'Karen_Sy_Application_Form.pdf', 'phone' => '0917 111 2211', 'email' => 'karen.sy@mail.com'],
            ['id' => 12, 'name' => 'Leo Quinto', 'vacancy_id' => 4, 'job' => 'Customer Support Agent', 'stage' => 'Applied', 'applied_on' => '2026-08-11', 'hired_on' => null, 'interview_on' => null, 'attachment' => 'Leo_Quinto_Resume.pdf', 'phone' => '0917 111 2212', 'email' => 'leo.quinto@mail.com'],
            ['id' => 13, 'name' => 'Mia Pineda', 'vacancy_id' => 4, 'job' => 'Customer Support Agent', 'stage' => 'Shortlisted', 'applied_on' => '2026-08-09', 'hired_on' => null, 'interview_on' => null, 'attachment' => 'Mia_Pineda_Application_Form.pdf', 'phone' => '0917 111 2213', 'email' => 'mia.pineda@mail.com'],
            ['id' => 14, 'name' => 'Nico Beltran', 'vacancy_id' => 4, 'job' => 'Customer Support Agent', 'stage' => 'Interview', 'applied_on' => '2026-08-06', 'hired_on' => null, 'interview_on' => '2026-08-14 13:00', 'attachment' => 'Nico_Beltran_Resume.pdf', 'phone' => '0917 111 2214', 'email' => 'nico.beltran@mail.com'],
            ['id' => 15, 'name' => 'Olivia Rosales', 'vacancy_id' => 4, 'job' => 'Customer Support Agent', 'stage' => 'Hired', 'applied_on' => '2026-07-25', 'hired_on' => '2026-08-01', 'interview_on' => null, 'attachment' => 'Olivia_Rosales_Application_Form.pdf', 'phone' => '0917 111 2215', 'email' => 'olivia.rosales@mail.com'],
            ['id' => 16, 'name' => 'Paolo Ocampo', 'vacancy_id' => 5, 'job' => 'Accountant', 'stage' => 'Applied', 'applied_on' => '2026-08-08', 'hired_on' => null, 'interview_on' => null, 'attachment' => 'Paolo_Ocampo_Resume.pdf', 'phone' => '0917 111 2216', 'email' => 'paolo.ocampo@mail.com'],
            ['id' => 17, 'name' => 'Queenie Estrada', 'vacancy_id' => 5, 'job' => 'Accountant', 'stage' => 'Shortlisted', 'applied_on' => '2026-08-06', 'hired_on' => null, 'interview_on' => null, 'attachment' => 'Queenie_Estrada_Application_Form.pdf', 'phone' => '0917 111 2217', 'email' => 'queenie.estrada@mail.com'],
            ['id' => 18, 'name' => 'Rafael Samson', 'vacancy_id' => 6, 'job' => 'QA Tester', 'stage' => 'Applied', 'applied_on' => '2026-08-10', 'hired_on' => null, 'interview_on' => null, 'attachment' => 'Rafael_Samson_Resume.pdf', 'phone' => '0917 111 2218', 'email' => 'rafael.samson@mail.com'],
            ['id' => 19, 'name' => 'Sara Villanueva', 'vacancy_id' => 6, 'job' => 'QA Tester', 'stage' => 'Interview', 'applied_on' => '2026-08-07', 'hired_on' => null, 'interview_on' => '2026-08-15 15:00', 'attachment' => 'Sara_Villanueva_Application_Form.pdf', 'phone' => '0917 111 2219', 'email' => 'sara.villanueva@mail.com'],
            ['id' => 20, 'name' => 'Tommy Alcantara', 'vacancy_id' => 1, 'job' => 'Software Engineer', 'stage' => 'Hired', 'applied_on' => '2026-07-22', 'hired_on' => '2026-07-30', 'interview_on' => null, 'attachment' => 'Tommy_Alcantara_Resume.pdf', 'phone' => '0917 111 2220', 'email' => 'tommy.alcantara@mail.com'],
        ];
    }

    /** Onboarding checklists for recent hires (Module 2). */
    public static function onboarding(): array
    {
        return [
            [
                'employee_id' => 10,
                'name' => 'Paolo Garcia',
                'position' => 'Software Engineer',
                'start_date' => '2026-08-03',
                'progress' => 60,
                'tasks' => [
                    ['label' => 'Signed employment contract', 'done' => true],
                    ['label' => 'Company ID and access cards', 'done' => true],
                    ['label' => 'Laptop and accounts set up', 'done' => true],
                    ['label' => 'Orientation with HR', 'done' => true],
                    ['label' => 'Team introduction and buddy', 'done' => false],
                    ['label' => 'First 30-day check-in', 'done' => false],
                ],
            ],
            [
                'employee_id' => 30,
                'name' => 'Sam Yap',
                'position' => 'Data Analyst',
                'start_date' => '2026-07-27',
                'progress' => 80,
                'tasks' => [
                    ['label' => 'Signed employment contract', 'done' => true],
                    ['label' => 'Company ID and access cards', 'done' => true],
                    ['label' => 'Laptop and accounts set up', 'done' => true],
                    ['label' => 'Orientation with HR', 'done' => true],
                    ['label' => 'Team introduction and buddy', 'done' => true],
                    ['label' => 'First 30-day check-in', 'done' => false],
                ],
            ],
        ];
    }

    /** The leave types employees can apply for (Module 4). */
    public static function leaveTypes(): array
    {
        return ['Vacation', 'Sick', 'Emergency', 'Maternity', 'Paternity'];
    }

    /**
     * Leave requests (Module 4).
     *
     * Statuses: Pending -> Approved / Declined. An approved leave marks the
     * employee's day off in Attendance and is settled in Payroll as paid or
     * unpaid leave.
     */
    public static function leaveRequests(): array
    {
        return [
            ['id' => 1, 'employee_id' => 10, 'type' => 'Sick', 'from' => '2026-08-10', 'to' => '2026-08-11', 'days' => 2, 'status' => 'Approved', 'reason' => 'Flu and medical consultation'],
            ['id' => 2, 'employee_id' => 13, 'type' => 'Vacation', 'from' => '2026-08-17', 'to' => '2026-08-21', 'days' => 5, 'status' => 'Pending', 'reason' => 'Family vacation in Baguio'],
            ['id' => 3, 'employee_id' => 15, 'type' => 'Emergency', 'from' => '2026-08-06', 'to' => '2026-08-06', 'days' => 1, 'status' => 'Approved', 'reason' => 'Family emergency'],
            ['id' => 4, 'employee_id' => 21, 'type' => 'Sick', 'from' => '2026-08-12', 'to' => '2026-08-12', 'days' => 1, 'status' => 'Approved', 'reason' => 'Fever and rest'],
            ['id' => 5, 'employee_id' => 28, 'type' => 'Vacation', 'from' => '2026-08-24', 'to' => '2026-08-26', 'days' => 3, 'status' => 'Pending', 'reason' => 'Personal trip'],
            ['id' => 6, 'employee_id' => 3, 'type' => 'Sick', 'from' => '2026-08-13', 'to' => '2026-08-14', 'days' => 2, 'status' => 'Pending', 'reason' => 'Dental appointment'],
            ['id' => 7, 'employee_id' => 7, 'type' => 'Vacation', 'from' => '2026-08-20', 'to' => '2026-08-20', 'days' => 1, 'status' => 'Approved', 'reason' => 'Personal errand'],
            ['id' => 8, 'employee_id' => 16, 'type' => 'Emergency', 'from' => '2026-08-07', 'to' => '2026-08-08', 'days' => 2, 'status' => 'Declined', 'reason' => 'Home emergency'],
            ['id' => 9, 'employee_id' => 23, 'type' => 'Sick', 'from' => '2026-08-05', 'to' => '2026-08-06', 'days' => 2, 'status' => 'Approved', 'reason' => 'Mild dengue recovery'],
            ['id' => 10, 'employee_id' => 30, 'type' => 'Vacation', 'from' => '2026-09-01', 'to' => '2026-09-04', 'days' => 4, 'status' => 'Pending', 'reason' => 'Long weekend trip'],
            ['id' => 11, 'employee_id' => 19, 'type' => 'Paternity', 'from' => '2026-08-25', 'to' => '2026-08-28', 'days' => 4, 'status' => 'Pending', 'reason' => 'Birth of child'],
            ['id' => 12, 'employee_id' => 5, 'type' => 'Maternity', 'from' => '2026-09-07', 'to' => '2026-09-18', 'days' => 10, 'status' => 'Pending', 'reason' => 'Maternity leave'],
        ];
    }

    /**
     * Payroll periods (Module 5). The last three calendar months: past
     * months are Paid, the current month is Pending (mid-run).
     */
    public static function payrollPeriods(): array
    {
        $now = new \DateTimeImmutable();
        $periods = [];

        for ($i = 2; $i >= 0; $i--) {
            $month = $now->modify("-{$i} months");
            $periods[] = [
                'value' => $month->format('Y-m'),
                'label' => $month->format('F Y'),
                'status' => $i === 0 ? 'Pending' : 'Paid',
            ];
        }

        return $periods;
    }

    /**
     * Benefit plans (Module 6). Government plans are statutory contributions
     * (SSS, PhilHealth, Pag-IBIG); company plans are provided benefits and
     * allowances. Contribution amounts are derived per employee in the client
     * engine so they stay in sync with payroll deductions.
     */
    public static function benefitPlans(): array
    {
        return [
            ['id' => 1, 'name' => 'SSS', 'type' => 'Government', 'description' => 'Social Security System — retirement, disability, sickness and death benefits.'],
            ['id' => 2, 'name' => 'PhilHealth', 'type' => 'Government', 'description' => 'National health insurance covering hospitalization and medical care.'],
            ['id' => 3, 'name' => 'Pag-IBIG', 'type' => 'Government', 'description' => 'Home Development Mutual Fund — savings and housing loan fund.'],
            ['id' => 4, 'name' => 'HMO Health Insurance', 'type' => 'Company', 'description' => 'Private health maintenance organization coverage for employees.'],
            ['id' => 5, 'name' => 'Rice Allowance', 'type' => 'Allowance', 'description' => 'Monthly rice allowance provided to regular employees.'],
            ['id' => 6, 'name' => 'Transportation Allowance', 'type' => 'Allowance', 'description' => 'Monthly transportation allowance for commuter employees.'],
        ];
    }

    /**
     * Benefit enrollments (Module 6). Every employee is covered by the
     * statutory government plans; company plans and allowances are assigned
     * deterministically so the demo always shows a plausible, consistent
     * picture across the module.
     */
    public static function benefitEnrollments(): array
    {
        $byName = collect(self::benefitPlans())->keyBy('name');
        $enrollments = [];
        $id = 1;

        foreach (self::employees() as $employee) {
            $eid = $employee['id'];
            $assignments = [
                'SSS' => true,
                'PhilHealth' => true,
                'Pag-IBIG' => true,
                'HMO Health Insurance' => $eid % 5 !== 0,
                'Rice Allowance' => $eid % 3 !== 1,
                'Transportation Allowance' => $eid % 4 !== 2,
            ];

            foreach ($assignments as $name => $assigned) {
                if (! $assigned) {
                    continue;
                }

                $enrollments[] = [
                    'id' => $id++,
                    'employee_id' => $eid,
                    'plan_id' => $byName[$name]['id'],
                    'coverage' => $name === 'HMO Health Insurance' && $eid % 3 === 0
                        ? 'Employee + dependents'
                        : 'Employee',
                    'effective' => '2026-0'.(1 + ($eid % 6)).'-01',
                    'status' => $eid % 11 === 0 ? 'Pending' : 'Enrolled',
                ];
            }
        }

        return $enrollments;
    }

    /**
     * Performance review periods (Module 7). H1 2026 is closed (Finalized);
     * H2 2026 is the current cycle still in progress.
     */
    public static function performancePeriods(): array
    {
        return [
            ['value' => '2026-H1', 'label' => 'H1 2026 (Jan–Jun)', 'status' => 'Finalized'],
            ['value' => '2026-H2', 'label' => 'H2 2026 (Jul–Dec)', 'status' => 'In Progress'],
        ];
    }

    /**
     * Performance reviews (Module 7). Every employee is reviewed in both H1
     * and H2 2026 so past and current cycles are comparable. Ratings are
     * derived deterministically: managers and leads rate higher, and each
     * criterion jitters around the employee's level so reviews feel real.
     * H1 is fully Finalized; H2 is still in progress (Draft / Submitted).
     */
    public static function performanceReviews(): array
    {
        $criteria = ['job_knowledge', 'quality', 'productivity', 'teamwork', 'initiative'];
        $comments = [
            'Consistently delivers high-quality work and supports the team.',
            'Met all targets for the period — dependable and steady.',
            'Shows strong initiative; keep building on this momentum.',
            'Collaborates well and communicates clearly across teams.',
            'Solid period overall with room to grow in a few areas.',
            'Needs coaching on quality and attention to detail.',
            'Great progress this cycle — continue the upward trend.',
            'Reliable and consistent throughout the review period.',
        ];

        $reviews = [];
        $id = 1;

        foreach (self::employees() as $employee) {
            $eid = $employee['id'];
            $position = $employee['position'];
            $isLead = str_contains($position, 'Manager')
                || str_contains($position, 'Chief')
                || str_contains($position, 'Lead')
                || str_contains($position, 'Supervisor')
                || str_contains($position, 'Executive');

            // Base level: leads rate 4, everyone else 2-4, a few stars at 5
            // and a couple of laggards a notch lower so the demo has spread.
            $level = $isLead ? 4 : 2 + ($eid % 3);
            $level = $eid % 11 === 0 ? 5 : $level;
            $level = $eid % 13 === 0 ? max(2, $level - 1) : $level;

            $ratings = [];
            foreach ($criteria as $index => $key) {
                $jitter = (($eid * 7 + $index * 11) % 3) - 1; // -1, 0, +1
                $ratings[$key] = max(1, min(5, $level + $jitter));
            }

            foreach (['2026-H1', '2026-H2'] as $period) {
                $status = $period === '2026-H1'
                    ? 'Finalized'
                    : match (true) {
                        $eid % 9 === 0 => 'Draft',
                        $eid % 7 === 0 => 'Submitted',
                        default => 'Finalized',
                    };

                $reviews[] = [
                    'id' => $id++,
                    'employee_id' => $eid,
                    'period' => $period,
                    'job_knowledge' => $ratings['job_knowledge'],
                    'quality' => $ratings['quality'],
                    'productivity' => $ratings['productivity'],
                    'teamwork' => $ratings['teamwork'],
                    'initiative' => $ratings['initiative'],
                    'status' => $status,
                    'reviewer' => $employee['manager'],
                    'comments' => $comments[$eid % count($comments)],
                ];
            }
        }

        return $reviews;
    }

    /**
     * Performance goals (Module 7). Two goals per employee for the current
     * H2 2026 cycle, picked deterministically from the pool. Progress and due
     * dates vary so the dashboard can show On Track / Behind / At Risk.
     */
    public static function performanceGoals(): array
    {
        $pool = [
            ['title' => 'Complete the annual product certification', 'category' => 'Development'],
            ['title' => 'Improve turnaround time by 20%', 'category' => 'Productivity'],
            ['title' => 'Deliver Q3 project milestones on schedule', 'category' => 'Project'],
            ['title' => 'Attend two industry conferences this cycle', 'category' => 'Development'],
            ['title' => 'Mentor one junior teammate', 'category' => 'Leadership'],
            ['title' => 'Cut error rate in reports by half', 'category' => 'Quality'],
        ];

        $goals = [];
        $id = 1;

        foreach (self::employees() as $employee) {
            $eid = $employee['id'];
            $first = $pool[$eid % count($pool)];
            $second = $pool[($eid + 3) % count($pool)];

            foreach ([$first, $second] as $i => $goal) {
                $progress = ($eid * 13 + $i * 29) % 101;

                $goals[] = [
                    'id' => $id++,
                    'employee_id' => $eid,
                    'title' => $goal['title'],
                    'category' => $goal['category'],
                    'progress' => $progress,
                    'due' => $eid % 2 === 0 ? '2026-11-30' : '2026-12-15',
                    'status' => match (true) {
                        $progress >= 70 => 'On Track',
                        $progress >= 35 => 'Behind',
                        default => 'At Risk',
                    },
                ];
            }
        }

        return $goals;
    }

    /**
     * Training courses (Module 8). The Q3 2026 calendar: courses that
     * already ran (Jul) are past, the current one (Aug 10-14) is running,
     * and the rest are scheduled for later in the quarter. Titles match the
     * Performance module's skill-gap suggestions so the two modules connect.
     */
    public static function trainingCourses(): array
    {
        return [
            ['id' => 1, 'code' => 'TRN-101', 'title' => 'Advanced Job Skills Training', 'category' => 'Development', 'provider' => 'Internal L&D', 'venue' => 'Training Room A', 'start' => '2026-07-06', 'end' => '2026-07-10', 'hours' => 20, 'cost' => 0, 'certificate' => true],
            ['id' => 2, 'code' => 'TRN-102', 'title' => 'Quality Assurance & Attention to Detail', 'category' => 'Quality', 'provider' => 'Internal L&D', 'venue' => 'Training Room B', 'start' => '2026-07-20', 'end' => '2026-07-24', 'hours' => 16, 'cost' => 0, 'certificate' => true],
            ['id' => 3, 'code' => 'TRN-103', 'title' => 'Time Management & Productivity', 'category' => 'Productivity', 'provider' => 'Franklin Covey', 'venue' => 'Zoom', 'start' => '2026-08-03', 'end' => '2026-08-05', 'hours' => 12, 'cost' => 15000, 'certificate' => true],
            ['id' => 4, 'code' => 'TRN-104', 'title' => 'Team Collaboration Workshop', 'category' => 'Leadership', 'provider' => 'Internal L&D', 'venue' => 'Training Room A', 'start' => '2026-08-17', 'end' => '2026-08-18', 'hours' => 8, 'cost' => 0, 'certificate' => false],
            ['id' => 5, 'code' => 'TRN-105', 'title' => 'Leadership & Initiative', 'category' => 'Leadership', 'provider' => 'Dale Carnegie', 'venue' => 'Zoom', 'start' => '2026-08-24', 'end' => '2026-08-28', 'hours' => 20, 'cost' => 25000, 'certificate' => true],
            ['id' => 6, 'code' => 'TRN-106', 'title' => 'Workplace Safety & First Aid', 'category' => 'Compliance', 'provider' => 'DOLE-accredited trainer', 'venue' => 'Training Room B', 'start' => '2026-07-13', 'end' => '2026-07-14', 'hours' => 8, 'cost' => 5000, 'certificate' => true],
            ['id' => 7, 'code' => 'TRN-107', 'title' => 'Data Privacy & Security Awareness', 'category' => 'Compliance', 'provider' => 'Internal L&D', 'venue' => 'Training Room A', 'start' => '2026-09-07', 'end' => '2026-09-08', 'hours' => 8, 'cost' => 0, 'certificate' => true],
            ['id' => 8, 'code' => 'TRN-108', 'title' => 'Customer Service Excellence', 'category' => 'Development', 'provider' => 'Service First', 'venue' => 'Zoom', 'start' => '2026-09-14', 'end' => '2026-09-18', 'hours' => 16, 'cost' => 18000, 'certificate' => true],
            ['id' => 9, 'code' => 'TRN-109', 'title' => 'Excel for Reporting & Analysis', 'category' => 'Technical', 'provider' => 'Internal L&D', 'venue' => 'Computer Lab', 'start' => '2026-08-10', 'end' => '2026-08-14', 'hours' => 20, 'cost' => 0, 'certificate' => true],
        ];
    }

    /**
     * Training enrollments (Module 8). Most employees are enrolled in every
     * course, skipped deterministically so each course has a slightly
     * different headcount. Status follows the calendar: courses that already
     * ended are Completed (with a score and a sequential certificate number),
     * the course running this week is In Progress, and upcoming courses are
     * still Enrolled.
     */
    public static function trainingEnrollments(): array
    {
        $enrollments = [];
        $id = 1;

        foreach (self::trainingCourses() as $course) {
            $cid = $course['id'];

            foreach (self::employees() as $employee) {
                $eid = $employee['id'];

                // Skip deterministically so headcounts vary per course.
                if (($eid * 3 + $cid * 5) % 5 === 4) {
                    continue;
                }

                $status = match (true) {
                    $course['end'] < '2026-08-13' => 'Completed',
                    $course['start'] <= '2026-08-13' => 'In Progress',
                    default => 'Enrolled',
                };

                $enrollments[] = [
                    'id' => $id++,
                    'course_id' => $cid,
                    'employee_id' => $eid,
                    'status' => $status,
                    'score' => $status === 'Completed'
                        ? 60 + ($eid * 7 + $cid * 11) % 41
                        : null,
                    'completed_on' => $status === 'Completed' ? $course['end'] : null,
                    'certificate_no' => null,
                ];
            }
        }

        // Sequential certificate numbers for completed enrollments only, so
        // the certificate register reads like a real issued list.
        $cert = 1;

        foreach ($enrollments as &$enrollment) {
            if ($enrollment['status'] === 'Completed') {
                $enrollment['certificate_no'] = 'CERT-'.str_pad((string) $cert, 4, '0', STR_PAD_LEFT);
                $cert++;
            }
        }
        unset($enrollment);

        return $enrollments;
    }

    /**
     * Disciplinary records (Module 9). A mix of warnings and incidents,
     * generated deterministically: most employees have a clean record, some
     * have one case, and a few repeat offenders carry two — the second one
     * escalated to Separation & Offboarding. Older cases are Resolved;
     * recent ones are still Logged or Under Review.
     */
    public static function disciplinaryRecords(): array
    {
        $pool = [
            ['type' => 'Warning', 'category' => 'Tardiness', 'severity' => 'Minor', 'action' => 'Verbal warning', 'description' => 'Arrived late without prior notice.'],
            ['type' => 'Warning', 'category' => 'Absenteeism', 'severity' => 'Minor', 'action' => 'Verbal warning', 'description' => 'Missed a scheduled shift without prior approval.'],
            ['type' => 'Incident', 'category' => 'Policy Violation', 'severity' => 'Moderate', 'action' => 'Written warning', 'description' => 'Used personal devices during work hours despite repeated reminders.'],
            ['type' => 'Incident', 'category' => 'Misconduct', 'severity' => 'Moderate', 'action' => 'Counseling session', 'description' => 'Inappropriate remarks during a team meeting.'],
            ['type' => 'Incident', 'category' => 'Negligence', 'severity' => 'Serious', 'action' => 'Final written warning', 'description' => 'Missed a client deadline due to unsubmitted work.'],
            ['type' => 'Incident', 'category' => 'Insubordination', 'severity' => 'Serious', 'action' => 'Suspension (3 days)', 'description' => 'Refused a direct instruction from the supervisor.'],
            ['type' => 'Incident', 'category' => 'Harassment', 'severity' => 'Serious', 'action' => 'Investigation', 'description' => 'Complaint filed regarding inappropriate behavior.'],
        ];

        $records = [];
        $id = 1;

        foreach (self::employees() as $employee) {
            $eid = $employee['id'];

            // Deterministic: who has a record at all — some one case each,
            // and the id % 7 group is the repeat offenders with two.
            $repeat = $eid % 7 === 0;
            $single = $eid % 4 === 0 || $eid % 5 === 0;

            if (! $repeat && ! $single) {
                continue;
            }

            for ($i = 0; $i < ($repeat ? 2 : 1); $i++) {
                $item = $pool[($eid * 3 + $i * 5) % count($pool)];
                $date = ($i === 0 ? '2026-07-' : '2026-08-').str_pad((string) (1 + $eid % 28), 2, '0', STR_PAD_LEFT);
                $isEscalated = $i === 1 && $item['severity'] === 'Serious';

                $records[] = [
                    'id' => $id++,
                    'employee_id' => $eid,
                    'type' => $item['type'],
                    'severity' => $item['severity'],
                    'category' => $item['category'],
                    'date' => $date,
                    'description' => $item['description'],
                    'action' => $item['action'],
                    'status' => match (true) {
                        $isEscalated => 'Escalated',
                        $date >= '2026-08-01' && $eid % 3 === 0 => 'Under Review',
                        $date >= '2026-08-01' => 'Logged',
                        default => 'Resolved',
                    },
                ];
            }
        }

        return $records;
    }

    /** All 10 modules. Status is 'available' for the ones already built. */
    public static function modules(): array
    {
        return [
            ['slug' => 'employees', 'name' => 'Employee Information Management', 'short' => 'Employee Records', 'status' => 'available', 'description' => 'The 201 file for every person — personal data, employment records, and document management all in one place.', 'features' => ['Employee list with search and filters', 'Full employee profile with tabs', 'Add new employees', 'Emergency contact details']],
            ['slug' => 'recruitment', 'name' => 'Recruitment & Onboarding', 'short' => 'Recruitment', 'status' => 'available', 'description' => 'Job postings, applicant tracking, and onboarding checklists — from hiring to the first day.', 'features' => ['Open positions board', 'Candidate pipeline: Applied → Hired', 'Move candidates between steps', 'Onboarding checklists']],
            ['slug' => 'attendance', 'name' => 'Time & Attendance', 'short' => 'Time & Attendance', 'status' => 'available', 'description' => 'DTR monitoring with biometric clock-in, plus tardiness and absence tracking — the hours that feed payroll.', 'features' => ['Daily attendance roster', 'Demo clock in / clock out', 'Late, absent and on-leave tracking', 'Weekly hours summary for payroll']],
            ['slug' => 'leave', 'name' => 'Leave Management', 'short' => 'Leave', 'status' => 'available', 'description' => 'Request, approve, and track leave. Employees apply for vacation, sick, or emergency leave and managers approve it in a few clicks.', 'features' => ['Leave requests and approvals', 'Leave balances per employee', 'Auto-sync with attendance', 'Paid / unpaid leave for payroll']],
            ['slug' => 'payroll', 'name' => 'Payroll Management', 'short' => 'Payroll', 'status' => 'available', 'description' => 'Turn attendance hours, leave days, and benefits into a correct monthly payslip, every single time.', 'features' => ['Monthly payroll run', 'Payslips for every employee', 'Pulls hours from attendance', 'Deductions from leave and benefits']],
            ['slug' => 'benefits', 'name' => 'Benefits Administration', 'short' => 'Benefits', 'status' => 'available', 'description' => 'Manage health plans, allowances, and other perks — enroll employees and send the right deductions to payroll.', 'features' => ['Benefit plans and enrollment', 'Allowance tracking', 'Deductions sent to payroll', 'Government contributions summary']],
            ['slug' => 'performance', 'name' => 'Performance Management', 'short' => 'Performance', 'status' => 'available', 'description' => 'Set goals, review progress, and record ratings. Performance results guide raises and training needs.', 'features' => ['Goals and reviews', 'Performance ratings', 'Raise recommendations for payroll', 'Skill gaps for training']],
            ['slug' => 'training', 'name' => 'Training & Development', 'short' => 'Training', 'status' => 'available', 'description' => 'Plan courses and track who has completed them. Completed trainings are recorded on each employee profile.', 'features' => ['Training calendar', 'Course enrollments', 'Certificates on employee records', 'Training history per employee']],
            ['slug' => 'disciplinary', 'name' => 'Disciplinary Management', 'short' => 'Disciplinary', 'status' => 'available', 'description' => 'Record warnings and incidents fairly. Repeat issues flag into offboarding when needed.', 'features' => ['Incident and warning log', 'Tracks repeated tardiness', 'Escalation to offboarding', 'Fair and consistent records']],
            ['slug' => 'offboarding', 'name' => 'Separation & Offboarding', 'short' => 'Offboarding', 'status' => 'soon', 'description' => 'A smooth goodbye — clearance tasks, final pay, and safe archiving of employee records.', 'features' => ['Exit checklist and clearance', 'Resignation and termination tracking', 'Final pay calculation with payroll', 'Records archived safely']],
        ];
    }

    /**
     * How each module talks to the others — the interconnection map.
     *
     * This encodes the system-wide data flow exactly:
     *   1  Employee Information Management = the CENTRAL CORE every module
     *      reads from and writes to (single source of truth for an employee).
     *   2  Recruitment & Onboarding        = INBOUND — hired candidates
     *      become employee records.
     *   3-8 Time & Attendance / Leave / Payroll / Benefits / Performance /
     *      Training                       = OPERATIONAL ENGINES running off
     *      the core (3→5, 4→5, 6→5 hours & leave & deductions into payroll;
     *      7→8 performance gaps into training).
     *   9  Disciplinary Management        = OUTBOUND — incidents written back
     *      against records; sanctions feed payroll; serious cases feed 10.
     *   10 Separation & Offboarding       = the terminal stage: closes and
     *      archives the core record and settles final pay.
     */
    public static function moduleLinks(string $slug): array
    {
        $map = [
            // 1 — Central core profile: every module reads from and writes to it.
            'employees' => [
                'receives' => [
                    ['module' => 'Recruitment', 'note' => 'Hired candidates arrive as new employees (inbound)'],
                    ['module' => 'Attendance', 'note' => 'Daily status and hours update the record'],
                    ['module' => 'Training', 'note' => 'Completed courses and certificates are added'],
                    ['module' => 'Performance', 'note' => 'Ratings and reviews are kept on the record'],
                    ['module' => 'Disciplinary', 'note' => 'Warnings and incidents are recorded'],
                ],
                'sends' => [
                    ['module' => 'Recruitment', 'note' => 'Department manpower requests for new hires'],
                    ['module' => 'Attendance', 'note' => 'Roster of who to track each day'],
                    ['module' => 'Leave', 'note' => 'Leave balances are seeded per employee'],
                    ['module' => 'Payroll', 'note' => 'Salary, position, and bank details for payslips'],
                    ['module' => 'Benefits', 'note' => 'Eligibility and enrollment data'],
                    ['module' => 'Performance', 'note' => 'Who gets reviewed and rated'],
                    ['module' => 'Training', 'note' => 'Who gets enrolled in courses'],
                    ['module' => 'Disciplinary', 'note' => 'Records reviewed for incidents (outbound)'],
                    ['module' => 'Offboarding', 'note' => 'Records used for separation and archiving'],
                ],
            ],
            // 2 — Inbound: hiring feeds the central core.
            'recruitment' => [
                'receives' => [
                    ['module' => 'Employee Records', 'note' => 'Manpower requests and job openings from departments'],
                ],
                'sends' => [
                    ['module' => 'Employee Records', 'note' => 'Hired candidates become employee records'],
                    ['module' => 'Onboarding', 'note' => 'New hires get onboarding checklists'],
                ],
            ],
            // 3 — Operational engine: hours feed payroll; tardiness flagged.
            'attendance' => [
                'receives' => [
                    ['module' => 'Employee Records', 'note' => 'Who needs to be tracked each day'],
                    ['module' => 'Leave', 'note' => 'On-leave employees are marked automatically'],
                ],
                'sends' => [
                    ['module' => 'Payroll', 'note' => 'Hours worked go straight to payslips'],
                    ['module' => 'Disciplinary', 'note' => 'Repeated tardiness is flagged'],
                ],
            ],
            // 4 — Operational engine: approved leave marks days off and hits payroll.
            'leave' => [
                'receives' => [
                    ['module' => 'Employee Records', 'note' => 'Leave balances per employee'],
                    ['module' => 'Attendance', 'note' => 'Absences can turn into leave days'],
                ],
                'sends' => [
                    ['module' => 'Attendance', 'note' => 'Approved leave marks the day off'],
                    ['module' => 'Payroll', 'note' => 'Paid and unpaid leave days are settled'],
                ],
            ],
            // 5 — Operational engine: the pay engine aggregates hours, leave, and deductions.
            'payroll' => [
                'receives' => [
                    ['module' => 'Attendance', 'note' => 'Hours worked this pay period'],
                    ['module' => 'Leave', 'note' => 'Paid and unpaid leave days'],
                    ['module' => 'Benefits', 'note' => 'Deductions and contributions'],
                    ['module' => 'Disciplinary', 'note' => 'Suspension days and salary sanctions'],
                    ['module' => 'Employee Records', 'note' => 'Salary and bank details'],
                ],
                'sends' => [
                    ['module' => 'Benefits', 'note' => 'Payroll-based contributions'],
                    ['module' => 'Performance', 'note' => 'Merit increases applied to pay'],
                ],
            ],
            // 6 — Operational engine: enrollments become payroll deductions.
            'benefits' => [
                'receives' => [
                    ['module' => 'Employee Records', 'note' => 'Who is enrolled and eligible'],
                    ['module' => 'Payroll', 'note' => 'Contribution amounts per pay'],
                ],
                'sends' => [
                    ['module' => 'Payroll', 'note' => 'Deductions are added to payslips'],
                ],
            ],
            // 7 — Operational engine: gaps become training; ratings guide raises.
            'performance' => [
                'receives' => [
                    ['module' => 'Employee Records', 'note' => 'Employees to be reviewed'],
                    ['module' => 'Training', 'note' => 'New skills shown on reviews'],
                    ['module' => 'Disciplinary', 'note' => 'Incidents affect review ratings'],
                ],
                'sends' => [
                    ['module' => 'Training', 'note' => 'Skill gaps become training plans'],
                    ['module' => 'Payroll', 'note' => 'Raises based on performance'],
                ],
            ],
            // 8 — Operational engine: completed courses write back to the record.
            'training' => [
                'receives' => [
                    ['module' => 'Performance', 'note' => 'Skill gaps turn into courses'],
                    ['module' => 'Employee Records', 'note' => 'Who should be enrolled'],
                ],
                'sends' => [
                    ['module' => 'Employee Records', 'note' => 'Certificates added to profiles'],
                    ['module' => 'Performance', 'note' => 'Completed skills shown on reviews'],
                ],
            ],
            // 9 — Outbound: incidents are written back against records.
            'disciplinary' => [
                'receives' => [
                    ['module' => 'Attendance', 'note' => 'Repeated tardiness flags'],
                    ['module' => 'Employee Records', 'note' => 'Records reviewed for warnings'],
                ],
                'sends' => [
                    ['module' => 'Employee Records', 'note' => 'Warnings and incidents recorded on file'],
                    ['module' => 'Payroll', 'note' => 'Suspension days deducted from pay'],
                    ['module' => 'Performance', 'note' => 'Incidents affect reviews'],
                    ['module' => 'Offboarding', 'note' => 'Serious cases may end employment'],
                ],
            ],
            // 10 — Terminal stage: close the record, settle final pay, archive.
            'offboarding' => [
                'receives' => [
                    ['module' => 'Employee Records', 'note' => 'Records to be closed and archived'],
                    ['module' => 'Disciplinary', 'note' => 'Termination cases'],
                    ['module' => 'Leave', 'note' => 'Outstanding leave to be settled'],
                ],
                'sends' => [
                    ['module' => 'Payroll', 'note' => 'Final pay and clearance computation'],
                    ['module' => 'Employee Records', 'note' => 'Records archived safely after separation'],
                ],
            ],
        ];

        return $map[$slug] ?? ['receives' => [], 'sends' => []];
    }

    /** Sample documents on file (Module 1 - document management). */
    public static function documentsFor(int $employeeId): array
    {
        $pool = [
            ['name' => '201 file', 'type' => 'HR record', 'status' => 'On file'],
            ['name' => 'Employment contract', 'type' => 'Legal', 'status' => 'Signed'],
            ['name' => 'SSS / PhilHealth / Pag-IBIG forms', 'type' => 'Government', 'status' => 'On file'],
            ['name' => 'TIN (BIR) registration', 'type' => 'Government', 'status' => 'On file'],
            ['name' => 'NBI clearance', 'type' => 'Government', 'status' => 'Current'],
            ['name' => 'Company ID', 'type' => 'HR record', 'status' => 'Active'],
            ['name' => 'Monthly payslips', 'type' => 'Finance', 'status' => 'Generated'],
        ];

        $count = 4 + ($employeeId % 4);

        return collect($pool)->take($count)->values()->all();
    }

    /**
     * Whether the employee's 201 file has the key documents on file.
     * A file missing several documents is flagged as incomplete.
     */
    public static function is201Complete(int $employeeId): bool
    {
        return count(self::documentsFor($employeeId)) >= 6;
    }

    /** Shared training pool used on the employee detail page. */
    public static function trainingsFor(int $employeeId): array
    {
        $pool = [
            ['title' => 'Workplace Safety Orientation', 'date' => '2026-03-12', 'provider' => 'Internal'],
            ['title' => 'Data Privacy Awareness', 'date' => '2026-04-08', 'provider' => 'Internal'],
            ['title' => 'Leadership Essentials', 'date' => '2026-05-20', 'provider' => 'Online Course'],
            ['title' => 'Customer Service Excellence', 'date' => '2026-02-18', 'provider' => 'Internal'],
            ['title' => 'Financial Literacy for Employees', 'date' => '2026-06-05', 'provider' => 'External'],
            ['title' => 'First Aid & Emergency Response', 'date' => '2026-01-22', 'provider' => 'External'],
            ['title' => 'Communication in the Workplace', 'date' => '2026-04-29', 'provider' => 'Internal'],
            ['title' => 'Time Management Basics', 'date' => '2026-05-08', 'provider' => 'Online Course'],
        ];

        $count = min((int) collect(self::employees())->firstWhere('id', $employeeId)['trainings'], count($pool));

        return collect($pool)->take($count)->values()->all();
    }

    /**
     * Full 201-file record for one employee, shaped like the form state so the
     * print-preview document and the edit form stay consistent.
     */
    public static function recordFor(int $employeeId): array
    {
        $employee = collect(self::employees())->firstWhere('id', $employeeId);

        if (! $employee) {
            return [];
        }

        $pad = str_pad((string) $employeeId, 9, '0', STR_PAD_LEFT);
        $parts = preg_split('/\s+/', $employee['name']) ?: [];
        $lastName = (string) array_pop($parts);
        $firstName = (string) array_shift($parts);
        $middleName = implode(' ', $parts);

        $pool = [
            ['name' => 'Jose Santos', 'relation' => 'Child', 'birth' => '2015-04-12'],
            ['name' => 'Maria Santos', 'relation' => 'Child', 'birth' => '2018-09-03'],
            ['name' => 'Andres Cruz', 'relation' => 'Child', 'birth' => '2012-11-27'],
            ['name' => 'Carmen Dela Cruz', 'relation' => 'Child', 'birth' => '2016-02-19'],
            ['name' => 'Luis Reyes', 'relation' => 'Child', 'birth' => '2014-07-08'],
        ];
        $dependents = collect($pool)->take(1 + $employeeId % 2)->values()->map(fn ($d) => [
            'id' => 'DEP-'.str_pad((string) ($employeeId + array_search($d, $pool, true)), 3, '0', STR_PAD_LEFT),
            'fullName' => $d['name'],
            'relation' => $d['relation'],
            'birthDate' => $d['birth'],
        ])->all();

        $education = [
            ['level' => 'Elementary', 'school' => 'Mabini Elementary School', 'yearGraduated' => (string) (2000 + $employeeId % 5), 'degree' => '', 'skills' => ''],
            ['level' => 'High School', 'school' => 'Quezon City High School', 'yearGraduated' => (string) (2004 + $employeeId % 5), 'degree' => '', 'skills' => ''],
            ['level' => 'College', 'school' => 'University of the Philippines', 'yearGraduated' => (string) (2009 + $employeeId % 5), 'degree' => 'Bachelor of Science in Business Administration', 'skills' => 'Computer literacy, communication'],
        ];

        $employment = [
            ['company' => 'Prime Solutions Inc.', 'position' => 'Staff Associate', 'from' => '2013-01', 'to' => '2016-12'],
            ['company' => 'Metro Trading Corp.', 'position' => 'Senior Associate', 'from' => '2017-02', 'to' => '2020-06'],
        ];
        $employment = collect($employment)->take(1 + $employeeId % 2)->values()->all();

        $characterRefs = [
            ['company' => 'Prime Solutions Inc.', 'position' => 'HR Manager', 'from' => '2013-01', 'to' => '2016-12'],
            ['company' => 'Metro Trading Corp.', 'position' => 'Department Head', 'from' => '2017-02', 'to' => '2020-06'],
        ];

        $trainings = collect(self::trainingsFor($employeeId))->map(fn ($t, $i) => [
            'id' => 'TRN-'.str_pad((string) ($employeeId * 10 + $i + 1), 3, '0', STR_PAD_LEFT),
            'name' => $t['title'],
            'description' => 'Certification course',
            'venue' => $t['provider'],
            'from' => $t['date'],
            'to' => '',
            'certificate' => 'Certificate on file',
        ])->values()->all();

        $licenses = $employeeId % 3 === 0 ? [
            ['id' => 'LIC-'.str_pad((string) $employeeId, 3, '0', STR_PAD_LEFT), 'name' => 'Professional Regulation Commission', 'number' => 'PRC-'.str_pad((string) ($employeeId * 7), 6, '0', STR_PAD_LEFT), 'rating' => 'Passed', 'dateTaken' => '2015-05-20', 'validity' => '2026-05-19'],
        ] : [];

        return [
            'personal' => [
                'photo' => '',
                'lastName' => $lastName,
                'firstName' => $firstName,
                'middleName' => $middleName,
                'suffix' => '',
                'birthDate' => $employee['birth_date'],
                'age' => '',
                'birthplace' => '',
                'gender' => $employee['gender'],
                'civilStatus' => $employeeId % 2 === 0 ? 'Married' : 'Single',
                'citizenship' => 'Filipino',
                'religion' => 'Roman Catholic',
                'height' => '',
                'weight' => '',
                'classification' => '',
                'address' => $employee['address'],
                'zipCode' => '',
                'phone' => $employee['phone'],
                'email' => $employee['email'],
                'dateHired' => $employee['hire_date'],
                'department' => $employee['department'],
                'employmentType' => $employeeId % 3 === 0 ? 'Contractual' : 'Regular',
                'position' => $employee['position'],
                'spouse' => $employee['emergency']['name'],
                'father' => '',
                'mother' => '',
                'emergencyName' => $employee['emergency']['name'],
                'emergencyRelation' => $employee['emergency']['relation'],
                'emergencyPhone' => $employee['emergency']['phone'],
            ],
            'dependents' => $dependents,
            'education' => $education,
            'employment' => $employment,
            'characterRefs' => $characterRefs,
            'trainings' => $trainings,
            'gov' => [
                'darbc' => 'DARBC-'.$pad,
                'biometric' => 'ENR-'.$pad,
                'atm' => 'ATM-'.$pad,
                'tin' => 'TIN-'.$pad,
                'pagibig' => 'PGB-'.$pad,
                'philhealth' => 'PHL-'.$pad,
                'sss' => 'SSS-'.$pad,
            ],
            'residentCert' => [
                'type' => 'Cedula (Community Tax Certificate)',
                'number' => 'CT-'.$pad,
                'issuedAt' => 'Quezon City',
                'issuedOn' => '2026-01-15',
            ],
            'licenses' => $licenses,
        ];
    }

    /** Sample leave history used on the employee detail page. */
    public static function leaveHistoryFor(int $employeeId): array
    {
        $pool = [
            ['type' => 'Vacation Leave', 'from' => '2026-06-15', 'to' => '2026-06-17', 'days' => 3, 'status' => 'Approved'],
            ['type' => 'Sick Leave', 'from' => '2026-07-02', 'to' => '2026-07-02', 'days' => 1, 'status' => 'Approved'],
            ['type' => 'Emergency Leave', 'from' => '2026-07-21', 'to' => '2026-07-21', 'days' => 1, 'status' => 'Pending'],
            ['type' => 'Vacation Leave', 'from' => '2026-08-10', 'to' => '2026-08-12', 'days' => 3, 'status' => 'Pending'],
        ];

        $slice = 1 + ($employeeId % 3);

        return collect($pool)->take($slice)->values()->all();
    }

    /** Sample payslips used on the employee detail page. */
    public static function payslipsFor(int $employeeId): array
    {
        $salary = (int) collect(self::employees())->firstWhere('id', $employeeId)['salary'];

        return [
            ['period' => 'June 2026', 'gross' => $salary, 'net' => (int) round($salary * 0.78), 'status' => 'Paid'],
            ['period' => 'July 2026', 'gross' => $salary, 'net' => (int) round($salary * 0.78), 'status' => 'Paid'],
            ['period' => 'August 2026', 'gross' => $salary, 'net' => (int) round($salary * 0.78), 'status' => 'Pending'],
        ];
    }

    /** Demo performance rating (1-5) for the employee detail page. */
    public static function performanceRating(int $employeeId): float
    {
        return 3.4 + ($employeeId % 5) * 0.3;
    }
}
