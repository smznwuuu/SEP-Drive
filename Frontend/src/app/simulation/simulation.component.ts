import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NavbarComponent} from '@app/navbar/navbar.component';
import {MapVisualizationComponent} from '@app/map-visualization/map-visualization.component';
import {UserService} from '@app/service/user.service';
import {RideRequest} from '@app/models/ride-request';
import {RideRequestService} from '@app/service/ride-request.service';
import {FormsModule} from '@angular/forms';
import {MapRouteService} from '@app/service/mapRoute.service';
import * as L from 'leaflet';
import {NgForOf, NgIf} from '@angular/common';
import {WebsocketService} from '@app/service/websocket.service';
import {MatDialog} from '@angular/material/dialog';
import {RatingPopupComponent} from '@app/rating-popup/rating-popup.component';
import {WalletService} from '@app/service/wallet.service';
import {PaymentMessage} from '@app/models/paymentMessage';
import {UserProfile} from '@app/models/user.model';
import {Subject, takeUntil} from 'rxjs';
import {Coordinate} from '@app/models/coordinate';
import {WaypointInputComponent} from '@app/waypoint-input/waypoint-input.component';
import {Waypoint} from '@app/models/waypoint';


@Component({
  selector: 'app-simulation',
  imports: [
    NavbarComponent,
    MapVisualizationComponent,
    FormsModule,
    NgIf,
    NgForOf,
    WaypointInputComponent,
  ],
  templateUrl: './simulation.component.html',
  styleUrl: './simulation.component.css'
})
export class SimulationComponent implements OnInit, OnDestroy{

  @ViewChild(MapVisualizationComponent)
  mapComponent! : MapVisualizationComponent;
  rideRequest? : RideRequest;
  userID : number = -1;
  currentUser!: UserProfile;
  username! : string;
  customerName?: string;
  driverName?: string;


  @Input()
  simulationSpeed : number = 30;

  routeCoordinates? : [number, number][];
  isPaused : boolean = false;
  index : number = 0;
  marker! : L.Marker;
  finished : boolean = false;
  started: boolean = false;
  otherUser?: UserProfile;
  price : number = -1;
  popupBeenOpen: boolean = false;
  ausgewaeltewegpunktArt: string = "";
  wegpunktArten : string[] = ["Adresse suchen", "Koordinaten eingeben"]
  private destroy = new Subject<void>();
  coordsAsNumber: number[][] = []
  newWaypoints: Waypoint[] = [];
  allWaypoints: Waypoint[] = [];
  pausedIndex: number = -1;
  waypointToRouteIndex: number[] = [];
  route: any;
  distance!: number;
  duration!: number;
  newDestination: Waypoint = { latitude: 0, longitude: 0 };
  routeVisible = false;
  otherSimStarted = false;
  simStatusAsked: boolean = false;


  markerIcon = L.icon({
    iconUrl: "assets/images/auto.png",
    iconSize: [32,32],
    iconAnchor: [16,16]
  })

  constructor(private userService: UserService,
              private rideRequestService: RideRequestService,
              private mapRouteService : MapRouteService,
              private websocketService : WebsocketService,
              private walletService : WalletService,
              private dialog : MatDialog) {
  }





  ngOnInit(): void {
    this.websocketService.connected.subscribe(() => {
      this.userID = this.userService.getUserIdByToken();
      console.log(this.userID)

      this.rideRequestService.getRideRequestByCID(this.userID).subscribe({
        next: (data: any) =>{
          this.websocketService.sendRId(data.id);
          this.websocketService.statusSubject.pipe(takeUntil(this.destroy)).subscribe((status: string) =>{
            if(status === "paused"){
              this.isPaused = true;
            }
            if(status === "continued"){
              this.isPaused = false;
            }
            if(status === "rating" && !this.popupBeenOpen){
              this.popupBeenOpen = true;
              this.openRatingPopup();
            }
            if(status === "ok"){
              if(!this.simStatusAsked){
                this.initializeSimulation();
                this.simStatusAsked = true;
              }
            }
            if(status === "otherSimStarted"){
              this.otherSimStarted = true;
            }
          })
        },
        error: () =>{
          this.rideRequestService.getRideRequestByDID(this.userID).subscribe({
            next: (data: any) => {
              this.websocketService.sendRId(data.id);
              this.websocketService.statusSubject.pipe(takeUntil(this.destroy)).subscribe((status: string) => {
                if (status === "paused") {
                  this.isPaused = true;
                }
                if (status === "continued") {
                  this.isPaused = false;
                }
                if (status === "rating" && !this.popupBeenOpen) {
                  this.popupBeenOpen = true;
                  this.openRatingPopup();
                }
                if(status === "ok"){
                  if(!this.simStatusAsked){
                    this.initializeSimulation();
                    this.simStatusAsked = true;
                  }
                }
                if (status === "otherSimStarted") {
                  this.otherSimStarted = true;
                }
              })
            }
          })
        }
      })
    })


  }


  initializeSimulation(){

    this.userService.getUserProfileByID(this.userID).subscribe((data : any) =>{
      this.currentUser = data;
      if(data.role == 'CUSTOMER'){
        this.customerName = data.username
        console.log("Angemeldeter Nutzer ist Kunde: " + this.customerName)
      }
      else{
        this.driverName = data.username;
        console.log("Angemeldeter Nutzer ist Fahrer: " + this.driverName)

      }
      this.getRideRequest();
    })

    this.websocketService.indexSubject.pipe(takeUntil(this.destroy)).subscribe(index =>{
      this.index = index;
      this.updateMarkerPosition();
    })



    this.websocketService.simSpeedSubject.pipe(takeUntil(this.destroy)).subscribe((simSpeed: number) =>{
      this.simulationSpeed = simSpeed;
      console.log("neuen Speed empfangen" + simSpeed)
    })

    this.websocketService.waypointSubject.pipe(takeUntil(this.destroy)).subscribe((waypoints: Waypoint[]) =>{

      this.allWaypoints = waypoints;
      if(this.currentUser.role == "DRIVER"){
        this.recalculateRouteAfterUpdate()
        console.log("neue waypoints empfangen" + JSON.stringify(waypoints))
      }
    })
  }

    ngOnDestroy() {
      this.destroy.next();
      this.destroy.complete();
    }


  getRouteCoordinates(){
      if(this.rideRequest != undefined){
        const coords = this.rideRequest.waypoints.map(p => [p.longitude, p.latitude]);
        this.mapRouteService.getRoute(coords).subscribe({
          next: (data: any)=> {
            this.route = data;
            this.duration = +(data.features[0].properties.summary.duration / 60).toFixed(2);
            this.distance = + (data.features[0].properties.summary.distance/1000).toFixed(2)
            let dataCoords = data.features[0].geometry.coordinates;
            this.routeCoordinates = dataCoords.map((c : number[]) =>  [c[1],c[0]]);
            console.log("Route empfangen")


            this.getWaypointsIndex()
            this.calculatePrice();


            this.websocketService.connected.subscribe(() => {
              this.websocketService.sendRouteLength(this.routeCoordinates!.length);
              this.websocketService.sendSimSpeed(this.simulationSpeed);
              console.log("Routenlänge gesendet: " + this.routeCoordinates!.length);
            })

          }
        });
      }
    }

  getRideRequest() {
    //Zuerst nach Fahranfrage mit CustomerID suchen
    this.rideRequestService.getRideRequestByCID(this.userID).subscribe({
      next: (data: any) => {
        this.rideRequest = data;
        this.allWaypoints = data.waypoints
        console.log("Alle Wegpunkte" + JSON.stringify(this.allWaypoints))
        this.getRouteCoordinates();
        this.userService.getUserProfileByID(data.driverID).subscribe((driverData : any) =>{
          this.driverName = driverData.username;
          this.otherUser = driverData;
          this.coordsAsNumber = this.rideRequest!.waypoints.map(p => [p.longitude, p.latitude]);
          console.log("Fahrername erhalten: " + this.driverName);
          this.calculatePrice();

        })
      },
      // Falls keine Fahranfrage mit customerID da ist, wird nach Fahranfrage mit driverID gesucht
      error: () => {
        this.rideRequestService.getRideRequestByDID(this.userID).subscribe({
          next: (data: any) => {
            this.rideRequest = data;
            this.allWaypoints = data.waypoints
            console.log("Alle Wegpunkte" + JSON.stringify(this.allWaypoints))
            this.getRouteCoordinates();
            this.userService.getUserProfileByID(data.customerID).subscribe((customerData : any) => {
              this.customerName = customerData.username;
              this.otherUser = customerData;
              this.coordsAsNumber = this.rideRequest!.waypoints.map(p => [p.longitude, p.latitude]);
              console.log("Kundennamen erhalten: " + this.customerName);
              this.calculatePrice();
            })
          }
        });
      }
    });
  }

    onStart() {

      let notEnoughBalance = false;
      this.calculatePrice();

      //Funktion deaktivieren, wenn Simulation schon gestartet ist
      if(this.finished || this.started){
        return;
      }

      //Wenn Route gar nicht gesetzt wurde
      if (!this.routeCoordinates || this.routeCoordinates.length === 0) {
        return;
      }

      //Hat Nutzer genug Geld?
      if(this.currentUser.role == "CUSTOMER"){
        if(this.currentUser!.balance! < this.price!){
          notEnoughBalance = true;
        }
      }
      else{
        if(this.otherUser!.balance! < this.price!){
          notEnoughBalance = true;
        }
      }

      if(notEnoughBalance){
        //Nachrichten für den Kunden
        if(this.currentUser.role == "CUSTOMER"){
          if(this.price !== this.rideRequest!.price) {
            alert("Ihr Guthaben reicht nicht aus. Bitte beachten Sie, dass sich der Preis aufgrund der Fahrzeugklasse geändert hat!");
            return;
          }
          else{
            alert("Ihr Guthaben reicht nicht aus, bitte laden sie es auf!");
            return;
          }
        }
        //Nachricht für Fahrer
        else{
          alert("Das Guthaben des Kunden reicht nicht aus! Bitte aktualisieren sie das Fenster, sobald der Kunde das nötige Guthaben aufgeladen hat, und versuchen Sie es erneut.")
          return;
        }
      }




      this.websocketService.sendRealPrice(this.price)
      this.started = true;
      this.websocketService.sendStatus("start");
    }


    onPause(){
      this.isPaused = true;
      this.pausedIndex = this.index
      this.websocketService.sendStatus("pause");
    }

    onContinue(){

      if(!this.routeVisible){
        alert("Bitte warten sie bis die Route neu berechnet wurde")
        return;
      }

      if(this.currentUser.role === "CUSTOMER"){
        if(this.currentUser.balance < this.price){
          alert("Ihr Guthaben reicht für die neue Route leider nicht mehr aus, bitte laden sie es auf oder ändern sie die Route")
          return;
        }
      }
      else{
        if (this.otherUser!.balance < this.price){
          alert("Das Guthaben des Kunden reicht nicht mehr aus, bitte warten sie bis der Kunde das Guthaben aufgeladen hat und die Fahrt fortsetzt")
          return;
        }
      }
      this.isPaused = false;
      this.websocketService.sendStatus("continue")
    }

  private updateMarkerPosition() {

    //Falls Route oder Karte noch nicht geladen ist, wird Methode abgebrochen
    if (!this.routeCoordinates || this.routeCoordinates.length === 0 || !this.mapComponent?.map) {
      return;
    }

    //Wenn noch kein Marker vorhanden ist, wird dieser hinzugefügt
    if(!this.marker){
      this.marker = L.marker(this.routeCoordinates![this.index], {icon: this.markerIcon}).addTo(this.mapComponent.map);
    }

    //Solange Ende noch nicht erreicht ist
    if(this.index < this.routeCoordinates!.length){
      this.marker.setLatLng(this.routeCoordinates![this.index])
    }

    //Ende der Simulation erreichtg
    if(this.index == this.routeCoordinates!.length - 1 && !this.finished){
      console.log("Ende der Fahrt erreicht")
      this.finished = true;




      let payment : PaymentMessage  = {
        customerUsername: this.customerName!,
        driverUsername: this.driverName!,
        distanceKm: this.distance,
        durationMin: this.duration
      }
      console.log("Payment Message: " + JSON.stringify(payment))
      this.websocketService.sendPaymentInformation(payment)

      this.websocketService.sendVariableInformation({
        price: this.price,
        distance: this.distance,
        duration: this.duration
      })



      //riderequest Variable wieder zurücksetzen, da Fahrt abgeschlossen ist

    }
  }

  openRatingPopup(){
    let popupRef = this.dialog.open(RatingPopupComponent, {
      width: "500px",
      data: {
        role: this.currentUser.role,
        rideRequest: this.rideRequest!
      }
    })


    popupRef.afterClosed().subscribe(() => {
      this.rideRequest = undefined;
    });
  }

  confirmNewWayPoints() {
    if (!this.routeCoordinates || !this.allWaypoints || this.newWaypoints.length === 0) return;

    for(let wp of this.newWaypoints){
      if(wp.latitude == 0 || wp.longitude == 0){
        alert("Bitte geben sie gültige Koordinaten an")
        return;
      }
    }


    const currentLocation: Waypoint = {
      latitude: this.routeCoordinates[this.index][0],
      longitude: this.routeCoordinates[this.index][1],
      isVirtual: true
    };

    //Index um Zwischenstopp zwischen nächsten Zwischenstopp und aktueller Position einzufügen
    let insertIndex = this.allWaypoints.length;
    for (let i = 0; i < this.waypointToRouteIndex.length; i++) {
      if (this.waypointToRouteIndex[i] > this.index) {
        insertIndex = i;
        break;
      }
    }

    //aktuelle Position und neue Wegpunkte einfügen
    const waypointsToInsert = [currentLocation, ...this.newWaypoints];
    this.allWaypoints.splice(insertIndex, 0, ...waypointsToInsert);

    this.rideRequestService.addWaypoint({
      waypoints: waypointsToInsert,
      index: insertIndex
    },
      this.rideRequest!.id!).subscribe();

    //Einfügearray zurücksetzen und dann Route neuberechnen
    this.newWaypoints = [];
    this.recalculateRouteAfterUpdate();
  }

  onSimSpeedChange() {
    this.websocketService.sendSimSpeed(this.simulationSpeed)
  }

  //wirklichen Preis berechnen

  calculatePrice(){
    console.log("Preisberechnung: " + this.currentUser.role +  " " +  this.otherUser!.role + " " + this.rideRequest!.distance )
    if(this.currentUser.role == "DRIVER"){
      switch (this.currentUser.carClass){
        case "SMALL":{
          this.price = this.distance;
          break;
        }
        case "MEDIUM": {
          this.price = 2.0 * this.distance;
          break;
        }
        case "DELUXE":{
          this.price = 10.0 * this.distance;
          break;
        }
      }
    }
    else{
      switch (this.otherUser!.carClass){
        case "SMALL":{
          this.price = this.distance;
          break;
        }
        case "MEDIUM": {
          this.price = 2.0 * this.distance;
          break;
        }
        case "DELUXE":{
          this.price = 10.0 * this.distance;
          break;
        }
      }
    }
    this.price = + this.price.toFixed(2);
  }


  addWaypoint() {
    this.newWaypoints.push({latitude: 0, longitude: 0})
    console.log(this.newWaypoints)
  }

  removeWaypoint(index: number) {
    this.newWaypoints.splice(index, 1);
    this.recalculateRouteAfterUpdate(); // direkt neue Route berechnen
  }

  recalculateRouteAfterUpdate() {
    if (!this.allWaypoints) {
      return;
    }

    this.routeVisible = false;

    const coords = this.allWaypoints.map(wp => {return [wp.longitude, wp.latitude]});
    this.mapRouteService.getRoute(coords).subscribe(data => {
      this.route = data;
      this.duration = +(data.features[0].properties.summary.duration / 60).toFixed(2);
      this.distance = + (data.features[0].properties.summary.distance/1000).toFixed(2)
      let dataCoords = data.features[0].geometry.coordinates;
      this.routeCoordinates = dataCoords.map((c: number[]) => [c[1], c[0]]);
      this.coordsAsNumber = this.allWaypoints.map(p => [p.longitude, p.latitude]);

      this.getWaypointsIndex()

      if(this.currentUser.role == "CUSTOMER"){

      this.websocketService.sendRouteLength(this.routeCoordinates!.length);
      this.websocketService.sendWaypoints(this.allWaypoints);

      const currentProgress = this.index / this.routeCoordinates!.length;
      this.websocketService.sendProgress(currentProgress);
      }
      this.calculatePrice();
    });
  }


  get zwischenstopps(): Waypoint[] {
    if (!this.allWaypoints || this.allWaypoints.length < 3) return [];
    const filtered =  this.allWaypoints.slice(1, this.allWaypoints.length - 1).filter(wp => wp.isVirtual !== true);
    return filtered
  }

  removeExistingStop(wp : Waypoint) {

    const index = this.allWaypoints.indexOf(wp)
    const routeIndexOfWaypoint = this.waypointToRouteIndex[index];
    if (routeIndexOfWaypoint <= this.index) {
      alert("Löschen nicht möglich, Wegpunkt wurde bereits passiert.");
      return;
    }

    let currentLocation : Waypoint = {
      latitude: this.routeCoordinates![this.index][0],
      longitude: this.routeCoordinates![this.index][1],
      isVirtual: true
    }



    this.rideRequestService.deleteWaypoint(index, this.rideRequest!.id!).subscribe(() => {
      this.rideRequestService.addWaypoint({
        waypoints: [currentLocation],
        index: index
      }, this.rideRequest!.id!).subscribe()
    });
    this.allWaypoints.splice(index,1)
    this.waypointToRouteIndex.splice(index, 1);



    this.allWaypoints.splice(index,0,currentLocation);


    this.recalculateRouteAfterUpdate();
    console.log("neuen Wegpunkte: " + JSON.stringify(this.allWaypoints))
    this.coordsAsNumber = this.allWaypoints.map(p => [p.longitude, p.latitude]);
  }

  getWaypointsIndex(){
    this.waypointToRouteIndex = this.allWaypoints.map(wp => {
      const latLng = L.latLng(wp.latitude, wp.longitude);
      let bestIndex = 0;
      let bestDist = Infinity;
      this.routeCoordinates!.forEach(([lat, lng], i) => {
        const dist = latLng.distanceTo(L.latLng(lat, lng));
        if (dist < bestDist) {
          bestDist = dist;
          bestIndex = i;
        }
      });
      if (this.started) {
        this.websocketService.sendStatus("refresh");
      }
      return bestIndex;
    });
  }

  confirmNewDestination() {
    if (
      !this.newDestination ||
      this.newDestination.longitude === 0 ||
      this.newDestination.latitude === 0||
      !this.routeCoordinates ||
      !this.rideRequest
    ) {
      return;
    }

    const currentLocation: Waypoint = {
      latitude: this.routeCoordinates[this.index][0],
      longitude: this.routeCoordinates[this.index][1],
      isVirtual: true
    };

    const newTarget: Waypoint = {
      latitude: this.newDestination.latitude,
      longitude: this.newDestination.longitude,
      isVirtual: false
    };

    const oldDestIndex = this.allWaypoints.length - 1;


    this.rideRequestService.deleteWaypoint(oldDestIndex, this.rideRequest.id!).subscribe(() => {

      const insertIndex = this.getNextWaypointInsertIndex();

      this.rideRequestService.addWaypoint({
        waypoints: [currentLocation],
        index: insertIndex
      }, this.rideRequest!.id!).subscribe(() => {

        this.rideRequestService.addWaypoint({
          waypoints: [newTarget],
          index: this.allWaypoints.length
        }, this.rideRequest!.id!).subscribe(() => {

          this.allWaypoints.splice(oldDestIndex, 1);
          this.allWaypoints.splice(insertIndex, 0, currentLocation);
          this.allWaypoints.push(newTarget);

          this.newDestination = { latitude: 0, longitude: 0 };
          this.recalculateRouteAfterUpdate();
        });
      });
    });
  }

  private getNextWaypointInsertIndex(): number {
    for (let i = 0; i < this.waypointToRouteIndex.length; i++) {
      if (this.waypointToRouteIndex[i] > this.index) {
        return i;
      }
    }
    return this.allWaypoints.length - 1;
  }


  onRouteLoaded(){
    this.routeVisible = true;
  }

}
