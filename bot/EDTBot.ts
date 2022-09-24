import DiscordJS, { ChatInputCommandInteraction } from "discord.js";

export class EDTBot extends DiscordJS.Client {
  constructor(alert_id: String) {
    console.log("EDTBot starting...")

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

  static resolveInteractionOptions(interaction: ChatInputCommandInteraction, optionsToGet: Array<string>): Array<string> {
    let optionValues: Array<string> = new Array<string>();
    optionsToGet.forEach((opt) => {
      optionValues.push(interaction.options.getString(opt)!);
    })

    return optionValues;
  }
}

