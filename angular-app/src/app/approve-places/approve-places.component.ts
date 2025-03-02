import { Component } from '@angular/core';
import { Place } from '../models/place';

@Component({
  selector: 'app-approve-places',
  templateUrl: './approve-places.component.html',
  styleUrl: './approve-places.component.scss',
  standalone: false
})
export class ApprovePlacesComponent {
  places: Place[] = [];
}
