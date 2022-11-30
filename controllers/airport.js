const { Airport } = require("../models");

module.exports = {
  airport: async (req, res, next) => {
    try {
      const airports = await Airport.findAll();
      return res.status(200).json({
        status: true,
        message: "List of airports",
        data: airports,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Internal server error",
      });
    }
  },
};
