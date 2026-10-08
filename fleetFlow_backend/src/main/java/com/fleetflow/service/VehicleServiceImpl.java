package com.fleetflow.service;

import com.fleetflow.entity.Vehicle;
import com.fleetflow.exception.InvalidEntityException;
import com.fleetflow.repository.VehicleRepository;
import com.fleetflow.repository.WarehouseRepository;
import com.fleetflow.service.VehicleService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class VehicleServiceImpl implements VehicleService {

    private static final Logger log = LoggerFactory.getLogger(VehicleServiceImpl.class);
    private final VehicleRepository vehicleRepository;
    private final WarehouseRepository warehouseRepository;

    @Override
    public Vehicle addVehicle(Vehicle vehicle, Long warehouseId) {
        log.info("Adding vehicle: {} to warehouse: {}", vehicle.getVehicleNumber(), warehouseId);
        if (vehicleRepository.existsByVehicleNumber(vehicle.getVehicleNumber()))
            throw new InvalidEntityException("Vehicle number already exists: " + vehicle.getVehicleNumber());
        vehicle.setWarehouse(warehouseRepository.findById(warehouseId)
                .orElseThrow(() -> new InvalidEntityException("Warehouse Id " + warehouseId + " is not found")));
        return vehicleRepository.save(vehicle);
    }

    @Override
    public Vehicle updateStatus(Long id, String status) {
        log.info("Updating status for vehicle id: {}", id);
        Vehicle v = vehicleRepository.findById(id)
                .orElseThrow(() -> new InvalidEntityException("Vehicle Id " + id + " is not found"));
        v.setCurrentStatus(status);
        return vehicleRepository.save(v);
    }

    @Override
    public List<Vehicle> getAllVehicles() {
        log.info("Fetching all vehicles");
        return vehicleRepository.findAll();
    }

    @Override
    public Vehicle getById(Long id) {
        log.info("Fetching vehicle by id: {}", id);
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new InvalidEntityException("Vehicle Id " + id + " is not found"));
    }

    @Override
    public List<Vehicle> getByWarehouse(Long warehouseId) {
        log.info("Fetching vehicles by warehouse: {}", warehouseId);
        List<Vehicle> vehicles = vehicleRepository.findByWarehouseWarehouseId(warehouseId);
        if (vehicles.isEmpty())
            throw new InvalidEntityException("No vehicles found for warehouse Id " + warehouseId);
        return vehicles;
    }

    @Override
    public List<Vehicle> getByType(String type) {
        log.info("Fetching vehicles by type: {}", type);
        List<Vehicle> vehicles = vehicleRepository.findByVehicleType(type);
        if (vehicles.isEmpty())
            throw new InvalidEntityException("No vehicles found for type: " + type);
        return vehicles;
    }

    @Override
    public List<Vehicle> getAvailableVehicles(LocalDate startDate, LocalDate endDate) {
        log.info("Fetching available vehicles from {} to {}", startDate, endDate);
        List<Vehicle> vehicles = vehicleRepository.findAvailableVehicles(startDate, endDate);
        if (vehicles.isEmpty())
            throw new InvalidEntityException("No vehicles available between " + startDate + " and " + endDate);
        return vehicles;
    }

    @Override
    public List<Vehicle> getVehiclesWithMaxTrips() {
        log.info("Fetching vehicles with max trips");
        List<Vehicle> vehicles = vehicleRepository.findVehiclesOrderByTripCount();
        if (vehicles.isEmpty())
            throw new InvalidEntityException("No vehicles found");
        return vehicles;
    }

    @Override
    public List<Vehicle> getByManager(String managerName) {
        log.info("Fetching vehicles by manager: {}", managerName);
        return vehicleRepository.findByWarehouseManagerName(managerName);
    }

    @Override
    public List<Vehicle> getByDriver(Long driverId) {
        log.info("Fetching vehicles by driver id: {}", driverId);
        return vehicleRepository.findVehiclesByDriverId(driverId);
    }

    @Override
    public Map<String, Object> getVehicleAnalytics() {
        log.info("Fetching vehicle analytics");
        List<Vehicle> all = vehicleRepository.findAll();
        long total = all.size();
        long available = all.stream().filter(v -> "AVAILABLE".equalsIgnoreCase(v.getCurrentStatus())).count();
        long inUse = all.stream().filter(v -> "IN_USE".equalsIgnoreCase(v.getCurrentStatus())).count();
        long maintenance = all.stream().filter(v -> "MAINTENANCE".equalsIgnoreCase(v.getCurrentStatus())).count();
        Map<String, Long> byWarehouse = new HashMap<>();
        all.forEach(v -> {
            if (v.getWarehouse() != null) {
                String key = v.getWarehouse().getWarehouseName();
                byWarehouse.merge(key, 1L, Long::sum);
            }
        });
        Map<String, Object> analytics = new HashMap<>();
        analytics.put("totalVehicles", total);
        analytics.put("availableVehicles", available);
        analytics.put("inUseVehicles", inUse);
        analytics.put("maintenanceVehicles", maintenance);
        analytics.put("vehiclesByWarehouse", byWarehouse);
        return analytics;
    }
}