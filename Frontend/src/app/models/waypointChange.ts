import {Waypoint} from '@app/models/waypoint';

export interface WaypointChange{
  waypoints: Waypoint[],
  index: number
}
