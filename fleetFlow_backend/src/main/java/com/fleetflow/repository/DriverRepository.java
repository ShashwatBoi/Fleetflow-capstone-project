package com.fleetflow.repository;

import com.fleetflow.entity.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface DriverRepository extends JpaRepository<Driver, Long> {
    List<Driver> findByDriverNameContainingIgnoreCase(String name);
    boolean existsByLicenseNumber(String licenseNumber);
    boolean existsByEmailId(String emailId);
    boolean existsByPhoneNumber(String phoneNumber);
    java.util.Optional<Driver> findByUsername(String username);

    @Query("SELECT d FROM Driver d WHERE d.driverId IN (SELECT DISTINCT t.driver.driverId FROM Trip t WHERE t.vehicle.warehouse.warehouseId = :warehouseId) OR d.warehouseId = :warehouseId")
    List<Driver> findDriversByWarehouseId(@Param("warehouseId") Long warehouseId);

    @Query("SELECT d FROM Driver d LEFT JOIN d.trips t GROUP BY d ORDER BY COUNT(t) DESC")
    List<Driver> findDriversOrderByTripCount();

    @Query("SELECT DISTINCT t.driver FROM Trip t WHERE t.vehicle.warehouse.managerName = :managerName")
    List<Driver> findDriversByManagerName(@Param("managerName") String managerName);
}