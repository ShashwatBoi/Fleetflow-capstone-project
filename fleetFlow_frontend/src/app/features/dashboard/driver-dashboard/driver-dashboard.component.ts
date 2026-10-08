import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { DriverService } from 'src/app/core/services/driver.service';
import { TripService } from 'src/app/core/services/trip.service';
import { Driver, Trip } from 'src/app/shared/models/models';

@Component({ selector: 'app-driver-dashboard', templateUrl: './driver-dashboard.component.html' })
export class DriverDashboardComponent implements OnInit {
  username = '';
  today = new Date();
  profile: Driver | null = null;
  trips: Trip[] = [];
  loading = true;

  constructor(private auth: AuthService, private driverService: DriverService, private tripService: TripService) {}

  ngOnInit(): void {
    this.username = this.auth.getUsername() || '';
    this.driverService.getOwnProfile().subscribe({
      next: d => {
        this.profile = d;
        this.tripService.getByDriver(d.driverId!).subscribe({
          next: t => { this.trips = t; this.loading = false; },
          error: () => this.loading = false
        });
      },
      error: () => this.loading = false
    });
  }

  get activeTrips(): Trip[] { return this.trips.filter(t => t.tripStatus === 'IN_PROGRESS'); }
  get completedTrips(): Trip[] { return this.trips.filter(t => t.tripStatus === 'COMPLETED'); }
}
