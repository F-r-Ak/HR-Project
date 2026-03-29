import { Routes } from '@angular/router';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';

export default [
    {
        path: 'manage',
        children: [
            {
                path: 'tests',
                loadChildren: () => import('./tests/tests.routes').then((m) => m.testsRoutes)
            },
            {
                path: 'sections',
                loadChildren: () => import('./Lookup/sections/sections.routes').then((m) => m.sectionsRoutes)
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
