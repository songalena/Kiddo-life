import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AppRoutingModule } from './app-routing.module';


describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatCardModule,
        MatFormFieldModule,
        MatSelectModule,
        FormsModule,
        MatInputModule,
        BrowserAnimationsModule,
        MatIconModule,
        MatMenuModule,
        AppRoutingModule
      ],
      declarations: [AppComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call isAuthenticated() and return false when user is not authenticated', () => {
    spyOn(component, 'isAuthenticated').and.returnValue(false);
    expect(component.isAuthenticated()).toBeFalse();
  });

  it('should call isAuthenticated() and return true when user is authenticated', () => {
    spyOn(component, 'isAuthenticated').and.returnValue(true);
    expect(component.isAuthenticated()).toBeTrue();
  });

  it('should call isAdmin() and return false when user is not admin', () => {
    spyOn(component, 'isAdmin').and.returnValue(false);
    expect(component.isAdmin()).toBeFalse();
  });

  it('should call isAdmin() and return true when user is admin', () => {
    spyOn(component, 'isAdmin').and.returnValue(true);
    expect(component.isAdmin()).toBeTrue();
  });

  it('should navigate to empty route if Safari is detected', async () => {
    spyOnProperty(window.navigator, 'userAgent', 'get').and.returnValue('Safari');
    const routerSpy = spyOn(component["router"], 'navigateByUrl');
    component.ngOnInit();
    await new Promise(resolve => setTimeout(resolve, 500));
    expect(routerSpy).toHaveBeenCalledWith('');
  });

  it('should not navigate if Safari is not detected', () => {
    spyOnProperty(window.navigator, 'userAgent', 'get').and.returnValue('Chrome');
    const routerSpy = spyOn(component["router"], 'navigateByUrl');
    component.ngOnInit();
    expect(routerSpy).not.toHaveBeenCalled();
  });
});
