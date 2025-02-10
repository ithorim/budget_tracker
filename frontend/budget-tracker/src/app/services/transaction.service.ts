import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Transaction } from '../models/transaction.model';
import { Environment } from '../env/env';
import { MonthlySummary } from '../models/monthly-summary.model';

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

  getMonthlySummary(): Observable<MonthlySummary> {
    const token = localStorage.getItem('token');
    if (!token) {
        return of({ totalIncomeEUR: 0, totalExpensesEUR: 0, netBalanceEUR: 0, month: '', year: 0 });
    }
    const httpHeaders = new HttpHeaders({
        'Authorization': `Bearer ${token}`
    });

    return this.httpClient.get<MonthlySummary>(`${this.backUrl}/monthly-summary`, { headers: httpHeaders });
  }
}
