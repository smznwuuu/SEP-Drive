package com.sep.drive.RideOffer;

import jakarta.transaction.Transactional;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RideOfferService {
    private final RideOfferRepository rideOfferRepository;

    public RideOfferService(RideOfferRepository rideOfferRepository) {
        this.rideOfferRepository = rideOfferRepository;
    }

    public void save(RideOffer rideOffer) {
        rideOfferRepository.save(rideOffer);
    }

    public void delete(RideOffer rideOffer) {
        rideOfferRepository.delete(rideOffer);
    }

    public RideOffer findByDriverId(long driverId)  {                                                                          //findbydriverid

        return rideOfferRepository.findByDriverId(driverId);
    }

    public RideOffer findByOfferId(long offerId)  {                                                                          //findofferid
        return rideOfferRepository.findByOfferId(offerId);
    }

    public List<RideOffer> findByRequestId(long requestId)  {                                                                   //findrequestid
        return rideOfferRepository.findByRequestId(requestId);
    }

    @Transactional
    public void deleteRest(long id) {                                                                             //deleterest
        rideOfferRepository.deleteRest(id);
    }

    public List<RideOffer> findAllSort(String sortBy, String order) {
        Sort sort = Sort.unsorted();
        if(sortBy != null && !sortBy.isEmpty() && order != null && !order.isEmpty()) {
            Sort.Direction direction = Sort.Direction.fromString(order.toUpperCase());
            sort = Sort.by(direction, sortBy);
        }
        return rideOfferRepository.findAllSort(sort);
    }
    @Transactional
    public void acceptRideOffer(long offerId, long requestId) {
        RideOffer offer = rideOfferRepository.findByOfferId(offerId);
        offer.setAccepted(true);
        rideOfferRepository.save(offer);
        rideOfferRepository.deleteRest(requestId);
    }
}
