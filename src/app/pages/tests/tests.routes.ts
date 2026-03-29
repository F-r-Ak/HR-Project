import { Routes } from '@angular/router';

export const testsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/tests/tests.component').then(c => c.TestsComponent),
    data: { pageTitle: 'صفحة اختبار', pageType: 'list' }
  },
  {
    path: 'add',
    loadComponent: () => import('./components/add-edit-test/add-edit-test.component').then(c => c.AddEditTestComponent),
    data: { pageTitle: 'اضافة اختبار', pageType: 'add' }
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./components/add-edit-test/add-edit-test.component').then(c => c.AddEditTestComponent),
    data: { pageTitle: 'تعديل اختبار', pageType: 'edit' }
  }
];
