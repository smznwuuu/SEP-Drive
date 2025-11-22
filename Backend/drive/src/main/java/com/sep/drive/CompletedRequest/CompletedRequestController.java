package com.sep.drive.CompletedRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CompletedRequestController {

    private final CompletedRequestService completedRequestService;

    public CompletedRequestController(CompletedRequestService completedCarRequestService) {
        this.completedRequestService = completedCarRequestService;
    }

    //gibt alle Requests aus
    @GetMapping("/completedRequests/getAll")
    public ResponseEntity<List<CompletedRequest>> getAllCompletedRequests() {
        return new ResponseEntity<>(completedRequestService.findAll(), HttpStatus.OK);
    }

    //fügt gegebene Request ein
    @PostMapping("/completedRequests/add")
    public void addCompletedRequest(@RequestBody CompletedRequest completedCarRequest) {
        completedRequestService.save(completedCarRequest);
    }

    //löscht gegebene Request
    @DeleteMapping("/completedRequests/delete")
    public void deleteCompletedRequest(@RequestBody CompletedRequest completedCarRequest) {
        completedRequestService.delete(completedCarRequest);
    }

    //sucht Request nach gegebener ID der Request
    @GetMapping("completedRequests/findByRID/{iD}")
    public ResponseEntity<CompletedRequest> findByRID(@PathVariable("iD") long iD) {
        return new ResponseEntity<>(completedRequestService.findByRId(iD), HttpStatus.OK);
    }

    //sucht Request nach gegebener ID des Fahrers
    @GetMapping("/completedRequests/findByDID/{iD}")
    public ResponseEntity<List<CompletedRequest>> findByDID(@PathVariable ("iD") long iD) {
        return new ResponseEntity<>(completedRequestService.findByDId(iD), HttpStatus.OK);
    }

    //sucht Request nach gegebener ID des Kunden
    @GetMapping("/completedRequests/findByCID/{iD}")
    public ResponseEntity<List<CompletedRequest>> findByCID(@PathVariable ("iD") long iD) {
        return new ResponseEntity<>(completedRequestService.findByCId(iD), HttpStatus.OK);
    }

    //sucht alle Requests und sortiert sie falls erwünscht
    @GetMapping("/completedRequests/findAllSort")
    public ResponseEntity<List<CompletedRequest>> findAllSort(@RequestParam(required = false)String sortBy, @RequestParam(required = false)String order) {
        return new ResponseEntity<>(completedRequestService.findAllSort(sortBy, order), HttpStatus.OK);
    }

    //fügt Bewertung des Kunden ein
    @PostMapping("/completedRequests/addRatingFromCustomer")
    public void addRatingFromCustomer (@RequestBody RatingDTO rating) {
        CompletedRequest request = completedRequestService.findByRId(rating.getRequestId());
        request.setRatingFromCustomer(rating.getRating());
        completedRequestService.save(request);
    }

    //fügt Bewertung des Fahrers ein
    @PostMapping("/completedRequests/addRatingFromDriver")
    public void addRatingFromDriver (@RequestBody RatingDTO rating) {
        CompletedRequest request = completedRequestService.findByRId(rating.getRequestId());
        request.setRatingFromDriver(rating.getRating());
        completedRequestService.save(request);
    }
}
