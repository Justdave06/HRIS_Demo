import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
import cases5f0c2e from './cases'
import employees from './employees'
/**
* @see \App\Http\Controllers\Hris\OffboardingController::index
 * @see app/Http/Controllers/Hris/OffboardingController.php:17
 * @route '/demo/offboarding'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/demo/offboarding',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\OffboardingController::index
 * @see app/Http/Controllers/Hris/OffboardingController.php:17
 * @route '/demo/offboarding'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\OffboardingController::index
 * @see app/Http/Controllers/Hris/OffboardingController.php:17
 * @route '/demo/offboarding'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\OffboardingController::index
 * @see app/Http/Controllers/Hris/OffboardingController.php:17
 * @route '/demo/offboarding'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Hris\OffboardingController::dashboard
 * @see app/Http/Controllers/Hris/OffboardingController.php:26
 * @route '/demo/offboarding/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/demo/offboarding/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\OffboardingController::dashboard
 * @see app/Http/Controllers/Hris/OffboardingController.php:26
 * @route '/demo/offboarding/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\OffboardingController::dashboard
 * @see app/Http/Controllers/Hris/OffboardingController.php:26
 * @route '/demo/offboarding/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\OffboardingController::dashboard
 * @see app/Http/Controllers/Hris/OffboardingController.php:26
 * @route '/demo/offboarding/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Hris\OffboardingController::cases
 * @see app/Http/Controllers/Hris/OffboardingController.php:35
 * @route '/demo/offboarding/cases'
 */
export const cases = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cases.url(options),
    method: 'get',
})

cases.definition = {
    methods: ["get","head"],
    url: '/demo/offboarding/cases',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\OffboardingController::cases
 * @see app/Http/Controllers/Hris/OffboardingController.php:35
 * @route '/demo/offboarding/cases'
 */
cases.url = (options?: RouteQueryOptions) => {
    return cases.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\OffboardingController::cases
 * @see app/Http/Controllers/Hris/OffboardingController.php:35
 * @route '/demo/offboarding/cases'
 */
cases.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cases.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\OffboardingController::cases
 * @see app/Http/Controllers/Hris/OffboardingController.php:35
 * @route '/demo/offboarding/cases'
 */
cases.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: cases.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Hris\OffboardingController::reports
 * @see app/Http/Controllers/Hris/OffboardingController.php:154
 * @route '/demo/offboarding/reports'
 */
export const reports = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reports.url(options),
    method: 'get',
})

reports.definition = {
    methods: ["get","head"],
    url: '/demo/offboarding/reports',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\OffboardingController::reports
 * @see app/Http/Controllers/Hris/OffboardingController.php:154
 * @route '/demo/offboarding/reports'
 */
reports.url = (options?: RouteQueryOptions) => {
    return reports.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\OffboardingController::reports
 * @see app/Http/Controllers/Hris/OffboardingController.php:154
 * @route '/demo/offboarding/reports'
 */
reports.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reports.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\OffboardingController::reports
 * @see app/Http/Controllers/Hris/OffboardingController.php:154
 * @route '/demo/offboarding/reports'
 */
reports.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reports.url(options),
    method: 'head',
})
const offboarding = {
    index: Object.assign(index, index),
dashboard: Object.assign(dashboard, dashboard),
cases: Object.assign(cases, cases5f0c2e),
employees: Object.assign(employees, employees),
reports: Object.assign(reports, reports),
}

export default offboarding