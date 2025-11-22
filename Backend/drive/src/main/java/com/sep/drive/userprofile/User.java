package com.sep.drive.userprofile;

import com.sep.drive.models.enums.CarClass;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")  // Table wird auf den Namen "users" zugewiesen


public class User {

    @Id   // Primärschlüssel von users
    @GeneratedValue(strategy = GenerationType.IDENTITY)    //weist in der Datenbank jedem einzelnen Nutzer einen eigenen Primärschlüssel zu
    private Long id;
    @Column(nullable = false, unique = true)               //Wert in der Tabelle darf nicht nur null sein und muss einzigartig sein (es darf keinen benutzernamen doppelt geben)
    private String username;
    @Column(nullable = false, unique = true)
    private String email;
    @Column(nullable = false)
    private String password;
    @Column(nullable = false)
    private LocalDate birthdate;
    @Column(nullable = false)
    private String firstname;
    @Column(nullable = false)
    private String lastname;
    @Enumerated(EnumType.STRING)          // Speicherwert der Klasse Role ist ein String
    private Role role;
    @Enumerated(EnumType.STRING)
    private CarClass carClass;            // Nur für Driver relevant
    @Column                               // darf leer sein in der tabelle
    private String verificationCode;
    @Column
    private LocalDateTime verificationCodeExpiresAt;
    @Column
    private boolean isVerified = false;
    @Column(nullable = false)
    private double rating=0.0;
    @Column(nullable = false)
    private int totalRides=0;
    @Column(nullable = false)
    private int ratingCount = 0;
    @Column(nullable = false)
    private double balance = 0.0;
    @Column(nullable = false)
    private double totalDistance = 0.0;
    private double totalEarned = 0.0;
    private double driveTime;
    @Column(nullable = false)
    private String fullName;



    public String profilepicture;       //speichert URL zu einem Bild

    public User() {

    }

    public User (long id, String username, String email, String password, LocalDate birthdate, String firstname, String lastname, Role role, double rating, int totalRides, double balance, double totalDistance, double totalEarned, double driveTime) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.birthdate = birthdate;
        this.firstname = firstname;
        this.lastname = lastname;
        this.role = role;
        this.rating = rating;
        this.totalRides =  totalRides;
        fullName=firstname+" "+lastname;
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;

    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;

    }
    public LocalDate getBirthdate() {
        return birthdate;
    }
    public void setBirthdate(LocalDate birthdate) {
        this.birthdate = birthdate;
    }
    public String getFirstname() {
        return firstname;
    }
    public void setFirstname(String firstname) {
        this.firstname = firstname;
        updateFullName();
    }
    public String getLastname() {
        return lastname;

    }
    public void setLastname(String lastname) {
        this.lastname = lastname;
        updateFullName();
    }
    public Role getRole() {
        return role;
    }
    public void setRole(Role role) {
        this.role = role;
    }
    public double getRating() {
        return rating;
    }
    public void setRating(double rating) {
        this.rating = rating;
    }
    public int getTotalRides() {
        return totalRides;
    }
    public void settotalRides(int totalRides) {
        this.totalRides = totalRides;
    }

    public CarClass getCarClass() {
        return carClass;
    }

    public void setCarClass(CarClass carClass) {
        this.carClass = carClass;
    }

    public String getVerificationCode() {
        return verificationCode;
    }

    public void setVerificationCode(String verificationCode) {
        this.verificationCode = verificationCode;
    }

    public LocalDateTime getVerificationCodeExpiresAt() {
        return verificationCodeExpiresAt;
    }

    public void setVerificationCodeExpiresAt(LocalDateTime verificationCodeExpiresAt) {
        this.verificationCodeExpiresAt = verificationCodeExpiresAt;
    }

    public boolean isVerified() {
        return isVerified;
    }

    public void setVerified(boolean verified) {
        isVerified = verified;
    }

    public String getProfilepicture() {
        return profilepicture;
    }
    public void setProfilepicture(String profilepicture) {
        this.profilepicture = profilepicture;
    }

    public int getRatingCount() {return ratingCount;}
    public void setRatingCount(int ratingCount) {this.ratingCount = ratingCount;}

    public double getBalance() {return balance;}
    public void setBalance(double balance) {this.balance = balance;}

    public double getTotalDistance() {return totalDistance;}
    public void setTotalDistance(double totalDistance) {this.totalDistance = totalDistance;}

    public double getTotalEarned() {
        return totalEarned;
    }
    public void setTotalEarned(double totalEarned) {
        this.totalEarned = totalEarned;
    }
    public double getDriveTime() {
        return driveTime;
    }
    public void setDriveTime(double driveTime) {
        this.driveTime = driveTime;
    }
    public String getFullName() {
        return fullName;
    }

    private void updateFullName() {
        if(firstname != null && lastname != null) {
            this.fullName = firstname + " " + lastname;
        }
    }

}

