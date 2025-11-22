package com.sep.drive.dto;

public class CreateOfferRequest {
    private Long requestId;
    private String driverUsername;

    public CreateOfferRequest() {}

    public CreateOfferRequest(Long requestId, String driverUsername) {
        this.requestId = requestId;
        this.driverUsername = driverUsername;
    }

    public Long getRequestId() {return requestId;}
    public void setRequestId(Long requestId) {this.requestId = requestId;}

    public String getDriverUsername() {return driverUsername;}
    public void setDriverUsername(String driverUsername) {this.driverUsername = driverUsername;}
}

