const {
  Transaction,
  Product,
  BookingDetail,
  Notification,
} = require("../models");
const payment = require("../utils/payment");
const imagekit = require("../utils/imagekit");

module.exports = {
  createTransaction: async (req, res, next) => {
    try {
      const { product_id, pax, detail } = req.body;
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

      //pax passenger validation
      if (detail.length !== pax) {
        return res.status(400).json({
          status: false,
          message: "pax and detail length not match",
        });
      }

      //check available stock
      if (product.stock < pax) {
        return res.status(400).json({
          status: false,
          message: "stock not enough",
        });
      }

      //check available_seat
      const available_seat = product.available_seat.split(",");
      const seat = detail.map((item) => item.seat);
      const checkSeat = seat.every((item) => available_seat.includes(item));
      if (!checkSeat) {
        return res.status(400).json({
          status: false,
          message: "seat not available",
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

      //update available_seat
      const newAvailableSeat = available_seat.filter(
        (item) => !seat.includes(item)
      );
      const updateAvailableSeat = await Product.update(
        { available_seat: newAvailableSeat.join(",") },
        { where: { id: product_id } }
      );
      if (!updateAvailableSeat) {
        return res.status(400).json({
          status: false,
          message: "failed update available seat",
        });
      }

      //insert trx id, ticket num, and isCheckIn to detail
      detail.forEach((item) => {
        item.transaction_id = createTransaction.id;
        item.ticketNum = Math.floor(Math.random() * 1000000000);
        item.isCheckIn = false;
      });
      const createDetail = await BookingDetail.bulkCreate(detail);

      if (!createDetail) {
        return res.status(400).json({
          status: false,
          message: "failed create detail",
          data: createDetail,
        });
      }

      const decrementStock = await Product.decrement(
        { stock: pax },
        { where: { id: product_id } }
      );

      if (!decrementStock) {
        return res.status(400).json({
          status: false,
          message: "failed decrement stock",
          data: decrementStock,
        });
      }

      //insert to notification
      const notification = await Notification.create({
        title: "New Transaction",
        body: `New transaction for ${product.iata_from}-${product.iata_to}. Check your email to pay the transaction.`,
        user_id,
        transaction_id: createTransaction.id,
        is_read: false,
      });

      if (!notification) {
        return res.status(400).json({
          status: false,
          message: "failed create notification",
          data: notification,
        });
      }

      return res.status(201).json({
        status: true,
        message: "success create transaction",
        data: createTransaction,
      });
    } catch (error) {
      next(error);
    }
  },

  getTrxByUser: async (req, res, next) => {
    try {
      const token = req.user;
      const transactions = await Transaction.findAll({
        where: { user_id: token.id },
        order: [["createdAt", "DESC"]],
      });

      if (!transactions.length) {
        return res.status(200).json({
          status: false,
          message: "no transaction found",
          data: transactions,
        });
      }

      //get bookingdetail for each transaction and insert to transaction object
      const result = await Promise.all(
        transactions.map(async (transaction) => {
          const bookingDetail = await BookingDetail.findAll({
            where: { transaction_id: transaction.id },
          });
          transaction.dataValues.bookingDetail = bookingDetail;
          return transaction;
        })
      );
      return res.status(200).json({
        status: true,
        message: "success get all transactions",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  getOne: async (req, res, next) => {
    try {
      const { id } = req.params;
      const token = req.user;
      //only user can get their own transaction
      const transaction = await Transaction.findOne({
        where: { id, user_id: token.id },
      });

      if (!transaction) {
        return res.status(200).json({
          status: false,
          message: "transaction not found",
          data: transaction,
        });
      }

      const bookingDetail = await BookingDetail.findAll({
        where: { transaction_id: transaction.id },
      });
      transaction.dataValues.bookingDetail = bookingDetail;

      return res.status(200).json({
        status: true,
        message: "success get transaction detail",
        data: transaction,
      });
    } catch (err) {
      next(err);
    }
  },

  delete: async (req, res, next) => {
    try {
      const { id } = req.params;

      if (!req.user) {
        var transaction = await Transaction.findOne({
          where: { id },
        });
      } else {
        const { user_id } = req.user;
        var transaction = await Transaction.findOne({
          where: { id, user_id },
        });
      }

      if (!transaction) {
        return res.status(404).json({
          status: false,
          message: "transaction not found",
        });
      }

      const deleteTransaction = await Transaction.destroy({
        where: { id },
      });

      if (!deleteTransaction) {
        return res.status(400).json({
          status: false,
          message: "failed delete transaction",
        });
      }

      const bookingDetail = await BookingDetail.findAll({
        where: { transaction_id: id },
      });

      bookingDetail.map(async (detail) => {
        const deleteFile = await BookingDetail.destroy({
          where: { id: detail.id },
        });
        if (deleteFile) {
          fs.unlinkSync(`./public/document/${detail.visa}`);
          fs.unlinkSync(`./public/document/${detail.passport}`);
          fs.unlinkSync(`./public/document/${detail.izin}`);
        }
      });

      return res.status(200).json({
        status: true,
        message: "success delete transaction",
      });
    } catch (err) {
      next(err);
    }
  },

  //only admin can get all transaction
  getAll: async (req, res, next) => {
    try {
      const transactions = await Transaction.findAll({
        order: [["createdAt", "DESC"]],
      });

      if (!transactions.length) {
        return res.status(200).json({
          status: false,
          message: "no transaction found",
          data: transactions,
        });
      }

      //get bookingdetail for each transaction and insert to transaction object
      const result = await Promise.all(
        transactions.map(async (transaction) => {
          const bookingDetail = await BookingDetail.findAll({
            where: { transaction_id: transaction.id },
          });
          transaction.dataValues.bookingDetail = bookingDetail;
          return transaction;
        })
      );

      return res.status(200).json({
        status: true,
        message: "success get all transactions",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
  uploadFile: async (req, res, next) => {
    try {
      const file = req.file.buffer.toString("base64");
      //filter only image and document
      if (
        req.file.mimetype !== "image/jpeg" &&
        req.file.mimetype !== "image/png" &&
        req.file.mimetype !== "application/pdf"
      ) {
        return res.status(400).json({
          status: false,
          message: "file type not supported",
        });
      }
      const uploadedFile = await imagekit.upload({
        file,
        fileName: req.file.originalname,
      });

      // return res.send(uploadedFile.url);
      return res.json({
        status: true,
        url: uploadedFile.url,
      });
    } catch (err) {
      next(err);
    }
  },
};
