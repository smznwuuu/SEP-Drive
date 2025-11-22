import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Waypoint } from '@app/models/waypoint';
import { RideRequestService } from '@app/service/ride-request.service';

@Component({
  selector: 'app-waypoint-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './waypoint-input.component.html',
  styleUrls: ['./waypoint-input.component.css']
})
export class WaypointInputComponent {
  @Input() label: string = 'Wegpunkt';
  @Input() allowCurrentLocation: boolean = false;
  @Input() coordinate: Waypoint = { latitude: 0, longitude: 0 };
  @Output() coordinateChange = new EventEmitter<Waypoint>();

  option: string = 'coords';

  searchQuery = '';
  poiCategory = 'restaurant';
  poiOrt = 'Essen';
  suggestions: any[] = [];

  constructor(private rideRequestService: RideRequestService) {}

  useCurrentLocation(): void {
    if (!this.allowCurrentLocation) return;

    navigator.geolocation.getCurrentPosition(
      pos => {
        this.coordinate = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
        this.coordinateChange.emit(this.coordinate);
      },
      () => alert('Standort konnte nicht bestimmt werden.')
    );
  }

  searchAddress(): void {
    if (this.searchQuery.length < 3) return;
    this.rideRequestService.searchAddress(this.searchQuery).subscribe(results => {
      this.suggestions = results;
    });
  }

  searchPOIs(): void {
    if (this.poiOrt.length < 3) return;
    this.rideRequestService.searchPOIs(this.poiCategory, this.poiOrt).subscribe(results => {
      this.suggestions = results;
    });
  }

  selectSuggestion(s: any): void {
    this.coordinate = { latitude: parseFloat(s.lat), longitude: parseFloat(s.lon) };
    this.coordinateChange.emit(this.coordinate);
    this.suggestions = [];
  }
}
