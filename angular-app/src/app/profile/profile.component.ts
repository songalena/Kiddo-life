import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  standalone: false
})
export class ProfileComponent {
  email: string = '';
  username: string = '';

  constructor(private auth: AuthService) {

  }
  onLogOut() {
    this.auth.logOut();
  }

  onUpdate() {

  }
}
