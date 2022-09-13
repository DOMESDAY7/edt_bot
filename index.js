import DiscordJS from "discord.js";
import dotenv from "dotenv";
import getCoursesAt from "./api";
dotenv.config();

const client = new DiscordJS.Client({
  intents: [
    DiscordJS.GatewayIntentBits.Guilds,
    DiscordJS.GatewayIntentBits.GuildMessages,
    DiscordJS.GatewayIntentBits.MessageContent,
    DiscordJS.GatewayIntentBits.GuildMembers,
  ],
});

console.log("Starting...");

// on bot ready
client.on("ready", () => {
  console.log("🤖 The bot is online");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === "ping") {
    await interaction.reply("Pong!");
  }
  if (commandName === "aujd") {
    await interaction.reply("Tes cours d'aujourd'hui sont :\nBLABLABLA");
  }
  if (commandName === "!ajd") {
    await interaction.reply(
      "tes cours sont : " +
        getCoursesAt(new Date()).then((cours) =>
          cours.map((cours) => cours.SUMMARY + "en" + cours.LOCATION + "\n")
        )
    );
  }
});

client.login(process.env.BOT_TOKEN);
