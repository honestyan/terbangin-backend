const { Product, Airport, Airplane, Airline } = require("../models");
const product = require("../models/product");

module.exports = {
  create: async (req, res, next) => {
    try {
      const {
        iata_from,
        iata_to,
        date_departure,
        date_arrival,
        est_time,
        price,
        gate,
        airplane_id,
      } = req.body;

      if (
        !iata_from ||
        !iata_to ||
        !date_departure ||
        !date_arrival ||
        !est_time ||
        !price ||
        !gate ||
        !airplane_id
      ) {
        return res.status(401).json({
          status: false,
          message: "All fields must be filled",
        });
      }

      const airportFrom = await Airport.findOne({
        where: { iata: iata_from },
      });
      const airportTo = await Airport.findOne({
        where: { iata: iata_to },
      });

      if (!airportFrom || !airportTo) {
        return res.status(401).json({
          status: false,
          message: "Airport not found",
        });
      }

      const airplane = await Airplane.findOne({
        where: { id: airplane_id },
      });

      const airline = await Airline.findOne({
        where: { id: airplane.airline_id },
      });

      if (!airplane || !airline) {
        return res.status(401).json({
          status: false,
          message: "Airplane or airline not found",
        });
      }

      let flightCode = `${airline.name.substring(0, 2)}-${Date.now()}`
        .toUpperCase()
        .substring(0, 13);

      //generate available seat based on total_seat_row as alphabet and total_seat_colum
      const availableSeat = [];
      for (let i = 0; i < airplane.total_seat_row; i++) {
        for (let j = 1; j <= airplane.total_seat_colum; j++) {
          availableSeat.push(`${String.fromCharCode(65 + i)}${j}`);
        }
      }

      const product = await Product.create({
        iata_from,
        iata_to,
        date_departure,
        date_arrival,
        est_time,
        price,
        gate,
        airplane_id,
        stock: airplane.capacity,
        flightCode,
        available_seat: availableSeat.join(","),
      });

      let productDetail = {
        airport_from: airportFrom.name,
        airport_to: airportTo.name,
        airplane: airplane.name,
        airline: airline.name,
      };

      product.dataValues.available_seat =
        product.dataValues.available_seat.split(",");

      const result = { ...product.dataValues, ...productDetail };

      return res.status(200).json({
        status: true,
        message: "Product created",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const {
        iata_from,
        iata_to,
        date_departure,
        date_arrival,
        est_time,
        price,
        gate,
        airplane_id,
        stock,
      } = req.body;

      if (
        !iata_from ||
        !iata_to ||
        !date_departure ||
        !date_arrival ||
        !est_time ||
        !price ||
        !gate ||
        !airplane_id
      ) {
        return res.status(401).json({
          status: false,
          message: "All fields must be filled",
        });
      }
      const product = await Product.update(
        {
          iata_from,
          iata_to,
          date_departure,
          date_arrival,
          est_time,
          price,
          gate,
          airplane_id,
          stock,
        },
        {
          where: { id },
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
        }
      );

      return res.status(200).json({
        status: true,
        message: "Product updated",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  delete: async (req, res, next) => {
    try {
      const { id } = req.params;

      const productCheck = await Product.findOne({
        where: { id },
      });

      if (!productCheck) {
        return res.status(401).json({
          status: false,
          message: "Product not found",
        });
      }

      const product = await Product.destroy({
        where: { id },
      });

      return res.status(200).json({
        status: true,
        message: "Product deleted",
        data: { id },
      });
    } catch (err) {
      next(err);
    }
  },

  getAll: async (req, res, next) => {
    try {
      const { iata_from, iata_to, date } = req.query;
      if (iata_from && iata_to && date) {
        var products = await Product.findAll({
          where: {
            iata_from,
            iata_to,
          },
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
          order: [
            ["date_departure", "ASC"],
            ["date_arrival", "ASC"],
          ],
        });

        //only show product that date_departure = date
        products = products.filter((product) => {
          return product.date_departure.toISOString().split("T")[0] === date;
        });
      } else {
        var products = await Product.findAll({
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
          order: [
            ["date_departure", "ASC"],
            ["date_arrival", "ASC"],
          ],
        });
      }

      if (products.length === 0) {
        return res.status(401).json({
          status: false,
          message: "Product not found",
        });
      }

      //pagination
      if (!req.query.page && !req.query.limit) {
        return res.status(200).json({
          status: true,
          message: "List of products",
          data: products,
        });
      }
      const { page, limit } = req.query;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      products = products.slice(startIndex, endIndex);

      products = products.map((product) => {
        product.dataValues.available_seat =
          product.dataValues.available_seat.split(",");
        return product;
      });

      return res.status(200).json({
        status: true,
        message: "List of products",
        data: products,
      });
    } catch (err) {
      next(err);
    }
  },

  getOne: async (req, res, next) => {
    try {
      const { id } = req.params;

      const product = await Product.findOne({
        where: { id },
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

      if (!product) {
        return res.status(401).json({
          status: false,
          message: "Product not found",
        });
      }

      const airportFrom = await Airport.findOne({
        where: { iata: product.iata_from },
      });
      const airportTo = await Airport.findOne({
        where: { iata: product.iata_to },
      });
      let airport = {
        airport_from: airportFrom.name,
        airport_to: airportTo.name,
        city_from: airportFrom.city,
        city_to: airportTo.city,
      };
      const result = { ...product.dataValues, ...airport };

      result.available_seat = result.available_seat.split(",");

      return res.status(200).json({
        status: true,
        message: "Product found",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },
};
