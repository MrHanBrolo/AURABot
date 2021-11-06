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
            description: "Get or edit permissions for a user",
            type: 2,
            options: [
                {
                    name: "get",
                    description: "Get permissions for a user",
                    type: 1,
                    options: [
                        {
                            name: "user",
                            description: "The user to get",
                            type: 6,
                            required: true
                        },
                        {
                            name: "channel",
                            description: "The channel permissions to get. If omitted, the guild permissions will be returned",
                            type: 7,
                            required: false
                        }
                    ]
                },
                {
                    name: "edit",
                    description: "Edit permissions for a user",
                    type: 1,
                    options: [
                        {
                            name: "user",
                            description: "The user to edit",
                            type: 6,
                            required: true
                        },
                        {
                            name: "channel",
                            description: "The channel permissions to edit. If omitted, the guild permissions will be edited",
                            type: 7,
                            required: false
                        }
                    ]
                }
            ]
        },
        {
            name: "role",
            description: "Get or edit permissions for a role",
            type: 2,
            options: [
                {
                    name: "get",
                    description: "Get permissions for a role",
                    type: 1,
                    options: [
                        {
                            name: "role",
                            description: "The role to get",
                            type: 8,
                            required: true
                        },
                        {
                            name: "channel",
                            description: "The channel permissions to get. If omitted, the guild permissions will be returned",
                            type: 7,
                            required: false
                        }
                    ]
                },
                {
                    name: "edit",
                    description: "Edit permissions for a role",
                    type: 1,
                    options: [
                        {
                            name: "role",
                            description: "The role to edit",
                            type: 8,
                            required: true
                        },
                        {
                            name: "channel",
                            description: "The channel permissions to edit. If omitted, the guild permissions will be edited",
                            type: 7,
                            required: false
                        }
                    ]
                }
            ]
        }
    ],
    callback: ({ interaction: msgInt, channel }) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const userR = msgInt.options.getMember("user");
        const roleR = msgInt.options.getRole("channel");
        const botRoles = (yield ((_a = msgInt.guild) === null || _a === void 0 ? void 0 : _a.members.fetch("889924119708196916")));
        const manage = msgInt.options.getSubcommand();
        const timeElapsed = Date.now();
        const unixTimestamp = Math.floor(new Date(timeElapsed).getTime() / 1000);
        const invoker = msgInt.user.tag;
        const managedUserRoles = new Array();
        const permList = new Array();
        let removedArray = new Array();
        let namedRoles = new Array();
        const roleMenu = new discord_js_1.MessageSelectMenu()
            .setCustomId("userRoles")
            .setPlaceholder("None Selected");
        const roleRow = new discord_js_1.MessageActionRow();
        const permRow = new discord_js_1.MessageActionRow();
        const filter = (btnInt) => {
            return msgInt.user.id === btnInt.user.id;
        };
        const unpunishedEmbed = new discord_js_1.MessageEmbed()
            .setColor("#76b900")
            .setAuthor(`Action performed by: ${invoker}`)
            .setTimestamp()
            .setFooter("Remember to behave!");
        try {
            switch (manage) {
                case "user":
                    const userHighest = userR.roles.highest.name;
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
                case "change":
                    const permHolder = new Array;
                    const permsMenu = new discord_js_1.MessageSelectMenu()
                        .setCustomId("rolePerms")
                        .setPlaceholder("None Selected");
                    if (msgInt.options.getBoolean("permissions")) {
                        const rolePerms = roleR === null || roleR === void 0 ? void 0 : roleR.permissions.toArray();
                        for (let i = 0; i < rolePerms.length; i++) {
                            //Couldn't really figure out a better way to do this. Basically checks each permission value in the array and if it matches to one of this, adds it to the new noteablePerms array.
                            if (rolePerms[i] === "VIEW_CHANNEL" ||
                                rolePerms[i] === "SEND_MESSAGES" ||
                                rolePerms[i] === "SEND_TTS_MESSAGES" ||
                                rolePerms[i] === "MANAGE_MESSAGES" ||
                                rolePerms[i] === "EMBED_LINKS" ||
                                rolePerms[i] === "ATTACH_FILES" ||
                                rolePerms[i] === "READ_MESSAGE_HISTORY" ||
                                rolePerms[i] === "USE_EXTERNAL_EMOJIS" ||
                                rolePerms[i] === "MENTION_EVERYONE" ||
                                rolePerms[i] === "USE_PUBLIC_THREADS" ||
                                rolePerms[i] === "CREATE_PUBLIC_THREADS" ||
                                rolePerms[i] === "USE_PRIVATE_THREADS" ||
                                rolePerms[i] === "USE_EXTERNAL_STICKERS" ||
                                rolePerms[i] === "SEND_MESSAGES_IN_THREADS") {
                                permHolder.push(rolePerms[i]);
                            }
                        }
                        yield permHolder.forEach((perm) => {
                            permList.push({
                                label: `${perm}`,
                                value: `${perm}`,
                            });
                        });
                    }
                    console.log(permList);
                    permsMenu.maxValues = permList.length;
                    for (let i = 0; i < permList.length; i++) {
                        permsMenu.addOptions([permList[i]]);
                    }
                    yield permRow.addComponents(permsMenu);
                    const permCollector = channel.createMessageComponentCollector({
                        componentType: "SELECT_MENU",
                        filter,
                        max: 1,
                        time: 1000 * 30,
                    });
                    console.log("made it to selection");
                    yield msgInt.reply({
                        content: "Choose what roles to remove",
                        components: [permRow],
                        ephemeral: true,
                        fetchReply: true,
                    });
                    console.log("waiting for collection");
                    try {
                        permCollector.on("end", (collection) => __awaiter(void 0, void 0, void 0, function* () {
                            var _d;
                            if (((_d = collection.first()) === null || _d === void 0 ? void 0 : _d.customId) === "rolePerms") {
                                let permCollection = yield collection.first();
                                if (permCollection === null || permCollection === void 0 ? void 0 : permCollection.isSelectMenu()) {
                                    const current = msgInt.channel;
                                    permCollection.values.forEach((v, i) => __awaiter(void 0, void 0, void 0, function* () {
                                        setTimeout(() => {
                                            current.permissionOverwrites.edit(roleR.id, { [v]: false });
                                            msgInt.editReply({
                                                content: "Disabled" + " " + [v] + " successfully.",
                                                components: [],
                                            });
                                        }, i * 2000);
                                    }));
                                }
                            }
                        }));
                    }
                    catch (err) {
                        console.log(err);
                    }
            }
        }
        catch (error) {
            console.log(error);
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
