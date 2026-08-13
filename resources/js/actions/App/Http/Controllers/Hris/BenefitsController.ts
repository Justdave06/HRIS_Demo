import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Hris\BenefitsController::index
 * @see app/Http/Controllers/Hris/BenefitsController.php:16
 * @route '/demo/benefits'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/demo/benefits',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\BenefitsController::index
 * @see app/Http/Controllers/Hris/BenefitsController.php:16
 * @route '/demo/benefits'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\BenefitsController::index
 * @see app/Http/Controllers/Hris/BenefitsController.php:16
 * @route '/demo/benefits'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\BenefitsController::index
 * @see app/Http/Controllers/Hris/BenefitsController.php:16
 * @route '/demo/benefits'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Hris\BenefitsController::index
 * @see app/Http/Controllers/Hris/BenefitsController.php:16
 * @route '/demo/benefits'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\BenefitsController::index
 * @see app/Http/Controllers/Hris/BenefitsController.php:16
 * @route '/demo/benefits'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\BenefitsController::index
 * @see app/Http/Controllers/Hris/BenefitsController.php:16
 * @route '/demo/benefits'
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
* @see \App\Http\Controllers\Hris\BenefitsController::dashboard
 * @see app/Http/Controllers/Hris/BenefitsController.php:25
 * @route '/demo/benefits/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/demo/benefits/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\BenefitsController::dashboard
 * @see app/Http/Controllers/Hris/BenefitsController.php:25
 * @route '/demo/benefits/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\BenefitsController::dashboard
 * @see app/Http/Controllers/Hris/BenefitsController.php:25
 * @route '/demo/benefits/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\BenefitsController::dashboard
 * @see app/Http/Controllers/Hris/BenefitsController.php:25
 * @route '/demo/benefits/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Hris\BenefitsController::dashboard
 * @see app/Http/Controllers/Hris/BenefitsController.php:25
 * @route '/demo/benefits/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\BenefitsController::dashboard
 * @see app/Http/Controllers/Hris/BenefitsController.php:25
 * @route '/demo/benefits/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\BenefitsController::dashboard
 * @see app/Http/Controllers/Hris/BenefitsController.php:25
 * @route '/demo/benefits/dashboard'
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
* @see \App\Http\Controllers\Hris\BenefitsController::plans
 * @see app/Http/Controllers/Hris/BenefitsController.php:34
 * @route '/demo/benefits/plans'
 */
export const plans = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: plans.url(options),
    method: 'get',
})

plans.definition = {
    methods: ["get","head"],
    url: '/demo/benefits/plans',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\BenefitsController::plans
 * @see app/Http/Controllers/Hris/BenefitsController.php:34
 * @route '/demo/benefits/plans'
 */
plans.url = (options?: RouteQueryOptions) => {
    return plans.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\BenefitsController::plans
 * @see app/Http/Controllers/Hris/BenefitsController.php:34
 * @route '/demo/benefits/plans'
 */
plans.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: plans.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\BenefitsController::plans
 * @see app/Http/Controllers/Hris/BenefitsController.php:34
 * @route '/demo/benefits/plans'
 */
plans.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: plans.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Hris\BenefitsController::plans
 * @see app/Http/Controllers/Hris/BenefitsController.php:34
 * @route '/demo/benefits/plans'
 */
    const plansForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: plans.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\BenefitsController::plans
 * @see app/Http/Controllers/Hris/BenefitsController.php:34
 * @route '/demo/benefits/plans'
 */
        plansForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: plans.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\BenefitsController::plans
 * @see app/Http/Controllers/Hris/BenefitsController.php:34
 * @route '/demo/benefits/plans'
 */
        plansForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: plans.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    plans.form = plansForm
/**
* @see \App\Http\Controllers\Hris\BenefitsController::sessionEmployee
 * @see app/Http/Controllers/Hris/BenefitsController.php:68
 * @route '/demo/benefits/employees/session/{employee}'
 */
export const sessionEmployee = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: sessionEmployee.url(args, options),
    method: 'get',
})

sessionEmployee.definition = {
    methods: ["get","head"],
    url: '/demo/benefits/employees/session/{employee}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\BenefitsController::sessionEmployee
 * @see app/Http/Controllers/Hris/BenefitsController.php:68
 * @route '/demo/benefits/employees/session/{employee}'
 */
sessionEmployee.url = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employee: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    employee: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee: args.employee,
                }

    return sessionEmployee.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\BenefitsController::sessionEmployee
 * @see app/Http/Controllers/Hris/BenefitsController.php:68
 * @route '/demo/benefits/employees/session/{employee}'
 */
sessionEmployee.get = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: sessionEmployee.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\BenefitsController::sessionEmployee
 * @see app/Http/Controllers/Hris/BenefitsController.php:68
 * @route '/demo/benefits/employees/session/{employee}'
 */
sessionEmployee.head = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: sessionEmployee.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Hris\BenefitsController::sessionEmployee
 * @see app/Http/Controllers/Hris/BenefitsController.php:68
 * @route '/demo/benefits/employees/session/{employee}'
 */
    const sessionEmployeeForm = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: sessionEmployee.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\BenefitsController::sessionEmployee
 * @see app/Http/Controllers/Hris/BenefitsController.php:68
 * @route '/demo/benefits/employees/session/{employee}'
 */
        sessionEmployeeForm.get = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: sessionEmployee.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\BenefitsController::sessionEmployee
 * @see app/Http/Controllers/Hris/BenefitsController.php:68
 * @route '/demo/benefits/employees/session/{employee}'
 */
        sessionEmployeeForm.head = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: sessionEmployee.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    sessionEmployee.form = sessionEmployeeForm
/**
* @see \App\Http\Controllers\Hris\BenefitsController::employee
 * @see app/Http/Controllers/Hris/BenefitsController.php:43
 * @route '/demo/benefits/employees/{employee}'
 */
export const employee = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: employee.url(args, options),
    method: 'get',
})

employee.definition = {
    methods: ["get","head"],
    url: '/demo/benefits/employees/{employee}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\BenefitsController::employee
 * @see app/Http/Controllers/Hris/BenefitsController.php:43
 * @route '/demo/benefits/employees/{employee}'
 */
employee.url = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employee: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    employee: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee: args.employee,
                }

    return employee.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\BenefitsController::employee
 * @see app/Http/Controllers/Hris/BenefitsController.php:43
 * @route '/demo/benefits/employees/{employee}'
 */
employee.get = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: employee.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\BenefitsController::employee
 * @see app/Http/Controllers/Hris/BenefitsController.php:43
 * @route '/demo/benefits/employees/{employee}'
 */
employee.head = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: employee.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Hris\BenefitsController::employee
 * @see app/Http/Controllers/Hris/BenefitsController.php:43
 * @route '/demo/benefits/employees/{employee}'
 */
    const employeeForm = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: employee.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\BenefitsController::employee
 * @see app/Http/Controllers/Hris/BenefitsController.php:43
 * @route '/demo/benefits/employees/{employee}'
 */
        employeeForm.get = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: employee.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\BenefitsController::employee
 * @see app/Http/Controllers/Hris/BenefitsController.php:43
 * @route '/demo/benefits/employees/{employee}'
 */
        employeeForm.head = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: employee.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    employee.form = employeeForm
/**
* @see \App\Http\Controllers\Hris\BenefitsController::reports
 * @see app/Http/Controllers/Hris/BenefitsController.php:92
 * @route '/demo/benefits/reports'
 */
export const reports = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reports.url(options),
    method: 'get',
})

reports.definition = {
    methods: ["get","head"],
    url: '/demo/benefits/reports',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\BenefitsController::reports
 * @see app/Http/Controllers/Hris/BenefitsController.php:92
 * @route '/demo/benefits/reports'
 */
reports.url = (options?: RouteQueryOptions) => {
    return reports.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\BenefitsController::reports
 * @see app/Http/Controllers/Hris/BenefitsController.php:92
 * @route '/demo/benefits/reports'
 */
reports.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reports.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\BenefitsController::reports
 * @see app/Http/Controllers/Hris/BenefitsController.php:92
 * @route '/demo/benefits/reports'
 */
reports.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reports.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Hris\BenefitsController::reports
 * @see app/Http/Controllers/Hris/BenefitsController.php:92
 * @route '/demo/benefits/reports'
 */
    const reportsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: reports.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\BenefitsController::reports
 * @see app/Http/Controllers/Hris/BenefitsController.php:92
 * @route '/demo/benefits/reports'
 */
        reportsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reports.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\BenefitsController::reports
 * @see app/Http/Controllers/Hris/BenefitsController.php:92
 * @route '/demo/benefits/reports'
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
const BenefitsController = { index, dashboard, plans, sessionEmployee, employee, reports }

export default BenefitsController