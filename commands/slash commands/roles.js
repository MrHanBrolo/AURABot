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
    description: "Manages roles for a user.",
    slash: true,
    testOnly: true,
    options: [
        {
            name: "user",
            description: "The user whose roles you want to manage.",
            type: 6,
            required: true,
        },
    ],
    callback: ({ interaction: msgInt, channel }) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const userR = msgInt.options.getMember("user");
        const botRoles = (yield ((_a = msgInt.guild) === null || _a === void 0 ? void 0 : _a.members.fetch("889924119708196916")));
        const userHighest = userR.roles.highest.name;
        const timeElapsed = Date.now();
        const unixTimestamp = Math.floor(new Date(timeElapsed).getTime() / 1000);
        const invoker = msgInt.user.tag;
        const managedUserRoles = new Array();
        let removedArray = new Array();
        let namedRoles = new Array();
        const roleMenu = new discord_js_1.MessageSelectMenu()
            .setCustomId("userRoles")
            .setPlaceholder("None Selected");
        const roleRow = new discord_js_1.MessageActionRow();
        const filter = (btnInt) => {
            return msgInt.user.id === btnInt.user.id;
        };
        const unpunishedEmbed = new discord_js_1.MessageEmbed()
            .setColor("#76b900")
            .setAuthor(`Action performed by: ${invoker}`)
            .setTimestamp()
            .setFooter("Remember to behave!");
        try {
            const list = yield userR.roles.cache;
            yield (list === null || list === void 0 ? void 0 : list.forEach((role) => {
                var _a;
                (_a = msgInt.guild) === null || _a === void 0 ? void 0 : _a.roles.fetch(role.id).then((roleName) => {
                    if ((roleName === null || roleName === void 0 ? void 0 : roleName.name) == "@everyone") {
                        return;
                    }
                    if (userR.roles.highest.comparePositionTo(botRoles.roles.highest) >= 1) {
                        var removeIndex = managedUserRoles
                            .map(function (item) {
                            return item.label;
                        })
                            .indexOf(userHighest);
                        managedUserRoles.splice(removeIndex, 1);
                    }
                    managedUserRoles.push({
                        label: `${roleName === null || roleName === void 0 ? void 0 : roleName.name}`,
                        value: `${roleName === null || roleName === void 0 ? void 0 : roleName.id}`,
                    });
                });
            }));
            if (managedUserRoles[0] === undefined) {
                yield msgInt.reply({
                    content: "User does not have additional roles",
                    components: [],
                    ephemeral: true,
                });
                return;
            }
            roleMenu.maxValues = managedUserRoles.length;
            for (let i = 0; i < managedUserRoles.length; i++) {
                roleMenu.addOptions([managedUserRoles[i]]);
            }
            roleRow.addComponents(roleMenu);
            const menuCollector = channel.createMessageComponentCollector({
                componentType: "SELECT_MENU",
                filter,
                max: 1,
                time: 1000 * 30,
            });
            yield msgInt.reply({
                content: "Choose what roles to remove",
                components: [roleRow],
                ephemeral: true,
                fetchReply: true,
            });
            menuCollector.on("end", (collection) => __awaiter(void 0, void 0, void 0, function* () {
                var _b, _c;
                if (((_b = collection.first()) === null || _b === void 0 ? void 0 : _b.customId) === "userRoles") {
                    let roleCollection = collection.first();
                    if (roleCollection === null || roleCollection === void 0 ? void 0 : roleCollection.isSelectMenu()) {
                        for (let i = 0; i < roleCollection.values.length; i++) {
                            removedArray.push(roleCollection.values[i]);
                            userR.roles.remove(roleCollection.values[i]);
                            yield ((_c = msgInt.guild) === null || _c === void 0 ? void 0 : _c.roles.fetch(removedArray[i]).then((role) => {
                                var _a;
                                let roles = (_a = msgInt.guild) === null || _a === void 0 ? void 0 : _a.roles.cache.find((r) => r.id === (role === null || role === void 0 ? void 0 : role.id));
                                namedRoles.push(roles);
                            }));
                        }
                        const nR = namedRoles.join(" ● ").replace(/,/g, " ");
                        let user = userR.id;
                        unpunishedEmbed.addFields({
                            name: `❌ Roles removed`,
                            value: `**<@${user}> had the following roles removed: \n \n ${nR}**`,
                        });
                        unpunishedEmbed.setDescription(`Action performed at <t:${unixTimestamp}:f>`);
                        channel.send({ embeds: [unpunishedEmbed] });
                    }
                }
                yield msgInt.editReply({
                    content: "Removed Roles.",
                    components: [],
                });
            }));
            return;
        }
        catch (error) {
            switch (error) {
                case "Role is higher.":
                    msgInt.editReply({
                        content: "One or more roles were higher than mine and were not removed",
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
