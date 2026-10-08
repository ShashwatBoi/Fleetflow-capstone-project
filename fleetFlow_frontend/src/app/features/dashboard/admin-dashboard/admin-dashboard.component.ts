import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { DriverService } from 'src/app/core/services/driver.service';
import { MaintenanceService } from 'src/app/core/services/maintenance.service';
import { TripService } from 'src/app/core/services/trip.service';
import { VehicleService } from 'src/app/core/services/vehicle.service';
import { WarehouseService } from 'src/app/core/services/warehouse.service';
import { Trip, Vehicle } from 'src/app/shared/models/models';

@Component({ selector: 'app-admin-dashboard', templateUrl: './admin-dashboard.component.html' })
export class AdminDashboardComponent implements OnInit {
  username = '';
  today = new Date();
  stats = { warehouses: 0, vehicles: 0, drivers: 0, trips: 0, maintenance: 0, availableVehicles: 0 };
  trips: Trip[] = [];
  vehicles: Vehicle[] = [];
  loading = true;

  constructor(
    private auth: AuthService,
    private warehouseService: WarehouseService,
    private vehicleService: VehicleService,
    private driverService: DriverService,
    private tripService: TripService,
    private maintenanceService: MaintenanceService
  ) {}

  ngOnInit(): void {
    this.username = this.auth.getUsername() || '';
    forkJoin({
      warehouses: this.warehouseService.getAll(),
      vehicles: this.vehicleService.getAll(),
      drivers: this.driverService.getAll(),
      trips: this.tripService.getAll(),
      maintenance: this.maintenanceService.getAll()
    }).subscribe({
      next: res => {
        this.stats.warehouses = res.warehouses.length;
        this.stats.vehicles = res.vehicles.length;
        this.stats.drivers = res.drivers.length;
        this.stats.trips = res.trips.length;
        this.stats.maintenance = res.maintenance.length;
        this.stats.availableVehicles = res.vehicles.filter(v => v.currentStatus === 'AVAILABLE').length;
        this.trips = res.trips;
        this.vehicles = res.vehicles;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  get plannedTrips(): number { return this.trips.filter(t => t.tripStatus === 'PLANNED').length; }
  get inProgressTrips(): number { return this.trips.filter(t => t.tripStatus === 'IN_PROGRESS').length; }
  get completedTrips(): number { return this.trips.filter(t => t.tripStatus === 'COMPLETED').length; }
  get availableVehicles(): number { return this.vehicles.filter(v => v.currentStatus === 'AVAILABLE').length; }
  get inUseVehicles(): number { return this.vehicles.filter(v => v.currentStatus === 'IN_USE').length; }
  get maintenanceVehicles(): number { return this.vehicles.filter(v => v.currentStatus === 'MAINTENANCE').length; }
}
