const { Product, Airport } = require("../models");
const airline = require("./airline");

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

      console.log(
        airportFrom.name,
        airportTo.name,
        airplane.name,
        airline.name,
        airplane.capacity
      );

      const product = await Product.create({
        iata_from,
        iata_to,
        airport_from: airportFrom.name,
        airport_to: airportTo.name,
        date_departure,
        date_arrival,
        est_time,
        price,
        gate,
        airplane_id,
        airplane_name: airplane.name,
        airline_name: airline.name,
        stock: airplane.capacity,
      });

      return res.status(200).json({
        status: true,
        message: "Product created",
        data: product,
      });
    } catch (err) {
      next(err);
    }
  },
  update: async (req, res, next) => {
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

      const product = await Product.update({
        iata_from,
        iata_to,
        airport_from: airportFrom.name,
        airport_to: airportTo.name,
        date_departure,
        date_arrival,
        est_time,
        price,
        gate,
        airplane_id,
        airplane_name: airplane.name,
        airline_name: airline.name,
        stock: airplane.capacity,
      });

      return res.status(200).json({
        status: true,
        message: "Product updated",
        data: product,
      });
    } catch (err) {
      next(err);
    }
  },
  delete: async (req, res, next) => {
    try {
      const { id } = req.params;

      const product = await Product.destroy({
        where: { id },
      });

      return res.status(200).json({
        status: true,
        message: "Product deleted",
        data: product,
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

      return res.status(200).json({
        status: true,
        message: "Product found",
        data: product,
      });
    } catch (err) {
      next(err);
    }
  },
};
