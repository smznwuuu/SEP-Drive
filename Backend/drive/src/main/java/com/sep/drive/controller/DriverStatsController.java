package com.sep.drive.controller;

import com.sep.drive.dto.DriverStatResponse;
import com.sep.drive.service.DriverStatsService;
import com.sep.drive.userprofile.User;
import com.sep.drive.userprofile.UserProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/driver-stats")
@CrossOrigin(origins = "http://localhost:4200")
public class DriverStatsController {

    private final DriverStatsService statsService;
    private final UserProfileService userService;

    public DriverStatsController(DriverStatsService statsService, UserProfileService userService) {
        this.statsService = statsService;
        this.userService = userService;
    }

    @GetMapping("/{username}")
    public ResponseEntity<List<DriverStatResponse>> getStats(
            @PathVariable String username,
            @RequestParam String type,
            @RequestParam String time) {

        User driver = userService.findByUsername(username);
        if (driver == null) {
            throw new IllegalArgumentException("User not found: " + username);
        }

        if (type.equalsIgnoreCase("month")) {
            int year = Integer.parseInt(time);
            return ResponseEntity.ok(statsService.getMonthlyStats(driver.getId(), year));

        } else if (type.equalsIgnoreCase("day")) {
            String[] parts = time.split("-");
            int year = Integer.parseInt(parts[0]);
            int month = Integer.parseInt(parts[1]);
            return ResponseEntity.ok(statsService.getDailyStats(driver.getId(), year, month));

        } else {
            throw new IllegalArgumentException("Invalid type: " + type);
        }
    }
}
