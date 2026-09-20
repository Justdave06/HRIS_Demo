import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
import recordsE88d67 from './records'
/**
* @see \App\Http\Controllers\Hris\DisciplinaryController::index
 * @see app/Http/Controllers/Hris/DisciplinaryController.php:16
 * @route '/demo/disciplinary'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/demo/disciplinary',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\DisciplinaryController::index
 * @see app/Http/Controllers/Hris/DisciplinaryController.php:16
 * @route '/demo/disciplinary'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\DisciplinaryController::index
 * @see app/Http/Controllers/Hris/DisciplinaryController.php:16
 * @route '/demo/disciplinary'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\DisciplinaryController::index
 * @see app/Http/Controllers/Hris/DisciplinaryController.php:16
 * @route '/demo/disciplinary'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Hris\DisciplinaryController::index
 * @see app/Http/Controllers/Hris/DisciplinaryController.php:16
 * @route '/demo/disciplinary'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\DisciplinaryController::index
 * @see app/Http/Controllers/Hris/DisciplinaryController.php:16
 * @route '/demo/disciplinary'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\DisciplinaryController::index
 * @see app/Http/Controllers/Hris/DisciplinaryController.php:16
 * @route '/demo/disciplinary'
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
* @see \App\Http\Controllers\Hris\DisciplinaryController::dashboard
 * @see app/Http/Controllers/Hris/DisciplinaryController.php:26
 * @route '/demo/disciplinary/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/demo/disciplinary/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\DisciplinaryController::dashboard
 * @see app/Http/Controllers/Hris/DisciplinaryController.php:26
 * @route '/demo/disciplinary/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\DisciplinaryController::dashboard
 * @see app/Http/Controllers/Hris/DisciplinaryController.php:26
 * @route '/demo/disciplinary/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\DisciplinaryController::dashboard
 * @see app/Http/Controllers/Hris/DisciplinaryController.php:26
 * @route '/demo/disciplinary/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Hris\DisciplinaryController::dashboard
 * @see app/Http/Controllers/Hris/DisciplinaryController.php:26
 * @route '/demo/disciplinary/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\DisciplinaryController::dashboard
 * @see app/Http/Controllers/Hris/DisciplinaryController.php:26
 * @route '/demo/disciplinary/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\DisciplinaryController::dashboard
 * @see app/Http/Controllers/Hris/DisciplinaryController.php:26
 * @route '/demo/disciplinary/dashboard'
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
* @see \App\Http\Controllers\Hris\DisciplinaryController::records
 * @see app/Http/Controllers/Hris/DisciplinaryController.php:36
 * @route '/demo/disciplinary/records'
 */
export const records = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: records.url(options),
    method: 'get',
})

records.definition = {
    methods: ["get","head"],
    url: '/demo/disciplinary/records',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\DisciplinaryController::records
 * @see app/Http/Controllers/Hris/DisciplinaryController.php:36
 * @route '/demo/disciplinary/records'
 */
records.url = (options?: RouteQueryOptions) => {
    return records.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\DisciplinaryController::records
 * @see app/Http/Controllers/Hris/DisciplinaryController.php:36
 * @route '/demo/disciplinary/records'
 */
records.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: records.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\DisciplinaryController::records
 * @see app/Http/Controllers/Hris/DisciplinaryController.php:36
 * @route '/demo/disciplinary/records'
 */
records.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: records.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Hris\DisciplinaryController::records
 * @see app/Http/Controllers/Hris/DisciplinaryController.php:36
 * @route '/demo/disciplinary/records'
 */
    const recordsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: records.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\DisciplinaryController::records
 * @see app/Http/Controllers/Hris/DisciplinaryController.php:36
 * @route '/demo/disciplinary/records'
 */
        recordsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: records.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\DisciplinaryController::records
 * @see app/Http/Controllers/Hris/DisciplinaryController.php:36
 * @route '/demo/disciplinary/records'
 */
        recordsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: records.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    records.form = recordsForm
/**
* @see \App\Http\Controllers\Hris\DisciplinaryController::reports
 * @see app/Http/Controllers/Hris/DisciplinaryController.php:94
 * @route '/demo/disciplinary/reports'
 */
export const reports = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reports.url(options),
    method: 'get',
})

reports.definition = {
    methods: ["get","head"],
    url: '/demo/disciplinary/reports',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\DisciplinaryController::reports
 * @see app/Http/Controllers/Hris/DisciplinaryController.php:94
 * @route '/demo/disciplinary/reports'
 */
reports.url = (options?: RouteQueryOptions) => {
    return reports.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\DisciplinaryController::reports
 * @see app/Http/Controllers/Hris/DisciplinaryController.php:94
 * @route '/demo/disciplinary/reports'
 */
reports.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reports.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\DisciplinaryController::reports
 * @see app/Http/Controllers/Hris/DisciplinaryController.php:94
 * @route '/demo/disciplinary/reports'
 */
reports.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reports.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Hris\DisciplinaryController::reports
 * @see app/Http/Controllers/Hris/DisciplinaryController.php:94
 * @route '/demo/disciplinary/reports'
 */
    const reportsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: reports.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\DisciplinaryController::reports
 * @see app/Http/Controllers/Hris/DisciplinaryController.php:94
 * @route '/demo/disciplinary/reports'
 */
        reportsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reports.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\DisciplinaryController::reports
 * @see app/Http/Controllers/Hris/DisciplinaryController.php:94
 * @route '/demo/disciplinary/reports'
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
const disciplinary = {
    index: Object.assign(index, index),
dashboard: Object.assign(dashboard, dashboard),
records: Object.assign(records, recordsE88d67),
reports: Object.assign(reports, reports),
}

export default disciplinary