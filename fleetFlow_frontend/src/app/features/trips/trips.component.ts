import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { DriverService } from 'src/app/core/services/driver.service';
import { TripService } from 'src/app/core/services/trip.service';
import { VehicleService } from 'src/app/core/services/vehicle.service';
import { WarehouseService } from 'src/app/core/services/warehouse.service';
import { Trip, Driver, Vehicle, Warehouse } from 'src/app/shared/models/models';


@Component({ selector: 'app-trips', templateUrl: './trips.component.html' })
export class TripsComponent implements OnInit {
  role = '';
  trips: Trip[] = [];
  allTrips: Trip[] = [];
  drivers: Driver[] = [];
  vehicles: Vehicle[] = [];
  warehouses: Warehouse[] = [];
  loading = true;
  showAddModal = false;
  showUpdateModal = false;
  selectedTrip: Trip | null = null;

  constructor(
    private auth: AuthService,
    private tripService: TripService, private driverService: DriverService,
    private vehicleService: VehicleService, private warehouseService: WarehouseService
  ) {}

  ngOnInit(): void {
    this.role = this.auth.getRole()!;
    if (this.role === 'ADMIN') {
      this.warehouseService.getAll().subscribe(w => this.warehouses = w);
      this.driverService.getAll().subscribe(d => this.drivers = d);
      this.vehicleService.getAll().subscribe(v => this.vehicles = v);
    } else if (this.role === 'MANAGER') {
      const username = this.auth.getUsername()!;
      this.warehouseService.getByManager(username).subscribe(w => {
        this.warehouses = [w];
        this.driverService.getByWarehouse(w.warehouseId!).subscribe(d => this.drivers = d);
        this.vehicleService.getByWarehouse(w.warehouseId!).subscribe(v => this.vehicles = v);
      });
    }
    this.load();
  }

  load(): void {
    this.loading = true;
    if (this.role === 'DRIVER') {
      this.driverService.getOwnProfile().subscribe(d => {
        this.tripService.getByDriver(d.driverId!).subscribe({ next: t => { this.allTrips = t; this.trips = t; this.loading = false; }, error: () => this.loading = false });
      });
      return;
    }
    const obs = this.role === 'MANAGER' ? this.tripService.getByManager(this.auth.getUsername()!) : this.tripService.getAll();
    obs.subscribe({ next: t => { this.allTrips = t; this.trips = t; this.loading = false; }, error: () => this.loading = false });
  }

  onSearch(e: { driver: string; warehouseId: string; status: string; startDate: string; endDate: string }): void {
    const applyFilters = (data: Trip[]) => {
      if (e.driver) data = data.filter(t => t.driver?.driverName?.toLowerCase().includes(e.driver.toLowerCase()));
      if (e.status) data = data.filter(t => t.tripStatus?.toUpperCase() === e.status.toUpperCase());
      if (e.startDate) data = data.filter(t => t.startDate >= e.startDate);
      if (e.endDate) data = data.filter(t => t.startDate <= e.endDate);
      return data;
    };

    if (e.warehouseId) {
      this.loading = true;
      this.tripService.getByWarehouse(+e.warehouseId).subscribe({
        next: t => { this.trips = applyFilters(t); this.loading = false; },
        error: () => this.loading = false
      });
    } else {
      this.trips = applyFilters([...this.allTrips]);
    }
  }

  openUpdate(t: Trip): void { this.selectedTrip = t; this.showUpdateModal = true; }
}
