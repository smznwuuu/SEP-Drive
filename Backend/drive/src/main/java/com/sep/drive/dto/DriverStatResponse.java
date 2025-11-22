package com.sep.drive.dto;

public class DriverStatResponse {
    private int time;
    private double income;
    private double distance;
    private double duration;
    private double average_rate;

    public DriverStatResponse(int time, double income, double distance, double duration, double average_rate) {
        this.time = time;
        this.income = income;
        this.distance = distance;
        this.duration = duration;
        this.average_rate = average_rate;
    }

    public int getTime() { return time; }
    public void setTime(int time) { this.time = time; }

    public double getIncome() { return income; }
    public void setIncome(double income) { this.income = income; }

    public double getDistance() { return distance; }
    public void setDistance(double distance) { this.distance = distance; }

    public double getDuration() { return duration; }
    public void setDuration(double duration) { this.duration = duration; }

    public double getAverage_rate() { return average_rate; }
    public void setAverage_rate(double average_rate) { this.average_rate = average_rate; }
}

