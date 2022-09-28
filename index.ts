import { EDTBot } from "./bot/EDTBot";
import dotenv from 'dotenv';
import { getNextCourse, getCoursesAt } from "./api/api"
import { Course } from "./course/Course"
import { AlertJob } from "./bot/AlertJob";

//Loading environnement configuration
dotenv.config();

//Creating and launching the bot
let bot: EDTBot = new EDTBot();
bot.on("ready", () => {
    console.log("✔ EDTBot is running!");

    //Enabling the first Alert
    let firstAlertOptions: Map<string, string> = new Map();
    firstAlertOptions.set('Année', '3');
    firstAlertOptions.set('Promotion', 'I');
    firstAlertOptions.set('Langue', 'A');
    let alert: AlertJob = new AlertJob(process.env.ESIEEBG_ID!, process.env.ALERT_CHANNEL_ID!, 10, bot, firstAlertOptions);
    alert.toggleEnable();
    alert.setNextAlertTime();
});
bot.login(process.env.BOT_TOKEN);

//Waiting for a command on the server specified by the environement
bot.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
  
    const { commandName } = interaction;
    console.log("➡ Command received: " + commandName);

    if (commandName === "ping") {
      await interaction.reply("Pong!");
    }
    //Getting today's courses
    if (commandName === "aujd") {
        let aujd: Date = new Date();
        let optionValues: Map<string, string> = EDTBot.resolveInteractionOptions(interaction);

        getCoursesAt(optionValues, aujd).then((courses) => {
            interaction.reply(
                "Voici ton emploi du temps d'aujourd'hui !\n\n" +
                "📅  " + aujd.toLocaleDateString() + "\n" +
                courses.map(
                    (course: Course) =>
                    course.toString()
                )
            );
        })
    }

    //Getting tomorrow's courses
    if(commandName === "demain") {
        let demain: Date = new Date();
        demain.setDate(demain.getDate() + 1);

        let optionValues: Map<string, string> = EDTBot.resolveInteractionOptions(interaction);

        getCoursesAt(optionValues, demain).then((courses) => {
            interaction.reply(
                "Voici ton emploi du temps de demain !\n\n" +
                "📅  " + demain.toLocaleDateString() + "\n" +
                courses.map(
                    (course) =>
                    course.toString()
                )
            );
        });
    }

    //Getting next course
    if (commandName === "next") {
        let optionValues: Map<string, string> = EDTBot.resolveInteractionOptions(interaction);

        getNextCourse(optionValues).then((course) => {
            if(course == null) {
                interaction.reply("Tu n'as plus cours aujourd'hui ! 🍻")
            }
            else {
                interaction.reply(
                    "Voici ton prochain cours !\n\n" +
                    "📅  " + (new Date()).toLocaleDateString() + "\n" +
                    course.toString()
                );
            }
        });
    }
});