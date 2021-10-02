import DiscordJS, {Intents} from 'discord.js'
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
    new WOKCommands(client, {
      commandsDir: path.join(__dirname, 'commands/'),
      typeScript: true,
      ignoreBots: true,
      testServers: ['889924333387005992'],
      mongoUri: process.env.MONGO_URI
    })
  })

  // client.on('guildCreate', () => {

    //const muted = msgInt.guild?.roles.cache.find(role => role.name === "muted");

    // Create role if muted doesn't exist
  //   if(!muted){
  //       await msgInt.guild?.roles.create({
  //           name: 'muted',
  //           color: '#8E8E8E',
  //           hoist: false,
  //           permissions: ['VIEW_CHANNEL'],
  //           position: 20,
  //           reason: 'Muted role did not exist.'
  //       })
  //     }
  //   })

client.login(process.env.TOKEN)