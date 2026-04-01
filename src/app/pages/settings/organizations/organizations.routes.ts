import { Routes } from '@angular/router';

export const organizationsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/organizations/organizations.component').then(c => c.OrganizationsComponent),
    data: { pageTitle: 'الجهات', pageType: 'list' }
  },
  {
    path: 'add',
    loadComponent: () => import('./components/add-edit-organization/add-edit-organization.component').then(c => c.AddEditOrganizationComponent),

    data: { pageTitle: 'اضافة جهة', pageType: 'add' }
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./components/add-edit-organization/add-edit-organization.component').then(c => c.AddEditOrganizationComponent),

    data: { pageTitle: 'تعديل جهة', pageType: 'edit' }
  },
  {
    path: 'view/:id',
    loadComponent: () => import('./components/organization/organization.component').then(c => c.OrganizationComponent),

    data: { pageTitle: 'عرض الوزارة', pageType: 'view' }
  }
];
