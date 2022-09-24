import { EDTBot } from "./bot/EDTBot";
import dotenv from 'dotenv';
import { getNextCourse, getCoursesAt } from "./api/api"
import { Course } from "./course/Course"

//Loading environnement configuration
dotenv.config();

//Creating and launching the bot
let bot: EDTBot = new EDTBot(process.env.ALERT_CHANNEL_ID!);
bot.on("ready", () => {
    console.log("EDTBot is running!")
});
bot.login(process.env.BOT_TOKEN);

//Waiting for a command on the server specified by the environement
bot.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
  
    const { commandName } = interaction;

    if (commandName === "ping") {
      await interaction.reply("Pong!");
    }
    //Getting today's courses
    if (commandName === "aujd") {
        let aujd: Date = new Date();
        let optionValues: Array<string> = EDTBot.resolveInteractionOptions(interaction, [
            'Promotion',
            'Langue'
        ]);

        let courses: Array<Course> = getCoursesAt(optionValues, aujd);

        await interaction.reply(
            "Voici ton emploi du temps d'aujourd'hui !\n\n" +
            "📅  " + aujd.toLocaleDateString() + "\n" +
            courses.map(
                (course: Course) =>
                course.toString()
            )
        );
    }

    //Getting tomorrow's courses
    if(commandName === "demain") {
        let demain: Date = new Date();
        demain.setDate(demain.getDate() + 1);

        let optionValues: Array<string> = EDTBot.resolveInteractionOptions(interaction, [
            'Promotion',
            'Langue'
        ]);

        let courses: Array<Course> = getCoursesAt(optionValues, demain);

        await interaction.reply(
            "Voici ton emploi du temps de demain !\n\n" +
            "📅  " + demain.toLocaleDateString() + "\n" +
            courses.map(
                (course) =>
                course.toString()
            )
        );
    }

    //Getting next course
    if (commandName === "next") {
        let optionValues: Array<string> = EDTBot.resolveInteractionOptions(interaction, [
            'Promotion',
            'Langue'
        ]);
        let course: Course = getNextCourse(optionValues)!;

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
    }
});