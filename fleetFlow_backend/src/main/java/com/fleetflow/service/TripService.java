
package com.fleetflow.service;

import com.fleetflow.dto.WarehouseTripCountDTO;
import com.fleetflow.entity.Trip;
import java.time.LocalDate;
import java.util.List;

public interface TripService {
    Trip addTrip(Trip trip, Long driverId, Long vehicleId);
    Trip updateStatus(Long id, String status, String username);
    List<Trip> getAllTrips();
    Trip getById(Long id);
    List<Trip> getByDriverName(String driverName);
    List<Trip> getByWarehouse(Long warehouseId);
    List<Trip> getByDateRange(LocalDate start, LocalDate end);
    List<Trip> getTripsWithMaxDistance();
    List<WarehouseTripCountDTO> getWarehouseWiseTripCount();
    List<Object[]> getTripTrend(int year);
    List<Trip> getByManager(String managerName);
    List<Trip> getByDriver(Long driverId);
}
