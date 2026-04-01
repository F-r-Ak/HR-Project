import { Routes } from '@angular/router';

export const JobsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/jobs/jobs.component').then(c => c.JobsComponent),
    data: { pageTitle: 'الوظائف', pageType: 'list' }
  },
    {
    path: 'add',
    loadComponent: () => import('./components/add-edit-job/add-edit-job.component').then(c => c.AddEditJobComponent),

    data: { pageTitle: 'اضافة وظيفة', pageType: 'add' }
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./components/add-edit-job/add-edit-job.component').then(c => c.AddEditJobComponent),

    data: { pageTitle: 'تعديل وظيفة', pageType: 'edit' }
  }
  ,
  {
    path: 'view/:id',
    loadComponent: () => import('./components/job/job.component').then(c => c.JobComponent),

    data: { pageTitle: 'عرض الوظيفة', pageType: 'view' }
  }
];
