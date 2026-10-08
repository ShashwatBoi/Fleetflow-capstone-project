import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Driver, Warehouse } from 'src/app/shared/models/models';

@Component({
  selector: 'app-driver-list',
  templateUrl: './driver-list.component.html'
})
export class DriverListComponent {
  @Input() drivers: Driver[] = [];
  @Input() warehouses: Warehouse[] = [];
  @Input() loading = false;
  @Input() role = '';
  @Output() search = new EventEmitter<{ name: string; warehouseId: string; status: string }>();
  @Output() reset = new EventEmitter<void>();
  @Output() updatePhone = new EventEmitter<Driver>();
  @Output() updateAvailability = new EventEmitter<Driver>();

  searchName = '';
  filterWarehouseId = '';
  filterStatus = '';

  onSearch(): void { this.search.emit({ name: this.searchName, warehouseId: this.filterWarehouseId, status: this.filterStatus }); }

  onReset(): void { this.searchName = ''; this.filterWarehouseId = ''; this.filterStatus = ''; this.reset.emit(); }
}
