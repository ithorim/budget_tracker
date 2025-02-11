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

// get all of user's transactions. supports filtering by type, category, date range and search
// paginates results (send -1 for all)
router.get("/",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            // Parse query parameters
            const options = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 10,
                type: req.query.type || undefined,
                category: req.query.category || undefined,
                search: req.query.search || undefined,
                startDate: req.query.startDate || undefined,
                endDate: req.query.endDate || undefined
            };

            // get filtered and paginated transactions
            const result = await transactionService.getPaginatedTransactions(req.user.id, options);
            res.json(result);
        } catch (error) {
            console.error('Error in getPaginatedTransactions:', error);
            res.status(500).json({ 
                message: "Error fetching transactions",
                error: error.message 
            });
        }
    }
)

// get all of logged-in user's recent transaction
router.get("/recent",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            const transactions = await transactionService.getRecentTransactions(req.user.id);
            res.json(transactions);
        } catch (error) {
            res.status(500).json({ message: "Error fetching recent transactions" });
        }
    }
);

// get monthly summary
router.get("/monthly-summary",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            const summary = await transactionService.getMonthlySummary(req.user.id);
            res.json(summary);
        } catch (error) {
            res.status(500).json({ message: "Error fetching monthly summary" });
        }
    }
);

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