import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DriverService } from 'src/app/core/services/driver.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { Driver } from 'src/app/shared/models/models';
import { extractError } from 'src/app/core/utils/error.util';

@Component({
  selector: 'app-driver-update',
  templateUrl: './driver-update.component.html'
})
export class DriverUpdateComponent implements OnChanges {
  @Input() driver: Driver | null = null;
  @Output() updated = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder, private driverService: DriverService, private toast: ToastService) {
    this.form = this.fb.group({ phone: ['', Validators.required] });
  }

  ngOnChanges(): void {
    if (this.driver) this.form.patchValue({ phone: this.driver.phoneNumber });
  }

  submit(): void {
    if (!this.driver) return;
    this.driverService.updatePhone(this.driver.driverId!, this.form.value.phone).subscribe({
      next: () => { this.toast.show('Phone updated'); this.updated.emit(); },
      error: err => this.toast.show(extractError(err, 'Failed to update phone'), 'error')
    });
  }
}
