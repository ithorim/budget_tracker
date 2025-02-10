import { Injectable } from '@angular/core';
import { Environment } from '../env/env';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AuthResponse, User } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private backUrl = Environment.backUrl + '/auth';

  constructor(private httpClient: HttpClient) { }

  login(user: User): Observable<AuthResponse> {
    const token = this.httpClient.post<AuthResponse>(`${this.backUrl}/login`, user);
    return token;
  }

  register(user: User): Observable<AuthResponse> {
    const token = this.httpClient.post<AuthResponse>(`${this.backUrl}/register`, user);
    return token;
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  verifyToken(): Observable<any> {
    const token = localStorage.getItem('token');
    if(!token) {
      return of(false);
    }
    const httpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.httpClient.get<any>(`${this.backUrl}/verifyToken`, { headers: httpHeaders });
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return token !== null;
  }

  
}
