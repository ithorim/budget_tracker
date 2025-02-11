export interface Transaction {
    _id?: string;
    userId?: string;
    type: 'income' | 'expense';
    amount: number;
    currency: 'EUR' | 'USD' | 'RSD';
    category: string;
    date: Date;
    description?: string;
}

/**
 * Interface for transaction filter parameters
 * Used to pass filter state between component and service
 */
export interface TransactionFilters {
    type?: 'income' | 'expense';
    category?: string;
    startDate?: Date;
    endDate?: Date;
    search?: string;
    page?: number;
    limit?: number;
}

/**
 * Response format for paginated transactions
 * Returned by backend when fetching transactions
 */
export interface PaginatedTransactions {
    transactions: Transaction[];
    total: number;
    page: number;
    totalPages: number;
}