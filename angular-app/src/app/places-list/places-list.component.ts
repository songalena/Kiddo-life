import { Component, OnDestroy, signal } from '@angular/core';
import { PlacesService } from '../services/places-service';
import { Place } from '../models/place';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-places-list',
  templateUrl: './places-list.component.html',
  styleUrl: './places-list.component.scss',
  standalone: false
})
export class PlacesListComponent implements OnDestroy {
  places: Place[] = [];
  subscription: Subscription;

  constructor(private placesService: PlacesService) {
    this.subscription = this.placesService.placesList.subscribe(p => 
      {
        this.places = p;
      })
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
