const { Transaction } = require("../models");

module.exports = {
  hadlingPayment: async (req, res, next) => {
    try {
      const { transaction_status, order_id } = req.body;

      const transaction = await Transaction.findOne({
        where: { payment_id: order_id },
      });

      if (!transaction) {
        return res.status(200).json({
          status: false,
          message: "transaction not found",
          data: transaction,
        });
      }

      const transactionUpdate = await Transaction.update(
        { status: transaction_status },
        { where: { payment_id: order_id } }
      );

      const updatedTransaction = await Transaction.findOne({
        where: { payment_id: order_id },
      });

      return res.status(200).json({
        status: true,
        message: "status updated",
        data: updatedTransaction,
      });
    } catch (error) {
      next(error);
    }
  },
};
