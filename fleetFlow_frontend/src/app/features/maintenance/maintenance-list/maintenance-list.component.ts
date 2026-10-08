import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MaintenanceRecord, Warehouse } from 'src/app/shared/models/models';

@Component({
  selector: 'app-maintenance-list',
  templateUrl: './maintenance-list.component.html'
})
export class MaintenanceListComponent {
  @Input() records: MaintenanceRecord[] = [];
  @Input() warehouses: Warehouse[] = [];
  @Input() loading = false;
  @Input() role = '';
  @Input() serviceTypes: string[] = [];
  @Output() filterChange = new EventEmitter<{ serviceType: string; warehouseId: string; dateFrom: string; dateTo: string }>();
  @Output() reset = new EventEmitter<void>();
  @Output() updateCost = new EventEmitter<MaintenanceRecord>();
  @Output() delete = new EventEmitter<number>();

  filterServiceType = '';
  filterWarehouseId = '';
  filterDateFrom = '';
  filterDateTo = '';

  onFilter(): void { this.filterChange.emit({ serviceType: this.filterServiceType, warehouseId: this.filterWarehouseId, dateFrom: this.filterDateFrom, dateTo: this.filterDateTo }); }
  onReset(): void { this.filterServiceType = ''; this.filterWarehouseId = ''; this.filterDateFrom = ''; this.filterDateTo = ''; this.reset.emit(); }
}
