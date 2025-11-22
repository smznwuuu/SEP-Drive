package com.sep.drive.CarRequest;

//DTO zum einsetzen der driverId in die entsprechende Request
public class AddDriverIdDTO {

    private long driverId;
    private long requestId;

    public AddDriverIdDTO(long driverId, long requestId) {
        this.driverId = driverId;
        this.requestId = requestId;
    }

    public long getDriverId() {
        return driverId;
    }

    public void setDriverId(long driverId) {
        this.driverId = driverId;
    }

    public long getRequestId() {
        return requestId;
    }

    private void setrequestId(long requestId) {
        this.requestId = requestId;
    }
}
