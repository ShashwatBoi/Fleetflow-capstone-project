import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Driver } from '../../shared/models/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DriverService {
  private base = `${environment.apiUrl}/drivers`;
  constructor(private http: HttpClient) {}

  add(d: Driver): Observable<Driver> { return this.http.post<Driver>(this.base, d); }
  updatePhone(id: number, phone: string): Observable<Driver> {
    return this.http.put<Driver>(`${this.base}/${id}/phone`, null, { params: { phone } });
  }
  updateAvailability(id: number, available: boolean): Observable<Driver> {
    return this.http.put<Driver>(`${this.base}/${id}/availability`, null, { params: { available } });
  }
  getAll(): Observable<Driver[]> { return this.http.get<Driver[]>(this.base); }
  getById(id: number): Observable<Driver> { return this.http.get<Driver>(`${this.base}/${id}`); }
  getByName(name: string): Observable<Driver[]> { return this.http.get<Driver[]>(`${this.base}/search`, { params: { name } }); }
  getByWarehouse(warehouseId: number): Observable<Driver[]> { return this.http.get<Driver[]>(`${this.base}/warehouse/${warehouseId}`); }
  getWithMaxTrips(): Observable<Driver[]> { return this.http.get<Driver[]>(`${this.base}/max-trips`); }
  getPerformanceRankings(): Observable<Driver[]> { return this.http.get<Driver[]>(`${this.base}/performance-rankings`); }
  getByManager(managerName: string): Observable<Driver[]> { return this.http.get<Driver[]>(`${this.base}/by-manager`, { params: { managerName } }); }
  getOwnProfile(): Observable<Driver> { return this.http.get<Driver>(`${this.base}/profile`); }
}
