import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Hris\OffboardingController::index
 * @see app/Http/Controllers/Hris/OffboardingController.php:17
 * @route '/demo/offboarding'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/demo/offboarding',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\OffboardingController::index
 * @see app/Http/Controllers/Hris/OffboardingController.php:17
 * @route '/demo/offboarding'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\OffboardingController::index
 * @see app/Http/Controllers/Hris/OffboardingController.php:17
 * @route '/demo/offboarding'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\OffboardingController::index
 * @see app/Http/Controllers/Hris/OffboardingController.php:17
 * @route '/demo/offboarding'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Hris\OffboardingController::index
 * @see app/Http/Controllers/Hris/OffboardingController.php:17
 * @route '/demo/offboarding'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\OffboardingController::index
 * @see app/Http/Controllers/Hris/OffboardingController.php:17
 * @route '/demo/offboarding'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\OffboardingController::index
 * @see app/Http/Controllers/Hris/OffboardingController.php:17
 * @route '/demo/offboarding'
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
* @see \App\Http\Controllers\Hris\OffboardingController::dashboard
 * @see app/Http/Controllers/Hris/OffboardingController.php:26
 * @route '/demo/offboarding/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/demo/offboarding/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\OffboardingController::dashboard
 * @see app/Http/Controllers/Hris/OffboardingController.php:26
 * @route '/demo/offboarding/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\OffboardingController::dashboard
 * @see app/Http/Controllers/Hris/OffboardingController.php:26
 * @route '/demo/offboarding/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\OffboardingController::dashboard
 * @see app/Http/Controllers/Hris/OffboardingController.php:26
 * @route '/demo/offboarding/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Hris\OffboardingController::dashboard
 * @see app/Http/Controllers/Hris/OffboardingController.php:26
 * @route '/demo/offboarding/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\OffboardingController::dashboard
 * @see app/Http/Controllers/Hris/OffboardingController.php:26
 * @route '/demo/offboarding/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\OffboardingController::dashboard
 * @see app/Http/Controllers/Hris/OffboardingController.php:26
 * @route '/demo/offboarding/dashboard'
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
* @see \App\Http\Controllers\Hris\OffboardingController::cases
 * @see app/Http/Controllers/Hris/OffboardingController.php:35
 * @route '/demo/offboarding/cases'
 */
export const cases = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cases.url(options),
    method: 'get',
})

cases.definition = {
    methods: ["get","head"],
    url: '/demo/offboarding/cases',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\OffboardingController::cases
 * @see app/Http/Controllers/Hris/OffboardingController.php:35
 * @route '/demo/offboarding/cases'
 */
cases.url = (options?: RouteQueryOptions) => {
    return cases.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\OffboardingController::cases
 * @see app/Http/Controllers/Hris/OffboardingController.php:35
 * @route '/demo/offboarding/cases'
 */
cases.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cases.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\OffboardingController::cases
 * @see app/Http/Controllers/Hris/OffboardingController.php:35
 * @route '/demo/offboarding/cases'
 */
cases.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: cases.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Hris\OffboardingController::cases
 * @see app/Http/Controllers/Hris/OffboardingController.php:35
 * @route '/demo/offboarding/cases'
 */
    const casesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: cases.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\OffboardingController::cases
 * @see app/Http/Controllers/Hris/OffboardingController.php:35
 * @route '/demo/offboarding/cases'
 */
        casesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: cases.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\OffboardingController::cases
 * @see app/Http/Controllers/Hris/OffboardingController.php:35
 * @route '/demo/offboarding/cases'
 */
        casesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: cases.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    cases.form = casesForm
/**
* @see \App\Http\Controllers\Hris\OffboardingController::sessionCase
 * @see app/Http/Controllers/Hris/OffboardingController.php:69
 * @route '/demo/offboarding/cases/session/{employee}'
 */
export const sessionCase = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: sessionCase.url(args, options),
    method: 'get',
})

sessionCase.definition = {
    methods: ["get","head"],
    url: '/demo/offboarding/cases/session/{employee}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\OffboardingController::sessionCase
 * @see app/Http/Controllers/Hris/OffboardingController.php:69
 * @route '/demo/offboarding/cases/session/{employee}'
 */
sessionCase.url = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return sessionCase.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\OffboardingController::sessionCase
 * @see app/Http/Controllers/Hris/OffboardingController.php:69
 * @route '/demo/offboarding/cases/session/{employee}'
 */
sessionCase.get = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: sessionCase.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\OffboardingController::sessionCase
 * @see app/Http/Controllers/Hris/OffboardingController.php:69
 * @route '/demo/offboarding/cases/session/{employee}'
 */
sessionCase.head = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: sessionCase.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Hris\OffboardingController::sessionCase
 * @see app/Http/Controllers/Hris/OffboardingController.php:69
 * @route '/demo/offboarding/cases/session/{employee}'
 */
    const sessionCaseForm = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: sessionCase.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\OffboardingController::sessionCase
 * @see app/Http/Controllers/Hris/OffboardingController.php:69
 * @route '/demo/offboarding/cases/session/{employee}'
 */
        sessionCaseForm.get = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: sessionCase.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\OffboardingController::sessionCase
 * @see app/Http/Controllers/Hris/OffboardingController.php:69
 * @route '/demo/offboarding/cases/session/{employee}'
 */
        sessionCaseForm.head = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: sessionCase.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    sessionCase.form = sessionCaseForm
/**
* @see \App\Http\Controllers\Hris\OffboardingController::caseMethod
 * @see app/Http/Controllers/Hris/OffboardingController.php:44
 * @route '/demo/offboarding/cases/{employee}'
 */
export const caseMethod = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: caseMethod.url(args, options),
    method: 'get',
})

caseMethod.definition = {
    methods: ["get","head"],
    url: '/demo/offboarding/cases/{employee}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\OffboardingController::caseMethod
 * @see app/Http/Controllers/Hris/OffboardingController.php:44
 * @route '/demo/offboarding/cases/{employee}'
 */
caseMethod.url = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return caseMethod.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\OffboardingController::caseMethod
 * @see app/Http/Controllers/Hris/OffboardingController.php:44
 * @route '/demo/offboarding/cases/{employee}'
 */
caseMethod.get = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: caseMethod.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\OffboardingController::caseMethod
 * @see app/Http/Controllers/Hris/OffboardingController.php:44
 * @route '/demo/offboarding/cases/{employee}'
 */
caseMethod.head = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: caseMethod.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Hris\OffboardingController::caseMethod
 * @see app/Http/Controllers/Hris/OffboardingController.php:44
 * @route '/demo/offboarding/cases/{employee}'
 */
    const caseMethodForm = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: caseMethod.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\OffboardingController::caseMethod
 * @see app/Http/Controllers/Hris/OffboardingController.php:44
 * @route '/demo/offboarding/cases/{employee}'
 */
        caseMethodForm.get = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: caseMethod.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\OffboardingController::caseMethod
 * @see app/Http/Controllers/Hris/OffboardingController.php:44
 * @route '/demo/offboarding/cases/{employee}'
 */
        caseMethodForm.head = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: caseMethod.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    caseMethod.form = caseMethodForm
/**
* @see \App\Http\Controllers\Hris\OffboardingController::sessionEmployeeOverview
 * @see app/Http/Controllers/Hris/OffboardingController.php:116
 * @route '/demo/offboarding/employees/session/{employee}'
 */
export const sessionEmployeeOverview = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: sessionEmployeeOverview.url(args, options),
    method: 'get',
})

sessionEmployeeOverview.definition = {
    methods: ["get","head"],
    url: '/demo/offboarding/employees/session/{employee}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\OffboardingController::sessionEmployeeOverview
 * @see app/Http/Controllers/Hris/OffboardingController.php:116
 * @route '/demo/offboarding/employees/session/{employee}'
 */
sessionEmployeeOverview.url = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return sessionEmployeeOverview.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\OffboardingController::sessionEmployeeOverview
 * @see app/Http/Controllers/Hris/OffboardingController.php:116
 * @route '/demo/offboarding/employees/session/{employee}'
 */
sessionEmployeeOverview.get = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: sessionEmployeeOverview.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\OffboardingController::sessionEmployeeOverview
 * @see app/Http/Controllers/Hris/OffboardingController.php:116
 * @route '/demo/offboarding/employees/session/{employee}'
 */
sessionEmployeeOverview.head = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: sessionEmployeeOverview.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Hris\OffboardingController::sessionEmployeeOverview
 * @see app/Http/Controllers/Hris/OffboardingController.php:116
 * @route '/demo/offboarding/employees/session/{employee}'
 */
    const sessionEmployeeOverviewForm = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: sessionEmployeeOverview.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\OffboardingController::sessionEmployeeOverview
 * @see app/Http/Controllers/Hris/OffboardingController.php:116
 * @route '/demo/offboarding/employees/session/{employee}'
 */
        sessionEmployeeOverviewForm.get = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: sessionEmployeeOverview.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\OffboardingController::sessionEmployeeOverview
 * @see app/Http/Controllers/Hris/OffboardingController.php:116
 * @route '/demo/offboarding/employees/session/{employee}'
 */
        sessionEmployeeOverviewForm.head = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: sessionEmployeeOverview.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    sessionEmployeeOverview.form = sessionEmployeeOverviewForm
/**
* @see \App\Http\Controllers\Hris\OffboardingController::employeeOverview
 * @see app/Http/Controllers/Hris/OffboardingController.php:94
 * @route '/demo/offboarding/employees/{employee}'
 */
export const employeeOverview = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: employeeOverview.url(args, options),
    method: 'get',
})

employeeOverview.definition = {
    methods: ["get","head"],
    url: '/demo/offboarding/employees/{employee}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\OffboardingController::employeeOverview
 * @see app/Http/Controllers/Hris/OffboardingController.php:94
 * @route '/demo/offboarding/employees/{employee}'
 */
employeeOverview.url = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return employeeOverview.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\OffboardingController::employeeOverview
 * @see app/Http/Controllers/Hris/OffboardingController.php:94
 * @route '/demo/offboarding/employees/{employee}'
 */
employeeOverview.get = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: employeeOverview.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\OffboardingController::employeeOverview
 * @see app/Http/Controllers/Hris/OffboardingController.php:94
 * @route '/demo/offboarding/employees/{employee}'
 */
employeeOverview.head = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: employeeOverview.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Hris\OffboardingController::employeeOverview
 * @see app/Http/Controllers/Hris/OffboardingController.php:94
 * @route '/demo/offboarding/employees/{employee}'
 */
    const employeeOverviewForm = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: employeeOverview.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\OffboardingController::employeeOverview
 * @see app/Http/Controllers/Hris/OffboardingController.php:94
 * @route '/demo/offboarding/employees/{employee}'
 */
        employeeOverviewForm.get = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: employeeOverview.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\OffboardingController::employeeOverview
 * @see app/Http/Controllers/Hris/OffboardingController.php:94
 * @route '/demo/offboarding/employees/{employee}'
 */
        employeeOverviewForm.head = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: employeeOverview.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    employeeOverview.form = employeeOverviewForm
/**
* @see \App\Http\Controllers\Hris\OffboardingController::reports
 * @see app/Http/Controllers/Hris/OffboardingController.php:154
 * @route '/demo/offboarding/reports'
 */
export const reports = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reports.url(options),
    method: 'get',
})

reports.definition = {
    methods: ["get","head"],
    url: '/demo/offboarding/reports',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\OffboardingController::reports
 * @see app/Http/Controllers/Hris/OffboardingController.php:154
 * @route '/demo/offboarding/reports'
 */
reports.url = (options?: RouteQueryOptions) => {
    return reports.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\OffboardingController::reports
 * @see app/Http/Controllers/Hris/OffboardingController.php:154
 * @route '/demo/offboarding/reports'
 */
reports.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reports.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\OffboardingController::reports
 * @see app/Http/Controllers/Hris/OffboardingController.php:154
 * @route '/demo/offboarding/reports'
 */
reports.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reports.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Hris\OffboardingController::reports
 * @see app/Http/Controllers/Hris/OffboardingController.php:154
 * @route '/demo/offboarding/reports'
 */
    const reportsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: reports.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\OffboardingController::reports
 * @see app/Http/Controllers/Hris/OffboardingController.php:154
 * @route '/demo/offboarding/reports'
 */
        reportsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reports.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\OffboardingController::reports
 * @see app/Http/Controllers/Hris/OffboardingController.php:154
 * @route '/demo/offboarding/reports'
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
const OffboardingController = { index, dashboard, cases, sessionCase, caseMethod, sessionEmployeeOverview, employeeOverview, reports, case: caseMethod }

export default OffboardingController