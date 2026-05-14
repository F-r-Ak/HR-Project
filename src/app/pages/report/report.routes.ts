import { Routes } from '@angular/router';

export const ReportRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/report/report.component').then((c) => c.ReportComponent),
        data: { pageTitle: 'تقرير ', pageType: 'report' }
    }
];
