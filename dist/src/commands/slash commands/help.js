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
    category: "Tools",
    description: "View available commands",
    slash: true,
    testOnly: true,
    callback: ({ interaction: msgInt, channel }) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const muted = (_a = msgInt.guild) === null || _a === void 0 ? void 0 : _a.roles.cache.find((role) => role.name === "muted");
        const undo = msgInt.options.getSubcommand();
        const timeElapsed = Date.now();
        const unixTimestamp = Math.floor(new Date(timeElapsed).getTime() / 1000);
        const kicker = msgInt.user.tag;
        const mutedUser = new Array();
        const mutedMenu = new discord_js_1.MessageSelectMenu()
            .setCustomId("mutedusers")
            .setPlaceholder("None Selected");
        const categoryRow = new discord_js_1.MessageActionRow();
        const filter = (btnInt) => {
            return msgInt.user.id === btnInt.user.id;
        };
        const collector = channel.createMessageComponentCollector({
            filter,
            max: 1,
            time: 1000 * 15,
        });
        const unpunishedEmbed = new discord_js_1.MessageEmbed()
            .setColor("#76b900")
            .setAuthor(`Action performed by: ${kicker}`)
            .setTimestamp()
            .setFooter("Remember to behave!");
        console.log("verified input");
        try {
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
