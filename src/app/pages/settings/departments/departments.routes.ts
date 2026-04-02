import { Routes } from '@angular/router';

export const departmentsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/departments/departments.component').then(c => c.DepartmentsComponent),
    data: { pageTitle: 'الادارات', pageType: 'list' }
  },
  {
    path: 'add',
    loadComponent: () => import('./components/add-edit-department/add-edit-department.component').then(c => c.AddEditDepartmentComponent),

    data: { pageTitle: 'اضافة ادارة', pageType: 'add' }
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./components/add-edit-department/add-edit-department.component').then(c => c.AddEditDepartmentComponent),

    data: { pageTitle: 'تعديل ادارة', pageType: 'edit' }
  },
  {
    path: 'view/:id',
    loadComponent: () => import('./components/department/department.component').then(c => c.DepartmentComponent),

    data: { pageTitle: 'عرض الادارة', pageType: 'view' }
  }
];
