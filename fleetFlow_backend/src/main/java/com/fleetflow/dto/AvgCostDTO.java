package com.fleetflow.dto;

public class AvgCostDTO {
    private Long warehouseId;
    private String warehouseName;
    private Double averageCost;

    public AvgCostDTO(Long warehouseId, String warehouseName, Double averageCost) {
        this.warehouseId = warehouseId;
        this.warehouseName = warehouseName;
        this.averageCost = averageCost;
    }

    public Long getWarehouseId() { return warehouseId; }
    public String getWarehouseName() { return warehouseName; }
    public Double getAverageCost() { return averageCost; }
}
