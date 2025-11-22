package com.sep.drive.userprofile;

public class UserDTO {

    private String username;
    private String firstName;
    private String lastName;
    private double totalDistance;
    private int totalRides;
    private double totalEarned;
    private double rating;
    private double driveTime;
    private String fullName;

    public UserDTO(String username, String firstName, String lastName, double totalDistance, double rating, double driveTime, int totalRides, double totalEarned, String fullName) {
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.totalDistance = totalDistance;
        this.rating = rating;
        this.driveTime = driveTime;
        this.totalRides = totalRides;
        this.totalEarned = totalEarned;
        this.fullName = fullName;

    }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getFirstName() {
        return firstName;
    }
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    public String getLastName() {
        return lastName;
    }
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    public double getTotalDistance() {
        return totalDistance;
    }
    public void setTotalDistance(double totalDistance) {
        this.totalDistance = totalDistance;
    }
    public int getTotalRides() {
        return totalRides;
    }
    public void setTotalRides(int totalRides) {
        this.totalRides = totalRides;
    }
    public double getTotalEarned() {
        return totalEarned;
    }
    public void setTotalEarned(double totalEarned) {
        this.totalEarned = totalEarned;
    }
    public double getRating() {
        return rating;
    }
    public void setRating(double rating) {
        this.rating = rating;
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
}


