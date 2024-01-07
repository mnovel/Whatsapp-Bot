const qrcode = require("qrcode-terminal");
const { HandlerMassages } = require("./HandlerMassages");
const { Client, LocalAuth } = require("whatsapp-web.js");

const client = new Client({
  puppeteer: {
    executablePath:
      "/usr/bin/google-chrome",
  },
  ffmpegPath: "/usr/bin/ffmpeg",
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
  const currentTime = new Date().getTime();
  const messageTime = msg.timestamp * 1000; // Convert seconds to milliseconds

  // Set a threshold (e.g., skip messages older than 5 minutes)
  const threshold = 5 * 60 * 1000; // 5 minutes in milliseconds

  if (currentTime - messageTime > threshold) {
    console.log(`Skipped older message: ${msg.body}`);
    return;
  }
  await HandlerMassages(client, msg);
});
