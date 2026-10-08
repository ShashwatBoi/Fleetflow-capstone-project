import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from 'src/app/core/services/toast.service';
import { WarehouseService } from 'src/app/core/services/warehouse.service';
import { Warehouse } from 'src/app/shared/models/models';
import { extractError } from 'src/app/core/utils/error.util';
@Component({
  selector: 'app-warehouse-update',
  templateUrl: './warehouse-update.component.html'
})
export class WarehouseUpdateComponent implements OnChanges {
  @Input() warehouse: Warehouse | null = null;
  @Output() updated = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder, private warehouseService: WarehouseService, private toast: ToastService) {
    this.form = this.fb.group({ capacity: ['', [Validators.required, Validators.min(1)]] });
  }

  ngOnChanges(): void {
    if (this.warehouse) this.form.patchValue({ capacity: this.warehouse.capacity });
  }

  submit(): void {
    if (!this.warehouse || this.form.invalid) return;
    this.warehouseService.updateCapacity(this.warehouse.warehouseId!, this.form.value.capacity).subscribe({
      next: () => { this.toast.show('Capacity updated'); this.updated.emit(); },
      error: err => this.toast.show(extractError(err, 'Failed to update capacity'), 'error')
    });
  }
}
