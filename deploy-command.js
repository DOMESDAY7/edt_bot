import { SlashCommandBuilder, Routes } from 'discord.js';
import { REST } from '@discordjs/rest';
import dotenv from "dotenv";

dotenv.config();

const commands = [
	new SlashCommandBuilder().setName('ping').setDescription('Answers with pong!'),
	new SlashCommandBuilder().setName('aujd').setDescription("Answers with your classes of today!")
	.addStringOption(option =>
		option.setName("langue")
		.setDescription("Groupe de langue à afficher.")
		.setRequired(false)
		.addChoices(
			{ name: 'A', value: '1' }, { name: 'B', value: '2' }, { name: 'C', value: '3' },
			{ name: 'D', value: '4' }, { name: 'E', value: '5' }, { name: 'F', value: '6' },
			{ name: 'G', value: '7' }, { name: 'H', value: '8' }, { name: 'I', value: '9' },
			{ name: 'J', value: '10' }, { name: 'K', value: '11' }
		)
	),
	new SlashCommandBuilder().setName('demain').setDescription("Answers with your classes of tomorrow!"),
	new SlashCommandBuilder().setName('next').setDescription("Answers with your next class!")
]
	.map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.ESIEEBG_ID), { body: commands })
	.then((data) => console.log(`Successfully registered ${data.length} application commands.`))
	.catch(console.error);