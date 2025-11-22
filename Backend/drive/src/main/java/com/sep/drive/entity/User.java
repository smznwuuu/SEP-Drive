//package com.sep.drive.entity;
//
//import com.sep.drive.models.enums.CarClass;
//import com.sep.drive.models.enums.Role;
//import jakarta.persistence.*;
//import java.time.LocalDate;
//import java.time.LocalDateTime;
//
//@Entity  // This marks it as a table entity
//@Table(name = "users")  // Table name will be "users"
//public class User {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;  // Auto-generated ID
//
//    @Column(nullable = false, unique = true)
//    private String username;
//
//    private String firstName;
//    private String lastName;
//
//    @Column(nullable = false, unique = true)
//    private String email;
//
//    private LocalDate birthDate;
//
//    @Enumerated(EnumType.STRING)
//    private Role role;  // Role = DRIVER or CUSTOMER
//
//    @Enumerated(EnumType.STRING)
//    private CarClass carClass;  // Only relevant for DRIVER
//
//
//    private String password;
//
//    private String profilePicture;  // Optional profile picture URL or path
//    @Column
//    private String verificationCode;
//    @Column
//    private LocalDateTime verificationCodeExpiresAt;
//    @Column
//    private boolean isVerified = false;
//
//
//
//
//    @Column(nullable = false)
//    private double rating = 0.0;
//
//    @Column(nullable = false)
//    private int totalRides = 0;
//
//
//
//    // Empty constructor (needed by JPA)
//    public User() {}
//
//    // ----- Getters and Setters -----
//
//    public Long getId() { return id; }
//
//    public String getUsername() { return username; }
//    public void setUsername(String username) { this.username = username; }
//
//    public String getFirstName() { return firstName; }
//    public void setFirstName(String firstName) { this.firstName = firstName; }
//
//    public String getLastName() { return lastName; }
//    public void setLastName(String lastName) { this.lastName = lastName; }
//
//    public String getEmail() { return email; }
//    public void setEmail(String email) { this.email = email; }
//
//    public LocalDate getBirthDate() { return birthDate; }
//    public void setBirthDate(LocalDate birthDate) { this.birthDate = birthDate; }
//
//    public Role getRole() { return role; }
//    public void setRole(Role role) { this.role = role; }
//
//    public String getPassword() { return password; }
//    public void setPassword(String password) { this.password = password; }
//
//    public String getProfilePicture() { return profilePicture; }
//    public void setProfilePicture(String profilePicture) { this.profilePicture = profilePicture; }
//
//
//    public String getVerificationCode() { return verificationCode; }
//    public void setVerificationCode(String verificationCode) { this.verificationCode = verificationCode; }
//
//    public CarClass getCarClass() { return carClass; }
//    public void setCarClass(CarClass carClass) { this.carClass = carClass; }
//
//    public LocalDateTime getVerificationCodeExpiresAt() {return verificationCodeExpiresAt;}
//    public void setVerificationCodeExpiresAt(LocalDateTime verificationCodeExpiresAt) { this.verificationCodeExpiresAt = verificationCodeExpiresAt;}
//
//    public boolean isVerified() {  return isVerified;}
//    public void setVerified(boolean verified) {   isVerified = verified;}
//
//
//    public double getRating() { return rating;}
//    public void setRating(double rating) { this.rating = rating;}
//
//    public int getTotalRides() { return totalRides;}
//    public void setTotalRides(int totalRides) { this.totalRides = totalRides;}
//
//}
//
//
