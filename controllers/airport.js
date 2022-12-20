const { Airport } = require("../models");
const { Op } = require("sequelize");

module.exports = {
    getAll: async(req, res, next) => {
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
    getOne: async(req, res, next) => {
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
    create: async(req, res, next) => {
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

    search: async(req, res, next) => {
        try {
            const page = parseInt(req.query.page) || 0;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search || "";
            const offset = limit * page;

            const totalRows = await Airport.count({
                where: {
                    name: {
                        [Op.like]: "%" + search + "%",
                    },
                },
            });
            const totalPage = Math.ceil(totalRows / limit);
            const result = await Airport.findAll({
                where: {
                    name: {
                        [Op.like]: "%" + search + "%",
                    },
                },
                offset: offset,
                limit: limit,
                order: [
                    ["name", "DESC"]
                ],
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
    update: async(req, res, next) => {
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
    delete: async(req, res, next) => {
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