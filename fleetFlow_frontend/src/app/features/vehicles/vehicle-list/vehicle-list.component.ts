import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Vehicle, Warehouse } from 'src/app/shared/models/models';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html'
})
export class VehicleListComponent {
  @Input() vehicles: Vehicle[] = [];
  @Input() warehouses: Warehouse[] = [];
  @Input() loading = false;
  @Input() role = '';
  @Input() vehicleTypes: string[] = [];
  @Output() filterChange = new EventEmitter<{ warehouseId: string; type: string; status: string; search: string }>();
  @Output() resetFilters = new EventEmitter<void>();
  @Output() checkAvailable = new EventEmitter<{ start: string; end: string }>();
  @Output() updateStatus = new EventEmitter<Vehicle>();

  filterWarehouseId = '';
  filterType = '';
  filterStatus = '';
  searchNumber = '';
  checkStartDate = '';
  checkEndDate = '';

  statusClass(s: string): string {
    if (s === 'AVAILABLE') return 'badge-available';
    if (s === 'IN_USE') return 'badge-in-use';
    return 'badge-maintenance';
  }

  onFilter(): void {
    this.filterChange.emit({ warehouseId: this.filterWarehouseId, type: this.filterType, status: this.filterStatus, search: this.searchNumber });
  }

  onReset(): void {
    this.filterWarehouseId = '';
    this.filterType = '';
    this.filterStatus = '';
    this.searchNumber = '';
    this.resetFilters.emit();
  }
}
