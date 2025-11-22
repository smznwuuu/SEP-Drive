package com.sep.drive.controller;

import com.sep.drive.dto.PagedRideHistoryResponse;
import com.sep.drive.dto.RideHistoryEntry;
import com.sep.drive.service.OfferService;
import com.sep.drive.userprofile.User;
import com.sep.drive.userprofile.UserProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/history")
public class RideHistoryController {

    private final OfferService offerService;
    private final UserProfileService userService;

    public RideHistoryController(OfferService offerService, UserProfileService userService) {
        this.offerService = offerService;
        this.userService = userService;
    }

    @GetMapping("/{username}")
    public ResponseEntity<PagedRideHistoryResponse> getHistory(
            @PathVariable String username,
            @RequestParam(required = false, defaultValue = "") String search,
            @RequestParam(required = false, defaultValue = "date") String sortBy,
            @RequestParam(required = false, defaultValue = "asc") String order,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "10") int size
    ) {
        User user = userService.findByUsername(username);
        if (user == null) throw new IllegalArgumentException("User not found");

        List<RideHistoryEntry> history = offerService.getHistoryForUser(user.getId(), user.getRole());

        // Suche
        if (!search.isBlank()) {
            String lowerSearch = search.toLowerCase();
            history = history.stream()
                    .filter(entry ->
                            entry.getDriverFullName().toLowerCase().contains(lowerSearch) ||
                                    entry.getCustomerFullName().toLowerCase().contains(lowerSearch))
                    .toList();
        }

        // Sortierung
        Comparator<RideHistoryEntry> comparator = switch (sortBy.toLowerCase()) {
            case "date" -> Comparator.comparing(RideHistoryEntry::getTime);
            case "distance" -> Comparator.comparingDouble(RideHistoryEntry::getDistance);
            case "price" -> Comparator.comparingDouble(RideHistoryEntry::getPrice);
            case "duration" -> Comparator.comparingDouble(RideHistoryEntry::getDurationMinutes);
            case "driver" -> Comparator.comparing(RideHistoryEntry::getDriverFullName, String.CASE_INSENSITIVE_ORDER);
            case "customer" -> Comparator.comparing(RideHistoryEntry::getCustomerFullName, String.CASE_INSENSITIVE_ORDER);
            case "ratingcustomer" -> Comparator.comparingDouble(RideHistoryEntry::getRatingFromCustomer);
            case "ratingdriver" -> Comparator.comparingDouble(RideHistoryEntry::getRatingFromDriver);
            default -> Comparator.comparing(RideHistoryEntry::getTime);
        };
        if (order.equalsIgnoreCase("desc")) {
            comparator = comparator.reversed();
        }

        history = history.stream().sorted(comparator).toList();

        // Gesamtanzahl
        int totalCount = history.size();

        // Pagination
        int fromIndex = page * size;
        int toIndex = Math.min(fromIndex + size, totalCount);
        List<RideHistoryEntry> pagedHistory = fromIndex >= totalCount
                ? List.of()
                : history.subList(fromIndex, toIndex);

        return ResponseEntity.ok(new PagedRideHistoryResponse(pagedHistory, totalCount));
    }
}
