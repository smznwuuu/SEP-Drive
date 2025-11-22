import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpClient} from '@angular/common/http';
import { RideRequest} from '../models/ride-request';
import {CompletedRequest} from '@app/models/completedRequest';
import {Waypoint} from '@app/models/waypoint';
import {WaypointChange} from '@app/models/waypointChange';

@Injectable({
  providedIn: 'root'
})
export class RideRequestService {

  constructor(private http: HttpClient) {}

  searchAddress(query: string): Observable<any[]> {
    const url = `https://nominatim.openstreetmap.org/search?format=json&countrycodes=de&limit=5&q=${encodeURIComponent(query)}`;
    return this.http.get<any[]>(url);
  }

  searchPOIs(category: string, ort: string): Observable<any[]> {
    const query = `${category} ${ort}`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&countrycodes=de&limit=5&q=${encodeURIComponent(query)}`;
    return this.http.get<any[]>(url);
  }


  createRideRequest(request: RideRequest): Observable<RideRequest> { //Fahranfrage erstellen
    return this.http.post<RideRequest>("http://localhost:8080/requests", request);
  }

  getRideRequestByCID(CID : number) : Observable<any>{ //from Dennis Lüdiger
    return this.http.get<RideRequest>("http://localhost:8080/requests/findByCID/" + CID);
  }


  deleteRideRequestByCID(CID: number) : Observable<RideRequest>{
    console.log("Wird gelöscht mit dieser ID: " + CID)
    return this.http.delete<RideRequest>("http://localhost:8080/request/deleteByID/" + CID)
  }

  getRideRequestByDID(DID : number) : Observable<RideRequest>{
    return this.http.get<RideRequest>("http://localhost:8080/requests/findByDID/" + DID)
  }

  addCompletedRequest(riderequest : CompletedRequest){
    return this.http.post<CompletedRequest>("http://localhost:8080/completedRequests/add", riderequest);
  }

  addWaypoint(waypointChange : WaypointChange, requestID: number){
    console.log("Zwischenstopp wird gesendet: " + JSON.stringify(waypointChange))
    return this.http.post<Waypoint>("http://localhost:8080/requests/addWaypoint/" + requestID, waypointChange)
  }

  deleteWaypoint(index: number, requestID: number){
    console.log("Zwischenstopp wird gelöscht: " + index + " " + requestID)
    return this.http.delete("http://localhost:8080/requests/deleteWaypoint/" + index + "/" + requestID)
  }
}

