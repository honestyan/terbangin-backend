const { JWT_SIGNATURE_KEY } = process.env;
const { User, Admin } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  register: async (req, res, next) => {
    try {
      const { email, password, username, phone, name } = req.body;
      const existEmail = await User.findOne({ where: { email: email } });
      const existUsername = await User.findOne({
        where: { username: username },
      });
      const existPhone = await User.findOne({ where: { phone: phone } });

      if (existEmail) {
        return res.status(409).json({
          status: false,
          message: "email already used!",
        });
      }
      if (existUsername) {
        return res.status(409).json({
          status: false,
          message: "username already used!",
        });
      }
      if (existPhone) {
        return res.status(409).json({
          status: false,
          message: "phone already used!",
        });
      }

      const encryptedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        email,
        password: encryptedPassword,
        username,
        name,
        phone,
      });

      if (user) {
        return res.status(201).json({
          status: true,
          message: "success create user",
          data: {
            name: user.username,
            email: user.email,
          },
        });
      }
    } catch (err) {
      next(err);
    }
  },
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email: email } });

      if (!user) {
        return res.status(404).json({
          status: false,
          message: "email not found!",
        });
      }

      const passwordCheck = await bcrypt.compare(password, user.password);
      if (!passwordCheck) {
        return res.status(401).json({
          status: false,
          message: "wrong password!",
        });
      }

      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
          phone: user.phone,
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