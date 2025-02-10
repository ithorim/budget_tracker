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
        const transactions = await TransactionModel.find({ userId: userId })
            .sort({ date: -1 })
            .limit(5);
        return transactions;
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
    getRecentTransactions
};