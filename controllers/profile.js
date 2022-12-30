const { JWT_SIGNATURE_KEY, BASE_URL, BASE_URL_STAGE } = process.env;
const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userType = require("../utils/userType");
const utilEmail = require("../utils/email");

module.exports = {
  get: async (req, res, next) => {
    try {
      const user = await User.findOne({
        where: { id: req.user.id },
        attributes: {
          exclude: [
            "createdAt",
            "updatedAt",
            "password",
            "userType",
            "isActive",
          ],
        },
      });

      if (!user) {
        return res.status(401).json({
          status: false,
          message: "User not found",
        });
      }

      return res.status(200).json({
        status: true,
        message: "User found",
        data: user,
      });
    } catch (err) {
      next(err);
    }
  },
  update: async (req, res, next) => {
    try {
      const { name, email, phone, username } = req.body;

      if (!name || !email || !phone || !username) {
        return res.status(400).json({
          status: false,
          message: "All fields are required",
        });
      }

      const user = await User.update(
        {
          name,
          email,
          phone,
          username,
        },
        {
          where: { id: req.user.id },
        }
      );

      if (!user) {
        return res.status(401).json({
          status: false,
          message: "Failed update data",
        });
      }

      return res.status(200).json({
        status: true,
        message: "User updated",
      });
    } catch (err) {
      next(err);
    }
  },
};
