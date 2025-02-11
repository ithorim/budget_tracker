import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { Transaction, TransactionFilters, PaginatedTransactions } from '../models/transaction.model';
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

  /**
   * fetches paginated transactions with optional filters
   * 1. component calls this with optional TransactionFilters
   * 2. service builds query params from filters
   * 3. backend applies filters and returns paginated results
   * 4. component receives PaginatedTransactions and updates view
   */
  getTransactions(filters: TransactionFilters = {}): Observable<PaginatedTransactions> {
    const token = localStorage.getItem('token');
    if (!token) {
      // return empty result if not authenticated
      return of({ transactions: [], total: 0, page: 1, totalPages: 0 });
    }

    const httpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // build query parameters from filters
    // - page: current page number (default: 1)
    // - limit: items per page (default: 10)
    // - type: transaction type filter (income/expense)
    // - category: transaction category filter
    // - search: text search in description
    // - startDate/endDate: date range filters
    const params = new HttpParams()
      .set('page', filters.page?.toString() || '1')
      .set('limit', filters.limit?.toString() || '10')
      .set('type', filters.type || '')
      .set('category', filters.category || '')
      .set('search', filters.search || '')
      .set('startDate', filters.startDate?.toISOString() || '')
      .set('endDate', filters.endDate?.toISOString() || '');

    // make http request to backend
    // backend will:
    // 1. apply filters to query
    // 2. calculate total matching records
    // 3. apply pagination
    // 4. return PaginatedTransactions containing:
    //    - transactions: Transaction[] for current page
    //    - total: total number of matching records
    //    - page: current page number
    //    - totalPages: total number of pages
    return this.httpClient.get<PaginatedTransactions>(
      `${this.backUrl}`,
      { headers: httpHeaders, params }
    );
  }

  // would be better if it was not hard-coded but that requires changing how categories are stored in the db
  // might do it later
  getCategories(type: 'income' | 'expense'): string[] {
    return type === 'income' 
      ? ["Salary", "Freelance", "Investment", "Other Income"]
      : ["Food", "Rent", "Utilities", "Transport", "Entertainment", "Other Expense"];
  }

  updateTransaction(transaction: Transaction): Observable<Transaction> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError(() => new Error('No authentication token'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.httpClient.put<Transaction>(
      `${this.backUrl}/${transaction._id}`,
      transaction,
      { headers }
    );
  }

  deleteTransaction(transaction: Transaction): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError(() => new Error('No authentication token'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.httpClient.delete(
      `${this.backUrl}/${transaction._id}`, { headers }
    );
  }

  createTransaction(transaction: Transaction): Observable<Transaction> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError(() => new Error('No authentication token'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.httpClient.post<Transaction>(
      `${this.backUrl}/`,
      transaction,
      { headers }
    );
  }
}
