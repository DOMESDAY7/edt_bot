import DiscordJS from "discord.js";
import dotenv from "dotenv";
import { getCoursesAt } from "./api.js";
import { format, parseISO } from "date-fns";

// Initialising environement configuration
// such as the bot token, the server id and client id
dotenv.config();

// Creating the Discord client with the corresponding intents
const client = new DiscordJS.Client({
  intents: [
    DiscordJS.GatewayIntentBits.Guilds,
    DiscordJS.GatewayIntentBits.GuildMessages,
    DiscordJS.GatewayIntentBits.MessageContent,
    DiscordJS.GatewayIntentBits.GuildMembers,
  ],
});

console.log("Starting...");

// Notifying when the bot is ready
client.on("ready", () => {
  console.log("🤖 The bot is online");
});

// Waiting for a command on the server specified by the environement
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === "ping") {
    await interaction.reply("Pong!");
  }
  if (commandName === "aujd") {
    await getCoursesAt(new Date()).then((cours) =>{
        console.log(cours)
        interaction.reply(
                "Voici ton emploi du temps d'aujourd'hui !\n" + cours.map((cours) => format(parseISO(cours.DTSTART), "HH:mm") + " : **" + cours.SUMMARY + "** en *" + cours.LOCATION + "*.\n")
        )
    })
  }
  if (commandName === "demain") {
    let demain = new Date();
    demain.setDate(demain.getDate() + 1)
    await getCoursesAt(demain).then((cours) =>{
        console.log(cours)
        interaction.reply(
                "Voici ton emploi du temps de demain !\n" + cours.map((cours) => format(parseISO(cours.DTSTART), "HH:mm") + " : **" + cours.SUMMARY + "** en *" + cours.LOCATION + "*.\n")
        )
    })
  }
});

client.login(process.env.BOT_TOKEN);
