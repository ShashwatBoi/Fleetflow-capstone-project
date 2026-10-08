import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Warehouse } from '../../shared/models/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class WarehouseService {
  private base = `${environment.apiUrl}/warehouses`;
  constructor(private http: HttpClient) {}

  add(w: Warehouse): Observable<Warehouse> { return this.http.post<Warehouse>(this.base, w); }
  updateCapacity(id: number, capacity: number): Observable<Warehouse> {
    return this.http.put<Warehouse>(`${this.base}/${id}/capacity`, null, { params: { capacity } });
  }
  assignManager(id: number, managerName: string): Observable<Warehouse> {
    return this.http.put<Warehouse>(`${this.base}/${id}/assign-manager`, { managerName });
  }
  getAll(): Observable<Warehouse[]> { return this.http.get<Warehouse[]>(this.base); }

  getById(id: number): Observable<Warehouse> { return this.http.get<Warehouse>(`${this.base}/${id}`); }

  getByLocationAndCapacity(location: string, capacity: number): Observable<Warehouse[]> {
    return this.http.get<Warehouse[]>(`${this.base}/filter`, { params: { location, capacity } });
  }

  getWithMaxTrips(): Observable<Warehouse[]> { return this.http.get<Warehouse[]>(`${this.base}/max-trips`); }

  getEfficiencyRankings(): Observable<Warehouse[]> { return this.http.get<Warehouse[]>(`${this.base}/efficiency-rankings`); }

  getTopByVehicleUtilization(): Observable<Warehouse[]> { return this.http.get<Warehouse[]>(`${this.base}/top-vehicle-utilization`); }

  getByManager(managerName: string): Observable<Warehouse> {
    return this.http.get<Warehouse>(`${this.base}/by-manager`, { params: { managerName } });
  }
}
