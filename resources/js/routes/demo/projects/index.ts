import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
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
* @see \App\Http\Controllers\Hris\ProjectController::reports
 * @see app/Http/Controllers/Hris/ProjectController.php:93
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
 * @see app/Http/Controllers/Hris/ProjectController.php:93
 * @route '/demo/projects/reports'
 */
reports.url = (options?: RouteQueryOptions) => {
    return reports.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\ProjectController::reports
 * @see app/Http/Controllers/Hris/ProjectController.php:93
 * @route '/demo/projects/reports'
 */
reports.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reports.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\ProjectController::reports
 * @see app/Http/Controllers/Hris/ProjectController.php:93
 * @route '/demo/projects/reports'
 */
reports.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reports.url(options),
    method: 'head',
})
const projects = {
    index: Object.assign(index, index),
dashboard: Object.assign(dashboard, dashboard),
registry: Object.assign(registry, registry3bcd45),
reports: Object.assign(reports, reports),
}

export default projects