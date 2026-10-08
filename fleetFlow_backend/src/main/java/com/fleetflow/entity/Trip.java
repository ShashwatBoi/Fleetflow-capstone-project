package com.fleetflow.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "trips")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@ToString(exclude = {"vehicle", "driver", "maintenanceRecord"})
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tripId;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    private LocalDate endDate;

    @NotBlank(message = "Source location is required")
    private String sourceLocation;

    @NotBlank(message = "Destination location is required")
    private String destinationLocation;

    @DecimalMin(value = "0.0", message = "Distance must be non-negative")
    private double distanceCovered;

    @NotBlank(message = "Trip status is required")
    private String tripStatus;

    private double revenue;

    private double fuelConsumed;

    private String notes;

    private String purpose;

    @ManyToOne
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @JsonIgnoreProperties({"trips", "hibernateLazyInitializer"})
    @ManyToOne
    @JoinColumn(name = "driver_id", nullable = false)
    private Driver driver;

    @JsonIgnore
    @OneToOne(mappedBy = "trip", cascade = CascadeType.ALL)
    private MaintenanceRecord maintenanceRecord;
}
