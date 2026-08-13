import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Hris\OffboardingController::session
 * @see app/Http/Controllers/Hris/OffboardingController.php:116
 * @route '/demo/offboarding/employees/session/{employee}'
 */
export const session = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: session.url(args, options),
    method: 'get',
})

session.definition = {
    methods: ["get","head"],
    url: '/demo/offboarding/employees/session/{employee}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\OffboardingController::session
 * @see app/Http/Controllers/Hris/OffboardingController.php:116
 * @route '/demo/offboarding/employees/session/{employee}'
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
* @see \App\Http\Controllers\Hris\OffboardingController::session
 * @see app/Http/Controllers/Hris/OffboardingController.php:116
 * @route '/demo/offboarding/employees/session/{employee}'
 */
session.get = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: session.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\OffboardingController::session
 * @see app/Http/Controllers/Hris/OffboardingController.php:116
 * @route '/demo/offboarding/employees/session/{employee}'
 */
session.head = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: session.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Hris\OffboardingController::session
 * @see app/Http/Controllers/Hris/OffboardingController.php:116
 * @route '/demo/offboarding/employees/session/{employee}'
 */
    const sessionForm = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: session.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\OffboardingController::session
 * @see app/Http/Controllers/Hris/OffboardingController.php:116
 * @route '/demo/offboarding/employees/session/{employee}'
 */
        sessionForm.get = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: session.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\OffboardingController::session
 * @see app/Http/Controllers/Hris/OffboardingController.php:116
 * @route '/demo/offboarding/employees/session/{employee}'
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
/**
* @see \App\Http\Controllers\Hris\OffboardingController::show
 * @see app/Http/Controllers/Hris/OffboardingController.php:94
 * @route '/demo/offboarding/employees/{employee}'
 */
export const show = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/demo/offboarding/employees/{employee}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\OffboardingController::show
 * @see app/Http/Controllers/Hris/OffboardingController.php:94
 * @route '/demo/offboarding/employees/{employee}'
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
* @see \App\Http\Controllers\Hris\OffboardingController::show
 * @see app/Http/Controllers/Hris/OffboardingController.php:94
 * @route '/demo/offboarding/employees/{employee}'
 */
show.get = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\OffboardingController::show
 * @see app/Http/Controllers/Hris/OffboardingController.php:94
 * @route '/demo/offboarding/employees/{employee}'
 */
show.head = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Hris\OffboardingController::show
 * @see app/Http/Controllers/Hris/OffboardingController.php:94
 * @route '/demo/offboarding/employees/{employee}'
 */
    const showForm = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\OffboardingController::show
 * @see app/Http/Controllers/Hris/OffboardingController.php:94
 * @route '/demo/offboarding/employees/{employee}'
 */
        showForm.get = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\OffboardingController::show
 * @see app/Http/Controllers/Hris/OffboardingController.php:94
 * @route '/demo/offboarding/employees/{employee}'
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
const employees = {
    session: Object.assign(session, session),
show: Object.assign(show, show),
}

export default employees