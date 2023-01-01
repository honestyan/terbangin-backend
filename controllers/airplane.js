const { Airplane } = require("../models");
const { Op } = require("sequelize");

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
      const { name, capacity, airline_id } = req.body;
      if (!name || !capacity || !airline_id) {
        return res.status(400).json({
          status: false,
          message: "Please fill all the fields",
        });
      }

      let total_seat_row = capacity / 6;
      let total_seat_column = capacity / total_seat_row;

      const airplane = await Airplane.create({
        name,
        capacity,
        airline_id,
        total_seat_row,
        total_seat_column,
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
  search: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || "";
      const offset = limit * page;

      const totalRows = await Airplane.count({
        where: {
          name: {
            [Op.like]: "%" + search + "%",
          },
        },
      });
      const totalPage = Math.ceil(totalRows / limit);
      const result = await Airplane.findAll({
        where: {
          name: {
            [Op.like]: "%" + search + "%",
          },
        },
        offset: offset,
        limit: limit,
        order: [["name", "DESC"]],
      });
      res.json({
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      });
    } catch (error) {
      next(error);
    }
  },
  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, capacity, airline_id } = req.body;
      if (!name || !capacity || !airline_id) {
        return res.status(400).json({
          status: false,
          message: "Please fill all the fields",
        });
      }

      let total_seat_row = capacity / 6;
      let total_seat_column = capacity / total_seat_row;

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
        total_seat_column,
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
