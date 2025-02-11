import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Transaction } from '../../../models/transaction.model';
import { TransactionService } from '../../../services/transaction.service';

@Component({
  selector: 'app-add-transaction-modal',
  templateUrl: './add-transaction-modal.component.html',
  styleUrls: ['./add-transaction-modal.component.scss']
})
export class AddTransactionModalComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() transactionAdded = new EventEmitter<void>();

  newTransaction: Transaction = {
    type: 'expense',
    amount: 0,
    currency: 'RSD',
    description: '',
    category: '',
    date: new Date()
  };

  categories: string[] = [];
  errorMessage = '';

  constructor(private transactionService: TransactionService) {
    // Initialize categories based on default type (expense)
    this.categories = this.transactionService.getCategories('expense');
    this.newTransaction.category = this.categories[0];
  }

  onClose() {
    this.resetForm();
    this.close.emit();
  }

  onSubmit() {
    this.transactionService.createTransaction(this.newTransaction).subscribe({
      next: () => {
        this.transactionAdded.emit();
        this.resetForm();
        this.close.emit();
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'Error creating transaction';
      }
    });
  }

  onTypeChange() {
    // Update categories based on new type
    this.categories = this.transactionService.getCategories(this.newTransaction.type);
    // Set the first category as default
    this.newTransaction.category = this.categories[0];
  }

  private resetForm() {
    this.newTransaction = {
      type: 'expense',
      amount: 0,
      currency: 'RSD',
      description: '',
      category: this.transactionService.getCategories('expense')[0],
      date: new Date()
    };
    this.errorMessage = '';
  }
} 