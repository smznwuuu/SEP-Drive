package com.sep.drive.dto;

public class RideHistoryEntry {

    private Long requestId;

    private String driverUsername;
    private String driverFullName;

    private String customerUsername;
    private String customerFullName;

    private String vehicleClass;
    private String time;

    private double distance;
    private double durationMinutes;
    private double price;

    private double ratingFromCustomer;
    private double ratingFromDriver;

    public RideHistoryEntry() {
    }

    public RideHistoryEntry(Long requestId, String driverUsername, String driverFullName,
                            String customerUsername, String customerFullName,
                            String vehicleClass, String time,
                            double distance, double durationMinutes, double price,
                            int ratingFromCustomer, int ratingFromDriver) {
        this.requestId = requestId;
        this.driverUsername = driverUsername;
        this.driverFullName = driverFullName;
        this.customerUsername = customerUsername;
        this.customerFullName = customerFullName;
        this.vehicleClass = vehicleClass;
        this.time = time;
        this.distance = distance;
        this.durationMinutes = durationMinutes;
        this.price = price;
        this.ratingFromCustomer = ratingFromCustomer;
        this.ratingFromDriver = ratingFromDriver;
    }

    public Long getRequestId() {return requestId;}
    public void setRequestId(Long requestId) {this.requestId = requestId;}

    public String getDriverUsername() {return driverUsername;}
    public void setDriverUsername(String driverUsername) {this.driverUsername = driverUsername;}

    public String getDriverFullName() {return driverFullName;}
    public void setDriverFullName(String driverFullName) {this.driverFullName = driverFullName;}

    public String getCustomerUsername() {return customerUsername;}
    public void setCustomerUsername(String customerUsername) {this.customerUsername = customerUsername;}

    public String getCustomerFullName() {return customerFullName;}
    public void setCustomerFullName(String customerFullName) {this.customerFullName = customerFullName;}

    public String getVehicleClass() {return vehicleClass;}
    public void setVehicleClass(String vehicleClass) {this.vehicleClass = vehicleClass;}

    public String getTime() {return time;}
    public void setTime(String time) {this.time = time;}

    public double getDistance() {return distance;}
    public void setDistance(double distance) {this.distance = distance;}

    public double getDurationMinutes() {return durationMinutes;}
    public void setDurationMinutes(double durationMinutes) {this.durationMinutes = durationMinutes;}

    public double getPrice() {return price;}
    public void setPrice(double price) {this.price = price;}

    public double getRatingFromCustomer() {return ratingFromCustomer;}
    public void setRatingFromCustomer(double ratingFromCustomer) {this.ratingFromCustomer = ratingFromCustomer;}

    public double getRatingFromDriver() {return ratingFromDriver;}
    public void setRatingFromDriver(double ratingFromDriver) {this.ratingFromDriver = ratingFromDriver;}
}
