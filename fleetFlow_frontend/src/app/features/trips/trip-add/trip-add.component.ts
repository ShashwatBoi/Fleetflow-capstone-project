import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from 'src/app/core/services/toast.service';
import { TripService } from 'src/app/core/services/trip.service';
import { Driver, Vehicle } from 'src/app/shared/models/models';
import { extractError } from 'src/app/core/utils/error.util';


@Component({
  selector: 'app-trip-add',
  templateUrl: './trip-add.component.html'
})
export class TripAddComponent {
  @Input() drivers: Driver[] = [];
  @Input() vehicles: Vehicle[] = [];
  @Output() added = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  statusOptions = ['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
  form: FormGroup;

  constructor(private fb: FormBuilder, private tripService: TripService, private toast: ToastService) {
    this.form = this.fb.group({
      driverId: ['', Validators.required],
      vehicleId: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: [''],
      sourceLocation: ['', Validators.required],
      destinationLocation: ['', Validators.required],
      distanceCovered: [0, Validators.min(0)],
      tripStatus: ['PLANNED', Validators.required],
      revenue: [0],
      fuelConsumed: [0],
      purpose: [''],
      notes: ['']
    });
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const { driverId, vehicleId, ...trip } = this.form.value;
    this.tripService.add(trip, driverId, vehicleId).subscribe({
      next: () => { this.toast.show('Trip added'); this.form.reset({ tripStatus: 'PLANNED', distanceCovered: 0, revenue: 0, fuelConsumed: 0 }); this.added.emit(); },
      error: err => this.toast.show(extractError(err, 'Failed to add trip'), 'error')
    });
  }

  f(n: string) { return this.form.get(n); }
}
