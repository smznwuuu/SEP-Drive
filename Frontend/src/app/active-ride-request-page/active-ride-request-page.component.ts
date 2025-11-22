import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import { OnInit } from '@angular/core';

import {RideRequest} from '../models/ride-request';
import {MapVisualizationComponent} from '../map-visualization/map-visualization.component';
import {RideRequestService} from '../service/ride-request.service';
import {MapRouteService} from '../service/mapRoute.service';
import {UserService} from '@app/service/user.service';
import {NavbarComponent} from '@app/navbar/navbar.component';
import {Waypoint} from '@app/models/waypoint';

@Component({
  selector: 'app-acitve-ride-request-page',
  imports: [CommonModule, MapVisualizationComponent, NavbarComponent],
  templateUrl: './active-ride-request-page.component.html',
  styleUrl: './active-ride-request-page.component.css'
})
export class ActiveRideRequestPageComponent implements OnInit{

  rideRequest? : RideRequest;
  startAddress : String = "";
  destAddress : String = "";
  userID : number;
  status! : string;
  coordsAsNumber : number [][] = [];
  zwischenStopps?: Waypoint[];


  constructor(private rideRequestService: RideRequestService, private mapRouteService : MapRouteService, private userService : UserService) {
    this.userID = this.userService.getUserIdByToken();
  }

  ngOnInit(){
    this.getRideRequest();
  }

  //Fahranfrage wird geholt
  getRideRequest(){
    this.rideRequestService.getRideRequestByCID(this.userID).subscribe((data : any) =>{
      console.log("Fahranfrage erhalten: " + JSON.stringify(data))
      this.rideRequest = data;
      this.transformCoords();
      this.getStartAdress();
      this.getDestAdress();
      this.zwischenStopps = this.rideRequest!.waypoints.slice(1,this.rideRequest!.waypoints.length-1)
      if(this.rideRequest?.active){
        this.status = "Aktiv";
      }
      else{
        this.status = "Inaktiv";
      }
    });
  }

  //naheliegende Startadresse bekommen
  getStartAdress(){
    if (this.rideRequest?.waypoints[0] != undefined)
      this.mapRouteService.getAddress(this.rideRequest.waypoints[0].latitude, this.rideRequest.waypoints[0].longitude).subscribe((data : any) => {
        this.startAddress = data?.features?.[0]?.properties?.label;
        console.log("start Adresse erhalten")
      })
  }

  //naheliegende Zieladresse bekommen
  getDestAdress(){

    if (this.rideRequest?.waypoints[this.rideRequest?.waypoints.length-1] != undefined) {
      let end = this.rideRequest.waypoints.length - 1;
      console.log("Ende des Arrays: " + this.rideRequest!.waypoints[end])
      this.mapRouteService.getAddress(this.rideRequest.waypoints[end].latitude, this.rideRequest.waypoints[end].longitude).subscribe((data: any) => {
        this.destAddress = data?.features?.[0]?.properties?.label;
      })
    }
  }
//Löschen Fahranfrage
  deleteRequest() {
    if (this.rideRequest?.id != null) {
      this.rideRequestService.deleteRideRequestByCID(this.rideRequest.id).subscribe({
        next: () => {
          console.log("Fahranfrage erfolgreich gelöscht");
          // Rücksetzen der Anzeige
          this.rideRequest = undefined;
          this.startAddress = "";
          this.destAddress = "";
        },
        error: (err) => {
          console.error("Fehler beim Löschen der Fahranfrage:", err);
        }
      });
    }
  }


  private transformCoords() {
    this.coordsAsNumber = this.rideRequest!.waypoints.map(p => [p.longitude, p.latitude]);
  }
}
