import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import * as L from 'leaflet'
import {MapRouteService} from '../service/mapRoute.service';
import {LatLngTuple} from 'leaflet';
import {BeispielRoute} from '@app/data/beispiel-route';
import {Waypoint} from '@app/models/waypoint';


@Component({
  selector: 'app-map-visualization',
  imports: [],
  templateUrl: './map-visualization.component.html',
  styleUrl: './map-visualization.component.css'
})
export class MapVisualizationComponent implements OnChanges, OnInit{



  @Input() coords!: Waypoint[];

  map : any
  route : any
  @Output() routeLoaded = new EventEmitter<void>();

  private lastCoords: string = ' ';

  private markers: L.Marker[] = [];


  // Variable für den Individuellen Marker
  markerIcon = L.icon({
    iconUrl: "assets/map-marker.webp",
    iconSize: [32,32],
    iconAnchor: [16,32]
  })

  constructor(private routeService : MapRouteService) {
  }

  ngOnInit() {
    this.buildMap();
    const current = JSON.stringify(this.coords);

    if (this.map && this.coords && this.coords.length >= 2 && current !== this.lastCoords) {
      this.lastCoords = current;
      this.updateRoute();
    }
  }

  ngOnChanges(): void {
    const current = JSON.stringify(this.coords);

    if (this.map && this.coords && this.coords.length >= 2 && current !== this.lastCoords) {
      this.lastCoords = current;
      this.updateRoute();
    }
  }



  // erstellt die Karte
  private buildMap(): void {
    this.map = L.map('map')

    if (this.coords && this.coords.length > 0) {
      const {latitude, longitude} = this.coords[0];
      this.map.setView([latitude, longitude], 13);
    } else {
      this.map.setView([51.453143, 7.015834], 13);
    }


    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);
  }

  // zeichnet die Marker ein
  private addMarkers(): void {
    this.coords.filter(waypoint => !waypoint.isVirtual).forEach((waypoint, i) => {
      const label = i === 0 ? 'Start' : i === this.coords.length - 1 ? 'Ziel' : `Stop ${i}`;
      const marker = L.marker([waypoint.latitude,waypoint.longitude], { icon: this.markerIcon })
        .bindPopup(label)
        .addTo(this.map);
      this.markers.push(marker);
    });
  }


  // zeichnet die Route ein
  /*private drawRoute(){
    if(this.startCoords != undefined && this.destCoords != undefined){
    let coords = [this.startCoords.slice().reverse(), this.destCoords.slice().reverse()]
    this.routeService.getRoute(coords).subscribe({
      next: (data : any) => {

      this.route = L.geoJson(data).addTo(this.map)
      this.addMarker();
    },
     error: (error) => {
        console.error('Route konnte nicht übergeben werden, Beispielroute wird verwendet', error);
        L.geoJson(BeispielRoute).addTo(this.map);
        this.map.setView([51.465350,7.006478]);
      }
    });
  }
  }
  */

  private updateRoute(): void {
    // Alte Route und Marker entfernen
    if (this.route) {
      this.map.removeLayer(this.route);
    }
    this.markers.forEach(m => this.map.removeLayer(m));
    this.markers = [];

    const rawCoords = this.coords.map(w => [w.longitude, w.latitude]);
    this.routeService.getRoute(rawCoords).subscribe({
      next: (data: any) => {
        this.route = L.geoJson(data).addTo(this.map);
        this.addMarkers();
        this.map.fitBounds(this.route.getBounds(), { padding: [20, 20] });

        this.routeLoaded.emit();
      },
      error: (err) => {
        console.error("Routenanzeige fehlgeschlagen, Beispielroute wird verwendet:", err);
        this.route = L.geoJson(BeispielRoute).addTo(this.map);
        this.map.setView([51.465350, 7.006478], 13);
      }
    });
  }


}

// Bildequelle des Markers: "https://www.iconfinder.com/icons/285659/marker_map_icon"
// Für diese Komponente wird Code der JavaScript-Bibliothek "Leaflet" verwendet
