import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
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
* @see \App\Http\Controllers\Hris\ProjectController::projects
 * @see app/Http/Controllers/Hris/ProjectController.php:35
 * @route '/demo/projects/registry'
 */
export const projects = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: projects.url(options),
    method: 'get',
})

projects.definition = {
    methods: ["get","head"],
    url: '/demo/projects/registry',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\ProjectController::projects
 * @see app/Http/Controllers/Hris/ProjectController.php:35
 * @route '/demo/projects/registry'
 */
projects.url = (options?: RouteQueryOptions) => {
    return projects.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\ProjectController::projects
 * @see app/Http/Controllers/Hris/ProjectController.php:35
 * @route '/demo/projects/registry'
 */
projects.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: projects.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\ProjectController::projects
 * @see app/Http/Controllers/Hris/ProjectController.php:35
 * @route '/demo/projects/registry'
 */
projects.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: projects.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Hris\ProjectController::sessionProject
 * @see app/Http/Controllers/Hris/ProjectController.php:63
 * @route '/demo/projects/registry/session/{project}'
 */
export const sessionProject = (args: { project: string | number } | [project: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: sessionProject.url(args, options),
    method: 'get',
})

sessionProject.definition = {
    methods: ["get","head"],
    url: '/demo/projects/registry/session/{project}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\ProjectController::sessionProject
 * @see app/Http/Controllers/Hris/ProjectController.php:63
 * @route '/demo/projects/registry/session/{project}'
 */
sessionProject.url = (args: { project: string | number } | [project: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return sessionProject.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\ProjectController::sessionProject
 * @see app/Http/Controllers/Hris/ProjectController.php:63
 * @route '/demo/projects/registry/session/{project}'
 */
sessionProject.get = (args: { project: string | number } | [project: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: sessionProject.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\ProjectController::sessionProject
 * @see app/Http/Controllers/Hris/ProjectController.php:63
 * @route '/demo/projects/registry/session/{project}'
 */
sessionProject.head = (args: { project: string | number } | [project: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: sessionProject.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Hris\ProjectController::project
 * @see app/Http/Controllers/Hris/ProjectController.php:44
 * @route '/demo/projects/registry/{project}'
 */
export const project = (args: { project: string | number } | [project: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: project.url(args, options),
    method: 'get',
})

project.definition = {
    methods: ["get","head"],
    url: '/demo/projects/registry/{project}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\ProjectController::project
 * @see app/Http/Controllers/Hris/ProjectController.php:44
 * @route '/demo/projects/registry/{project}'
 */
project.url = (args: { project: string | number } | [project: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return project.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\ProjectController::project
 * @see app/Http/Controllers/Hris/ProjectController.php:44
 * @route '/demo/projects/registry/{project}'
 */
project.get = (args: { project: string | number } | [project: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: project.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\ProjectController::project
 * @see app/Http/Controllers/Hris/ProjectController.php:44
 * @route '/demo/projects/registry/{project}'
 */
project.head = (args: { project: string | number } | [project: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: project.url(args, options),
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
const ProjectController = { index, dashboard, projects, sessionProject, project, reports }

export default ProjectController