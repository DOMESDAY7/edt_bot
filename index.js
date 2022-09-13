import DiscordJS from "discord.js";
import dotenv from "dotenv";
import { getCoursesAt } from "./api.js";
import { getHours, format, parseISO } from "date-fns";

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
  // cours d'aujourd'hui
  if (commandName === "aujd") {
    await getCoursesAt(new Date()).then((cours) => {
      console.log(cours);
      interaction.reply(
        "Voici ton emploi du temps d'aujourd'hui !\n" +
          cours.map(
            (cours) =>
              format(parseISO(cours.DTSTART), "HH:mm") +
              " : **" +
              cours.SUMMARY +
              "** en *" +
              cours.LOCATION +
              "*.\n"
          )
      );
    });
  }
  // cours de demain
  if (commandName === "demain") {
    let demain = new Date();
    demain.setDate(demain.getDate() + 1);
    await getCoursesAt(demain).then((cours) => {
      console.log(cours);
      interaction.reply(
        "Voici ton emploi du temps de demain !\n" +
          cours.map(
            (cours) =>
              format(parseISO(cours.DTSTART), "HH:mm") +
              " : **" +
              cours.SUMMARY +
              "** en *" +
              cours.LOCATION +
              "*.\n"
          )
      );
    });
  }
  // prochain cours
  if (commandName === "next") {
    // on récupère l'heure actuelle
    let ajd = new Date();
    let heure_actu = getHours(ajd);

    // récupération des cours de la journée
    await interaction.reply(
      getCoursesAt(ajd).then((cours) => {
        // pour chaque cours on récupère l'heure de début
        for (let i = 0; i < cours; i++) {
          if (cours[i].DTSTART > heure_actu) {
            return `Le prochain cours est **${cours.SUMMARY}** en **${cours.LOCATION}**`;
          }
        }
      })
    );
  }
});

client.login(process.env.BOT_TOKEN);
