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
    testOnly: true,
    options: [
        {
            name: "ban",
            description: "Unban a user from the server.",
            type: 1,
            options: [
                {
                    name: "user",
                    description: "The user you want to unban.",
                    type: 6,
                    required: true,
                },
                {
                    name: "reason",
                    description: "Why you want to ban them.",
                    type: 3,
                    required: false,
                },
            ],
        },
        {
            name: "mute",
            description: "Unmute a user from the server.",
            type: 1,
            options: [
                {
                    name: "user",
                    description: "The user you want to unmute.",
                    type: 6,
                    required: true,
                },
            ],
        },
    ],
    callback: ({ interaction: msgInt, channel }) => __awaiter(void 0, void 0, void 0, function* () {
        const timeElapsed = Date.now();
        const unixTimestamp = Math.floor(new Date(timeElapsed).getTime() / 1000);
        const punishRow = new discord_js_1.MessageActionRow()
            .addComponents(new discord_js_1.MessageButton()
            .setCustomId("punish_yes")
            .setLabel("Confirm")
            .setStyle("SUCCESS"))
            .addComponents(new discord_js_1.MessageButton()
            .setCustomId("punish_no")
            .setLabel("Cancel")
            .setStyle("DANGER"));
        yield msgInt.reply({
            content: "Are you sure?",
            components: [punishRow],
            ephemeral: true,
        });
        const filter = (btnInt) => {
            return msgInt.user.id === btnInt.user.id;
        };
        const collector = channel.createMessageComponentCollector({
            filter,
            max: 1,
            time: 1000 * 15,
        });
        collector.on("end", (collection) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const muted = (_a = msgInt.guild) === null || _a === void 0 ? void 0 : _a.roles.cache.find((role) => role.name === "muted");
            try {
                if (((_b = collection.first()) === null || _b === void 0 ? void 0 : _b.customId) === "punish_yes") {
                    // Member checks
                    const punished = msgInt.options.getMember("user", true);
                    const kicker = msgInt.user.tag;
                    // reason checks
                    const rsn = msgInt.options.getString("reason", false);
                    // command checks
                    const undo = msgInt.options.getSubcommand();
                    const unpunishedEmbed = new discord_js_1.MessageEmbed()
                        .setColor("#76b900")
                        .setAuthor(`Action performed by: ${kicker}`)
                        .setTimestamp()
                        .setFooter("Remember to behave!");
                    switch (undo) {
                        case "mute":
                            // Check if user has role             
                            const muted = (_c = msgInt.guild) === null || _c === void 0 ? void 0 : _c.roles.cache.find((role) => role.name === "muted");
                            if (!punished.roles.cache.some((role) => role.name === "muted")) {
                                throw `User is not muted.`;
                            }
                            yield punished.roles.remove(muted.id).then(() => __awaiter(void 0, void 0, void 0, function* () {
                                unpunishedEmbed.setTitle("User was unmuted");
                                try {
                                    unpunishedEmbed.setDescription("You are no longer muted on the server");
                                    yield (punished === null || punished === void 0 ? void 0 : punished.send({ embeds: [unpunishedEmbed] }));
                                }
                                catch (err) { }
                                unpunishedEmbed.setDescription(`${punished} was unmuted at <t:${unixTimestamp}:f> and is no longer muted on the server`);
                                channel.send({ embeds: [unpunishedEmbed] });
                                yield msgInt.editReply({
                                    content: `Unmuted ${punished}`,
                                    components: [],
                                });
                                return;
                            }));
                            return;
                        // case "ban":
                    }
                }
                else if (((_d = collection.first()) === null || _d === void 0 ? void 0 : _d.customId) === "punish_no") {
                    msgInt.editReply({
                        content: "Action cancelled",
                        components: [],
                    });
                }
            }
            catch (error) {
                switch (error) {
                    case "User is not muted.":
                        msgInt.editReply({
                            content: 'User is not muted!',
                            components: [],
                        });
                        break;
                    case "User is not banned":
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
        }));
    }),
};
