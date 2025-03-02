import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavouritesListComponent } from './favourites-list.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';

describe('FavouritesListComponent', () => {
  let component: FavouritesListComponent;
  let fixture: ComponentFixture<FavouritesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatCardModule],
      declarations: [FavouritesListComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(FavouritesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
