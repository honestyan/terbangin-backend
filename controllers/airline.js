const { Airline } = require("../models");

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const airlines = await Airline.findAll();
      return res.status(200).json({
        status: true,
        message: "List of airlines",
        data: airlines,
      });
    } catch (error) {
      next(err);
    }
  },
  getOne: async (req, res, next) => {
    try {
      const { id } = req.params;
      const airline = await Airline.findOne({
        where: { id },
      });
      if (!airline) {
        return res.status(401).json({
          status: false,
          message: "Airline not found",
        });
      }
      return res.status(200).json({
        status: true,
        message: "Airline found",
        data: airline,
      });
    } catch (err) {
      next(err);
    }
  },
  create: async (req, res, next) => {
    try {
      const { name, country, phone } = req.body;
      if (!name ||  !country || !phone ) {
        return res.status(400).json({
          status: false,
          message: "Please fill all the fields",
        });
      }
      const airline = await Airline.create({
        name, 
        country, 
        phone 
      });
      return res.status(200).json({
        status: true,
        message: "Airline created",
        data: airline,
      });
    } catch (err) {
      next(err);
    }
  },
  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const {name, country, phone } = req.body;
      if (!name ||  !country || !phone) {
        return res.status(400).json({
          status: false,
          message: "Please fill all the fields",
        });
      }
      const airline = await Airline.findByPk(id);
      if (!airline) {
        return res.status(404).json({
          status: false,
          message: "Airline not found",
        });
      }
      await airline.update({
        name, 
        country, 
        phone
      });
      return res.status(200).json({
        status: true,
        message: "Airline updated",
        data: airline,
      });
    } catch (err) {
      next(err);
    }
  },
  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      const airline = await Airline.findByPk(id);
      if (!airline) {
        return res.status(404).json({
          status: false,
          message: "Airline not found",
        });
      }
      await airline.destroy();
      return res.status(200).json({
        status: true,
        message: "Airline deleted",
      });
    } catch (err) {
      next(err);
    }
  },
};