package com.fleetflow.controller;

import com.fleetflow.dto.WarehouseTripCountDTO;
import com.fleetflow.entity.Trip;
import com.fleetflow.service.MaintenanceServiceImpl;
import com.fleetflow.service.TripService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/trips")
@RequiredArgsConstructor
public class TripController {

    private final TripService tripService;
    private static final Logger log = LoggerFactory.getLogger(MaintenanceServiceImpl.class);
    @PostMapping
    public ResponseEntity<Trip> add(
            @Valid @RequestBody Trip trip,
            @RequestParam Long driverId,
            @RequestParam Long vehicleId) {

        log.info("Creating new trip | driverId={} | vehicleId={}", driverId, vehicleId);

        Trip savedTrip = tripService.addTrip(trip, driverId, vehicleId);

        log.info("Trip created successfully | tripId={}", savedTrip.getTripId());

        return ResponseEntity.status(201).body(savedTrip);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Trip> updateStatus(
            @PathVariable Long id,
            @RequestParam String status,
            Authentication authentication) {

        log.info("Updating trip status | tripId={} | newStatus={} | updatedBy={}",
                id, status, authentication.getName());

        return ResponseEntity.ok(
                tripService.updateStatus(id, status, authentication.getName()));
    }

    @GetMapping
    public ResponseEntity<List<Trip>> getAll() {
        log.info("Fetching all trips");
        return ResponseEntity.ok(tripService.getAllTrips());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Trip> getById(@PathVariable Long id) {
        log.info("Fetching trip details | tripId={}", id);
        return ResponseEntity.ok(tripService.getById(id));
    }

    @GetMapping("/by-driver-name")
    public ResponseEntity<List<Trip>> getByDriverName(@RequestParam String driverName) {
        log.info("Fetching trips by driver name | driverName={}", driverName);
        return ResponseEntity.ok(tripService.getByDriverName(driverName));
    }

    @GetMapping("/warehouse/{warehouseId}")
    public ResponseEntity<List<Trip>> getByWarehouse(@PathVariable Long warehouseId) {
        log.info("Fetching trips by warehouse | warehouseId={}", warehouseId);
        return ResponseEntity.ok(tripService.getByWarehouse(warehouseId));
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<Trip>> getByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        log.info("Fetching trips by date range | startDate={} | endDate={}", startDate, endDate);

        return ResponseEntity.ok(tripService.getByDateRange(startDate, endDate));
    }

    @GetMapping("/max-distance")
    public ResponseEntity<List<Trip>> getWithMaxDistance() {
        log.info("Fetching trips with maximum distance covered");
        return ResponseEntity.ok(tripService.getTripsWithMaxDistance());
    }

    @GetMapping("/warehouse-wise-count")
    public ResponseEntity<List<WarehouseTripCountDTO>> getWarehouseWiseCount() {
        log.info("Fetching warehouse-wise trip count");
        return ResponseEntity.ok(tripService.getWarehouseWiseTripCount());
    }

    @GetMapping("/trend/{year}")
    public ResponseEntity<List<Object[]>> getTripTrend(@PathVariable int year) {
        log.info("Fetching trip trend data | year={}", year);
        return ResponseEntity.ok(tripService.getTripTrend(year));
    }

    @GetMapping("/by-manager")
    public ResponseEntity<List<Trip>> getByManager(@RequestParam String managerName) {
        log.info("Fetching trips by manager | managerName={}", managerName);
        return ResponseEntity.ok(tripService.getByManager(managerName));
    }

    @GetMapping("/by-driver/{driverId}")
    public ResponseEntity<List<Trip>> getByDriver(@PathVariable Long driverId) {
        log.info("Fetching trips by driver | driverId={}", driverId);
        return ResponseEntity.ok(tripService.getByDriver(driverId));
    }
}