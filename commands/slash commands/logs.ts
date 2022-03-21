import { ICommand } from 'wokcommands';
import logSchema from "../../models/logs-schema";
import { MessageActionRow, MessageButton, MessageComponentInteraction, MessageEmbed, MessageSelectMenu, TextChannel } from 'discord.js';
import { ChannelTypes } from 'discord.js/typings/enums';

export default {
    category: 'Moderation',
    description: 'Shows logs for a user',

    slash: true,
    testOnly: true,
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
                }
            ]
        }
    ],
    callback: async ({ interaction: msgInt, guild, channel, client }) => {
        //Options
        const channelSet = msgInt.options.getChannel('channel')

        console.log(channelSet)


        const options = msgInt.options.getSubcommand()

        //User info
        const modifier = msgInt.user.tag;

        // Await
        const embedChannel = await client.channels.cache.get(channelSet!.id) as TextChannel
        const settingsExists = await logSchema.exists({ guildId: guild ?.id })

        // Menus / Actions
        const logsRow = new MessageActionRow()

        const logsChannel = new MessageSelectMenu()

        const logsMenu = new MessageSelectMenu()
            .addOptions({
                "label": "Mute Logs",
                "value": "mutes",
                "description": "Logs for user mutes and unmutes"
            }, {
                    "label": "Warn Logs",
                    "value": "warns",
                    "description": "Logs for user warns and warn removes"
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

        if (!settingsExists) {
            await logSchema.create({
                guildId: guild ?.id,
                logs: []
            })
        }

        switch (options) {
            case 'channel':
                const filter = (btnInt: MessageComponentInteraction) => {
                    return msgInt.user.id === btnInt.user.id
                };

                //Menu collector for log selection
                const menuCollector = channel.createMessageComponentCollector({
                    componentType: "SELECT_MENU",
                    filter,
                    time: 1000 * 30,
                });

                await msgInt.reply({
                    content: 'Select logs to change channel for:',
                    components: [logsRow],
                    fetchReply: true,
                    ephemeral: true
                })

                menuCollector.on("end", async (collection) => {
                    try {
                        if (collection.first() ?.customId === "logs") {
                            let myValues = collection.first();
                            if (myValues ?.isSelectMenu()) {
                                for (let i = 0; i < myValues.values.length; i++) {
                                    switch (myValues.values[i]) {
                                        case 'warns':
                                            console.log("checking for warns")
                                            const warnsExist = await logSchema.exists({
                                                guildId: guild ?.id,
                                                "logs.logName": 'warns'
                                            })

                                            if (!warnsExist) {
                                                console.log('adding to set')
                                                await logSchema.updateOne({
                                                    guildId: guild ?.id,
                                                }, {
                                                        $addToSet:
                                                        {
                                                            logs: {
                                                                logName: 'warns',
                                                                channelId: channelSet!.id
                                                            }
                                                        }
                                                    })
                                            }

                                            else {

                                                const channelSame = await logSchema.findOne({
                                                    guildId: guild ?.id,
                                                    "logs.logName": 'warns',
                                                    "logs.channelId": channelSet!.id
                                                })

                                                if (channelSame.logs[0].channelId == channelSet!.id) {
                                                    throw 'already selected'
                                                }

                                                console.log('updating warn channel')
                                                await logSchema.updateOne(
                                                    {
                                                        guildId: guild ?.id,
                                                        "logs.logName": "warns"
                                                    }, {
                                                        $set:
                                                        {
                                                            "logs.$.channelId": channelSet!.id
                                                        }
                                                    })
                                            }

                                            confirmEmbed.addFields(
                                                {
                                                    name: `✅ Log channel(s) changed`,
                                                    value: `Set ${myValues.values[i]} logs to ${channelSet}`
                                                })

                                            await msgInt.editReply({
                                                content: 'Changed log(s) channel.',
                                                components: [],
                                            })
                                            embedChannel.send({ embeds: [confirmEmbed] });
                                            break

                                        case 'mutes':
                                            const mutesExist = await logSchema.exists({
                                                guildId: guild ?.id,
                                                "logs.logName": 'mutes'
                                            })

                                            if (!mutesExist) {
                                                console.log('adding to set')
                                                await logSchema.updateOne({
                                                    guildId: guild ?.id,
                                                }, {
                                                        $addToSet:
                                                        {
                                                            logs: {
                                                                logName: 'mutes',
                                                                channelId: channelSet!.id
                                                            }
                                                        }
                                                    })
                                            }

                                            else {
                                                const channelSame = await logSchema.findOne({
                                                    guildId: guild ?.id,
                                                    "logs.logName": 'mutes',
                                                    "logs.channelId": channelSet!.id
                                                })

                                                if (channelSame.logs[0].channelId == channelSet!.id) {
                                                    throw 'already selected'
                                                }

                                                await logSchema.updateOne(
                                                    {
                                                        guildId: guild ?.id,
                                                        "logs.logName": "mutes"
                                                    }, {
                                                        $set:
                                                        {
                                                            "logs.$.channelId": channelSet!.id
                                                        }
                                                    })
                                            }

                                            confirmEmbed.addFields(
                                                {
                                                    name: `✅ Log channel(s) changed`,
                                                    value: `Set ${myValues.values[i]} logs to ${channelSet}`
                                                })

                                            await msgInt.editReply({
                                                content: 'Changed log(s) channel.',
                                                components: [],
                                            })

                                            embedChannel.send({ embeds: [confirmEmbed] });
                                    }
                                }
                            }
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
    }
} as ICommand

