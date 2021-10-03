
import WOKCommands from 'wokcommands'
import path from 'path'

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
        new WOKCommands(client, {
            commandsDir: path.join(__dirname, '../commands/'),
            typeScript: true,
            ignoreBots: true,
            testServers: ['889924333387005992'],
            mongoUri: process.env.MONGO_URI
          })
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};
