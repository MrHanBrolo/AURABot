import guildSchema from "../models/guild-schema";

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
                    settings: [],
                    users: []
                })
        }

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
