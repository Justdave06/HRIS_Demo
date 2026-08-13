import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Hris\ComingSoonController::show
 * @see app/Http/Controllers/Hris/ComingSoonController.php:14
 * @route '/demo/modules/{module}'
 */
export const show = (args: { module: string | number } | [module: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/demo/modules/{module}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\ComingSoonController::show
 * @see app/Http/Controllers/Hris/ComingSoonController.php:14
 * @route '/demo/modules/{module}'
 */
show.url = (args: { module: string | number } | [module: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { module: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    module: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        module: args.module,
                }

    return show.definition.url
            .replace('{module}', parsedArgs.module.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\ComingSoonController::show
 * @see app/Http/Controllers/Hris/ComingSoonController.php:14
 * @route '/demo/modules/{module}'
 */
show.get = (args: { module: string | number } | [module: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\ComingSoonController::show
 * @see app/Http/Controllers/Hris/ComingSoonController.php:14
 * @route '/demo/modules/{module}'
 */
show.head = (args: { module: string | number } | [module: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Hris\ComingSoonController::show
 * @see app/Http/Controllers/Hris/ComingSoonController.php:14
 * @route '/demo/modules/{module}'
 */
    const showForm = (args: { module: string | number } | [module: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\ComingSoonController::show
 * @see app/Http/Controllers/Hris/ComingSoonController.php:14
 * @route '/demo/modules/{module}'
 */
        showForm.get = (args: { module: string | number } | [module: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\ComingSoonController::show
 * @see app/Http/Controllers/Hris/ComingSoonController.php:14
 * @route '/demo/modules/{module}'
 */
        showForm.head = (args: { module: string | number } | [module: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const modules = {
    show: Object.assign(show, show),
}

export default modules