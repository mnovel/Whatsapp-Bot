const { igdl, ttdl, fbdown, twitter, youtube } = require("btch-downloader");
const dl = require("social_media_downloader");
const instagramDl = require("@sasmeee/igdl");

const instagram = async (url) =>
  new Promise(async (resolve, reject) => {
    await instagramDl(url)
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });

const tiktok = async (url) =>
  new Promise(async (resolve, reject) => {
    await ttdl(url)
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });

const facebook = async (url) =>
  new Promise(async (resolve, reject) => {
    await fbdown(url)
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });

const twitters = async (url) =>
  new Promise(async (resolve, reject) => {
    await twitter(url)
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });

const youtubes = async (url) =>
  new Promise(async (resolve, reject) => {
    await youtube(url)
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });

module.exports = {
  instagram,
  tiktok,
  facebook,
  twitters,
  youtubes,
};
