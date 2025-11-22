package com.sep.drive.CarRequest;

import jakarta.persistence.Embeddable;

//Werden in Form einer ArrayList für jedes Objekt CarRequest geseichert
@Embeddable
public class Coordinate {
    private double latitude;
    private double longitude;
    boolean isVirtual;

    public Coordinate() {}

    public Coordinate(double latitude, double longitude, boolean isVirtual) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.isVirtual = isVirtual;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public boolean getIsVirtual() {
        return isVirtual;
    }

    public void setVirtual(boolean virtual) {
        isVirtual = virtual;
    }
}

