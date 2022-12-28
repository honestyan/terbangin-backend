let ejs = require("ejs");
let puppeteer = require("puppeteer");
const QRCode = require("qrcode");

module.exports = {
  generatePDF: async (data) => {
    let qr = await generateQR("https://www.google.com/");
    const renderedData = await ejs.renderFile(
      `views/${FILE_NAME}.ejs`,
      { ...DATA, qr },
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
      res.writeHead(200, {
        "Content-Disposition": `attachment; filename="${FILE_NAME}.pdf"`,
        "Content-Type": "application/pdf",
      });

      const download = Buffer.from(pdfFile, "base64");
      await browser.close();
      res.end(download);
    } catch (ex) {
      console.log(ex);
    }
  },
};
