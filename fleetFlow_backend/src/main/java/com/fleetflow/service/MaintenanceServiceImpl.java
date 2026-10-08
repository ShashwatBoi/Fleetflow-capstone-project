package com.fleetflow.service;

import com.fleetflow.dto.AvgCostDTO;
import com.fleetflow.entity.MaintenanceRecord;
import com.fleetflow.exception.InvalidEntityException;
import com.fleetflow.repository.MaintenanceRepository;
import com.fleetflow.repository.TripRepository;
import com.fleetflow.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MaintenanceServiceImpl implements MaintenanceService {

    private static final Logger log = LoggerFactory.getLogger(MaintenanceServiceImpl.class);
    private final MaintenanceRepository maintenanceRepository;
    private final TripRepository tripRepository;
    private final VehicleRepository vehicleRepository;

    @Override
    public MaintenanceRecord addRecord(MaintenanceRecord record, Long tripId) {
        log.info("Adding maintenance record for trip id: {}", tripId);
        if (maintenanceRepository.existsByTripTripId(tripId))
            throw new InvalidEntityException("Maintenance record already exists for Trip Id " + tripId);
        record.setTrip(tripRepository.findById(tripId)
                .orElseThrow(() -> new InvalidEntityException("Trip Id " + tripId + " is not found")));
        return maintenanceRepository.save(record);
    }

    @Override
    public MaintenanceRecord updateCost(Long id, double cost) {
        log.info("Updating cost for maintenance id: {}", id);
        MaintenanceRecord m = maintenanceRepository.findById(id)
                .orElseThrow(() -> new InvalidEntityException("Maintenance Id " + id + " is not found"));
        m.setCost(cost);
        return maintenanceRepository.save(m);
    }

    @Override
    public void deleteRecord(Long id) {
        log.info("Deleting maintenance record id: {}", id);
        if (!maintenanceRepository.existsById(id))
            throw new InvalidEntityException("Maintenance Id " + id + " is not found");
        maintenanceRepository.deleteById(id);
    }

    @Override
    public List<MaintenanceRecord> getAllRecords() {
        log.info("Fetching all maintenance records");
        return maintenanceRepository.findAll();
    }

    @Override
    public MaintenanceRecord getById(Long id) {
        log.info("Fetching maintenance record by id: {}", id);
        return maintenanceRepository.findById(id)
                .orElseThrow(() -> new InvalidEntityException("Maintenance Id " + id + " is not found"));
    }

    @Override
    public List<MaintenanceRecord> getByServiceType(String serviceType) {
        log.info("Fetching maintenance records by service type: {}", serviceType);
        return maintenanceRepository.findByServiceType(serviceType);
    }

    @Override
    public List<MaintenanceRecord> getByWarehouse(Long warehouseId) {
        log.info("Fetching maintenance records by warehouse: {}", warehouseId);
        return maintenanceRepository.findByTripVehicleWarehouseWarehouseId(warehouseId);
    }

    @Override
    public List<MaintenanceRecord> getByVehicleId(Long vehicleId) {
        log.info("Fetching maintenance records by vehicle id: {}", vehicleId);
        if (!vehicleRepository.existsById(vehicleId))
            throw new InvalidEntityException("Vehicle Id " + vehicleId + " is not found");
        return maintenanceRepository.findByTripVehicleVehicleId(vehicleId);
    }

    @Override
    public List<AvgCostDTO> getAvgCostByWarehouse() {
        log.info("Fetching avg maintenance cost by warehouse");
        return maintenanceRepository.avgCostByWarehouse();
    }

    @Override
    public List<MaintenanceRecord> getByManager(String managerName) {
        log.info("Fetching maintenance records by manager: {}", managerName);
        return maintenanceRepository.findByTripVehicleWarehouseManagerName(managerName);
    }

    @Override
    public List<MaintenanceRecord> getByDriver(Long driverId) {
        log.info("Fetching maintenance records by driver id: {}", driverId);
        return maintenanceRepository.findByTripDriverDriverId(driverId);
    }
}