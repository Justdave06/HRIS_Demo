import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Hris\PayrollController::index
 * @see app/Http/Controllers/Hris/PayrollController.php:16
 * @route '/demo/payroll'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/demo/payroll',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\PayrollController::index
 * @see app/Http/Controllers/Hris/PayrollController.php:16
 * @route '/demo/payroll'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\PayrollController::index
 * @see app/Http/Controllers/Hris/PayrollController.php:16
 * @route '/demo/payroll'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\PayrollController::index
 * @see app/Http/Controllers/Hris/PayrollController.php:16
 * @route '/demo/payroll'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Hris\PayrollController::index
 * @see app/Http/Controllers/Hris/PayrollController.php:16
 * @route '/demo/payroll'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\PayrollController::index
 * @see app/Http/Controllers/Hris/PayrollController.php:16
 * @route '/demo/payroll'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\PayrollController::index
 * @see app/Http/Controllers/Hris/PayrollController.php:16
 * @route '/demo/payroll'
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
* @see \App\Http\Controllers\Hris\PayrollController::dashboard
 * @see app/Http/Controllers/Hris/PayrollController.php:25
 * @route '/demo/payroll/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/demo/payroll/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\PayrollController::dashboard
 * @see app/Http/Controllers/Hris/PayrollController.php:25
 * @route '/demo/payroll/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\PayrollController::dashboard
 * @see app/Http/Controllers/Hris/PayrollController.php:25
 * @route '/demo/payroll/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\PayrollController::dashboard
 * @see app/Http/Controllers/Hris/PayrollController.php:25
 * @route '/demo/payroll/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Hris\PayrollController::dashboard
 * @see app/Http/Controllers/Hris/PayrollController.php:25
 * @route '/demo/payroll/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\PayrollController::dashboard
 * @see app/Http/Controllers/Hris/PayrollController.php:25
 * @route '/demo/payroll/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\PayrollController::dashboard
 * @see app/Http/Controllers/Hris/PayrollController.php:25
 * @route '/demo/payroll/dashboard'
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
* @see \App\Http\Controllers\Hris\PayrollController::payslips
 * @see app/Http/Controllers/Hris/PayrollController.php:34
 * @route '/demo/payroll/payslips'
 */
export const payslips = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: payslips.url(options),
    method: 'get',
})

payslips.definition = {
    methods: ["get","head"],
    url: '/demo/payroll/payslips',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\PayrollController::payslips
 * @see app/Http/Controllers/Hris/PayrollController.php:34
 * @route '/demo/payroll/payslips'
 */
payslips.url = (options?: RouteQueryOptions) => {
    return payslips.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\PayrollController::payslips
 * @see app/Http/Controllers/Hris/PayrollController.php:34
 * @route '/demo/payroll/payslips'
 */
payslips.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: payslips.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\PayrollController::payslips
 * @see app/Http/Controllers/Hris/PayrollController.php:34
 * @route '/demo/payroll/payslips'
 */
payslips.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: payslips.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Hris\PayrollController::payslips
 * @see app/Http/Controllers/Hris/PayrollController.php:34
 * @route '/demo/payroll/payslips'
 */
    const payslipsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: payslips.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\PayrollController::payslips
 * @see app/Http/Controllers/Hris/PayrollController.php:34
 * @route '/demo/payroll/payslips'
 */
        payslipsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: payslips.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\PayrollController::payslips
 * @see app/Http/Controllers/Hris/PayrollController.php:34
 * @route '/demo/payroll/payslips'
 */
        payslipsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: payslips.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    payslips.form = payslipsForm
/**
* @see \App\Http\Controllers\Hris\PayrollController::reports
 * @see app/Http/Controllers/Hris/PayrollController.php:43
 * @route '/demo/payroll/reports'
 */
export const reports = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reports.url(options),
    method: 'get',
})

reports.definition = {
    methods: ["get","head"],
    url: '/demo/payroll/reports',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\PayrollController::reports
 * @see app/Http/Controllers/Hris/PayrollController.php:43
 * @route '/demo/payroll/reports'
 */
reports.url = (options?: RouteQueryOptions) => {
    return reports.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\PayrollController::reports
 * @see app/Http/Controllers/Hris/PayrollController.php:43
 * @route '/demo/payroll/reports'
 */
reports.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reports.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\PayrollController::reports
 * @see app/Http/Controllers/Hris/PayrollController.php:43
 * @route '/demo/payroll/reports'
 */
reports.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reports.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Hris\PayrollController::reports
 * @see app/Http/Controllers/Hris/PayrollController.php:43
 * @route '/demo/payroll/reports'
 */
    const reportsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: reports.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\PayrollController::reports
 * @see app/Http/Controllers/Hris/PayrollController.php:43
 * @route '/demo/payroll/reports'
 */
        reportsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reports.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\PayrollController::reports
 * @see app/Http/Controllers/Hris/PayrollController.php:43
 * @route '/demo/payroll/reports'
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
const PayrollController = { index, dashboard, payslips, reports }

export default PayrollController