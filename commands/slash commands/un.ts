import { ButtonInteraction, GuildMember, MessageActionRow, MessageButton, MessageEmbed} from "discord.js";
import { ICommand } from "wokcommands" 

export default {
    category: 'Testing',
    description: 'Testing',
    slash: true,
    testOnly: true,
    options: [
        {

                    name: 'ban',
                    description: 'Permanently ban a user from the server.',
                    type: 1,
                    options: [
                        {
                            name: 'user',
                            description: 'The user you want to ban.',
                            type: 6,
                            required: true,
                        },
                        {
                            name: 'reason',
                            description: 'Why you want to ban them.',
                            type: 3,
                            required: true,
                        }
                    ]
        },
        {
                    name: 'kick',
                    description: 'Kick a user from the server.',
                    type: 1,
                    options: [
                        {
                            name: 'user',
                            description: 'The user you want to ban.',
                            type: 6,
                            required: false,
                        },
                        {
                            name: 'reason',
                            description: 'Why you want to ban them.',
                            type: 3,
                            required: false,
                        }
                    ]
        },
        {
                    name: 'mute',
                    description: 'Assigns a muted role to the user.',
                    type: 1,
                    options: [
                        {
                            name: 'user',
                            description: 'The user you want to mute.',
                            type: 6,
                            required: true,
                        },
                        {
                            name: 'time',
                            description: 'How long you want to mute the user for.',
                            type: 3,
                            required: false,
                        },
                        {
                            name: 'reason',
                            description: 'Why you want to ban them (optionl, but recommended if its not an emergency).',
                            type: 3,
                            required: false,
                        }
                    ]
        }
    ],


    callback: async ({ interaction: msgInt, channel}) => {    
        const timeElapsed = Date.now()
        const unixTimestamp = Math.floor(new Date(timeElapsed).getTime()/1000);    
        const punishRow = new MessageActionRow()

            .addComponents(
                new MessageButton()
                    .setCustomId('punish_yes')
                    .setLabel('Confirm')
                    .setStyle('SUCCESS')
            )
            .addComponents(
                new MessageButton()
                    .setCustomId('punish_no')
                    .setLabel('Cancel')
                    .setStyle('DANGER')
            )
    
        await msgInt.reply({
            content: 'Are you sure?',
            components: [punishRow],
            ephemeral: true
            })
    
            const filter = (btnInt: ButtonInteraction) => {
                return msgInt.user.id === btnInt.user.id
            }
    
            const collector = channel.createMessageComponentCollector({
                filter,
                max: 1,
                time: 1000 * 15
            })
    
            collector.on('end', async (collection) => {
            try {
                if (collection.first()?.customId === 'punish_yes'){
                    // Member checks
                    const punished = msgInt.options.getMember('user', true) as GuildMember
                    const kicker = msgInt.user.tag
                    // reason checks
                    const rsn = msgInt.options.getString('reason', false) as string

                    // command checks
                    const punishment = msgInt.options.getSubcommand()
                    const time = msgInt.options.getString('time')

                    const punishedEmbed = new MessageEmbed()
                    .setColor('#76b900')
                    .setAuthor(`Action performed by: ${kicker}`)
                    .setTimestamp()
                    .setFooter('Remember to behave!')

                    //Checks if specified user is able to be punished and exists in the server
                    try { if(!punished.kickable || !punished.bannable){
                            throw `You can't ${punishment} this user!`} 
                            
                    switch(punishment){

        /////////////////////////////////////////////////////////////////////// KICK
    /////////////////////////////////////////////////////////////////////// KICK
        /////////////////////////////////////////////////////////////////////// KICK
                    
                    case ('mute'):
                    
                    // Check if user has role
                    if(!punished.roles.cache.some(role => role.name === 'muted')){
                        throw `already unmuted`
                    }

                    //Tries to DM user and sends reason if provided - continues if not
                        try {
                            await punished?.send('You have been unmuted from the test server.')
                        } catch (err) {
                            console.log('Unable to DM user reason.')
                        }               
                            //Waits for member kick then sends embed giving details


                        await msgInt.guild?.members.kick(punished!).then(async () =>{

                            punishedEmbed.setTitle('User was kicked')
                            punishedEmbed.setDescription(`${punished} was kicked from the server`)
                            //if a reason is included, else none
                            if(rsn){
                                punishedEmbed.addField('Reason for kicking', `${rsn}`)
                                channel.send({embeds: [punishedEmbed]})
                            } else {
                                punishedEmbed.addField('Reason for kicking', 'No reason given')
                                channel.send({embeds: [punishedEmbed]})
                                }

                                await  msgInt.editReply({
                                    content: 'Completed.',
                                    components: []
                                });
                                return
                        })
                        return

        /////////////////////////////////////////////////////////////////////// BAN
    /////////////////////////////////////////////////////////////////////// BAN
        /////////////////////////////////////////////////////////////////////// BAN
                       
                        case('ban'):     
                            //Waits for member kick then sends embed giving details
                            await msgInt.guild?.members.ban(punished!).then(async () =>{
                                punishedEmbed.setTitle('User was banned')
                                punishedEmbed.setDescription(`${punished} was banned from the server`)
                                //if a reason is included, else none
                                if(rsn){
                                    punishedEmbed.addField('Reason for Ban', `${rsn}`)
                                    channel.send({embeds: [punishedEmbed]})
                                } else {
                                    punishedEmbed.addField('Reason for Ban', 'No reason given')
                                    channel.send({embeds: [punishedEmbed]})
                                    }
                                
                                await punished?.send(`You have been banned from the test server because: ${rsn}`).catch()
                                    
                                await  msgInt.editReply({
                                    content: 'Completed.',
                                    components: []
                                });
                                return
                            })
                            return
                        }  
                        
/////////////////////////////////////////////////////////////////////// END OF SWITCH STATEMENT

        /////////////////////////////////////////////////////////////////////// ERROR CATCHING
    /////////////////////////////////////////////////////////////////////// ERROR CATCHING
        /////////////////////////////////////////////////////////////////////// ERROR CATCHING

                    }  catch (error) {

                        switch (error){
                        case `You can't ${punishment} this user!`:
                            msgInt.editReply({
                                content: `You can't ${punishment} this user!`,
                                components: []
                            });
                            break
                        
                        case `already ${punishment}ed`:
                            await  msgInt.editReply({
                                content: `${punished} is already muted.`,
                                components: []
                             });
                            break

                        case 'toolong':
                            await  msgInt.editReply({
                                content: 'Time must be less than 14 days. E.g. 3d, 1300m, 8h.',
                                components: []
                            });
                            break

                        case 'Invalid input':
                            await  msgInt.editReply({
                                content: 'Time must be specified as <number><d , m , h> OR <number>(will default to minutes).',
                                components: []
                            });
                            break
                    }
                }
/////////////////////////////////////////////////////////////////////// END OF COLLECTOR STATEMENT  


            //Cancel command if no
            } else if (collection.first()?.customId === 'punish_no'){
                    msgInt.editReply({
                        content: 'Action cancelled',
                        components: []
                    })
                
                }
            } catch (error) {
                if(error instanceof TypeError && error.name === "TypeError [COMMAND_INTERACTION_OPTION_EMPTY]"){
                    msgInt.editReply({
                        content: 'User is not in guild.',
                        components: []
                    })
                }
            } 
        })        
    }
} as ICommand