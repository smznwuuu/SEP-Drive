package com.sep.drive.CarRequest;

//DTO zum senden der relevanten Daten der verfügbare Anfragen
public class CarRequestAvailable {

    private long request_Id;
    private String time;
    private double startLatitude;
    private double startLongitude;
    private String customer_Name;
    private double rating;
    private String vehicle_Class;
    private double distance;
    private double duration;
    private double price;
    private long driverId;
    private long customerId;

    public CarRequestAvailable(long request_Id, String time, double startLatitude, double startLongitude, String customer_Name, double rating, String vehicle_Class, double distance, double duration, double price, long driverId, long customerId) {
        this.request_Id = request_Id;
        this.time = time;
        this.startLatitude = startLatitude;
        this.startLongitude = startLongitude;
        this.distance = distance;
        this.customer_Name = customer_Name;
        this.rating = rating;
        this.vehicle_Class = vehicle_Class;
        this.duration = duration;
        this.price = price;
        this.driverId = driverId;
        this.customerId = customerId;
    }

    //setter & getter

    public long getRequest_Id() {
        return request_Id;
    }

    public void setRequest_Id(long request_Id) {
        this.request_Id = request_Id;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public double getStartLongitude(){
        return startLongitude;
    }

    public void setStartLongitude(double startLongitude) {
        this.startLongitude = startLongitude;
    }

    public double getStartLatitude(){
        return startLatitude;
    }

    public void setStartLatitude(double startLatitude) {
        this.startLatitude = startLatitude;
    }

    public String getCustomer_Name() {
        return customer_Name;
    }

    public void setCustomer_Name(String customer_Name) {
        this.customer_Name = customer_Name;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public String getVehicle_Class() {
        return vehicle_Class;
    }

    public void setVehicle_Class(String vehicle_Class) {
        this.vehicle_Class = vehicle_Class;
    }

    public double getDistance() {
        return distance;
    }

    public void setDistance(double distance) {
        this.distance = distance;
    }

    public double getDuration() {
        return duration;
    }

    public void setDuration(double duration) {
        this.duration = duration;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public long getDriverId() {
        return driverId;
    }

    public void setDriverId(long driverId) {
        this.driverId = driverId;
    }

    public long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(long customerId) {
        this.customerId = customerId;
    }
}
