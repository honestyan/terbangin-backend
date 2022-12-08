const jwt = require("jsonwebtoken");
const { Admin, User } = require("../models");

const { JWT_SIGNATURE_KEY } = process.env;

module.exports = {
  mustLogin: async (req, res, next) => {
    try {
      const token = req.headers["authorization"];
      if (!token) {
        return res.status(401).json({
          status: false,
          message: "you're not authorized!",
          data: null,
        });
      }

      const decoded = jwt.verify(token, JWT_SIGNATURE_KEY);
      const existUser = await User.findOne({ where: { email: decoded.email } });

      if (!existUser) {
        return res.status(403).json({
          status: false,
          message: "you're not user !",
        });
      }

      req.user = decoded;
      next();
    } catch (err) {
      if (err.message == "jwt malformed") {
        return res.status(401).json({
          status: false,
          message: err.message,
          data: null,
        });
      }

      next(err);
    }
  },
  mustAdmin: async (req, res, next) => {
    try {
      const token = req.headers["authorization"];
      if (!token) {
        return res.status(401).json({
          status: false,
          message: "you're not authorized!",
          data: null,
        });
      }

      const decoded = jwt.verify(token, JWT_SIGNATURE_KEY);
      const existadmin = await Admin.findOne({
        where: { email: decoded.email },
      });

      if (!existadmin) {
        return res.status(403).json({
          status: false,
          message: "you're not admin !",
        });
      }

      req.admin = decoded;
      next();
    } catch (err) {
      if (err.message == "jwt malformed") {
        return res.status(401).json({
          status: false,
          message: err.message,
          data: null,
        });
      }

      next(err);
    }
  },
};
