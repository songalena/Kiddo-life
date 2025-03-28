import { Component } from '@angular/core';
import { debounce, debounceTime, Subject, Subscription } from 'rxjs';
import { PlacesService } from '../services/places-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: false,
})
export class HomeComponent {
  searchSubject: Subject<string> = new Subject();
  subscription: Subscription;

  ages: string[] = [];
  areas: string[] = [];
  prices: string[] = [];
  categories: string[] = [];

  age = [];
  search = '';
  area = [];
  price = [];
  category = [];

  constructor(private placesService: PlacesService) {
    this.ages = placesService.ages;
    this.areas = placesService.areas;
    this.prices = placesService.prices;
    this.categories = placesService.categories;

    this.subscription = this.searchSubject
      .pipe(debounceTime(300))
      .subscribe((r) => {
        // this.search = r;
        this.onSearch();
      });
    this.onSearch();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSearchInputChange(val: EventTarget | null) {
    const target = val as HTMLTextAreaElement;
    if (target == null) {
      return;
    }

    this.searchSubject.next(target.value ?? '');
  }

  onSearch() {
    this.placesService.filterPlaces({
      search: this.search,
      age: this.age,
      area: this.area,
      price: this.price,
      category: this.category,
    });
  }

  onClearSelection() {
    this.age = [];
    this.search = '';
    this.area = [];
    this.price = [];
    this.category = [];
    this.onSearch();
  }
}
