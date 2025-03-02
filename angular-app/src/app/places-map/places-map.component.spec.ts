import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacesMapComponent } from './places-map.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { GoogleMapsModule } from '@angular/google-maps';
import { Directive, Input } from '@angular/core';

@Directive({selector: 'map-marker', exportAs: 'mapMarker', standalone: false}) class StubMapMarkerDirective {}
@Directive({selector: 'google-map', exportAs: 'googleMap', standalone: false}) class StubGoogleMapDirective {
  @Input() center: google.maps.LatLngLiteral = { lat: 41.31574, lng: 69.24057 }; // Center of Tashkent
  @Input() zoom = 12;
}
@Directive({selector: 'map-info-window', exportAs: 'mapInfoWindow', standalone: false}) class StubMapInfoDirective {
}

describe('PlacesMapComponent', () => {
  let component: PlacesMapComponent;
  let fixture: ComponentFixture<PlacesMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlacesMapComponent, StubMapMarkerDirective, StubGoogleMapDirective, StubMapInfoDirective],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(PlacesMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
