import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
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
* @see \App\Http\Controllers\Hris\ProjectController::projects
 * @see app/Http/Controllers/Hris/ProjectController.php:35
 * @route '/demo/projects/registry'
 */
    const projectsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: projects.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\ProjectController::projects
 * @see app/Http/Controllers/Hris/ProjectController.php:35
 * @route '/demo/projects/registry'
 */
        projectsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: projects.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\ProjectController::projects
 * @see app/Http/Controllers/Hris/ProjectController.php:35
 * @route '/demo/projects/registry'
 */
        projectsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: projects.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    projects.form = projectsForm
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
* @see \App\Http\Controllers\Hris\ProjectController::sessionProject
 * @see app/Http/Controllers/Hris/ProjectController.php:63
 * @route '/demo/projects/registry/session/{project}'
 */
    const sessionProjectForm = (args: { project: string | number } | [project: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: sessionProject.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\ProjectController::sessionProject
 * @see app/Http/Controllers/Hris/ProjectController.php:63
 * @route '/demo/projects/registry/session/{project}'
 */
        sessionProjectForm.get = (args: { project: string | number } | [project: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: sessionProject.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\ProjectController::sessionProject
 * @see app/Http/Controllers/Hris/ProjectController.php:63
 * @route '/demo/projects/registry/session/{project}'
 */
        sessionProjectForm.head = (args: { project: string | number } | [project: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: sessionProject.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    sessionProject.form = sessionProjectForm
/**
* @see \App\Http\Controllers\Hris\ProjectController::sessionBudgetBreakdown
 * @see app/Http/Controllers/Hris/ProjectController.php:110
 * @route '/demo/projects/registry/session/{project}/budget'
 */
export const sessionBudgetBreakdown = (args: { project: string | number } | [project: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: sessionBudgetBreakdown.url(args, options),
    method: 'get',
})

sessionBudgetBreakdown.definition = {
    methods: ["get","head"],
    url: '/demo/projects/registry/session/{project}/budget',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\ProjectController::sessionBudgetBreakdown
 * @see app/Http/Controllers/Hris/ProjectController.php:110
 * @route '/demo/projects/registry/session/{project}/budget'
 */
sessionBudgetBreakdown.url = (args: { project: string | number } | [project: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return sessionBudgetBreakdown.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\ProjectController::sessionBudgetBreakdown
 * @see app/Http/Controllers/Hris/ProjectController.php:110
 * @route '/demo/projects/registry/session/{project}/budget'
 */
sessionBudgetBreakdown.get = (args: { project: string | number } | [project: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: sessionBudgetBreakdown.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\ProjectController::sessionBudgetBreakdown
 * @see app/Http/Controllers/Hris/ProjectController.php:110
 * @route '/demo/projects/registry/session/{project}/budget'
 */
sessionBudgetBreakdown.head = (args: { project: string | number } | [project: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: sessionBudgetBreakdown.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Hris\ProjectController::sessionBudgetBreakdown
 * @see app/Http/Controllers/Hris/ProjectController.php:110
 * @route '/demo/projects/registry/session/{project}/budget'
 */
    const sessionBudgetBreakdownForm = (args: { project: string | number } | [project: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: sessionBudgetBreakdown.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\ProjectController::sessionBudgetBreakdown
 * @see app/Http/Controllers/Hris/ProjectController.php:110
 * @route '/demo/projects/registry/session/{project}/budget'
 */
        sessionBudgetBreakdownForm.get = (args: { project: string | number } | [project: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: sessionBudgetBreakdown.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\ProjectController::sessionBudgetBreakdown
 * @see app/Http/Controllers/Hris/ProjectController.php:110
 * @route '/demo/projects/registry/session/{project}/budget'
 */
        sessionBudgetBreakdownForm.head = (args: { project: string | number } | [project: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: sessionBudgetBreakdown.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    sessionBudgetBreakdown.form = sessionBudgetBreakdownForm
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
* @see \App\Http\Controllers\Hris\ProjectController::project
 * @see app/Http/Controllers/Hris/ProjectController.php:44
 * @route '/demo/projects/registry/{project}'
 */
    const projectForm = (args: { project: string | number } | [project: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: project.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\ProjectController::project
 * @see app/Http/Controllers/Hris/ProjectController.php:44
 * @route '/demo/projects/registry/{project}'
 */
        projectForm.get = (args: { project: string | number } | [project: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: project.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\ProjectController::project
 * @see app/Http/Controllers/Hris/ProjectController.php:44
 * @route '/demo/projects/registry/{project}'
 */
        projectForm.head = (args: { project: string | number } | [project: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: project.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    project.form = projectForm
/**
* @see \App\Http\Controllers\Hris\ProjectController::budgetBreakdown
 * @see app/Http/Controllers/Hris/ProjectController.php:93
 * @route '/demo/projects/registry/{project}/budget'
 */
export const budgetBreakdown = (args: { project: string | number } | [project: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: budgetBreakdown.url(args, options),
    method: 'get',
})

budgetBreakdown.definition = {
    methods: ["get","head"],
    url: '/demo/projects/registry/{project}/budget',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\ProjectController::budgetBreakdown
 * @see app/Http/Controllers/Hris/ProjectController.php:93
 * @route '/demo/projects/registry/{project}/budget'
 */
budgetBreakdown.url = (args: { project: string | number } | [project: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return budgetBreakdown.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\ProjectController::budgetBreakdown
 * @see app/Http/Controllers/Hris/ProjectController.php:93
 * @route '/demo/projects/registry/{project}/budget'
 */
budgetBreakdown.get = (args: { project: string | number } | [project: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: budgetBreakdown.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\ProjectController::budgetBreakdown
 * @see app/Http/Controllers/Hris/ProjectController.php:93
 * @route '/demo/projects/registry/{project}/budget'
 */
budgetBreakdown.head = (args: { project: string | number } | [project: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: budgetBreakdown.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Hris\ProjectController::budgetBreakdown
 * @see app/Http/Controllers/Hris/ProjectController.php:93
 * @route '/demo/projects/registry/{project}/budget'
 */
    const budgetBreakdownForm = (args: { project: string | number } | [project: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: budgetBreakdown.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\ProjectController::budgetBreakdown
 * @see app/Http/Controllers/Hris/ProjectController.php:93
 * @route '/demo/projects/registry/{project}/budget'
 */
        budgetBreakdownForm.get = (args: { project: string | number } | [project: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: budgetBreakdown.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\ProjectController::budgetBreakdown
 * @see app/Http/Controllers/Hris/ProjectController.php:93
 * @route '/demo/projects/registry/{project}/budget'
 */
        budgetBreakdownForm.head = (args: { project: string | number } | [project: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: budgetBreakdown.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    budgetBreakdown.form = budgetBreakdownForm
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
const ProjectController = { index, dashboard, projects, sessionProject, sessionBudgetBreakdown, project, budgetBreakdown, reports }

export default ProjectController