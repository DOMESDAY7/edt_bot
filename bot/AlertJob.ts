import { CronJob } from "cron";
import DiscordJS from "discord.js";
import { EDTBot } from "./EDTBot";

export class AlertJob extends CronJob {
    alertChannelId: string;
    alertChannel: DiscordJS.Channel;
    alertOffset: Number;
    bot: EDTBot;
    courseFetchURL: String;

    constructor(channelId: string, offset: Number, alertBot: EDTBot, url: String) {
        super("* * * * * *", () => {
            if(this.alertChannel.type === DiscordJS.ChannelType.GuildText)
                this.alertChannel.send("");
        });

        this.bot = alertBot;
        this.courseFetchURL = url;
        this.alertChannelId = channelId;
        this.alertOffset = offset;
        this.alertChannel = this.bot.channels.cache.get(this.alertChannelId)!;
    }

    getNextAlertTime() {

    } 
}