import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SuccessResponse } from '../models/success-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000/auth'; // Adjust as per your API

  constructor(private http: HttpClient) { }

  register(username: string, password: string) {
    return this.http.post<SuccessResponse>(`${this.baseUrl}/register`, { username, password });
  }

  login(username: string, password: string) {
    return this.http.post<SuccessResponse>(`${this.baseUrl}/login`, { username, password });
  }
}