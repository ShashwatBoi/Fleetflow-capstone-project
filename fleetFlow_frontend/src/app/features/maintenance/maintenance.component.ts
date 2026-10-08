import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { DriverService } from 'src/app/core/services/driver.service';
import { MaintenanceService } from 'src/app/core/services/maintenance.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { TripService } from 'src/app/core/services/trip.service';
import { WarehouseService } from 'src/app/core/services/warehouse.service';
import { MaintenanceRecord, Trip, Warehouse } from 'src/app/shared/models/models';

@Component({ selector: 'app-maintenance', templateUrl: './maintenance.component.html' })
export class MaintenanceComponent implements OnInit {
  role = '';
  records: MaintenanceRecord[] = [];
  allRecords: MaintenanceRecord[] = [];
  trips: Trip[] = [];
  warehouses: Warehouse[] = [];
  loading = true;
  showAddModal = false;
  showUpdateModal = false;
  selectedRecord: MaintenanceRecord | null = null;
  serviceTypes = ['Oil Change', 'Brake Service', 'Tire Replacement', 'Engine Repair', 'General Service', 'Battery Replacement'];

  get trends(): { type: string; count: number; totalCost: number }[] {
    const map = new Map<string, { count: number; totalCost: number }>();
    this.allRecords.forEach(r => {
      const key = r.serviceType || 'Unknown';
      const existing = map.get(key) || { count: 0, totalCost: 0 };
      map.set(key, { count: existing.count + 1, totalCost: existing.totalCost + (r.cost || 0) });
    });
    return Array.from(map.entries()).map(([type, val]) => ({ type, ...val })).sort((a, b) => b.count - a.count);
  }

  constructor(
    private auth: AuthService,
    private maintenanceService: MaintenanceService, private tripService: TripService,
    private driverService: DriverService, private warehouseService: WarehouseService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.role = this.auth.getRole()!;
    if (this.role === 'ADMIN') {
      this.warehouseService.getAll().subscribe(w => this.warehouses = w);
      this.tripService.getAll().subscribe(t => this.trips = t);
    } else if (this.role === 'MANAGER') {
      const username = this.auth.getUsername()!;
      this.warehouseService.getByManager(username).subscribe(w => this.warehouses = [w]);
      this.tripService.getByManager(username).subscribe(t => this.trips = t);
    }
    this.load();
  }

  load(): void {
    this.loading = true;
    if (this.role === 'DRIVER') {
      this.driverService.getOwnProfile().subscribe(d => {
        this.maintenanceService.getByDriver(d.driverId!).subscribe({ next: r => { this.allRecords = r; this.records = r; this.loading = false; }, error: () => this.loading = false });
      });
      return;
    }
    const obs = this.role === 'MANAGER' ? this.maintenanceService.getByManager(this.auth.getUsername()!) : this.maintenanceService.getAll();
    obs.subscribe({ next: r => { this.allRecords = r; this.records = r; this.loading = false; }, error: () => this.loading = false });
  }

  onFilter(e: { serviceType: string; warehouseId: string; dateFrom: string; dateTo: string }): void {
    const applyFilters = (data: MaintenanceRecord[]) => {
      if (e.serviceType) data = data.filter(r => r.serviceType === e.serviceType);
      if (e.dateFrom) data = data.filter(r => r.maintenanceDate >= e.dateFrom);
      if (e.dateTo) data = data.filter(r => r.maintenanceDate <= e.dateTo);
      return data;
    };

    if (e.warehouseId) {
      this.loading = true;
      this.maintenanceService.getByWarehouse(+e.warehouseId).subscribe({
        next: r => { this.records = applyFilters(r); this.loading = false; },
        error: () => this.loading = false
      });
    } else {
      this.records = applyFilters([...this.allRecords]);
    }
  }

  openUpdate(r: MaintenanceRecord): void { this.selectedRecord = r; this.showUpdateModal = true; }

  onDelete(id: number): void {
    if (!confirm('Delete this record?')) return;
    this.maintenanceService.delete(id).subscribe({
      next: () => { this.toast.show('Record deleted'); this.load(); },
      error: err => this.toast.show(err.error || 'Failed', 'error')
    });
  }
}
