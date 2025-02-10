import { Component, OnInit } from '@angular/core';
import { Transaction } from '../../models/transaction.model';
import { TransactionService, TransactionFilters } from '../../services/transaction.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss'
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  totalTransactions = 0;
  currentPage = 1;
  totalPages = 0;
  pageSize = 10;
  pageSizeOptions = [5, 10, 20, -1]; // -1 represents 'all'

  filters: TransactionFilters = {
    page: 1,
    limit: 10
  };

  // For filters
  selectedType: 'income' | 'expense' | '' = '';
  categories: string[] = [];
  selectedCategory = '';
  searchQuery = '';
  startDate?: Date;
  endDate?: Date;

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.transactionService.getTransactions(this.filters)
      .subscribe({
        next: (response) => {
          this.transactions = response.transactions;
          this.totalTransactions = response.total;
          this.currentPage = response.page;
          this.totalPages = response.totalPages;
        },
        error: (error) => {
          console.error('Error loading transactions:', error);
          // TODO: Add error handling
        }
      });
  }

  onPageChange(page: number): void {
    this.filters.page = page;
    this.loadTransactions();
  }

  onPageSizeChange(size: number): void {
    this.filters.limit = size;
    this.filters.page = 1; // Reset to first page
    this.loadTransactions();
  }

  onTypeChange(): void {
    if (this.selectedType) {
      this.categories = this.transactionService.getCategories(this.selectedType);
      this.selectedCategory = ''; // Reset category when type changes
    } else {
      this.categories = [];
    }
    this.filters.type = this.selectedType || undefined;
    this.filters.category = undefined;
    this.filters.page = 1;
    this.loadTransactions();
  }

  onCategoryChange(): void {
    this.filters.category = this.selectedCategory || undefined;
    this.filters.page = 1;
    this.loadTransactions();
  }

  onSearch(): void {
    this.filters.search = this.searchQuery || undefined;
    this.filters.page = 1;
    this.loadTransactions();
  }

  onDateChange(): void {
    // Convert string dates to Date objects if they exist
    this.filters.startDate = this.startDate ? new Date(this.startDate) : undefined;
    this.filters.endDate = this.endDate ? new Date(this.endDate) : undefined;
    this.filters.page = 1;
    this.loadTransactions();
  }
}
