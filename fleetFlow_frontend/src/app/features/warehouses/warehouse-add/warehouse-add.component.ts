import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from 'src/app/core/services/toast.service';
import { WarehouseService } from 'src/app/core/services/warehouse.service';
import { extractError } from 'src/app/core/utils/error.util';

@Component({
  selector: 'app-warehouse-add',
  templateUrl: './warehouse-add.component.html'
})
export class WarehouseAddComponent {
  @Output() added = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder, private warehouseService: WarehouseService, private toast: ToastService) {
    this.form = this.fb.group({
      warehouseName: ['', Validators.required],
      location: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1)]],
      managerName: ['', Validators.required],
      contactNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', Validators.email],
      address: ['']
    });
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.warehouseService.add(this.form.value).subscribe({
      next: () => { this.toast.show('Warehouse added successfully'); this.form.reset(); this.added.emit(); },
      error: err => this.toast.show(extractError(err, 'Failed to add warehouse'), 'error')
    });
  }

  f(n: string) { return this.form.get(n); }
}
