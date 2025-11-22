package com.sep.drive.Coords;

import jakarta.persistence.*;

@Entity
@Table(name = "coords")
public class Coords {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long coordsId;
    private long requestId;
    private double latitude;
    private double longitude;
    private int ord;

    public Coords() {}

    public Coords(long requestId, double latitude, double longitude, int ord) {
        this.requestId = requestId;
        this.latitude = latitude;
        this.longitude = longitude;
        this.ord = ord;
    }

    public long getCoordsId() {
        return coordsId;
    }

    public void setCoordsId(long coordsId) {
        this.coordsId = coordsId;
    }

    public long getRequestId() {
        return requestId;
    }

    public void setRequestId(long requestId) {
        this.requestId = requestId;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public long getOrder() {
        return ord;
    }

    public void setOrder(int ord) {
        this.ord = ord;
    }


}
