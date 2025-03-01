import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Place } from '../models/place';
import { SearchRequest } from '../models/search.request';

@Injectable({ providedIn: 'root' })
export class PlacesService {
  private baseUrl = 'http://localhost:3000/places'; // Adjust as per your API
  placesList: Subject<Place[]> = new BehaviorSubject<Place[]>([]);

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
}
