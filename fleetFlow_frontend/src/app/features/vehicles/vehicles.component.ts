import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { DriverService } from 'src/app/core/services/driver.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { VehicleService } from 'src/app/core/services/vehicle.service';
import { WarehouseService } from 'src/app/core/services/warehouse.service';
import { Vehicle, Warehouse } from 'src/app/shared/models/models';

@Component({ selector: 'app-vehicles', templateUrl: './vehicles.component.html' })
export class VehiclesComponent implements OnInit {
  role = '';
  vehicles: Vehicle[] = [];
  filtered: Vehicle[] = [];
  warehouses: Warehouse[] = [];
  loading = true;
  showAddModal = false;
  showUpdateModal = false;
  showAvailableModal = false;
  selectedVehicle: Vehicle | null = null;
  availableVehicles: Vehicle[] = [];
  vehicleTypes = ['Truck', 'Van', 'Pickup', 'Trailer', 'Bus'];

  constructor(
    private auth: AuthService,
    private vehicleService: VehicleService, private warehouseService: WarehouseService,
    private driverService: DriverService, private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.role = this.auth.getRole()!;
    if (this.role === 'ADMIN') {
      this.warehouseService.getAll().subscribe(w => this.warehouses = w);
    } else if (this.role === 'MANAGER') {
      this.warehouseService.getByManager(this.auth.getUsername()!).subscribe(w => this.warehouses = [w]);
    }
    this.load();
  }

  load(): void {
    this.loading = true;
    // DRIVER: load own profile first to get driverId, then fetch vehicles
    if (this.role === 'DRIVER') {
      this.driverService.getOwnProfile().subscribe({
        next: d => {
          this.vehicleService.getByDriver(d.driverId!).subscribe({
            next: v => { this.vehicles = v; this.applyFilter(); this.loading = false; },
            error: () => this.loading = false
          });
        },
        error: () => this.loading = false
      });
      return;
    }
    const obs = this.role === 'MANAGER'
      ? this.vehicleService.getByManager(this.auth.getUsername()!)
      : this.vehicleService.getAll();
    obs.subscribe({ next: d => { this.vehicles = d; this.applyFilter(); this.loading = false; }, error: () => this.loading = false });
  }

  applyFilter(warehouseId?: string, type?: string, status?: string, search?: string): void {
    if (warehouseId) {
      this.vehicleService.getByWarehouse(+warehouseId).subscribe(d => {
        this.filtered = this.applyLocalFilters(d, undefined, type, status, search);
      });
      return;
    }
    this.filtered = this.applyLocalFilters(this.vehicles, undefined, type, status, search);
  }

  private applyLocalFilters(data: Vehicle[], warehouseId?: string, type?: string, status?: string, search?: string): Vehicle[] {
    let result = [...data];
    if (type) result = result.filter(v => v.vehicleType === type);
    if (status) result = result.filter(v => v.currentStatus?.toUpperCase() === status.toUpperCase());
    if (search) result = result.filter(v => v.vehicleNumber?.toLowerCase().includes(search.toLowerCase()));
    return result;
  }

  resetFilters(): void { this.filtered = this.vehicles; }

  openUpdate(v: Vehicle): void { this.selectedVehicle = v; this.showUpdateModal = true; }

  onCheckAvailable(e: { start: string; end: string }): void {
    if (!e.start || !e.end) return;
    this.vehicleService.getAvailable(e.start, e.end).subscribe({
      next: v => { this.availableVehicles = v; this.showAvailableModal = true; },
      error: err => this.toast.show(err.error || 'Failed to check availability', 'error')
    });
  }
}
