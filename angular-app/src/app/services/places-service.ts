import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Place } from '../models/place';
import { SearchRequest } from '../models/search.request';
import { PlacesAddRequest } from '../models/places-add.request';
import { SuccessResponse } from '../models/success-response';

@Injectable({ providedIn: 'root' })
export class PlacesService {
  private baseUrl = 'http://localhost:3000/places'; // Adjust as per your API
  placesList: Subject<Place[]> = new BehaviorSubject<Place[]>([]);

  public ages = ['0+', '3+', '6+', '12+'];
  public areas = ['Mirabod', 'Yonusobod'];
  public prices = ['$', '$$', '$$$', '$$$$'];
  public categories = ['Restaurant', 'Cafe'];


  constructor(private http: HttpClient) {

  }

  filterPlaces(search: SearchRequest
  ) {
    this.http.post<Place[]>(`${this.baseUrl}/search`, search)
    .pipe(
      tap(places => {
        this.placesList.next(places);
      })
    ).subscribe()
  }

  addPlace(request: PlacesAddRequest) {
    return this.http.post<SuccessResponse>(`${this.baseUrl}/add`, request);
  }
}
