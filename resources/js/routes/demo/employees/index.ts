import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
import sessionB29d8e from './session'
import overview from './overview'
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
* @see \App\Http\Controllers\Hris\EmployeeController::session
 * @see app/Http/Controllers/Hris/EmployeeController.php:100
 * @route '/demo/employees/session/{employee}'
 */
export const session = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: session.url(args, options),
    method: 'get',
})

session.definition = {
    methods: ["get","head"],
    url: '/demo/employees/session/{employee}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\EmployeeController::session
 * @see app/Http/Controllers/Hris/EmployeeController.php:100
 * @route '/demo/employees/session/{employee}'
 */
session.url = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return session.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\EmployeeController::session
 * @see app/Http/Controllers/Hris/EmployeeController.php:100
 * @route '/demo/employees/session/{employee}'
 */
session.get = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: session.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\EmployeeController::session
 * @see app/Http/Controllers/Hris/EmployeeController.php:100
 * @route '/demo/employees/session/{employee}'
 */
session.head = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: session.url(args, options),
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
const employees = {
    dashboard: Object.assign(dashboard, dashboard),
reports: Object.assign(reports, reports),
create: Object.assign(create, create),
index: Object.assign(index, index),
session: Object.assign(session, sessionB29d8e),
show: Object.assign(show, show),
overview: Object.assign(overview, overview),
}

export default employees