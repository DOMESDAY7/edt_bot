import DiscordJS from "discord.js";
import dotenv from "dotenv";
import { courseToString, getCoursesAt, getNextCourse } from "./api.js";
import { format, parseISO } from "date-fns";

// Minutes before class when the notification comes up
const NOTIF_OFFSET = 10;

// The channel to send the notifications to
let ALERT_CHANNEL;

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

  client.channels.fetch(process.env.ALERT_CHANNEL_ID)
    .then((channel) => ALERT_CHANNEL = channel)
    .then(() => {
      setInterval(() => {
        getNextCourse().then((cours) => {
          console.log(cours)
          if(cours == null)
            return;
          
          let notif_time = new Date(new Date().getTime() + NOTIF_OFFSET*60000);
          console.log("Compare : "+notif_time.getMinutes() +" et "+parseISO(cours.DTSTART).getMinutes());
  
          if(parseISO(cours.DTSTART).getHours() == notif_time.getHours()
          && parseISO(cours.DTSTART).getMinutes() == notif_time.getMinutes()){
  
              ALERT_CHANNEL.send("Prochain cours dans " + NOTIF_OFFSET + " minutes pour les @1l !" +
                  format(parseISO(cours.DTSTART), "HH:mm") +
                  " : **" +
                  cours.SUMMARY +
                  "** en *" +
                  cours.LOCATION +
                  "*.\n"
              )
          }
      })
    }, 6000)
    })


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
      interaction.reply(
        "Voici ton emploi du temps d'aujourd'hui !\n" +
          cours.map(
            (cours) =>
              courseToString(cours)
          )
      );
    });
  }
  // cours de demain
  if (commandName === "demain") {
    let demain = new Date();
    demain.setDate(demain.getDate() + 1);

    await getCoursesAt(demain).then((cours) => {
      interaction.reply(
        "Voici ton emploi du temps de demain !\n" +
          cours.map(
            (cours) =>
              courseToString(cours)
          )
      );
    });
  }
  // prochain cours
  if (commandName === "next") {
    await getNextCourse().then((cours) => {
        if(cours == null) {
            interaction.reply("Tu n'as plus cours aujourd'hui !")
        }
        else {
            interaction.reply(
                "Voici ton prochain cours !\n" +
                courseToString(cours)
            );}
      });
  }
});

client.login(process.env.BOT_TOKEN);
