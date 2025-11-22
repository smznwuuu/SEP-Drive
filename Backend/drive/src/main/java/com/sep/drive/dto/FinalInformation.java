package com.sep.drive.dto;

public class FinalInformation {
    private double price;
    private double duration;
    private double distance;

    public FinalInformation(double price, double duration, double distance) {
        this.price = price;
        this.duration = duration;
        this.distance = distance;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public double getDuration() {
        return duration;
    }

    public void setDuration(double duration) {
        this.duration = duration;
    }

    public double getDistance() {
        return distance;
    }

    public void setDistance(double distance) {
        this.distance = distance;
    }
}
