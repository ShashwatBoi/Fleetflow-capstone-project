package com.fleetflow.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "maintenance_records")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@ToString(exclude = "trip")
public class MaintenanceRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long maintenanceId;

    @NotNull(message = "Maintenance date is required")
    private LocalDate maintenanceDate;

    @NotBlank(message = "Service type is required")
    private String serviceType;

    @DecimalMin(value = "0.0", message = "Cost must be non-negative")
    private double cost;

    private String notes;

    private LocalDate nextServiceDate;

    private String performedBy;

    private String status;

    private double laborCost;

    private double partsCost;

    @JsonIgnoreProperties({"maintenanceRecord", "hibernateLazyInitializer"})
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", unique = true, nullable = false)
    private Trip trip;
}
