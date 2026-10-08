package com.fleetflow.service;

import com.fleetflow.dto.AvgCostDTO;
import com.fleetflow.entity.MaintenanceRecord;
import java.util.List;

public interface MaintenanceService {
    MaintenanceRecord addRecord(MaintenanceRecord record, Long tripId);
    MaintenanceRecord updateCost(Long id, double cost);
    void deleteRecord(Long id);
    List<MaintenanceRecord> getAllRecords();
    MaintenanceRecord getById(Long id);
    List<MaintenanceRecord> getByServiceType(String serviceType);
    List<MaintenanceRecord> getByWarehouse(Long warehouseId);
    List<MaintenanceRecord> getByVehicleId(Long vehicleId);
    List<AvgCostDTO> getAvgCostByWarehouse();
    List<MaintenanceRecord> getByManager(String managerName);
    List<MaintenanceRecord> getByDriver(Long driverId);
}
