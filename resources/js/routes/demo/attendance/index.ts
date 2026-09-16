import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Hris\AttendanceController::index
 * @see app/Http/Controllers/Hris/AttendanceController.php:16
 * @route '/demo/attendance'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/demo/attendance',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\AttendanceController::index
 * @see app/Http/Controllers/Hris/AttendanceController.php:16
 * @route '/demo/attendance'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\AttendanceController::index
 * @see app/Http/Controllers/Hris/AttendanceController.php:16
 * @route '/demo/attendance'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\AttendanceController::index
 * @see app/Http/Controllers/Hris/AttendanceController.php:16
 * @route '/demo/attendance'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Hris\AttendanceController::dashboard
 * @see app/Http/Controllers/Hris/AttendanceController.php:25
 * @route '/demo/attendance/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/demo/attendance/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\AttendanceController::dashboard
 * @see app/Http/Controllers/Hris/AttendanceController.php:25
 * @route '/demo/attendance/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\AttendanceController::dashboard
 * @see app/Http/Controllers/Hris/AttendanceController.php:25
 * @route '/demo/attendance/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\AttendanceController::dashboard
 * @see app/Http/Controllers/Hris/AttendanceController.php:25
 * @route '/demo/attendance/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Hris\AttendanceController::manager
 * @see app/Http/Controllers/Hris/AttendanceController.php:41
 * @route '/demo/attendance/manager'
 */
export const manager = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: manager.url(options),
    method: 'get',
})

manager.definition = {
    methods: ["get","head"],
    url: '/demo/attendance/manager',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\AttendanceController::manager
 * @see app/Http/Controllers/Hris/AttendanceController.php:41
 * @route '/demo/attendance/manager'
 */
manager.url = (options?: RouteQueryOptions) => {
    return manager.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\AttendanceController::manager
 * @see app/Http/Controllers/Hris/AttendanceController.php:41
 * @route '/demo/attendance/manager'
 */
manager.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: manager.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\AttendanceController::manager
 * @see app/Http/Controllers/Hris/AttendanceController.php:41
 * @route '/demo/attendance/manager'
 */
manager.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: manager.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Hris\AttendanceController::holidays
 * @see app/Http/Controllers/Hris/AttendanceController.php:56
 * @route '/demo/attendance/holidays'
 */
export const holidays = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: holidays.url(options),
    method: 'get',
})

holidays.definition = {
    methods: ["get","head"],
    url: '/demo/attendance/holidays',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\AttendanceController::holidays
 * @see app/Http/Controllers/Hris/AttendanceController.php:56
 * @route '/demo/attendance/holidays'
 */
holidays.url = (options?: RouteQueryOptions) => {
    return holidays.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\AttendanceController::holidays
 * @see app/Http/Controllers/Hris/AttendanceController.php:56
 * @route '/demo/attendance/holidays'
 */
holidays.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: holidays.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\AttendanceController::holidays
 * @see app/Http/Controllers/Hris/AttendanceController.php:56
 * @route '/demo/attendance/holidays'
 */
holidays.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: holidays.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Hris\AttendanceController::reports
 * @see app/Http/Controllers/Hris/AttendanceController.php:77
 * @route '/demo/attendance/reports'
 */
export const reports = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reports.url(options),
    method: 'get',
})

reports.definition = {
    methods: ["get","head"],
    url: '/demo/attendance/reports',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\AttendanceController::reports
 * @see app/Http/Controllers/Hris/AttendanceController.php:77
 * @route '/demo/attendance/reports'
 */
reports.url = (options?: RouteQueryOptions) => {
    return reports.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\AttendanceController::reports
 * @see app/Http/Controllers/Hris/AttendanceController.php:77
 * @route '/demo/attendance/reports'
 */
reports.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reports.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\AttendanceController::reports
 * @see app/Http/Controllers/Hris/AttendanceController.php:77
 * @route '/demo/attendance/reports'
 */
reports.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reports.url(options),
    method: 'head',
})
const attendance = {
    index: Object.assign(index, index),
dashboard: Object.assign(dashboard, dashboard),
manager: Object.assign(manager, manager),
holidays: Object.assign(holidays, holidays),
reports: Object.assign(reports, reports),
}

export default attendance