package com.fleetflow.controller;

import com.fleetflow.entity.Warehouse;
import com.fleetflow.service.WarehouseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/warehouses")
@RequiredArgsConstructor
public class WarehouseController {

    private static final Logger log =
            LoggerFactory.getLogger(WarehouseController.class);

    private final WarehouseService warehouseService;

    @PostMapping
    public ResponseEntity<Warehouse> add(@Valid @RequestBody Warehouse warehouse) {
        log.info("Add warehouse request received: {}", warehouse);
        return ResponseEntity.status(201).body(warehouseService.addWarehouse(warehouse));
    }

    @PutMapping("/{id}/capacity")
    public ResponseEntity<Warehouse> updateCapacity(@PathVariable Long id, @RequestParam int capacity) {
        log.info("Update warehouse capacity request: id={}, capacity={}", id, capacity);
        return ResponseEntity.ok(warehouseService.updateCapacity(id, capacity));
    }

    @GetMapping
    public ResponseEntity<List<Warehouse>> getAll() {
        log.info("Get all warehouses request received");
        return ResponseEntity.ok(warehouseService.getAllWarehouses());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Warehouse> getById(@PathVariable Long id) {
        log.info("Get warehouse by id request received: id={}", id);
        return ResponseEntity.ok(warehouseService.getById(id));
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Warehouse>> getByLocationAndCapacity(
            @RequestParam String location,
            @RequestParam int capacity) {
        log.info("Filter warehouses request: location={}, minCapacity={}", location, capacity);
        return ResponseEntity.ok(warehouseService.getByLocationAndCapacity(location, capacity));
    }

    @GetMapping("/max-trips")
    public ResponseEntity<List<Warehouse>> getWithMaxTrips() {
        log.info("Get warehouses with max trips request received");
        return ResponseEntity.ok(warehouseService.getWarehousesWithMaxTrips());
    }

    @GetMapping("/efficiency-rankings")
    public ResponseEntity<List<Warehouse>> getEfficiencyRankings() {
        log.info("Get warehouse efficiency rankings request received");
        return ResponseEntity.ok(warehouseService.getEfficiencyRankings());
    }

    @GetMapping("/top-vehicle-utilization")
    public ResponseEntity<List<Warehouse>> getTopByVehicleUtilization() {
        log.info("Get top warehouses by vehicle utilization request received");
        return ResponseEntity.ok(warehouseService.getTopByVehicleUtilization());
    }

    @PutMapping("/{id}/assign-manager")
    public ResponseEntity<Warehouse> assignManager(@PathVariable Long id,
                                                   @RequestBody Map<String, String> body) {
        log.info("Assign manager request: warehouseId={}, managerName={}",
                id, body.get("managerName"));
        return ResponseEntity.ok(
                warehouseService.assignManager(id, body.get("managerName"))
        );
    }

    @GetMapping("/by-manager")
    public ResponseEntity<Warehouse> getByManager(@RequestParam String managerName) {
        log.info("Get warehouse by manager request: managerName={}", managerName);
        return ResponseEntity.ok(warehouseService.getByManager(managerName));
    }
}