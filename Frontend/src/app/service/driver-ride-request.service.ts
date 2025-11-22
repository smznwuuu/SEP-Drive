import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import { RideRequestOverview} from '@app/models/ride-request-overview.model';
import {Sort} from '@angular/material/sort';
import {RideOffer} from '@app/models/ride-offer.model';

@Injectable({
  providedIn: 'root'
})
export class DriverRideRequestService {

  constructor(private http: HttpClient) { }

  fetchRideRequests(sort: Sort): Observable<RideRequestOverview[]>{
    const params = new HttpParams()
      .set('sortBy', sort.active)
      .set('order', sort.direction)
    return this.http.get<RideRequestOverview[]>('http://localhost:8080/requests/findAllAvailable',{
      params,
    })
  }

  submitOffer(offer: RideOffer): Observable<any> {
    return this.http.post('http://localhost:8080/rideoffer/save', offer);

  }

  withdrawOffer(driverId: number): Observable<any> {
    return this.http.delete('http://localhost:8080/rideoffer/withdraw', {
      body: driverId
    });
  }

  getCurrentActiveOffer(driverId: number): Observable<{ requestId: number | null }> {
    return this.http.get<number | null>(`http://localhost:8080/rideoffer/findrequestidbydriverid/${driverId}`).pipe(
      // Mappt rohe Antwort in erwartetes Objektformat
      map(rawRequestId => ({ requestId: rawRequestId }))
    );
  }

  getDriveStatus(driverId: number): Observable<boolean> {
    return this.http.get<boolean>(`http://localhost:8080/requests/driverExists/${driverId}`);
  }
}
