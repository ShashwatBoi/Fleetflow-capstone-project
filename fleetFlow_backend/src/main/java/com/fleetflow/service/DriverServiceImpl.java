package com.fleetflow.service;

import com.fleetflow.entity.Driver;
import com.fleetflow.exception.InvalidEntityException;
import com.fleetflow.repository.DriverRepository;
import com.fleetflow.service.DriverService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DriverServiceImpl implements DriverService {

    private static final Logger log = LoggerFactory.getLogger(DriverServiceImpl.class);
    private final DriverRepository driverRepository;

    @Override
    public Driver addDriver(Driver driver) {
        log.info("Adding driver: {}", driver.getDriverName());
        if (driverRepository.existsByLicenseNumber(driver.getLicenseNumber()))
            throw new InvalidEntityException("License number already exists: " + driver.getLicenseNumber());
        if (driverRepository.existsByEmailId(driver.getEmailId()))
            throw new InvalidEntityException("Driver email already exists: " + driver.getEmailId());
        if (driverRepository.existsByPhoneNumber(driver.getPhoneNumber()))
            throw new InvalidEntityException("Phone number already exists: " + driver.getPhoneNumber());
        return driverRepository.save(driver);
    }

    @Override
    public Driver updatePhone(Long id, String phone) {
        log.info("Updating phone for driver id: {}", id);
        Driver d = driverRepository.findById(id)
                .orElseThrow(() -> new InvalidEntityException("Driver Id " + id + " is not found"));
        d.setPhoneNumber(phone);
        return driverRepository.save(d);
    }

    @Override
    public Driver updateAvailability(Long id, boolean available) {
        log.info("Updating availability for driver id: {}", id);
        Driver d = driverRepository.findById(id)
                .orElseThrow(() -> new InvalidEntityException("Driver Id " + id + " is not found"));
        d.setAvailable(available);
        return driverRepository.save(d);
    }

    @Override
    public List<Driver> getAllDrivers() {
        log.info("Fetching all drivers");
        return driverRepository.findAll();
    }

    @Override
    public Driver getById(Long id) {
        log.info("Fetching driver by id: {}", id);
        return driverRepository.findById(id)
                .orElseThrow(() -> new InvalidEntityException("Driver Id " + id + " is not found"));
    }

    @Override
    public List<Driver> getByName(String name) {
        log.info("Fetching drivers by name: {}", name);
        return driverRepository.findByDriverNameContainingIgnoreCase(name);
    }

    @Override
    public List<Driver> getByWarehouse(Long warehouseId) {
        log.info("Fetching drivers by warehouse: {}", warehouseId);
        return driverRepository.findDriversByWarehouseId(warehouseId);
    }

    @Override
    public List<Driver> getDriversWithMaxTrips() {
        log.info("Fetching drivers with max trips");
        return driverRepository.findDriversOrderByTripCount();
    }

    @Override
    public List<Driver> getPerformanceRankings() {
        log.info("Fetching driver performance rankings");
        return driverRepository.findDriversOrderByTripCount();
    }

    @Override
    public List<Driver> getByManager(String managerName) {
        log.info("Fetching drivers by manager: {}", managerName);
        return driverRepository.findDriversByManagerName(managerName);
    }

    @Override
    public Driver getOwnProfile(String username) {
        log.info("Fetching own profile for: {}", username);
        return driverRepository.findByUsername(username)
                .orElseThrow(() -> new InvalidEntityException("Driver profile not found for username: " + username));
    }
}
