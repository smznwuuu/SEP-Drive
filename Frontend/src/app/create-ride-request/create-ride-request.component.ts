import { Component } from '@angular/core';
import { VehicleClass, RideRequest } from '@app/models/ride-request';
import { RideRequestService } from '@app/service/ride-request.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '@app/service/user.service';
import { NavbarComponent } from '@app/navbar/navbar.component';
import { MapRouteService } from '@app/service/mapRoute.service';
import { MapVisualizationComponent } from '@app/map-visualization/map-visualization.component';
import { Waypoint } from '@app/models/waypoint';
import { WaypointInputComponent } from '@app/waypoint-input/waypoint-input.component';

@Component({
  selector: 'app-create-ride-request',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    MapVisualizationComponent,
    WaypointInputComponent
  ],
  templateUrl: './create-ride-request.component.html',
  styleUrls: ['./create-ride-request.component.css']
})
export class CreateRideRequestComponent {
  //fahrzeug
  vehicleClasses: VehicleClass[] = ['klein', 'mittel', 'deluxe'];
  vehicleClass: VehicleClass = 'klein';
  isActive = true;

  //route
  distance = 0;
  duration = 0;
  price = 0;
  routePlanned = false;
  routeCoords: Waypoint[] = [];

  //wegunkte und start
  waypoints: Waypoint[] = [];

  constructor(
    private rideRequestService: RideRequestService,
    private router: Router,
    private UserService: UserService,
    private mapRouteService: MapRouteService
  ) {}

  //anfrage abschicken
  onSubmit(): void {
    // Validierung aller Koordinaten
    const invalid = this.waypoints.some(p => !this.isValidCoordinate(p.latitude) || !this.isValidCoordinate(p.longitude));
    if (invalid) {
      alert('Bitte gültige Koordinaten für alle Wegpunkte eingeben.');
      return;
    }
    if (!this.checkWaypoints()) {
      return;
    }


    const coordinatesForRoute = this.waypoints.map(p => [p.longitude, p.latitude]); // lng dann lat für open route
    console.log('Waypoints:', this.waypoints);

    this.mapRouteService.getRoute(coordinatesForRoute).subscribe({
      next: (data: any) => {
        const summary = data.features[0].properties.summary;
        this.distance = +(summary.distance / 1000).toFixed(2);
        this.duration = Math.round(summary.duration / 60);
        this.price = this.calculatePrice(this.distance);
        const customerID = this.UserService.getUserIdByToken();
        const username = this.UserService.getUsernameByToken();

        this.UserService.getUserProfile(username).subscribe({
          next: (profile) => {
            const fullName = profile.firstname + ' ' + profile.lastname;
            const rating = profile.rating;

            const coordinatesForRequest = this.waypoints.map(p => ({
              latitude: p.latitude,
              longitude: p.longitude
            }));
            const request: RideRequest = {
              vehicleClass: this.vehicleClass,
              customerID: customerID,
              active: this.isActive,
              distance: this.distance,
              duration: this.duration,
              price: this.price,
              customerName: fullName,
              rating: rating,
              waypoints: coordinatesForRequest
            };
            console.log(' Request wird gesendet:', request);


            this.rideRequestService.createRideRequest(request).subscribe({
              next: () => {
                this.router.navigate(['/active-ride-request']).catch(err => {
                  console.error('Navigation fehlgeschlagen:', err);
                });
              },
              error: () => {
                alert('Erstellen der Fahranfrage fehlgeschlagen.');
              }
            });
          },
          error: () => {
            alert("Benutzerprofil konnte nicht geladen werden.");
          }
        });
      },
      error: () => {
        alert("Fehler bei der automatischen Routenplanung.");
      }
    });
  }

  private checkWaypoints() {
    if(this.waypoints.length == 2) {
      if(this.waypoints[0].latitude == this.waypoints[1].latitude && this.waypoints[0].longitude == this.waypoints[1].longitude) {
        alert( 'Bitte Start und Zielkoordinaten unterschiedlich eingeben.')
        return false;
      }
    }
    if(this.waypoints.length > 2) {
      const start = this.waypoints[0];
      for(let i = 1; i < this.waypoints.length - 1; i++) {
        if(this.waypoints[i].latitude != start.latitude && this.waypoints[i].longitude != start.longitude) {
          return true;
        }
      }
      alert( 'Bitte Route sinnvoll eingeben.')
      return false;
    }
    return true;
  }


  //vorschau
  previewRoute(): void {
    const invalid = this.waypoints.some(p =>
      !this.isValidCoordinate(p.latitude) || !this.isValidCoordinate(p.longitude)
    );
    if (invalid) {
      alert("Bitte gültige Koordinaten für alle Wegpunkte eingeben.");
      return;
    }

    const coordinates = this.waypoints.map(p => [p.longitude, p.latitude]);
    console.log("Coordinates", coordinates);

    this.mapRouteService.getRoute(coordinates).subscribe({
      next: (data: any) => {
        const summary = data.features[0].properties.summary;
        this.distance = +(summary.distance / 1000).toFixed(2); // km
        this.duration = Math.round(summary.duration / 60);     // min
        this.price = this.calculatePrice(this.distance);       // €
        this.routeCoords = this.waypoints.map(p => ({
          latitude: p.latitude,
          longitude: p.longitude
        }));
        this.routePlanned = true;
      },
      error: () => {
        alert("Routenplanung fehlgeschlagen.");
      }
    });
  }






  calculatePrice(distance: number): number {
    const factor = this.vehicleClass === 'klein' ? 1 : this.vehicleClass === 'mittel' ? 2 : 10;
    return +(distance * factor).toFixed(2);
  }

  //koordinaten check
  private isValidCoordinate(value: number): boolean {
    return !isNaN(value) && value !== 0;
  }

 //neue zwischenstopps
  addWaypoint(): void {
    const index = this.waypoints.length - 1;
    this.waypoints.splice(index, 0, { latitude: 0, longitude: 0 });
  }

  //zwischenstopps entfernen
  removeWaypoint(index: number): void {
    if (index > 0 && index < this.waypoints.length - 1) {
      this.waypoints.splice(index, 1);
    }
  }

  ngOnInit(): void {
    this.waypoints = [
      { latitude: 0, longitude: 0 }, // Start
      { latitude: 0, longitude: 0 }  // Ziel
    ];
  }


}
