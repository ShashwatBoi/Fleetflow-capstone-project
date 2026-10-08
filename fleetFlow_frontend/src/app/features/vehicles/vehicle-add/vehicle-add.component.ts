import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from 'src/app/core/services/toast.service';
import { VehicleService } from 'src/app/core/services/vehicle.service';
import { Warehouse } from 'src/app/shared/models/models';
import { extractError } from 'src/app/core/utils/error.util';

@Component({
  selector: 'app-vehicle-add',
  templateUrl: './vehicle-add.component.html'
})
export class VehicleAddComponent {
  @Input() warehouses: Warehouse[] = [];
  @Output() added = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  statusOptions = ['AVAILABLE', 'IN_USE', 'MAINTENANCE'];
  fuelTypes = ['Diesel', 'Petrol', 'CNG', 'Electric'];
  vehicleTypes = ['Truck', 'Van', 'Pickup', 'Trailer', 'Bus'];

  form: FormGroup;

  constructor(private fb: FormBuilder, private vehicleService: VehicleService, private toast: ToastService) {
    this.form = this.fb.group({
      warehouseId: ['', Validators.required],
      vehicleNumber: ['', Validators.required],
      vehicleType: ['', Validators.required],
      manufacturer: ['', Validators.required],
      modelYear: ['', [Validators.required, Validators.min(1900)]],
      fuelType: ['', Validators.required],
      currentStatus: ['AVAILABLE', Validators.required],
      capacity: [''],
      description: ['']
    });
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const { warehouseId, ...vehicle } = this.form.value;
    vehicle.modelYear = +vehicle.modelYear;
    if (vehicle.capacity !== '' && vehicle.capacity != null) vehicle.capacity = +vehicle.capacity;
    else delete vehicle.capacity;
    this.vehicleService.add(vehicle, +warehouseId).subscribe({
      next: () => { this.toast.show('Vehicle added'); this.form.reset({ currentStatus: 'AVAILABLE' }); this.added.emit(); },
      error: err => this.toast.show(extractError(err, 'Failed to add vehicle'), 'error')
    });
  }

  f(n: string) { return this.form.get(n); }
}
