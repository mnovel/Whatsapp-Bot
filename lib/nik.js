const { nikParser } = require("nik-parser");

const parseNIK = (nik) => {
  return new Promise((resolve, reject) => {
    try {
      const parsedNIK = nikParser(nik);
      resolve(parsedNIK);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  parseNIK,
};
