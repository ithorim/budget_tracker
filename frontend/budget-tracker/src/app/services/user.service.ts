import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../models/auth.models';
import { Environment } from '../env/env';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  private backUrl = Environment.backUrl + '/user';

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

  checkEmailExists(email: string): Observable<boolean> {
    const token = localStorage.getItem('token');
    if(!token) {
      return of(false);
    }
    const httpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    }); // post<boolean> returns true if user exists and Observable emits true if user exists
    return this.httpClient.post<boolean>(`${this.backUrl}/checkEmailExists`, { email }, { headers: httpHeaders });
  }

  updatePassword(currentPassword: string, newPassword: string): Observable<any> {
    const token = localStorage.getItem('token');
    if(!token) {
        return of({ success: false });
    }
    const httpHeaders = new HttpHeaders({
        'Authorization': `Bearer ${token}`
    });

    return this.httpClient.put(
        `${this.backUrl}/updatePassword`,
        { currentPassword, newPassword },
        { headers: httpHeaders }
    );
  }

  /*
    when the property name and the variable name are the same, we can use
    { 
      currentPassword: currentPassword, 
      newPassword: newPassword 
    }
    it's the same as { currentPassword, newPassword }
   */

  updateUserInfo(name: string , email: string): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      return of({ success: false });
    }
    const httpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.httpClient.put(
      `${this.backUrl}/updateUserInfo`,
      { name, email },
      { headers: httpHeaders}
    );
  }
}
