import { Component, OnDestroy, signal } from '@angular/core';
import { PlacesService } from '../services/places-service';
import { Place } from '../models/place';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-places-list',
  templateUrl: './places-list.component.html',
  styleUrl: './places-list.component.scss',
  standalone: false,
})
export class PlacesListComponent implements OnDestroy {
  places: Place[] = [];
  subscription: Subscription;

  constructor(private placesService: PlacesService, private matSnackbar: MatSnackBar,
    private auth: AuthService
  ) {
    this.subscription = this.placesService.placesList.subscribe((p) => {
      this.places = p;
    });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onUnlikeClicked(place: Place) {
    this.placesService.removeFromFavourite({placeId: place.id}).subscribe(res => {
      place.isInFavourite = false;
      this.matSnackbar.open(res.message, 'Ok')
    })
  }

  onLikeClicked(place: Place) {
    this.placesService.addToFavourite({placeId: place.id}).subscribe(res => {
      place.isInFavourite = true;
      this.matSnackbar.open(res.message, 'Ok')
    })
  }

  isAuthenticated() {
    return this.auth.isAuthenticated();
  }
}
