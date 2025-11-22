import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RideOffer } from '@app/models/ride-offer.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RideOfferService {
  private baseUrl = 'http://localhost:8080/rideoffer';

  constructor(private http: HttpClient) {
  }

  getOffersByRideRequestId(requestId: number): Observable<RideOffer[]> {
    return this.http.get<RideOffer[]>(this.baseUrl + '/findrequestid/' + requestId);
  }

  acceptOffer(offer: RideOffer): Observable<void> {
    return this.http.post<void>(this.baseUrl + '/accept', offer);
  }

  rejectOffer(offer: RideOffer): Observable<void> {
    return this.http.delete<void>(this.baseUrl + '/reject', {
      body: offer,
    });
  }

  addDriverId(driverId: number, requestId: number): Observable<any> {
    return this.http.post<any>(`http://localhost:8080/requests/addDriverID`, {driverId, requestId});
}
}
