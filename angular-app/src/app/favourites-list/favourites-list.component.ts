import { Component, OnInit } from '@angular/core';
import { Place } from '../models/place';
import { PlacesService } from '../services/places-service';

@Component({
  selector: 'app-favourites-list',
  templateUrl: './favourites-list.component.html',
  styleUrl: './favourites-list.component.scss',
  standalone: false
})
export class FavouritesListComponent implements OnInit {
  places: Place[] = [];

  constructor(private placesService: PlacesService) {
  }
  ngOnInit(): void {
    this.placesService.getFavouritePlaces().subscribe(res => {
      this.places = res;
    });
  }
  
}
