"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logs_schema_1 = __importDefault(require("../../models/logs-schema"));
const discord_js_1 = require("discord.js");
exports.default = {
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
            channel_types: 0 /* GUILD_TEXT */,
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
    callback: ({ interaction: msgInt, guild, channel, client }) => __awaiter(void 0, void 0, void 0, function* () {
        //Options
        const channelSet = msgInt.options.getChannel('channel');
        console.log(channelSet);
        const options = msgInt.options.getSubcommand();
        //User info
        const modifier = msgInt.user.tag;
        // Await
        const embedChannel = yield client.channels.cache.get(channelSet.id);
        const settingsExists = yield logs_schema_1.default.exists({ guildId: guild === null || guild === void 0 ? void 0 : guild.id });
        // Menus / Actions
        const logsRow = new discord_js_1.MessageActionRow();
        const logsChannel = new discord_js_1.MessageSelectMenu();
        const logsMenu = new discord_js_1.MessageSelectMenu()
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
        const helpRowLogs = new discord_js_1.MessageActionRow().addComponents(new discord_js_1.MessageButton()
            .setLabel("View Wiki Page")
            .setStyle("LINK")
            .setURL("https://github.com/MrHanBrolo/AURABot/wiki/Tools#log-channels"));
        logsRow.addComponents(logsMenu);
        const confirmEmbed = new discord_js_1.MessageEmbed()
            .setColor("#2BDE1F")
            .setAuthor({ name: `Action performed by: ${modifier}` })
            .setTimestamp()
            .setFooter({ text: "Brought to you by AURABot" });
        if (!settingsExists) {
            yield logs_schema_1.default.create({
                guildId: guild === null || guild === void 0 ? void 0 : guild.id,
                logs: []
            });
        }
        switch (options) {
            case 'channel':
                const filter = (btnInt) => {
                    return msgInt.user.id === btnInt.user.id;
                };
                //Menu collector for log selection
                const menuCollector = channel.createMessageComponentCollector({
                    componentType: "SELECT_MENU",
                    filter,
                    time: 1000 * 30,
                });
                yield msgInt.reply({
                    content: 'Select logs to change channel for:',
                    components: [logsRow],
                    fetchReply: true,
                    ephemeral: true
                });
                menuCollector.on("end", (collection) => __awaiter(void 0, void 0, void 0, function* () {
                    var _a;
                    try {
                        if (((_a = collection.first()) === null || _a === void 0 ? void 0 : _a.customId) === "logs") {
                            let myValues = collection.first();
                            if (myValues === null || myValues === void 0 ? void 0 : myValues.isSelectMenu()) {
                                for (let i = 0; i < myValues.values.length; i++) {
                                    switch (myValues.values[i]) {
                                        case 'warns':
                                            console.log("checking for warns");
                                            const warnsExist = yield logs_schema_1.default.exists({
                                                guildId: guild === null || guild === void 0 ? void 0 : guild.id,
                                                "logs.logName": 'warns'
                                            });
                                            if (!warnsExist) {
                                                console.log('adding to set');
                                                yield logs_schema_1.default.updateOne({
                                                    guildId: guild === null || guild === void 0 ? void 0 : guild.id,
                                                }, {
                                                    $addToSet: {
                                                        logs: {
                                                            logName: 'warns',
                                                            channelId: channelSet.id
                                                        }
                                                    }
                                                });
                                            }
                                            else {
                                                const channelSame = yield logs_schema_1.default.findOne({
                                                    guildId: guild === null || guild === void 0 ? void 0 : guild.id,
                                                    "logs.logName": 'warns',
                                                    "logs.channelId": channelSet.id
                                                });
                                                if (channelSame.logs[0].channelId == channelSet.id) {
                                                    throw 'already selected';
                                                }
                                                console.log('updating warn channel');
                                                yield logs_schema_1.default.updateOne({
                                                    guildId: guild === null || guild === void 0 ? void 0 : guild.id,
                                                    "logs.logName": "warns"
                                                }, {
                                                    $set: {
                                                        "logs.$.channelId": channelSet.id
                                                    }
                                                });
                                            }
                                            confirmEmbed.addFields({
                                                name: `✅ Log channel(s) changed`,
                                                value: `Set ${myValues.values[i]} logs to ${channelSet}`
                                            });
                                            yield msgInt.editReply({
                                                content: 'Changed log(s) channel.',
                                                components: [],
                                            });
                                            embedChannel.send({ embeds: [confirmEmbed] });
                                            break;
                                        case 'mutes':
                                            const mutesExist = yield logs_schema_1.default.exists({
                                                guildId: guild === null || guild === void 0 ? void 0 : guild.id,
                                                "logs.logName": 'mutes'
                                            });
                                            if (!mutesExist) {
                                                console.log('adding to set');
                                                yield logs_schema_1.default.updateOne({
                                                    guildId: guild === null || guild === void 0 ? void 0 : guild.id,
                                                }, {
                                                    $addToSet: {
                                                        logs: {
                                                            logName: 'mutes',
                                                            channelId: channelSet.id
                                                        }
                                                    }
                                                });
                                            }
                                            else {
                                                const channelSame = yield logs_schema_1.default.findOne({
                                                    guildId: guild === null || guild === void 0 ? void 0 : guild.id,
                                                    "logs.logName": 'mutes',
                                                    "logs.channelId": channelSet.id
                                                });
                                                if (channelSame.logs[0].channelId == channelSet.id) {
                                                    throw 'already selected';
                                                }
                                                yield logs_schema_1.default.updateOne({
                                                    guildId: guild === null || guild === void 0 ? void 0 : guild.id,
                                                    "logs.logName": "mutes"
                                                }, {
                                                    $set: {
                                                        "logs.$.channelId": channelSet.id
                                                    }
                                                });
                                            }
                                            confirmEmbed.addFields({
                                                name: `✅ Log channel(s) changed`,
                                                value: `Set ${myValues.values[i]} logs to ${channelSet}`
                                            });
                                            yield msgInt.editReply({
                                                content: 'Changed log(s) channel.',
                                                components: [],
                                            });
                                            embedChannel.send({ embeds: [confirmEmbed] });
                                    }
                                }
                            }
                        }
                    }
                    catch (error) {
                        switch (error) {
                            case "already selected":
                                msgInt.editReply({
                                    content: "Channel logs already set to that channel.",
                                    components: [helpRowLogs]
                                });
                                break;
                        }
                    }
                }));
        }
    })
};
