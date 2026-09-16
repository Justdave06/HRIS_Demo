import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
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
const EmployeeController = { dashboard, reports, create, index, sessionShow, show }

export default EmployeeController