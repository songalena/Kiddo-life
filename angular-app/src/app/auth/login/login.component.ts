import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  onLogin() {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.router.navigate(['/']);
        this.snackBar.open(response?.message, 'Ok');
      }
    }
    );
  }

  onForgotPassword() {
    // Implement or navigate to the forgot password page
    console.log('Navigate to forgot password page');
  }
}
