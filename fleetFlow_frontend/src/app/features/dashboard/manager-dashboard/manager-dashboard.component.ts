import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { DriverService } from 'src/app/core/services/driver.service';
import { MaintenanceService } from 'src/app/core/services/maintenance.service';
import { TripService } from 'src/app/core/services/trip.service';
import { VehicleService } from 'src/app/core/services/vehicle.service';
import { WarehouseService } from 'src/app/core/services/warehouse.service';
import { Warehouse, Trip } from 'src/app/shared/models/models';

@Component({
  selector: 'app-manager-dashboard',
  templateUrl: './manager-dashboard.component.html'
})

export class ManagerDashboardComponent implements OnInit {
  username = '';
  today = new Date();
  warehouse: Warehouse | null = null;
  stats = { vehicles: 0, drivers: 0, trips: 0, maintenance: 0 };
  trips: Trip[] = [];
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
    this.warehouseService.getByManager(this.username).subscribe({
      next: w => {
        this.warehouse = w;
        forkJoin({
          vehicles: this.vehicleService.getByWarehouse(w.warehouseId!),
          drivers: this.driverService.getByWarehouse(w.warehouseId!),
          trips: this.tripService.getByWarehouse(w.warehouseId!),
          maintenance: this.maintenanceService.getByWarehouse(w.warehouseId!)
        }).subscribe({
          next: res => {
            this.stats.vehicles = res.vehicles.length;
            this.stats.drivers = res.drivers.length;
            this.stats.trips = res.trips.length;
            this.stats.maintenance = res.maintenance.length;
            this.trips = res.trips;
            this.loading = false;
          },
          error: () => this.loading = false
        });
      },
      error: () => this.loading = false
    });
  }

  get plannedTrips(): number {
     return this.trips.filter(t => t.tripStatus === 'PLANNED').length;
  }

  get inProgressTrips(): number {
     return this.trips.filter(t => t.tripStatus === 'IN_PROGRESS').length;
  }

  get completedTrips(): number {
     return this.trips.filter(t => t.tripStatus === 'COMPLETED').length;
  }

}
