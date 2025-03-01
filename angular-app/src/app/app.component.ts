import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent implements OnInit {
  title = 'kiddo-life';

  constructor(private router: Router,
    private authService: AuthService
  ) {
    
  }

  ngOnInit() {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isSafari) {
      setTimeout(() => {
        this.router.navigateByUrl('')
      })
    }
  }

  isAuthenticated() {
    return this.authService.isAuthenticated();
  }
}
