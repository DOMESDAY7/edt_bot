import { SlashCommandBuilder, Routes } from 'discord.js';
import { REST } from '@discordjs/rest';
import dotenv from "dotenv";

dotenv.config();

const commands = [
	new SlashCommandBuilder().setName('ping').setDescription('Répond avec pong !'),
	new SlashCommandBuilder().setName('aujd').setDescription("Répond avec tes cours d'aujourd'hui !"),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.ESIEEBG_ID), { body: commands })
	.then((data) => console.log(`Successfully registered ${data.length} application commands.`))
	.catch(console.error);