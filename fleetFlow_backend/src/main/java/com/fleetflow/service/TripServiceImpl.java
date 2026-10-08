package com.fleetflow.service;

import com.fleetflow.dto.WarehouseTripCountDTO;
import com.fleetflow.entity.Driver;
import com.fleetflow.entity.Trip;
import com.fleetflow.entity.Vehicle;
import com.fleetflow.exception.InvalidEntityException;
import com.fleetflow.repository.*;
import com.fleetflow.service.TripService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TripServiceImpl implements TripService {

    private static final Logger log = LoggerFactory.getLogger(TripServiceImpl.class);
    private final TripRepository tripRepository;
    private final DriverRepository driverRepository;
    private final VehicleRepository vehicleRepository;
    private final WarehouseRepository warehouseRepository;

    @Override
    public Trip addTrip(Trip trip, Long driverId, Long vehicleId) {
        log.info("Adding trip for driver: {} and vehicle: {}", driverId, vehicleId);
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new InvalidEntityException("Driver Id " + driverId + " is not found"));
        if (!driver.isAvailable())
            throw new InvalidEntityException("Driver Id " + driverId + " is not available");
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new InvalidEntityException("Vehicle Id " + vehicleId + " is not found"));
        if (!"AVAILABLE".equalsIgnoreCase(vehicle.getCurrentStatus()))
            throw new InvalidEntityException("Vehicle Id " + vehicleId + " is not available (status: " + vehicle.getCurrentStatus() + ")");
        LocalDate endDate = trip.getEndDate() != null ? trip.getEndDate() : trip.getStartDate();
        if (tripRepository.existsOverlappingTripForVehicle(vehicleId, trip.getStartDate(), endDate))
            throw new InvalidEntityException("Vehicle Id " + vehicleId + " already has an active trip in the given date range");
        trip.setDriver(driver);
        trip.setVehicle(vehicle);
        Trip saved = tripRepository.save(trip);

        driver.setTotalTrips(driver.getTotalTrips() + 1);
        driver.setTotalDistance(driver.getTotalDistance() + trip.getDistanceCovered());
        driverRepository.save(driver);

        vehicle.setTotalTrips(vehicle.getTotalTrips() + 1);
        vehicle.setTotalDistance(vehicle.getTotalDistance() + trip.getDistanceCovered());
        vehicleRepository.save(vehicle);

        warehouseRepository.findById(vehicle.getWarehouse().getWarehouseId()).ifPresent(warehouse -> {
            warehouse.setTotalTrips(warehouse.getTotalTrips() + 1);
            warehouseRepository.save(warehouse);
        });

        return saved;
    }

    @Override
    public Trip updateStatus(Long id, String status, String username) {
        log.info("Updating status for trip id: {} by user: {}", id, username);
        Trip t = tripRepository.findById(id)
                .orElseThrow(() -> new InvalidEntityException("Trip Id " + id + " is not found"));
        // DRIVER can only update their own trips
        if (t.getDriver() != null && t.getDriver().getUsername() != null
                && !t.getDriver().getUsername().equals(username)) {
            boolean isDriverRole = driverRepository.findByUsername(username).isPresent();
            if (isDriverRole)
                throw new InvalidEntityException("Driver is not authorized to update this trip");
        }
        t.setTripStatus(status);
        return tripRepository.save(t);
    }

    @Override
    public List<Trip> getAllTrips() {
        log.info("Fetching all trips");
        return tripRepository.findAll();
    }

    @Override
    public Trip getById(Long id) {
        log.info("Fetching trip by id: {}", id);
        return tripRepository.findById(id)
                .orElseThrow(() -> new InvalidEntityException("Trip Id " + id + " is not found"));
    }

    @Override
    public List<Trip> getByDriverName(String driverName) {
        log.info("Fetching trips by driver name: {}", driverName);
        return tripRepository.findByDriverDriverNameContainingIgnoreCase(driverName);
    }

    @Override
    public List<Trip> getByWarehouse(Long warehouseId) {
        log.info("Fetching trips by warehouse: {}", warehouseId);
        return tripRepository.findByVehicleWarehouseWarehouseId(warehouseId);
    }

    @Override
    public List<Trip> getByDateRange(LocalDate start, LocalDate end) {
        log.info("Fetching trips between {} and {}", start, end);
        return tripRepository.findByStartDateBetween(start, end);
    }

    @Override
    public List<Trip> getTripsWithMaxDistance() {
        log.info("Fetching trips with max distance");
        return tripRepository.findTripsOrderByDistance();
    }

    @Override
    public List<WarehouseTripCountDTO> getWarehouseWiseTripCount() {
        log.info("Fetching warehouse-wise trip count");
        return tripRepository.countTripsByWarehouse();
    }

    @Override
    public List<Object[]> getTripTrend(int year) {
        log.info("Fetching trip trend for year: {}", year);
        return tripRepository.getTripTrend(year);
    }

    @Override
    public List<Trip> getByManager(String managerName) {
        log.info("Fetching trips by manager: {}", managerName);
        return tripRepository.findByVehicleWarehouseManagerName(managerName);
    }

    @Override
    public List<Trip> getByDriver(Long driverId) {
        log.info("Fetching trips by driver id: {}", driverId);
        return tripRepository.findByDriverDriverId(driverId);
    }
}