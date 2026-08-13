import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
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
* @see \App\Http\Controllers\Hris\LeaveController::index
 * @see app/Http/Controllers/Hris/LeaveController.php:16
 * @route '/demo/leave'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\LeaveController::index
 * @see app/Http/Controllers/Hris/LeaveController.php:16
 * @route '/demo/leave'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\LeaveController::index
 * @see app/Http/Controllers/Hris/LeaveController.php:16
 * @route '/demo/leave'
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
* @see \App\Http\Controllers\Hris\LeaveController::dashboard
 * @see app/Http/Controllers/Hris/LeaveController.php:25
 * @route '/demo/leave/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\LeaveController::dashboard
 * @see app/Http/Controllers/Hris/LeaveController.php:25
 * @route '/demo/leave/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\LeaveController::dashboard
 * @see app/Http/Controllers/Hris/LeaveController.php:25
 * @route '/demo/leave/dashboard'
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
* @see \App\Http\Controllers\Hris\LeaveController::requests
 * @see app/Http/Controllers/Hris/LeaveController.php:49
 * @route '/demo/leave/requests'
 */
    const requestsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: requests.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\LeaveController::requests
 * @see app/Http/Controllers/Hris/LeaveController.php:49
 * @route '/demo/leave/requests'
 */
        requestsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: requests.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\LeaveController::requests
 * @see app/Http/Controllers/Hris/LeaveController.php:49
 * @route '/demo/leave/requests'
 */
        requestsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: requests.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    requests.form = requestsForm
/**
* @see \App\Http\Controllers\Hris\LeaveController::record
 * @see app/Http/Controllers/Hris/LeaveController.php:73
 * @route '/demo/leave/records/{employee}'
 */
export const record = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: record.url(args, options),
    method: 'get',
})

record.definition = {
    methods: ["get","head"],
    url: '/demo/leave/records/{employee}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\LeaveController::record
 * @see app/Http/Controllers/Hris/LeaveController.php:73
 * @route '/demo/leave/records/{employee}'
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
* @see \App\Http\Controllers\Hris\LeaveController::record
 * @see app/Http/Controllers/Hris/LeaveController.php:73
 * @route '/demo/leave/records/{employee}'
 */
record.get = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: record.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\LeaveController::record
 * @see app/Http/Controllers/Hris/LeaveController.php:73
 * @route '/demo/leave/records/{employee}'
 */
record.head = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: record.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Hris\LeaveController::record
 * @see app/Http/Controllers/Hris/LeaveController.php:73
 * @route '/demo/leave/records/{employee}'
 */
    const recordForm = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: record.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\LeaveController::record
 * @see app/Http/Controllers/Hris/LeaveController.php:73
 * @route '/demo/leave/records/{employee}'
 */
        recordForm.get = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: record.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\LeaveController::record
 * @see app/Http/Controllers/Hris/LeaveController.php:73
 * @route '/demo/leave/records/{employee}'
 */
        recordForm.head = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: record.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    record.form = recordForm
/**
* @see \App\Http\Controllers\Hris\LeaveController::sessionRecord
 * @see app/Http/Controllers/Hris/LeaveController.php:100
 * @route '/demo/leave/records/session/{employee}'
 */
export const sessionRecord = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: sessionRecord.url(args, options),
    method: 'get',
})

sessionRecord.definition = {
    methods: ["get","head"],
    url: '/demo/leave/records/session/{employee}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\LeaveController::sessionRecord
 * @see app/Http/Controllers/Hris/LeaveController.php:100
 * @route '/demo/leave/records/session/{employee}'
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
* @see \App\Http\Controllers\Hris\LeaveController::sessionRecord
 * @see app/Http/Controllers/Hris/LeaveController.php:100
 * @route '/demo/leave/records/session/{employee}'
 */
sessionRecord.get = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: sessionRecord.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\LeaveController::sessionRecord
 * @see app/Http/Controllers/Hris/LeaveController.php:100
 * @route '/demo/leave/records/session/{employee}'
 */
sessionRecord.head = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: sessionRecord.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Hris\LeaveController::sessionRecord
 * @see app/Http/Controllers/Hris/LeaveController.php:100
 * @route '/demo/leave/records/session/{employee}'
 */
    const sessionRecordForm = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: sessionRecord.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\LeaveController::sessionRecord
 * @see app/Http/Controllers/Hris/LeaveController.php:100
 * @route '/demo/leave/records/session/{employee}'
 */
        sessionRecordForm.get = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: sessionRecord.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\LeaveController::sessionRecord
 * @see app/Http/Controllers/Hris/LeaveController.php:100
 * @route '/demo/leave/records/session/{employee}'
 */
        sessionRecordForm.head = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: sessionRecord.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    sessionRecord.form = sessionRecordForm
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

    /**
* @see \App\Http\Controllers\Hris\LeaveController::reports
 * @see app/Http/Controllers/Hris/LeaveController.php:127
 * @route '/demo/leave/reports'
 */
    const reportsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: reports.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\LeaveController::reports
 * @see app/Http/Controllers/Hris/LeaveController.php:127
 * @route '/demo/leave/reports'
 */
        reportsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reports.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\LeaveController::reports
 * @see app/Http/Controllers/Hris/LeaveController.php:127
 * @route '/demo/leave/reports'
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
const LeaveController = { index, dashboard, requests, record, sessionRecord, reports }

export default LeaveController