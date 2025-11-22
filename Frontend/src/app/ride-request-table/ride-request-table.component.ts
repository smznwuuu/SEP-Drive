import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {NavbarComponent} from '@app/navbar/navbar.component';
import { MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import {DriverRideRequestService} from '@app/service/driver-ride-request.service';
import {RideRequestDataSource} from '@app/service/ride-request.dataSource';
import {MatButton} from '@angular/material/button';
import {RideRequestService} from '@app/service/ride-request.service';
import {FormsModule} from '@angular/forms';
import {MapRouteService} from '@app/service/mapRoute.service';
import {catchError, finalize, forkJoin, Observable, of, switchMap, take} from 'rxjs';
import {UserService} from '@app/service/user.service';
import {RideRequestOverview} from '@app/models/ride-request-overview.model';
import {RideOffer} from '@app/models/ride-offer.model';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-ride-request-table',
  imports: [
    NavbarComponent,
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatCardModule,
    MatIconModule,
    MatButton,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './ride-request-table.component.html',
  styleUrl: './ride-request-table.component.css',
  providers: [ RideRequestDataSource]
})
export class RideRequestTableComponent implements OnInit{

  spalten = [
    'request_Id',
    'time',
    'distanceToDriverStart',
    'customer_Name',
    'rating',
    'vehicle_Class',
    'distance',
    'duration',
    'price',
    'actions',
  ];

  driverRideRequestService = inject(DriverRideRequestService)
  dataSource = new RideRequestDataSource(this.driverRideRequestService)
  rideRequestService: RideRequestService = inject(RideRequestService)
  mapRouteService = inject(MapRouteService)
  userService: UserService = inject(UserService)

  private currentSort: Sort = {active: 'request_Id', direction:'asc'}

  isCalculatingDistances: boolean = false;
  isSubmittingOffer: boolean = false;
  isDriving$: Observable<boolean> = of(false);

  driverLat: number | null = null
  driverLng: number | null = null
  driverLocationSet = false

  currentActiveOfferRequestId: number | null = null;


  //übernommen von create-ride-request (Finn)
  driverStartOption = 'current';
  searchDriverStartQuery = '';
  driverStartSuggestions: any[] = [];
  poiCategoryDriver = 'restaurant';
  poiOrtDriver = 'Essen';
  driverPoiSuggestions: any[] = [];
  //bis hier

  driverId: number | null = null;
  driverRating: number | null = null;
  driverTotalRides: number | null = null;
  driverTotalDistance: number | null = null;
  driverUsername: string | null = null;

  ngOnInit() {
    this.driverId = this.userService.getUserIdByToken();
    this.driverUsername = this.userService.getUsernameByToken();
    this.isDriving$ = this.driverRideRequestService.getDriveStatus(this.driverId);

    this.initializeDriverAndRequests()

    this.dataSource.rideRequestsSubject.subscribe({
      next: (rideRequests) => {
        if(this.driverLocationSet){
          this.calculateDistancesToDriver();
        }

        rideRequests.forEach(request => {
          request.hasOfferedForThisRequest = (request.request_Id === this.currentActiveOfferRequestId);
        });
      }
    });
  }

  private initializeDriverAndRequests(): void {
    this.isDriving$ = this.driverRideRequestService.getDriveStatus(this.driverId!);
    forkJoin([
      this.userService.getUserProfile(this.driverUsername!).pipe(
        catchError(err => {
        console.log('Fehler beim Laden vom Fahrerprofil:', err);
        return of(null);
      })),
      this.driverRideRequestService.getCurrentActiveOffer(this.driverId!).pipe(
        catchError(err => {
        console.log('Fehler beim Abrufen vom aktiven Angebot:', err);
        return of({requestId: null});
      }))
    ]).subscribe({
      next: ([profile, activeOfferResponse]) => {
        if(profile){
          this.driverRating = profile.rating;
          this.driverTotalRides = profile.totalRides;
          this.driverTotalDistance = profile.totalDistance;
        }

        if(activeOfferResponse && activeOfferResponse.requestId !== undefined){
          this.currentActiveOfferRequestId = activeOfferResponse.requestId;
        }else{
          this.currentActiveOfferRequestId = null;
        }

        this.loadAvailableRequests();

      },
      error: (err) => {
        console.log(err);
        this.loadAvailableRequests();
      }
    });
  }

  private loadAvailableRequests(): void{
    this.dataSource.loadRideRequests(this.currentSort);
  }

  sortRequests(sort: Sort){

    //sortierung im frontend, falls nach entfernung zum start sortiert wird
    if (sort.active === 'distanceToDriverStart') {
      const sorted = [...this.dataSource.rideRequestsSubject.value].sort((a, b) => {
        const valA = Number.isFinite(a.distanceToDriverStart ?? NaN) ? a.distanceToDriverStart! : Infinity;
        const valB = Number.isFinite(b.distanceToDriverStart ?? NaN) ? b.distanceToDriverStart! : Infinity;



        return sort.direction === 'asc'
          ? valA - valB
          : valB - valA;
      });

      this.dataSource.rideRequestsSubject.next(sorted);
      //sonst normale Sortierung über Backend
    } else {
      this.currentSort = sort
      this.loadAvailableRequests();
    }
  }

  refreshTable() {
    this.initializeDriverAndRequests();
  }

  // Übernommene Methoden für die Standortauswahl des Fahrers (von finn aus create-ride-request)
  useDriverCurrentLocation(): void {
    if (navigator.geolocation) {
      this.isCalculatingDistances = true;
      navigator.geolocation.getCurrentPosition(
        position => {
          this.driverLat = position.coords.latitude;
          this.driverLng = position.coords.longitude;
          this.driverLocationSet = true;
          this.calculateDistancesToDriver();
          this.isCalculatingDistances = false;
        },
        error => {
          console.error('Geolocation-Fehler:', error);
          alert('Standort konnte nicht ermittelt werden.');
          this.isCalculatingDistances = false;
        }
      );
    } else {
      alert('Geolocation wird von deinem Browser nicht unterstützt.');
    }
  }
  searchDriverAddress(): void {
    if (this.searchDriverStartQuery.length < 3) return;
    this.rideRequestService.searchAddress(this.searchDriverStartQuery).subscribe(results => {
      this.driverStartSuggestions = results;
    });
  }

  selectDriverAddressSuggestion(s: any): void {
    this.driverLat = parseFloat(s.lat);
    this.driverLng = parseFloat(s.lon);
    this.searchDriverStartQuery = s.display_name;
    this.driverStartSuggestions = [];
    this.driverLocationSet = true;
    this.calculateDistancesToDriver();
  }

  searchDriverPOIs(): void {
    if (this.poiOrtDriver.length < 3) return;
    this.rideRequestService.searchPOIs(this.poiCategoryDriver, this.poiOrtDriver).subscribe(results => {
      this.driverPoiSuggestions = results;
    });
  }

  selectDriverPOI(poi: any): void {
    this.driverLat = parseFloat(poi.lat);
    this.driverLng = parseFloat(poi.lon);
    this.driverPoiSuggestions = [];
    this.driverLocationSet = true;
    this.calculateDistancesToDriver();
  }
  //Koordinatenprüfung
  isValidCoordinate(value: number | null): boolean {
    return value !== null && !isNaN(value);
  }
  //bis hier


  // Entfernungen zu allen Fahranfragen berechnen
  calculateDistancesToDriver(): void {
    if (!this.isValidCoordinate(this.driverLat) || !this.isValidCoordinate(this.driverLng)) {
      // Wenn Fahrerstandort nicht gesetzt ist, Distanzen auf undefined setzen
      this.dataSource.rideRequestsSubject.value.forEach(req => req.distanceToDriverStart = undefined);
      return;
    }

    this.isCalculatingDistances = true;
    const requests = this.dataSource.rideRequestsSubject.value; // Aktuelle Anfragen aus der DataSource

    const distanceObservables = requests.map(req => {
      // Prüfen, ob Startkoordinaten in der Anfrage vorhanden sind
      if (this.isValidCoordinate(req.startLatitude) && this.isValidCoordinate(req.startLongitude)) {
        const coords: [number, number][] = [
          [this.driverLng!, this.driverLat!], // Fahrer Long, Lat
          [req.startLongitude, req.startLatitude] // Anfrage Start Long, Lat
        ];
        return this.mapRouteService.getRoute(coords).pipe(
          switchMap(data => {
            req.distanceToDriverStart = +(data.features[0].properties.summary.distance / 1000).toFixed(2);
            return of(req); // Gibt das modifizierte Request-Objekt zurück
          }),
          catchError(err => {
            console.error(`Fehler bei Routenberechnung für Anfrage ${req.request_Id}:`, err);
            req.distanceToDriverStart = -1; // Fehlerwert
            return of(req);
          })
        );
      } else {
        // Wenn keine Startkoordinaten in der Anfrage, Standardwert setzen
        req.distanceToDriverStart = NaN;
        return of(req);
      }
    });

    // Führt alle Distanzberechnungen parallel aus
    forkJoin(distanceObservables).pipe(
      finalize(() => this.isCalculatingDistances = false)
    ).subscribe({
      next: (updatedRequests) => {

      },
      error: (err) => {
        console.error('Fehler beim Berechnen aller Distanzen:', err);
      }
    });
  }

  submitOffer(request: RideRequestOverview): void {
    if(this.currentActiveOfferRequestId !== null){
      alert('Du hast bereits ein aktives Angebot für eine andere Fahrt.')
      return;
    }
    this.isSubmittingOffer = true;
    const offer: RideOffer = {
      driverId: this.driverId!,
      requestId: request.request_Id,
      driverRating: this.driverRating!,
      driverTotalRides: this.driverTotalRides!,
      distance: this.driverTotalDistance!,
    };

    this.driverRideRequestService.submitOffer(offer).subscribe({
      next: () => {
        this.currentActiveOfferRequestId = request.request_Id
        this.dataSource.rideRequestsSubject.value.forEach(req =>{
          req.hasOfferedForThisRequest = (req.request_Id === this.currentActiveOfferRequestId)
        });
        this.dataSource.rideRequestsSubject.next([...this.dataSource.rideRequestsSubject.value])
        this.isSubmittingOffer = false;
      },
      error: (err) => {
        console.error('Fehler beim Abgeben des Angebots:', err);
        alert('Fehler beim Abgaben des Angebots. Bitte erneut versuchen.(Tipp: Lade die Seite neu! Vielleicht wurde die Anfrage schon wieder gelöscht')
        this.isSubmittingOffer = false;
      }
    })
  }

  cancelOffer(request: RideRequestOverview): void {
    if (this.currentActiveOfferRequestId !== request.request_Id) {
      alert('Du kannst nur das Angebot für diese Fahrt zurückziehen.');
      return;
    }
    if (this.driverId === null) {
      alert('Fahrer-ID ist noch nicht geladen. Bitte warten oder die Seite aktualisieren.');
      return;
    }

    this.isSubmittingOffer = true;
    this.driverRideRequestService.withdrawOffer(this.driverId).subscribe({
      next: () => {
        this.currentActiveOfferRequestId = null;
        this.dataSource.rideRequestsSubject.value.forEach(req => {
          req.hasOfferedForThisRequest = false;
        });
        this.dataSource.rideRequestsSubject.next([...this.dataSource.rideRequestsSubject.value]);
        this.isSubmittingOffer = false;
      },
      error: (err) => {
        console.error('Fehler beim Zurückziehen des Angebots:', err);
        alert('Fehler beim Zurückziehen des Angebots. Bitte versuche es erneut. (Tipp: Lade die Seite neu! Vielleicht wurde dein Angebot schon angenommen');
        this.isSubmittingOffer = false;
      }
    });
  }

}
