const {
  Transaction,
  BookingDetail,
  Product,
  Airline,
  Airplane,
  Airport,
} = require("../models");
const eticket = require("../utils/eticket");
const moment = require("moment");
const imagekit = require("../utils/imagekit");

module.exports = {
  create: async (req, res, next) => {
    try {
      const { invoice } = req.params;
      const transaction = await Transaction.findOne({
        where: { payment_id: invoice },
      });

      if (!transaction) {
        return res.status(401).json({
          status: false,
          message: "Transaction not found",
        });
      }

      if (transaction.status !== "settlement") {
        return res.status(401).json({
          status: false,
          message: "Transaction not paid",
        });
      }

      //validation user
      if (transaction.user_id !== req.user.id) {
        return res.status(401).json({
          status: false,
          message: "You are not authorized to access this transaction",
        });
      }

      //get Product by product_id
      const product = await Product.findOne({
        where: { id: transaction.product_id },
        include: [
          {
            model: Airplane,
            as: "airplane",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
            include: [
              {
                model: Airline,
                as: "airline",
                attributes: {
                  exclude: ["createdAt", "updatedAt"],
                },
              },
            ],
          },
        ],
      });

      const bookingDetail = await BookingDetail.findAll({
        where: { transaction_id: transaction.id },
      });

      //get airport detail by iata_from,  iata_to
      const airportFrom = await Airport.findOne({
        where: { iata: product.iata_from },
      });

      const airportTo = await Airport.findOne({
        where: { iata: product.iata_to },
      });

      const airport = {
        from: airportFrom,
        to: airportTo,
      };

      let flightContent = `${transaction.payment_id}#${product.flightCode}#${product.airplane.name}`;
      let passengerContent = ``;
      bookingDetail.forEach((item) => {
        passengerContent += `|${item.title} ${item.passenger_name}#${item.nik}#${item.seat}`;
      });
      let QRcontent = `${flightContent}${passengerContent}`;

      //parsing date
      const departureDate = moment(product.date_departure)
        .locale("id")
        .format("Do MMMM YYYY");
      const departureTime = moment(product.date_departure)
        .tz("Etc/GMT")
        .format("HH:mm");
      const departureDay = moment(product.date_departure)
        .locale("id")
        .format("dddd");

      const arrivalDate = moment(product.date_arrival)
        .locale("id")
        .format("Do MMMM YYYY");
      const arrivalTime = moment(product.date_arrival)
        .tz("Etc/GMT")
        .format("HH:mm");
      const arrivalDay = moment(product.date_arrival)
        .locale("id")
        .format("dddd");

      const parsed = {
        departureDate,
        departureTime,
        departureDay,
        arrivalDate,
        arrivalTime,
        arrivalDay,
      };

      const data = {
        transaction,
        bookingDetail,
        product,
        QRcontent,
        parsed,
        airport,
      };

      if (transaction.eticket) {
        return res.json({
          status: true,
          url: transaction.eticket,
        });
      }

      const pdf = await eticket.generatePDF(data);

      if (!pdf) {
        return res.status(500).json({
          status: false,
          message: "Failed to generate PDF",
        });
      }

      const uploadedFile = await imagekit.upload({
        file: pdf,
        fileName: `e-ticket_${transaction.payment_id}.pdf`,
      });

      if (!uploadedFile) {
        return res.status(500).json({
          status: false,
          message: "Failed to upload PDF",
        });
      }

      const updated = await Transaction.update(
        { eticket: uploadedFile.url },
        { where: { id: transaction.id } }
      );

      if (!updated) {
        return res.status(500).json({
          status: false,
          message: "Failed to update transaction",
        });
      }

      return res.json({
        status: true,
        url: uploadedFile.url,
      });
    } catch (err) {
      next(err);
    }
  },

  scan: async (req, res, next) => {
    try {
      const { code } = req.body;
      let [flightDetail, ...passengers] = code.split("|");
      const [payment_id, flightCode, airplane_name] = flightDetail.split("#");
      let passengerObj = [];
      passengers = passengers.map((item) => {
        const [passenger, nik, seat] = item.split("#");
        const [title, passenger_name] = passenger.split(" ");
        passengerObj.push({
          title,
          passenger_name,
          nik,
          seat,
        });
      });

      const transaction = await Transaction.findOne({
        where: { payment_id },
        include: [
          {
            model: Product,
            as: "product",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
            include: [
              {
                model: Airplane,
                as: "airplane",
                attributes: {
                  exclude: ["createdAt", "updatedAt"],
                },
              },
            ],
          },
        ],
      });

      if (!transaction) {
        return res.status(401).json({
          status: false,
          message: "Transaction not found",
        });
      }

      if (transaction.status !== "settlement") {
        return res.status(401).json({
          status: false,
          message: "Transaction not paid",
        });
      }

      if (flightCode !== transaction.product.flightCode) {
        return res.status(401).json({
          status: false,
          message: "Flight code not match",
        });
      }

      if (airplane_name !== transaction.product.airplane.name) {
        return res.status(401).json({
          status: false,
          message: "Airplane name not match",
        });
      }

      const bookingDetail = await BookingDetail.findAll({
        where: { transaction_id: transaction.id },
      });

      if (bookingDetail.length !== passengerObj.length) {
        return res.status(401).json({
          status: false,
          message: "Passenger not match",
        });
      }

      bookingDetail.forEach((item, index) => {
        if (
          item.title !== passengerObj[index].title ||
          item.passenger_name !== passengerObj[index].passenger_name ||
          item.nik !== passengerObj[index].nik ||
          item.seat !== passengerObj[index].seat
        ) {
          return res.status(401).json({
            status: false,
            message: "Passenger not match",
          });
        }
      });

      //update isCheckIn in bookingdetail
      await BookingDetail.update(
        { isCheckIn: true },
        { where: { transaction_id: transaction.id } }
      );

      return res.status(200).json({
        status: true,
        message: "Check in success",
      });
    } catch (err) {
      next(err);
    }
  },
};
