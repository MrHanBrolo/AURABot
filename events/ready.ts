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
            testServers: ['939511826868219974'],
            botOwners: ['234885897743630336'],
            mongoUri: process.env.MONGO_URI
        })
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};