import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Trip } from 'src/app/shared/models/models';


@Injectable({ providedIn: 'root' })
export class TripService {
  private base = `${environment.apiUrl}/trips`;
  constructor(private http: HttpClient) {

  }

  add(trip: Trip, driverId: number, vehicleId: number): Observable<Trip> {
    return this.http.post<Trip>(this.base, trip, { params: { driverId, vehicleId } });
  }

  updateStatus(id: number, status: string): Observable<Trip> {
    return this.http.put<Trip>(`${this.base}/${id}/status`, null, { params: { status } });
  }

  getAll(): Observable<Trip[]> {
    return this.http.get<Trip[]>(this.base);
  }

  getById(id: number): Observable<Trip> {
     return this.http.get<Trip>(`${this.base}/${id}`);
  }


  getByDriverName(driverName: string): Observable<Trip[]> {
     return this.http.get<Trip[]>(`${this.base}/by-driver-name`, { params: { driverName } });
  }


  getByWarehouse(warehouseId: number): Observable<Trip[]> {
     return this.http.get<Trip[]>(`${this.base}/warehouse/${warehouseId}`);
  }

  getByDateRange(startDate: string, endDate: string): Observable<Trip[]> {
     return this.http.get<Trip[]>(`${this.base}/date-range`, { params: { startDate, endDate } });
  }

  getWithMaxDistance(): Observable<Trip[]> {
     return this.http.get<Trip[]>(`${this.base}/max-distance`);
  }

  getWarehouseWiseCount(): Observable<any[]> {
     return this.http.get<any[]>(`${this.base}/warehouse-wise-count`);
  }

  getTripTrend(year: number): Observable<any[]> {
     return this.http.get<any[]>(`${this.base}/trend/${year}`);
  }

  getByManager(managerName: string): Observable<Trip[]> {
     return this.http.get<Trip[]>(`${this.base}/by-manager`, { params: { managerName } });
  }

  getByDriver(driverId: number): Observable<Trip[]> {
     return this.http.get<Trip[]>(`${this.base}/by-driver/${driverId}`);
  }
}
