import { Component, OnInit } from '@angular/core';
import { Transaction, TransactionFilters } from '../../models/transaction.model';
import { TransactionService } from '../../services/transaction.service';
import { Router } from '@angular/router';

/**
 * Manages the transaction list view with filtering and pagination
 * - Maintains filter state (type, category, search, dates)
 * - Handles pagination controls
 * - Updates view when filters/page changes
 */
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
  
  // Filter state
  filters: TransactionFilters = {
    page: 1,
    limit: 10
  };

  // Filter UI state
  selectedType: 'income' | 'expense' | '' = '';
  categories: string[] = [];
  selectedCategory = '';
  searchQuery = '';
  startDate?: Date;
  endDate?: Date;

  // UI state
  loading = false;
  errorMessage = '';

  // Add to existing properties
  selectedTransaction: Transaction | null = null;
  isEditModalOpen = false;
  isDeleteModalOpen = false;
  isCreateModalOpen = false;

  constructor(
    private transactionService: TransactionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.loading = true;
    this.errorMessage = '';

    this.transactionService.getTransactions(this.filters)
    .subscribe({
      next: (response) => { 
        this.transactions = response.transactions;
        this.totalTransactions = response.total;
        this.currentPage = response.page;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        console.error('Error loading transactions:', error);
        
        if (error.status === 401) {
          this.errorMessage = 'Your session has expired. Please log in again.';
          this.router.navigate(['/login']);
        } else if (error.status === 400) {
          this.errorMessage = error.error.message || 'Invalid request. Please check your filters.';
        } else {
          this.errorMessage = 'Unable to load transactions. Please try again later.';
        }
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

  // edit transaction modal
  openEditModal(transaction: Transaction) {
    this.selectedTransaction = transaction;
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.selectedTransaction = null;
    this.isEditModalOpen = false;
  }

  onTransactionUpdated() {
    this.loadTransactions();
  }

  // delete transaction modal
  openDeleteModal(transaction: Transaction) {
    this.selectedTransaction = transaction;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.selectedTransaction = null;
    this.isDeleteModalOpen = false;
  }

  onTransactionDeleted() {
    this.loadTransactions();
  }

  // create transaction modal
  openCreateModal() {
    this.isCreateModalOpen = true;
  }

  closeCreateModal() {
    this.isCreateModalOpen = false;
  }
}
