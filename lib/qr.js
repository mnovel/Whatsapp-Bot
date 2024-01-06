const fs = require("fs");
const qr = require("qr-image");
const jsQR = require("jsqr");
const getPixels = require("get-pixels");

const createQr = async (size, text) => {
  return new Promise((resolve, reject) => {
    const timestamp = Date.now();
    const outputFilePath = `./media/qr/${timestamp}.png`;
    const qrCode = qr.image(text, { type: "png", size: size });
    const outputStream = fs.createWriteStream(outputFilePath);

    qrCode.pipe(outputStream);

    outputStream.on("finish", () => {
      resolve(outputFilePath);
    });

    outputStream.on("error", (error) => {
      reject(error);
    });
  });
};

const readQr = (filePath) => {
  return new Promise((resolve, reject) => {
    getPixels(filePath, (err, pixels) => {
      if (err) {
        reject(err);
        return;
      }

      try {
        const code = jsQR(pixels.data, pixels.shape[0], pixels.shape[1], {
          inversionAttempts: "dontInvert",
        });

        if (code) {
          resolve(code.data);
        } else {
          reject(new Error("QR code not found"));
        }
      } catch (error) {
        reject(error);
      }
    });
  });
};

module.exports = {
  createQr,
  readQr,
};
