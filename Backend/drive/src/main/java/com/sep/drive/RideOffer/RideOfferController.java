package com.sep.drive.RideOffer;

import com.sep.drive.CarRequest.CarRequest;
import com.sep.drive.CarRequest.CarRequestService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/rideoffer")
public class RideOfferController {
    private final RideOfferService rideOfferService;
    private final CarRequestService carRequestService;


    public RideOfferController(RideOfferService rideOfferService, CarRequestService carRequestService) {
        this.rideOfferService = rideOfferService;
        this.carRequestService = carRequestService;
    }

    @PostMapping("save")
    public void  saveRideOffer(@RequestBody RideOffer rideOffer) {
        if(carRequestService.findByRId(rideOffer.getRequestId())!=null) {
            if (rideOfferService.findByDriverId(rideOffer.getDriverId()) == null) {
                rideOfferService.save(rideOffer);
            } else {
                throw new IllegalStateException("Offer already exists");
            }
        } else {
            throw new IllegalStateException("Request does not exist");
        }
    }
    @DeleteMapping("delete")
    public void delete(@RequestBody RideOffer rideOffer) {
        rideOfferService.delete(rideOffer);
    }
    @DeleteMapping("deletebyid/{id}")                                                                                 //delete by driver id
    public void deleteById(@PathVariable("id") long id)  {
        rideOfferService.delete(rideOfferService.findByDriverId(id));
    }
    @PostMapping("accept")                                                                                            //accept offer
    public void acceptRideOffer(@RequestBody RideOffer rideOffer)  {

        System.out.println(" Anfrage erhalten zum Annehmen von Offer: "+ rideOffer.getOfferId());
       CarRequest request =carRequestService.findByRId(rideOffer.getRequestId());
       request.setActive(false);
       carRequestService.save(request);
       rideOfferService.acceptRideOffer(rideOffer.getOfferId(), rideOffer.getRequestId());
    }
    @DeleteMapping("reject")
    public void rejectRideOffer(@RequestBody RideOffer rideOffer) {
        rideOfferService.delete(rideOffer);
    }

    @DeleteMapping("withdraw")
    public void withdraw(@RequestBody long driverId)  {
        if(!rideOfferService.findByDriverId(driverId).getAccepted()) {
            rideOfferService.delete(rideOfferService.findByDriverId(driverId));
        } else {
            throw new IllegalStateException("Offer already accepted");
        }
    }
    @GetMapping("sortby")
    public ResponseEntity<List<RideOffer>> findAllSortBy(@RequestParam String sortBy, @RequestParam String order) {
        return new ResponseEntity<>(rideOfferService.findAllSort(sortBy,order), HttpStatus.OK);
    }
    @GetMapping("findid/{id}")                                                                                               //find offer id
    public ResponseEntity<RideOffer> findById(@PathVariable ("id") Long id)  {
        return new ResponseEntity<>(rideOfferService.findByOfferId(id), HttpStatus.OK);
    }
    @GetMapping("finddriverid/{id}")                                                                                         //find driver id
    public ResponseEntity<RideOffer> findByDriverId(@PathVariable ("id") Long driverId)  {
        return new ResponseEntity<>(rideOfferService.findByDriverId(driverId), HttpStatus.OK);
    }
    @GetMapping("findrequestid/{id}")                                                                                       //find by request id
    public ResponseEntity<List<RideOffer>> findByRequestId(@PathVariable ("id") Long requestId)  {
        return new ResponseEntity<>(rideOfferService.findByRequestId(requestId), HttpStatus.OK);
    }
    @GetMapping("findrequestidbydriverid/{id}")
    public Long findRequestIdByDriverId(@PathVariable ("id") long id)  {
        if(rideOfferService.findByDriverId(id) != null) {
            return rideOfferService.findByDriverId(id).getRequestId();
        }
        return null;
    }

}
