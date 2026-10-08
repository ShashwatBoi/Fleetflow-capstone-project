import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from 'src/app/core/services/toast.service';
import { VehicleService } from 'src/app/core/services/vehicle.service';
import { Vehicle } from 'src/app/shared/models/models';
import { extractError } from 'src/app/core/utils/error.util';

@Component({
  selector: 'app-vehicle-update',
  templateUrl: './vehicle-update.component.html'
})
export class VehicleUpdateComponent implements OnChanges {
  @Input() vehicle: Vehicle | null = null;
  @Output() updated = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  statusOptions = ['AVAILABLE', 'IN_USE', 'MAINTENANCE'];
  form: FormGroup;

  constructor(private fb: FormBuilder, private vehicleService: VehicleService, private toast: ToastService) {
    this.form = this.fb.group({ status: ['', Validators.required] });
  }

  ngOnChanges(): void {
    if (this.vehicle) this.form.patchValue({ status: this.vehicle.currentStatus });
  }

  submit(): void {
    if (!this.vehicle) return;
    this.vehicleService.updateStatus(this.vehicle.vehicleId!, this.form.value.status).subscribe({
      next: () => { this.toast.show('Status updated'); this.updated.emit(); },
      error: err => this.toast.show(extractError(err, 'Failed to update status'), 'error')
    });
  }
}
