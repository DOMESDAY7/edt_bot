import DiscordJS from "discord.js";

const client = new DiscordJS.Client({

})

console.log("Starting...")

// on bot ready
client.on("ready",()=>{
    console.log("the bot is online")
})

client.on("messageCreate",(message)=>{
    const authorId = message.author.id;
    const authorName = message.author.username;
    console.log(`author name =${authorName}`)
    if(message.content == "hello"){
        message.reply({content:"world"})
    }
})
client.login(process.env.TOKEN);