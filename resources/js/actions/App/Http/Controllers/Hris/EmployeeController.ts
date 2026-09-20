import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Hris\EmployeeController::dashboard
 * @see app/Http/Controllers/Hris/EmployeeController.php:16
 * @route '/demo/employees/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/demo/employees/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\EmployeeController::dashboard
 * @see app/Http/Controllers/Hris/EmployeeController.php:16
 * @route '/demo/employees/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\EmployeeController::dashboard
 * @see app/Http/Controllers/Hris/EmployeeController.php:16
 * @route '/demo/employees/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\EmployeeController::dashboard
 * @see app/Http/Controllers/Hris/EmployeeController.php:16
 * @route '/demo/employees/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Hris\EmployeeController::dashboard
 * @see app/Http/Controllers/Hris/EmployeeController.php:16
 * @route '/demo/employees/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\EmployeeController::dashboard
 * @see app/Http/Controllers/Hris/EmployeeController.php:16
 * @route '/demo/employees/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\EmployeeController::dashboard
 * @see app/Http/Controllers/Hris/EmployeeController.php:16
 * @route '/demo/employees/dashboard'
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
* @see \App\Http\Controllers\Hris\EmployeeController::reports
 * @see app/Http/Controllers/Hris/EmployeeController.php:44
 * @route '/demo/employees/reports'
 */
export const reports = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reports.url(options),
    method: 'get',
})

reports.definition = {
    methods: ["get","head"],
    url: '/demo/employees/reports',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\EmployeeController::reports
 * @see app/Http/Controllers/Hris/EmployeeController.php:44
 * @route '/demo/employees/reports'
 */
reports.url = (options?: RouteQueryOptions) => {
    return reports.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\EmployeeController::reports
 * @see app/Http/Controllers/Hris/EmployeeController.php:44
 * @route '/demo/employees/reports'
 */
reports.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reports.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\EmployeeController::reports
 * @see app/Http/Controllers/Hris/EmployeeController.php:44
 * @route '/demo/employees/reports'
 */
reports.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reports.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Hris\EmployeeController::reports
 * @see app/Http/Controllers/Hris/EmployeeController.php:44
 * @route '/demo/employees/reports'
 */
    const reportsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: reports.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\EmployeeController::reports
 * @see app/Http/Controllers/Hris/EmployeeController.php:44
 * @route '/demo/employees/reports'
 */
        reportsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reports.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\EmployeeController::reports
 * @see app/Http/Controllers/Hris/EmployeeController.php:44
 * @route '/demo/employees/reports'
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
/**
* @see \App\Http\Controllers\Hris\EmployeeController::create
 * @see app/Http/Controllers/Hris/EmployeeController.php:59
 * @route '/demo/employees/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/demo/employees/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\EmployeeController::create
 * @see app/Http/Controllers/Hris/EmployeeController.php:59
 * @route '/demo/employees/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\EmployeeController::create
 * @see app/Http/Controllers/Hris/EmployeeController.php:59
 * @route '/demo/employees/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\EmployeeController::create
 * @see app/Http/Controllers/Hris/EmployeeController.php:59
 * @route '/demo/employees/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Hris\EmployeeController::create
 * @see app/Http/Controllers/Hris/EmployeeController.php:59
 * @route '/demo/employees/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\EmployeeController::create
 * @see app/Http/Controllers/Hris/EmployeeController.php:59
 * @route '/demo/employees/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\EmployeeController::create
 * @see app/Http/Controllers/Hris/EmployeeController.php:59
 * @route '/demo/employees/create'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\Hris\EmployeeController::index
 * @see app/Http/Controllers/Hris/EmployeeController.php:30
 * @route '/demo/employees'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/demo/employees',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\EmployeeController::index
 * @see app/Http/Controllers/Hris/EmployeeController.php:30
 * @route '/demo/employees'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\EmployeeController::index
 * @see app/Http/Controllers/Hris/EmployeeController.php:30
 * @route '/demo/employees'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\EmployeeController::index
 * @see app/Http/Controllers/Hris/EmployeeController.php:30
 * @route '/demo/employees'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Hris\EmployeeController::index
 * @see app/Http/Controllers/Hris/EmployeeController.php:30
 * @route '/demo/employees'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\EmployeeController::index
 * @see app/Http/Controllers/Hris/EmployeeController.php:30
 * @route '/demo/employees'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\EmployeeController::index
 * @see app/Http/Controllers/Hris/EmployeeController.php:30
 * @route '/demo/employees'
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
* @see \App\Http\Controllers\Hris\EmployeeController::sessionShow
 * @see app/Http/Controllers/Hris/EmployeeController.php:100
 * @route '/demo/employees/session/{employee}'
 */
export const sessionShow = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: sessionShow.url(args, options),
    method: 'get',
})

sessionShow.definition = {
    methods: ["get","head"],
    url: '/demo/employees/session/{employee}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\EmployeeController::sessionShow
 * @see app/Http/Controllers/Hris/EmployeeController.php:100
 * @route '/demo/employees/session/{employee}'
 */
sessionShow.url = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return sessionShow.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\EmployeeController::sessionShow
 * @see app/Http/Controllers/Hris/EmployeeController.php:100
 * @route '/demo/employees/session/{employee}'
 */
sessionShow.get = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: sessionShow.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\EmployeeController::sessionShow
 * @see app/Http/Controllers/Hris/EmployeeController.php:100
 * @route '/demo/employees/session/{employee}'
 */
sessionShow.head = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: sessionShow.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Hris\EmployeeController::sessionShow
 * @see app/Http/Controllers/Hris/EmployeeController.php:100
 * @route '/demo/employees/session/{employee}'
 */
    const sessionShowForm = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: sessionShow.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\EmployeeController::sessionShow
 * @see app/Http/Controllers/Hris/EmployeeController.php:100
 * @route '/demo/employees/session/{employee}'
 */
        sessionShowForm.get = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: sessionShow.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\EmployeeController::sessionShow
 * @see app/Http/Controllers/Hris/EmployeeController.php:100
 * @route '/demo/employees/session/{employee}'
 */
        sessionShowForm.head = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: sessionShow.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    sessionShow.form = sessionShowForm
/**
* @see \App\Http\Controllers\Hris\EmployeeController::show
 * @see app/Http/Controllers/Hris/EmployeeController.php:76
 * @route '/demo/employees/{employee}'
 */
export const show = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/demo/employees/{employee}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\EmployeeController::show
 * @see app/Http/Controllers/Hris/EmployeeController.php:76
 * @route '/demo/employees/{employee}'
 */
show.url = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\EmployeeController::show
 * @see app/Http/Controllers/Hris/EmployeeController.php:76
 * @route '/demo/employees/{employee}'
 */
show.get = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\EmployeeController::show
 * @see app/Http/Controllers/Hris/EmployeeController.php:76
 * @route '/demo/employees/{employee}'
 */
show.head = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Hris\EmployeeController::show
 * @see app/Http/Controllers/Hris/EmployeeController.php:76
 * @route '/demo/employees/{employee}'
 */
    const showForm = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\EmployeeController::show
 * @see app/Http/Controllers/Hris/EmployeeController.php:76
 * @route '/demo/employees/{employee}'
 */
        showForm.get = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\EmployeeController::show
 * @see app/Http/Controllers/Hris/EmployeeController.php:76
 * @route '/demo/employees/{employee}'
 */
        showForm.head = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const EmployeeController = { dashboard, reports, create, index, sessionShow, show }

export default EmployeeController