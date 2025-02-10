import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Transaction } from '../../models/transaction.model';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{
  constructor(private transactionService: TransactionService, private router: Router) {}
  
  recentTransactions: Transaction[] = [];

  ngOnInit(): void {
    this.transactionService.getRecentTransactions()
      .subscribe({
        next: (transactions) => {
          this.recentTransactions = transactions;
        },
        error: (error) => {
          console.error('Error fetching recent transactions:', error);
        }
      });
  }
  
}
