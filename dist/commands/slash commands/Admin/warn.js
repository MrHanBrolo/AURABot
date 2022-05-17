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
const discord_js_1 = require("discord.js");
const warn_schema_1 = __importDefault(require("../../../models/warn-schema"));
const logs_schema_1 = __importDefault(require("../../../models/logs-schema"));
const user_schema_1 = __importDefault(require("../../../models/user-schema"));
const guild_schema_1 = __importDefault(require("../../../models/guild-schema"));
exports.default = {
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
    callback: ({ guild, channel, interaction: msgInt, member: staff, client }) => __awaiter(void 0, void 0, void 0, function* () {
        const subCommand = msgInt.options.getSubcommand();
        const user = msgInt.options.getUser('user');
        const reason = msgInt.options.getString('reason');
        const id = msgInt.options.getString('id');
        let logChannel;
        const warnEmbed = new discord_js_1.MessageEmbed()
            .setColor("#FFFC1F")
            .setTimestamp();
        const allLogsSet = yield logs_schema_1.default.exists({
            guildId: guild === null || guild === void 0 ? void 0 : guild.id,
            "logs.logName": "all"
        });
        console.log(allLogsSet);
        const logChannelExists = yield logs_schema_1.default.exists({
            guildId: guild === null || guild === void 0 ? void 0 : guild.id,
            "logs.logName": "warns"
        });
        if (logChannelExists) {
            logChannel = yield logs_schema_1.default.findOne({
                guildId: guild === null || guild === void 0 ? void 0 : guild.id,
                "logs.logName": "warns"
            });
        }
        const userExists = yield user_schema_1.default.findOne({
            guildId: guild === null || guild === void 0 ? void 0 : guild.id,
            userId: user === null || user === void 0 ? void 0 : user.id
        });
        switch (subCommand) {
            case 'add':
                if (!userExists) {
                    yield user_schema_1.default.create({
                        guild: guild === null || guild === void 0 ? void 0 : guild.id,
                        userId: user === null || user === void 0 ? void 0 : user.id,
                        warnings: []
                    });
                }
                yield user_schema_1.default.updateOne({
                    guildId: guild === null || guild === void 0 ? void 0 : guild.id,
                    userId: user === null || user === void 0 ? void 0 : user.id
                }, {
                    $inc: {
                        warningAmount: 1
                    }
                });
                yield guild_schema_1.default.updateOne({
                    guildId: guild === null || guild === void 0 ? void 0 : guild.id,
                }, {
                    $inc: {
                        casesMade: 1
                    }
                });
                const warnID = yield guild_schema_1.default.findOne({
                    guildId: guild === null || guild === void 0 ? void 0 : guild.id,
                    userId: user === null || user === void 0 ? void 0 : user.id
                }).then(warn => warn.casesMade.toString());
                yield warn_schema_1.default.create({
                    guildId: guild === null || guild === void 0 ? void 0 : guild.id,
                    userId: user === null || user === void 0 ? void 0 : user.id,
                    reason: reason,
                    staffId: staff === null || staff === void 0 ? void 0 : staff.id,
                    caseId: warnID
                });
                let userInfo = yield user_schema_1.default.findOne({
                    guildId: guild === null || guild === void 0 ? void 0 : guild.id,
                    userId: user === null || user === void 0 ? void 0 : user.id
                }).then(info => info.warningAmount);
                warnEmbed.setDescription(`✅ ** Warning added to <@${user === null || user === void 0 ? void 0 : user.id}> **`)
                    .setAuthor({ name: `Action performed by: ${msgInt.user.tag}` })
                    .addFields({ name: "Warns: ", value: `${userInfo}`, inline: true })
                    .setFooter({ text: `• ID: ${warnID}` });
                if (!logChannelExists) {
                    channel.send({ embeds: [warnEmbed] });
                    yield msgInt.reply({
                        content: 'Warning added to user.',
                        ephemeral: true,
                        components: []
                    });
                }
                else {
                    for (let i = 0; i < logChannel.logs.length; i++) {
                        if (logChannel.logs[i].logName === "all") {
                            const channel = yield client.channels.cache.get(logChannel.logs[i].channelId);
                            channel.send({ embeds: [warnEmbed] });
                            yield msgInt.reply({
                                content: 'Warning added to user.',
                                ephemeral: true,
                                components: [],
                            });
                            return;
                        }
                        else {
                            if (logChannel.logs[i].logName === "warns") {
                                const channel = yield client.channels.cache.get(logChannel.logs[i].channelId);
                                channel.send({ embeds: [warnEmbed] });
                                yield msgInt.reply({
                                    content: 'Warning added to user.',
                                    ephemeral: true,
                                    components: [],
                                });
                                return;
                            }
                        }
                    }
                }
                break;
            case 'remove':
                const warnExists = yield warn_schema_1.default.findOneAndDelete({
                    guildId: guild === null || guild === void 0 ? void 0 : guild.id,
                    userId: user === null || user === void 0 ? void 0 : user.id,
                    caseId: id
                });
                console.log(yield userExists.populate("warnings"));
                if (!warnExists) {
                    warnEmbed.setDescription(`❌ ** This warning does not exist. **`)
                        .setFooter({ text: "Brought to you by AURABot" });
                    return {
                        custom: true,
                        embeds: [warnEmbed],
                    };
                }
                else {
                    yield user_schema_1.default.updateOne({
                        guildId: guild === null || guild === void 0 ? void 0 : guild.id,
                        userId: user === null || user === void 0 ? void 0 : user.id
                    }, {
                        $inc: {
                            warningAmount: -1
                        }
                    });
                    warnEmbed.setDescription(`✅ ** Warning removed from <@${user === null || user === void 0 ? void 0 : user.id}> **`)
                        .setFooter({ text: "Brought to you by AURABot" });
                    if (!logChannelExists) {
                        channel.send({ embeds: [warnEmbed] });
                        yield msgInt.reply({
                            content: 'Warning added to user.',
                            ephemeral: true,
                            components: []
                        });
                    }
                    else {
                        for (let i = 0; i < logChannel.logs.length; i++) {
                            if (logChannel.logs[i].logName === "warns") {
                                const channel = yield client.channels.cache.get(logChannel.logs[i].channelId);
                                yield msgInt.reply({
                                    content: 'Warning removed from user.',
                                    ephemeral: true,
                                    components: [],
                                });
                                channel.send({ embeds: [warnEmbed] });
                            }
                        }
                    }
                }
        }
    })
};
