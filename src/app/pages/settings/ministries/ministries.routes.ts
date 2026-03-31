import { Routes } from '@angular/router';

export const ministriesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/ministries/ministries.component').then(c => c.MinistriesComponent),
    data: { pageTitle: 'الوزارات', pageType: 'list' }
  },
  {
    path: 'add',
    loadComponent: () => import('./components/add-edit-ministry/add-edit-ministry.component').then(c => c.AddEditMinistryComponent),

    data: { pageTitle: 'اضافة وزارة', pageType: 'add' }
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./components/add-edit-ministry/add-edit-ministry.component').then(c => c.AddEditMinistryComponent),

    data: { pageTitle: 'تعديل وزارة', pageType: 'edit' }
  },
  {
    path: 'view/:id',
    loadComponent: () => import('./components/ministry/ministry.component').then(c => c.MinistryComponent),

    data: { pageTitle: 'عرض الوزارة', pageType: 'view' }
  }
];
