package com.fleetflow.repository;

import com.fleetflow.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    List<Vehicle> findByWarehouseWarehouseId(Long warehouseId);
    List<Vehicle> findByVehicleType(String vehicleType);
    List<Vehicle> findByWarehouseManagerName(String managerName);
    boolean existsByVehicleNumber(String vehicleNumber);

    @Query("SELECT v FROM Vehicle v WHERE v.vehicleId NOT IN " +
           "(SELECT t.vehicle.vehicleId FROM Trip t WHERE t.startDate <= :endDate AND (t.endDate IS NULL OR t.endDate >= :startDate))")
    List<Vehicle> findAvailableVehicles(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT v FROM Vehicle v LEFT JOIN Trip t ON t.vehicle = v GROUP BY v ORDER BY COUNT(t) DESC")
    List<Vehicle> findVehiclesOrderByTripCount();

    @Query("SELECT DISTINCT t.vehicle FROM Trip t WHERE t.driver.driverId = :driverId")
    List<Vehicle> findVehiclesByDriverId(@Param("driverId") Long driverId);
}
