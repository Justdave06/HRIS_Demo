import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Hris\HubController::index
 * @see app/Http/Controllers/Hris/HubController.php:16
 * @route '/'
 */
const index980bb49ee7ae63891f1d891d2fbcf1c9 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index980bb49ee7ae63891f1d891d2fbcf1c9.url(options),
    method: 'get',
})

index980bb49ee7ae63891f1d891d2fbcf1c9.definition = {
    methods: ["get","head"],
    url: '/',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\HubController::index
 * @see app/Http/Controllers/Hris/HubController.php:16
 * @route '/'
 */
index980bb49ee7ae63891f1d891d2fbcf1c9.url = (options?: RouteQueryOptions) => {
    return index980bb49ee7ae63891f1d891d2fbcf1c9.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\HubController::index
 * @see app/Http/Controllers/Hris/HubController.php:16
 * @route '/'
 */
index980bb49ee7ae63891f1d891d2fbcf1c9.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index980bb49ee7ae63891f1d891d2fbcf1c9.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\HubController::index
 * @see app/Http/Controllers/Hris/HubController.php:16
 * @route '/'
 */
index980bb49ee7ae63891f1d891d2fbcf1c9.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index980bb49ee7ae63891f1d891d2fbcf1c9.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Hris\HubController::index
 * @see app/Http/Controllers/Hris/HubController.php:16
 * @route '/'
 */
    const index980bb49ee7ae63891f1d891d2fbcf1c9Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index980bb49ee7ae63891f1d891d2fbcf1c9.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\HubController::index
 * @see app/Http/Controllers/Hris/HubController.php:16
 * @route '/'
 */
        index980bb49ee7ae63891f1d891d2fbcf1c9Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index980bb49ee7ae63891f1d891d2fbcf1c9.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\HubController::index
 * @see app/Http/Controllers/Hris/HubController.php:16
 * @route '/'
 */
        index980bb49ee7ae63891f1d891d2fbcf1c9Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index980bb49ee7ae63891f1d891d2fbcf1c9.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index980bb49ee7ae63891f1d891d2fbcf1c9.form = index980bb49ee7ae63891f1d891d2fbcf1c9Form
    /**
* @see \App\Http\Controllers\Hris\HubController::index
 * @see app/Http/Controllers/Hris/HubController.php:16
 * @route '/demo'
 */
const index0efea5765db02e3af45380ee625e3ea3 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index0efea5765db02e3af45380ee625e3ea3.url(options),
    method: 'get',
})

index0efea5765db02e3af45380ee625e3ea3.definition = {
    methods: ["get","head"],
    url: '/demo',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\HubController::index
 * @see app/Http/Controllers/Hris/HubController.php:16
 * @route '/demo'
 */
index0efea5765db02e3af45380ee625e3ea3.url = (options?: RouteQueryOptions) => {
    return index0efea5765db02e3af45380ee625e3ea3.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\HubController::index
 * @see app/Http/Controllers/Hris/HubController.php:16
 * @route '/demo'
 */
index0efea5765db02e3af45380ee625e3ea3.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index0efea5765db02e3af45380ee625e3ea3.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\HubController::index
 * @see app/Http/Controllers/Hris/HubController.php:16
 * @route '/demo'
 */
index0efea5765db02e3af45380ee625e3ea3.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index0efea5765db02e3af45380ee625e3ea3.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Hris\HubController::index
 * @see app/Http/Controllers/Hris/HubController.php:16
 * @route '/demo'
 */
    const index0efea5765db02e3af45380ee625e3ea3Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index0efea5765db02e3af45380ee625e3ea3.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\HubController::index
 * @see app/Http/Controllers/Hris/HubController.php:16
 * @route '/demo'
 */
        index0efea5765db02e3af45380ee625e3ea3Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index0efea5765db02e3af45380ee625e3ea3.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\HubController::index
 * @see app/Http/Controllers/Hris/HubController.php:16
 * @route '/demo'
 */
        index0efea5765db02e3af45380ee625e3ea3Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index0efea5765db02e3af45380ee625e3ea3.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index0efea5765db02e3af45380ee625e3ea3.form = index0efea5765db02e3af45380ee625e3ea3Form

/**
* Multiple routes resolve to \App\Http\Controllers\Hris\HubController::index, so this export is a
* dictionary keyed by URI rather than a callable. Call a specific route with `index['<uri>'](...)`,
* or import the route by name from your generated `routes/` directory.
*/
export const index = {
    '/': index980bb49ee7ae63891f1d891d2fbcf1c9,
    '/demo': index0efea5765db02e3af45380ee625e3ea3,
}

/**
* @see \App\Http\Controllers\Hris\HubController::mode
 * @see app/Http/Controllers/Hris/HubController.php:29
 * @route '/demo/mode/{mode}'
 */
export const mode = (args: { mode: string | number } | [mode: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: mode.url(args, options),
    method: 'get',
})

mode.definition = {
    methods: ["get","head"],
    url: '/demo/mode/{mode}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\HubController::mode
 * @see app/Http/Controllers/Hris/HubController.php:29
 * @route '/demo/mode/{mode}'
 */
mode.url = (args: { mode: string | number } | [mode: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { mode: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    mode: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        mode: args.mode,
                }

    return mode.definition.url
            .replace('{mode}', parsedArgs.mode.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\HubController::mode
 * @see app/Http/Controllers/Hris/HubController.php:29
 * @route '/demo/mode/{mode}'
 */
mode.get = (args: { mode: string | number } | [mode: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: mode.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\HubController::mode
 * @see app/Http/Controllers/Hris/HubController.php:29
 * @route '/demo/mode/{mode}'
 */
mode.head = (args: { mode: string | number } | [mode: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: mode.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Hris\HubController::mode
 * @see app/Http/Controllers/Hris/HubController.php:29
 * @route '/demo/mode/{mode}'
 */
    const modeForm = (args: { mode: string | number } | [mode: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: mode.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\HubController::mode
 * @see app/Http/Controllers/Hris/HubController.php:29
 * @route '/demo/mode/{mode}'
 */
        modeForm.get = (args: { mode: string | number } | [mode: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: mode.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\HubController::mode
 * @see app/Http/Controllers/Hris/HubController.php:29
 * @route '/demo/mode/{mode}'
 */
        modeForm.head = (args: { mode: string | number } | [mode: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: mode.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    mode.form = modeForm
const HubController = { index, mode }

export default HubController