package com.sep.drive.CarRequest;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;


@Entity


public class Route {
    @Id
    @GeneratedValue (strategy = GenerationType.AUTO)
    private long routeId;
    private double latitude;
    private double longitude;

    public Route() {}

    public Route(double latitude, double longitude) {
        this.latitude = latitude;
        this.longitude = longitude;

    }
    public double getLatitude() {
        return latitude;

    }
    public double getLongitude() {
        return longitude;

    }

    @Override
    public String toString() {
        return "Latitude: " + latitude + ", Longitude: " + longitude;
    }
}
