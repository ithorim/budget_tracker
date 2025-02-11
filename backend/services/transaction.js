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
        return await TransactionModel.getMonthlySummary(userId);
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