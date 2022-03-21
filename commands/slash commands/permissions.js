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
    description: "Manages permissions for a role or user.",
    slash: true,
    testOnly: true,
    options: [
        {
            name: "mentionable",
            description: "Get or edit permissions for a role or user",
            type: 2,
            options: [
                {
                    name: "get",
                    description: "Get permissions for a role",
                    type: 1,
                    options: [
                        {
                            name: "perms",
                            description: "The channel permissions to get. If omitted, the guild permissions will be returned",
                            type: 9,
                            required: false,
                        },
                        {
                            name: "channel",
                            description: "The channel permissions to get. If omitted, the guild permissions will be returned",
                            type: 7,
                            required: false,
                        },
                    ],
                },
                {
                    name: "edit",
                    description: "Edit channel / server permissions for a role or user",
                    type: 1,
                    options: [
                        {
                            name: "perms",
                            description: "The role or user to edit. Use this on its own to add or remove roles.",
                            type: 9,
                            required: true,
                        },
                        {
                            name: "channel",
                            description: "The channel permissions to edit. If omitted, the guild permissions will be edited",
                            type: 7,
                            required: false,
                        },
                        {
                            name: "state",
                            description: "The channel permissions to edit. If omitted, the guild permissions will be edited",
                            type: 3,
                            required: false,
                        },
                    ],
                },
            ],
        },
    ],
    callback: ({ interaction: msgInt, channel }) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        // Options
        const userR = msgInt.options.getMentionable("perms");
        const permState = msgInt.options.getString("state");
        const manage = msgInt.options.getSubcommandGroup();
        const permScope = msgInt.options.getSubcommand();
        let selectedChannel;
        // Bot Member Object
        const botRoles = (yield ((_a = msgInt.guild) === null || _a === void 0 ? void 0 : _a.members.fetch("889924119708196916")));
        // Date
        const timeElapsed = Date.now();
        const unixTimestamp = Math.floor(new Date(timeElapsed).getTime() / 1000);
        // User who called command
        const invoker = msgInt.user.tag;
        const helpRow = new discord_js_1.MessageActionRow().addComponents(new discord_js_1.MessageButton()
            .setLabel("View Wiki Page")
            .setStyle("LINK")
            .setURL("https://github.com/MrHanBrolo/AURABot/wiki/Tools#permissions"));
        // Arrays
        const permList = new Array();
        let removedPerms = new Array();
        // Menus
        const permRow = new discord_js_1.MessageActionRow();
        // Filter
        const filter = (btnInt) => {
            return msgInt.user.id === btnInt.user.id;
        };
        // Embed for results
        const permsEmbed = new discord_js_1.MessageEmbed()
            .setColor("#FF9500")
            .setAuthor({ name: `${invoker}` })
            .setTimestamp()
            .setFooter({ text: "Remember to behave!" });
        function changePerms(collector, channelChosen, mentionChosen, stateSet, whatsitdoin) {
            collector.on("end", (collection) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                if (((_a = collection.first()) === null || _a === void 0 ? void 0 : _a.customId) === "perms") {
                    let permCollection = yield collection.first();
                    if (permCollection === null || permCollection === void 0 ? void 0 : permCollection.isSelectMenu()) {
                        permCollection.values.forEach((v, i) => {
                            setTimeout(() => {
                                channelChosen.permissionOverwrites.edit(mentionChosen.id, {
                                    [v]: stateSet,
                                });
                                removedPerms.push(v);
                                msgInt.editReply({
                                    content: `${whatsitdoin}` + " " + [v] + " successfully.",
                                    components: [],
                                });
                                if (removedPerms.length === permCollection.values.length) {
                                    const rP = removedPerms.join(" ● ").replace(/,/g, " ");
                                    if (userR instanceof discord_js_1.GuildMember) {
                                        const utag = userR.user.tag;
                                        permsEmbed.addFields({
                                            name: `Role / User Affected`,
                                            value: `${utag}`,
                                        });
                                    }
                                    if (userR instanceof discord_js_1.Role) {
                                        const rtag = userR.id;
                                        permsEmbed.addFields({
                                            name: `Role / User Affected`,
                                            value: `<@&${rtag}>`,
                                        });
                                    }
                                    permsEmbed.addFields({
                                        name: `${whatsitdoin} Permissions`,
                                        value: `Sucessfully ${whatsitdoin} the following perms: \n \n ${rP}`,
                                    });
                                    permsEmbed.setDescription(`Action performed on <t:${unixTimestamp}:f>`);
                                    msgInt.editReply({
                                        content: " ",
                                        embeds: [permsEmbed]
                                    });
                                }
                            }, i * 2000);
                        });
                    }
                }
            }));
        }
        try {
            switch (manage) {
                case "mentionable":
                    switch (permScope) {
                        case "get":
                            if (userR instanceof discord_js_1.GuildMember) {
                                if (msgInt.options.getChannel("channel")) {
                                    selectedChannel = msgInt.options.getChannel("channel");
                                }
                                else {
                                    selectedChannel = msgInt.channel;
                                }
                                const permHolder = new Array();
                                const noPerms = new Array();
                                const permsMenu = new discord_js_1.MessageSelectMenu()
                                    .setCustomId("perms")
                                    .setPlaceholder("None Selected");
                                let check = userR.permissionsIn(selectedChannel);
                                let checked = check.serialize();
                            }
                            return;
                        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
                        case "edit":
                            if (userR instanceof discord_js_1.GuildMember) {
                                if (permState !== "d" &&
                                    permState !== "deny" &&
                                    permState !== undefined &&
                                    permState !== "true" &&
                                    permState !== "t" &&
                                    permState !== "null" &&
                                    permState !== "n") {
                                    throw "InvalidState";
                                }
                                if (msgInt.options.getChannel("channel")) {
                                    selectedChannel = msgInt.options.getChannel("channel");
                                }
                                else {
                                    selectedChannel = msgInt.channel;
                                }
                                const permHolder = new Array();
                                const permsMenu = new discord_js_1.MessageSelectMenu()
                                    .setCustomId("perms")
                                    .setPlaceholder("None Selected");
                                const perms = userR === null || userR === void 0 ? void 0 : userR.permissions.toArray();
                                let check = userR.permissionsIn(selectedChannel);
                                for (let i = 0; i < perms.length; i++) {
                                    //Couldn't really figure out a better way to do this. Basically checks each permission value in the array and if it matches to one of this, adds it to the new noteablePerms array.
                                    if (perms[i] === "VIEW_CHANNEL" ||
                                        perms[i] === "SEND_MESSAGES" ||
                                        perms[i] === "SEND_TTS_MESSAGES" ||
                                        perms[i] === "EMBED_LINKS" ||
                                        perms[i] === "ATTACH_FILES" ||
                                        perms[i] === "READ_MESSAGE_HISTORY" ||
                                        perms[i] === "USE_EXTERNAL_EMOJIS" ||
                                        perms[i] === "MENTION_EVERYONE" ||
                                        perms[i] === "CREATE_PUBLIC_THREADS" ||
                                        perms[i] === "CREATE_PRIVATE_THREADS" ||
                                        perms[i] === "USE_EXTERNAL_STICKERS" ||
                                        perms[i] === "SEND_MESSAGES_IN_THREADS") {
                                        permHolder.push(perms[i]);
                                    }
                                }
                                yield permHolder.forEach((perm) => {
                                    permList.push({
                                        label: `${perm}`,
                                        value: `${perm}`,
                                    });
                                });
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
                                yield msgInt.reply({
                                    content: "Choose what permissions to edit.",
                                    components: [permRow],
                                    fetchReply: true,
                                });
                                if (permState === "deny" ||
                                    permState === "d" ||
                                    permState === "undefined") {
                                    changePerms(permCollector, selectedChannel, userR, false, "Disabled");
                                    return;
                                }
                                if (permState === "true" || permState === "t") {
                                    changePerms(permCollector, selectedChannel, userR, true, "Enabled");
                                    return;
                                }
                                if (permState === "null" || permState === "n") {
                                    changePerms(permCollector, selectedChannel, userR, null, "Neutralised");
                                    return;
                                }
                            }
                            if (userR instanceof discord_js_1.Role) {
                                if (permState !== "d" &&
                                    permState !== "deny" &&
                                    permState !== undefined &&
                                    permState !== "true" &&
                                    permState !== "t" &&
                                    permState !== "null" &&
                                    permState !== "n") {
                                    throw "InvalidState";
                                }
                                if (msgInt.options.getChannel("channel")) {
                                    selectedChannel = msgInt.options.getChannel("channel");
                                }
                                else {
                                    selectedChannel = msgInt.channel;
                                }
                                const permHolder = new Array();
                                const permsMenu = new discord_js_1.MessageSelectMenu()
                                    .setCustomId("perms")
                                    .setPlaceholder("None Selected");
                                const perms = userR === null || userR === void 0 ? void 0 : userR.permissions.toArray();
                                console.log(perms);
                                for (let i = 0; i < perms.length; i++) {
                                    //Couldn't really figure out a better way to do this. Basically checks each permission value in the array and if it matches to one of this, adds it to the new noteablePerms array.
                                    if (perms[i] === "VIEW_CHANNEL" ||
                                        perms[i] === "SEND_MESSAGES" ||
                                        perms[i] === "SEND_TTS_MESSAGES" ||
                                        perms[i] === "MANAGE_MESSAGES" ||
                                        perms[i] === "EMBED_LINKS" ||
                                        perms[i] === "ATTACH_FILES" ||
                                        perms[i] === "READ_MESSAGE_HISTORY" ||
                                        perms[i] === "USE_EXTERNAL_EMOJIS" ||
                                        perms[i] === "MENTION_EVERYONE" ||
                                        perms[i] === "USE_PUBLIC_THREADS" ||
                                        perms[i] === "CREATE_PUBLIC_THREADS" ||
                                        perms[i] === "USE_PRIVATE_THREADS" ||
                                        perms[i] === "USE_EXTERNAL_STICKERS" ||
                                        perms[i] === "SEND_MESSAGES_IN_THREADS") {
                                        permHolder.push(perms[i]);
                                    }
                                }
                                ////////////////////////////////////////////////////////////////////////////////
                                yield permHolder.forEach((perm) => {
                                    permList.push({
                                        label: `${perm}`,
                                        value: `${perm}`,
                                    });
                                });
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
                                yield msgInt.reply({
                                    content: "Choose what permissions to edit.",
                                    components: [permRow],
                                    ephemeral: true,
                                    fetchReply: true,
                                });
                                if (permState === "deny" ||
                                    permState === "d" ||
                                    permState === "undefined") {
                                    changePerms(permCollector, selectedChannel, userR, false, "Disabled");
                                    return;
                                }
                                if (permState === "true" || permState === "t") {
                                    changePerms(permCollector, selectedChannel, userR, true, "Enabled");
                                    return;
                                }
                                if (permState === "null" || permState === "n") {
                                    changePerms(permCollector, selectedChannel, userR, null, "Neutralised");
                                    return;
                                }
                            } // end of scope switch
                    }
            }
        }
        catch (error) {
            switch (error) {
                case "InvalidState":
                    msgInt.reply({
                        content: "Not a valid state! Refer to /help or wiki.",
                        ephemeral: true,
                        components: [helpRow],
                    });
                    return;
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
