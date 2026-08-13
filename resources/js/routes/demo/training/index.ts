import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
import recordsE88d67 from './records'
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
* @see \App\Http\Controllers\Hris\TrainingController::index
 * @see app/Http/Controllers/Hris/TrainingController.php:16
 * @route '/demo/training'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\TrainingController::index
 * @see app/Http/Controllers/Hris/TrainingController.php:16
 * @route '/demo/training'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\TrainingController::index
 * @see app/Http/Controllers/Hris/TrainingController.php:16
 * @route '/demo/training'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
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
* @see \App\Http\Controllers\Hris\TrainingController::dashboard
 * @see app/Http/Controllers/Hris/TrainingController.php:26
 * @route '/demo/training/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\TrainingController::dashboard
 * @see app/Http/Controllers/Hris/TrainingController.php:26
 * @route '/demo/training/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\TrainingController::dashboard
 * @see app/Http/Controllers/Hris/TrainingController.php:26
 * @route '/demo/training/dashboard'
 */
        dashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dashboard.form = dashboardForm
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
* @see \App\Http\Controllers\Hris\TrainingController::enrollments
 * @see app/Http/Controllers/Hris/TrainingController.php:36
 * @route '/demo/training/enrollments'
 */
    const enrollmentsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: enrollments.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\TrainingController::enrollments
 * @see app/Http/Controllers/Hris/TrainingController.php:36
 * @route '/demo/training/enrollments'
 */
        enrollmentsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: enrollments.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\TrainingController::enrollments
 * @see app/Http/Controllers/Hris/TrainingController.php:36
 * @route '/demo/training/enrollments'
 */
        enrollmentsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: enrollments.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    enrollments.form = enrollmentsForm
/**
* @see \App\Http\Controllers\Hris\TrainingController::records
 * @see app/Http/Controllers/Hris/TrainingController.php:45
 * @route '/demo/training/records/{employee}'
 */
export const records = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: records.url(args, options),
    method: 'get',
})

records.definition = {
    methods: ["get","head"],
    url: '/demo/training/records/{employee}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\TrainingController::records
 * @see app/Http/Controllers/Hris/TrainingController.php:45
 * @route '/demo/training/records/{employee}'
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
* @see \App\Http\Controllers\Hris\TrainingController::records
 * @see app/Http/Controllers/Hris/TrainingController.php:45
 * @route '/demo/training/records/{employee}'
 */
records.get = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: records.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\TrainingController::records
 * @see app/Http/Controllers/Hris/TrainingController.php:45
 * @route '/demo/training/records/{employee}'
 */
records.head = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: records.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Hris\TrainingController::records
 * @see app/Http/Controllers/Hris/TrainingController.php:45
 * @route '/demo/training/records/{employee}'
 */
    const recordsForm = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: records.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\TrainingController::records
 * @see app/Http/Controllers/Hris/TrainingController.php:45
 * @route '/demo/training/records/{employee}'
 */
        recordsForm.get = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: records.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\TrainingController::records
 * @see app/Http/Controllers/Hris/TrainingController.php:45
 * @route '/demo/training/records/{employee}'
 */
        recordsForm.head = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: records.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    records.form = recordsForm
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

    /**
* @see \App\Http\Controllers\Hris\TrainingController::reports
 * @see app/Http/Controllers/Hris/TrainingController.php:93
 * @route '/demo/training/reports'
 */
    const reportsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: reports.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\TrainingController::reports
 * @see app/Http/Controllers/Hris/TrainingController.php:93
 * @route '/demo/training/reports'
 */
        reportsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reports.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\TrainingController::reports
 * @see app/Http/Controllers/Hris/TrainingController.php:93
 * @route '/demo/training/reports'
 */
        reportsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reports.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    reports.form = reportsForm
const training = {
    index: Object.assign(index, index),
dashboard: Object.assign(dashboard, dashboard),
enrollments: Object.assign(enrollments, enrollments),
records: Object.assign(records, recordsE88d67),
reports: Object.assign(reports, reports),
}

export default training