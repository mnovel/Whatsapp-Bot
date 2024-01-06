const fs = require("fs-extra");
const { MessageMedia } = require("whatsapp-web.js");

const setting = JSON.parse(fs.readFileSync("./settings/settings.json"));

let { ownerNumber, groupLimit, memberLimit, prefix, apiNoBg } = setting;

const {
  menuId,
  anime,
  qrCode,
  gempa,
  sosmedDownloader,
} = require("./lib/index.js");

const { readQr } = require("./lib/qr.js");

const isUrl = (url) => {
  return url.match(
    new RegExp(
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi
    )
  );
};

const HandlerMassages = async (client, message) => {
  try {
    const {
      ack,
      author,
      broadcast,
      deviceType,
      duration,
      forwardingScore,
      from,
      fromMe,
      hasMedia,
      hasQuotedMsg,
      hasReaction,
      id,
      inviteV4,
      isEphemeral,
      isForwarded,
      isGif,
      isStarred,
      isStatus,
      links,
      location,
      mediaKey,
      mentionedIds,
      orderId,
      rawData,
      timestamp,
      to,
      token,
      type,
      vCards,
      caption,
      notifyName,
    } = message;
    let { body } = message;

    let command =
      type === "chat" && body.startsWith(prefix)
        ? body
        : ((type === "image" && caption) || (type === "video" && caption)) &&
          caption.startsWith(prefix)
        ? caption
        : "";

    command = body.slice(1).trim().split(/ +/).shift().toLowerCase();
    const args = body.trim().split(/ +/).slice(1);
    const url = args.length !== 0 ? args[0] : "";

    switch (command) {
      case "ping":
        message.reply("pong");
        break;

      case "menu":
        message.reply(menuId.textMenu(notifyName));
        break;
      case "menuAdmin":
        message.reply(menuId.textAdmin());
        break;

      // Creator
      case "sticker":
      case "stiker":
        if (
          hasMedia ||
          (hasQuotedMsg && (await message.getQuotedMessage()).hasMedia)
        ) {
          const getBodyImage = hasQuotedMsg
            ? await message.getQuotedMessage()
            : message;

          try {
            const media = await getBodyImage.downloadMedia();
            await client.sendMessage(from, media, {
              sendMediaAsSticker: true,
              stickerAuthor: "Muhamamd Novel",
              stickerName: "Pell Bot",
            });
          } catch (error) {
            console.error("Error generating sticker:", error.message);
            return message.reply("Terjadi kesalahan saat membuat stiker");
          }
        } else {
          message.reply(
            `Silahkan kirim atau reply gambar / video dengan caption ${prefix}stiker`
          );
        }
        break;
      case "stimg":
      case "stickertoimg":
        if (
          (await message.getQuotedMessage()).type == "sticker" &&
          hasQuotedMsg
        ) {
          const media = await (
            await message.getQuotedMessage()
          ).downloadMedia();
          await client.sendMessage(from, media);
        } else {
          message.reply(`Silahkan reply sticker dengan caption ${prefix}stimg`);
        }
        break;
      case "qrcreate":
        if (args.length === 0)
          return message.reply(
            `Silahkan kirim command ${prefix}qrcode create {size} {teks} untuk membuat qrcode\n\nKirim atau reply gambar qrcode dengan command ${prefix}qrcode read untuk membaca qrcode`
          );

        if (args[0] != null) {
          const size = parseInt(args[0]) || 300;
          const text = body
            .slice(`${prefix}${command} ${args[0]} `.length)
            .trim();
          try {
            const createQr = await qrCode.createQr(size, text);
            const media = MessageMedia.fromFilePath(createQr);
            client.sendMessage(from, media);
            fs.unlink(createQr);
          } catch (error) {
            message.reply("Terjadi kesalahan saat membuat qrcode");
            console.error("Error creating QR code:", error);
          }
        } else {
          return message.reply(
            `Silahkan kirim command ${prefix}qrcode create {size} {teks} untuk membuat qrcode\n\nKirim atau reply gambar qrcode dengan command ${prefix}qrcode read untuk membaca qrcode`
          );
        }
        break;
      case "qrread":
        if (
          hasMedia ||
          (hasQuotedMsg && (await message.getQuotedMessage()).hasMedia)
        ) {
          const getBodyImage = hasQuotedMsg
            ? await message.getQuotedMessage()
            : message;

          try {
            const timestamp = Date.now();
            const media = await getBodyImage.downloadMedia();
            const filePath = `./media/qr/${timestamp}.${media.mimetype.replace(
              "image/",
              ""
            )}`;

            await new Promise((resolve, reject) => {
              fs.writeFile(filePath, media.data, "base64", (err) => {
                if (err) reject(err);
                else resolve();
              });
            });

            const readQr = await qrCode.readQr(filePath);
            message.reply(readQr);
            fs.unlink(filePath);
          } catch (error) {
            console.error("Error reading qrcode:", error.message);
            return message.reply("Terjadi kesalahan saat membaca qrcode");
          }
        } else {
          message.reply(
            `Silahkan kirim command ${prefix}qrcode create {size} {teks} untuk membuat qrcode\n\nKirim atau reply gambar qrcode dengan command ${prefix}qrcode read untuk membaca qrcode`
          );
        }
        break;

      // Random Image
      case "anime":
        anime
          .category()
          .then((categories) => {
            if (args.length === 0) {
              const categoryList = categories
                .map((cat) => `- ${cat}`)
                .join("\n");
              return message.reply(
                `Silahkan kirim command ${prefix}anime {kategori}\n\nList kategori :\n${categoryList}`
              );
            }

            const requestedCategory = args[0].toLowerCase();
            if (!categories.includes(requestedCategory)) {
              return message.reply(
                "Kategori yang diminta tidak valid. Silahkan cek list kategori."
              );
            }

            anime
              .random(requestedCategory)
              .then(async (imageUrl) => {
                const media = await MessageMedia.fromUrl(imageUrl);
                await client.sendMessage(from, media);
              })
              .catch((error) => {
                console.error("Error fetching random image:", error.message);
                return message.reply(
                  "Terjadi kesalahan saat mengambil gambar anime."
                );
              });
          })
          .catch((error) => {
            console.error("Error fetching categories:", error.message);
            return message.reply(
              "Terjadi kesalahan saat mengambil list kategori anime."
            );
          });
        break;
      case "nsfw":
        if (args.length == 0)
          return message.reply(
            "Silahkan kirim command ${prefix}nsfw {kategori}\n\nList kategori :\n- waifu\n- neko\n- trap\n- blowjob"
          );
        const category = args[0];
        const getNsfw = await anime.nsfw(category);
        const media = await MessageMedia.fromUrl(getNsfw);
        client.sendMessage(from, media);
        break;
      case "gempa":
        try {
          const earthquakeData = await gempa.gempaterkini();

          if (earthquakeData && earthquakeData.length > 0) {
            for (const earthquake of earthquakeData) {
              const { Magnitude, Coordinates, Wilayah } = earthquake;
              const [latitude, longitude] = Coordinates.split(",");

              const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
              let message = "Informasi Gempa Terkini:\n\n";
              message += `Magnitude: ${Magnitude}\n`;
              message += `Wilayah: ${Wilayah}\n`;
              message += `Lokasi: ${Coordinates}\n`;
              message += `Google Maps: ${mapsUrl}\n\n`;
              client.sendMessage(from, message, {
                linkPreview: { includePreview: true },
              });
            }
          } else {
            client.sendMessage(from, "Tidak ada data gempa terkini.");
          }
        } catch (error) {
          console.error("Error fetching earthquake data:", error.message);
          client.sendMessage(
            from,
            "Terjadi kesalahan saat mengambil data gempa terkini."
          );
        }
        break;

      // Downloader
      case "ig":
        if (args.length == 0 || !isUrl(url))
          return message.reply(
            `Silahkan kirim command ${prefix}ig {url instagram}`
          );

        try {
          const instagram = await sosmedDownloader.instagram(url);
          message.reply("Sedang mengunduh kontent instagram");
          for (const media of instagram) {
            try {
              const linkIg = await MessageMedia.fromUrl(media.download_link, {
                unsafeMime: true,
              });
              await message.reply(linkIg);
            } catch (error) {
              console.error("Error in sending media message:", error);
              return message.reply(
                "Terjadi kesalahan saat mengirim konten instagram"
              );
            }
          }
        } catch (error) {
          console.error("Error fetching Instagram media:", error);
          return message.reply(
            "Terjadi kesalahan saat mengunduh konten Instagram"
          );
        }
        break;
      case "tt":
        if (args.length == 0 || !isUrl(url))
          return message.reply(
            `Silahkan kirim command ${prefix}tt {url tiktok}`
          );
        try {
          const tiktok = await sosmedDownloader.tiktok(url);
          message.reply("Sedang mengunduh kontent tiktok");

          for (const media of tiktok.video) {
            try {
              const linkVideoTt = await MessageMedia.fromUrl(media, {
                unsafeMime: true,
              });

              await message.reply(linkVideoTt, from, {
                caption: `Judul : ${tiktok.title}\nCreator : ${media.creator}`,
              });
            } catch (error) {
              console.error("Error in sending media message:", error);
              return message.reply(
                "Terjadi kesalahan saat mengirim konten tiktok"
              );
            }
          }

          try {
            const linkAudioTt = await MessageMedia.fromUrl(tiktok.audio[0], {
              filename: "audio.mp3",
              unsafeMime: true,
            });

            await message.reply(linkAudioTt, from, {
              sendAudioAsVoice: true,
              caption: `Judul Musik : ${tiktok.title_audio}`,
            });
          } catch (error) {
            console.error("Error in sending media message:", error);
            return message.reply(
              "Terjadi kesalahan saat mengirim konten tiktok"
            );
          }
        } catch (error) {
          console.error("Error fetching tiktok media:", error);
          return message.reply(
            "Terjadi kesalahan saat mengunduh konten tiktok"
          );
        }

        break;
      case "fb":
        if (args.length == 0 || !isUrl(url))
          return message.reply(
            `Silahkan kirim command ${prefix}fb {url facebook}`
          );
        const downloadFb = await sosmedDownloader.facebook(url);
        console.log(downloadFb);
        break;
      case "twt":
        if (args.length == 0 || !isUrl(url))
          return message.reply(
            `Silahkan kirim command ${prefix}twt {url twitter}`
          );
        try {
          const downloadTwt = await sosmedDownloader.twitters(url);
          console.log(downloadTwt.url);
          const hdTwt = await MessageMedia.fromUrl(downloadTwt.url[1].sd);
          await client.sendMessage(from, hdTwt, {
            caption: downloadTwt.tittle,
          });
        } catch (error) {
          console.error("Error in sending message:", error);
          return message.reply("Terjadi kesalahan saat mengirim media");
        }
        break;
      case "yt":
        if (args.length == 0 || !isUrl(url))
          return message.reply(
            `Silahkan kirim command ${prefix}yt {url youtube}`
          );
        const downloadYt = await sosmedDownloader.youtubes(url);
        console.log(downloadYt);
        break;
    }
  } catch (err) {
    console.log("Error => ", err);
  }
};

module.exports = {
  HandlerMassages,
};
