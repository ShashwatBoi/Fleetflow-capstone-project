package com.fleetflow.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "vehicles")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@ToString(exclude = "warehouse")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long vehicleId;

    @NotBlank(message = "Vehicle number is required")
    @Column(unique = true)
    private String vehicleNumber;

    @NotBlank(message = "Vehicle type is required")
    private String vehicleType;

    @NotBlank(message = "Manufacturer is required")
    private String manufacturer;

    @Min(value = 1900, message = "Invalid model year")
    private int modelYear;

    @NotBlank(message = "Fuel type is required")
    private String fuelType;

    @NotBlank(message = "Current status is required")
    private String currentStatus;

    private double capacity;

    private String description;

    private int totalTrips;

    private double totalDistance;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warehouse_id", nullable = false)
    private Warehouse warehouse;
}
