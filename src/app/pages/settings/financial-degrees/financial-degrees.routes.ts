import { Routes } from '@angular/router';

export const financialDegreesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/financial-degrees/financial-degrees.component').then(c => c.FinancialDegreesComponent),
    data: { pageTitle: 'الدرجات المالية', pageType: 'list' }
  },
  {
    path: 'add',
    loadComponent: () => import('./components/add-edit-financial-degree/add-edit-financial-degree.component').then(c => c.AddEditFinancialDegreeComponent),

    data: { pageTitle: 'اضافة درجة مالية', pageType: 'add' }
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./components/add-edit-financial-degree/add-edit-financial-degree.component').then(c => c.AddEditFinancialDegreeComponent),

    data: { pageTitle: 'تعديل درجة مالية', pageType: 'edit' }
  },
  {
    path: 'view/:id',
    loadComponent: () => import('./components/financial-degree/financial-degree.component').then(c => c.FinancialDegreeComponent),

    data: { pageTitle: 'عرض الدرجة المالية', pageType: 'view' }
  }
];
