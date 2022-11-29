const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const ejs = require("ejs");

const { GOOGLE_MAIL, GOOGLE_PASSWORD } = process.env;

module.exports = {
  sendEmail: async (to, subject, html) => {
    return new Promise(async (resolve, reject) => {
      try {
        const transport = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: GOOGLE_MAIL,
            pass: GOOGLE_PASSWORD,
          },
        });

        const mailOptions = {
          to,
          subject,
          html,
        };

        const response = await transport.sendMail(mailOptions);

        resolve(response);
      } catch (err) {
        reject(err);
      }
    });
  },

  getHtml: (filename, data) => {
    return new Promise((resolve, reject) => {
      const path = __dirname + "/../views/email/" + filename;
      ejs.renderFile(path, data, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  },
};
