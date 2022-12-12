const { Product, Airport, Airplane, Airline } = require("../models");

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
      });

      let productDetail = {
        airport_from: airportFrom.name,
        airport_to: airportTo.name,
        airplane: airplane.name,
        airline: airline.name,
      };

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
        }
      );

      let productDetail = {
        airport_from: airportFrom.name,
        airport_to: airportTo.name,
        airplane: airplane.name,
        airline: airline.name,
      };

      const result = { ...req.body, ...productDetail };

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
      const product = await Product.findAll();

      if (product.length === 0) {
        return res.status(401).json({
          status: false,
          message: "Product not found",
        });
      }

      for (let i = 0; i < product.length; i++) {
        const airportFrom = await Airport.findOne({
          where: { iata: product[i].iata_from },
        });
        const airportTo = await Airport.findOne({
          where: { iata: product[i].iata_to },
        });

        const airplane = await Airplane.findOne({
          where: { id: product[i].airplane_id },
        });

        const airline = await Airline.findOne({
          where: { id: airplane.airline_id },
        });

        let productDetail = {
          airport_from: airportFrom.name,
          airport_to: airportTo.name,
          airplane: airplane.name,
          airline: airline.name,
        };

        const result = { ...product[i].dataValues, ...productDetail };
        product[i] = result;
      }

      return res.status(200).json({
        status: true,
        message: "Product found",
        data: product,
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

      const airplane = await Airplane.findOne({
        where: { id: product.airplane_id },
      });

      const airline = await Airline.findOne({
        where: { id: airplane.airline_id },
      });

      let productDetail = {
        airport_from: airportFrom.name,
        airport_to: airportTo.name,
        airplane: airplane.name,
        airline: airline.name,
      };

      const result = { ...product.dataValues, ...productDetail };

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
