const axios = require("axios");

const api = "https://nekos.best/api/v2/";

const random = async (category) =>
  new Promise((resolve, reject) => {
    axios
      .get(api + category)
      .then((res) => {
        resolve(res.data.results[0].url);
      })
      .catch((err) => {
        reject(err);
      });
  });

const category = async () =>
  new Promise((resolve, reject) => {
    axios
      .get(`${api}endpoints`)
      .then((res) => {
        const categories = Object.keys(res.data);
        resolve(categories);
      })
      .catch((error) => {
        console.error("Error fetching data:", error.message);
        reject(error);
      });
  });

const nsfw = async (category) =>
  new Promise((resolve, reject) => {
    axios
      .get(`https://api.waifu.pics/nsfw/${category}`)
      .then((res) => {
        resolve(res.data.url);
      })
      .catch((error) => {
        console.error("Error fetching data:", error.message);
        reject(error);
      });
  });

module.exports = {
  random,
  category,
  nsfw,
};
