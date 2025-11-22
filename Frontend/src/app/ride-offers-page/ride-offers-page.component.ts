import { Component, OnInit, ViewChild } from '@angular/core';
import { RideOfferService } from '@app/service/ride-offer.service';
import { RideRequestService } from '@app/service/ride-request.service';
import { UserService } from '@app/service/user.service';
import { RideOffer } from '@app/models/ride-offer.model';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '@app/navbar/navbar.component';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-ride-offers-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    NavbarComponent,
    RouterLink
  ],
  templateUrl: './ride-offers-page.component.html',
  styleUrls: ['./ride-offers-page.component.css']
})
export class RideOffersPageComponent implements OnInit {
  offers: RideOffer[] = [];
  sortedOffers: RideOffer[] = [];
  rideRequestId!: number;

  spalten: string[] = ['driverId', 'driverRating', 'driverTotalRides', 'distance', 'actions', 'chat'];

  private previousOfferIds = new Set<number>();


  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private offerService: RideOfferService,
    private rideRequestService: RideRequestService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const customerId = this.userService.getUserIdByToken();
    this.rideRequestService.getRideRequestByCID(customerId).subscribe(request => {
      if (request && request.id) {
        this.rideRequestId = request.id;
        this.loadOffers();
        setInterval(() => this.checkForNewOffers(), 10000);
      } else {
        console.warn("Keine aktive Fahranfrage gefunden.");
        this.offers = [];
        this.sortedOffers = [];
      }
    });
  }

  loadOffers(): void {
    this.offerService.getOffersByRideRequestId(this.rideRequestId).subscribe(data => {
      this.offers = data;
      this.sortedOffers = [...data];
      this.previousOfferIds = new Set(
        data
          .map(o => o.offerId)
          .filter((id): id is number => typeof id === 'number')
      );
    });
  }



  checkForNewOffers(): void {
    this.offerService.getOffersByRideRequestId(this.rideRequestId).subscribe(data => {
      const currentIds = new Set<number>();
      const newIds: number[] = [];

      for (const offer of data) {
        const id = offer.offerId;
        if (typeof id === 'number') {
          currentIds.add(id);
          if (!this.previousOfferIds.has(id)) {
            newIds.push(id);
          }
        }
      }
      if (newIds.length > 0) {
        alert(`Du hast ${newIds.length} neue Fahrtangebot(e) erhalten!`);
      }
      this.previousOfferIds = currentIds;
      this.offers = data;
      this.sortedOffers = [...data];
    });
  }


  sortRequests(sort: Sort): void {
    const data = [...this.offers];
    if (!sort.active || sort.direction === '') {
      this.sortedOffers = data;
      return;
    }

    this.sortedOffers = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'driverRating':
          return compare(a.driverRating, b.driverRating, isAsc);
        case 'driverTotalRides':
          return compare(a.driverTotalRides, b.driverTotalRides, isAsc);
        case 'distance':
          return compare(a.distance, b.distance, isAsc);
        default:
          return 0;
      }
    });
  }

  accept(offer: RideOffer): void {
    this.offerService.acceptOffer(offer).subscribe(() => {
      offer.accepted = true;
      this.offerService.addDriverId(offer.driverId, offer.requestId).subscribe(() => {
      })
      this.loadOffers();
      this.sortedOffers = [...this.offers];
    });

  }

  reject(offer: RideOffer): void {
    this.offerService.rejectOffer(offer).subscribe(() => this.loadOffers());
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
