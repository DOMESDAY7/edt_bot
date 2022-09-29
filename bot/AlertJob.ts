import { CronJob, CronTime } from "cron";
import DiscordJS, { ChannelType, TextChannel } from "discord.js";
import { EDTBot } from "./EDTBot";
import { getNextCourse } from "../api/api";
import { Course } from "../course/Course";
import { compareAsc } from "date-fns";

export class AlertJob extends CronJob {
    //Discord server informations
    guildId: string;
    guild: DiscordJS.Guild | null;

    //Discord channel informations
    alertChannelId: string;
    alertChannel: DiscordJS.GuildBasedChannel |null;

    alertOffset: number;
    nextCourse: Course | null = null;
    bot: EDTBot;
    fetchOptions: Map<string, string>;
    status: boolean = false;

    constructor(guildAlert: string, channelId: string, offset: number, alertBot: EDTBot, opt: Map<string, string>) {
        super("* * * * * *", () => {
            //Send the alert to the channel
            if((this.guild != null && this.alertChannel != null) && this.alertChannel.isTextBased() && this.nextCourse != null) {
                let options: string = "";

                this.fetchOptions.forEach((opt: string) => {options += opt});

                this.alertChannel.send("Prochain cours dans " + this.alertOffset
                                        + " mins pour " + options + "\n"
                                        + this.nextCourse.toString());
            }

            //Schedule the next alert if alert is enabled
            if(this.status)
                this.setNextAlertTime();
        });

        this.guildId = guildAlert;
        this.bot = alertBot;
        this.fetchOptions = opt;
        this.alertChannelId = channelId;
        this.alertOffset = offset;

        this.guild = this.bot.guilds.resolve(this.guildId);

        if(this.guild != null)
            this.alertChannel = this.guild.channels.resolve(this.alertChannelId);
        else this.alertChannel = null;
        console.log("‼️ Alert created for channel: " + this.alertChannel?.name + " in server " + this.guild?.name);
    }

    toggleEnable() { this.status = !this.status; }

    setNextAlertTime() {
        if(!this.status) return;

        getNextCourse(this.fetchOptions).then((course) => {
            if(course === null) return;
            
            let nextAlertDate: Date = new Date(course?.getCourseStart()!);
            nextAlertDate.setMinutes(nextAlertDate.getMinutes() - this.alertOffset);

            if(compareAsc(nextAlertDate, new Date()) == -1) return;
            this.setTime(new CronTime(nextAlertDate));
            this.nextCourse = course;

            console.log("‼️ Next alert at " + nextAlertDate.toLocaleString() + " for channel " + this.alertChannel?.name + " in server " + this.guild?.name);
        })
    } 
}