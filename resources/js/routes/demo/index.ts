import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import employees from './employees'
import recruitment from './recruitment'
import attendance from './attendance'
import leave from './leave'
import payroll from './payroll'
import benefits from './benefits'
import performance from './performance'
import training from './training'
import disciplinary from './disciplinary'
import offboarding from './offboarding'
import portal from './portal'
import modules from './modules'
/**
* @see \App\Http\Controllers\Hris\HubController::hub
 * @see app/Http/Controllers/Hris/HubController.php:16
 * @route '/demo'
 */
export const hub = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: hub.url(options),
    method: 'get',
})

hub.definition = {
    methods: ["get","head"],
    url: '/demo',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\HubController::hub
 * @see app/Http/Controllers/Hris/HubController.php:16
 * @route '/demo'
 */
hub.url = (options?: RouteQueryOptions) => {
    return hub.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\HubController::hub
 * @see app/Http/Controllers/Hris/HubController.php:16
 * @route '/demo'
 */
hub.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: hub.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\HubController::hub
 * @see app/Http/Controllers/Hris/HubController.php:16
 * @route '/demo'
 */
hub.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: hub.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Hris\HubController::hub
 * @see app/Http/Controllers/Hris/HubController.php:16
 * @route '/demo'
 */
    const hubForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: hub.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\HubController::hub
 * @see app/Http/Controllers/Hris/HubController.php:16
 * @route '/demo'
 */
        hubForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: hub.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\HubController::hub
 * @see app/Http/Controllers/Hris/HubController.php:16
 * @route '/demo'
 */
        hubForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: hub.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    hub.form = hubForm
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
const demo = {
    hub: Object.assign(hub, hub),
mode: Object.assign(mode, mode),
employees: Object.assign(employees, employees),
recruitment: Object.assign(recruitment, recruitment),
attendance: Object.assign(attendance, attendance),
leave: Object.assign(leave, leave),
payroll: Object.assign(payroll, payroll),
benefits: Object.assign(benefits, benefits),
performance: Object.assign(performance, performance),
training: Object.assign(training, training),
disciplinary: Object.assign(disciplinary, disciplinary),
offboarding: Object.assign(offboarding, offboarding),
portal: Object.assign(portal, portal),
modules: Object.assign(modules, modules),
}

export default demo