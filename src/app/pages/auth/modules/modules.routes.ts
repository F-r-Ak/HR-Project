import { Routes } from '@angular/router';

export const ModulesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/modules/modules.component').then(c => c.ModulesComponent),
    data: { pageTitle: 'الإدارات', pageType: 'list' }
  },
  {
    path: 'add',
    loadComponent: () => import('./components/add-edit-module/add-edit-module.component').then(c => c.AddEditModuleComponent),
    data: { pageTitle: 'اضافة إدارة', pageType: 'add' }
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./components/add-edit-module/add-edit-module.component').then(c => c.AddEditModuleComponent),
    data: { pageTitle: 'تعديل إدارة', pageType: 'edit' }
  }
];
