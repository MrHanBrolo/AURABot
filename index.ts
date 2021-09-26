import DiscordJS, {Intents} from 'discord.js'
import { Guild } from 'discord.js'
import WOKCommands from 'wokcommands'
import path from 'path'
import dotenv from 'dotenv'
dotenv.config()

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS
    ]    
})

client.on('ready', () => {
client.guilds.cache.get('889924333387005992')
    new WOKCommands(client, {
      commandsDir: path.join(__dirname, 'commands/'),
      typeScript: true,
      ignoreBots: true,
      testServers: ['889924333387005992']
    })
  })


  client.on('guildMemberRemove', async member => {
    const fetchedLogs = await member.guild.fetchAuditLogs({
      limit: 1,
      type: 'MEMBER_KICK',
    });
  })

client.login(process.env.TOKEN)