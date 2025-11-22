package com.sep.drive.RideOffer;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;


@Entity
@Table(name = "offers")
public class RideOffer {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long offerId;
    private long driverId;
    private long requestId;
    private double DriverRating;
    private int DriverTotalRides;
    private double Distance;
    private long customerId;
    private boolean accepted;

    public RideOffer() {
    }
    public RideOffer(long requestId, long driverid){
        this.requestId = requestId;
        this.driverId = driverid;
    }
    public RideOffer(long driverId, long requestId, double DriverRating, int DriverTotalRides, double Distance)  {
         this.driverId = driverId;
         this.requestId = requestId;
         this.DriverRating = DriverRating;
         this.DriverTotalRides = DriverTotalRides;
         this.Distance = Distance;
    }
    public long getOfferId() {
        return offerId;
    }
    public void setOfferId(long offerid) {
        this.offerId = offerid;
    }
    public long getDriverId() {
        return driverId;
    }
    public void setDriverId(long driverid) {
        this.driverId = driverid;
    }
    public long getRequestId() {
        return requestId;
    }
    public void setRequestId(long requestid) {
        this.requestId = requestid;
    }
    public double getDriverRating() {
        return DriverRating;
    }
    public void setDriverRating(double driverRating) {
        DriverRating = driverRating;
    }
    public int getDriverTotalRides() {
        return DriverTotalRides;
    }
    public void setDriverTotalRides(int driverTotalRides) {
        DriverTotalRides = driverTotalRides;
    }
    public double getDistance() {
        return Distance;
    }
    public void setDistance(double distance) {
        Distance = distance;
    }
    public long getCustomerId() {
        return customerId;
    }
    public void setCustomerId(long customerid) {
        this.customerId = customerid;
    }
    public void acceptRideOffer() {
        accepted = true;
    }
    public boolean getAccepted() {
        return accepted;
    }
    public void setAccepted(boolean accepted) {this.accepted = accepted;}
}
