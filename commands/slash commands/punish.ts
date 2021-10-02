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

                    //IMPORTANT !!! //

                        // if(punished === null){
                        // throw 'User is not in server.'
                        //} 
                   
                    //Checks if specified user is able to be punished and exists in the server
                    try { if(!punished.kickable || !punished.bannable){
                            throw `You can't ${punishment} this user!`} 
                            
                    switch(punishment){

        /////////////////////////////////////////////////////////////////////// KICK
    /////////////////////////////////////////////////////////////////////// KICK
        /////////////////////////////////////////////////////////////////////// KICK
                    
                    case ('kick'):
                    
                    // Check if user is in server


                    //Tries to DM user and sends reason if provided - continues if not
                        try {
                            await punished?.send(`You have been kicked from the test server because: ${rsn}`)
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

        /////////////////////////////////////////////////////////////////////// MUTE  
    /////////////////////////////////////////////////////////////////////// MUTE
        /////////////////////////////////////////////////////////////////////// MUTE

                        case('mute'):
                        const muted = msgInt.guild?.roles.cache.find(role => role.name === "muted");

                        //Check user isn't muted already
                        if(punished.roles.cache.some(role => role.name === 'muted')){
                            throw `already ${punishment}ed`
                        }

                            try {
                                punishedEmbed.setTitle('You were muted')
                                punishedEmbed.setDescription(`You were muted on the server.`)
                                await punished?.send(({embeds: [punishedEmbed]}))
                            } catch (err) {
                                console.log('Unable to DM user reason.')
                            }         
                            
                            if(time){ 

                                const timed = time.toLowerCase()
                                const search = timed.match(/(\d+|[^\d]+)/g)
                                const newTimer = parseInt(search![0])

                                if(newTimer > 20160 && search![1] === 'm' || 
                                newTimer > 336 && search![1] === 'h' ||
                                newTimer > 14 && search![1] === 'd'){
                                    throw "toolong"
                                }

                                    //hours
                                if(search![1] === 'h'){
                                    const countDown = newTimer * 3600000
                                    const punishtime = unixTimestamp + countDown/1000

                                    await punished.roles.add(muted!.id).then(async () => {
                                        punishedEmbed.setTitle('User was muted')
                                        
                                        if(rsn){
                                            punishedEmbed.setDescription(`${punished} was muted on the server until <t:${punishtime}:f> because they were ${rsn}`)
                                            channel.send({embeds: [punishedEmbed]})
                                        } else {
                                            punishedEmbed.setDescription(`${punished} was muted until <t:${punishtime}:f> because ${kicker} said so.`)
                                            channel.send({embeds: [punishedEmbed]})
                                        }
                                        setTimeout(async () => {
                                            punished.roles.remove(muted!.id)
                                            punishedEmbed.setTimestamp()  
                                            try {
                                                punishedEmbed.setTitle('You were unmuted')
                                                punishedEmbed.setDescription(`You are no longer muted on the server.`)
                                                await punished?.send(({embeds: [punishedEmbed]}))
                                            } catch (err) {
                                                console.log('Unable to DM user reason.')
                                            } 
                                            punishedEmbed.setDescription(`${punished} has served their time and been unmuted.`)
                                            channel.send({embeds: [punishedEmbed]})
                                        }, countDown)
                                    
                                        await  msgInt.editReply({
                                            content: 'Completed.',
                                            components: []
                                        });
                                        return
                                    })
                                    return

                                    //Days
                                } if (search![1] === 'd'){
                                    const countDown = newTimer * 86400000
                                    const punishtime = unixTimestamp + countDown/1000

                                    await punished.roles.add(muted!.id).then(async () => {
                                        punishedEmbed.setTitle('User was muted')
                                        
                                        if(rsn){
                                            punishedEmbed.setDescription(`${punished} was muted on the server until <t:${punishtime}:f> because they were ${rsn}`)
                                            channel.send({embeds: [punishedEmbed]})
                                        } else {
                                            punishedEmbed.setDescription(`${punished} was muted until <t:${punishtime}:f> because ${kicker} said so.`)
                                            channel.send({embeds: [punishedEmbed]})
                                        }

                                        setTimeout(async () => {
                                            punished.roles.remove(muted!.id)
                                            punishedEmbed.setTimestamp()  
                                            try {
                                                punishedEmbed.setTitle('You were unmuted')
                                                punishedEmbed.setDescription(`You are no longer muted on the server.`)
                                                await punished?.send(({embeds: [punishedEmbed]}))
                                            } catch (err) {
                                                console.log('Unable to DM user reason.')
                                            }  
                                            punishedEmbed.setDescription(`${punished} has served their time and been unmuted.`)
                                            channel.send({embeds: [punishedEmbed]})
                                        }, countDown)
                                    
                                        await  msgInt.editReply({
                                            content: 'Completed.',
                                            components: []
                                        });
                                        return
                                    })
                                    return
                                
                                    //Minutes
                                } if (search![1] === 'm'){
                                    const countDown = newTimer * 60000
                                    const punishtime = unixTimestamp + countDown/1000

                                    await punished.roles.add(muted!.id).then(async () => {
                                        punishedEmbed.setTitle('User was muted')

                                    console.log('muted for minutes')
                                        
                                        if(rsn){
                                            punishedEmbed.setDescription(`${punished} was muted on the server until <t:${punishtime}:f> because they were ${rsn}`)
                                            channel.send({embeds: [punishedEmbed]})
                                        } else {
                                            punishedEmbed.setDescription(`${punished} was muted until <t:${punishtime}:f> because ${kicker} said so.`)
                                            channel.send({embeds: [punishedEmbed]})
                                        }
                                
                                        setTimeout(async() => {
                                            punished.roles.remove(muted!.id)
                                            punishedEmbed.setTimestamp()  
                                            try {
                                                punishedEmbed.setTitle('User has been unmuted')
                                                punishedEmbed.setDescription(`You are no longer muted on the server.`)
                                                await punished?.send(({embeds: [punishedEmbed]}))
                                            } catch (err) {
                                                console.log('Unable to DM user reason.')
                                            }  
                                            punishedEmbed.setDescription(`${punished} has served their time and been unmuted on <t:${punishtime}:f>.`)
                                            channel.send({embeds: [punishedEmbed]})
                                        }, countDown)
                                    
                                        await  msgInt.editReply({
                                            content: 'Completed.',
                                            components: []
                                        });
                                        return
                                    })
                                }
                            }
                            return

        /////////////////////////////////////////////////////////////////////// BAN
    /////////////////////////////////////////////////////////////////////// BAN
        /////////////////////////////////////////////////////////////////////// BAN
                       
                        case('ban'):
                            try {
                                await punished?.send(`You have been banned from the test server because: ${rsn}`)
                            } catch (err) {
                                console.log('User BANNED but unable to DM')
                            }               
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
                        if(error === `You can't ${punishment} this user!`){
                            msgInt.editReply({
                                content: `You can't ${punishment} this user!`,
                                components: []
                            })
                        }
                        if(error === `already ${punishment}ed`) {
                                await  msgInt.editReply({
                                    content: `${punished} is already muted.`,
                                    components: []
                                });
                        }

                        if (error === 'toolong'){   
                            await  msgInt.editReply({
                                content: 'Time must be less than 14 days. E.g. 3d, 1300m, 8h.',
                                components: []
                            });
                        }
                    }

                    //Cancel command if no
/////////////////////////////////////////////////////////////////////// END OF COLLECTOR STATEMENT  
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