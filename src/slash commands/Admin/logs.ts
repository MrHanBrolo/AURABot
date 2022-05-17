import { ICommand } from 'wokcommands';
import logSchema from "../../models/logs-schema";
import {
    MessageActionRow,
    MessageButton,
    MessageComponentInteraction,
    MessageEmbed,
    MessageSelectMenu,
    TextChannel
} from 'discord.js';
import { ChannelTypes } from 'discord.js/typings/enums';
import warnSchema from '../../models/warn-schema';
import muteSchema from '../../models/mute-schema';
import guildSchema from '../../models/guild-schema';

export default {
    category: 'Moderation',
    description: 'Shows logs for a user',

    slash: true,
    guildOnly: true,
    options: [
        {
            name: "user",
            description: "Shows logs for a user",
            type: 1,
            options: [
                {
                    name: "user",
                    description: "User to pull logs for",
                    type: 6,
                    required: true,
                }
            ]
        },
        {
            name: "channel",
            description: "Sets a channel for the logs",
            type: 1,
            channel_types: ChannelTypes.GUILD_TEXT,
            options: [
                {
                    name: "channel",
                    description: "Channel you want logs to go to",
                    type: 7,
                    channel_types: [0],
                    required: true
                },
            ]
        },
        {
            name: "remove",
            description: "Removes channel settings for chosen logs",
            type: 1
        },
    ],
    callback: async ({ user, interaction: msgInt, guild, channel, client }) => {
        //Options
        const channelChosen = msgInt.options.getChannel("channel")

        const options = msgInt.options.getSubcommand()

        const userGet = msgInt.options.getUser("user")

        //User info
        const modifier = msgInt.user.tag;

        // Menus / Actions
        const logsRow = new MessageActionRow()
        const logsMenu = new MessageSelectMenu()
            .addOptions(
                {
                    "label": "All Logs",
                    "value": "all",
                    "description": "Set the channel for all logs to go to"
                },
                {
                    "label": "Ban Logs",
                    "value": "ban",
                    "description": "Logs for user bans and unbans"
                }, {
                    "label": "Mute Logs",
                    "value": "mute",
                    "description": "Logs for user mutes and unmutes"
                }
                , {
                    "label": "Kick Logs",
                    "value": "kick",
                    "description": "Logs for user kicks"
                }
                , {
                    "label": "Warn Logs",
                    "value": "warn",
                    "description": "Logs for user warns and warn removals"
                })
            .setCustomId("logs")
            .setPlaceholder("None Selected");


        const helpRowLogs = new MessageActionRow().addComponents(
            new MessageButton()
                .setLabel("View Wiki Page")
                .setStyle("LINK")
                .setURL("https://github.com/MrHanBrolo/AURABot/wiki/Tools#log-channels")
        );

        logsRow.addComponents(logsMenu)

        const confirmEmbed = new MessageEmbed()
            .setColor("#2BDE1F")
            .setAuthor({ name: `Action performed by: ${modifier}` })
            .setTimestamp()
            .setFooter({ text: "Brought to you by AURABot" });

        const filter = (btnInt: MessageComponentInteraction) => {
            return msgInt.user.id === btnInt.user.id
        };

        const menuLogChoice = channel.createMessageComponentCollector({
            componentType: "SELECT_MENU",
            filter,
            time: 1000 * 30,
            max: 1,
        });

        switch (options) {
            case 'channel':
                async function channelCheckAndSetOne(logType, logsName) {
                    await logSchema.exists(
                        { guildId: guild ?.id, "logs.logName": logType }
                    ).then(async result => {
                        try {
                            if (!result) {
                                await logSchema.findOneAndUpdate({
                                    guildId: guild ?.id,
                                }, {
                                        $addToSet:
                                        {
                                            logs: { logName: logType, channelId: channelChosen!.id }
                                        }
                                    })
                                confirmEmbed.addFields(
                                    {
                                        name: `✅ Log channel changed`,
                                        value: `Set ${logsName} logs to ${channelChosen}`
                                    })

                                await msgInt.editReply({
                                    content: 'Changed log channel.',
                                    components: [],
                                })
                                embedChannel.send({ embeds: [confirmEmbed] });

                            } else {
                                await logSchema.findOne(
                                    { guildId: guild ?.id, "logs.logName": logType }, { "logs.$": 1 }
                                ).then(async result => {
                                    try {
                                        if (result.logs[0].channelId === channelChosen ?.id) {
                                            throw "already selected"
                                        } else {
                                            await logSchema.updateOne(
                                                { guildId: guild ?.id, "logs.logName": logType },
                                                {
                                                    $set: { "logs.channelId": channelChosen ?.id }
                                                })
                                            confirmEmbed.addFields(
                                                {
                                                    name: `✅ Log channel changed`,
                                                    value: `Set ${logsName} logs to ${channelChosen}`
                                                })

                                            await msgInt.editReply({
                                                content: 'Changed log channel.',
                                                components: [],
                                            })
                                            embedChannel.send({ embeds: [confirmEmbed] });
                                        }
                                    } catch (error) {
                                        switch (error) {
                                            case "already selected":
                                                msgInt.editReply({
                                                    content: "Channel logs already set to that channel.",
                                                    components: [helpRowLogs]
                                                });
                                                break;
                                        }
                                    }
                                })
                            }
                        } catch (error) { console.log(error) }
                    })
                }

                // Await
                const embedChannel = await client.channels.cache.get(channelChosen!.id) as TextChannel

                await msgInt.reply({
                    content: 'Select logs to change channel for:',
                    components: [logsRow],
                    fetchReply: true,
                    ephemeral: true
                })
                menuLogChoice.on("end", async (collection) => {
                    if (collection.first() ?.customId === "logs") {
                        let selectedLogChoice = collection.first();
                        if (selectedLogChoice ?.isSelectMenu()) {
                            for (let i = 0; i < selectedLogChoice.values.length; i++) {
                                console.log(selectedLogChoice.values[i])
                                switch (selectedLogChoice.values[i]) {
                                    case 'all':
                                        channelCheckAndSetOne('all', selectedLogChoice.values[i])
                                        break
                                    case 'ban':
                                        channelCheckAndSetOne('ban', selectedLogChoice.values[i])
                                        break
                                    case 'mute':
                                        channelCheckAndSetOne('mute', selectedLogChoice.values[i])
                                        break
                                    case 'kick':
                                        channelCheckAndSetOne('kick', selectedLogChoice.values[i])
                                        break
                                    case 'warn':
                                        channelCheckAndSetOne('warn', selectedLogChoice.values[i])
                                        break
                                }
                            }
                        }
                    }
                })
                break

            case 'user':
                const UserWarns = await warnSchema.find({
                    guildId: guild ?.id,
                    userId: userGet ?.id
                })

                const UserMutes = await muteSchema.find({
                    guildId: guild ?.id,
                    userId: userGet ?.id
                })

                const caseID = await guildSchema.findOne({
                    guildId: guild ?.id,
                })

                const embeds: MessageEmbed[] = []
                const pages = {} as { [key: string]: number }

                embeds.push(new MessageEmbed().setDescription(`**Warnings for user ${userGet ?.tag}**`))
                for (let p = 0; p < UserWarns.length; p++) {
                    embeds[0]
                        .addFields(
                            {
                                name: `Case ${caseID.casesMade}`, value: `
                            **UserID:** ${userGet ?.id}
                            **Reason**: ${UserWarns[p].reason}
                            **Staff Member:** ${UserWarns[p].staffId}`
                            }
                        )

                    embeds.push(new MessageEmbed().setDescription(`**Mutes for user ${userGet ?.tag}**`))
                    for (let p = 0; p < UserMutes.length; p++) {
                        embeds[1]
                            .addFields(
                                {
                                    name: `Case ${UserMutes[p].Id}`, value: `
                                    **Type:** Warn
                                    **UserID:** ${userGet ?.id}
                                    **Reason**: ${UserMutes[p].reason}
                                    **Staff Member:** ${UserMutes[p].staffId}`
                                }
                            )
                        !UserMutes[p].reason ? embeds[1].addField(`Reason`, `No Reason Given.`) : embeds[1].addField(`Reason`, `${UserMutes[p].reason}`)
                    }

                    const getRow = (id: string) => {
                        const row = new MessageActionRow()

                        row.addComponents(
                            new MessageButton()
                                .setCustomId('back')
                                .setStyle('SECONDARY')
                                .setEmoji('⬅️')
                                .setDisabled(pages[id] === 0)
                        )

                        row.addComponents(
                            new MessageButton()
                                .setCustomId('forward')
                                .setStyle('SECONDARY')
                                .setEmoji('➡️')
                                .setDisabled(pages[id] === embeds.length - 1)
                        )
                        return row
                    }
                    const id = user.id

                    pages[id] = pages[id] || 0

                    const embed = embeds[pages[id]]
                    let collector

                    const filter2 = (i: MessageComponentInteraction) => i.user.id === user.id
                    const time = 1000 * 60 * 5

                    msgInt.reply({
                        embeds: [embed],
                        components: [getRow(id)]
                    })

                    collector = channel.createMessageComponentCollector({ filter: filter2, time })

                    collector.on('collect', (btnInt) => {
                        if (!btnInt) {
                            return
                        }
                        btnInt.deferUpdate()

                        if (
                            btnInt.customId !== 'back' &&
                            btnInt.customId !== 'forward'
                        ) {
                            return
                        }

                        if (btnInt.customId === 'back' && pages[id] > 0) {
                            --pages[id]
                        } else if (btnInt.customId === 'forward' && pages[id] < embeds.length - 1) {
                            ++pages[id]
                        }

                        msgInt.editReply({
                            embeds: [embeds[pages[id]]],
                            components: [getRow(id)]
                        })
                    })
                }
                break

            case 'remove':
                async function removeLogs(logType) {
                    await logSchema.exists(
                        { guildId: guild ?.id, "logs.logName": logType }
                    ).then(async result => {
                        console.log(result)
                        if (!result) {
                            return
                        } else {
                            await logSchema.updateOne(
                                { guildId: guild ?.id, "logs.logName": logType },
                                {
                                    $pull: { logs: { logName: logType } }
                                })
                            confirmEmbed.addFields(
                                {
                                    name: `✅ Log channel removed`,
                                    value: `Removed log channel preference for ${logType} logs.`
                                })
                            await msgInt.editReply({
                                content: 'Removed log channel preference.',
                                components: [],
                            })
                            channel.send({ embeds: [confirmEmbed] });
                        }
                    })
                }

                await msgInt.reply({
                    content: 'Select logs to change channel for:',
                    components: [logsRow],
                    fetchReply: true,
                    ephemeral: true
                })

                menuLogChoice.on("end", async (collection) => {
                    if (collection.first() ?.customId === "logs") {
                        let myValues = collection.first();
                        if (myValues ?.isSelectMenu()) {
                            for (let i = 0; i < myValues.values.length; i++) {
                                console.log(myValues.values[i])
                                switch (myValues.values[i]) {
                                    case 'all':
                                        removeLogs('all')
                                        break
                                    case 'ban':
                                        removeLogs('ban')
                                        break
                                    case 'mute':
                                        removeLogs('mute')
                                        break
                                    case 'kick':
                                        removeLogs('kick')
                                        break
                                    case 'warn':
                                        removeLogs('warn')
                                        break
                                }
                            }
                        }
                    }
                })
        }
    }
} as ICommand