package com.sep.drive.CarRequest;

import com.sep.drive.RideOffer.RideOfferService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CarRequestController {

    private final CarRequestService carRequestService;
    private final RideOfferService rideOfferService;

    public CarRequestController(CarRequestService carRequestService, RideOfferService rideOfferService) {
        this.carRequestService = carRequestService;
        this.rideOfferService = rideOfferService;
    }

    //gibt alle Requests aus
    @GetMapping("/requests")
    public ResponseEntity<List<CarRequest>> getCarRequest() {
        return new ResponseEntity<>(this.carRequestService.findAll(), HttpStatus.OK);
    }

    //fügt Request hinzu, falls noch keine mit der gleichen customerID  existiert
    @PostMapping("/requests")
    public void addCarRequest(@RequestBody CarRequest carRequest) {
        if(carRequestService.findByCId(carRequest.getCustomerID())==null){
            carRequest.setActive(true);
            carRequestService.save(carRequest);
        } else {
            throw new IllegalStateException("Customer already has an active request");
        }
    }

    //entfernt Requests
    @DeleteMapping("/requests")
    public void deleteCarRequest(@RequestBody CarRequest carRequest) {
        if(carRequestService.findByRId(carRequest.getID())!=null) {
            rideOfferService.deleteRest(carRequest.getID());
            carRequestService.delete(carRequest);
        } else {
            throw new IllegalStateException("Request does not exist");
        }
    }

    //sucht Requests über requestID
    @GetMapping("/requests/findByID/{iD}")
    public ResponseEntity<CarRequest> findByID(@PathVariable ("iD") Long iD) {
        if (carRequestService.findByRId(iD) != null) {
            return new ResponseEntity<>(carRequestService.findByRId(iD), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    //entfernt Request mit requestID
    @DeleteMapping("request/deleteByID/{iD}")
    public void deleteByID(@PathVariable ("iD") Long iD) {
        if(carRequestService.findByRId(iD)!=null) {
            rideOfferService.deleteRest(iD);
            carRequestService.delete(carRequestService.findByRId(iD));
        } else {
            throw new IllegalArgumentException("Request does not exist");
        }
    }

    //sucht Request mit customerID
    @GetMapping("requests/findByCID/{iD}")
    public ResponseEntity<CarRequest> findByCID(@PathVariable ("iD") Long iD) {
        if(carRequestService.findByCId(iD)!=null) {
            return new ResponseEntity<>(carRequestService.findByCId(iD), HttpStatus.OK);
        } else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    //entfernt Request mit customerID
    @DeleteMapping("/requests/deleteByCID/{iD}")
    public void deleteByCID(@PathVariable ("iD") long iD) {
        if(carRequestService.findByCId(iD)!=null) {
            CarRequest temp = carRequestService.findByDId(iD);
            rideOfferService.deleteRest(temp.getID());
            carRequestService.delete(temp);
        } else {
            throw new IllegalArgumentException("Request does not exist");
        }
    }

    //sucht Request mit driverID
    @GetMapping("requests/findByDID/{iD}")
    public ResponseEntity<CarRequest> findByDID(@PathVariable ("iD") Long iD) {
        if (carRequestService.findByDId(iD) != null) {
            return new ResponseEntity<>(carRequestService.findByDId(iD), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    //entfernt Request mit driverID
    @DeleteMapping("/requests/deleteByDID/{iD}")
    public void deleteByDID(@PathVariable ("iD") long iD) {
        if(carRequestService.findByDId(iD)!=null) {
            CarRequest temp = carRequestService.findByDId(iD);
            rideOfferService.deleteRest(temp.getID());
            carRequestService.delete(temp);
        } else {
            throw new IllegalArgumentException("Request does not exist");
        }
    }

    //sucht alle aktiven Anfragen
    @GetMapping("/requests/findAllAvailable")
    public ResponseEntity<List<CarRequestAvailable>> findAllAvailable(@RequestParam(required = false)String sortBy, @RequestParam(required = false)String order) {
        return new ResponseEntity<>(carRequestService.findAllAvailable(sortBy, order), HttpStatus.OK);
    }

    @PostMapping("/requests/addDriverID")
    public void  addDriverId(@RequestBody AddDriverIdDTO addDriverIdDTO) {
        CarRequest request = carRequestService.findByRId(addDriverIdDTO.getRequestId());
        if (request != null) {
            request.setDriverID(addDriverIdDTO.getDriverId());
            carRequestService.save(request);
        } else {
            throw new IllegalArgumentException("Request does not exist");
        }
    }

    //fragt ab, ob ein Fahrer mit der gegebenen ID existiert
    @GetMapping("/requests/driverExists/{iD}")
    public boolean driverExists(@PathVariable("iD") long id) {
        return carRequestService.findByDId(id) != null;
    }

    //fügt mehrere Wegpunkte hintereinander an die gewünschte Stelle ein
    @PostMapping("requests/addWaypoint/{iD}")
    public void addWaypoint(@RequestBody CoordinateChangeDTO coordinates, @PathVariable("iD") long iD) {
        CarRequest carRequest = carRequestService.findByRId(iD);
        List<Coordinate> changes = coordinates.getCoordinate();
        List<Coordinate> changed = carRequest.getWaypoints();
        int index = coordinates.getIndex();
        int bounds = changed.size();
        if(index < bounds && index >= 0) {
            for (Coordinate change : changes) {
                changed.add(index, change);
                index++;
            }
        } else if(index == bounds) {
            changed.addAll(changes);
        }
        carRequest.setWaypoints(changed);
        carRequestService.save(carRequest);
    }

    //entfernt einzelne Wegpunkte einer CarRequest
    @DeleteMapping("/requests/deleteWaypoint/{index}/{iD}")
    public void deleteWaypoint(@PathVariable("index") int index, @PathVariable("iD") long iD) {
        CarRequest carRequest = carRequestService.findByRId(iD);
        carRequest.getWaypoints().remove(index);
        carRequestService.save(carRequest);
    }
}

