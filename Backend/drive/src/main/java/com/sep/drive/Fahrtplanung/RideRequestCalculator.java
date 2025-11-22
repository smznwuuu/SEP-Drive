package com.sep.drive.Fahrtplanung;


public class RideRequestCalculator  {


    public RideRequestCalculator() {

    }


    public double getPrice(double distance, String vehicleClass) {
        if (vehicleClass.equals("SMALL")) {
            return distance * 1.0;
        }
        else if (vehicleClass.equals("MEDIUM")) {
            return distance * 2.0;
        }
        else if (vehicleClass.equals("DELUXE")) {
            return distance * 10.0;
        }
        return distance*0;
    }
}
