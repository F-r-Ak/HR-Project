import { Routes } from '@angular/router';

export const qualificationsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/qualifications/qualifications.component').then(c => c.QualificationsComponent),
    data: { pageTitle: 'المؤهلات ', pageType: 'list' }
  },
    {
    path: 'add',
    loadComponent: () => import('./components/add-edit-qualification/add-edit-qualification.component').then(c => c.AddEditQualificationComponent),

    data: { pageTitle: 'اضافة مؤهل', pageType: 'add' }
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./components/add-edit-qualification/add-edit-qualification.component').then(c => c.AddEditQualificationComponent),

    data: { pageTitle: 'تعديل مؤهل', pageType: 'edit' }
  }
  ,
  {
    path: 'view/:id',
    loadComponent: () => import('./components/qualification/qualification.component').then(c => c.QualificationComponent),

    data: { pageTitle: 'عرض المؤهل', pageType: 'view' }
  }
];
