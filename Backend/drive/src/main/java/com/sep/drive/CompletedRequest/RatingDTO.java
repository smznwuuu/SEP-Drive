package com.sep.drive.CompletedRequest;

public class RatingDTO {

    private long requestId;
    private double rating;

    public RatingDTO(long requestId, double rating) {
        this.requestId = requestId;
        this.rating = rating;
    }

    public long getRequestId() {
        return requestId;
    }

    public void setRequestId(long requestId) {
        this.requestId = requestId;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }
}
