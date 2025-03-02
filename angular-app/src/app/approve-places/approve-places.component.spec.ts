import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovePlacesComponent } from './approve-places.component';

describe('ApprovePlacesComponent', () => {
  let component: ApprovePlacesComponent;
  let fixture: ComponentFixture<ApprovePlacesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovePlacesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovePlacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
