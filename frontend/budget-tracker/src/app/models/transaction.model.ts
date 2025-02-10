export interface Transaction {
    _id: string;
    userId: string;
    type: 'income' | 'expense';
    amount: number;
    currency: 'EUR' | 'USD' | 'RSD';
    category: string;
    date: Date;
    description?: string;
}