package com.sep.drive.service;

import com.sep.drive.CarRequest.CarRequest;
import com.sep.drive.CarRequest.CarRequestRepository;
import com.sep.drive.CompletedRequest.CompletedRequest;
import com.sep.drive.CompletedRequest.CompletedRequestRepository;
import com.sep.drive.dto.OfferResponse;
import com.sep.drive.dto.RideHistoryEntry;
import com.sep.drive.RideOffer.RideOffer;
import com.sep.drive.repository.OfferRepository;
import com.sep.drive.repository.UserRepository;
import com.sep.drive.userprofile.Role;
import com.sep.drive.userprofile.User;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OfferService {

    private final OfferRepository offerRepo;
    private final UserRepository userRepository;
    private  final CarRequestRepository carRequestRepository;
    private CompletedRequestRepository completedRequestRepository;


    public OfferService(OfferRepository offerRepo,UserRepository userRepository,CarRequestRepository carRequestRepository,CompletedRequestRepository completedRequestRepository) {
        this.offerRepo = offerRepo;
        this.userRepository = userRepository;
        this.carRequestRepository = carRequestRepository;
        this.completedRequestRepository = completedRequestRepository;
    }

    public void createOffer(Long requestId, Long driverId) {
        if (offerRepo.existsByRequestIdAndDriverId(requestId, driverId)) {
            throw new IllegalArgumentException("Driver already made an offer for this request.");
        }

        offerRepo.save(new RideOffer(requestId, driverId));
    }

    public List<OfferResponse> getOfferDetailsForRequest(Long requestId) {
        List<RideOffer> offers = offerRepo.findByRequestId(requestId);
        List<OfferResponse> result = new ArrayList<>();

        for (RideOffer offer : offers) {
            User driver = userRepository.findById(offer.getDriverId())
                    .orElseThrow(() -> new IllegalArgumentException("Driver not found"));

            OfferResponse response = new OfferResponse();
            response.setOfferId(offer.getOfferId());
            response.setDriverUsername(driver.getUsername());
            response.setRating(driver.getRating());
            response.setTotalRides(driver.getTotalRides());
            response.setAccepted(offer.getAccepted());

            result.add(response);
        }

        return result;
    }
    public void acceptOffer(Long offerId) {
        RideOffer acceptedOffer = offerRepo.findById(offerId)
                .orElseThrow(() -> new IllegalArgumentException("Offer not found"));

        List<RideOffer> all = offerRepo.findByRequestId(acceptedOffer.getRequestId());

        for (RideOffer offer : all) {
            offer.setAccepted(offer.getOfferId() == offerId);
        }

        offerRepo.saveAll(all);
    }
    public void withdrawOffer(Long offerId) {
        RideOffer offer = offerRepo.findById(offerId)
                .orElseThrow(() -> new IllegalArgumentException("Offer not found"));

        if (offer.getAccepted()) {
            throw new IllegalStateException("Offer already accepted.");
        }

        offerRepo.delete(offer);
    }
    public List<RideHistoryEntry> getHistoryForUser(Long userId, Role role) {
        List<CompletedRequest> completedRequests = (role == Role.DRIVER)
                ? completedRequestRepository.findByDId(userId)
                : completedRequestRepository.findByCId(userId);

        List<RideHistoryEntry> history = new ArrayList<>();

        for (CompletedRequest cr : completedRequests) {
            User driver = userRepository.findById(cr.getDriverId()).orElse(null);
            User customer = userRepository.findById(cr.getCustomerId()).orElse(null);

            if (driver == null || customer == null) continue;

            RideHistoryEntry entry = new RideHistoryEntry();
            entry.setRequestId(cr.getRequestId());
            entry.setDriverUsername(driver.getUsername());
            entry.setDriverFullName(driver.getFirstname() + " " + driver.getLastname());
            entry.setCustomerUsername(customer.getUsername());
            entry.setCustomerFullName(customer.getFirstname() + " " + customer.getLastname());
            entry.setVehicleClass(cr.getVehicleClass());
            entry.setTime(cr.getTime());
            entry.setDistance(cr.getDistance());
            entry.setDurationMinutes(cr.getDuration());
            entry.setPrice(cr.getPrice());
            entry.setRatingFromCustomer(cr.getRatingFromCustomer());
            entry.setRatingFromDriver(cr.getRatingFromDriver());

            history.add(entry);
        }

        return history;
    }




}

