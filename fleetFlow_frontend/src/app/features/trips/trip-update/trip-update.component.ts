import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from 'src/app/core/services/toast.service';
import { TripService } from 'src/app/core/services/trip.service';
import { Trip } from 'src/app/shared/models/models';
import { extractError } from 'src/app/core/utils/error.util';

@Component({
  selector: 'app-trip-update',
  templateUrl: './trip-update.component.html'
})
export class TripUpdateComponent implements OnChanges {
  @Input() trip: Trip | null = null;
  @Output() updated = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  statusOptions = ['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
  form: FormGroup;

  constructor(private fb: FormBuilder, private tripService: TripService, private toast: ToastService) {
    this.form = this.fb.group({ status: ['', Validators.required] });
  }

  ngOnChanges(): void {
    if (this.trip) this.form.patchValue({ status: this.trip.tripStatus });
  }

  submit(): void {
    if (!this.trip) return;
    this.tripService.updateStatus(this.trip.tripId!, this.form.value.status).subscribe({
      next: () => { this.toast.show('Status updated'); this.updated.emit(); },
      error: err => this.toast.show(extractError(err, 'Failed to update status'), 'error')
    });
  }
}
