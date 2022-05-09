import guildSchema from "../models/guild-schema";
import logSchema from "../models/logs-schema"

module.exports = {
    name: 'guildCreate',
    once: true,
    execute: async (guild) => {
        /* 
         * 
         * 
         * 
         *         ADD GUILD TO DB
         * 
         * 
         * 
         * 
        */
        console.log('Joined the server!')

        const { id, name } = guild

        const presence = await guildSchema.findOne({
            guildId: id as String,
        }).catch(() => false)

        if (!presence) {
            guildSchema.create(
                {
                    guildId: id,
                    guildName: name,
                    users: []
                })
        }

        /* 
         * 
         * 
         * 
         *          CREATE LOG SETTINGS
         * 
         * 
         * 
         * 
        */
        await logSchema.create({
            guildId: guild ?.id,
            logs: []
        })
        /* 
         * 
         * 
         * 
         *          CHECK FOR / CREATE MUTED ROLE
         * 
         * 
         * 
         * 
        */

        /* 
         * 
         * 
         * 
         *          ENUMERATE USERS AND ADD TO DB
         * 
         * 
         * 
         * 
        */

        // const list = client.guilds.cache.get(id); 
        // list.members.cache.forEach(member => console.log(member.user.username)); 
    }
};
