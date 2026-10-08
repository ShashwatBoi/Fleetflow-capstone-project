package com.fleetflow.dto;

public class WarehouseTripCountDTO {
    private Long warehouseId;
    private String warehouseName;
    private Long tripCount;

    public WarehouseTripCountDTO(Long warehouseId, String warehouseName, Long tripCount) {
        this.warehouseId = warehouseId;
        this.warehouseName = warehouseName;
        this.tripCount = tripCount;
    }

    public Long getWarehouseId() { return warehouseId; }
    public String getWarehouseName() { return warehouseName; }
    public Long getTripCount() { return tripCount; }
}
