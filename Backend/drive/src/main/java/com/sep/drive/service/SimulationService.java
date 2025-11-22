package com.sep.drive.service;

import com.sep.drive.CarRequest.CarRequest;
import com.sep.drive.CarRequest.CarRequestService;
import com.sep.drive.CarRequest.Coordinate;
import com.sep.drive.CompletedRequest.CompletedRequest;
import com.sep.drive.CompletedRequest.CompletedRequestService;
import com.sep.drive.RideOffer.RideOfferService;
import com.sep.drive.dto.CompleteRideRequest;
import com.sep.drive.dto.FinalInformation;
import com.sep.drive.dto.Rating;
import com.sep.drive.userprofile.User;
import com.sep.drive.userprofile.UserProfileService;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class SimulationService {

    SimpMessagingTemplate messagingTemplate;
    RatingService ratingService;
    UserProfileService userProfileService;
    CarRequestService carRequestService;
    RideService rideService;
    CompletedRequestService completedRequestService;
    RideOfferService rideOfferService;


    private int routeLength = 0;
    private int simulationSpeed = 30;
    private int index = 0;
    private boolean paused = false;
    private Thread currentSimulationThread;
    private long lastUpdateTime = 0;
    private double progress = 0.0;
    private int lastSentIndex = -1;
    private int requestID = -1;
    private CompleteRideRequest paymentMessage;
    private double price;
    private double duration;
    private double distance;



    public SimulationService(SimpMessagingTemplate messagingTemplate,
                             RatingService ratingService,
                             UserProfileService userProfileService,
                             CarRequestService carRequestService,
                             RideService rideService,
                             CompletedRequestService completedRequestService,
                             RideOfferService rideOfferService) {

        this.ratingService = ratingService;
        this.messagingTemplate = messagingTemplate;
        this.userProfileService = userProfileService;
        this.carRequestService = carRequestService;
        this.rideService = rideService;
        this.completedRequestService = completedRequestService;
        this.rideOfferService = rideOfferService;

    }

    public void setRouteLength(int routeLength) {
        this.routeLength = routeLength;
        System.out.println("Routenlänge gesetzt: " + routeLength);
    }

    public void simulationMove() {
        if (currentSimulationThread != null && currentSimulationThread.isAlive()) {
            return;
        }

        index = Math.min((int) (progress * routeLength), routeLength - 1);
        lastUpdateTime = System.nanoTime();
        lastSentIndex = -1;

        currentSimulationThread = new Thread(() -> {

            while (index < routeLength) {

                if (paused) {
                    try {
                        Thread.sleep(100);
                        continue;
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                        break;
                    }
                }

                long now = System.nanoTime();
                long elapsedTime = now - lastUpdateTime;
                lastUpdateTime = now;

                progress += (double) elapsedTime / (simulationSpeed * 1_000_000_000L);
                double totalProgress = Math.min(progress, 1.0);

                int calculatedIndex = Math.min((int) (totalProgress * routeLength), routeLength - 1);

                if(calculatedIndex == routeLength-1){
                    index = calculatedIndex;
                    messagingTemplate.convertAndSend("/topic/position/" + requestID, index);
                    messagingTemplate.convertAndSend("/topic/status/" + requestID, "finished");

                    simulationSpeed = 30;
                    try {
                        Thread.sleep(2000);
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                    }

                    endSimulation();

                    return;
                }

                if (calculatedIndex != lastSentIndex) {
                    lastSentIndex = calculatedIndex;
                    index = calculatedIndex;
                    messagingTemplate.convertAndSend("/topic/position/" + requestID, index);
                }

                try {
                    Thread.sleep(10);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    break;
                }
            }


        });


        currentSimulationThread.start();
    }


    public void setPaused(boolean paused) {
        this.paused = paused;

        if (!paused) {
            this.lastUpdateTime = System.nanoTime();
            messagingTemplate.convertAndSend("/topic/status/" + requestID, "continued");
        } else {
            messagingTemplate.convertAndSend("/topic/status/" + requestID, "paused");
        }
    }

    public void setSimulationSpeed(int simulationSpeed) {
        this.simulationSpeed = simulationSpeed;
        this.messagingTemplate.convertAndSend("/topic/simSpeed/" + requestID, this.simulationSpeed);
    }


    public void refreshSimulation() {
        System.out.println("Simulation wird mit neuer Route fortgesetzt.");
        this.simulationMove();
    }


    public void rateUser(Rating rating){
        if(rating.getRole().equals("CUSTOMER")){
            this.ratingService.addNewRating(this.userProfileService.findById(rating.getDriverId()), rating.getRating());
        }
        else{
            this.ratingService.addNewRating(this.userProfileService.findById(rating.getCustomerId()), rating.getRating());
        }
    }


    public void setRequestID(int rid){
        if(this.requestID != rid && requestID != -1){
            this.messagingTemplate.convertAndSend("/topic/status/" + rid, "otherSimStarted");
            System.out.println("RequestID agelehnt: " + rid);
            return;
        }
        if(this.requestID == -1){
            this.requestID = rid;
        }
        System.out.println("RequestID angenommen: " + rid);
        this.messagingTemplate.convertAndSend("/topic/status/" + rid, "ok");
    }

    public void endSimulation(){
        long start = System.currentTimeMillis();
        long timeout = 10000;
        while(paymentMessage == null && System.currentTimeMillis() - start < timeout) {
            try{
                Thread.sleep(50);
            }
            catch(InterruptedException e){
                Thread.currentThread().interrupt();
            }
        }

        if(paymentMessage == null){
            return;
        }
        messagingTemplate.convertAndSend("/topic/status/" + requestID, "rating");
        System.out.println("Rating was sent");
        CarRequest request = carRequestService.findByRId(requestID);
        System.out.println("End Simulation wird ausgeführt mit RequestID: " + requestID);

        //Bezahlung
        User customer = userProfileService.findByUsername(paymentMessage.getCustomerUsername());
        User driver = userProfileService.findByUsername(paymentMessage.getDriverUsername());

        rideService.completeRide(customer, driver, paymentMessage.getDistanceKm(), paymentMessage.getDurationMin());

        //In Completerequest verschieben
        CompletedRequest completedRequest = new CompletedRequest();
        completedRequest.setRequestId(request.getID());
        completedRequest.setCustomerId(request.getCustomerID());
        completedRequest.setDriverId(request.getDriverID());
        completedRequest.setCustomerName(request.getCustomerName());
        completedRequest.setRating(request.getRating());
        completedRequest.setRatingFromCustomer(request.getRatingFromCustomer());
        completedRequest.setRatingFromDriver(request.getRatingFromDriver());
        completedRequest.setVehicleClass(request.getVehicleClass());
        completedRequest.setTime(request.getTime());
        completedRequest.setDistance(distance);
        completedRequest.setDuration(duration);
        completedRequest.setWaypoints(request.getWaypoints());
        completedRequest.setPrice(price);

        completedRequestService.save(completedRequest);

        //Fahranfrage löschen
        rideOfferService.deleteRest(carRequestService.findByRId(requestID).getID());
        carRequestService.delete(carRequestService.findByRId(requestID));

        index = 0;
        progress = 0.0;
        requestID = -1;
    }

    public void setPaymentMessage(CompleteRideRequest paymentMessage) {
        this.paymentMessage = paymentMessage;
    }


    public void setPrice(double price) {
        this.price = price;
    }

    public void sendWaypoints(List<Coordinate> waypoints) {
        for (int i = 0; i < waypoints.size(); i++) {
            //System.out.println(waypoints.get(i).getIsVirtual());
        }
        this.messagingTemplate.convertAndSend("/topic/waypoints/" + requestID, waypoints);
    }

    public void setProgress(double progress) {
        this.progress = progress;
        System.out.println("Neuen progress gesetzt: " + progress);
    }

    public void setFinalInformation(FinalInformation finalInformation) {
        this.price = finalInformation.getPrice();
        this.duration = finalInformation.getDuration();
        this.distance = finalInformation.getDistance();
    }

    public boolean isOtherSimulationRunning(int requestId) {
        if(this.requestID != requestId && requestID != -1){
            return true;
        }
        return false;
    }
}

