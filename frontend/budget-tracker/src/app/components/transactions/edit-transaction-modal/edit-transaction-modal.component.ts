import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { Transaction } from '../../../models/transaction.model';
import { TransactionService } from '../../../services/transaction.service';

@Component({
  selector: 'app-edit-transaction-modal',
  templateUrl: './edit-transaction-modal.component.html',
  styleUrls: ['./edit-transaction-modal.component.scss']
})
export class EditTransactionModalComponent implements OnChanges {
  @Input() transaction: Transaction | null = null;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() transactionUpdated = new EventEmitter<void>();

  editedTransaction: Transaction | null = null;
  categories: string[] = [];
  errorMessage = '';

  constructor(private transactionService: TransactionService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['transaction'] && this.transaction) {
      this.editedTransaction = {
        ...this.transaction,
        date: new Date(this.transaction.date),
        amount: Number(this.transaction.amount),
        type: this.transaction.type as 'income' | 'expense',
        currency: this.transaction.currency as 'EUR' | 'USD' | 'RSD'
      };
      
      this.categories = this.transactionService.getCategories(this.editedTransaction.type);
      
      if (!this.editedTransaction.category || !this.categories.includes(this.editedTransaction.category)) {
        this.editedTransaction.category = this.categories[0];
      }
    }
  }

  onClose() {
    this.close.emit();
  }

  onSubmit() {
    if (!this.editedTransaction) return;

    if (this.editedTransaction.amount < 1) {
        this.errorMessage = 'Amount must be greater than 0';
        return;
    }

    const formattedTransaction = {
        ...this.editedTransaction,
        amount: Number(this.editedTransaction.amount),
        date: new Date(this.editedTransaction.date),
        type: this.editedTransaction.type as 'income' | 'expense',
        category: this.editedTransaction.category,
        currency: this.editedTransaction.currency as 'EUR' | 'USD' | 'RSD'
    };

    const validCategories = this.transactionService.getCategories(formattedTransaction.type);
    if (!validCategories.includes(formattedTransaction.category)) {
        this.errorMessage = `Invalid category for ${formattedTransaction.type} type. Please select from: ${validCategories.join(', ')}`;
        return;
    }

    this.transactionService.updateTransaction(formattedTransaction).subscribe({
        next: () => {
            this.transactionUpdated.emit();
            this.close.emit();
        },
        error: (error) => {
            if (error.error?.message) {
                this.errorMessage = error.error.message;
            } else {
                this.errorMessage = 'Error updating transaction. Please check all fields and try again.';
            }
        }
    });
  }

  onTypeChange() {
    if (this.editedTransaction) {
        this.categories = this.transactionService.getCategories(this.editedTransaction.type);
        this.editedTransaction.category = this.categories[0];
    }
  }
} 