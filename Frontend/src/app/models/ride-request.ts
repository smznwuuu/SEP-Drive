import {Waypoint} from '@app/models/waypoint';

export type VehicleClass = 'klein' | 'mittel' | 'deluxe';

export interface RideRequest {
  customerID: number;
  driverID?: number;
  vehicleClass: VehicleClass;
  active: boolean;
  waypoints: Waypoint[];
  id?: number;
  distance?: number;
  duration?: number;
  price?: number;
  customerName?: string;
  rating?: number,
  ratingFromCustomer?: number,
  ratingFromDriver?: number,
  time?: string
}
