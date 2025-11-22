import { Injectable} from '@angular/core';
import {DataSource} from '@angular/cdk/collections';
import {RideRequestOverview} from '@app/models/ride-request-overview.model';
import {BehaviorSubject, Observable} from 'rxjs';
import {DriverRideRequestService} from '@app/service/driver-ride-request.service';
import {Sort} from "@angular/material/sort";

@Injectable()
export class RideRequestDataSource extends DataSource<RideRequestOverview>{
  rideRequestsSubject = new BehaviorSubject<RideRequestOverview[]>([]);
  isLoading$ = new BehaviorSubject<boolean>(false);


  constructor(private rideRequestService: DriverRideRequestService) {
    super();
  }

  connect(): Observable<RideRequestOverview[]> {
    return this.rideRequestsSubject.asObservable();
  }

  disconnect(): void {
    this.rideRequestsSubject.complete();
  }

  loadRideRequests(sort: Sort): void{
    this.isLoading$.next(true);
    this.rideRequestService.fetchRideRequests(sort).subscribe(requests => {
      this.rideRequestsSubject.next(requests);
      this.isLoading$.next(false);
    })
  }
}
