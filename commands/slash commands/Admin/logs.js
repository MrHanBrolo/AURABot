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
const logs_schema_1 = __importDefault(require("../../../models/logs-schema"));
const discord_js_1 = require("discord.js");
const warn_schema_1 = __importDefault(require("../../../models/warn-schema"));
const mute_schema_1 = __importDefault(require("../../../models/mute-schema"));
const guild_schema_1 = __importDefault(require("../../../models/guild-schema"));
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
                },
            ]
        },
        {
            name: "remove",
            description: "Removes channel settings for chosen logs",
            type: 1
        },
    ],
    callback: ({ user, interaction: msgInt, guild, channel, client }) => __awaiter(void 0, void 0, void 0, function* () {
        //Options
        const channelChosen = msgInt.options.getChannel("channel");
        const options = msgInt.options.getSubcommand();
        const userGet = msgInt.options.getUser("user");
        //User info
        const modifier = msgInt.user.tag;
        // Menus / Actions
        const logsRow = new discord_js_1.MessageActionRow();
        const logsMenu = new discord_js_1.MessageSelectMenu()
            .addOptions({
            "label": "All Logs",
            "value": "all",
            "description": "Set the channel for all logs to go to"
        }, {
            "label": "Ban Logs",
            "value": "ban",
            "description": "Logs for user bans and unbans"
        }, {
            "label": "Mute Logs",
            "value": "mute",
            "description": "Logs for user mutes and unmutes"
        }, {
            "label": "Kick Logs",
            "value": "kick",
            "description": "Logs for user kicks"
        }, {
            "label": "Warn Logs",
            "value": "warn",
            "description": "Logs for user warns and warn removals"
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
        const filter = (btnInt) => {
            return msgInt.user.id === btnInt.user.id;
        };
        const menuLogChoice = channel.createMessageComponentCollector({
            componentType: "SELECT_MENU",
            filter,
            time: 1000 * 30,
            max: 1,
        });
        switch (options) {
            case 'channel':
                function channelCheckAndSetOne(logType, logsName) {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield logs_schema_1.default.exists({ guildId: guild === null || guild === void 0 ? void 0 : guild.id, "logs.logName": logType }).then((result) => __awaiter(this, void 0, void 0, function* () {
                            try {
                                if (!result) {
                                    yield logs_schema_1.default.findOneAndUpdate({
                                        guildId: guild === null || guild === void 0 ? void 0 : guild.id,
                                    }, {
                                        $addToSet: {
                                            logs: { logName: logType, channelId: channelChosen.id }
                                        }
                                    });
                                    confirmEmbed.addFields({
                                        name: `✅ Log channel changed`,
                                        value: `Set ${logsName} logs to ${channelChosen}`
                                    });
                                    yield msgInt.editReply({
                                        content: 'Changed log channel.',
                                        components: [],
                                    });
                                    embedChannel.send({ embeds: [confirmEmbed] });
                                }
                                else {
                                    yield logs_schema_1.default.findOne({ guildId: guild === null || guild === void 0 ? void 0 : guild.id, "logs.logName": logType }, { "logs.$": 1 }).then((result) => __awaiter(this, void 0, void 0, function* () {
                                        try {
                                            if (result.logs[0].channelId === (channelChosen === null || channelChosen === void 0 ? void 0 : channelChosen.id)) {
                                                throw "already selected";
                                            }
                                            else {
                                                yield logs_schema_1.default.updateOne({ guildId: guild === null || guild === void 0 ? void 0 : guild.id, "logs.logName": logType }, {
                                                    $set: { "logs.channelId": channelChosen === null || channelChosen === void 0 ? void 0 : channelChosen.id }
                                                });
                                                confirmEmbed.addFields({
                                                    name: `✅ Log channel changed`,
                                                    value: `Set ${logsName} logs to ${channelChosen}`
                                                });
                                                yield msgInt.editReply({
                                                    content: 'Changed log channel.',
                                                    components: [],
                                                });
                                                embedChannel.send({ embeds: [confirmEmbed] });
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
                            }
                            catch (error) {
                                console.log(error);
                            }
                        }));
                    });
                }
                // Await
                const embedChannel = yield client.channels.cache.get(channelChosen.id);
                yield msgInt.reply({
                    content: 'Select logs to change channel for:',
                    components: [logsRow],
                    fetchReply: true,
                    ephemeral: true
                });
                menuLogChoice.on("end", (collection) => __awaiter(void 0, void 0, void 0, function* () {
                    var _a;
                    if (((_a = collection.first()) === null || _a === void 0 ? void 0 : _a.customId) === "logs") {
                        let selectedLogChoice = collection.first();
                        if (selectedLogChoice === null || selectedLogChoice === void 0 ? void 0 : selectedLogChoice.isSelectMenu()) {
                            for (let i = 0; i < selectedLogChoice.values.length; i++) {
                                console.log(selectedLogChoice.values[i]);
                                switch (selectedLogChoice.values[i]) {
                                    case 'all':
                                        channelCheckAndSetOne('all', selectedLogChoice.values[i]);
                                        break;
                                    case 'ban':
                                        channelCheckAndSetOne('ban', selectedLogChoice.values[i]);
                                        break;
                                    case 'mute':
                                        channelCheckAndSetOne('mute', selectedLogChoice.values[i]);
                                        break;
                                    case 'kick':
                                        channelCheckAndSetOne('kick', selectedLogChoice.values[i]);
                                        break;
                                    case 'warn':
                                        channelCheckAndSetOne('warn', selectedLogChoice.values[i]);
                                        break;
                                }
                            }
                        }
                    }
                }));
                break;
            case 'user':
                const UserWarns = yield warn_schema_1.default.find({
                    guildId: guild === null || guild === void 0 ? void 0 : guild.id,
                    userId: userGet === null || userGet === void 0 ? void 0 : userGet.id
                });
                const UserMutes = yield mute_schema_1.default.find({
                    guildId: guild === null || guild === void 0 ? void 0 : guild.id,
                    userId: userGet === null || userGet === void 0 ? void 0 : userGet.id
                });
                const caseID = yield guild_schema_1.default.findOne({
                    guildId: guild === null || guild === void 0 ? void 0 : guild.id,
                });
                const embeds = [];
                const pages = {};
                embeds.push(new discord_js_1.MessageEmbed().setDescription(`**Warnings for user ${userGet === null || userGet === void 0 ? void 0 : userGet.tag}**`));
                for (let p = 0; p < UserWarns.length; p++) {
                    embeds[0]
                        .addFields({
                        name: `Case ${caseID.casesMade}`, value: `
                            **UserID:** ${userGet === null || userGet === void 0 ? void 0 : userGet.id}
                            **Reason**: ${UserWarns[p].reason}
                            **Staff Member:** ${UserWarns[p].staffId}`
                    });
                    embeds.push(new discord_js_1.MessageEmbed().setDescription(`**Mutes for user ${userGet === null || userGet === void 0 ? void 0 : userGet.tag}**`));
                    for (let p = 0; p < UserMutes.length; p++) {
                        embeds[1]
                            .addFields({
                            name: `Case ${UserMutes[p].Id}`, value: `
                                    **Type:** Warn
                                    **UserID:** ${userGet === null || userGet === void 0 ? void 0 : userGet.id}
                                    **Reason**: ${UserMutes[p].reason}
                                    **Staff Member:** ${UserMutes[p].staffId}`
                        });
                        !UserMutes[p].reason ? embeds[1].addField(`Reason`, `No Reason Given.`) : embeds[1].addField(`Reason`, `${UserMutes[p].reason}`);
                    }
                    const getRow = (id) => {
                        const row = new discord_js_1.MessageActionRow();
                        row.addComponents(new discord_js_1.MessageButton()
                            .setCustomId('back')
                            .setStyle('SECONDARY')
                            .setEmoji('⬅️')
                            .setDisabled(pages[id] === 0));
                        row.addComponents(new discord_js_1.MessageButton()
                            .setCustomId('forward')
                            .setStyle('SECONDARY')
                            .setEmoji('➡️')
                            .setDisabled(pages[id] === embeds.length - 1));
                        return row;
                    };
                    const id = user.id;
                    pages[id] = pages[id] || 0;
                    const embed = embeds[pages[id]];
                    let collector;
                    const filter2 = (i) => i.user.id === user.id;
                    const time = 1000 * 60 * 5;
                    msgInt.reply({
                        embeds: [embed],
                        components: [getRow(id)]
                    });
                    collector = channel.createMessageComponentCollector({ filter: filter2, time });
                    collector.on('collect', (btnInt) => {
                        if (!btnInt) {
                            return;
                        }
                        btnInt.deferUpdate();
                        if (btnInt.customId !== 'back' &&
                            btnInt.customId !== 'forward') {
                            return;
                        }
                        if (btnInt.customId === 'back' && pages[id] > 0) {
                            --pages[id];
                        }
                        else if (btnInt.customId === 'forward' && pages[id] < embeds.length - 1) {
                            ++pages[id];
                        }
                        msgInt.editReply({
                            embeds: [embeds[pages[id]]],
                            components: [getRow(id)]
                        });
                    });
                }
                break;
            case 'remove':
                function removeLogs(logType) {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield logs_schema_1.default.exists({ guildId: guild === null || guild === void 0 ? void 0 : guild.id, "logs.logName": logType }).then((result) => __awaiter(this, void 0, void 0, function* () {
                            console.log(result);
                            if (!result) {
                                return;
                            }
                            else {
                                yield logs_schema_1.default.updateOne({ guildId: guild === null || guild === void 0 ? void 0 : guild.id, "logs.logName": logType }, {
                                    $pull: { logs: { logName: logType } }
                                });
                                confirmEmbed.addFields({
                                    name: `✅ Log channel removed`,
                                    value: `Removed log channel preference for ${logType} logs.`
                                });
                                yield msgInt.editReply({
                                    content: 'Removed log channel preference.',
                                    components: [],
                                });
                                channel.send({ embeds: [confirmEmbed] });
                            }
                        }));
                    });
                }
                yield msgInt.reply({
                    content: 'Select logs to change channel for:',
                    components: [logsRow],
                    fetchReply: true,
                    ephemeral: true
                });
                menuLogChoice.on("end", (collection) => __awaiter(void 0, void 0, void 0, function* () {
                    var _b;
                    if (((_b = collection.first()) === null || _b === void 0 ? void 0 : _b.customId) === "logs") {
                        let myValues = collection.first();
                        if (myValues === null || myValues === void 0 ? void 0 : myValues.isSelectMenu()) {
                            for (let i = 0; i < myValues.values.length; i++) {
                                console.log(myValues.values[i]);
                                switch (myValues.values[i]) {
                                    case 'all':
                                        removeLogs('all');
                                        break;
                                    case 'ban':
                                        removeLogs('ban');
                                        break;
                                    case 'mute':
                                        removeLogs('mute');
                                        break;
                                    case 'kick':
                                        removeLogs('kick');
                                        break;
                                    case 'warn':
                                        removeLogs('warn');
                                        break;
                                }
                            }
                        }
                    }
                }));
        }
    })
};
