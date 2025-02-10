import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Transaction } from '../../models/transaction.model';
import { TransactionService } from '../../services/transaction.service';
import { MonthlySummary } from '../../models/monthly-summary.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{
  recentTransactions: Transaction[] = [];
  monthlySummary: MonthlySummary = {
    totalIncomeEUR: 0,
    totalExpensesEUR: 0,
    netBalanceEUR: 0,
    month: '',
    year: 0
  };

  constructor(private transactionService: TransactionService, private router: Router) {}
  
  ngOnInit(): void {
    this.loadData();
  }
  
  private loadData(): void {
    this.transactionService.getRecentTransactions()
      .subscribe({
        next: (transactions) => {
          this.recentTransactions = transactions;
        },
        error: (error) => {
          console.error('Error fetching recent transactions:', error);
        }
      });

    this.transactionService.getMonthlySummary()
      .subscribe({
        next: (summary) => {
          this.monthlySummary = summary;
        },
        error: (error) => {
          console.error('Error fetching monthly summary:', error);
        }
      });
  }
}
