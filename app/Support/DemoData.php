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

    /** Open positions (Module 2). */
    public static function openJobs(): array
    {
        return [
            ['id' => 1, 'title' => 'Software Engineer', 'department' => 'Information Technology', 'openings' => 2, 'applicants' => 18, 'posted' => '2026-07-14'],
            ['id' => 2, 'title' => 'Sales Representative', 'department' => 'Sales', 'openings' => 3, 'applicants' => 24, 'posted' => '2026-07-02'],
            ['id' => 3, 'title' => 'HR Associate', 'department' => 'Human Resources', 'openings' => 1, 'applicants' => 31, 'posted' => '2026-06-28'],
            ['id' => 4, 'title' => 'Customer Support Agent', 'department' => 'Customer Support', 'openings' => 4, 'applicants' => 19, 'posted' => '2026-07-21'],
            ['id' => 5, 'title' => 'Accountant', 'department' => 'Finance', 'openings' => 1, 'applicants' => 14, 'posted' => '2026-08-01'],
            ['id' => 6, 'title' => 'QA Tester', 'department' => 'Information Technology', 'openings' => 1, 'applicants' => 9, 'posted' => '2026-08-04'],
        ];
    }

    /** Candidates in the hiring pipeline (Module 2). */
    public static function candidates(): array
    {
        return [
            ['id' => 1, 'name' => 'Aaron Lim', 'job' => 'Software Engineer', 'stage' => 'Applied', 'applied_on' => '2026-08-11'],
            ['id' => 2, 'name' => 'Bianca Uy', 'job' => 'Software Engineer', 'stage' => 'Screening', 'applied_on' => '2026-08-09'],
            ['id' => 3, 'name' => 'Christian Tan', 'job' => 'Software Engineer', 'stage' => 'Interview', 'applied_on' => '2026-08-05'],
            ['id' => 4, 'name' => 'Dana Yu', 'job' => 'Software Engineer', 'stage' => 'Offer', 'applied_on' => '2026-08-01'],
            ['id' => 5, 'name' => 'Erika Sison', 'job' => 'Sales Representative', 'stage' => 'Applied', 'applied_on' => '2026-08-10'],
            ['id' => 6, 'name' => 'Francis Go', 'job' => 'Sales Representative', 'stage' => 'Screening', 'applied_on' => '2026-08-08'],
            ['id' => 7, 'name' => 'Gina Ong', 'job' => 'Sales Representative', 'stage' => 'Interview', 'applied_on' => '2026-08-04'],
            ['id' => 8, 'name' => 'Henry Chua', 'job' => 'Sales Representative', 'stage' => 'Offer', 'applied_on' => '2026-07-30'],
            ['id' => 9, 'name' => 'Isabel Lao', 'job' => 'HR Associate', 'stage' => 'Screening', 'applied_on' => '2026-08-07'],
            ['id' => 10, 'name' => 'Jason Co', 'job' => 'HR Associate', 'stage' => 'Interview', 'applied_on' => '2026-08-02'],
            ['id' => 11, 'name' => 'Karen Sy', 'job' => 'HR Associate', 'stage' => 'Offer', 'applied_on' => '2026-07-28'],
            ['id' => 12, 'name' => 'Leo Quinto', 'job' => 'Customer Support Agent', 'stage' => 'Applied', 'applied_on' => '2026-08-11'],
            ['id' => 13, 'name' => 'Mia Pineda', 'job' => 'Customer Support Agent', 'stage' => 'Screening', 'applied_on' => '2026-08-09'],
            ['id' => 14, 'name' => 'Nico Beltran', 'job' => 'Customer Support Agent', 'stage' => 'Interview', 'applied_on' => '2026-08-06'],
            ['id' => 15, 'name' => 'Olivia Rosales', 'job' => 'Customer Support Agent', 'stage' => 'Hired', 'applied_on' => '2026-07-25'],
            ['id' => 16, 'name' => 'Paolo Ocampo', 'job' => 'Accountant', 'stage' => 'Applied', 'applied_on' => '2026-08-08'],
            ['id' => 17, 'name' => 'Queenie Estrada', 'job' => 'Accountant', 'stage' => 'Screening', 'applied_on' => '2026-08-06'],
            ['id' => 18, 'name' => 'Rafael Samson', 'job' => 'QA Tester', 'stage' => 'Applied', 'applied_on' => '2026-08-10'],
            ['id' => 19, 'name' => 'Sara Villanueva', 'job' => 'QA Tester', 'stage' => 'Interview', 'applied_on' => '2026-08-07'],
            ['id' => 20, 'name' => 'Tommy Alcantara', 'job' => 'Software Engineer', 'stage' => 'Hired', 'applied_on' => '2026-07-22'],
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

    /** All 10 modules. Status is 'available' for the ones already built. */
    public static function modules(): array
    {
        return [
            ['slug' => 'employees', 'name' => 'Employee Information Management', 'short' => 'Employee Records', 'status' => 'available', 'description' => 'The 201 file for every person — personal data, employment records, and document management all in one place.', 'features' => ['Employee list with search and filters', 'Full employee profile with tabs', 'Add new employees', 'Emergency contact details']],
            ['slug' => 'recruitment', 'name' => 'Recruitment & Onboarding', 'short' => 'Recruitment', 'status' => 'available', 'description' => 'Job postings, applicant tracking, and onboarding checklists — from hiring to the first day.', 'features' => ['Open positions board', 'Candidate pipeline: Applied → Hired', 'Move candidates between steps', 'Onboarding checklists']],
            ['slug' => 'attendance', 'name' => 'Time & Attendance', 'short' => 'Time & Attendance', 'status' => 'available', 'description' => 'DTR monitoring with biometric clock-in, plus tardiness and absence tracking — the hours that feed payroll.', 'features' => ['Daily attendance roster', 'Demo clock in / clock out', 'Late, absent and on-leave tracking', 'Weekly hours summary for payroll']],
            ['slug' => 'leave', 'name' => 'Leave Management', 'short' => 'Leave', 'status' => 'soon', 'description' => 'Request, approve, and track leave. Employees apply for vacation, sick, or emergency leave and managers approve it in a few clicks.', 'features' => ['Leave requests and approvals', 'Leave balances per employee', 'Auto-sync with attendance', 'Paid / unpaid leave for payroll']],
            ['slug' => 'payroll', 'name' => 'Payroll Management', 'short' => 'Payroll', 'status' => 'soon', 'description' => 'Turn attendance hours, leave days, and benefits into a correct monthly payslip, every single time.', 'features' => ['Monthly payroll run', 'Payslips for every employee', 'Pulls hours from attendance', 'Deductions from leave and benefits']],
            ['slug' => 'benefits', 'name' => 'Benefits Administration', 'short' => 'Benefits', 'status' => 'soon', 'description' => 'Manage health plans, allowances, and other perks — enroll employees and send the right deductions to payroll.', 'features' => ['Benefit plans and enrollment', 'Allowance tracking', 'Deductions sent to payroll', 'Government contributions summary']],
            ['slug' => 'performance', 'name' => 'Performance Management', 'short' => 'Performance', 'status' => 'soon', 'description' => 'Set goals, review progress, and record ratings. Performance results guide raises and training needs.', 'features' => ['Goals and reviews', 'Performance ratings', 'Raise recommendations for payroll', 'Skill gaps for training']],
            ['slug' => 'training', 'name' => 'Training & Development', 'short' => 'Training', 'status' => 'soon', 'description' => 'Plan courses and track who has completed them. Completed trainings are recorded on each employee profile.', 'features' => ['Training calendar', 'Course enrollments', 'Certificates on employee records', 'Training history per employee']],
            ['slug' => 'disciplinary', 'name' => 'Disciplinary Management', 'short' => 'Disciplinary', 'status' => 'soon', 'description' => 'Record warnings and incidents fairly. Repeat issues flag into offboarding when needed.', 'features' => ['Incident and warning log', 'Tracks repeated tardiness', 'Escalation to offboarding', 'Fair and consistent records']],
            ['slug' => 'offboarding', 'name' => 'Separation & Offboarding', 'short' => 'Offboarding', 'status' => 'soon', 'description' => 'A smooth goodbye — clearance tasks, final pay, and safe archiving of employee records.', 'features' => ['Exit checklist and clearance', 'Resignation and termination tracking', 'Final pay calculation with payroll', 'Records archived safely']],
        ];
    }

    /** How each module talks to the others (the interconnection story). */
    public static function moduleLinks(string $slug): array
    {
        $map = [
            'employees' => [
                'receives' => [
                    ['module' => 'Recruitment', 'note' => 'New hires arrive here automatically'],
                    ['module' => 'Training', 'note' => 'Completed trainings are added to the record'],
                    ['module' => 'Attendance', 'note' => 'Daily status updates from timekeeping'],
                ],
                'sends' => [
                    ['module' => 'Payroll', 'note' => 'Salary and bank details feed payslips'],
                    ['module' => 'Leave', 'note' => 'Leave balances are seeded per employee'],
                    ['module' => 'Offboarding', 'note' => 'Final records used for separation'],
                ],
            ],
            'recruitment' => [
                'receives' => [
                    ['module' => 'Employee Records', 'note' => 'Job openings requested by departments'],
                ],
                'sends' => [
                    ['module' => 'Employee Records', 'note' => 'Hired candidates become employees'],
                    ['module' => 'Onboarding', 'note' => 'New hires get onboarding checklists'],
                ],
            ],
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
            'leave' => [
                'receives' => [
                    ['module' => 'Employee Records', 'note' => 'Leave balances per employee'],
                    ['module' => 'Attendance', 'note' => 'Absences can turn into leave days'],
                ],
                'sends' => [
                    ['module' => 'Attendance', 'note' => 'Approved leave marks the day off'],
                    ['module' => 'Payroll', 'note' => 'Unpaid leave days are deducted'],
                ],
            ],
            'payroll' => [
                'receives' => [
                    ['module' => 'Attendance', 'note' => 'Hours worked this pay period'],
                    ['module' => 'Leave', 'note' => 'Paid and unpaid leave days'],
                    ['module' => 'Benefits', 'note' => 'Deductions and contributions'],
                    ['module' => 'Employee Records', 'note' => 'Salary and bank details'],
                ],
                'sends' => [
                    ['module' => 'Benefits', 'note' => 'Payroll-based contributions'],
                    ['module' => 'Performance', 'note' => 'Merit increases applied to pay'],
                ],
            ],
            'benefits' => [
                'receives' => [
                    ['module' => 'Employee Records', 'note' => 'Who is enrolled and eligible'],
                    ['module' => 'Payroll', 'note' => 'Contribution amounts per pay'],
                ],
                'sends' => [
                    ['module' => 'Payroll', 'note' => 'Deductions are added to payslips'],
                ],
            ],
            'performance' => [
                'receives' => [
                    ['module' => 'Employee Records', 'note' => 'Employees to be reviewed'],
                    ['module' => 'Training', 'note' => 'New skills shown on reviews'],
                ],
                'sends' => [
                    ['module' => 'Training', 'note' => 'Skill gaps become training plans'],
                    ['module' => 'Payroll', 'note' => 'Raises based on performance'],
                ],
            ],
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
            'disciplinary' => [
                'receives' => [
                    ['module' => 'Attendance', 'note' => 'Repeated tardiness flags'],
                    ['module' => 'Employee Records', 'note' => 'Records reviewed for warnings'],
                ],
                'sends' => [
                    ['module' => 'Offboarding', 'note' => 'Serious cases may end employment'],
                    ['module' => 'Performance', 'note' => 'Incidents affect reviews'],
                ],
            ],
            'offboarding' => [
                'receives' => [
                    ['module' => 'Employee Records', 'note' => 'Records to be closed'],
                    ['module' => 'Disciplinary', 'note' => 'Termination cases'],
                    ['module' => 'Leave', 'note' => 'Outstanding leave to be settled'],
                ],
                'sends' => [
                    ['module' => 'Payroll', 'note' => 'Final pay and clearance'],
                    ['module' => 'Employee Records', 'note' => 'Records archived safely'],
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
