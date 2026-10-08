package com.fleetflow.controller;

import com.fleetflow.dto.AvgCostDTO;
import com.fleetflow.entity.MaintenanceRecord;
import com.fleetflow.service.MaintenanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
@RequiredArgsConstructor
public class MaintenanceController {

    private static final Logger log = LoggerFactory.getLogger(MaintenanceController.class); 

    private final MaintenanceService maintenanceService;

    @PostMapping
    public ResponseEntity<MaintenanceRecord> add(
            @Valid @RequestBody MaintenanceRecord record,
            @RequestParam Long tripId) {

        log.info("Adding maintenance record for tripId={}", tripId);
        return ResponseEntity.status(201).body(maintenanceService.addRecord(record, tripId));
    }

    @PutMapping("/{id}/cost")
    public ResponseEntity<MaintenanceRecord> updateCost(
            @PathVariable Long id,
            @RequestParam double cost) {

        log.info("Updating maintenance cost for recordId={}, newCost={}", id, cost);
        return ResponseEntity.ok(maintenanceService.updateCost(id, cost));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {

        log.info("Deleting maintenance record with id={}", id);
        maintenanceService.deleteRecord(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<MaintenanceRecord>> getAll() {

        log.info("Fetching all maintenance records");
        return ResponseEntity.ok(maintenanceService.getAllRecords());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MaintenanceRecord> getById(@PathVariable Long id) {

        log.info("Fetching maintenance record by id={}", id);
        return ResponseEntity.ok(maintenanceService.getById(id));
    }

    @GetMapping("/service-type/{serviceType}")
    public ResponseEntity<List<MaintenanceRecord>> getByServiceType(
            @PathVariable String serviceType) {

        log.info("Fetching maintenance records by serviceType={}", serviceType);
        return ResponseEntity.ok(maintenanceService.getByServiceType(serviceType));
    }

    @GetMapping("/warehouse/{warehouseId}")
    public ResponseEntity<List<MaintenanceRecord>> getByWarehouse(
            @PathVariable Long warehouseId) {

        log.info("Fetching maintenance records for warehouseId={}", warehouseId);
        return ResponseEntity.ok(maintenanceService.getByWarehouse(warehouseId));
    }

    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<List<MaintenanceRecord>> getByVehicle(
            @PathVariable Long vehicleId) {

        log.info("Fetching maintenance records for vehicleId={}", vehicleId);
        return ResponseEntity.ok(maintenanceService.getByVehicleId(vehicleId));
    }

    @GetMapping("/avg-cost-by-warehouse")
    public ResponseEntity<List<AvgCostDTO>> getAvgCostByWarehouse() {

        log.info("Fetching average maintenance cost grouped by warehouse");
        return ResponseEntity.ok(maintenanceService.getAvgCostByWarehouse());
    }

    @GetMapping("/by-manager")
    public ResponseEntity<List<MaintenanceRecord>> getByManager(
            @RequestParam String managerName) {

        log.info("Fetching maintenance records for managerName={}", managerName);
        return ResponseEntity.ok(maintenanceService.getByManager(managerName));
    }

    @GetMapping("/by-driver/{driverId}")
    public ResponseEntity<List<MaintenanceRecord>> getByDriver(
            @PathVariable Long driverId) {

        log.info("Fetching maintenance records for driverId={}", driverId);
        return ResponseEntity.ok(maintenanceService.getByDriver(driverId));
    }
}