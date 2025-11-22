import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapRouteService {

  private routeUrl = "https://api.openrouteservice.org/v2/directions/driving-car/geojson";
  private addressUrl = "https://api.openrouteservice.org/geocode/reverse"
  private apiKey = "5b3ce3597851110001cf6248e3b873c7a5ce41ba9ea7e9892ee0d3c6"

  constructor(private http : HttpClient) { }

  getRoute(coordinates : number[][]) : Observable<any>{
    console.log("Koordinaten an Api gesendet: " + coordinates)
    return this.http.post<any>(this.routeUrl, {
        coordinates
      },
      {
        headers: {
          'Authorization' : this.apiKey,
          'Content-Type' : "application/json"
        }
      })
  }

  getAddress(lat : number, lon : number) : Observable<any>{
    return this.http.get<any>(this.addressUrl, {
      headers:{
        'Authorization' : this.apiKey
      },
      params:{
        'point.lat': lat.toString(),
        'point.lon': lon.toString()

      }
    })
  }


}
