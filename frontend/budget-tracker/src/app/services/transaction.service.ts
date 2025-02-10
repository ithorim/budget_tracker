import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Transaction } from '../models/transaction.model';
import { Environment } from '../env/env';
import { MonthlySummary } from '../models/monthly-summary.model';

export interface TransactionFilters {
  type?: 'income' | 'expense';
  category?: string;
  startDate?: Date;
  endDate?: Date;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedTransactions {
  transactions: Transaction[];
  total: number;
  page: number;
  totalPages: number;
}

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

  getTransactions(filters: TransactionFilters = {}): Observable<PaginatedTransactions> {
    const token = localStorage.getItem('token');
    if (!token) {
      return of({ transactions: [], total: 0, page: 1, totalPages: 0 });
    }

    const httpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const params = new HttpParams()
      .set('page', filters.page?.toString() || '1')
      .set('limit', filters.limit?.toString() || '10')
      .set('type', filters.type || '')
      .set('category', filters.category || '')
      .set('search', filters.search || '')
      .set('startDate', filters.startDate?.toISOString() || '')
      .set('endDate', filters.endDate?.toISOString() || '');

    return this.httpClient.get<PaginatedTransactions>(
      `${this.backUrl}`,
      { headers: httpHeaders, params }
    );
  }

  getCategories(type: 'income' | 'expense'): string[] {
    return type === 'income' 
      ? ["Salary", "Freelance", "Investment", "Other Income"]
      : ["Food", "Rent", "Utilities", "Transport", "Entertainment", "Other Expense"];
  }
}
