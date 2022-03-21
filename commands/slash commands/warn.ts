import { MessageEmbed, TextChannel } from "discord.js"
import { ICommand } from "wokcommands"
import warnSchema from "../../models/warn-schema"
import logSchema from "../../models/logs-schema"

export default {
    category: 'Moderation',
    description: 'Warns a user',

    permissions: ['ADMINISTRATOR'],
    requireRoles: true,

    slash: true,

    testOnly: true,
    guildOnly: true,

    options: [
        {
            type: 'SUB_COMMAND',
            name: 'add',
            description: 'The user to add a warning to',
            options: [
                {
                    name: 'user',
                    type: 'USER',
                    description: 'The user you want to warn',
                    required: true
                },
                {
                    name: 'reason',
                    type: 'STRING',
                    description: 'The reason for the warning',
                    required: true,
                }
            ]
        },
        {
            type: 'SUB_COMMAND',
            name: 'remove',
            description: 'Remove a warning from a user',
            options: [
                {
                    name: 'user',
                    type: 'USER',
                    description: 'User you want to remove warning from',
                    required: true
                },
                {
                    name: 'id',
                    type: 'STRING',
                    description: 'ID of warning you want to remove',
                    required: true
                }

            ]
        }
    ],

    callback: async ({ guild, interaction: msgInt, member: staff, interaction, client }) => {
        const subCommand = interaction.options.getSubcommand()
        const user = interaction.options.getUser('user')
        const reason = interaction.options.getString('reason')
        const id = interaction.options.getString('id')
        const staffTag = msgInt.user.tag


        const warnEmbed = new MessageEmbed()
            .setColor("#FFFC1F")
            .setTimestamp()

        const userExists = await warnSchema.exists({
            guildId: guild ?.id,
            userId: user ?.id
        })

        const logChannel = await logSchema.findOne({
            guildId: guild ?.id,
        })

        const warnID = userExists ?._id.toString()

        switch (subCommand) {
            case 'add':
                if (!userExists) {
                    await warnSchema.create({
                        guildId: guild ?.id,
                        userId: user ?.id,
                        reason: reason,
                        staffId: staff ?.id
                })

                    warnEmbed.setDescription(`✅ ** Warning added to <@${user ?.id}> **`)
                        .setAuthor({ name: `ID: ${warnID}` })

                    for (let i = 0; i < logChannel.logs.length; i++) {
                        if (logChannel.logs[i].logName === "warns") {
                            const channel = await client.channels.cache.get(logChannel.logs[i].channelId) as TextChannel
                            channel.send({ embeds: [warnEmbed] });
                        }
                    }

                } else {
                    await warnSchema.create({
                        guildId: guild ?.id,
                        userId: user ?.id,
                        reason: reason,
                        staffId: staff ?.id
                })

                    warnEmbed.setDescription(`✅ ** Warning added to <@${user ?.id}> **`)
                        .setAuthor({ name: `ID: ${warnID}` })
                        .setFooter({ text: `Brought to you by AURABot | **ID: ${warnID}** ` });

                    for (let i = 0; i < logChannel.logs.length; i++) {
                        if (logChannel.logs[i].logName === "warns") {
                            const channel = await client.channels.cache.get(logChannel.logs[i].channelId) as TextChannel
                            channel.send({ embeds: [warnEmbed] });
                        }
                    }
                }
                break

            case 'remove':
                if (!userExists) {

                    warnEmbed.setDescription(`❌ ** User has no warnings. **`)
                        .setFooter({ text: "Brought to you by AURABot" });

                    return {
                        custom: true,
                        embeds: [warnEmbed],
                    }

                } else {
                    const warning = await warnSchema.exists(
                        {
                            _id: id,
                            guildId: guild ?.id,
                        })

                    if (warning) {
                        await warnSchema.findOneAndDelete({
                            _id: id,
                            guildId: guild ?.id
                    })
                    }

                    warnEmbed.setDescription(`✅ ** Warning removed from <@${user ?.id}> **`)
                        .setFooter({ text: "Brought to you by AURABot" });

                    for (let i = 0; i < logChannel.logs.length; i++) {
                        if (logChannel.logs[i].logName === "warns") {
                            const channel = await client.channels.cache.get(logChannel.logs[i].channelId) as TextChannel
                            channel.send({ embeds: [warnEmbed] });
                        }
                    }
                }


            // case 'list':
            //     let warningsList = await guildSchema.find({
            //         userId: user?.id,
            //         guildId: guild?.id,                })

            //     let description = `**For** <@${user?.id}>\n`


            //     for (const warn of warningsList){
            //         console.log(warn.warnings.length)
            //         for (let i = 0 ; i < warn.warnings.length; i++){                    
            //         description += `**ID:** ${warn.warnings[i]._id}\n`
            //         description += `**Date:** ${warn.createdAt.toLocaleString()}\n`
            //         description += `**Staff:** <@${warn.warnings[i].staffId}>\n`
            //         description += `**Reason:** ${warn.warnings[i].reason}\n\n`
            //         }
            //     }

            //     const embed = new MessageEmbed()
            //         .setDescription(description)
            //         .setColor('#FFE900')
            //         .setTitle(`Warnings List`)
            //         .setFooter({text: 'Brought to you by @AURABot!'})

            //     return embed   
        }
    }
} as ICommand