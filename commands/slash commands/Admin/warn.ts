import { MessageEmbed, TextChannel } from "discord.js"
import { ICommand } from "wokcommands"
import warnSchema from "../../../models/warn-schema"
import logSchema from "../../../models/logs-schema"
import userSchema from "../../../models/user-schema"
import guildSchema from "../../../models/guild-schema"

export default {
    category: 'Moderation',
    description: 'Warns a user',
    permissions: ['ADMINISTRATOR'],
    requireRoles: true,
    slash: true,
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

    callback: async ({ guild, channel, interaction: msgInt, member: staff, client }) => {
        const subCommand = msgInt.options.getSubcommand()
        const user = msgInt.options.getUser('user')
        const reason = msgInt.options.getString('reason')
        const id = msgInt.options.getString('id')
        let logChannel

        const warnEmbed = new MessageEmbed()
            .setColor("#FFFC1F")
            .setTimestamp()

        const allLogsSet = await logSchema.exists({
            guildId: guild ?.id,
            "logs.logName": "all"
        })

        console.log(allLogsSet)

        const logChannelExists = await logSchema.exists({
            guildId: guild ?.id,
            "logs.logName": "warns"
        })

        if (logChannelExists) {
            logChannel = await logSchema.findOne({
                guildId: guild ?.id,
                "logs.logName": "warns"
            })
        }

        const userExists = await userSchema.findOne(
            {
                guildId: guild ?.id,
                userId: user ?.id
            }
        )

        switch (subCommand) {
            case 'add':
                if (!userExists) {
                    await userSchema.create(
                        {
                            guild: guild ?.id,
                            userId: user ?.id,
                            warnings: []
                        }
                    )
                }

                await userSchema.updateOne(
                    {
                        guildId: guild ?.id,
                        userId: user ?.id
                    }, {
                        $inc:
                        {
                            warningAmount: 1
                        }
                    })

                await guildSchema.updateOne(
                    {
                        guildId: guild ?.id,
                    }, {
                        $inc:
                        {
                            casesMade: 1
                        }
                    })

                const warnID = await guildSchema.findOne(
                    {
                        guildId: guild ?.id,
                        userId: user ?.id
                            }).then(warn => warn.casesMade.toString())

                await warnSchema.create({
                    guildId: guild ?.id,
                    userId: user ?.id,
                    reason: reason,
                    staffId: staff ?.id,
                    caseId: warnID
                })

                let userInfo = await userSchema.findOne({
                    guildId: guild ?.id,
                    userId: user ?.id
                            }).then(info => info.warningAmount)

                warnEmbed.setDescription(`✅ ** Warning added to <@${user ?.id}> **`)
                    .setAuthor({ name: `Action performed by: ${msgInt.user.tag}` })
                    .addFields({ name: "Warns: ", value: `${userInfo}`, inline: true })
                    .setFooter({ text: `• ID: ${warnID}` })
                
                if (!logChannelExists) {
                    channel.send({ embeds: [warnEmbed] });
                    await msgInt.reply({
                        content: 'Warning added to user.',
                        ephemeral: true,
                        components: []
                    })

                } else {
                    for (let i = 0; i < logChannel.logs.length; i++) {
                        if (logChannel.logs[i].logName === "all") {
                            const channel = await client.channels.cache.get(logChannel.logs[i].channelId) as TextChannel
                            channel.send({ embeds: [warnEmbed] });
                            await msgInt.reply({
                                content: 'Warning added to user.',
                                ephemeral: true,
                                components: [],
                            })
                            return
                        } else {
                            if (logChannel.logs[i].logName === "warns") {
                                const channel = await client.channels.cache.get(logChannel.logs[i].channelId) as TextChannel
                                channel.send({ embeds: [warnEmbed] });
                                await msgInt.reply({
                                    content: 'Warning added to user.',
                                    ephemeral: true,
                                    components: [],
                                })
                                return
                            }
                        }
                    }
                }
                break

            case 'remove':
                const warnExists = await warnSchema.findOneAndDelete({
                    guildId: guild ?.id,
                    userId: user ?.id,
                    caseId: id
                })

                console.log(await userExists.populate("warnings"))

                if (!warnExists) {

                    warnEmbed.setDescription(`❌ ** This warning does not exist. **`)
                        .setFooter({ text: "Brought to you by AURABot" });

                    return {
                        custom: true,
                        embeds: [warnEmbed],
                    }

                } else {
                    await userSchema.updateOne(
                        {
                            guildId: guild ?.id,
                            userId: user ?.id
                        }, {
                            $inc:
                            {
                                warningAmount: -1
                            }
                        })

                    warnEmbed.setDescription(`✅ ** Warning removed from <@${user ?.id}> **`)
                        .setFooter({ text: "Brought to you by AURABot" });


                    if (!logChannelExists) {
                        channel.send({ embeds: [warnEmbed] });
                        await msgInt.reply({
                            content: 'Warning added to user.',
                            ephemeral: true,
                            components: []
                        })
                    } else {
                        for (let i = 0; i < logChannel.logs.length; i++) {
                            if (logChannel.logs[i].logName === "warns") {
                                const channel = await client.channels.cache.get(logChannel.logs[i].channelId) as TextChannel
                                await msgInt.reply({
                                    content: 'Warning removed from user.',
                                    ephemeral: true,
                                    components: [],
                                })
                                channel.send({ embeds: [warnEmbed] });
                            }
                        }
                    }
                }
        }
    }
} as ICommand