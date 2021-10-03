import DiscordJS, {Intents} from 'discord.js'
import dotenv from 'dotenv'
dotenv.config()

const fs = require('fs');
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));


const BOT = new DiscordJS.Client({
  intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.DIRECT_MESSAGES,
      Intents.FLAGS.GUILD_MEMBERS
  ]    
})

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		BOT.once(event.name, (...args) => event.execute(...args));
	} else {
		BOT.on(event.name, (...args) => event.execute(...args));
	}
}

BOT.login(process.env.TOKEN)