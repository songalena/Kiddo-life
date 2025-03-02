import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileComponent } from './profile.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from '../auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

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
      declarations: [ProfileComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize username with the value from AuthService', () => {
    const authService = fixture.debugElement.injector.get(AuthService);
    spyOn(authService, 'getUsername').and.returnValue('testuser');
    const newComponent = new ProfileComponent(authService, {} as MatSnackBar);
    expect(newComponent.username).toBe('testuser');
  });

  it('should call onLogOut and invoke AuthService logOut method', () => {
    const authService = fixture.debugElement.injector.get(AuthService);
    spyOn(authService, 'logOut');
    component.onLogOut();
    expect(authService.logOut).toHaveBeenCalled();
  });

  it('should call onUpdate and invoke AuthService updateProfile method', () => {
    const authService = fixture.debugElement.injector.get(AuthService);
    const mockedObservable = of({ message: 'Profile updated' });
    spyOn(authService, 'updateProfile').and.returnValue(mockedObservable);
    const snackBar = fixture.debugElement.injector.get(MatSnackBar);
    spyOn(snackBar, 'open');
    component.onUpdate();
    expect(authService.updateProfile).toHaveBeenCalledWith(component.username);
    expect(snackBar.open).toHaveBeenCalledWith('Profile updated', 'Ok');
  });

});
