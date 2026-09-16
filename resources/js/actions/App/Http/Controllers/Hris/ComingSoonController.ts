import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
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
const ComingSoonController = { show }

export default ComingSoonController