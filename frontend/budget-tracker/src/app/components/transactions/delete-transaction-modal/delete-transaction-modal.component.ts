import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Transaction } from '../../../models/transaction.model';
import { TransactionService } from '../../../services/transaction.service';
@Component({
  selector: 'app-delete-transaction-modal',
  templateUrl: './delete-transaction-modal.component.html',
  styleUrl: './delete-transaction-modal.component.scss'
})
export class DeleteTransactionModalComponent {
  @Input() transaction: Transaction | null = null;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() transactionDeleted = new EventEmitter<void>();

  errorMessage = '';

  constructor(private transactionService: TransactionService) {}

  onClose() {
    this.close.emit();
  }

  onSubmit() {
    // Only proceed if we have a transaction to delete
    if (this.transaction) {
      this.transactionService.deleteTransaction(this.transaction).subscribe({
        next: () => {
          this.transactionDeleted.emit();
          this.close.emit();
        },
        error: (error) => {
          this.errorMessage = error.error.message || 'Error deleting transaction';
        }
      });
    }
  }
}
