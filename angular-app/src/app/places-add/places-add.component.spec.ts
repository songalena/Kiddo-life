import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacesAddComponent } from './places-add.component';
import { provideHttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlacesService } from '../services/places-service';
import { of } from 'rxjs';

describe('PlacesAddComponent', () => {
  let component: PlacesAddComponent;
  let fixture: ComponentFixture<PlacesAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatCardModule,
        MatFormFieldModule,
        MatSelectModule,
        FormsModule,
        MatInputModule,
        BrowserAnimationsModule
      ],
      declarations: [PlacesAddComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(PlacesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should initialize dropdown values from service', () => {
    expect(component.ages).toEqual(['0+', '3+', '6+', '12+']);
    expect(component.areas).toEqual(['Almazar', 'Bektemir', 'Mirabad', 'Mirzoulugbek', 'Sergeli', 'Chilanzar', 'Shaxantaur', 'Yunusobad', 'Yakkasaray', 'Yashnabad', 'Uchtepa']);
    expect(component.prices).toEqual(['$', '$$', '$$$', '$$$$']);
    expect(component.categories).toEqual(['Restaurant with playground', 'Indoor playground', 'Park', 'Master-class', 'Performance']);
  });

  it('should call addPlace and show snackbar on form submission', () => {
    const placesService = fixture.debugElement.injector.get(PlacesService);
    spyOn(placesService, 'addPlace').and.returnValue(of({ message: 'Success' }));
    spyOn(component['snakBar'], 'open');

    component.onCreate();

    expect(placesService.addPlace).toHaveBeenCalledWith({
      age: '',
      area: '',
      price: '',
      category: '',
      name: '',
      description: '',
      imageUrl: '',
      latitude: -1,
      longitude: -1
    });
    expect(component['snakBar'].open).toHaveBeenCalledWith(
      'Thanks! Your suggestion will be reviewed and approved by the administrator.',
      'Ok'
    );
  });
});
