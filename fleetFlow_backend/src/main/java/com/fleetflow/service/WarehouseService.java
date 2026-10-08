package com.fleetflow.service;

import com.fleetflow.entity.Warehouse;
import java.util.List;
import java.util.Map;

public interface WarehouseService {
    Warehouse addWarehouse(Warehouse warehouse);
    Warehouse updateCapacity(Long id, int capacity);
    List<Warehouse> getAllWarehouses();
    Warehouse getById(Long id);
    List<Warehouse> getByLocationAndCapacity(String location, int capacity);
    List<Warehouse> getWarehousesWithMaxTrips();
    List<Warehouse> getEfficiencyRankings();
    List<Warehouse> getTopByVehicleUtilization();
    Warehouse assignManager(Long id, String managerName);
    Warehouse getByManager(String managerName);
}