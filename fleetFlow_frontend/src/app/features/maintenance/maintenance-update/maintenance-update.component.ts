import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaintenanceService } from 'src/app/core/services/maintenance.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { MaintenanceRecord } from 'src/app/shared/models/models';
import { extractError } from 'src/app/core/utils/error.util';

@Component({
  selector: 'app-maintenance-update',
  templateUrl: './maintenance-update.component.html'
})
export class MaintenanceUpdateComponent implements OnChanges {
  @Input() record: MaintenanceRecord | null = null;
  @Output() updated = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder, private maintenanceService: MaintenanceService, private toast: ToastService) {
    this.form = this.fb.group({ cost: ['', [Validators.required, Validators.min(0)]] });
  }

  ngOnChanges(): void {
    if (this.record) this.form.patchValue({ cost: this.record.cost });
  }

  submit(): void {
    if (!this.record) return;
    this.maintenanceService.updateCost(this.record.maintenanceId!, this.form.value.cost).subscribe({
      next: () => { this.toast.show('Cost updated'); this.updated.emit(); },
      error: err => this.toast.show(extractError(err, 'Failed to update cost'), 'error')
    });
  }
}
