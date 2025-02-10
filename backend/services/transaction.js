const TransactionModel = require("../models/transaction");

const create = async (transactionData) => {
    return await TransactionModel.createTransaction(transactionData);
}

const getUserTransactions = async (userId) => {
    return await TransactionModel.getUserTransactions(userId);
}

const getTransactionById = async (id, userId) => {
    return await TransactionModel.getTransactionById(id, userId);
}

const update = async (id, userId, updateData) => {
    return await TransactionModel.updateTransaction(id, userId, updateData);
}

const remove = async (id, userId) => {
    return await TransactionModel.deleteTransaction(id, userId);
}

const getRecentTransactions = async (userId) => {
    try {
        return await TransactionModel.getRecentTransactions(userId);
    } catch (error) {
        throw error;
    }
};

const getMonthlySummary = async (userId) => {
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const transactions = await TransactionModel.find({
            userId,
            date: {
                $gte: startOfMonth,
                $lte: endOfMonth
            }
        });

        const conversionRates = {
            'USD': 0.92,
            'RSD': 0.0085,
            'EUR': 1
        };

        let totalIncomeEUR = 0;
        let totalExpensesEUR = 0;

        transactions.forEach(transaction => {
            const amountInEUR = transaction.amount * conversionRates[transaction.currency];
            if (transaction.type === 'income') {
                totalIncomeEUR += amountInEUR;
            } else {
                totalExpensesEUR += amountInEUR;
            }
        });

        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];

        return {
            totalIncomeEUR,
            totalExpensesEUR,
            netBalanceEUR: totalIncomeEUR - totalExpensesEUR,
            month: monthNames[now.getMonth()],
            year: now.getFullYear()
        };
    } catch (error) {
        throw error;
    }
};

const getPaginatedTransactions = async (userId, options) => {
    try {
        const result = await TransactionModel.getPaginatedTransactions(userId, options);
        return result;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    create,
    getUserTransactions,
    getTransactionById,
    update,
    remove,
    getRecentTransactions,
    getMonthlySummary,
    getPaginatedTransactions
};