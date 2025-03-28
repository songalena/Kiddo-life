import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Place } from '../models/place';
import { SearchRequest } from '../models/search.request';
import { PlacesAddRequest } from '../models/places-add.request';
import { SuccessResponse } from '../models/success-response';
import { StatusRequest } from '../models/status.request';

@Injectable({ providedIn: 'root' })
export class PlacesService {
  private baseUrl = 'http://localhost:3000/places'; // Adjust as per your API
  placesList: Subject<Place[]> = new BehaviorSubject<Place[]>([]);

  public ages = ['0+', '3+', '6+', '12+'];
  public areas = ['Almazar', 'Bektemir', 'Mirabad', 'Mirzoulugbek', 'Sergeli', 'Chilanzar', 'Shaxantaur', 'Yunusobad', 'Yakkasaray', 'Yashnabad', 'Uchtepa'];
  public prices = ['$', '$$', '$$$', '$$$$'];
  public categories = ['Restaurant with playground', 'Indoor playground', 'Park', 'Master-class', 'Performance'];


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

  getDrafts() {
    return this.http.get<Place[]>(`${this.baseUrl}/get-drafts`);
  }

  approve(request: StatusRequest) {
    return this.http.post<SuccessResponse>(`${this.baseUrl}/approve`, request);
  }

  reject(request: StatusRequest) {
    return this.http.post<SuccessResponse>(`${this.baseUrl}/reject`, request);
  }

  getFavouritePlaces() {
    return this.http.get<Place[]>(`${this.baseUrl}/get-favourite-places`);
  }

  addToFavourite(request: StatusRequest) {
    return this.http.post<SuccessResponse>(`${this.baseUrl}/add-favourite`, request);
  }

  removeFromFavourite(request: StatusRequest) {
    return this.http.post<SuccessResponse>(`${this.baseUrl}/remove-favourite`, request);
  }
}
