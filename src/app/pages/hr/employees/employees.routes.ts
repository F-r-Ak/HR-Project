import { Routes } from '@angular/router';

export const employeesRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/persons/persons.component').then((c) => c.PersonsComponent),
        data: { pageTitle: 'إدارة الموظفين', pageType: 'list' }
    },
    {
        path: 'add',
        loadComponent: () => import('./components/employee-tabs/employee-tabs.component').then((c) => c.EmployeeTabsComponent),

        data: { pageTitle: 'اضافة موظف', pageType: 'add' }
    },
    {
        path: 'edit/:personId/:employmentId',
        loadComponent: () => import('./components/employee-tabs/employee-tabs.component').then((c) => c.EmployeeTabsComponent),

        data: { pageTitle: 'تعديل موظف', pageType: 'edit' }
    }
];
