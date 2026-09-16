import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Hris\PayrollController::index
 * @see app/Http/Controllers/Hris/PayrollController.php:16
 * @route '/demo/payroll'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/demo/payroll',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\PayrollController::index
 * @see app/Http/Controllers/Hris/PayrollController.php:16
 * @route '/demo/payroll'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\PayrollController::index
 * @see app/Http/Controllers/Hris/PayrollController.php:16
 * @route '/demo/payroll'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\PayrollController::index
 * @see app/Http/Controllers/Hris/PayrollController.php:16
 * @route '/demo/payroll'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Hris\PayrollController::dashboard
 * @see app/Http/Controllers/Hris/PayrollController.php:25
 * @route '/demo/payroll/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/demo/payroll/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\PayrollController::dashboard
 * @see app/Http/Controllers/Hris/PayrollController.php:25
 * @route '/demo/payroll/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\PayrollController::dashboard
 * @see app/Http/Controllers/Hris/PayrollController.php:25
 * @route '/demo/payroll/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\PayrollController::dashboard
 * @see app/Http/Controllers/Hris/PayrollController.php:25
 * @route '/demo/payroll/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Hris\PayrollController::payslips
 * @see app/Http/Controllers/Hris/PayrollController.php:34
 * @route '/demo/payroll/payslips'
 */
export const payslips = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: payslips.url(options),
    method: 'get',
})

payslips.definition = {
    methods: ["get","head"],
    url: '/demo/payroll/payslips',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\PayrollController::payslips
 * @see app/Http/Controllers/Hris/PayrollController.php:34
 * @route '/demo/payroll/payslips'
 */
payslips.url = (options?: RouteQueryOptions) => {
    return payslips.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\PayrollController::payslips
 * @see app/Http/Controllers/Hris/PayrollController.php:34
 * @route '/demo/payroll/payslips'
 */
payslips.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: payslips.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\PayrollController::payslips
 * @see app/Http/Controllers/Hris/PayrollController.php:34
 * @route '/demo/payroll/payslips'
 */
payslips.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: payslips.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Hris\PayrollController::reports
 * @see app/Http/Controllers/Hris/PayrollController.php:43
 * @route '/demo/payroll/reports'
 */
export const reports = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reports.url(options),
    method: 'get',
})

reports.definition = {
    methods: ["get","head"],
    url: '/demo/payroll/reports',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\PayrollController::reports
 * @see app/Http/Controllers/Hris/PayrollController.php:43
 * @route '/demo/payroll/reports'
 */
reports.url = (options?: RouteQueryOptions) => {
    return reports.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\PayrollController::reports
 * @see app/Http/Controllers/Hris/PayrollController.php:43
 * @route '/demo/payroll/reports'
 */
reports.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reports.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\PayrollController::reports
 * @see app/Http/Controllers/Hris/PayrollController.php:43
 * @route '/demo/payroll/reports'
 */
reports.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reports.url(options),
    method: 'head',
})
const PayrollController = { index, dashboard, payslips, reports }

export default PayrollController