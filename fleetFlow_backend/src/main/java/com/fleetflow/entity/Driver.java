package com.fleetflow.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "drivers")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@ToString(exclude = "trips")
@EqualsAndHashCode(exclude = "trips")
public class Driver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long driverId;

    @NotBlank(message = "Driver name is required")
    private String driverName;

    @NotBlank(message = "License number is required")
    @Column(unique = true)
    private String licenseNumber;

    @NotBlank(message = "Phone number is required")
    private String phoneNumber;

    @Email(message = "Invalid email")
    @NotBlank(message = "Email is required")
    private String emailId;

    @Min(value = 0, message = "Experience cannot be negative")
    private int experience;

    @NotNull(message = "License expiry date is required")
    private LocalDate licenseExpiryDate;

    private String address;

    private LocalDate dateOfBirth;

    private int totalTrips;

    private double totalDistance;

    private double rating;

    private boolean available=true;

    private Long warehouseId;

    @Column(unique = true)
    private String username;

    @OneToMany(mappedBy = "driver", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Trip> trips;
}
