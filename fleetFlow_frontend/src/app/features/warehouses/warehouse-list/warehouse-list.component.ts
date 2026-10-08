import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Warehouse } from 'src/app/shared/models/models';

@Component({
  selector: 'app-warehouse-list',
  templateUrl: './warehouse-list.component.html'
})
export class WarehouseListComponent {
  @Input() warehouses: Warehouse[] = [];
  @Input() loading = false;
  @Input() role = '';
  @Output() updateCapacity = new EventEmitter<Warehouse>();
}
