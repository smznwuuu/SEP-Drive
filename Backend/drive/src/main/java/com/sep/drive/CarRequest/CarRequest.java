package com.sep.drive.CarRequest;

import jakarta.persistence.*;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

@Entity
public class CarRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long requestId;                             //Schlüssel der Request; automatisch genertiert
    private long customerId;                            //IDs der Beteiligten
    private long driverId;
    private String customerName;                        //wird aus UserProfileRepository mitgeliefert
    private double rating;                              //Bewertung des Kundenprofils
    private double ratingFromCustomer;
    private double ratingFromDriver;
    private String vehicleClass;                        //angeforderte Fahrzeugklasse
    private boolean isActive;                           //Zustand der Anfrage
    private double startLatitude;                       //Koordinaten der Startposition und der Zielposition
    private double startLongitude;                      //->entfernen, falls Route aktiv gestellt wird
    private double destinationLatitude;
    private double destinationLongitude;
    private String time;                                //gibt Zeitpunkt der Erstellung an
    private double distance;
    private double duration;                            //zeigt geschätzte Dauer der Fahrt an
    private double price;                               //wird bei Erstellung durch RideRequestCalculator berechnet
    @ElementCollection
    @CollectionTable(name = "car_request_waypoints", joinColumns = @JoinColumn(name = "request_id"))
    private List<Coordinate> waypoints = new ArrayList<>();

    public CarRequest() {
        this.time = ZonedDateTime.now(ZoneId.of("Europe/Berlin")).format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss"));
    }

    public CarRequest(long customerId, String customerName, double rating, String vehicleClass, double startLatitude, double startLongitude, double destinationLatitude, double destinationLongitude, double distance, double duration, double price /*int personNumber*/, List<Coordinate> waypoints) {
        this.customerId = customerId;
        this.customerName = customerName;
        this.rating = rating;
        this.vehicleClass = vehicleClass;
        this.startLongitude = startLongitude;
        this.startLatitude = startLatitude;
        this.destinationLongitude = destinationLongitude;
        this.destinationLatitude = destinationLatitude;
        DateTimeFormatter format = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");   //gibt Format für das Datum an
        this.time = ZonedDateTime.now(ZoneId.of("Europe/Berlin")).format(format);//legt Zeitpunkt der Erstellung fest
        this.distance = distance;
        this.duration = duration;
        this.price = price;
        //this.route = route;
        //.personNumber = personNumber;
        this.waypoints = waypoints;
    }

    //setter und getter:

    public long getID() {
        return requestId;
    }

    public void setID(long requestId) {
        this.requestId = requestId;
    }

    public long getCustomerID() {
        return customerId;
    }

    public void setCustomerID(long customerID) {
        this.customerId = customerID;
    }

    public long getDriverID() {
        return driverId;
    }

    public void setDriverID(long driverID) {
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

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean isActive) {
        this.isActive = isActive;
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
