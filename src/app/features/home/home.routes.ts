import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: { breadcrumb: 'Portal' },
    children: [
      {
        path: 'dashboard',
        data: { breadcrumb: 'Dashboards' },
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'personal',
        data: { breadcrumb: 'Personal' },
        loadComponent: () =>
          import('./pages/personal/personal.component').then(
            (m) => m.PersonalComponent
          ),
      },
      {
        path: '',
        redirectTo: '/portal/dashboard',
        pathMatch: 'full',
      },
    ],
  },
];
