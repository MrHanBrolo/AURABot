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
            required: true,
        },
        {
            name: "detailed",
            description: "Provides permissions view.",
            type: 5,
            required: false,
        },
    ],
    callback: ({ interaction: msgInt, channel }) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        // Functions
        // Takes the first letter of each word, capitalises it, then attaches the letter back to the rest of the word
        function sortArray(x) {
            if (x === null || x === void 0 ? void 0 : x.length) {
                for (let i = 0; i < (x === null || x === void 0 ? void 0 : x.length); i++) {
                    for (let j = 0; j < x[i].length; j++) {
                        x[i][j] = x[i][j][0].toUpperCase() + x[i][j].substring(1);
                    }
                }
            }
        }
        // Gets UNIX timestamp for specified date (t)
        function getDate(t) {
            return Math.floor(new Date(t).getTime() / 1000);
        }
        // Variables
        // Interaction Options
        const whois = msgInt.options.getMember("user", true);
        const detailed = msgInt.options.getBoolean("detailed", false);
        //User data
        const userPic = whois.displayAvatarURL({ format: "jpg" });
        const userCreation = new Date(whois.user.createdAt);
        const userJoin = new Date(whois.joinedAt);
        const createdDate = userCreation.getTime();
        const joinDate = userJoin.getTime();
        const createdTimestamp = getDate(createdDate);
        const joinedTimestamp = getDate(joinDate);
        /*
            Retrieves user roles and maps them to a new array, joining each role name into an single string seperated by a ' | ' e.g. @mod | @staff | @guineapig
          */
        const roles = yield whois.roles.cache.map((r) => `${r}`).join(" | ");
        /*
            Retrieves user flags (e.g. 'DISCORD_PARTNER') and maps them to a new array, removing the underscores, converting to lower case and
            splitting the new words up into their own array (e.g. 'discord',  'partner')
            */
        let special = yield ((_a = whois.user.flags) === null || _a === void 0 ? void 0 : _a.toArray().map((s) => s.toLowerCase().replace(/_/g, " ").split(" ")));
        // Creates array of permissions for user e.g. [['MANAGES_MESSAGES', 'MANAGE_ROLES', 'SEND MESSAGES']] etc..
        const permCollection = whois.permissions.toArray();
        //Placeholder variables
        let newRoles;
        let words;
        let moderator;
        let partner;
        let discoEmployee;
        let serverRank;
        sortArray(special);
        // Joins words back into singular string and removes any comma's e.g. ("Discord Partner House Brilliance Early Supporter")
        words = special === null || special === void 0 ? void 0 : special.join().replace(/,/g, " ");
        // Removes @ everyone role from list since all users have this role by default and it can't be removed, it's unecessary to show it.
        if (roles.indexOf("| @everyone")) {
            newRoles = roles.replace("| @everyone", "");
        }
        if (roles.indexOf("@everyone") === 0) {
            newRoles = roles.replace("@everyone", "This user has no other roles. 😬");
        } // RIP
        const roleCount = newRoles.split(" | ");
        // Embed to display information
        const whoisEmbed = new discord_js_1.MessageEmbed()
            .setColor("#330034")
            .setAuthor(`${whois.user.tag}`)
            .setThumbnail(`${userPic}`)
            .setTimestamp()
            .setFooter(`Brought to you by @AURABot`);
        try {
            whoisEmbed.addFields({
                name: "Date user joined 🕔",
                value: `<t:${joinedTimestamp}:f>`,
                inline: true,
            }, {
                name: "Account creation date 🕛",
                value: `<t:${createdTimestamp}:f>`,
                inline: true,
            }, {
                name: `Roles the user has [${roleCount.length}] 🏷️`,
                value: newRoles,
            });
            /*
      
                Simply implemented, but this section will basically assign the highest level of privilege to a new field called "special"
                and list it.
      
                */
            // Checks if server owner and sets rank to this
            if (whois.id === ((_b = msgInt.guild) === null || _b === void 0 ? void 0 : _b.ownerId)) {
                serverRank = "Server Owner 👑";
            }
            if (!serverRank) {
                console.log(permCollection);
                if (permCollection.indexOf("ADMINISTRATOR") >= 0) {
                    serverRank = "Administrator";
                }
                if (permCollection.indexOf("MANAGE_GUILD") >= 0) {
                    serverRank = "Server Manager";
                }
                else if (permCollection.indexOf("KICK_MEMBERS") >= 0 &&
                    permCollection.indexOf("BAN_MEMBERS") >= 0) {
                    serverRank = "Moderator";
                }
            }
            if (serverRank) {
                whoisEmbed.addField("Special", serverRank);
            }
            //This section checks for the three notable main Discord perks and lists them in, what is in my opinion, the most prominent order
            //Partnered server only
            if (words.indexOf("Discord Certified Moderator") === -1 &&
                words.indexOf("Discord Employee") === -1 &&
                words.indexOf("Partnered Server Owner") >= 0) {
                partner = "Partnered Server Owner";
                whoisEmbed.addFields({
                    name: "Big Boi Status",
                    value: `${partner}`,
                });
            }
            //Discord Employee only
            if (words.indexOf("Discord Certified Moderator") === -1 &&
                words.indexOf("Discord Employee") >= 0 &&
                words.indexOf("Partnered Server Owner") === -1) {
                discoEmployee = "Discord Employee";
                whoisEmbed.addFields({
                    name: "Special",
                    value: `${discoEmployee}`,
                });
            }
            //Discord cert. mod only
            if (words.indexOf("Discord Certified Moderator") >= 0 &&
                words.indexOf("Discord Employee") == -1 &&
                words.indexOf("Partnered Server Owner") === -1) {
                moderator = "Discord Certified Moderator";
                whoisEmbed.addFields({
                    name: "Special",
                    value: `${moderator}`,
                });
            }
            //Discord Employee AND Partner
            if (words.indexOf("Discord Certified Moderator") === -1 &&
                words.indexOf("Discord Employee") >= 0 &&
                words.indexOf("Partnered Server Owner") >= 0) {
                discoEmployee.join(`| ${partner}`);
                whoisEmbed.addFields({
                    name: "Special",
                    value: `${discoEmployee}`,
                });
            }
            //Discord Employee, Partner and Moderator
            if (words.indexOf("Discord Certified Moderator") >= 0 &&
                words.indexOf("Discord Employee") >= 0 &&
                words.indexOf("Partnered Server Owner") >= 0) {
                discoEmployee.join(`| ${partner} | ${moderator}`);
                whoisEmbed.addFields({
                    name: "Special",
                    value: `${discoEmployee}`,
                });
            }
            //Discord Partner and Moderator
            if (words.indexOf("Discord Certified Moderator") >= 0 &&
                words.indexOf("Discord Employee") === -1 &&
                words.indexOf("Partnered Server Owner") >= 0) {
                partner.join(`| ${moderator}`);
                whoisEmbed.addFields({
                    name: "Special",
                    value: `${partner}`,
                });
            }
            //If user sets detailed view to true, displays a list of what I felt to be notable permissions. i.e. What are dangerous permissions to grant.
            if (detailed) {
                let noteablePerms = new Array();
                for (let i = 0; i < permCollection.length; i++) {
                    //Couldn't really figure out a better way to do this. Basically checks each permission value in the array and if it matches to one of this, adds it to the new noteablePerms array.
                    if (permCollection[i] === "KICK_MEMBERS" ||
                        permCollection[i] === "BAN_MEMBERS" ||
                        permCollection[i] === "MANAGE_CHANNELS" ||
                        permCollection[i] === "MANAGE_GUILD" ||
                        permCollection[i] === "VIEW_AUDIT_LOG" ||
                        permCollection[i] === "PRIORITY_SPEAKER" ||
                        permCollection[i] === "MANAGE_MESSAGES" ||
                        permCollection[i] === "VIEW_GUILD_INSIGHTS" ||
                        permCollection[i] === "MUTE_MEMBERS" ||
                        permCollection[i] === "DEAFEN_MEMBERS" ||
                        permCollection[i] === "MOVE_MEMBERS" ||
                        permCollection[i] === "MANAGE_NICKNAMES" ||
                        permCollection[i] === "MANAGE_ROLES" ||
                        permCollection[i] === "MANAGE_WEBHOOKS" ||
                        permCollection[i] === "MANAGE_EMOJIS_AND_STICKERS" ||
                        permCollection[i] === "MANAGE_THREADS" ||
                        permCollection[i] === "START_EMBEDDED_ACTIVITIES") {
                        noteablePerms.push(permCollection[i]);
                    }
                }
                const permView = yield noteablePerms.map((p) => p.toLowerCase().replace(/_/g, " ").split(" "));
                sortArray(permView);
                const newView = permView.join(" ● ").replace(/,/g, " ");
                whoisEmbed.addFields({
                    name: "Notable Permissions",
                    value: `${newView}`,
                });
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