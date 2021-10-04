    module.exports = {
        name: 'guildCreate',
        once: true,
        execute(client) {
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
            
            

            /* 
             * 
             * 
             * 
             *          CREATE MUTED ROLE
             * 
             * 
             * 
             * 
            */

            // Check if role already exists
            const muted = client.guild?.roles.cache.find(role => role.name === "muted").then(() => {
                if(!muted){
                    console.log('Joined new guild, creating mute role...')
                    client.guild?.roles.create({
                        name: 'muted',
                        color: '#8E8E8E',
                        hoist: false,
                        permissions: ['VIEW_CHANNEL'],
                        position: 20,
                        reason: 'Muted role did not exist.'
                    })
                    console.log('Done...')
                }
            })
    }
};
