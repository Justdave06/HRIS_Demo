import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Hris\PerformanceController::index
 * @see app/Http/Controllers/Hris/PerformanceController.php:16
 * @route '/demo/performance'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/demo/performance',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\PerformanceController::index
 * @see app/Http/Controllers/Hris/PerformanceController.php:16
 * @route '/demo/performance'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\PerformanceController::index
 * @see app/Http/Controllers/Hris/PerformanceController.php:16
 * @route '/demo/performance'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\PerformanceController::index
 * @see app/Http/Controllers/Hris/PerformanceController.php:16
 * @route '/demo/performance'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Hris\PerformanceController::dashboard
 * @see app/Http/Controllers/Hris/PerformanceController.php:26
 * @route '/demo/performance/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/demo/performance/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\PerformanceController::dashboard
 * @see app/Http/Controllers/Hris/PerformanceController.php:26
 * @route '/demo/performance/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\PerformanceController::dashboard
 * @see app/Http/Controllers/Hris/PerformanceController.php:26
 * @route '/demo/performance/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\PerformanceController::dashboard
 * @see app/Http/Controllers/Hris/PerformanceController.php:26
 * @route '/demo/performance/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Hris\PerformanceController::reviews
 * @see app/Http/Controllers/Hris/PerformanceController.php:35
 * @route '/demo/performance/reviews'
 */
export const reviews = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reviews.url(options),
    method: 'get',
})

reviews.definition = {
    methods: ["get","head"],
    url: '/demo/performance/reviews',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\PerformanceController::reviews
 * @see app/Http/Controllers/Hris/PerformanceController.php:35
 * @route '/demo/performance/reviews'
 */
reviews.url = (options?: RouteQueryOptions) => {
    return reviews.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\PerformanceController::reviews
 * @see app/Http/Controllers/Hris/PerformanceController.php:35
 * @route '/demo/performance/reviews'
 */
reviews.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reviews.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\PerformanceController::reviews
 * @see app/Http/Controllers/Hris/PerformanceController.php:35
 * @route '/demo/performance/reviews'
 */
reviews.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reviews.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Hris\PerformanceController::record
 * @see app/Http/Controllers/Hris/PerformanceController.php:55
 * @route '/demo/performance/records/{employee}'
 */
export const record = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: record.url(args, options),
    method: 'get',
})

record.definition = {
    methods: ["get","head"],
    url: '/demo/performance/records/{employee}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\PerformanceController::record
 * @see app/Http/Controllers/Hris/PerformanceController.php:55
 * @route '/demo/performance/records/{employee}'
 */
record.url = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return record.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\PerformanceController::record
 * @see app/Http/Controllers/Hris/PerformanceController.php:55
 * @route '/demo/performance/records/{employee}'
 */
record.get = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: record.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\PerformanceController::record
 * @see app/Http/Controllers/Hris/PerformanceController.php:55
 * @route '/demo/performance/records/{employee}'
 */
record.head = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: record.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Hris\PerformanceController::sessionRecord
 * @see app/Http/Controllers/Hris/PerformanceController.php:81
 * @route '/demo/performance/records/session/{employee}'
 */
export const sessionRecord = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: sessionRecord.url(args, options),
    method: 'get',
})

sessionRecord.definition = {
    methods: ["get","head"],
    url: '/demo/performance/records/session/{employee}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\PerformanceController::sessionRecord
 * @see app/Http/Controllers/Hris/PerformanceController.php:81
 * @route '/demo/performance/records/session/{employee}'
 */
sessionRecord.url = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return sessionRecord.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\PerformanceController::sessionRecord
 * @see app/Http/Controllers/Hris/PerformanceController.php:81
 * @route '/demo/performance/records/session/{employee}'
 */
sessionRecord.get = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: sessionRecord.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\PerformanceController::sessionRecord
 * @see app/Http/Controllers/Hris/PerformanceController.php:81
 * @route '/demo/performance/records/session/{employee}'
 */
sessionRecord.head = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: sessionRecord.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Hris\PerformanceController::reports
 * @see app/Http/Controllers/Hris/PerformanceController.php:45
 * @route '/demo/performance/reports'
 */
export const reports = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reports.url(options),
    method: 'get',
})

reports.definition = {
    methods: ["get","head"],
    url: '/demo/performance/reports',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\PerformanceController::reports
 * @see app/Http/Controllers/Hris/PerformanceController.php:45
 * @route '/demo/performance/reports'
 */
reports.url = (options?: RouteQueryOptions) => {
    return reports.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\PerformanceController::reports
 * @see app/Http/Controllers/Hris/PerformanceController.php:45
 * @route '/demo/performance/reports'
 */
reports.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reports.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\PerformanceController::reports
 * @see app/Http/Controllers/Hris/PerformanceController.php:45
 * @route '/demo/performance/reports'
 */
reports.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reports.url(options),
    method: 'head',
})
const PerformanceController = { index, dashboard, reviews, record, sessionRecord, reports }

export default PerformanceController