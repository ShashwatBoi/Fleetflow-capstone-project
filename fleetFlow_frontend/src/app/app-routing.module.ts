import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

import { MainShellComponent } from './features/main/main-shell.component';


import { WarehousesComponent } from './features/warehouses/warehouses.component';
import { VehiclesComponent } from './features/vehicles/vehicles.component';
import { DriversComponent } from './features/drivers/drivers.component';
import { TripsComponent } from './features/trips/trips.component';
import { MaintenanceComponent } from './features/maintenance/maintenance.component';
import { ProfileComponent } from './features/profile/profile.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { AdminDashboardComponent } from './features/dashboard/admin-dashboard/admin-dashboard.component';
import { DriverDashboardComponent } from './features/dashboard/driver-dashboard/driver-dashboard.component';
import { ManagerDashboardComponent } from './features/dashboard/manager-dashboard/manager-dashboard.component';
import { UnauthorizedComponent } from './features/unauthorized/unauthorized.component';

const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: 'auth/forgot-password', component: ForgotPasswordComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: '404', component: UnauthorizedComponent },

  {
    path: 'admin', component: MainShellComponent,
    canActivate: [AuthGuard, RoleGuard], data: { roles: ['ADMIN'] },
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'warehouses', component: WarehousesComponent },
      { path: 'vehicles', component: VehiclesComponent },
      { path: 'drivers', component: DriversComponent },
      { path: 'trips', component: TripsComponent },
      { path: 'maintenance', component: MaintenanceComponent },
      { path: 'profile', component: ProfileComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  {
    path: 'manager', component: MainShellComponent,
    canActivate: [AuthGuard, RoleGuard], data: { roles: ['MANAGER'] },
    children: [
      { path: 'dashboard', component: ManagerDashboardComponent },
      { path: 'warehouses', component: WarehousesComponent },
      { path: 'vehicles', component: VehiclesComponent },
      { path: 'drivers', component: DriversComponent },
      { path: 'trips', component: TripsComponent },
      { path: 'maintenance', component: MaintenanceComponent },
      { path: 'profile', component: ProfileComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  {
    path: 'driver', component: MainShellComponent,
    canActivate: [AuthGuard, RoleGuard], data: { roles: ['DRIVER'] },
    children: [
      { path: 'dashboard', component: DriverDashboardComponent },
      { path: 'warehouses', component: WarehousesComponent },
      { path: 'vehicles', component: VehiclesComponent },
      { path: 'trips', component: TripsComponent },
      { path: 'maintenance', component: MaintenanceComponent },
      { path: 'profile', component: ProfileComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: '/404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
