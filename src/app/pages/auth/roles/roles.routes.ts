import { Routes } from '@angular/router';
import { permissionGuard } from '../../../core/guards';

export const RolesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/roles/roles.component').then(c => c.RolesComponent),
    data: { pageTitle: 'الصلاحيات', pageType: 'list' }
  },
  {
    path: 'add',
    loadComponent: () => import('./components/add-edit-role/add-edit-role.component').then(c => c.AddEditRoleComponent),
   
    data: { pageTitle: 'اضافة صلاحية', pageType: 'add' }
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./components/add-edit-role/add-edit-role.component').then(c => c.AddEditRoleComponent),

    data: { pageTitle: 'تعديل صلاحية', pageType: 'edit' }
  },

    {
    path: 'settings/:id/:moduleId',
    loadComponent: () => import('./components/role-module/role-module.component').then(c => c.RoleModuleComponent),
    data: { pageTitle: 'صلاحيات الإدارات', pageType: 'edit' }
  }
];
