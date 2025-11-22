package com.sep.drive.service;

import com.sep.drive.models.enums.CarClass;
import com.sep.drive.userprofile.User;
import com.sep.drive.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class RideService {

    private final UserRepository userRepository;

    public RideService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public double calculateRidePrice(double distanceKm, CarClass carClass) {
        if (carClass == null) {
            throw new IllegalArgumentException("Car class cannot be null");
        }
        switch (carClass) {
            case SMALL: return distanceKm * 1.0;
            case MEDIUM: return distanceKm * 2.0;
            case DELUXE: return distanceKm * 10.0;
            default: throw new IllegalArgumentException("Unknown car class");
        }
    }

    public void completeRide(User customer, User driver, double distanceKm, double durationMin) {
        double price = calculateRidePrice(distanceKm, driver.getCarClass());

        if (customer.getBalance() < price) {
            throw new IllegalArgumentException("Not enough balance.");
        }

        // Bezahlung
        customer.setBalance(customer.getBalance() - price);
        driver.setBalance(driver.getBalance() + price);

        // Fahrten zählen
        customer.settotalRides(customer.getTotalRides() + 1);
        driver.settotalRides(driver.getTotalRides() + 1);

        //  Gefahrene Distanz hinzufügen
        double newTotalDistance = driver.getTotalDistance() + distanceKm;
        driver.setTotalDistance(newTotalDistance);

        //  Gefahrene Minuten hinzufügen
        double newTotalDriveTime = driver.getDriveTime() + durationMin;
        driver.setDriveTime(newTotalDriveTime);

        // Total earned setzen
        driver.setTotalEarned(driver.getTotalEarned() + price);

        // Speichern
        userRepository.save(customer);
        userRepository.save(driver);


    }
}
