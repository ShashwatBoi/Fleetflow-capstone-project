

package com.fleetflow.repository;

import com.fleetflow.entity.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface WarehouseRepository extends JpaRepository<Warehouse, Long> {
    List<Warehouse> findByLocation(String location);
    List<Warehouse> findByLocationAndCapacityGreaterThanEqual(String location, int capacity);
    Optional<Warehouse> findByManagerName(String managerName);
    boolean existsByWarehouseName(String warehouseName);
    boolean existsByEmail(String email);
    boolean existsByManagerName(String managerName);

    @Query("SELECT w FROM Warehouse w ORDER BY (SELECT COUNT(t) FROM Trip t WHERE t.vehicle.warehouse = w) DESC")
    List<Warehouse> findWarehousesOrderByTripCount();

    @Query("SELECT w FROM Warehouse w ORDER BY (SELECT COUNT(v) FROM Vehicle v WHERE v.warehouse = w) DESC")
    List<Warehouse> findTopByVehicleUtilization();

    @Query("SELECT COUNT(t) FROM Trip t WHERE t.vehicle.warehouse.warehouseId = :warehouseId")
    long countTripsByWarehouse(@Param("warehouseId") Long warehouseId);

    @Query("SELECT COUNT(v) FROM Vehicle v WHERE v.warehouse.warehouseId = :warehouseId")
    long countVehiclesByWarehouse(@Param("warehouseId") Long warehouseId);
}
