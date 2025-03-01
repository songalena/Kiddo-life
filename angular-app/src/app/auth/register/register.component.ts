import { Component } from '@angular/core';
import { AuthService } from '../auth.service';  
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: false
})

export class RegisterComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  onRegister() {
    this.authService.register(this.email, this.password).subscribe({
      next: (response) => {
        this.router.navigate(['./login']);
        this.snackBar.open(response?.message, 'Ok');
        // Redirect to login or other page
      },
      error: (error) => {
        console.error('Error registering', error);
      }
    });
  }

  onForgotPassword() {
    // Implement or navigate to the forgot password page
    console.log('Navigate to forgot password page');
  }
}
