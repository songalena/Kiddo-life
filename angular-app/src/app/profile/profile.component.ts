import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  standalone: false
})
export class ProfileComponent {
  username: string = '';

  constructor(private auth: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.username = this.auth.getUsername();
  }
  onLogOut() {
    this.auth.logOut();
  }

  onUpdate() {
    this.auth.updateProfile(this.username).subscribe(response => {
      this.snackBar.open(response?.message, 'Ok');
    })
  }
}
