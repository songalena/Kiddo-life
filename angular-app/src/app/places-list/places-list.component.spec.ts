import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacesListComponent } from './places-list.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlacesService } from '../services/places-service';
import { Place } from '../models/place';
import { of } from 'rxjs';
import { AuthService } from '../auth/auth.service';

describe('PlacesListComponent', () => {
  let component: PlacesListComponent;
  let fixture: ComponentFixture<PlacesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatCardModule,
        MatFormFieldModule,
        MatSelectModule,
        FormsModule,
        MatInputModule,
        BrowserAnimationsModule,
      ],
      declarations: [PlacesListComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(PlacesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should unsubscribe on destroy', () => {
    spyOn(component.subscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.subscription.unsubscribe).toHaveBeenCalled();
  });

  it('should call onLikeClicked and invoke PlacesService addToFavourite method', () => {
    const placesService = fixture.debugElement.injector.get(PlacesService);
    spyOn(placesService, 'addToFavourite').and.returnValue(of({ message: 'Added to favourites' }));
    const snackBar = fixture.debugElement.injector.get(MatSnackBar);
    spyOn(snackBar, 'open');
    const place = { id: 1, isInFavourite: false } as Place;
    component.onLikeClicked(place);
    expect(placesService.addToFavourite).toHaveBeenCalledWith({
      placeId: place.id,
    });
    expect(place.isInFavourite).toBeTrue();
    expect(snackBar.open).toHaveBeenCalledWith('Added to favourites', 'Ok');
  });

  it('should call onUnlikeClicked and invoke PlacesService removeFromFavourite method', () => {
    const placesService = fixture.debugElement.injector.get(PlacesService);
    spyOn(placesService, 'removeFromFavourite').and.returnValue(of({ message: 'Removed from favourites' }));
    const snackBar = fixture.debugElement.injector.get(MatSnackBar);
    spyOn(snackBar, 'open');
    const place = { id: 1, isInFavourite: true } as Place;
    component.onUnlikeClicked(place);
    expect(placesService.removeFromFavourite).toHaveBeenCalledWith({
      placeId: place.id,
    });
    expect(place.isInFavourite).toBeFalse();
    expect(snackBar.open).toHaveBeenCalledWith('Removed from favourites', 'Ok');
  });

  it('should check authentication status using AuthService', () => {
    const authService = fixture.debugElement.injector.get(AuthService);
    spyOn(authService, 'isAuthenticated').and.returnValue(true);
    expect(component.isAuthenticated()).toBeTrue();
    expect(authService.isAuthenticated).toHaveBeenCalled();
  });
});
