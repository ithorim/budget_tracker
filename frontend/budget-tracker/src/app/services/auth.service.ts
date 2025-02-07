import { Injectable } from '@angular/core';
import { Enviroment } from '../env/env';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthResponse, User } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private backUrl = Enviroment.backUrl + '/auth';

  constructor(private httpClient: HttpClient) { }

  login(user: User): Observable<AuthResponse> {
    const token = this.httpClient.post<AuthResponse>(`${this.backUrl}/login`, user);
    return token;
  }

  register(user: User): Observable<AuthResponse> {
    const token = this.httpClient.post<AuthResponse>(`${this.backUrl}/register`, user);
    return token;
  }

}
