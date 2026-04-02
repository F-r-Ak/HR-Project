import { Routes } from '@angular/router';

export const documentTypesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/document-types/document-types.component').then(c => c.DocumentTypeComponent),
    data: { pageTitle: 'انواع الوثائق', pageType: 'list' }
  },
  {
    path: 'add',
    loadComponent: () => import('./components/add-edit-document-type/add-edit-document-type.component').then(c => c.AddEditDocumentTypeComponent),

    data: { pageTitle: 'اضافة نوع وثيقة', pageType: 'add' }
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./components/add-edit-document-type/add-edit-document-type.component').then(c => c.AddEditDocumentTypeComponent),

    data: { pageTitle: 'تعديل نوع وثيقة', pageType: 'edit' }
  },
  {
    path: 'view/:id',
    loadComponent: () => import('./components/document-type/document-type.component').then(c => c.DocumentTypeComponent),

    data: { pageTitle: 'عرض نوع وثيقة', pageType: 'view' }
  }
];
