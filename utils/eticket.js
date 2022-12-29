let ejs = require("ejs");
let puppeteer = require("puppeteer");
const QRCode = require("qrcode");

module.exports = {
  generateQR: async (content) => {
    try {
      const qr = await QRCode.toDataURL(content);
      return qr;
    } catch (err) {
      return err;
    }
  },

  generatePDF: async (data) => {
    let qr = await module.exports.generateQR(data.QRcontent);

    const renderedData = await ejs.renderFile(
      `views/eticket/eticket.ejs`,
      { ...data, qr },
      {
        async: true,
      }
    );

    try {
      const browser = await puppeteer.launch({
        args: ["--no-sandbox"],
      });
      const page = await browser.newPage();
      await page.setContent(renderedData);
      const pdfFile = await page.pdf({
        format: "Letter",
        printBackground: true,
      });

      const download = Buffer.from(pdfFile, "base64");
      await browser.close();
      return download;
    } catch (err) {
      return err;
    }
  },
};
