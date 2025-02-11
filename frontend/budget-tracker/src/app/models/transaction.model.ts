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

export interface TransactionFilters {
    type?: 'income' | 'expense';
    category?: string;
    startDate?: Date;
    endDate?: Date;
    search?: string;
    page?: number;
    limit?: number;
}

export interface PaginatedTransactions {
    transactions: Transaction[];
    total: number;
    page: number;
    totalPages: number;
}