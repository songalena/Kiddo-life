import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SuccessResponse } from '../models/success-response';
import { tap } from 'rxjs';
import { LoginResponse } from '../models/login-response';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000/auth'; // Adjust as per your API
  private token = '';

  constructor(private http: HttpClient,
    private router: Router
  ) { }

  register(username: string, password: string) {
    return this.http.post<SuccessResponse>(`${this.baseUrl}/register`, { username, password });
  }

  login(username: string, password: string) {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, { username, password })
    .pipe(tap(response => {
      this.token = response.token;
    }));
  }

  getToken() {
    return this.token;
  }

  isAuthenticated() {
    return this.token !== '';
  }

  logOut() {
    this.token = '';
    this.router.navigate(['']);
  }
}