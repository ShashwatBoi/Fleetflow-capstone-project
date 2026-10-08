package com.fleetflow.service;

import com.fleetflow.entity.Vehicle;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface VehicleService {
    Vehicle addVehicle(Vehicle vehicle, Long warehouseId);
    Vehicle updateStatus(Long id, String status);
    List<Vehicle> getAllVehicles();
    Vehicle getById(Long id);
    List<Vehicle> getByWarehouse(Long warehouseId);
    List<Vehicle> getByType(String type);
    List<Vehicle> getAvailableVehicles(LocalDate startDate, LocalDate endDate);
    List<Vehicle> getVehiclesWithMaxTrips();
    List<Vehicle> getByManager(String managerName);
    List<Vehicle> getByDriver(Long driverId);
    Map<String, Object> getVehicleAnalytics();
}
