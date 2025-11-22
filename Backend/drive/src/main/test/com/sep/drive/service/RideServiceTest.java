package com.sep.drive.service;

import com.sep.drive.models.enums.CarClass;
import com.sep.drive.service.RideService;
import com.sep.drive.userprofile.User;
import com.sep.drive.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class RideServiceTest {

    private UserRepository userRepository;
    private RideService rideService;

    @BeforeEach
    public void setUp() {
        userRepository = mock(UserRepository.class);
        rideService = new RideService(userRepository);
    }

    @Test
    public void testCalculateRidePriceSmallCar() {
        double price = rideService.calculateRidePrice(10, CarClass.SMALL);
        assertEquals(10.0, price);
    }

    @Test
    public void testCalculateRidePriceMediumCar() {
        double price = rideService.calculateRidePrice(5, CarClass.MEDIUM);
        assertEquals(10.0, price);
    }

    @Test
    public void testCalculateRidePriceDeluxeCar() {
        double price = rideService.calculateRidePrice(3, CarClass.DELUXE);
        assertEquals(30.0, price);
    }

    @Test
    public void testCalculateRidePriceInvalidCarClass() {
        assertThrows(IllegalArgumentException.class, () ->
                rideService.calculateRidePrice(10, null));
    }

    @Test
    public void testCompleteRideWithSufficientBalance() {
        User customer = new User();
        customer.setBalance(100.0);
        customer.settotalRides(0);

        User driver = new User();
        driver.setBalance(50.0);
        driver.setCarClass(CarClass.SMALL);
        driver.settotalRides(0);
        driver.setTotalDistance(0.0);

        rideService.completeRide(customer, driver, 10.0, 15.0);

        assertEquals(90.0, customer.getBalance());
        assertEquals(60.0, driver.getBalance());
        assertEquals(1, customer.getTotalRides());
        assertEquals(1, driver.getTotalRides());
        assertEquals(10.0, driver.getTotalDistance());

        verify(userRepository).save(customer);
        verify(userRepository).save(driver);
    }
    @Test
    public void testCompleteRideWithMediumCarClass() {
        User customer = new User();
        customer.setBalance(100.0);
        customer.settotalRides(0);

        User driver = new User();
        driver.setBalance(20.0);
        driver.setCarClass(CarClass.MEDIUM);
        driver.settotalRides(0);
        driver.setTotalDistance(0.0);

        rideService.completeRide(customer, driver, 10.0, 15.0);

        assertEquals(80.0, customer.getBalance());
        assertEquals(40.0, driver.getBalance());
        assertEquals(1, customer.getTotalRides());
        assertEquals(1, driver.getTotalRides());
        assertEquals(10.0, driver.getTotalDistance());

        verify(userRepository).save(customer);
        verify(userRepository).save(driver);
    }
    @Test
    public void testCompleteRideWithDeluxeCarClass() {
        User customer = new User();
        customer.setBalance(150.0);
        customer.settotalRides(0);

        User driver = new User();
        driver.setBalance(10.0);
        driver.setCarClass(CarClass.DELUXE);
        driver.settotalRides(0);
        driver.setTotalDistance(0.0);

        rideService.completeRide(customer, driver, 10.0, 15.0);

        assertEquals(50.0, customer.getBalance());
        assertEquals(110.0, driver.getBalance());
        assertEquals(1, customer.getTotalRides());
        assertEquals(1, driver.getTotalRides());
        assertEquals(10.0, driver.getTotalDistance());

        verify(userRepository).save(customer);
        verify(userRepository).save(driver);
    }

    @Test
    public void testCompleteRideWithInsufficientBalance() {
        User customer = new User();
        customer.setBalance(5.0);
        User driver = new User();
        driver.setCarClass(CarClass.DELUXE);

        assertThrows(IllegalArgumentException.class, () -> {
            rideService.completeRide(customer, driver, 10.0, 20.0);
        });

        verify(userRepository, never()).save(any());
    }
}

