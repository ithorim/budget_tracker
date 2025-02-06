const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    amount: { type: Number, required: true },
    currency: {type: String, enum: ["RSD", "EUR", "USD"], required: true, default: "RSD"},
    category: { type: String, enum: ["Food", "Rent", "Utilities", "Transport", "Entertainment", "Other"], required: true },
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
    const transaction = await this.findOne({ _id: id, userId }) // .populate("userId", "name email id");
    if(!transaction) throw new Error("Transaction not found.");

    return transaction;
}

TransactionSchema.statics.updateTransaction = async function (id, userId, updatedData) {
    const transaction = await this.findOneAndUpdate(
        { _id: id, userId }, // find transaction with these fields
        updatedData, // update with this data
        { new: true, runValidators: true } // return new object, not original and also validate fields if defined
    );
    if(!transaction) throw new Error("Transaction not found.");

    return transaction;
}

TransactionSchema.statics.deleteTransaction = async function(id, userId) {
    const transaction = await this.findOneAndDelete({ _id: id, userId });
    if(!transaction) throw new Error("Transaction not found.");

    return transaction;
}

const TransactionModel = mongoose.model("transaction", TransactionSchema);

module.exports = TransactionModel;