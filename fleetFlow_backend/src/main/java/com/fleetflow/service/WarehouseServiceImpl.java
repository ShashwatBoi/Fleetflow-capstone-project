package com.fleetflow.service;

import com.fleetflow.entity.Warehouse;
import com.fleetflow.exception.InvalidEntityException;
import com.fleetflow.repository.WarehouseRepository;
import com.fleetflow.service.WarehouseService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WarehouseServiceImpl implements WarehouseService {

    private static final Logger log = LoggerFactory.getLogger(WarehouseServiceImpl.class);
    private final WarehouseRepository warehouseRepository;

    @Override
    public Warehouse addWarehouse(Warehouse warehouse) {
        log.info("Adding warehouse: {}", warehouse.getWarehouseName());
        if (warehouseRepository.existsByWarehouseName(warehouse.getWarehouseName()))
            throw new InvalidEntityException("Warehouse name already exists: " + warehouse.getWarehouseName());
        if (warehouse.getEmail() != null && warehouseRepository.existsByEmail(warehouse.getEmail()))
            throw new InvalidEntityException("Warehouse email already exists: " + warehouse.getEmail());
        if (warehouseRepository.existsByManagerName(warehouse.getManagerName()))
            throw new InvalidEntityException("Manager is already assigned to another warehouse: " + warehouse.getManagerName());
        return warehouseRepository.save(warehouse);
    }

    @Override
    public Warehouse updateCapacity(Long id, int capacity) {
        log.info("Updating capacity for warehouse id: {}", id);
        Warehouse w = warehouseRepository.findById(id)
                .orElseThrow(() -> new InvalidEntityException("Warehouse Id " + id + " is not found"));
        w.setCapacity(capacity);
        return warehouseRepository.save(w);
    }

    @Override
    public List<Warehouse> getAllWarehouses() {
        log.info("Fetching all warehouses");
        return warehouseRepository.findAll();
    }

    @Override
    public Warehouse getById(Long id) {
        log.info("Fetching warehouse by id: {}", id);
        return warehouseRepository.findById(id)
                .orElseThrow(() -> new InvalidEntityException("Warehouse Id " + id + " is not found"));
    }

    @Override
    public List<Warehouse> getByLocationAndCapacity(String location, int capacity) {
        log.info("Fetching warehouses by location: {} and capacity: {}", location, capacity);
        return warehouseRepository.findByLocationAndCapacityGreaterThanEqual(location, capacity);
    }

    @Override
    public List<Warehouse> getWarehousesWithMaxTrips() {
        log.info("Fetching warehouses with max trips");
        List<Warehouse> list = warehouseRepository.findWarehousesOrderByTripCount();
        list.forEach(w -> w.setTotalTrips((int) warehouseRepository.countTripsByWarehouse(w.getWarehouseId())));
        return list;
    }

    @Override
    public List<Warehouse> getEfficiencyRankings() {
        log.info("Fetching warehouse efficiency rankings");
        List<Warehouse> list = warehouseRepository.findWarehousesOrderByTripCount();
        list.forEach(w -> w.setTotalTrips((int) warehouseRepository.countTripsByWarehouse(w.getWarehouseId())));
        return list;
    }

    @Override
    public List<Warehouse> getTopByVehicleUtilization() {
        log.info("Fetching top warehouses by vehicle utilization");
        List<Warehouse> list = warehouseRepository.findTopByVehicleUtilization();
        list.forEach(w -> w.setActiveVehicles((int) warehouseRepository.countVehiclesByWarehouse(w.getWarehouseId())));
        return list;
    }

    @Override
    public Warehouse assignManager(Long id, String managerName) {
        log.info("Assigning manager {} to warehouse id: {}", managerName, id);
        Warehouse w = warehouseRepository.findById(id)
                .orElseThrow(() -> new InvalidEntityException("Warehouse Id " + id + " is not found"));
        w.setManagerName(managerName);
        return warehouseRepository.save(w);
    }

    @Override
    public Warehouse getByManager(String managerName) {
        log.info("Fetching warehouse by manager: {}", managerName);
        return warehouseRepository.findByManagerName(managerName)
                .orElseThrow(() -> new InvalidEntityException("No warehouse found for manager: " + managerName));
    }
}


