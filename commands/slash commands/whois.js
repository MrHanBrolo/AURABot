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
const skia_canvas_1 = require("skia-canvas");
const strings_1 = __importDefault(require("@supercharge/strings"));
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
        var _a, _b, _c;
        try {
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
            yield whois.user.fetch(true);
            let userBg = whois.user.bannerURL({ format: 'jpg', size: 1024 });
            let pres;
            //FLIP BUTTON
            const filter = (btnInt) => {
                return msgInt.user.id === btnInt.user.id;
            };
            const flipFrontRow = new discord_js_1.MessageActionRow().addComponents(new discord_js_1.MessageButton()
                .setCustomId("flipFront")
                .setLabel("Flip to Front")
                .setStyle("PRIMARY"));
            const flipBackRow = new discord_js_1.MessageActionRow().addComponents(new discord_js_1.MessageButton()
                .setCustomId("flipBack")
                .setLabel("Flip to Back")
                .setStyle("PRIMARY"));
            const flipDisabledBack = new discord_js_1.MessageActionRow().addComponents(new discord_js_1.MessageButton()
                .setCustomId("flipDisabledBack")
                .setLabel("Flip to Back")
                .setStyle("PRIMARY")
                .setDisabled());
            const flipDisabledFront = new discord_js_1.MessageActionRow().addComponents(new discord_js_1.MessageButton()
                .setCustomId("flipDisabledFront")
                .setLabel("Flip to Back")
                .setStyle("PRIMARY")
                .setDisabled());
            const helpRowWhoIs = new discord_js_1.MessageActionRow().addComponents(new discord_js_1.MessageButton()
                .setLabel("View Wiki Page")
                .setStyle("LINK")
                .setURL("https://github.com/MrHanBrolo/AURABot/wiki/Tools#whois"));
            function presence() {
                var _a;
                return __awaiter(this, void 0, void 0, function* () {
                    pres = yield ((_a = whois.presence) === null || _a === void 0 ? void 0 : _a.status);
                    console.log(pres);
                    if (pres === undefined) {
                        pres = "offline";
                        console.log(pres);
                    }
                });
            }
            presence();
            const doing = yield ((_a = whois.presence) === null || _a === void 0 ? void 0 : _a.activities);
            const userCreation = new Date(whois.user.createdAt);
            const userJoin = new Date(whois.joinedAt);
            const createdDate = userCreation.getTime();
            const joinDate = userJoin.getTime();
            const createdTimestamp = getDate(createdDate);
            const joinedTimestamp = getDate(joinDate);
            //Arrays
            const noteableStatus = new Array();
            /*
              Retrieves user roles and maps them to a new array, joining each role name into an single string seperated by a ' | ' e.g. @mod | @staff | @guineapig
            */
            const roles = yield whois.roles.cache.map((r) => `${r}`).join(" | ");
            /*
              Retrieves user flags (e.g. 'DISCORD_PARTNER') and maps them to a new array, removing the underscores, converting to lower case and
              splitting the new words up into their own array (e.g. 'discord',  'partner')
              */
            let special = yield ((_b = whois.user.flags) === null || _b === void 0 ? void 0 : _b.toArray().map((s) => s.toLowerCase().replace(/_/g, " ").split(" ")));
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
            // Text size limiter
            const applyText = (canvas, text, size) => {
                do {
                    ctx.font = `${size -= 2}pt sans-serif`;
                } while (ctx.measureText(text).width > canvas.width - 250);
                return ctx.font;
            };
            function wrapText(ctxt, text, x, y, maxWidth, lineHeight) {
                const words = text.split(' ');
                let line = '';
                for (const [index, w] of words.entries()) {
                    const testLine = line + w + ' ';
                    let limit1 = (0, strings_1.default)(testLine).limit(127, '...').get();
                    const metrics = ctxt.measureText(limit1);
                    const testWidth = metrics.width;
                    if (testWidth > maxWidth && index > 0) {
                        ctxt.fillText(line, x, y);
                        line = w + ' ';
                        y += lineHeight;
                    }
                    else {
                        line = testLine;
                    }
                    let limit = (0, strings_1.default)(line).limit(127, '...').get();
                    console.log(line);
                    ctxt.fillText(limit, x, y);
                }
            }
            // node-canvas info setup
            const mainCanvas = new skia_canvas_1.Canvas(700, 750);
            let bg;
            const blurredRect = {
                x: 130,
                y: 21,
                height: 208,
                width: 566,
                spread: 7
            };
            const ctx = mainCanvas.getContext('2d');
            if (!userBg) {
                bg = yield (0, skia_canvas_1.loadImage)('./wallpaper/AURABotWhoIsBG.png');
            }
            else {
                bg = yield (0, skia_canvas_1.loadImage)(userBg);
            }
            let presImg;
            //Dark grey rect
            ctx.strokeStyle = 'rgba(1, 1, 1, 0)';
            ctx.lineWidth = 8;
            ctx.fillStyle = '#1B1B1B';
            ctx.beginPath();
            ctx.moveTo(20, 10);
            ctx.lineTo(660, 10);
            ctx.arcTo(690, 10, 690, 70, 10);
            ctx.lineTo(690, 730);
            ctx.arcTo(690, 740, 680, 740, 10);
            ctx.lineTo(20, 740);
            ctx.arcTo(10, 740, 10, 730, 10);
            ctx.lineTo(10, 20);
            ctx.arcTo(10, 10, 20, 10, 10);
            ctx.closePath();
            ctx.stroke();
            ctx.clip();
            //Top of Card
            ctx.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
            ctx.drawImage(bg, 0, 0, 700, 250);
            ctx.fillStyle = 'rgba(35,39,42,0.75)';
            ctx.fillRect(130, 21, 566, 208);
            ctx.filter = 'blur(' + blurredRect.spread + 'px)';
            ctx.drawImage(mainCanvas, blurredRect.x, blurredRect.y, blurredRect.width, blurredRect.height, blurredRect.x, blurredRect.y, blurredRect.width, blurredRect.height);
            // Profile pic outline 
            ctx.lineWidth = 10;
            ctx.strokeStyle = '#FFFFFF';
            ctx.filter = 'none';
            ctx.beginPath();
            ctx.arc(125, 125, 100, 0.44, 1.195, true);
            ctx.arcTo(125, 125, 185, 153, 35);
            ctx.closePath();
            ctx.stroke();
            ctx.save();
            ctx.clip();
            const avatar = yield (0, skia_canvas_1.loadImage)(userPic);
            ctx.drawImage(avatar, 25, 25, 200, 200);
            //Profile Text
            ctx.restore();
            //Profile seperation line
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(0, 250);
            ctx.lineTo(700, 250);
            ctx.stroke();
            //small rect
            ctx.strokeStyle = '#383c3c';
            ctx.fillStyle = '#383c3c';
            ctx.beginPath();
            ctx.moveTo(40, 280);
            ctx.lineTo(660, 280);
            ctx.arcTo(670, 280, 670, 350, 10);
            ctx.lineTo(670, 410);
            ctx.arcTo(670, 420, 660, 420, 10);
            ctx.lineTo(40, 420);
            ctx.arcTo(30, 420, 30, 410, 10);
            ctx.lineTo(30, 290);
            ctx.arcTo(30, 280, 40, 280, 10);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
            //Profile Text
            ctx.font = '40px sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.fillText('Profile', mainCanvas.width / 3, mainCanvas.height / 9);
            //User tag text
            ctx.font = applyText(mainCanvas, whois.user.tag, 60);
            ctx.fillText(whois.user.tag, mainCanvas.width / 2.9, mainCanvas.height / 5.8);
            //Presence icons
            switch (pres) {
                case "dnd":
                    presImg = yield (0, skia_canvas_1.loadImage)("https://i.imgur.com/loJ3Xb1.png");
                    ctx.drawImage(presImg, 169, 173, 44, 44);
                    break;
                case "offline":
                    presImg = yield (0, skia_canvas_1.loadImage)("https://i.imgur.com/UhQ3IW8.png");
                    ctx.drawImage(presImg, 169, 173, 44, 44);
                    break;
                case "idle":
                    presImg = yield (0, skia_canvas_1.loadImage)("https://i.imgur.com/Ju8DKov.png");
                    ctx.drawImage(presImg, 169, 173, 44, 44);
                    break;
                case "online":
                    presImg = yield (0, skia_canvas_1.loadImage)("https://i.imgur.com/Pup1yF6.png");
                    ctx.drawImage(presImg, 169, 173, 44, 44);
                    break;
            }
            if (doing === null || doing === void 0 ? void 0 : doing.length) {
                const spl = yield (0, skia_canvas_1.loadImage)('https://i.imgur.com/k4s5Nq9.png');
                const gam = yield (0, skia_canvas_1.loadImage)('https://i.imgur.com/QNGFoqu.png');
                const activities = new Array();
                // 
                doing.forEach(activity => {
                    activities.push({
                        name: activity.name,
                        details: activity.details,
                        state: activity.state,
                        type: activity.type
                    });
                });
                console.log(activities);
                console.log(doing);
                const playing = yield activities.find(a => a.type === "PLAYING");
                const listening = yield activities.find(a => a.type === "LISTENING");
                const custom = yield activities.find(a => a.type === "CUSTOM");
                // playing game
                if (playing && !listening && !custom) {
                    ctx.drawImage(gam, mainCanvas.width / 1.95, mainCanvas.height / 16.9, 44, 44);
                    ctx.font = "18pt sans-serif";
                    wrapText(ctx, `Currently ${playing.type.toLowerCase()} ${playing.name}`, mainCanvas.width / 11.5, mainCanvas.height / 2.3, 650, 30);
                }
                // listening to music
                else if (listening && !playing && !custom) {
                    ctx.drawImage(spl, mainCanvas.width / 2.03, mainCanvas.height / 13.4, 43.52, 32);
                    ctx.font = "18pt sans-serif";
                    wrapText(ctx, `Listening to ${listening.details} by ${listening.state}`, mainCanvas.width / 11.5, mainCanvas.height / 2.3, 600, 30);
                }
                //custom status
                else if (custom && !listening && !playing) {
                    ctx.font = "18pt sans-serif";
                    wrapText(ctx, `Currently doing...in...on? ${custom.state}`, mainCanvas.width / 11.5, mainCanvas.height / 2.3, 650, 30);
                }
                //playing game and listening to music
                else if (playing && listening && !custom) {
                    ctx.drawImage(spl, mainCanvas.width / 2.03, mainCanvas.height / 13.4, 43.52, 32);
                    ctx.drawImage(gam, mainCanvas.width / 1.80, mainCanvas.height / 16.5, 44, 44);
                    ctx.font = "18pt sans-serif";
                    wrapText(ctx, `Playing ${playing.name} and listening to ${listening.details} by ${listening.state}`, mainCanvas.width / 11.5, mainCanvas.height / 2.3, 620, 30);
                }
                //playing game and custom status
                else if (playing && custom && !listening) {
                    ctx.font = "18pt sans-serif";
                    wrapText(ctx, `Playing ${playing.name} and...doing...in..on? ${custom.state}`, mainCanvas.width / 11.5, mainCanvas.height / 2.3, mainCanvas.width - 50, 30);
                }
                //playing game and custom status and listening to music
                else if (playing && custom && listening) {
                    ctx.drawImage(spl, mainCanvas.width / 2.03, mainCanvas.height / 13.4, 43.52, 32);
                    ctx.drawImage(gam, mainCanvas.width / 1.80, mainCanvas.height / 16.5, 44, 44);
                    ctx.font = "18pt sans-serif";
                    wrapText(ctx, `Playing ${playing.name}, ${custom.state} and listening to ${listening.details} by ${listening.state}.`, mainCanvas.width / 11.5, mainCanvas.height / 2.3, 620, 30);
                }
            }
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
            //Embed to display card
            const frontCard = new discord_js_1.MessageEmbed()
                .setColor("#2f3136")
                .setTimestamp()
                .setFooter("Collect 'em all!");
            // Embed to display additional information
            const backCard = new discord_js_1.MessageEmbed()
                .setColor("#2f3136")
                .setTimestamp()
                .setFooter(`Brought to you by @AURABot`);
            backCard.addFields({
                name: "Date user joined 🕔",
                value: `<t:${joinedTimestamp}:f>`,
                inline: true,
            }, {
                name: "Account creation date 🕛",
                value: `<t:${createdTimestamp}:f>`,
                inline: true,
            }, {
                name: `This user has [${roleCount.length}] roles: 🏷️`,
                value: newRoles,
            });
            /*
      
                Simply implemented, but this section will basically assign the highest level of privilege to a new field called "special"
                and list it.
      
            */
            // Checks if server owner and sets rank to this
            if (whois.id === ((_c = msgInt.guild) === null || _c === void 0 ? void 0 : _c.ownerId)) {
                serverRank = "Server Owner 👑";
                // ctx.font = applyText(canvas, "Server Owner 👑")
                // ctx.fillStyle = '#ffffff'
            }
            if (!serverRank) {
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
                backCard.addField("Special", serverRank);
            }
            //This section checks for the three notable main Discord perks and lists them in, what is in my opinion, the most prominent order
            //Partnered server owner
            if (words.indexOf("Partnered Server Owner") >= 0) {
                partner = "Partnered Server Owner";
                noteableStatus.push(partner);
            }
            //Discord Employee
            if (words.indexOf("Discord Employee") >= 0) {
                discoEmployee = "Discord Employee";
                noteableStatus.push(discoEmployee);
            }
            //Discord cert. mod
            if (words.indexOf("Discord Certified Moderator") >= 0) {
                moderator = "Discord Certified Moderator";
                noteableStatus.push(moderator);
            }
            if (noteableStatus.length > 0) {
                const noteableString = noteableStatus.join(" | ");
                backCard.addFields({
                    name: "Notable Other",
                    value: `${noteableString}`,
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
                backCard.addFields({
                    name: "Notable Permissions",
                    value: `${newView}`,
                });
            }
            const attachment = new discord_js_1.MessageAttachment(yield mainCanvas.toBuffer('png'), 'profile-image.png');
            frontCard
                .setImage('attachment://profile-image.png');
            const collector = channel.createMessageComponentCollector({
                filter,
                time: 1000 * 45,
            });
            yield msgInt.reply({ files: [attachment], components: [flipBackRow, helpRowWhoIs] });
            collector.on("collect", i => {
                if (i.user.id === msgInt.user.id) {
                    if (i.customId === "flipBack") {
                        console.log("flipping to back");
                        i.update({ embeds: [backCard], attachments: [], components: [flipFrontRow, helpRowWhoIs] });
                    }
                    if (i.customId === "flipFront") {
                        console.log("flipping to front");
                        i.update({ files: [attachment], embeds: [], components: [flipBackRow, helpRowWhoIs] });
                    }
                }
                else {
                    i.reply({ content: `These buttons aren't for you!`, ephemeral: true });
                }
            });
            collector.on("end", (collection) => __awaiter(void 0, void 0, void 0, function* () {
                var _d, _e, _f;
                console.log((_d = collection.last()) === null || _d === void 0 ? void 0 : _d.customId);
                if (((_e = collection.last()) === null || _e === void 0 ? void 0 : _e.customId) == "flipBack") {
                    yield msgInt.editReply({ embeds: [backCard], attachments: [], components: [flipDisabledFront, helpRowWhoIs] });
                }
                if (((_f = collection.last()) === null || _f === void 0 ? void 0 : _f.customId) == "flipFront") {
                    yield msgInt.editReply({ embeds: [], files: [attachment], components: [flipDisabledBack, helpRowWhoIs] });
                }
                if (collection.last() == undefined) {
                    yield msgInt.editReply({ components: [flipDisabledBack, helpRowWhoIs] });
                }
            }));
        }
        catch (error) {
            console.log(error);
            if (error instanceof TypeError &&
                error.name === "TypeError [COMMAND_INTERACTION_OPTION_EMPTY]") {
                msgInt.reply({
                    content: "User is not in guild.",
                    components: [],
                });
            }
            if (error instanceof TypeError &&
                error.name === "TypeError [INTERACION_NOT_REPLIED]") {
                msgInt.reply({
                    content: "Unable to perform command.",
                    components: [],
                });
            }
        }
    }),
};
