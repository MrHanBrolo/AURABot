import { ButtonInteraction, Interaction, MessageActionRow, MessageButton, MessageEmbed, Permissions} from "discord.js";
import { ICommand } from "wokcommands";

export default {
    category: 'Testing',
    description: 'Testing',
    default_permission: ['ADMINISTRATOR'],
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
                            required: true,
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
                            name: 'reason',
                            description: 'Why you want to ban them (optionl, but recommended if its not an emergency).',
                            type: 3,
                            required: false,
                        }
                    ]
        }
    ],

    callback: async ({ interaction: msgInt, channel }) => {

             
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
                collection.forEach(() => {
                })
                if (collection.first()?.customId === 'punish_yes'){
                    // Check user perms
                    const punished = msgInt.options.getUser('user', true)
                    const rsn = msgInt.options.getString('reason', false) as string
                    const kicker = msgInt.user.tag

                    const punishedEmbed = new MessageEmbed()
                    .setColor('#76b900')
                    .setAuthor(`Action performed by: ${kicker}`)
                    .setTimestamp()
                    .setFooter('Remember to behave!')

                    //Kicks the target user
                    //Gets the user

                    switch(msgInt.options.getSubcommand()){
                    
                    case ('kick'):

                    //Tries to DM user and sends reason if provided - continues if not
                    try {
                        await punished.send(`You have been kicked from the test server because: ${rsn}`)
                    } catch (err) {
                        console.log('User kicked but unable to DM')
                    }               
                        //Waits for member kick then sends embed giving details
                        await msgInt.guild?.members.kick(punished).then(async () =>{
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
                        })
                        return

                        case('ban'):
                        try {
                            await punished.send(`You have been banned from the test server because: ${rsn}`)
                        } catch (err) {
                            console.log('User BANNED but unable to DM')
                        }               
                            //Waits for member kick then sends embed giving details
                            await msgInt.guild?.members.ban(punished).then(async () =>{
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
                            })

                                await  msgInt.editReply({
                                    content: 'Completed.',
                                    components: []
                                });

                            return

                    }
                }
                    // Cancel message if user chickens out
                    else if (collection.first()?.customId === 'punish_no'){
                    msgInt.editReply({
                        content: 'Action cancelled',
                        components: []
                    })
                }
        }
    )}
} as ICommand