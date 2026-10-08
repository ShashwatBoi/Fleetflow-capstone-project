package com.fleetflow.controller;

import com.fleetflow.entity.Vehicle;
import com.fleetflow.service.VehicleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private static final Logger log = LoggerFactory.getLogger(VehicleController.class);

    private final VehicleService vehicleService;

    @PostMapping
    public ResponseEntity<Vehicle> add(@Valid @RequestBody Vehicle vehicle, @RequestParam Long warehouseId) {
        log.info("Adding vehicle: {} to warehouse: {}", vehicle, warehouseId);
        Vehicle saved = vehicleService.addVehicle(vehicle, warehouseId);
        log.info("Vehicle added successfully with ID: {}", saved.getVehicleId());
        return ResponseEntity.status(201).body(saved);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Vehicle> updateStatus(@PathVariable Long id, @RequestParam String status) {
        log.info("Updating vehicle status → ID: {}, Status: {}", id, status);
        Vehicle updated = vehicleService.updateStatus(id, status);
        log.info("Status updated for vehicle ID: {}", id);
        return ResponseEntity.ok(updated);
    }

    @GetMapping
    public ResponseEntity<List<Vehicle>> getAll() {
        log.info("Fetching all vehicles");
        List<Vehicle> vehicles = vehicleService.getAllVehicles();
        log.info("Fetched {} vehicles", vehicles.size());
        return ResponseEntity.ok(vehicles);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vehicle> getById(@PathVariable Long id) {
        log.info("Fetching vehicle by ID: {}", id);
        Vehicle vehicle = vehicleService.getById(id);
        log.info("Vehicle fetched successfully: {}", id);
        return ResponseEntity.ok(vehicle);
    }

    @GetMapping("/warehouse/{warehouseId}")
    public ResponseEntity<List<Vehicle>> getByWarehouse(@PathVariable Long warehouseId) {
        log.info("Fetching vehicles for warehouse: {}", warehouseId);
        List<Vehicle> vehicles = vehicleService.getByWarehouse(warehouseId);
        log.info("Found {} vehicles for warehouse {}", vehicles.size(), warehouseId);
        return ResponseEntity.ok(vehicles);
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Vehicle>> getByType(@PathVariable String type) {
        log.info("Fetching vehicles of type: {}", type);
        List<Vehicle> vehicles = vehicleService.getByType(type);
        log.info("Found {} vehicles of type {}", vehicles.size(), type);
        return ResponseEntity.ok(vehicles);
    }

    @GetMapping("/available")
    public ResponseEntity<List<Vehicle>> getAvailable(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        log.info("Fetching available vehicles from {} to {}", startDate, endDate);
        List<Vehicle> vehicles = vehicleService.getAvailableVehicles(startDate, endDate);
        log.info("Available vehicles count: {}", vehicles.size());
        return ResponseEntity.ok(vehicles);
    }

    @GetMapping("/max-trips")
    public ResponseEntity<List<Vehicle>> getWithMaxTrips() {
        log.info("Fetching vehicles with maximum trips");
        List<Vehicle> vehicles = vehicleService.getVehiclesWithMaxTrips();
        log.info("Vehicles with max trips: {}", vehicles.size());
        return ResponseEntity.ok(vehicles);
    }

    @GetMapping("/by-manager")
    public ResponseEntity<List<Vehicle>> getByManager(@RequestParam String managerName) {
        log.info("Fetching vehicles managed by: {}", managerName);
        List<Vehicle> vehicles = vehicleService.getByManager(managerName);
        log.info("Found {} vehicles for manager {}", vehicles.size(), managerName);
        return ResponseEntity.ok(vehicles);
    }

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        log.info("Fetching vehicle analytics");
        Map<String, Object> analytics = vehicleService.getVehicleAnalytics();
        log.info("Analytics fetched successfully");
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/by-driver/{driverId}")
    public ResponseEntity<List<Vehicle>> getByDriver(@PathVariable Long driverId) {
        log.info("Fetching vehicles for driver ID: {}", driverId);
        List<Vehicle> vehicles = vehicleService.getByDriver(driverId);
        log.info("Found {} vehicles for driver {}", vehicles.size(), driverId);
        return ResponseEntity.ok(vehicles);
    }
}