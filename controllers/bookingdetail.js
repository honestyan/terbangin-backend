const { BookingDetail, Transaction } = require("../models");
const storage = require("../utils/storage");

module.exports = {
  create: async (req, res, next) => {
    try {
      const file = req.files;
      const visa = file.visa[0].filename;
      const passport = file.passport[0].filename;
      const izin = file.izin[0].filename;
      const { transaction_id, passenger_name, seat } = req.body;
      if (
        !transaction_id ||
        !passenger_name ||
        !seat ||
        !visa ||
        !passport ||
        !izin
      ) {
        return res.status(400).json({
          status: false,
          message: "Please fill all the fields",
        });
      }

      const existTransaction = await Transaction.findOne({
        where: { id: transaction_id },
      });

      if (existTransaction.user_id != req.user.id) {
        storage.deleteFile(visa);
        storage.deleteFile(passport);
        storage.deleteFile(izin);
        return res.status(403).json({
          status: false,
          message: "you're not authorized!",
        });
      }

      const totalBookingDetail = await BookingDetail.count({
        where: { transaction_id },
      });

      if (totalBookingDetail >= existTransaction.pax) {
        storage.deleteFile(visa);
        storage.deleteFile(passport);
        storage.deleteFile(izin);
        return res.status(400).json({
          status: false,
          message: `you can only book ${existTransaction.pax} passengers`,
        });
      }

      const bookingdetail = await BookingDetail.create({
        transaction_id,
        passenger_name,
        seat,
        visa,
        passport,
        izin,
      });
      return res.status(200).json({
        status: true,
        message: "bookingdetail created",
        data: bookingdetail,
      });
    } catch (err) {
      next(err);
    }
  },
  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      const bookingdetail = await BookingDetail.findOne({
        where: { id },
      });
      if (!bookingdetail) {
        return res.status(404).json({
          status: false,
          message: "bookingdetail not found",
        });
      }
      if (bookingdetail.transaction.user_id != req.user.id) {
        return res.status(403).json({
          status: false,
          message: "you're not authorized!",
        });
      }
      const deleteBookingDetail = await BookingDetail.destroy({
        where: { id },
      });
      if (!deleteBookingDetail) {
        return res.status(400).json({
          status: false,
          message: "failed delete bookingdetail",
        });
      }
      storage.deleteFile(bookingdetail.visa);
      storage.deleteFile(bookingdetail.passport);
      storage.deleteFile(bookingdetail.izin);
      return res.status(200).json({
        status: true,
        message: "bookingdetail deleted",
      });
    } catch (err) {
      next(err);
    }
  },
};
