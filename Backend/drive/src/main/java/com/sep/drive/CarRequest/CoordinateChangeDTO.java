package com.sep.drive.CarRequest;

import java.util.ArrayList;

//DTO zum empfangen von zusätzlichen Wegpunkten
public class CoordinateChangeDTO {

    private ArrayList<Coordinate> coordinate;
    private int index;

    public CoordinateChangeDTO(ArrayList<Coordinate> waypoints, int index) {
        this.coordinate = waypoints;
        this.index = index;
    }

    public ArrayList<Coordinate> getCoordinate() {
        return coordinate;
    }

    public void setCoordinate(ArrayList<Coordinate> coordinate) {
        this.coordinate = coordinate;
    }

    public int getIndex() {
        return index;
    }

    public void setIndex(int index) {
        this.index = index;
    }
}
