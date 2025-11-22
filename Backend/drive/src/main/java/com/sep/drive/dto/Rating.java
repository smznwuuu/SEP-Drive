package com.sep.drive.dto;

public class Rating {
    private int customerId;
    private int driverId;
    private String role;
    private int rating;

    public Rating(String role, int rating) {
        this.role = role;
        this.rating = rating;
    }

    public int getCustomerId() {
        return customerId;
    }

    public void setCustomerId(int customerId) {
        this.customerId = customerId;
    }

    public int getDriverId() {
        return driverId;
    }

    public void setDriverId(int driverId) {
        this.driverId = driverId;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    @Override
    public String toString() {
        return "Rating{" + "customerId=" + customerId + ", driverId=" + driverId + ", role=" + role + ", rating=" + rating + '}';
    }
}
