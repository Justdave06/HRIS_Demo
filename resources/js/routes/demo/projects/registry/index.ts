import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Hris\ProjectController::session
 * @see app/Http/Controllers/Hris/ProjectController.php:63
 * @route '/demo/projects/registry/session/{project}'
 */
export const session = (args: { project: string | number } | [project: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: session.url(args, options),
    method: 'get',
})

session.definition = {
    methods: ["get","head"],
    url: '/demo/projects/registry/session/{project}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\ProjectController::session
 * @see app/Http/Controllers/Hris/ProjectController.php:63
 * @route '/demo/projects/registry/session/{project}'
 */
session.url = (args: { project: string | number } | [project: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { project: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    project: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        project: args.project,
                }

    return session.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\ProjectController::session
 * @see app/Http/Controllers/Hris/ProjectController.php:63
 * @route '/demo/projects/registry/session/{project}'
 */
session.get = (args: { project: string | number } | [project: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: session.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\ProjectController::session
 * @see app/Http/Controllers/Hris/ProjectController.php:63
 * @route '/demo/projects/registry/session/{project}'
 */
session.head = (args: { project: string | number } | [project: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: session.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Hris\ProjectController::show
 * @see app/Http/Controllers/Hris/ProjectController.php:44
 * @route '/demo/projects/registry/{project}'
 */
export const show = (args: { project: string | number } | [project: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/demo/projects/registry/{project}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\ProjectController::show
 * @see app/Http/Controllers/Hris/ProjectController.php:44
 * @route '/demo/projects/registry/{project}'
 */
show.url = (args: { project: string | number } | [project: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { project: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    project: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        project: args.project,
                }

    return show.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\ProjectController::show
 * @see app/Http/Controllers/Hris/ProjectController.php:44
 * @route '/demo/projects/registry/{project}'
 */
show.get = (args: { project: string | number } | [project: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\ProjectController::show
 * @see app/Http/Controllers/Hris/ProjectController.php:44
 * @route '/demo/projects/registry/{project}'
 */
show.head = (args: { project: string | number } | [project: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})
const registry = {
    session: Object.assign(session, session),
show: Object.assign(show, show),
}

export default registry