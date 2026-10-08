package com.fleetflow.repository;

import com.fleetflow.dto.AvgCostDTO;
import com.fleetflow.entity.MaintenanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface MaintenanceRepository extends JpaRepository<MaintenanceRecord, Long> {
    List<MaintenanceRecord> findByServiceType(String serviceType);
    List<MaintenanceRecord> findByTripVehicleWarehouseWarehouseId(Long warehouseId);
    List<MaintenanceRecord> findByTripVehicleVehicleId(Long vehicleId);
    List<MaintenanceRecord> findByTripVehicleWarehouseManagerName(String managerName);
    List<MaintenanceRecord> findByTripDriverDriverId(Long driverId);
    boolean existsByTripTripId(Long tripId);

    @Query("SELECT new com.fleetflow.dto.AvgCostDTO(m.trip.vehicle.warehouse.warehouseId, m.trip.vehicle.warehouse.warehouseName, AVG(m.cost)) FROM MaintenanceRecord m GROUP BY m.trip.vehicle.warehouse.warehouseId, m.trip.vehicle.warehouse.warehouseName")
    List<AvgCostDTO> avgCostByWarehouse();
}