const qrcode = require("qrcode-terminal");
const { HandlerMassages } = require("./HandlerMassages");
const { Client, LocalAuth } = require("whatsapp-web.js");

const client = new Client({
  puppeteer: {
    executablePath:
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  },
  ffmpegPath: "./ffmpeg/ffmpeg.exe",
  authStrategy: new LocalAuth({ clientId: "pell-bot", dataPath: "session" }),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.initialize();

client.on("message", async (msg) => {
  await HandlerMassages(client, msg);
});
