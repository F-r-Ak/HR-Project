import { Routes } from '@angular/router';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';

export default [
    {
        path: 'settings',
        children: [
            {
                path: 'tests',
                loadChildren: () => import('./tests/tests.routes').then((m) => m.testsRoutes)
            },
            {
                path: 'ministries',
                loadChildren: () => import('./settings/ministries/ministries.routes').then((m) => m.ministriesRoutes)
            },
            {
                path: 'organizations',
                loadChildren: () => import('./settings/organizations/organizations.routes').then((m) => m.organizationsRoutes)
            },
            {
                path: 'jobs',
                loadChildren: () => import('./settings/jobs/jobs.routes').then((m) => m.JobsRoutes)
            },
            {
                path: 'qualifications',
                loadChildren: () => import('./settings/qualifications/qualifications.routes').then((m) => m.qualificationsRoutes)
            },
            {
                path: 'higher-qualifications',
                loadChildren: () => import('./settings/higher-qualifications/higher-qualifications.routes').then((m) => m.higherQualificationsRoutes)
            },
            {
                path: 'financial-degrees',
                loadChildren: () => import('./settings/financial-degrees/financial-degrees.routes').then((m) => m.financialDegreesRoutes)
            }
            ,
            {
                path: 'nationalities',
                loadChildren: () => import('./settings/nationalities/nationalities.routes').then((m) => m.nationalitiesRoutes)
            },
            {
                path: 'departments',
                loadChildren: () => import('./settings/departments/departments.routes').then((m) => m.departmentsRoutes)
            },
            {
                path: 'document-types',
                loadChildren: () => import('./settings/document-types/document-types.routes').then((m) => m.documentTypesRoutes)
            }
        ]
    },{
        path: 'hr',
        children: [
            {
                path: 'employees',
                loadChildren: () => import('./hr/employees/employees.routes').then((m) => m.employeesRoutes)
            },
        ]
    },
    {
        path: 'auth',
        children: [
            {
                path: 'users',
                loadChildren: () => import('./auth/users/users.routes').then((m) => m.UsersRoutes)
            },
            {
                path: 'roles',
                loadChildren: () => import('./auth/roles/roles.routes').then((m) => m.RolesRoutes)
            },
            {
                path: 'modules',
                loadChildren: () => import('./auth/modules/modules.routes').then((m) => m.ModulesRoutes)
            }
        ]
    },
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
