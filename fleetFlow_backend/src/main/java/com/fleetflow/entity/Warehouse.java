package com.fleetflow.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "warehouses")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@ToString(exclude = "vehicles")
public class Warehouse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long warehouseId;

    @NotBlank(message = "Warehouse name is required")
    private String warehouseName;

    @NotBlank(message = "Location is required")
    private String location;

    @Min(value = 1, message = "Capacity must be positive")
    private int capacity;

    @NotBlank(message = "Manager name is required")
    private String managerName;

    @NotBlank(message = "Contact number is required")
    private String contactNumber;

    @Email(message = "Email should be valid")
    private String email;

    private String address;

    private int activeVehicles;

    private int totalTrips;

    @JsonIgnore
    @OneToMany(mappedBy = "warehouse", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Vehicle> vehicles;
}
