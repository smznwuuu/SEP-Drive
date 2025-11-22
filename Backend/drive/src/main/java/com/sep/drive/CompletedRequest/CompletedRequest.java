package com.sep.drive.CompletedRequest;

import com.sep.drive.CarRequest.Coordinate;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "completed_requests")
public class CompletedRequest {
    @Id
    private long requestId;                             //Schlüssel der Request; übernommen von ursprünglicher ID
    private long customerId;                            //werden aus ursprünglicher Anfrage übernommen (siehe CarRequest)
    private long driverId;
    private String customerName;
    private double rating;
    private double ratingFromCustomer;
    private double ratingFromDriver;
    private String vehicleClass;
    private double startLatitude;
    private double startLongitude;
    private double destinationLatitude;
    private double destinationLongitude;
    private String time;
    private double distance;
    private double duration;
    private double price;
    @ElementCollection
    @CollectionTable(name = "former_waypoints", joinColumns = @JoinColumn(name = "request_id"))
    private List<Coordinate> waypoints = new ArrayList<>();

    public CompletedRequest() {
    }

    public CompletedRequest(long requestId, long customerId, long DriverId, String customerName, double rating, String vehicleClass, double startLatitude, double startLongitude, double destinationLatitude, double destinationLongitude, String time, double distance, double duration, double price, List<Coordinate> waypoints) {
        this.requestId = requestId;
        this.customerId = customerId;
        this.driverId = DriverId;
        this.customerName = customerName;
        this.rating = rating;
        this.vehicleClass = vehicleClass;
        this.startLongitude = startLongitude;
        this.startLatitude = startLatitude;
        this.destinationLongitude = destinationLongitude;
        this.destinationLatitude = destinationLatitude;
        this.time = time;
        this.distance = distance;
        this.duration = duration;
        this.price = price;
        this.waypoints = waypoints;
    }

    //setter und getter:

    public long getRequestId() {
        return requestId;
    }

    public void setRequestId(long requestId) {
        this.requestId = requestId;
    }

    public long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(long customerID) {
        this.customerId = customerID;
    }

    public long getDriverId() {
        return driverId;
    }

    public void setDriverId(long driverID) {
        this.driverId = driverID;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public double getRatingFromCustomer() {
        return ratingFromCustomer;
    }

    public void setRatingFromCustomer(double rating) {
        this.ratingFromCustomer = rating;
    }

    public double getRatingFromDriver() {
        return ratingFromDriver;
    }

    public void setRatingFromDriver(double ratingFromDriver) {
        this.ratingFromDriver = ratingFromDriver;
    }

    public String getVehicleClass() {
        return vehicleClass;
    }

    public void setVehicleClass(String vehicleClass) {
        this.vehicleClass = vehicleClass;
    }

    public double getStartLatitude() {
        return startLatitude;
    }

    public void setStartLatitude(double startLatitude) {
        this.startLatitude = startLatitude;
    }

    public double getStartLongitude() {
        return startLongitude;
    }

    public void setStartLongitude(double startLongitude) {
        this.startLongitude = startLongitude;
    }

    public double getDestinationLatitude() {
        return destinationLatitude;
    }

    public void setDestinationLatitude(double destinationLatitude) {
        this.destinationLatitude = destinationLatitude;
    }

    public double getDestinationLongitude() {
        return destinationLongitude;
    }

    public void setDestinationLongitude(double destinationLongitude) {
        this.destinationLongitude = destinationLongitude;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
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

    public List<Coordinate> getWaypoints() {
        return waypoints;
    }

    public void setWaypoints(List<Coordinate> waypoints) {
        this.waypoints = waypoints;
    }
}
