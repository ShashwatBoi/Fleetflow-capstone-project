import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MaintenanceRecord } from '../../shared/models/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MaintenanceService {
  private base = `${environment.apiUrl}/maintenance`;
  constructor(private http: HttpClient) {}

  add(record: MaintenanceRecord, tripId: number): Observable<MaintenanceRecord> {
    return this.http.post<MaintenanceRecord>(this.base, record, { params: { tripId } });
  }
  updateCost(id: number, cost: number): Observable<MaintenanceRecord> {
    return this.http.put<MaintenanceRecord>(`${this.base}/${id}/cost`, null, { params: { cost } });
  }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.base}/${id}`); }
  getAll(): Observable<MaintenanceRecord[]> { return this.http.get<MaintenanceRecord[]>(this.base); }
  getById(id: number): Observable<MaintenanceRecord> { return this.http.get<MaintenanceRecord>(`${this.base}/${id}`); }
  getByServiceType(serviceType: string): Observable<MaintenanceRecord[]> { return this.http.get<MaintenanceRecord[]>(`${this.base}/service-type/${serviceType}`); }
  getByWarehouse(warehouseId: number): Observable<MaintenanceRecord[]> { return this.http.get<MaintenanceRecord[]>(`${this.base}/warehouse/${warehouseId}`); }
  getByVehicle(vehicleId: number): Observable<MaintenanceRecord[]> { return this.http.get<MaintenanceRecord[]>(`${this.base}/vehicle/${vehicleId}`); }
  getAvgCostByWarehouse(): Observable<any[]> { return this.http.get<any[]>(`${this.base}/avg-cost-by-warehouse`); }
  getByManager(managerName: string): Observable<MaintenanceRecord[]> { return this.http.get<MaintenanceRecord[]>(`${this.base}/by-manager`, { params: { managerName } }); }
  getByDriver(driverId: number): Observable<MaintenanceRecord[]> { return this.http.get<MaintenanceRecord[]>(`${this.base}/by-driver/${driverId}`); }
}
