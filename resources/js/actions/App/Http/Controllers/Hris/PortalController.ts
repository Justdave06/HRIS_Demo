import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Hris\PortalController::login
 * @see app/Http/Controllers/Hris/PortalController.php:17
 * @route '/demo/portal'
 */
export const login = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})

login.definition = {
    methods: ["get","head"],
    url: '/demo/portal',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\PortalController::login
 * @see app/Http/Controllers/Hris/PortalController.php:17
 * @route '/demo/portal'
 */
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\PortalController::login
 * @see app/Http/Controllers/Hris/PortalController.php:17
 * @route '/demo/portal'
 */
login.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\PortalController::login
 * @see app/Http/Controllers/Hris/PortalController.php:17
 * @route '/demo/portal'
 */
login.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: login.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Hris\PortalController::login
 * @see app/Http/Controllers/Hris/PortalController.php:17
 * @route '/demo/portal'
 */
    const loginForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: login.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\PortalController::login
 * @see app/Http/Controllers/Hris/PortalController.php:17
 * @route '/demo/portal'
 */
        loginForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: login.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\PortalController::login
 * @see app/Http/Controllers/Hris/PortalController.php:17
 * @route '/demo/portal'
 */
        loginForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: login.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    login.form = loginForm
/**
* @see \App\Http\Controllers\Hris\PortalController::dashboard
 * @see app/Http/Controllers/Hris/PortalController.php:36
 * @route '/demo/portal/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/demo/portal/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\PortalController::dashboard
 * @see app/Http/Controllers/Hris/PortalController.php:36
 * @route '/demo/portal/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\PortalController::dashboard
 * @see app/Http/Controllers/Hris/PortalController.php:36
 * @route '/demo/portal/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\PortalController::dashboard
 * @see app/Http/Controllers/Hris/PortalController.php:36
 * @route '/demo/portal/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Hris\PortalController::dashboard
 * @see app/Http/Controllers/Hris/PortalController.php:36
 * @route '/demo/portal/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\PortalController::dashboard
 * @see app/Http/Controllers/Hris/PortalController.php:36
 * @route '/demo/portal/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\PortalController::dashboard
 * @see app/Http/Controllers/Hris/PortalController.php:36
 * @route '/demo/portal/dashboard'
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
const PortalController = { login, dashboard }

export default PortalController