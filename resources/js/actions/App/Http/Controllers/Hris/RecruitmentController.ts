import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Hris\RecruitmentController::index
 * @see app/Http/Controllers/Hris/RecruitmentController.php:17
 * @route '/demo/recruitment'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/demo/recruitment',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\RecruitmentController::index
 * @see app/Http/Controllers/Hris/RecruitmentController.php:17
 * @route '/demo/recruitment'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\RecruitmentController::index
 * @see app/Http/Controllers/Hris/RecruitmentController.php:17
 * @route '/demo/recruitment'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\RecruitmentController::index
 * @see app/Http/Controllers/Hris/RecruitmentController.php:17
 * @route '/demo/recruitment'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Hris\RecruitmentController::index
 * @see app/Http/Controllers/Hris/RecruitmentController.php:17
 * @route '/demo/recruitment'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\RecruitmentController::index
 * @see app/Http/Controllers/Hris/RecruitmentController.php:17
 * @route '/demo/recruitment'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\RecruitmentController::index
 * @see app/Http/Controllers/Hris/RecruitmentController.php:17
 * @route '/demo/recruitment'
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
* @see \App\Http\Controllers\Hris\RecruitmentController::dashboard
 * @see app/Http/Controllers/Hris/RecruitmentController.php:25
 * @route '/demo/recruitment/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/demo/recruitment/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\RecruitmentController::dashboard
 * @see app/Http/Controllers/Hris/RecruitmentController.php:25
 * @route '/demo/recruitment/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\RecruitmentController::dashboard
 * @see app/Http/Controllers/Hris/RecruitmentController.php:25
 * @route '/demo/recruitment/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\RecruitmentController::dashboard
 * @see app/Http/Controllers/Hris/RecruitmentController.php:25
 * @route '/demo/recruitment/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Hris\RecruitmentController::dashboard
 * @see app/Http/Controllers/Hris/RecruitmentController.php:25
 * @route '/demo/recruitment/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\RecruitmentController::dashboard
 * @see app/Http/Controllers/Hris/RecruitmentController.php:25
 * @route '/demo/recruitment/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\RecruitmentController::dashboard
 * @see app/Http/Controllers/Hris/RecruitmentController.php:25
 * @route '/demo/recruitment/dashboard'
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
* @see \App\Http\Controllers\Hris\RecruitmentController::vacancies
 * @see app/Http/Controllers/Hris/RecruitmentController.php:41
 * @route '/demo/recruitment/vacancies'
 */
export const vacancies = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: vacancies.url(options),
    method: 'get',
})

vacancies.definition = {
    methods: ["get","head"],
    url: '/demo/recruitment/vacancies',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\RecruitmentController::vacancies
 * @see app/Http/Controllers/Hris/RecruitmentController.php:41
 * @route '/demo/recruitment/vacancies'
 */
vacancies.url = (options?: RouteQueryOptions) => {
    return vacancies.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\RecruitmentController::vacancies
 * @see app/Http/Controllers/Hris/RecruitmentController.php:41
 * @route '/demo/recruitment/vacancies'
 */
vacancies.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: vacancies.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\RecruitmentController::vacancies
 * @see app/Http/Controllers/Hris/RecruitmentController.php:41
 * @route '/demo/recruitment/vacancies'
 */
vacancies.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: vacancies.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Hris\RecruitmentController::vacancies
 * @see app/Http/Controllers/Hris/RecruitmentController.php:41
 * @route '/demo/recruitment/vacancies'
 */
    const vacanciesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: vacancies.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\RecruitmentController::vacancies
 * @see app/Http/Controllers/Hris/RecruitmentController.php:41
 * @route '/demo/recruitment/vacancies'
 */
        vacanciesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: vacancies.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\RecruitmentController::vacancies
 * @see app/Http/Controllers/Hris/RecruitmentController.php:41
 * @route '/demo/recruitment/vacancies'
 */
        vacanciesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: vacancies.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    vacancies.form = vacanciesForm
/**
* @see \App\Http\Controllers\Hris\RecruitmentController::reports
 * @see app/Http/Controllers/Hris/RecruitmentController.php:57
 * @route '/demo/recruitment/reports'
 */
export const reports = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reports.url(options),
    method: 'get',
})

reports.definition = {
    methods: ["get","head"],
    url: '/demo/recruitment/reports',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Hris\RecruitmentController::reports
 * @see app/Http/Controllers/Hris/RecruitmentController.php:57
 * @route '/demo/recruitment/reports'
 */
reports.url = (options?: RouteQueryOptions) => {
    return reports.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hris\RecruitmentController::reports
 * @see app/Http/Controllers/Hris/RecruitmentController.php:57
 * @route '/demo/recruitment/reports'
 */
reports.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reports.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Hris\RecruitmentController::reports
 * @see app/Http/Controllers/Hris/RecruitmentController.php:57
 * @route '/demo/recruitment/reports'
 */
reports.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reports.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Hris\RecruitmentController::reports
 * @see app/Http/Controllers/Hris/RecruitmentController.php:57
 * @route '/demo/recruitment/reports'
 */
    const reportsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: reports.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Hris\RecruitmentController::reports
 * @see app/Http/Controllers/Hris/RecruitmentController.php:57
 * @route '/demo/recruitment/reports'
 */
        reportsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reports.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Hris\RecruitmentController::reports
 * @see app/Http/Controllers/Hris/RecruitmentController.php:57
 * @route '/demo/recruitment/reports'
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
const RecruitmentController = { index, dashboard, vacancies, reports }

export default RecruitmentController