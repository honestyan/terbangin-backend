const { Airport } = require("../models");

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const airports = await Airport.findAll();
      return res.status(200).json({
        status: true,
        message: "List of airports",
        data: airports,
      });
    } catch (error) {
      next(err);
    }
  },
  getOne: async (req, res, next) => {
    try {
      const { id } = req.params;
      const airport = await Airport.findOne({
        where: { id },
      });
      if (!airport) {
        return res.status(401).json({
          status: false,
          message: "Airport not found",
        });
      }
      return res.status(200).json({
        status: true,
        message: "Airport found",
        data: airport,
      });
    } catch (err) {
      next(err);
    }
  },
  create: async (req, res, next) => {
    try {
      const { iata, name, city, country, latitude, longitude } = req.body;
      if (!iata || !name || !city || !country || !latitude || !longitude) {
        return res.status(400).json({
          status: false,
          message: "Please fill all the fields",
        });
      }
      const airport = await Airport.create({
        iata,
        name,
        city,
        country,
        latitude,
        longitude,
      });
      return res.status(200).json({
        status: true,
        message: "Airport created",
        data: airport,
      });
    } catch (err) {
      next(err);
    }
  },
  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { iata, name, city, country, latitude, longitude } = req.body;
      if (!iata || !name || !city || !country || !latitude || !longitude) {
        return res.status(400).json({
          status: false,
          message: "Please fill all the fields",
        });
      }
      const airport = await Airport.findByPk(id);
      if (!airport) {
        return res.status(404).json({
          status: false,
          message: "Airport not found",
        });
      }
      await airport.update({
        iata,
        name,
        city,
        country,
        latitude,
        longitude,
      });
      return res.status(200).json({
        status: true,
        message: "Airport updated",
        data: airport,
      });
    } catch (err) {
      next(err);
    }
  },
  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      const airport = await Airport.findByPk(id);
      if (!airport) {
        return res.status(404).json({
          status: false,
          message: "Airport not found",
        });
      }
      await airport.destroy();
      return res.status(200).json({
        status: true,
        message: "Airport deleted",
      });
    } catch (err) {
      next(err);
    }
  },
};
