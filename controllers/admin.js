const { Admin } = require("../models");
const { JWT_SIGNATURE_KEY, BASE_URL } = process.env;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  login: async (req, res, next) => {
    try {
      const { username, password } = req.body;

      const admin = await Admin.findOne({ where: { username } });
      if (!admin) {
        return res.status(401).json({
          status: false,
          message: "invalid credential",
        });
      }

      const isValid = await bcrypt.compare(password, admin.password);
      if (!isValid) {
        return res.status(401).json({
          status: false,
          message: "invalid credential",
        });
      }

      const token = jwt.sign(
        {
          id: admin.id,
          email: admin.email,
          username: admin.username,
        },
        JWT_SIGNATURE_KEY
      );

      return res.status(200).json({
        status: true,
        message: "success login",
        data: {
          token,
        },
      });
    } catch (err) {
      next(err);
    }
  },
};
