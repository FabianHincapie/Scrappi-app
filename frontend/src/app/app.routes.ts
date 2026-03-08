import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeMarcameComponent } from './components/dashboard/home-marcame/home-marcame.component';
import { AdminUsersComponent } from './components/dashboard/admin-users/admin-users.component';
import { ReportsComponent } from './components/dashboard/reports/reports.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    //  Define la ruta
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: 'home', component: HomeMarcameComponent }, // El botón que ya hiciste
      { path: 'usuarios', component: AdminUsersComponent }, // Solo para el Admin
      { path: 'reportes', component: ReportsComponent },
    ],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirige la raíz al login
  { path: '**', redirectTo: '/login' }, // Si escriben cualquier otra cosa, al login
];
