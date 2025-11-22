export interface RideOffer {
  offerId?: number;
  requestId: number;
  customerid?: number;
  driverId: number;
  driverRating: number;
  driverTotalRides: number;
  distance: number;
  accepted?: boolean;
}
