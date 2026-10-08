import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { JwtInterceptor } from './core/interceptors/jwt.interceptor';

import { UnauthorizedComponent } from './features/unauthorized/unauthorized.component';
import { MainShellComponent } from './features/main/main-shell.component';


import { WarehousesComponent } from './features/warehouses/warehouses.component';
import { WarehouseListComponent } from './features/warehouses/warehouse-list/warehouse-list.component';
import { WarehouseAddComponent } from './features/warehouses/warehouse-add/warehouse-add.component';
import { WarehouseUpdateComponent } from './features/warehouses/warehouse-update/warehouse-update.component';

import { VehiclesComponent } from './features/vehicles/vehicles.component';
import { VehicleListComponent } from './features/vehicles/vehicle-list/vehicle-list.component';
import { VehicleAddComponent } from './features/vehicles/vehicle-add/vehicle-add.component';
import { VehicleUpdateComponent } from './features/vehicles/vehicle-update/vehicle-update.component';

import { DriversComponent } from './features/drivers/drivers.component';
import { DriverListComponent } from './features/drivers/driver-list/driver-list.component';
import { DriverAddComponent } from './features/drivers/driver-add/driver-add.component';
import { DriverUpdateComponent } from './features/drivers/driver-update/driver-update.component';

import { TripsComponent } from './features/trips/trips.component';
import { TripListComponent } from './features/trips/trip-list/trip-list.component';
import { TripAddComponent } from './features/trips/trip-add/trip-add.component';
import { TripUpdateComponent } from './features/trips/trip-update/trip-update.component';

import { MaintenanceComponent } from './features/maintenance/maintenance.component';
import { MaintenanceListComponent } from './features/maintenance/maintenance-list/maintenance-list.component';
import { MaintenanceAddComponent } from './features/maintenance/maintenance-add/maintenance-add.component';
import { MaintenanceUpdateComponent } from './features/maintenance/maintenance-update/maintenance-update.component';

import { ProfileComponent } from './features/profile/profile.component';
import { ToastComponent } from './shared/components/navbar/toast.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { AdminDashboardComponent } from './features/dashboard/admin-dashboard/admin-dashboard.component';
import { DriverDashboardComponent } from './features/dashboard/driver-dashboard/driver-dashboard.component';
import { ManagerDashboardComponent } from './features/dashboard/manager-dashboard/manager-dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    UnauthorizedComponent,
    MainShellComponent,
    AdminDashboardComponent,
    ManagerDashboardComponent,
    DriverDashboardComponent,
    WarehousesComponent, WarehouseListComponent, WarehouseAddComponent, WarehouseUpdateComponent,
    VehiclesComponent, VehicleListComponent, VehicleAddComponent, VehicleUpdateComponent,
    DriversComponent, DriverListComponent, DriverAddComponent, DriverUpdateComponent,
    TripsComponent, TripListComponent, TripAddComponent, TripUpdateComponent,
    MaintenanceComponent, MaintenanceListComponent, MaintenanceAddComponent, MaintenanceUpdateComponent,
    ProfileComponent,
    ToastComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
