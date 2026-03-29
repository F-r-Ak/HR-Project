import { Routes } from '@angular/router';
import { permissionGuard } from '../../../core/guards';

export const UsersRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/users/users.component').then(c => c.UsersComponent),
    data: { pageTitle: 'المستخدمين', pageType: 'list' }
  },
  // {
  //   path: 'change-password',
  //   loadComponent: () => import('./components/chang-password/chang-password.component').then(c => c.ChangPasswordComponent),
  //   data: { pageTitle: 'تغيير كلمة المرور', pageType: 'list' }
  // },
  {
    path: 'add',
    loadComponent: () => import('./components/add-edit-user/add-edit-user.component').then(c => c.AddEditUserComponent),
   
    data: { pageTitle: 'اضافة مستخدم', pageType: 'add' }
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./components/add-edit-user/add-edit-user.component').then(c => c.AddEditUserComponent),
   
    data: { pageTitle: 'تعديل مستخدم', pageType: 'Edit' }
  }
];
