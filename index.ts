import DiscordJS, { Client, Intents, Interaction } from 'discord.js'
import WOKCommands from 'wokcommands'
import path from 'path'
import dotenv from 'dotenv'
dotenv.config()

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGES
    ]
    
})

client.on('ready', () => {
    new WOKCommands(client, {
      commandsDir: path.join(__dirname, 'commands/'),
      typeScript: true,
      testServers: ['889924333387005992']
    })
  })

client.login(process.env.TOKEN)