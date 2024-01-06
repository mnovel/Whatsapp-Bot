const axios = require("axios");

const api = "https://data.bmkg.go.id/DataMKG/TEWS/gempaterkini.json";

const gempaterkini = async () =>
  new Promise((resolve, reject) => {
    axios
      .get(api)
      .then((res) => {
        resolve(res.data.Infogempa.gempa);
      })
      .catch((err) => {
        reject(err);
      });
  });

module.exports = {
  gempaterkini,
};
