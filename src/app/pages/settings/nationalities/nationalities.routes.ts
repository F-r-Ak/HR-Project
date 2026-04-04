import { Routes } from '@angular/router';

export const nationalitiesRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/nationalities/nationalities.component').then((c) => c.NationalitiesComponent),
        data: { pageTitle: 'الجنسيات', pageType: 'list' }
    },
    {
        path: 'add',
        loadComponent: () => import('./components/add-edit-nationality/add-edit-nationality.component').then((c) => c.AddEditNationalityComponent),

        data: { pageTitle: 'اضافة جنسية', pageType: 'add' }
    },
    {
        path: 'edit/:id',
        loadComponent: () => import('./components/add-edit-nationality/add-edit-nationality.component').then((c) => c.AddEditNationalityComponent),

        data: { pageTitle: 'تعديل جنسية', pageType: 'edit' }
    },
    {
        path: 'view/:id',
        loadComponent: () => import('./components/nationality/nationality.component').then((c) => c.NationalityComponent),

        data: { pageTitle: 'عرض جنسية', pageType: 'view' }
    }
];
