package com.fleetflow.repository;

import com.fleetflow.dto.WarehouseTripCountDTO;
import com.fleetflow.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface TripRepository extends JpaRepository<Trip, Long> {
    List<Trip> findByDriverDriverNameContainingIgnoreCase(String driverName);
    List<Trip> findByVehicleWarehouseWarehouseId(Long warehouseId);
    List<Trip> findByStartDateBetween(LocalDate start, LocalDate end);
    List<Trip> findByDriverDriverId(Long driverId);
    List<Trip> findByVehicleWarehouseManagerName(String managerName);

    @Query("SELECT COUNT(t) > 0 FROM Trip t WHERE t.vehicle.vehicleId = :vehicleId " +
           "AND t.tripStatus NOT IN ('COMPLETED', 'CANCELLED') " +
           "AND t.startDate <= :endDate AND (t.endDate IS NULL OR t.endDate >= :startDate)")
    boolean existsOverlappingTripForVehicle(@Param("vehicleId") Long vehicleId,
                                            @Param("startDate") LocalDate startDate,
                                            @Param("endDate") LocalDate endDate);

    @Query("SELECT t FROM Trip t ORDER BY t.distanceCovered DESC")
    List<Trip> findTripsOrderByDistance();

    @Query("SELECT new com.fleetflow.dto.WarehouseTripCountDTO(t.vehicle.warehouse.warehouseId, t.vehicle.warehouse.warehouseName, COUNT(t)) FROM Trip t GROUP BY t.vehicle.warehouse.warehouseId, t.vehicle.warehouse.warehouseName")
    List<WarehouseTripCountDTO> countTripsByWarehouse();

    @Query("SELECT MONTH(t.startDate), COUNT(t) FROM Trip t WHERE YEAR(t.startDate) = :year GROUP BY MONTH(t.startDate)")
    List<Object[]> getTripTrend(@Param("year") int year);
}
