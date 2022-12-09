const { Airplane } = require("../models");

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const airplanes = await Airplane.findAll();
      return res.status(200).json({
        status: true,
        message: "List of airplanes",
        data: airplanes,
      });
    } catch (error) {
      next(err);
    }
  },
  getOne: async (req, res, next) => {
    try {
      const { id } = req.params;
      const airplane = await Airplane.findOne({
        where: { id },
      });
      if (!airplane) {
        return res.status(401).json({
          status: false,
          message: "Airplane not found",
        });
      }
      return res.status(200).json({
        status: true,
        message: "Airplane found",
        data: airplane,
      });
    } catch (err) {
      next(err);
    }
  },
  create: async (req, res, next) => {
    try {
      const { name, capacity, airline_id, total_seat_row, total_seat_colum  } = req.body;
      if (!name ||  !capacity || !airline_id || !total_seat_row || !total_seat_colum ) {
        return res.status(400).json({
          status: false,
          message: "Please fill all the fields",
        });
      }
      const airplane = await Airplane.create({
        name, 
        capacity, 
        airline_id, 
        total_seat_row, 
        total_seat_colum 
      });
      return res.status(200).json({
        status: true,
        message: "Airplane created",
        data: airplane,
      });
    } catch (err) {
      next(err);
    }
  },
  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const {name, capacity, airline_id, total_seat_row, total_seat_colum } = req.body;
      if (!name ||  !capacity || !airline_id || !total_seat_row || !total_seat_colum) {
        return res.status(400).json({
          status: false,
          message: "Please fill all the fields",
        });
      }
      const airplane = await Airplane.findByPk(id);
      if (!airplane) {
        return res.status(404).json({
          status: false,
          message: "Airplane not found",
        });
      }
      await airplane.update({
        name, 
        capacity, 
        airline_id, 
        total_seat_row, 
        total_seat_colum 
      });
      return res.status(200).json({
        status: true,
        message: "Airplane updated",
        data: airplane,
      });
    } catch (err) {
      next(err);
    }
  },
  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      const airplane = await Airplane.findByPk(id);
      if (!airplane) {
        return res.status(404).json({
          status: false,
          message: "Airplane not found",
        });
      }
      await airplane.destroy();
      return res.status(200).json({
        status: true,
        message: "Airplane deleted",
      });
    } catch (err) {
      next(err);
    }
  },
};
