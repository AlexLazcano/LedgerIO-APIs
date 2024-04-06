const splitTransactionService = require('../services/splitTransaction.service');



const splitTransactionController = {

    async createSplitTransaction(req, res) {
        try {
            const { from, to, total, description, splitAmount } = req.body;
            const date = new Date();

            const transaction = await splitTransactionService.createSplitTransaction(from, to, total, splitAmount,  date, description || "");
            res.status(201).json(
                transaction
            );
        } catch (error) {
            res.status(400).send(error);
        }
    },
    async getSplitTransactionsBySender(req, res) {
        try {
            const { userId } = req.params; // Assuming userId is passed as a parameter in the request
    
            const transactions = await splitTransactionService.getSplitTransactionsBySender(userId);
            res.status(200).json(transactions);
        } catch (error) {
            res.status(400).send(error);
        }
    },
    async groupSplitTransactionsByEdge(req, res) {
        try {
            const aggregatedTransactions = await splitTransactionService.groupSplitTransactionsByEdge();
            res.json(aggregatedTransactions);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

}

module.exports = splitTransactionController;