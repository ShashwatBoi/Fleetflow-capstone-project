import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { DriverService } from 'src/app/core/services/driver.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { extractError } from 'src/app/core/utils/error.util';

function minAgeValidator(minAge: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const dob = new Date(control.value);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    return age < minAge ? { minAge: true } : null;
  };
}

function minLicenseExpiryValidator(minYears: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const expiry = new Date(control.value);
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() + minYears);
    return expiry < minDate ? { minExpiry: true } : null;
  };
}

@Component({
  selector: 'app-driver-add',
  templateUrl: './driver-add.component.html'
})
export class DriverAddComponent implements OnInit {
  @Input() warehouseId: number | null = null;
  @Output() added = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder, private driverService: DriverService, private toast: ToastService) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      driverName: ['', Validators.required],
      licenseNumber: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      emailId: ['', [Validators.required, Validators.email]],
      experience: [0, [Validators.required, Validators.min(0)]],
      licenseExpiryDate: ['', [Validators.required, minLicenseExpiryValidator(2)]],
      address: [''],
      dateOfBirth: ['', [Validators.required, minAgeValidator(18)]]
    });
  }

  ngOnInit(): void {}

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const payload = { ...this.form.value };
    if (this.warehouseId) payload.warehouseId = this.warehouseId;
    this.driverService.add(payload).subscribe({
      next: () => { this.toast.show('Driver added'); this.form.reset({ experience: 0 }); this.added.emit(); },
      error: err => this.toast.show(extractError(err, 'Failed to add driver'), 'error')
    });
  }

  f(n: string) { return this.form.get(n); }
}
