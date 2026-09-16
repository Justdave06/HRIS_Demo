import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Hris\TrainingController::index
 * @see app/Http/Controllers/Hris/TrainingController.php:16
 * @route '/demo/training'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/demo/training',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\TrainingController::index
 * @see app/Http/Controllers/Hris/TrainingController.php:16
 * @route '/demo/training'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\TrainingController::index
 * @see app/Http/Controllers/Hris/TrainingController.php:16
 * @route '/demo/training'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\TrainingController::index
 * @see app/Http/Controllers/Hris/TrainingController.php:16
 * @route '/demo/training'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Hris\TrainingController::dashboard
 * @see app/Http/Controllers/Hris/TrainingController.php:26
 * @route '/demo/training/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/demo/training/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\TrainingController::dashboard
 * @see app/Http/Controllers/Hris/TrainingController.php:26
 * @route '/demo/training/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\TrainingController::dashboard
 * @see app/Http/Controllers/Hris/TrainingController.php:26
 * @route '/demo/training/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\TrainingController::dashboard
 * @see app/Http/Controllers/Hris/TrainingController.php:26
 * @route '/demo/training/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Hris\TrainingController::enrollments
 * @see app/Http/Controllers/Hris/TrainingController.php:36
 * @route '/demo/training/enrollments'
 */
export const enrollments = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: enrollments.url(options),
    method: 'get',
})

enrollments.definition = {
    methods: ["get","head"],
    url: '/demo/training/enrollments',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\TrainingController::enrollments
 * @see app/Http/Controllers/Hris/TrainingController.php:36
 * @route '/demo/training/enrollments'
 */
enrollments.url = (options?: RouteQueryOptions) => {
    return enrollments.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\TrainingController::enrollments
 * @see app/Http/Controllers/Hris/TrainingController.php:36
 * @route '/demo/training/enrollments'
 */
enrollments.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: enrollments.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\TrainingController::enrollments
 * @see app/Http/Controllers/Hris/TrainingController.php:36
 * @route '/demo/training/enrollments'
 */
enrollments.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: enrollments.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Hris\TrainingController::record
 * @see app/Http/Controllers/Hris/TrainingController.php:45
 * @route '/demo/training/records/{employee}'
 */
export const record = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: record.url(args, options),
    method: 'get',
})

record.definition = {
    methods: ["get","head"],
    url: '/demo/training/records/{employee}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\TrainingController::record
 * @see app/Http/Controllers/Hris/TrainingController.php:45
 * @route '/demo/training/records/{employee}'
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
* @see \App\Http\Controllers\Hris\TrainingController::record
 * @see app/Http/Controllers/Hris/TrainingController.php:45
 * @route '/demo/training/records/{employee}'
 */
record.get = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: record.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\TrainingController::record
 * @see app/Http/Controllers/Hris/TrainingController.php:45
 * @route '/demo/training/records/{employee}'
 */
record.head = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: record.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Hris\TrainingController::sessionRecord
 * @see app/Http/Controllers/Hris/TrainingController.php:69
 * @route '/demo/training/records/session/{employee}'
 */
export const sessionRecord = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: sessionRecord.url(args, options),
    method: 'get',
})

sessionRecord.definition = {
    methods: ["get","head"],
    url: '/demo/training/records/session/{employee}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\TrainingController::sessionRecord
 * @see app/Http/Controllers/Hris/TrainingController.php:69
 * @route '/demo/training/records/session/{employee}'
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
* @see \App\Http\Controllers\Hris\TrainingController::sessionRecord
 * @see app/Http/Controllers/Hris/TrainingController.php:69
 * @route '/demo/training/records/session/{employee}'
 */
sessionRecord.get = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: sessionRecord.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\TrainingController::sessionRecord
 * @see app/Http/Controllers/Hris/TrainingController.php:69
 * @route '/demo/training/records/session/{employee}'
 */
sessionRecord.head = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: sessionRecord.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Hris\TrainingController::reports
 * @see app/Http/Controllers/Hris/TrainingController.php:93
 * @route '/demo/training/reports'
 */
export const reports = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reports.url(options),
    method: 'get',
})

reports.definition = {
    methods: ["get","head"],
    url: '/demo/training/reports',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\TrainingController::reports
 * @see app/Http/Controllers/Hris/TrainingController.php:93
 * @route '/demo/training/reports'
 */
reports.url = (options?: RouteQueryOptions) => {
    return reports.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\TrainingController::reports
 * @see app/Http/Controllers/Hris/TrainingController.php:93
 * @route '/demo/training/reports'
 */
reports.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reports.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\TrainingController::reports
 * @see app/Http/Controllers/Hris/TrainingController.php:93
 * @route '/demo/training/reports'
 */
reports.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reports.url(options),
    method: 'head',
})
const TrainingController = { index, dashboard, enrollments, record, sessionRecord, reports }

export default TrainingController