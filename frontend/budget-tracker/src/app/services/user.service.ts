import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../models/auth.models';
import { Enviroment } from '../env/env';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private backUrl = Enviroment.backUrl + '/user';

  constructor(private httpClient: HttpClient) { }

  getCurrentUser(): Observable<User> {
    const token = localStorage.getItem('token');
    if(!token) {
      return of({email: '', name: ''});
    }
    const httpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.httpClient.get<User>(`${this.backUrl}/currentUser`, { headers: httpHeaders });
  }
}
