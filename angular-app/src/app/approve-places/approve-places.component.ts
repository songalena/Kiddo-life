import { Component, OnInit } from '@angular/core';
import { Place } from '../models/place';
import { PlacesService } from '../services/places-service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-approve-places',
  templateUrl: './approve-places.component.html',
  styleUrl: './approve-places.component.scss',
  standalone: false,
})
export class ApprovePlacesComponent implements OnInit {
  places: Place[] = [];

  constructor(
    private placesService: PlacesService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getPlaces();
  }

  getPlaces() {
    this.placesService.getDrafts().subscribe((res) => {
      this.places = res;
    });
  }

  onApprove(place: Place) {
    this.placesService.approve({ placeId: place.id }).subscribe((r) => {
      this.snackBar.open(r.message, 'Ok');
      this.getPlaces();
    });
  }

  onReject(place: Place) {
    this.placesService.reject({ placeId: place.id }).subscribe((r) => {
      this.snackBar.open(r.message, 'Ok');
      this.getPlaces();
    });
  }
}
