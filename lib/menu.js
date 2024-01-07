const fs = require("fs-extra");
const { prefix } = JSON.parse(fs.readFileSync("./settings/settings.json"));

exports.textMenu = (pushname) => {
  return `
Hi, ${pushname}! 👋️
Berikut adalah beberapa fitur yang ada pada bot ini!✨

Creator:
-❥ *${prefix}sticker*
-❥ *${prefix}stimg*
-❥ *${prefix}qrcreate*
-❥ *${prefix}qrread*

Downloader:
-❥ *${prefix}ig*
-❥ *${prefix}tt*
-❥ *${prefix}fb*
-❥ *${prefix}twt*
-❥ *${prefix}yt*

Random Images:
-❥ *${prefix}anime*
-❥ *${prefix}nsfw*
-❥ *${prefix}kpop*
-❥ *${prefix}memes*

Lain-lain:
-❥ *${prefix}nik*
-❥ *${prefix}gempa*

Tentang Bot:
-❥ *${prefix}botstat*
-❥ *${prefix}ownerbot*
-❥ *${prefix}join*

_-_-_-_-_-_-_-_-_-_-_-_-_-_

Owner Bot:
-❥ *${prefix}ban* - banned
-❥ *${prefix}bc* - promosi
-❥ *${prefix}leaveall* - keluar semua grup
-❥ *${prefix}clearall* - hapus semua chat

Hope you have a great day!✨`;
};

exports.textAdmin = () => {
  return `
⚠ [ *Admin Group Only* ] ⚠ 
Berikut adalah fitur admin grup yang ada pada bot ini!

-❥ *${prefix}add*
-❥ *${prefix}kick* @tag
-❥ *${prefix}promote* @tag
-❥ *${prefix}demote* @tag
-❥ *${prefix}mutegrup*
-❥ *${prefix}tagall*
-❥ *${prefix}setprofile*
-❥ *${prefix}del*
-❥ *${prefix}grouplink*
-❥ *${prefix}by*
-❥ *${prefix}revoke*

_-_-_-_-_-_-_-_-_-_-_-_-_-_

⚠ [ *Owner Group Only* ] ⚠
Berikut adalah fitur owner grup yang ada pada bot ini!
-❥ *${prefix}kickall*
*Owner Group adalah pembuat grup.*
`;
};
