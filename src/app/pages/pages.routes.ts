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
                path: 'financial-degrees',
                loadChildren: () => import('./settings/financial-degrees/financial-degrees.routes').then((m) => m.financialDegreesRoutes)
            }
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
