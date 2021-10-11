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
    description: "View user information",
    slash: true,
    testOnly: true,
    options: [
        {
            name: "user",
            description: "User you want to get the information of.",
            type: 6,
            required: true
        }
    ],
    callback: ({ interaction: msgInt, channel }) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const whois = msgInt.options.getMember("user", true);
        const userPic = yield whois.displayAvatarURL({ format: 'jpg' });
        const userCreation = new Date(whois.user.createdAt);
        const userJoin = new Date(whois.joinedAt);
        const newDate = userCreation.getTime();
        const joinDate = userJoin.getTime();
        const createdTimestamp = Math.floor(new Date(newDate).getTime() / 1000);
        const joinedTimestamp = Math.floor(new Date(joinDate).getTime() / 1000);
        const roles = yield whois.roles.cache.map(r => `${r}`).join(' | ');
        let newRoles;
        let words;
        let moderator;
        let partner;
        let discoEmployee;
        let serverRank;
        let special = yield ((_a = whois.user.flags) === null || _a === void 0 ? void 0 : _a.toArray().map(s => s.toLowerCase().replace(/_/g, " ").split(" ")));
        if (special === null || special === void 0 ? void 0 : special.length) {
            for (let i = 0; i < (special === null || special === void 0 ? void 0 : special.length); i++) {
                for (let j = 0; j < special[i].length; j++) {
                    special[i][j] = special[i][j][0].toUpperCase() + special[i][j].substring(1);
                }
            }
        }
        words = special === null || special === void 0 ? void 0 : special.join().replace(/,/g, " ");
        if (roles.indexOf('| @everyone')) {
            newRoles = roles.replace('| @everyone', "");
        }
        if (roles.indexOf('@everyone') === 0) {
            newRoles = roles.replace('@everyone', "This user has no other roles. 😬");
        }
        const roleCount = newRoles.split(' | ');
        const whoisEmbed = new discord_js_1.MessageEmbed()
            .setColor("#330034")
            .setAuthor(`${whois.user.tag}`)
            .setThumbnail(`${userPic}`)
            .setTimestamp()
            .setFooter(`Brought to you by @AURABot`);
        console.log("verified input");
        try {
            whoisEmbed.addFields({
                name: 'Date user joined 🕔',
                value: `<t:${joinedTimestamp}:f>`,
                inline: true
            }, {
                name: 'Account creation date 🕛',
                value: `<t:${createdTimestamp}:f>`,
                inline: true
            }, {
                name: `Roles the user has [${roleCount.length}] 🏷️`,
                value: newRoles
            });
            console.log(words);
            console.log(words.indexOf("Partnered Server Owner"));
            console.log("made it here");
            const permCollection = whois.permissions.toArray();
            console.log(permCollection);
            if (whois.id === ((_b = msgInt.guild) === null || _b === void 0 ? void 0 : _b.ownerId)) {
                serverRank = "Server Owner 👑";
            }
            console.log(permCollection.indexOf('KICK_MEMBERS'));
            console.log(permCollection.indexOf('BAN_MEMBERS'));
            try {
                if (permCollection.indexOf('ADMINISTRATOR') >= 0) {
                    if (serverRank) {
                        serverRank += (' | Administrator');
                    }
                    else {
                        serverRank = 'Administrator';
                    }
                }
                if (permCollection.indexOf('KICK_MEMBERS') > 0 && permCollection.indexOf('BAN_MEMBERS') >= 0) {
                    if (serverRank) {
                        serverRank += (' | Moderator');
                    }
                    else {
                        serverRank = 'Moderator';
                    }
                }
            }
            catch (err) {
                console.log(err);
            }
            if (serverRank) {
                whoisEmbed.addField('Special', serverRank);
            }
            try {
                //Partnered server only
                if (words.indexOf("Discord Certified Moderator") === -1 &&
                    words.indexOf("Discord Employee") === -1 &&
                    words.indexOf("Partnered Server Owner") >= 0) {
                    partner = "Partnered Server Owner";
                    whoisEmbed.addFields({
                        name: 'Big Boi Status',
                        value: `${partner}`
                    });
                    console.log("stopped");
                }
                //Discord Employee only
                if (words.indexOf("Discord Certified Moderator") === -1 &&
                    words.indexOf("Discord Employee") >= 0 &&
                    words.indexOf("Partnered Server Owner") === -1) {
                    discoEmployee = "Discord Employee";
                    whoisEmbed.addFields({
                        name: 'Special',
                        value: `${discoEmployee}`
                    });
                }
                //Discord cert. mod only
                if (words.indexOf("Discord Certified Moderator") >= 0 &&
                    words.indexOf("Discord Employee") == -1 &&
                    words.indexOf("Partnered Server Owner") === -1) {
                    moderator = "Discord Certified Moderator";
                    whoisEmbed.addFields({
                        name: 'Special',
                        value: `${moderator}`
                    });
                }
                if (words.indexOf("Discord Certified Moderator") === -1 &&
                    words.indexOf("Discord Employee") >= 0 &&
                    words.indexOf("Partnered Server Owner") >= 0) {
                    discoEmployee.join(`| ${partner}`);
                    whoisEmbed.addFields({
                        name: 'Special',
                        value: `${discoEmployee}`
                    });
                }
                if (words.indexOf("Discord Certified Moderator") >= 0 &&
                    words.indexOf("Discord Employee") >= 0 &&
                    words.indexOf("Partnered Server Owner") >= 0) {
                    discoEmployee.join(`| ${partner} | ${moderator}`);
                    whoisEmbed.addFields({
                        name: 'Special',
                        value: `${discoEmployee}`
                    });
                }
                if (words.indexOf("Discord Certified Moderator") >= 0 &&
                    words.indexOf("Discord Employee") === -1 &&
                    words.indexOf("Partnered Server Owner") >= 0) {
                    partner.join(`| ${moderator}`);
                    whoisEmbed.addFields({
                        name: 'Special',
                        value: `${partner}`
                    });
                }
            }
            catch (err) {
                console.log(err);
            }
            yield msgInt.reply({
                content: "Fetched user info:",
                components: [],
            });
            channel.send({ embeds: [whoisEmbed] });
        }
        catch (error) {
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
