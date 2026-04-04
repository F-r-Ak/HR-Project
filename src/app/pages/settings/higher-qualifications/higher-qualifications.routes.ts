import { Routes } from '@angular/router';

export const higherQualificationsRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/higher-qualifications/higher-qualifications.component').then((c) => c.HigherQualificationsComponent),
        data: { pageTitle: 'المؤهلات العليا', pageType: 'list' }
    },
    {
        path: 'add',
        loadComponent: () => import('./components/add-edit-higher-qualification/add-edit-higher-qualification.component').then((c) => c.AddEditHigherQualificationComponent),

        data: { pageTitle: 'اضافة مؤهل عالي', pageType: 'add' }
    },
    {
        path: 'edit/:id',
        loadComponent: () => import('./components/add-edit-higher-qualification/add-edit-higher-qualification.component').then((c) => c.AddEditHigherQualificationComponent),

        data: { pageTitle: 'تعديل مؤهل عالي', pageType: 'edit' }
    },
    {
        path: 'view/:id',
        loadComponent: () => import('./components/higher-qualification/higher-qualification.component').then((c) => c.HigherQualificationComponent),

        data: { pageTitle: 'عرض المؤهل العالي', pageType: 'view' }
    }
];
