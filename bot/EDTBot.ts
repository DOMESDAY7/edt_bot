import DiscordJS, { ChatInputCommandInteraction } from "discord.js";

export class EDTBot extends DiscordJS.Client {
  constructor() {
    console.log("↻ EDTBot starting...")

    //Initializing Discord Bot Client
    super({
        intents: [
          DiscordJS.GatewayIntentBits.Guilds,
          DiscordJS.GatewayIntentBits.GuildMessages,
          DiscordJS.GatewayIntentBits.MessageContent,
          DiscordJS.GatewayIntentBits.GuildMembers,
        ],
      });
  }

  static resolveInteractionOptions(interaction: ChatInputCommandInteraction): Map<string, string> {
    let optionValues: Map<string, string> = new Map();

    for(let i: number = 0; i < interaction.options.data.length; i++) {
      let optionName: string = String(interaction.options.data[i]);
      optionValues.set(optionName, interaction.options.getString(optionName)!);
    }
    
    return optionValues;
  }
}

