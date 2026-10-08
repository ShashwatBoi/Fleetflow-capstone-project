import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { DriverService } from 'src/app/core/services/driver.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { WarehouseService } from 'src/app/core/services/warehouse.service';
import { Driver, Warehouse } from 'src/app/shared/models/models';

@Component({ selector: 'app-drivers', templateUrl: './drivers.component.html' })
export class DriversComponent implements OnInit {
  role = '';
  drivers: Driver[] = [];
  allDrivers: Driver[] = [];
  warehouses: Warehouse[] = [];
  managerWarehouseId: number | null = null;
  loading = true;
  showAddModal = false;
  showUpdateModal = false;
  selectedDriver: Driver | null = null;

  constructor(private auth: AuthService, private driverService: DriverService, private warehouseService: WarehouseService, private toast: ToastService) {}

  ngOnInit(): void {
    this.role = this.auth.getRole()!;
    if (this.role !== 'DRIVER') this.warehouseService.getAll().subscribe(w => this.warehouses = w);
    this.load();
  }

  load(): void {
    this.loading = true;
    if (this.role === 'MANAGER') {
      this.warehouseService.getByManager(this.auth.getUsername()!).subscribe({
        next: w => {
          this.managerWarehouseId = w.warehouseId!;
          this.driverService.getByWarehouse(w.warehouseId!).subscribe({
            next: d => { this.allDrivers = d; this.drivers = d; this.loading = false; },
            error: () => this.loading = false
          });
        },
        error: () => this.loading = false
      });
      return;
    }
    this.driverService.getAll().subscribe({
      next: d => { this.allDrivers = d; this.drivers = d; this.loading = false; },
      error: () => this.loading = false
    });
  }

  onSearch(e: { name: string; warehouseId: string; status: string }): void {
    if (e.warehouseId) {
      this.driverService.getByWarehouse(+e.warehouseId).subscribe(wDrivers => {
        let data = [...wDrivers];
        if (e.name) data = data.filter(d => d.driverName?.toLowerCase().includes(e.name.toLowerCase()));
        if (e.status) data = data.filter(d => d.available === (e.status === 'true'));
        this.drivers = data;
      });
      return;
    }
    let data = [...this.allDrivers];
    if (e.name) data = data.filter(d => d.driverName?.toLowerCase().includes(e.name.toLowerCase()));
    if (e.status) data = data.filter(d => d.available === (e.status === 'true'));
    this.drivers = data;
  }

  matchesWarehouse(d: Driver, warehouseId: number): boolean {
    this.driverService.getByWarehouse(warehouseId).subscribe(wDrivers => {
      return wDrivers.some(wd => wd.driverId === d.driverId);
    });
    return false;
  }


  openUpdate(d: Driver): void { this.selectedDriver = d; this.showUpdateModal = true; }

  onUpdateAvailability(d: Driver): void {
    this.driverService.updateAvailability(d.driverId!, !d.available).subscribe({
      next: () => { this.toast.show('Availability updated'); this.load(); },
      error: err => this.toast.show(err.error || 'Failed', 'error')
    });
  }
}
