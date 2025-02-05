const router = require("express").Router();
const transactionService = require("../services/transaction");
const passport = require("./config/auth");

// create a transaction
router.post("/",
    passport.authenticate("jwt", {session: false}),
    async (req, res) => {
        try {
            const transaction = await transactionService.create({
                ...req.body,
                userId: req.user.id
            })
            res.status(201).json(transaction);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
)

// get all of logged-in user's transaction
router.get("/",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            const transactions = await transactionService.getUserTransactions(req.user.id);
            res.json(transactions);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
)

// get single transaction
router.get("/:id",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            const transaction = await transactionService.getTransactionById(req.params.id, req.user.id);
            res.json(transaction);
        } catch (error) {
            if (error.message === "Transaction not found.") {
                res.status(404).json({ message: error.message });
            } else {
                res.status(500).json({ message: error.message });
            }
        }
    }
)

// update transaction
router.put("/:id",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            const transaction = await transactionService.update(
                req.params.id,
                req.user.id,
                req.body
            );
            res.json(transaction);
        } catch (error) {
            if (error.message === "Transaction not found.") {
                res.status(404).json({ message: error.message });
            } else {
                res.status(400).json({ message: error.message });
            }
        }
    }
)

// delete transaction
router.delete("/:id",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            await transactionService.remove(req.params.id, req.user.id);
            res.json({ message: "Transaction deleted successfully." });
        } catch (error) {
            if (error.message === "Transaction not found.") {
                res.status(404).json({ message: error.message });
            } else {
                res.status(400).json({ message: error.message });
            }
        }
    }
)

module.exports = router;