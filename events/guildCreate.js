    module.exports = {
        name: 'guildCreate',
        once: true,
        execute(client) {
            /* 
             * 
             * 
             * 
             *         UPDATES ROLE CACHE
             * 
             * 
             * 
             * 
            */
            
            

            /* 
             * 
             * 
             * 
             *          CREATES MUTED ROLE ON JOIN 
             * 
             * 
             * 
             * 
            */

            const muted = client.guild?.roles.cache.find(role => role.name === "muted");
            // Create role if muted doesn't exist
            if(!muted){
            client.guild?.roles.create({
                name: 'muted',
                color: '#8E8E8E',
                hoist: false,
                permissions: ['VIEW_CHANNEL'],
                position: 20,
                reason: 'Muted role did not exist.'
            })

        }

    },
};
