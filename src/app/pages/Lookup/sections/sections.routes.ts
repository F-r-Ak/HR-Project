import { Routes } from '@angular/router';
import { permissionGuard } from '../../../core/guards';

export const sectionsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/sections/sections.component').then(c => c.SectionsComponent),
    data: { pageTitle: 'القطاعات', pageType: 'list' }
  },
  {
    path: 'add',
    loadComponent: () => import('./components/add-edit-section/add-edit-section.component').then(c => c.AddEditSectionComponent),
    
    data: { pageTitle: 'اضافة قطاع', pageType: 'add' }
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./components/add-edit-section/add-edit-section.component').then(c => c.AddEditSectionComponent),
 
    data: { pageTitle: 'تعديل قطاع', pageType: 'edit' }
  }
];
