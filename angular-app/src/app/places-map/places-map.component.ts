import { Component, ViewChild, signal, effect, OnDestroy } from '@angular/core';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { Place } from '../models/place';
import { BranchMapMarker } from '../models/branch-map-marker';
import { PlacesService } from '../services/places-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-places-map',
  templateUrl: './places-map.component.html',
  styleUrl: './places-map.component.scss',
  standalone: false
})
export class PlacesMapComponent implements OnDestroy {
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow | undefined;

  branches = signal<Place[]>([]);
  center: google.maps.LatLngLiteral = { lat: 41.31574, lng: 69.24057 }; // Center of Tashkent
  zoom = 12;
  markers: BranchMapMarker[] = [];
  selectedBranch = signal<Place | null>(null);
  subscription: Subscription;

  constructor(private placesService: PlacesService) {
    effect(
      () => {
        // Assign markers to data
        this.markers = this.getMarkers();
      },
      { allowSignalWrites: true }
    );

    this.subscription = this.placesService.placesList.subscribe(p => {
      this.branches.set(p);
    });
  }

  getMarkers() {
    return this.branches()
      .map((branch) => {
        const marker: BranchMapMarker = {
          label: '',
          position: { lat: branch.latitude, lng: branch.longitude },
          title: branch.name,
          options: { animation: google.maps.Animation.DROP },
          branch: branch,
        };
        return marker;
      })
      .filter(
        (marker) => !isNaN(marker.position.lat) && !isNaN(marker.position.lng)
      );
  }

  openInfoWindow(place: Place, marker: MapMarker): void {
    this.selectedBranch.set(place);
    if (this.infoWindow) {
      this.infoWindow.open(marker);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
