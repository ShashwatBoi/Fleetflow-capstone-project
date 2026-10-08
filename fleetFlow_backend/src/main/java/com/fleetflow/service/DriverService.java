package com.fleetflow.service;

import com.fleetflow.entity.Driver;
import java.util.List;

public interface DriverService {
    Driver addDriver(Driver driver);
    Driver updatePhone(Long id, String phone);
    Driver updateAvailability(Long id, boolean available);
    List<Driver> getAllDrivers();
    Driver getById(Long id);
    List<Driver> getByName(String name);
    List<Driver> getByWarehouse(Long warehouseId);
    List<Driver> getDriversWithMaxTrips();
    List<Driver> getPerformanceRankings();
    List<Driver> getByManager(String managerName);
    Driver getOwnProfile(String username);
}
