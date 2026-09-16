import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Hris\DisciplinaryController::session
 * @see app/Http/Controllers/Hris/DisciplinaryController.php:70
 * @route '/demo/disciplinary/records/session/{employee}'
 */
export const session = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: session.url(args, options),
    method: 'get',
})

session.definition = {
    methods: ["get","head"],
    url: '/demo/disciplinary/records/session/{employee}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\DisciplinaryController::session
 * @see app/Http/Controllers/Hris/DisciplinaryController.php:70
 * @route '/demo/disciplinary/records/session/{employee}'
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
* @see \App\Http\Controllers\Hris\DisciplinaryController::session
 * @see app/Http/Controllers/Hris/DisciplinaryController.php:70
 * @route '/demo/disciplinary/records/session/{employee}'
 */
session.get = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: session.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\DisciplinaryController::session
 * @see app/Http/Controllers/Hris/DisciplinaryController.php:70
 * @route '/demo/disciplinary/records/session/{employee}'
 */
session.head = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: session.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Hris\DisciplinaryController::show
 * @see app/Http/Controllers/Hris/DisciplinaryController.php:45
 * @route '/demo/disciplinary/records/{employee}'
 */
export const show = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/demo/disciplinary/records/{employee}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\DisciplinaryController::show
 * @see app/Http/Controllers/Hris/DisciplinaryController.php:45
 * @route '/demo/disciplinary/records/{employee}'
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
* @see \App\Http\Controllers\Hris\DisciplinaryController::show
 * @see app/Http/Controllers/Hris/DisciplinaryController.php:45
 * @route '/demo/disciplinary/records/{employee}'
 */
show.get = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\DisciplinaryController::show
 * @see app/Http/Controllers/Hris/DisciplinaryController.php:45
 * @route '/demo/disciplinary/records/{employee}'
 */
show.head = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})
const records = {
    session: Object.assign(session, session),
show: Object.assign(show, show),
}

export default records