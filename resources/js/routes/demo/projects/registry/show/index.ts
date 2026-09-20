import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Hris\ProjectController::budget
 * @see app/Http/Controllers/Hris/ProjectController.php:93
 * @route '/demo/projects/registry/{project}/budget'
 */
export const budget = (args: { project: string | number } | [project: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: budget.url(args, options),
    method: 'get',
})

budget.definition = {
    methods: ["get","head"],
    url: '/demo/projects/registry/{project}/budget',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\ProjectController::budget
 * @see app/Http/Controllers/Hris/ProjectController.php:93
 * @route '/demo/projects/registry/{project}/budget'
 */
budget.url = (args: { project: string | number } | [project: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return budget.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\ProjectController::budget
 * @see app/Http/Controllers/Hris/ProjectController.php:93
 * @route '/demo/projects/registry/{project}/budget'
 */
budget.get = (args: { project: string | number } | [project: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: budget.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\ProjectController::budget
 * @see app/Http/Controllers/Hris/ProjectController.php:93
 * @route '/demo/projects/registry/{project}/budget'
 */
budget.head = (args: { project: string | number } | [project: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: budget.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Hris\ProjectController::budget
 * @see app/Http/Controllers/Hris/ProjectController.php:93
 * @route '/demo/projects/registry/{project}/budget'
 */
    const budgetForm = (args: { project: string | number } | [project: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: budget.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\ProjectController::budget
 * @see app/Http/Controllers/Hris/ProjectController.php:93
 * @route '/demo/projects/registry/{project}/budget'
 */
        budgetForm.get = (args: { project: string | number } | [project: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: budget.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\ProjectController::budget
 * @see app/Http/Controllers/Hris/ProjectController.php:93
 * @route '/demo/projects/registry/{project}/budget'
 */
        budgetForm.head = (args: { project: string | number } | [project: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: budget.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    budget.form = budgetForm
const show = {
    budget: Object.assign(budget, budget),
}

export default show