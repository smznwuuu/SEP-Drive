package com.sep.drive.controller;

import com.sep.drive.dto.CreateOfferRequest;
import com.sep.drive.dto.OfferResponse;
import com.sep.drive.service.OfferService;
import com.sep.drive.userprofile.User;
import com.sep.drive.userprofile.UserProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/offers")
public class OfferController {

    private final OfferService offerService;
    private final UserProfileService userService;

    public OfferController(OfferService offerService, UserProfileService userService) {
        this.offerService = offerService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<String> makeOffer(@RequestBody CreateOfferRequest request) {
        User driver = userService.findByUsername(request.getDriverUsername());
        if (driver == null) {
            throw new IllegalArgumentException("Driver not found");
        }

        offerService.createOffer(request.getRequestId(), driver.getId());
        return ResponseEntity.ok("Offer sent");
    }

    @GetMapping("/request/{requestId}")
    public ResponseEntity<List<OfferResponse>> getOffers(@PathVariable Long requestId) {
        return ResponseEntity.ok(offerService.getOfferDetailsForRequest(requestId));
    }
    @PostMapping("/{offerId}/accept")
    public ResponseEntity<String> acceptOffer(@PathVariable Long offerId) {
        offerService.acceptOffer(offerId);
        return ResponseEntity.ok("Offer accepted");
    }
    @DeleteMapping("/{offerId}")
    public ResponseEntity<String> withdrawOffer(@PathVariable Long offerId) {
        offerService.withdrawOffer(offerId);
        return ResponseEntity.ok("Offer withdrawn");
    }



}

