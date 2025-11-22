package com.sep.drive.controller;

import com.sep.drive.CarRequest.Coordinate;
import com.sep.drive.dto.CompleteRideRequest;
import com.sep.drive.dto.FinalInformation;
import com.sep.drive.dto.Rating;
import com.sep.drive.service.SimulationService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

import java.util.List;


@Controller
public class SimulationController {

    private final SimulationService simulationService;


    public SimulationController(SimulationService simulationService) {
        this.simulationService = simulationService;
    }

   @MessageMapping("simulation/route")
   public void updateRoute(@Payload int length) {
        this.simulationService.setRouteLength(length);
   }

    @MessageMapping("simulation/status")
    public void getStatus(@Payload String status){
        switch (status){
            case "start":{
                this.simulationService.simulationMove();
                break;
            }
            case "pause":{
                this.simulationService.setPaused(true);
                break;
            }
            case "continue":{
                this.simulationService.setPaused(false);
                break;
            }
            case "refresh":{
                this.simulationService.refreshSimulation();
                break;
            }
        }
    }

    @MessageMapping("simulation/speed")
    public void getSpeed(@Payload int speed){
        this.simulationService.setSimulationSpeed(speed);
        System.out.println("Speed: " + speed);
    }

    @MessageMapping("simulation/rating")
    public void addRating(@Payload Rating rating){
        System.out.println("Rating: " + rating);
        this.simulationService.rateUser(rating);
    }

    @MessageMapping("simulation/rid")
    public void setRid(@Payload int rid){
        System.out.println("Rid empfangen: " + rid);
        this.simulationService.setRequestID(rid);
    }

    @MessageMapping("simulation/payment")
    public void setPaymentMessage(@Payload CompleteRideRequest paymentmessage){
        this.simulationService.setPaymentMessage(paymentmessage);
    }

    @MessageMapping("simulation/price")
    public void setPrice(@Payload double price){
        this.simulationService.setPrice(price);
    }

    @MessageMapping("simulation/waypoints")
    public void getWaypoints(@Payload List<Coordinate> waypoints){
        System.out.println("Waypoints: " + waypoints.toString());
        this.simulationService.sendWaypoints(waypoints);
    }

    @MessageMapping("simulation/progress")
    public void setProgress(@Payload double progress){
        this.simulationService.setProgress(progress);
    }

    @MessageMapping("simulation/endInformation")
    public void setEndInformation(@Payload FinalInformation finalInformation){
        this.simulationService.setFinalInformation(finalInformation);
    }
}

