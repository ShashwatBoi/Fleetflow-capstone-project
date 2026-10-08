import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { WarehouseService } from 'src/app/core/services/warehouse.service';
import { Warehouse } from 'src/app/shared/models/models';

@Component({ selector: 'app-warehouses', templateUrl: './warehouses.component.html' })
export class WarehousesComponent implements OnInit {
  role = '';
  warehouses: Warehouse[] = [];
  filtered: Warehouse[] = [];
  topUtilization: Warehouse[] = [];
  efficiencyRanking: Warehouse[] = [];
  analyticsLoading = false;
  loading = true;
  showAddModal = false;
  showUpdateModal = false;
  selectedWarehouse: Warehouse | null = null;
  searchForm: FormGroup;
  activeTab = 'all';

  constructor(private fb: FormBuilder, private auth: AuthService, private warehouseService: WarehouseService) {
    this.searchForm = this.fb.group({ location: [''], capacity: [0] });
  }

  ngOnInit(): void {
    this.role = this.auth.getRole()!;
    this.load();
  }

  load(): void {
    this.loading = true;
    if (this.role === 'MANAGER') {
      this.warehouseService.getByManager(this.auth.getUsername()!).subscribe({
        next: w => { this.warehouses = [w]; this.filtered = [w]; this.loading = false; },
        error: () => this.loading = false
      });
    } else {
      this.warehouseService.getAll().subscribe({
        next: d => { this.warehouses = d; this.filtered = d; this.loading = false; },
        error: () => this.loading = false
      });
    }
  }

  loadAnalytics(): void {
    if (this.topUtilization.length || this.efficiencyRanking.length) return;
    this.analyticsLoading = true;
    this.warehouseService.getTopByVehicleUtilization().subscribe({
      next: d => { this.topUtilization = d; this.analyticsLoading = false; },
      error: () => this.analyticsLoading = false
    });
    this.warehouseService.getEfficiencyRankings().subscribe({
      next: d => { this.efficiencyRanking = d; },
      error: () => {}
    });
  }

  onTabChange(tab: string): void {
    this.activeTab = tab;
    if (tab === 'analytics') this.loadAnalytics();
  }

  search(): void {
    const { location, capacity } = this.searchForm.value;
    if (!location && !capacity) { this.filtered = this.warehouses; return; }
    this.warehouseService.getByLocationAndCapacity(location || '', capacity || 0).subscribe(d => this.filtered = d);
  }

  reset(): void { this.searchForm.reset({ location: '', capacity: 0 }); this.filtered = this.warehouses; }

  openUpdate(w: Warehouse): void { this.selectedWarehouse = w; this.showUpdateModal = true; }

  f(form: FormGroup, n: string) { return form.get(n); }
}


