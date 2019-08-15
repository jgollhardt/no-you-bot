const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const { Client, MessageEmbed } = require("discord.js");

const adapter = new FileSync("db.json");
const db = low(adapter);

const client = new Client();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", msg => {
  var nou = client.emojis.find(emoji => emoji.name == "ooookie");

  if (msg.content.includes(nou.id)) {
    const {
      author: { username }
    } = msg;

    db.defaultsDeep({ leaderboard: { [username]: { username, count: 0 } } })
      .get(`leaderboard.${username}`)
      .update("count", n => n + 1)
      .write();
  }

  if (msg.content === "!nou") {
    const embed = new MessageEmbed()
      .setTitle("Leaderboard")
      .setColor(0xf56ce3)
      .setThumbnail("https://i.imgur.com/eRGro1C.jpg")
      .setFooter(
        "Brought to you by the meme team",
        "https://i.imgur.com/eRGro1C.jpg"
      );

    // Leaderboard showing the top 3 memers
    db.get("leaderboard")
      .orderBy("count", "desc")
      .take(3)
      .value()
      .forEach(({ username, count }, idx) => {
        embed.addField(`${idx + 1}. ${username}`, `Memed **${count}** ${nou}`);
      });

    msg.channel.send(embed);
  }
});

client.login(process.env.TOKEN);
