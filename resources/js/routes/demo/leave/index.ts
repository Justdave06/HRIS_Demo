import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
import recordsE88d67 from './records'
/**
* @see \App\Http\Controllers\Hris\LeaveController::index
 * @see app/Http/Controllers/Hris/LeaveController.php:16
 * @route '/demo/leave'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/demo/leave',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\LeaveController::index
 * @see app/Http/Controllers/Hris/LeaveController.php:16
 * @route '/demo/leave'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\LeaveController::index
 * @see app/Http/Controllers/Hris/LeaveController.php:16
 * @route '/demo/leave'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\LeaveController::index
 * @see app/Http/Controllers/Hris/LeaveController.php:16
 * @route '/demo/leave'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Hris\LeaveController::dashboard
 * @see app/Http/Controllers/Hris/LeaveController.php:25
 * @route '/demo/leave/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/demo/leave/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\LeaveController::dashboard
 * @see app/Http/Controllers/Hris/LeaveController.php:25
 * @route '/demo/leave/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\LeaveController::dashboard
 * @see app/Http/Controllers/Hris/LeaveController.php:25
 * @route '/demo/leave/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\LeaveController::dashboard
 * @see app/Http/Controllers/Hris/LeaveController.php:25
 * @route '/demo/leave/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Hris\LeaveController::requests
 * @see app/Http/Controllers/Hris/LeaveController.php:49
 * @route '/demo/leave/requests'
 */
export const requests = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: requests.url(options),
    method: 'get',
})

requests.definition = {
    methods: ["get","head"],
    url: '/demo/leave/requests',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\LeaveController::requests
 * @see app/Http/Controllers/Hris/LeaveController.php:49
 * @route '/demo/leave/requests'
 */
requests.url = (options?: RouteQueryOptions) => {
    return requests.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\LeaveController::requests
 * @see app/Http/Controllers/Hris/LeaveController.php:49
 * @route '/demo/leave/requests'
 */
requests.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: requests.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\LeaveController::requests
 * @see app/Http/Controllers/Hris/LeaveController.php:49
 * @route '/demo/leave/requests'
 */
requests.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: requests.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Hris\LeaveController::records
 * @see app/Http/Controllers/Hris/LeaveController.php:73
 * @route '/demo/leave/records/{employee}'
 */
export const records = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: records.url(args, options),
    method: 'get',
})

records.definition = {
    methods: ["get","head"],
    url: '/demo/leave/records/{employee}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\LeaveController::records
 * @see app/Http/Controllers/Hris/LeaveController.php:73
 * @route '/demo/leave/records/{employee}'
 */
records.url = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employee: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    employee: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee: args.employee,
                }

    return records.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\LeaveController::records
 * @see app/Http/Controllers/Hris/LeaveController.php:73
 * @route '/demo/leave/records/{employee}'
 */
records.get = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: records.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\LeaveController::records
 * @see app/Http/Controllers/Hris/LeaveController.php:73
 * @route '/demo/leave/records/{employee}'
 */
records.head = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: records.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Hris\LeaveController::reports
 * @see app/Http/Controllers/Hris/LeaveController.php:127
 * @route '/demo/leave/reports'
 */
export const reports = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reports.url(options),
    method: 'get',
})

reports.definition = {
    methods: ["get","head"],
    url: '/demo/leave/reports',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\LeaveController::reports
 * @see app/Http/Controllers/Hris/LeaveController.php:127
 * @route '/demo/leave/reports'
 */
reports.url = (options?: RouteQueryOptions) => {
    return reports.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\LeaveController::reports
 * @see app/Http/Controllers/Hris/LeaveController.php:127
 * @route '/demo/leave/reports'
 */
reports.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reports.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\LeaveController::reports
 * @see app/Http/Controllers/Hris/LeaveController.php:127
 * @route '/demo/leave/reports'
 */
reports.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reports.url(options),
    method: 'head',
})
const leave = {
    index: Object.assign(index, index),
dashboard: Object.assign(dashboard, dashboard),
requests: Object.assign(requests, requests),
records: Object.assign(records, recordsE88d67),
reports: Object.assign(reports, reports),
}

export default leave