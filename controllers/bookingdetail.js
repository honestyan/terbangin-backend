const { BookingDetail } = require("../models");

module.exports = {
  create: async (req, res, next) => {
    try {
      const file = req.files;
      const visa = file.visa[0].filename;
      const passport = file.passport[0].filename;
      const izin = file.izin[0].filename;
      console.log("ini dari multer : ".file)
      const {transaction_id, passenger_name, seat } = req.body;
      if (!transaction_id || !passenger_name || !seat || !visa || !passport || !izin) {
        return res.status(400).json({
          status: false,
          message: "Please fill all the fields",
        });
      }
      const bookingdetail = await BookingDetail.create({
        transaction_id,
        passenger_name,
        seat,
        visa,
        passport,
        izin
      });
      return res.status(200).json({
        status: true,
        message: "BookingDetail created",
        data: bookingdetail,
      });
    } catch (err) {
      next(err);
    }
  }
};
