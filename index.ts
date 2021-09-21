import DiscordJS, { Client, Intents } from 'discord.js'
import dotenv from 'dotenv'

dotenv.config()

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
    
})

client.on('ready', ()=> {
    console.log('The bot is ready!')

})

client.on('messageCreate', (message) => {
    if(message.content === 'ping'){
        message.reply({
            content: 'pong!!!'
        })
    }
})

client.login(process.env.TOKEN)