const { JWT_SIGNATURE_KEY, BASE_URL, BASE_URL_STAGE } = process.env;
const { User, Admin, Airport } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const googleOauth2 = require("../utils/google");
const userType = require("../utils/userType");
const utilEmail = require("../utils/email");

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
        userType: userType.basic,
        isActive: false,
      });

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          username: user.username,
          name: user.name,
          phone: user.phone,
          userType: user.userType,
          isActive: user.isActive,
        },
        JWT_SIGNATURE_KEY
      );

      let htmlEmail = await utilEmail.getHtml("reset-password.ejs", {
        name: user.name,
        link: `${BASE_URL_STAGE}/login?=${token}`,
      });

      const sendMail = await utilEmail.sendEmail(
        user.email,
        "Email Verification",
        htmlEmail
      );

      if (user) {
        return res.status(200).json({
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

  verify: async (req, res, next) => {
    try {
      const { token } = req.params;
      const decoded = jwt.verify(token, JWT_SIGNATURE_KEY);

      const user = await User.findOne({ where: { id: decoded.id } });

      if (user) {
        await User.update(
          { isActive: true },
          {
            where: {
              id: decoded.id,
            },
          }
        );

        return res.status(200).json({
          status: true,
          message: "success verify email",
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

      const activeCheck = await User.findOne({
        where: { email: email, isActive: true },
      });

      if (!activeCheck) {
        return res.status(401).json({
          status: false,
          message: "email not verified!",
        });
      }

      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
          phone: user.phone,
          userType: user.userType,
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

  google: async (req, res, next) => {
    try {
      const code = req.query.code;

      if (!code) {
        const url = googleOauth2.generateAuthURL();
        return res.redirect(url);
      }

      await googleOauth2.setCredentials(code);

      let { data } = await googleOauth2.getUserData();

      const userExist = await User.findOne({ where: { email: data.email } });

      if (!userExist) {
        userExist = await User.create({
          username: data.email.split("@")[0],
          email: data.email,
          name: data.name,
          userType: userType.google,
        });
      }

      const payload = {
        id: userExist.id,
        username: userExist.username,
        email: userExist.email,
        name: userExist.name,
        phone: userExist.phone,
        userType: userExist.userType,
      };
      const token = jwt.sign(payload, JWT_SIGNATURE_KEY);

      return res.status(200).json({
        status: true,
        message: "success",
        data: {
          user_id: userExist.id,
          token,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  changePassword: async (req, res, next) => {
    try {
      const { oldPassword, newPassword, confirmNewPassword } = req.body;
      const existUser = await User.findOne({ where: { id: req.user.id } });

      if (!existUser)
        return res
          .status(404)
          .json({ success: false, message: "User not found!" });

      const passwordCheck = await bcrypt.compare(
        oldPassword,
        existUser.password
      );
      if (!passwordCheck) {
        return res.status(400).json({
          status: false,
          message: "old password doesnt match!",
        });
      }
      if (newPassword !== confirmNewPassword) {
        return res.status(422).json({
          status: false,
          message: "new password and confirm new password doesnt match!",
        });
      }
      const encryptedPassword = await bcrypt.hash(newPassword, 10);
      const updatedUser = await User.update(
        { password: encryptedPassword },
        { where: { id: existUser.id } }
      );
      return res.status(200).json({
        status: true,
        message: "success",
        data: {
          id: existUser.id,
          email: existUser.email,
        },
      });
    } catch (err) {
      next(err);
    }
  },
  // forgotPassword: async(req,res, next)=>{
  //   try{
  //     const {email} = req.body;

  //     const user = await User.findOne({where : {email}})
  //     if (user) {
  //       const payload = { user_id: user.id };
  //       const token = jwt.sign(payload, JWT_SIGNATURE_KEY);
  //       const link = `http://localhost:3000/auth/reset-password?token=${token}`;
  //       htmlEmail = await utilEmail.getHtml('reset-password.ejs', { name: user.name, link: link });
  //       await utilEmail.sendEmail(user.email, 'Reset your password', htmlEmail);
  //     }
  //     return res.status(200).json({
  //       status: true,
  //       message: 'success',
  //       data: {
  //         id:user.id,
  //         email:user.email
  //       }
  //     });
  //   }catch(err){
  //     next(err);
  //   }
  // },
  //selain email, link tampilan reset password juga dikirim
  //di form reset, token dikirm lewat que
  forgotPasswordBE: async (req, res, next) => {
    try {
      const { email, linkreset } = req.body;
      const user = await User.findOne({ where: { email } });
      if (user) {
        const payload = { user_id: user.id };
        const token = jwt.sign(payload, JWT_SIGNATURE_KEY);
        const link = `${linkreset}?token=${token}`;
        htmlEmail = await utilEmail.getHtml("reset-password.ejs", {
          name: user.name,
          link: link,
        });
        await utilEmail.sendEmail(user.email, "Reset your password", htmlEmail);
      }
      return res.status(200).json({
        status: true,
        message: "success",
        data: {
          id: user.id,
          email: user.email,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  resetPassword: async (req, res, next) => {
    try {
      const { token } = req.query;
      const { new_password, confirm_new_password } = req.body;

      if (!token)
        return res
          .status(401)
          .json({ success: false, message: "token not found" });

      if (new_password != confirm_new_password)
        return res
          .status(401)
          .json({ success: false, message: "password doesn't match!" });

      const payload = jwt.verify(token, JWT_SIGNATURE_KEY);
      const encryptedPassword = await bcrypt.hash(new_password, 10);
      const user = await User.update(
        { password: encryptedPassword },
        { where: { id: payload.user_id } }
      );
      return res.status(200).json({
        status: true,
        message: "success",
        data: user,
      });
    } catch (err) {
      next(err);
    }
  },

  readProfile: async (req, res, next) => {
    try {
      const existUser = await User.findOne({ where: { id: req.user.id } });

      if (!existUser) {
        return res.status(404).json({
          success: false,
          message: "User not found!",
        });
      }

      return res.status(200).json({
        status: true,
        message: "read profile information success",
        data: existUser,
      });
    } catch (err) {
      next(err);
    }
  },

  updateProfile: async (req, res, next) => {
    try {
      const { newName, newPhone, newUserType } = req.body;
      const existUser = await User.findOne({ where: { id: req.user.id } });

      if (!existUser) {
        return res.status(404).json({
          success: false,
          message: "User not found!",
        });
      }

      const updatedUser = await User.update(
        {
          name: newName,
          phone: newPhone,
          userType: newUserType,
        },
        { where: { id: existUser.id } }
      );

      return res.status(200).json({
        status: true,
        message: "update profile information success",
        data: updatedUser,
      });
    } catch (err) {
      next(err);
    }
  },
};
