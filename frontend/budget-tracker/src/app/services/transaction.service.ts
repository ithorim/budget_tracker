import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Transaction } from '../models/transaction.model';
import { Environment } from '../env/env';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private backUrl = Environment.backUrl + '/transaction';

  constructor(private httpClient: HttpClient) { }

  getRecentTransactions(): Observable<Transaction[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      return of([]);
    }
    const httpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.httpClient.get<Transaction[]>(`${this.backUrl}/recent`, { headers: httpHeaders });
  }
}
