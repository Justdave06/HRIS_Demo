import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
import registry3bcd45 from './registry'
/**
* @see \App\Http\Controllers\Hris\ProjectController::index
 * @see app/Http/Controllers/Hris/ProjectController.php:16
 * @route '/demo/projects'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/demo/projects',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\ProjectController::index
 * @see app/Http/Controllers/Hris/ProjectController.php:16
 * @route '/demo/projects'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\ProjectController::index
 * @see app/Http/Controllers/Hris/ProjectController.php:16
 * @route '/demo/projects'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\ProjectController::index
 * @see app/Http/Controllers/Hris/ProjectController.php:16
 * @route '/demo/projects'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Hris\ProjectController::index
 * @see app/Http/Controllers/Hris/ProjectController.php:16
 * @route '/demo/projects'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\ProjectController::index
 * @see app/Http/Controllers/Hris/ProjectController.php:16
 * @route '/demo/projects'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\ProjectController::index
 * @see app/Http/Controllers/Hris/ProjectController.php:16
 * @route '/demo/projects'
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
* @see \App\Http\Controllers\Hris\ProjectController::dashboard
 * @see app/Http/Controllers/Hris/ProjectController.php:26
 * @route '/demo/projects/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/demo/projects/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\ProjectController::dashboard
 * @see app/Http/Controllers/Hris/ProjectController.php:26
 * @route '/demo/projects/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\ProjectController::dashboard
 * @see app/Http/Controllers/Hris/ProjectController.php:26
 * @route '/demo/projects/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\ProjectController::dashboard
 * @see app/Http/Controllers/Hris/ProjectController.php:26
 * @route '/demo/projects/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Hris\ProjectController::dashboard
 * @see app/Http/Controllers/Hris/ProjectController.php:26
 * @route '/demo/projects/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\ProjectController::dashboard
 * @see app/Http/Controllers/Hris/ProjectController.php:26
 * @route '/demo/projects/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\ProjectController::dashboard
 * @see app/Http/Controllers/Hris/ProjectController.php:26
 * @route '/demo/projects/dashboard'
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
* @see \App\Http\Controllers\Hris\ProjectController::registry
 * @see app/Http/Controllers/Hris/ProjectController.php:35
 * @route '/demo/projects/registry'
 */
export const registry = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: registry.url(options),
    method: 'get',
})

registry.definition = {
    methods: ["get","head"],
    url: '/demo/projects/registry',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\ProjectController::registry
 * @see app/Http/Controllers/Hris/ProjectController.php:35
 * @route '/demo/projects/registry'
 */
registry.url = (options?: RouteQueryOptions) => {
    return registry.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\ProjectController::registry
 * @see app/Http/Controllers/Hris/ProjectController.php:35
 * @route '/demo/projects/registry'
 */
registry.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: registry.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\ProjectController::registry
 * @see app/Http/Controllers/Hris/ProjectController.php:35
 * @route '/demo/projects/registry'
 */
registry.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: registry.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Hris\ProjectController::registry
 * @see app/Http/Controllers/Hris/ProjectController.php:35
 * @route '/demo/projects/registry'
 */
    const registryForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: registry.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\ProjectController::registry
 * @see app/Http/Controllers/Hris/ProjectController.php:35
 * @route '/demo/projects/registry'
 */
        registryForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: registry.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\ProjectController::registry
 * @see app/Http/Controllers/Hris/ProjectController.php:35
 * @route '/demo/projects/registry'
 */
        registryForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: registry.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    registry.form = registryForm
/**
* @see \App\Http\Controllers\Hris\ProjectController::reports
 * @see app/Http/Controllers/Hris/ProjectController.php:140
 * @route '/demo/projects/reports'
 */
export const reports = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reports.url(options),
    method: 'get',
})

reports.definition = {
    methods: ["get","head"],
    url: '/demo/projects/reports',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\ProjectController::reports
 * @see app/Http/Controllers/Hris/ProjectController.php:140
 * @route '/demo/projects/reports'
 */
reports.url = (options?: RouteQueryOptions) => {
    return reports.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\ProjectController::reports
 * @see app/Http/Controllers/Hris/ProjectController.php:140
 * @route '/demo/projects/reports'
 */
reports.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reports.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\ProjectController::reports
 * @see app/Http/Controllers/Hris/ProjectController.php:140
 * @route '/demo/projects/reports'
 */
reports.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reports.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Hris\ProjectController::reports
 * @see app/Http/Controllers/Hris/ProjectController.php:140
 * @route '/demo/projects/reports'
 */
    const reportsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: reports.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\ProjectController::reports
 * @see app/Http/Controllers/Hris/ProjectController.php:140
 * @route '/demo/projects/reports'
 */
        reportsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reports.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\ProjectController::reports
 * @see app/Http/Controllers/Hris/ProjectController.php:140
 * @route '/demo/projects/reports'
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
const projects = {
    index: Object.assign(index, index),
dashboard: Object.assign(dashboard, dashboard),
registry: Object.assign(registry, registry3bcd45),
reports: Object.assign(reports, reports),
}

export default projects