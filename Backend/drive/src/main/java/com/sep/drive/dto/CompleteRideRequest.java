package com.sep.drive.dto;

public class CompleteRideRequest {
    private String customerUsername;
    private String driverUsername;
    private double distanceKm;
    private double durationMin;

    public String getCustomerUsername() {return customerUsername;}
    public void setCustomerUsername(String customerUsername) {this.customerUsername = customerUsername;}

    public String getDriverUsername() {return driverUsername;}
    public void setDriverUsername(String driverUsername) {this.driverUsername = driverUsername;}

    public double getDistanceKm() {return distanceKm;}
    public void setDistanceKm(double distanceKm) {this.distanceKm = distanceKm;}

    public double getDurationMin() {return durationMin;}

    public void setDurationMin(double durationMin) {this.durationMin = durationMin;}
}


