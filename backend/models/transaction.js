const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    amount: { 
        type: Number, 
        required: true,
        min: [1, 'Amount must be positive']
    },
    currency: {type: String, enum: ["RSD", "EUR", "USD"], required: true, default: "RSD"},
    category: {
        type: String,
        required: true,
        validate: {
            validator: function(value) {
                const incomeCategories = ["Salary", "Freelance", "Investment", "Other Income"];
                const expenseCategories = ["Food", "Rent", "Utilities", "Transport", "Entertainment", "Other Expense"];
                
                if (this.type === "income") {
                    const isValid = incomeCategories.includes(value);
                    if (!isValid) {
                        this.invalidate('category', `For income transactions, category must be one of: ${incomeCategories.join(', ')}`);
                    }
                    return isValid;
                } else {
                    const isValid = expenseCategories.includes(value);
                    if (!isValid) {
                        this.invalidate('category', `For expense transactions, category must be one of: ${expenseCategories.join(', ')}`);
                    }
                    return isValid;
                }
            }
        }
    },
    date: { type: Date, default: Date.now },
    description: { type: String}
})

TransactionSchema.statics.createTransaction = async function(transactionData) {
    return await this.create(transactionData);
}

TransactionSchema.statics.getUserTransactions = async function(userId) {
    return await this.find({ userId }).sort({ date: -1})
}

TransactionSchema.statics.getTransactionById = async function(id, userId) {
    const transaction = await this.findOne({ _id: id, userId })
    if(!transaction) throw new Error("Transaction not found.");

    return transaction;
}

TransactionSchema.statics.updateTransaction = async function (id, userId, updatedData) {
    const transaction = await this.findOneAndUpdate(
        { _id: id, userId }, // find transaction with these fields
        updatedData, // update with this data
        { new: true, runValidators: true } // return new object
    );
    if(!transaction) throw new Error("Transaction not found.");

    return transaction;
}

TransactionSchema.statics.deleteTransaction = async function(id, userId) {
    const transaction = await this.findOneAndDelete({ _id: id, userId });
    if(!transaction) throw new Error("Transaction not found.");

    return transaction;
}

TransactionSchema.statics.getRecentTransactions = async function(userId) {
    return await this.find({ userId })
        .sort({ date: -1 })
        .limit(5);
}

TransactionSchema.statics.getPaginatedTransactions = async function(userId, options = {}) {
    const {
        page = 1,
        limit = 10,
        type,
        category,
        startDate,
        endDate,
        search
    } = options;

    const query = { userId };
    
    if (type) query.type = type;
    if (category) query.category = category;
    if (search) query.description = new RegExp(search, 'i');
    if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = new Date(startDate);
        if (endDate) query.date.$lte = new Date(endDate);
    }

    const total = await this.countDocuments(query);
    
    const transactions = await this.find(query)
        .sort({ date: -1 })
        .skip((page - 1) * limit)
        .limit(limit === -1 ? null : limit);

    return {
        transactions,
        total,
        page: Number(page),
        totalPages: limit === -1 ? 1 : Math.ceil(total / limit)
    };
}

TransactionSchema.statics.getMonthlySummary = async function(userId) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const transactions = await this.find({
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
}

const TransactionModel = mongoose.model("transaction", TransactionSchema);

module.exports = TransactionModel;