package com.fleetflow.controller;

import com.fleetflow.entity.Driver;
import com.fleetflow.service.DriverService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drivers")
@RequiredArgsConstructor
public class DriverController {

    private final DriverService driverService;

    @PostMapping
    public ResponseEntity<Driver> add(@Valid @RequestBody Driver driver) {
        return ResponseEntity.status(201).body(driverService.addDriver(driver));
    }

    @PutMapping("/{id}/phone")
    public ResponseEntity<Driver> updatePhone(@PathVariable Long id, @RequestParam String phone) {
        return ResponseEntity.ok(driverService.updatePhone(id, phone));
    }

    @PutMapping("/{id}/availability")
    public ResponseEntity<Driver> updateAvailability(@PathVariable Long id, @RequestParam boolean available) {
        return ResponseEntity.ok(driverService.updateAvailability(id, available));
    }

    @GetMapping
    public ResponseEntity<List<Driver>> getAll() {
        return ResponseEntity.ok(driverService.getAllDrivers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Driver> getById(@PathVariable Long id) {
        return ResponseEntity.ok(driverService.getById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Driver>> getByName(@RequestParam String name) {
        return ResponseEntity.ok(driverService.getByName(name));
    }

    @GetMapping("/warehouse/{warehouseId}")
    public ResponseEntity<List<Driver>> getByWarehouse(@PathVariable Long warehouseId) {
        return ResponseEntity.ok(driverService.getByWarehouse(warehouseId));
    }

    @GetMapping("/max-trips")
    public ResponseEntity<List<Driver>> getWithMaxTrips() {
        return ResponseEntity.ok(driverService.getDriversWithMaxTrips());
    }

    @GetMapping("/performance-rankings")
    public ResponseEntity<List<Driver>> getPerformanceRankings() {
        return ResponseEntity.ok(driverService.getPerformanceRankings());
    }

    @GetMapping("/by-manager")
    public ResponseEntity<List<Driver>> getByManager(@RequestParam String managerName) {
        return ResponseEntity.ok(driverService.getByManager(managerName));
    }

    @GetMapping("/profile")
    public ResponseEntity<Driver> getOwnProfile(Authentication auth) {
        return ResponseEntity.ok(driverService.getOwnProfile(auth.getName()));
    }
}
