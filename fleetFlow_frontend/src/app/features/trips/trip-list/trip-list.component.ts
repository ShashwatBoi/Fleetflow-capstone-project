import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Trip, Warehouse } from 'src/app/shared/models/models';

@Component({
  selector: 'app-trip-list',
  templateUrl: './trip-list.component.html'
})
export class TripListComponent {
  @Input() trips: Trip[] = [];
  @Input() warehouses: Warehouse[] = [];
  @Input() loading = false;
  @Input() role = '';
  @Output() search = new EventEmitter<{ driver: string; warehouseId: string; status: string; startDate: string; endDate: string }>();
  @Output() reset = new EventEmitter<void>();
  @Output() updateStatus = new EventEmitter<Trip>();

  searchDriver = '';
  filterWarehouseId = '';
  filterStatus = '';
  startDate = '';
  endDate = '';

  onSearch(): void {
    this.search.emit({ driver: this.searchDriver, warehouseId: this.filterWarehouseId, status: this.filterStatus, startDate: this.startDate, endDate: this.endDate });
  }
  onReset(): void { this.searchDriver = ''; this.filterWarehouseId = ''; this.filterStatus = ''; this.startDate = ''; this.endDate = ''; this.reset.emit(); }

  statusClass(s: string): string {
    if (s === 'PLANNED') return 'badge-planned';
    if (s === 'IN_PROGRESS') return 'badge-in-progress';
    if (s === 'COMPLETED') return 'badge-completed';
    return 'badge-maintenance';
  }
}
