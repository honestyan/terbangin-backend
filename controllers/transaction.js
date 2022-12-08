const { Transaction } = require("../models");
module.exports = {
    getAll: async(req, res, next) => {
        try {
            const transactions = await Transaction.findAll();
            if (!transactions.length) {
                return res.status(200).json({
                    status: false,
                    message: "no transaction found",
                    data: transactions,
                });
            }

            return res.status(200).json({
                status: true,
                message: "success get all transactions",
                data: transactions,
            });
        } catch (error) {
            next(error);
        }
    },

    createTransaction: async(req, res, next) => {
        //user id bisa diambil dari token >> will be update
        try {
            const { user_id, product_id, payment_id, total } = req.body;

            const createTransaction = await Transaction.create({
                user_id,
                product_id,
                payment_id,
                total,
                status: 0,
            });

            return res.status(201).json({
                status: true,
                message: "success create transaction",
                data: createTransaction,
            });
        } catch (error) {
            next(error);
        }
    },
};