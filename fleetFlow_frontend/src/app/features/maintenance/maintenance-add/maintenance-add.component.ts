import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaintenanceService } from 'src/app/core/services/maintenance.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { Trip } from 'src/app/shared/models/models';
import { extractError } from 'src/app/core/utils/error.util';

@Component({
  selector: 'app-maintenance-add',
  templateUrl: './maintenance-add.component.html'
})
export class MaintenanceAddComponent {
  @Input() trips: Trip[] = [];
  @Output() added = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  serviceTypes = ['Oil Change', 'Brake Service', 'Tire Replacement', 'Engine Repair', 'General Service', 'Battery Replacement'];
  form: FormGroup;

  constructor(private fb: FormBuilder, private maintenanceService: MaintenanceService, private toast: ToastService) {
    this.form = this.fb.group({
      tripId: ['', Validators.required],
      maintenanceDate: ['', Validators.required],
      serviceType: ['', Validators.required],
      cost: [0, Validators.min(0)],
      laborCost: [0],
      partsCost: [0],
      performedBy: ['', Validators.required],
      nextServiceDate: ['', this.futureDateValidator],
      status: ['Completed'],
      notes: ['']
    });
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const { tripId, ...record } = this.form.value;
    this.maintenanceService.add(record, tripId).subscribe({
      next: () => { this.toast.show('Record added'); this.form.reset({ cost: 0, laborCost: 0, partsCost: 0, status: 'Completed' }); this.added.emit(); },
      error: err => this.toast.show(extractError(err, 'Failed to add record'), 'error')
    });
  }

  f(n: string) { return this.form.get(n); }

  futureDateValidator(control: any) {
    if (!control.value) return null;
    const selected = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selected > today ? null : { futureDate: true };
  }

}
