const SplitTransactions = require('../models/SplitTransaction.model');

const splitTransactionService = {
    async createSplitTransaction(user_id1, user_id2, total, splitAmount, date, description) {

        try {

            const newSplitTransaction = new SplitTransactions({ from: user_id1, to: user_id2, total: total, splitAmount: splitAmount, date, description });

            const savedSplitTransaction = await newSplitTransaction.save();

            console.log('Transaction created:', savedSplitTransaction);
            return savedSplitTransaction;
        } catch (error) {
            throw new Error('Error creating Transaction');
        }
    },

    async getSplitTransactionsBySender(userId) {
        try {

            const transactions = await SplitTransactions.find({ from: userId });

            return transactions;
        } catch (error) {
            throw error;
        }
    },

    async groupSplitTransactionsByEdge() {
        try {
            const aggregatedSplitTransactions = await SplitTransactions.aggregate([
                {
                    $group: {
                        _id: { from: "$from", to: "$to" }, // Group by the sender and receiver's user IDs
                        totalAmount: { $sum: "$amount" }, // Calculate the total amount for each sender-receiver pair
                        count: { $sum: 1 } // Count the number of transactions for each sender-receiver pair
                    }
                },
                {
                    $lookup: {
                        from: "users", // Assuming the user collection name is "users"
                        localField: "_id.from",
                        foreignField: "_id",
                        as: "fromUser"
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "_id.to",
                        foreignField: "_id",
                        as: "toUser"
                    }
                },
                {
                    $project: {
                        _id: {
                            from: "$_id.from",
                            to: "$_id.to"
                        },
                        from: { $arrayElemAt: ["$fromUser.name", 0] },
                        to: { $arrayElemAt: ["$toUser.name", 0] },
                        totalAmount: 1,
                        count: 1
                    }
                }
            ]);
            return aggregatedSplitTransactions;
        } catch (error) {
            throw error;
        }
    }



    // Additional methods for updating, deleting, etc.
};

module.exports = splitTransactionService;
