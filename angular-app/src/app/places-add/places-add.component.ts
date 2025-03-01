import { Component } from '@angular/core';
import { PlacesService } from '../services/places-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-places-add',
  templateUrl: './places-add.component.html',
  styleUrl: './places-add.component.scss',
  standalone: false
})
export class PlacesAddComponent {
  age = '';
  area = '';
  price = '';
  category = '';
  name = '';
  description = '';
  imageUrl = '';

  ages: string[] = [];
  areas: string[] = [];
  prices: string[] = [];
  categories: string[] = [];

  constructor(private placesService: PlacesService,
    private snakBar: MatSnackBar
  ) {
    this.ages = placesService.ages;
    this.areas = placesService.areas;
    this.prices = placesService.prices;
    this.categories = placesService.categories;
  }

  onCreate() {
    this.placesService.addPlace({
      age: this.age,
      area: this.area,
      price: this.price,
      category: this.category,
      name: this.name,
      description: this.description,
      imageUrl: this.imageUrl,
    }).subscribe(res => {
      this.snakBar.open('Thanks! Your suggesting will be reviewed and approved byt the administrator.', 'Ok')
    })
  }
}
