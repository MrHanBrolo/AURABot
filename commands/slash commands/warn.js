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
const warn_schema_1 = __importDefault(require("../../models/warn-schema"));
const logs_schema_1 = __importDefault(require("../../models/logs-schema"));
exports.default = {
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
    callback: ({ guild, interaction: msgInt, member: staff, interaction, client }) => __awaiter(void 0, void 0, void 0, function* () {
        const subCommand = interaction.options.getSubcommand();
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');
        const id = interaction.options.getString('id');
        const staffTag = msgInt.user.tag;
        const warnEmbed = new discord_js_1.MessageEmbed()
            .setColor("#FFFC1F")
            .setTimestamp();
        const userExists = yield warn_schema_1.default.exists({
            guildId: guild === null || guild === void 0 ? void 0 : guild.id,
            userId: user === null || user === void 0 ? void 0 : user.id
        });
        const logChannel = yield logs_schema_1.default.findOne({
            guildId: guild === null || guild === void 0 ? void 0 : guild.id,
        });
        const warnID = userExists === null || userExists === void 0 ? void 0 : userExists._id.toString();
        switch (subCommand) {
            case 'add':
                if (!userExists) {
                    yield warn_schema_1.default.create({
                        guildId: guild === null || guild === void 0 ? void 0 : guild.id,
                        userId: user === null || user === void 0 ? void 0 : user.id,
                        reason: reason,
                        staffId: staff === null || staff === void 0 ? void 0 : staff.id
                    });
                    warnEmbed.setDescription(`✅ ** Warning added to <@${user === null || user === void 0 ? void 0 : user.id}> **`)
                        .setAuthor({ name: `ID: ${warnID}` });
                    for (let i = 0; i < logChannel.logs.length; i++) {
                        if (logChannel.logs[i].logName === "warns") {
                            const channel = yield client.channels.cache.get(logChannel.logs[i].channelId);
                            channel.send({ embeds: [warnEmbed] });
                        }
                    }
                }
                else {
                    yield warn_schema_1.default.create({
                        guildId: guild === null || guild === void 0 ? void 0 : guild.id,
                        userId: user === null || user === void 0 ? void 0 : user.id,
                        reason: reason,
                        staffId: staff === null || staff === void 0 ? void 0 : staff.id
                    });
                    warnEmbed.setDescription(`✅ ** Warning added to <@${user === null || user === void 0 ? void 0 : user.id}> **`)
                        .setAuthor({ name: `ID: ${warnID}` })
                        .setFooter({ text: `Brought to you by AURABot | **ID: ${warnID}** ` });
                    for (let i = 0; i < logChannel.logs.length; i++) {
                        if (logChannel.logs[i].logName === "warns") {
                            const channel = yield client.channels.cache.get(logChannel.logs[i].channelId);
                            channel.send({ embeds: [warnEmbed] });
                        }
                    }
                }
                break;
            case 'remove':
                if (!userExists) {
                    warnEmbed.setDescription(`❌ ** User has no warnings. **`)
                        .setFooter({ text: "Brought to you by AURABot" });
                    return {
                        custom: true,
                        embeds: [warnEmbed],
                    };
                }
                else {
                    const warning = yield warn_schema_1.default.exists({
                        _id: id,
                        guildId: guild === null || guild === void 0 ? void 0 : guild.id,
                    });
                    if (warning) {
                        yield warn_schema_1.default.findOneAndDelete({
                            _id: id,
                            guildId: guild === null || guild === void 0 ? void 0 : guild.id
                        });
                    }
                    warnEmbed.setDescription(`✅ ** Warning removed from <@${user === null || user === void 0 ? void 0 : user.id}> **`)
                        .setFooter({ text: "Brought to you by AURABot" });
                    for (let i = 0; i < logChannel.logs.length; i++) {
                        if (logChannel.logs[i].logName === "warns") {
                            const channel = yield client.channels.cache.get(logChannel.logs[i].channelId);
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
    })
};
