package com.sep.drive.repository;

import com.sep.drive.RideOffer.RideOffer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OfferRepository extends JpaRepository<RideOffer, Long> {

    // Alle Angebote zu einer bestimmten Fahranfrage (Request)
    List<RideOffer> findByRequestId(Long requestId);

    // Prüfen, ob ein Fahrer bereits ein Angebot zu dieser Fahranfrage gemacht hat
    boolean existsByRequestIdAndDriverId(Long requestId, Long driverId);

    List<RideOffer> findByDriverIdAndAcceptedTrue(Long driverId);
    List<RideOffer> findByAcceptedTrue();

}

