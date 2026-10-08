import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Vehicle } from 'src/app/shared/models/models';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  private base = `${environment.apiUrl}/vehicles`;
  constructor(private http: HttpClient) {}

  add(v: Vehicle, warehouseId: number): Observable<Vehicle> {
    return this.http.post<Vehicle>(this.base, v, { params: { warehouseId } });
  }
  updateStatus(id: number, status: string): Observable<Vehicle> {
    return this.http.put<Vehicle>(`${this.base}/${id}/status`, null, { params: { status } });
  }
  getAll(): Observable<Vehicle[]> { return this.http.get<Vehicle[]>(this.base); }
  getById(id: number): Observable<Vehicle> { return this.http.get<Vehicle>(`${this.base}/${id}`); }
  getByWarehouse(warehouseId: number): Observable<Vehicle[]> { return this.http.get<Vehicle[]>(`${this.base}/warehouse/${warehouseId}`); }
  getByType(type: string): Observable<Vehicle[]> { return this.http.get<Vehicle[]>(`${this.base}/type/${type}`); }
  getAvailable(startDate: string, endDate: string): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.base}/available`, { params: { startDate, endDate } });
  }
  getWithMaxTrips(): Observable<Vehicle[]> { return this.http.get<Vehicle[]>(`${this.base}/max-trips`); }
  getByManager(managerName: string): Observable<Vehicle[]> { return this.http.get<Vehicle[]>(`${this.base}/by-manager`, { params: { managerName } }); }
  getByDriver(driverId: number): Observable<Vehicle[]> { return this.http.get<Vehicle[]>(`${this.base}/by-driver/${driverId}`); }
}
