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
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    category: "Moderation",
    description: "Unbans / Mutes a user.",
    slash: true,
    testOnly: false,
    options: [
        {
            name: "ban",
            description: "Unban a user from the server.",
            type: 1,
            options: [
                {
                    name: "id",
                    description: "The user you want to unmute.",
                    type: 3,
                    required: true,
                },
            ],
        },
        {
            name: "mute",
            description: "Unmute a user from the server.",
            type: 1,
        },
    ],
    callback: ({ interaction: msgInt, channel }) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        const muted = (_a = msgInt.guild) === null || _a === void 0 ? void 0 : _a.roles.cache.find((role) => role.name === "muted");
        const undo = msgInt.options.getSubcommand();
        const timeElapsed = Date.now();
        const unixTimestamp = Math.floor(new Date(timeElapsed).getTime() / 1000);
        const kicker = msgInt.user.tag;
        const mutedUser = new Array();
        const mutedMenu = new discord_js_1.MessageSelectMenu()
            .setCustomId("mutedusers")
            .setPlaceholder("None Selected");
        const userRow = new discord_js_1.MessageActionRow();
        const filter = (btnInt) => {
            return msgInt.user.id === btnInt.user.id;
        };
        const unpunishedEmbed = new discord_js_1.MessageEmbed()
            .setColor("#2BDE1F")
            .setAuthor({ name: `Action performed by: ${kicker}` })
            .setTimestamp()
            .setFooter({ text: "Remember to behave!" });
        try {
            switch (undo) {
                case "mute":
                    const list = yield ((_b = msgInt.guild) === null || _b === void 0 ? void 0 : _b.members.fetch());
                    list === null || list === void 0 ? void 0 : list.forEach((users) => {
                        if (users.roles.cache.some((role) => role.name === "muted")) {
                            mutedUser.push({
                                label: `${users.displayName}`,
                                value: `${users.id}`,
                                emoji: {
                                    id: null,
                                    name: "🔇",
                                },
                            });
                        }
                    });
                    if (mutedUser[0] === undefined) {
                        yield msgInt.reply({
                            content: "No one is muted on the server!",
                            components: [],
                            ephemeral: true,
                        });
                        return;
                    }
                    mutedMenu.maxValues = mutedUser.length;
                    for (let i = 0; i < mutedUser.length; i++) {
                        mutedMenu.addOptions([mutedUser[i]]);
                    }
                    userRow.addComponents(mutedMenu);
                    const menuCollector = channel.createMessageComponentCollector({
                        componentType: "SELECT_MENU",
                        filter,
                        max: 1,
                        time: 1000 * 30,
                    });
                    yield msgInt.reply({
                        content: "Choose who to unmute",
                        components: [userRow],
                        ephemeral: true,
                        fetchReply: true,
                    });
                    menuCollector.on("end", (collection) => __awaiter(void 0, void 0, void 0, function* () {
                        var _e, _f;
                        if (((_e = collection.first()) === null || _e === void 0 ? void 0 : _e.customId) === "mutedusers") {
                            let myValues = collection.first();
                            if (myValues === null || myValues === void 0 ? void 0 : myValues.isSelectMenu()) {
                                if (myValues.values.length === undefined) {
                                    throw "No users are muted in this server!";
                                }
                                for (let i = 0; i < myValues.values.length; i++) {
                                    let users = yield ((_f = msgInt.guild) === null || _f === void 0 ? void 0 : _f.members.fetch(myValues.values[i]));
                                    users === null || users === void 0 ? void 0 : users.roles.remove(muted.id);
                                    let user = users === null || users === void 0 ? void 0 : users.displayName;
                                    unpunishedEmbed.addFields({
                                        name: `✅ User was unmuted`,
                                        value: `${user} is no longer muted on the server`
                                    });
                                }
                                unpunishedEmbed.setDescription(`Action performed on <t:${unixTimestamp}:f>`);
                                channel.send({ embeds: [unpunishedEmbed] });
                            }
                        }
                        yield msgInt.editReply({
                            content: "Unmuted users.",
                            components: []
                        });
                    }));
                    return;
                case "ban":
                    const userId = yield msgInt.options.getString("id", true);
                    const banned = yield ((_c = msgInt.guild) === null || _c === void 0 ? void 0 : _c.bans.fetch());
                    if (!(banned === null || banned === void 0 ? void 0 : banned.has(userId))) {
                        console.log("caught");
                        throw "User is not banned.";
                    }
                    else {
                        yield ((_d = msgInt.guild) === null || _d === void 0 ? void 0 : _d.members.unban(userId).then((user) => __awaiter(void 0, void 0, void 0, function* () {
                            unpunishedEmbed.setDescription(`${user.tag} was unbanned at <t:${unixTimestamp}:f>`);
                            channel.send({ embeds: [unpunishedEmbed] });
                            yield msgInt.editReply({
                                content: `Unbanned user.`,
                                components: [],
                            });
                            return;
                        })));
                    }
            }
        }
        catch (error) {
            switch (error) {
                case "User is not muted.":
                    msgInt.editReply({
                        content: "User is not muted!",
                        components: [],
                    });
                    break;
                case "No users are muted in this server!":
                    msgInt.editReply({
                        content: "No users are muted in this server!",
                        components: [],
                    });
                    break;
                case "User is not banned.":
                    yield msgInt.editReply({
                        content: "User is not currently banned from the guild!",
                        components: [],
                    });
                    break;
            }
            if (error instanceof TypeError &&
                error.name === "TypeError [COMMAND_INTERACTION_OPTION_EMPTY]") {
                msgInt.editReply({
                    content: "User is not in guild.",
                    components: [],
                });
            }
        }
    }),
};
