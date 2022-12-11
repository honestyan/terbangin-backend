const { transcode } = require("buffer");
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
    getOne: async(req, res, next) => {
        const { id } = req.params;

        const transaction = await Transaction.findOne({ where: { id } });
        if (!transaction) {
            return res.status(200).json({
                status: false,
                message: "transaction not found",
                data: transaction,
            });
        }
        return res.status(200).json({
            status: true,
            message: "success get transaction detail",
            data: transaction,
        });
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
    payment: async(req, res, next) => {
        try {
            const { id } = req.params;

            const transactionExist = await Transaction.findOne({ where: { id } });
            if (!transactionExist) {
                return res.status(200).json({
                    status: false,
                    message: "transaction not found",
                    data: transactionExist,
                });
            }

            const updateTransaction = await Transaction.update({ status: 1 }, { where: { id } });
            const updatedTransaction = await Transaction.findOne({ where: { id } });
            return res.status(200).json({
                status: true,
                message: "payment success",
                data: updatedTransaction,
            });
        } catch (error) {
            next(error);
        }
    },
    delete: async(req, res, next) => {
        try {
            const { id } = req.params;
            const transactionExist = await Transaction.findOne({ where: { id } });
            if (!transactionExist) {
                return res.status(200).json({
                    status: false,
                    message: "transaction not found",
                    data: transactionExist,
                });
            }
            const deleteTransction = await Transaction.destroy({ where: { id } });
            return res.status(200).json({
                status: true,
                message: "success delete transaction",
                data: deleteTransction,
            });
        } catch (error) {
            next(error);
        }
    },
};