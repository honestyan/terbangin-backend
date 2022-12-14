const midtransClient = require("midtrans-client");
const { Transaction } = require("../models");
const { CLIENT_KEY_MIDTRANS, SERVER_KEY_MIDTRANS } = process.env;

module.exports = {
  generate: async () => {
    const now = Date.now();
    const payment_id = `TERB${now}`;
    const checkPaymentId = await Transaction.findOne({ where: { payment_id } });
    if (checkPaymentId) {
      return generate();
    }
    return payment_id;
  },
  snapLink: async (payment_id, total) => {
    return new Promise((resolve, reject) => {
      const snap = new midtransClient.Snap({
        isProduction: false,
        serverKey: SERVER_KEY_MIDTRANS,
        clientKey: CLIENT_KEY_MIDTRANS,
      });
      const parameter = {
        transaction_details: {
          order_id: payment_id,
          gross_amount: total,
        },
        credit_card: {
          secure: true,
        },
      };
      snap
        .createTransaction(parameter)
        .then((transaction) => {
          const snapLink = transaction.redirect_url;
          resolve(snapLink);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};
