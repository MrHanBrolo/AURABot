import { ButtonInteraction, Interaction, MessageActionRow, MessageButton, MessageEmbed} from "discord.js";
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
            content: 'Are you sure you want to ?',
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
                collection.forEach((click) => {
                })
                if (collection.first()?.customId === 'punish_yes'){
                    //ban the target user
                    const member = msgInt.options.getUser('user', true)

                    const rsnForKick = msgInt.options.getString('reason', false) as string

                    try {
                        await member.send(`You have been kicked from the test server because: ${rsnForKick}`)
                    } catch (err) {
                        console.log('User kicked but unable to DM')
                    }               

                        await msgInt.guild?.members.kick(member).then(async () =>{
                            const kicker = msgInt.user.tag
                            const punishedEmbed = new MessageEmbed()
                            .setColor('#76b900')
                            .setTitle('User was kicked')
                            .setAuthor(`${kicker}`)
                            .setDescription(`${member} was kicked from the server`)
                            .setTimestamp()
                            .setFooter('Remember to behave!')

                            if(rsnForKick){
                                punishedEmbed.addField('Reason for kicking', `${rsnForKick}`)
                                channel.send({embeds: [punishedEmbed]})
                            } else {
                                punishedEmbed.addField('Reason for kicking', 'No reason given')
                                channel.send({embeds: [punishedEmbed]})
                                }
                        })
                        msgInt.editReply({
                            content: 'Completed.',
                            components: []
                        })
                    }
                
                    else if (collection.first()?.customId === 'punish_no'){
                    msgInt.editReply({
                        content: 'Action cancelled',
                        components: []
                    })
                }
        }
    )}
} as ICommand