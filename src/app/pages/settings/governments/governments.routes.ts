import { Routes } from '@angular/router';

export const governmentsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/governments/governments.component').then(c => c.GovernmentsComponent),
    data: { pageTitle: 'الادارات', pageType: 'list' }
  },
  {
    path: 'add',
    loadComponent: () => import('./components/add-edit-government/add-edit-government.component').then(c => c.AddEditGovernmentComponent),

    data: { pageTitle: 'اضافة ادارة', pageType: 'add' }
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./components/add-edit-government/add-edit-government.component').then(c => c.AddEditGovernmentComponent),

    data: { pageTitle: 'تعديل ادارة', pageType: 'edit' }
  },
  {
    path: 'view/:id',
    loadComponent: () => import('./components/government/government.component').then(c => c.GovernmentComponent),

    data: { pageTitle: 'عرض الادارة', pageType: 'view' }
  }
];
