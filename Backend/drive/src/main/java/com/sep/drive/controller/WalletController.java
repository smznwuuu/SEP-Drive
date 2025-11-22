package com.sep.drive.controller;

import com.sep.drive.dto.BalanceResponse;
import com.sep.drive.dto.CompleteRideRequest;
import com.sep.drive.dto.TopUpRequest;
import com.sep.drive.service.RideService;
import com.sep.drive.userprofile.User;
import com.sep.drive.userprofile.UserProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/wallet")
public class WalletController {
    private final UserProfileService userService;
    private final RideService rideService;

    public WalletController(UserProfileService userService,RideService rideService) {
        this.userService = userService;
        this.rideService = rideService;
    }

    @PostMapping("/top-up")
    public ResponseEntity<String> topUp(@RequestBody TopUpRequest request) {
        User user = userService.findByUsername(request.getUsername());
        if (user == null) {
            throw new IllegalArgumentException("User not found: " + request.getUsername());
        }

        if (request.getAmount() <= 0) {
            throw new IllegalArgumentException("Top-up amount must be greater than 0.");
        }

        user.setBalance(user.getBalance() + request.getAmount());
        userService.save(user);
        return ResponseEntity.ok("Balance updated successfully");
    }

    @GetMapping("/balance/{username}")
    public ResponseEntity<BalanceResponse> getBalance(@PathVariable String username) {
        User user = userService.findByUsername(username);
        if (user == null) {
            throw new IllegalArgumentException("User not found: " + username);
        }

        return ResponseEntity.ok(new BalanceResponse(username, user.getBalance()));
    }
    @PostMapping("/ride/complete")
    public ResponseEntity<String> completeRide(@RequestBody CompleteRideRequest request) {
        User customer = userService.findByUsername(request.getCustomerUsername());
        User driver = userService.findByUsername(request.getDriverUsername());

        if (customer == null || driver == null) {
            throw new IllegalArgumentException("Customer or driver not found.");
        }

        rideService.completeRide(customer, driver, request.getDistanceKm(), request.getDurationMin());

        return ResponseEntity.ok("Ride completed and payment transferred.");
    }

}


