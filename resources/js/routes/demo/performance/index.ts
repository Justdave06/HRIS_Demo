import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
import recordsE88d67 from './records'
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
* @see \App\Http\Controllers\Hris\PerformanceController::index
 * @see app/Http/Controllers/Hris/PerformanceController.php:16
 * @route '/demo/performance'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\PerformanceController::index
 * @see app/Http/Controllers/Hris/PerformanceController.php:16
 * @route '/demo/performance'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\PerformanceController::index
 * @see app/Http/Controllers/Hris/PerformanceController.php:16
 * @route '/demo/performance'
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
* @see \App\Http\Controllers\Hris\PerformanceController::dashboard
 * @see app/Http/Controllers/Hris/PerformanceController.php:26
 * @route '/demo/performance/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\PerformanceController::dashboard
 * @see app/Http/Controllers/Hris/PerformanceController.php:26
 * @route '/demo/performance/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\PerformanceController::dashboard
 * @see app/Http/Controllers/Hris/PerformanceController.php:26
 * @route '/demo/performance/dashboard'
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
* @see \App\Http\Controllers\Hris\PerformanceController::reviews
 * @see app/Http/Controllers/Hris/PerformanceController.php:35
 * @route '/demo/performance/reviews'
 */
    const reviewsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: reviews.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\PerformanceController::reviews
 * @see app/Http/Controllers/Hris/PerformanceController.php:35
 * @route '/demo/performance/reviews'
 */
        reviewsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reviews.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\PerformanceController::reviews
 * @see app/Http/Controllers/Hris/PerformanceController.php:35
 * @route '/demo/performance/reviews'
 */
        reviewsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reviews.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    reviews.form = reviewsForm
/**
* @see \App\Http\Controllers\Hris\PerformanceController::records
 * @see app/Http/Controllers/Hris/PerformanceController.php:55
 * @route '/demo/performance/records/{employee}'
 */
export const records = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: records.url(args, options),
    method: 'get',
})

records.definition = {
    methods: ["get","head"],
    url: '/demo/performance/records/{employee}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\PerformanceController::records
 * @see app/Http/Controllers/Hris/PerformanceController.php:55
 * @route '/demo/performance/records/{employee}'
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
* @see \App\Http\Controllers\Hris\PerformanceController::records
 * @see app/Http/Controllers/Hris/PerformanceController.php:55
 * @route '/demo/performance/records/{employee}'
 */
records.get = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: records.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\PerformanceController::records
 * @see app/Http/Controllers/Hris/PerformanceController.php:55
 * @route '/demo/performance/records/{employee}'
 */
records.head = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: records.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Hris\PerformanceController::records
 * @see app/Http/Controllers/Hris/PerformanceController.php:55
 * @route '/demo/performance/records/{employee}'
 */
    const recordsForm = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: records.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\PerformanceController::records
 * @see app/Http/Controllers/Hris/PerformanceController.php:55
 * @route '/demo/performance/records/{employee}'
 */
        recordsForm.get = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: records.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\PerformanceController::records
 * @see app/Http/Controllers/Hris/PerformanceController.php:55
 * @route '/demo/performance/records/{employee}'
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

    /**
* @see \App\Http\Controllers\Hris\PerformanceController::reports
 * @see app/Http/Controllers/Hris/PerformanceController.php:45
 * @route '/demo/performance/reports'
 */
    const reportsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: reports.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\PerformanceController::reports
 * @see app/Http/Controllers/Hris/PerformanceController.php:45
 * @route '/demo/performance/reports'
 */
        reportsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reports.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\PerformanceController::reports
 * @see app/Http/Controllers/Hris/PerformanceController.php:45
 * @route '/demo/performance/reports'
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
const performance = {
    index: Object.assign(index, index),
dashboard: Object.assign(dashboard, dashboard),
reviews: Object.assign(reviews, reviews),
records: Object.assign(records, recordsE88d67),
reports: Object.assign(reports, reports),
}

export default performance