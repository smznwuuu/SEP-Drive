export interface RideRequestOverview {
  request_Id: number;
  time: string;
  distance: number;
  customer_Name: string;
  rating: number;
  vehicle_Class: "klein" | "medium" | "deluxe";
  gesamtDistanzKm: number;
  gesamtDauerMin: number;
  preisEur: number;
  startLatitude: number;
  startLongitude: number;
  distanceToDriverStart?: number;
  hasOfferedForThisRequest: boolean,
  customerId: string; //fehlt noch in der backend antwort
}
