const { Transaction, Product } = require("../models");
const payment = require("../utils/payment");
module.exports = {
  createTransaction: async (req, res, next) => {
    try {
      const { product_id, pax } = req.body;
      const user_id = req.user.id;
      let payment_id = await payment.generate();
      const product = await Product.findOne({ where: { id: product_id } });
      if (!product) {
        return res.status(404).json({
          status: false,
          message: "product not found",
          data: product,
        });
      }

      const total = product.price * pax;
      let snapLink = await payment.snapLink(payment_id, total);
      if (!snapLink) {
        return res.status(400).json({
          status: false,
          message: "failed create snap link",
        });
      }

      const createTransaction = await Transaction.create({
        user_id,
        product_id,
        payment_id,
        pax,
        total,
        payment_link: snapLink,
        status: "unpaid",
      });
      if (!createTransaction) {
        return res.status(400).json({
          status: false,
          message: "failed create transaction",
          data: createTransaction,
        });
      }
      //   let datas = { ...createTransaction, ...snapLink };
      return res.status(201).json({
        status: true,
        message: "success create transaction",
        data: createTransaction,
      });
    } catch (error) {
      next(error);
    }
  },
  getAll: async (req, res, next) => {
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
  getOne: async (req, res, next) => {
    try {
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
    } catch (err) {
      next(err);
    }
  },
  payment: async (req, res, next) => {
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

      const updateTransaction = await Transaction.update(
        { status: 1 },
        { where: { id } }
      );
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
  delete: async (req, res, next) => {
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
