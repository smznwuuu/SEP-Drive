package com.sep.drive.dto;

public class OfferResponse {

    private Long offerId;
    private String driverUsername;
    private double rating;
    private int totalRides;
    private boolean accepted;

    public OfferResponse() {
    }

    public OfferResponse(Long offerId, String driverUsername, double rating, int totalRides, boolean accepted) {
        this.offerId = offerId;
        this.driverUsername = driverUsername;
        this.rating = rating;
        this.totalRides = totalRides;
        this.accepted = accepted;
    }

    public Long getOfferId() {return offerId;}
    public void setOfferId(Long offerId) {this.offerId = offerId;}

    public String getDriverUsername() {return driverUsername;}
    public void setDriverUsername(String driverUsername) {this.driverUsername = driverUsername;}

    public double getRating() {return rating;}
    public void setRating(double rating) {this.rating = rating;}

    public int getTotalRides() {return totalRides;}
    public void setTotalRides(int totalRides) {this.totalRides = totalRides;}

    public boolean isAccepted() {return accepted;}
    public void setAccepted(boolean accepted) {this.accepted = accepted;}}
