import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Hris\LeaveController::session
 * @see app/Http/Controllers/Hris/LeaveController.php:100
 * @route '/demo/leave/records/session/{employee}'
 */
export const session = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: session.url(args, options),
    method: 'get',
})

session.definition = {
    methods: ["get","head"],
    url: '/demo/leave/records/session/{employee}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\LeaveController::session
 * @see app/Http/Controllers/Hris/LeaveController.php:100
 * @route '/demo/leave/records/session/{employee}'
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
* @see \App\Http\Controllers\Hris\LeaveController::session
 * @see app/Http/Controllers/Hris/LeaveController.php:100
 * @route '/demo/leave/records/session/{employee}'
 */
session.get = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: session.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\LeaveController::session
 * @see app/Http/Controllers/Hris/LeaveController.php:100
 * @route '/demo/leave/records/session/{employee}'
 */
session.head = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: session.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Hris\LeaveController::session
 * @see app/Http/Controllers/Hris/LeaveController.php:100
 * @route '/demo/leave/records/session/{employee}'
 */
    const sessionForm = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: session.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\LeaveController::session
 * @see app/Http/Controllers/Hris/LeaveController.php:100
 * @route '/demo/leave/records/session/{employee}'
 */
        sessionForm.get = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: session.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\LeaveController::session
 * @see app/Http/Controllers/Hris/LeaveController.php:100
 * @route '/demo/leave/records/session/{employee}'
 */
        sessionForm.head = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: session.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    session.form = sessionForm
const records = {
    session: Object.assign(session, session),
}

export default records