package com.sep.drive.RideOffer;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;


import java.util.List;

@Repository
public interface RideOfferRepository extends JpaRepository<RideOffer, Long> {
     RideOffer findByDriverId(Long driverid);                                                                           //finde Driverid

     RideOffer findByOfferId(Long offerId);                                                                             //finde offerid

     List<RideOffer> findByRequestId(Long requestId);                                                                   //finderequestid

    @Modifying                                                                                                          //delete rest
    @Query(value = "DELETE FROM offers WHERE request_id = :id", nativeQuery = true)
    public void deleteRest(@Param("id") long id);

    @Query(value ="select * from offers", nativeQuery = true)                                                           //findallsort
    List<RideOffer> findAllSort(Sort sort);


}
