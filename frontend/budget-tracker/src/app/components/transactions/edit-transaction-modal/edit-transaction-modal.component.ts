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
      // Create a deep copy of the transaction
      this.editedTransaction = {
        ...this.transaction,
        date: new Date(this.transaction.date)
      };
      // Get categories based on transaction type
      this.categories = this.transactionService.getCategories(this.transaction.type);
      // If no category is set, set the first category as default
      if (!this.editedTransaction.category) {
        this.editedTransaction.category = this.categories[0];
      }
    }
  }

  onClose() {
    this.close.emit();
  }

  onSubmit() {
    if (!this.editedTransaction) return;

    this.transactionService.updateTransaction(this.editedTransaction).subscribe({
      next: () => {
        this.transactionUpdated.emit();
        this.close.emit();
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'Error updating transaction';
      }
    });
  }

  onTypeChange() {
    if (this.editedTransaction) {
      // Update categories based on new type
      this.categories = this.transactionService.getCategories(this.editedTransaction.type);
      // Set the first category as default instead of empty string
      this.editedTransaction.category = this.categories[0];
    }
  }
} 