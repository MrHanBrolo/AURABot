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
    category: "Testing",
    description: "Moderation Tool for ban / kick / mute",
    slash: true,
    testOnly: true,
    options: [
        {
            name: "ban",
            description: "Permanently ban a user from the server.",
            type: 1,
            options: [
                {
                    name: "user",
                    description: "The user you want to ban.",
                    type: 6,
                    required: true,
                },
                {
                    name: "reason",
                    description: "Why you want to ban them.",
                    type: 3,
                    required: true,
                },
            ],
        },
        {
            name: "kick",
            description: "Kick a user from the server.",
            type: 1,
            options: [
                {
                    name: "user",
                    description: "The user you want to ban.",
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
            description: "Assigns a muted role to the user.",
            type: 1,
            options: [
                {
                    name: "user",
                    description: "The user you want to mute.",
                    type: 6,
                    required: true,
                },
                {
                    name: "time",
                    description: "How long you want to mute the user for.",
                    type: 3,
                    required: false,
                },
                {
                    name: "reason",
                    description: "Why you want to ban them (optionl, but recommended if its not an emergency).",
                    type: 3,
                    required: false,
                },
            ],
        },
    ],
    callback: ({ interaction: msgInt, channel }) => __awaiter(void 0, void 0, void 0, function* () {
        const timeElapsed = Date.now();
        const unixTimestamp = Math.floor(new Date(timeElapsed).getTime() / 1000);
        const punished = msgInt.options.getMember("user", true);
        const rsn = msgInt.options.getString("reason", false);
        const punishment = msgInt.options.getSubcommand();
        const time = msgInt.options.getString("time");
        const kicker = msgInt.user.tag;
        let sent = false;
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
            var _a, _b, _c, _d, _e;
            try {
                if (((_a = collection.first()) === null || _a === void 0 ? void 0 : _a.customId) === "punish_yes") {
                    // command checks
                    const punishedEmbed = new discord_js_1.MessageEmbed()
                        .setColor("#76b900")
                        .setAuthor(`Action performed by: ${kicker}`)
                        .setTimestamp()
                        .setFooter("Remember to behave!");
                    //Checks if specified user is able to be punished and exists in the server
                    if (!punished.kickable || !punished.bannable) {
                        throw `You can't ${punishment} this user!`;
                    }
                    switch (punishment) {
                        /////////////////////////////////////////////////////////////////////// KICK
                        /////////////////////////////////////////////////////////////////////// KICK
                        /////////////////////////////////////////////////////////////////////// KICK 
                        case "kick":
                            //Tries to DM user and sends reason if provided - continues if not
                            try {
                                punishedEmbed.setTitle("You have been kicked");
                                if (rsn) {
                                    punishedEmbed.addField("Reason for kicking", `${rsn}`);
                                    yield (punished === null || punished === void 0 ? void 0 : punished.send({ embeds: [punishedEmbed] }));
                                }
                                else {
                                    punishedEmbed.addField("Reason for kicking", "No reason given");
                                    yield (punished === null || punished === void 0 ? void 0 : punished.send({ embeds: [punishedEmbed] }));
                                }
                                sent = true;
                            }
                            catch (err) { }
                            yield ((_b = msgInt.guild) === null || _b === void 0 ? void 0 : _b.members.kick(punished).then(() => __awaiter(void 0, void 0, void 0, function* () {
                                punishedEmbed.setTitle("User was kicked");
                                punishedEmbed.setDescription(`${punished} was kicked from the server`);
                                channel.send({ embeds: [punishedEmbed] });
                                if (sent) {
                                    yield msgInt.editReply({
                                        content: "Completed.",
                                        components: [],
                                    });
                                    return;
                                }
                                else if (!sent) {
                                    yield msgInt.editReply({
                                        content: "Completed but unable to DM user.",
                                        components: [],
                                    });
                                    return;
                                }
                            })));
                            return;
                        /////////////////////////////////////////////////////////////////////// MUTE
                        /////////////////////////////////////////////////////////////////////// MUTE
                        /////////////////////////////////////////////////////////////////////// MUTE
                        case "mute":
                            const muted = (_c = msgInt.guild) === null || _c === void 0 ? void 0 : _c.roles.cache.find((role) => role.name === "muted");
                            //Check user isn't muted already
                            if (punished.roles.cache.some((role) => role.name === "muted")) {
                                throw `already ${punishment}ed`;
                            }
                            if (time) {
                                /////////////// WRONG INPUT CHECKING - DON'T TOUCH THIS SHIT
                                const timed = time.toLowerCase(); //converts input
                                const search = timed.match(/(\d+|[^\d]+)/g); // basically seperates num from chars e.g. ['20', 'asdaf'] when given 20asdaf
                                let defaultTime;
                                if (search[1] === undefined) {
                                    defaultTime = search[0].split("");
                                }
                                else {
                                    defaultTime = search[1].split("");
                                }
                                const letter = new Array("h", "d", "m");
                                const nolength = letter.some((i) => defaultTime === null || defaultTime === void 0 ? void 0 : defaultTime.includes(i));
                                if (nolength) {
                                    const day = yield defaultTime.indexOf("h");
                                    const hour = yield defaultTime.indexOf("m");
                                    const minute = yield defaultTime.indexOf("d");
                                    const arr = new Array(day, hour, minute);
                                    for (var i = arr.length - 1; i >= 0; i--) {
                                        if (arr[i] < 0) {
                                            arr[i] = arr[arr.length - 1];
                                            arr.pop();
                                        }
                                    }
                                    const minValue = Math.min.apply(null, arr);
                                    search === null || search === void 0 ? void 0 : search.pop();
                                    const newTime = defaultTime[minValue];
                                    search === null || search === void 0 ? void 0 : search.push(newTime);
                                }
                                /////////////// WRONG INPUT CHECKING - END OF THAT SHIT
                                const newTimer = parseInt(search[0]);
                                if (!nolength && isNaN(newTimer)) {
                                    console.log("caught at input");
                                    throw "Invalid input";
                                }
                                if ((newTimer > 20160 && search[1] === "m") ||
                                    (newTimer > 336 && search[1] === "h") ||
                                    (newTimer > 14 && search[1] === "d")) {
                                    console.log("caught at time");
                                    throw "toolong";
                                }
                                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////Hours
                                if (search[1] === "h") {
                                    console.log("set to hours");
                                    const countDown = newTimer * 3600000;
                                    const punishtime = unixTimestamp + countDown / 1000;
                                    try {
                                        punishedEmbed.setTitle("You have been muted");
                                        if (rsn) {
                                            punishedEmbed.addField("Reason for mute", `${rsn}`);
                                            yield (punished === null || punished === void 0 ? void 0 : punished.send({ embeds: [punishedEmbed] }));
                                        }
                                        else {
                                            punishedEmbed.addField("Reason for mute", "No reason given");
                                            yield (punished === null || punished === void 0 ? void 0 : punished.send({ embeds: [punishedEmbed] }));
                                        }
                                        sent = true;
                                    }
                                    catch (err) { }
                                    yield punished.roles.add(muted.id).then(() => __awaiter(void 0, void 0, void 0, function* () {
                                        punishedEmbed.setTitle("User was muted");
                                        if (rsn) {
                                            punishedEmbed.setDescription(`${punished} was muted on the server until <t:${punishtime}:f>`);
                                            channel.send({ embeds: [punishedEmbed] });
                                        }
                                        else {
                                            punishedEmbed.setDescription(`${punished} was muted until <t:${punishtime}:f> because ${kicker} said so.`);
                                            channel.send({ embeds: [punishedEmbed] });
                                        }
                                        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                                            punished.roles.remove(muted.id);
                                            punishedEmbed.setTimestamp();
                                            try {
                                                punishedEmbed.setTitle("User was unmuted");
                                                punishedEmbed.setDescription(`You are no longer muted on the server.`);
                                                yield (punished === null || punished === void 0 ? void 0 : punished.send({ embeds: [punishedEmbed] }));
                                                sent = true;
                                            }
                                            catch (err) { }
                                            punishedEmbed.setDescription(`${punished} has served their time and been unmuted.`);
                                            channel.send({ embeds: [punishedEmbed] });
                                        }), countDown);
                                        if (sent) {
                                            yield msgInt.editReply({
                                                content: "Completed.",
                                                components: [],
                                            });
                                            return;
                                        }
                                        else if (!sent) {
                                            yield msgInt.editReply({
                                                content: "Completed but unable to DM user.",
                                                components: [],
                                            });
                                        }
                                        return;
                                    }));
                                    return;
                                }
                                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////Days
                                if (search[1] === "d") {
                                    const countDown = newTimer * 86400000;
                                    const punishtime = unixTimestamp + countDown / 1000;
                                    try {
                                        punishedEmbed.setTitle("You have been muted");
                                        if (rsn) {
                                            punishedEmbed.addField("Reason for mute", `${rsn}`);
                                            yield (punished === null || punished === void 0 ? void 0 : punished.send({ embeds: [punishedEmbed] }));
                                        }
                                        else {
                                            punishedEmbed.addField("Reason for mute", "No reason given");
                                            yield (punished === null || punished === void 0 ? void 0 : punished.send({ embeds: [punishedEmbed] }));
                                        }
                                        sent = true;
                                    }
                                    catch (err) { }
                                    yield punished.roles.add(muted.id).then(() => __awaiter(void 0, void 0, void 0, function* () {
                                        punishedEmbed.setTitle("User was muted");
                                        if (rsn) {
                                            punishedEmbed.setDescription(`${punished} was muted on the server until <t:${punishtime}:f>`);
                                            channel.send({ embeds: [punishedEmbed] });
                                        }
                                        else {
                                            punishedEmbed.setDescription(`${punished} was muted until <t:${punishtime}:f> because ${kicker} said so.`);
                                            channel.send({ embeds: [punishedEmbed] });
                                        }
                                        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                                            punished.roles.remove(muted.id);
                                            punishedEmbed.setTimestamp();
                                            try {
                                                punishedEmbed.setTitle("User was unmuted");
                                                punishedEmbed.setDescription(`You are no longer muted on the server.`);
                                                yield (punished === null || punished === void 0 ? void 0 : punished.send({ embeds: [punishedEmbed] }));
                                                sent = true;
                                            }
                                            catch (err) { }
                                            punishedEmbed.setDescription(`${punished} has served their time and been unmuted.`);
                                            channel.send({ embeds: [punishedEmbed] });
                                        }), countDown);
                                        if (sent) {
                                            yield msgInt.editReply({
                                                content: "Completed.",
                                                components: [],
                                            });
                                            return;
                                        }
                                        else if (!sent) {
                                            yield msgInt.editReply({
                                                content: "Completed but unable to DM user.",
                                                components: [],
                                            });
                                        }
                                        return;
                                    }));
                                    return;
                                    //Minutes
                                }
                                if (search[1] === "m" || !nolength) {
                                    console.log(newTimer);
                                    const countDown = newTimer * 60000;
                                    const punishtime = unixTimestamp + countDown / 1000;
                                    try {
                                        punishedEmbed.setTitle("You have been muted");
                                        if (rsn) {
                                            punishedEmbed.addField("Reason for mute", `${rsn}`);
                                            yield (punished === null || punished === void 0 ? void 0 : punished.send({ embeds: [punishedEmbed] }));
                                        }
                                        else {
                                            punishedEmbed.addField("Reason for mute", "No reason given");
                                            yield (punished === null || punished === void 0 ? void 0 : punished.send({ embeds: [punishedEmbed] }));
                                        }
                                        sent = true;
                                    }
                                    catch (err) { }
                                    yield punished.roles.add(muted.id).then(() => __awaiter(void 0, void 0, void 0, function* () {
                                        punishedEmbed.setTitle("User was muted");
                                        if (rsn) {
                                            punishedEmbed.setDescription(`${punished} was muted on the server until <t:${punishtime}:f>`);
                                            channel.send({ embeds: [punishedEmbed] });
                                        }
                                        else {
                                            punishedEmbed.setDescription(`${punished} was muted until <t:${punishtime}:f> because ${kicker} said so.`);
                                            channel.send({ embeds: [punishedEmbed] });
                                        }
                                        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                                            punished.roles.remove(muted.id);
                                            punishedEmbed.setTimestamp();
                                            try {
                                                punishedEmbed.setTitle("User was unmuted");
                                                punishedEmbed.setDescription(`You are no longer muted on the server.`);
                                                yield (punished === null || punished === void 0 ? void 0 : punished.send({ embeds: [punishedEmbed] }));
                                            }
                                            catch (err) { }
                                            punishedEmbed.setDescription(`${punished} has served their time and been unmuted on <t:${punishtime}:f>.`);
                                            channel.send({ embeds: [punishedEmbed] });
                                        }), countDown);
                                        if (sent) {
                                            yield msgInt.editReply({
                                                content: "Completed.",
                                                components: [],
                                            });
                                            return;
                                        }
                                        else if (!sent) {
                                            yield msgInt.editReply({
                                                content: "Completed but unable to DM user.",
                                                components: [],
                                            });
                                        }
                                        return;
                                    }));
                                }
                            }
                            else if (!time) {
                                try {
                                    punishedEmbed.setTitle("You have been muted");
                                    if (rsn) {
                                        punishedEmbed.addField("Reason for mute", `${rsn}`);
                                        yield (punished === null || punished === void 0 ? void 0 : punished.send({ embeds: [punishedEmbed] }));
                                    }
                                    else {
                                        punishedEmbed.addField("Reason for mute", "No reason given");
                                        yield (punished === null || punished === void 0 ? void 0 : punished.send({ embeds: [punishedEmbed] }));
                                    }
                                    sent = true;
                                }
                                catch (err) { }
                                yield punished.roles.add(muted.id).then(() => __awaiter(void 0, void 0, void 0, function* () {
                                    punishedEmbed.setTitle("User was muted");
                                    if (rsn) {
                                        punishedEmbed.setDescription(`${punished} was muted on the server.`);
                                        channel.send({ embeds: [punishedEmbed] });
                                    }
                                    else {
                                        punishedEmbed.setDescription(`${punished} was muted until because ${kicker} said they were behaving badly.`);
                                        channel.send({ embeds: [punishedEmbed] });
                                    }
                                    if (sent) {
                                        yield msgInt.editReply({
                                            content: "Completed.",
                                            components: [],
                                        });
                                        return;
                                    }
                                    else if (!sent) {
                                        yield msgInt.editReply({
                                            content: "Completed but unable to DM user.",
                                            components: [],
                                        });
                                    }
                                }));
                            }
                            return;
                        /////////////////////////////////////////////////////////////////////// BAN
                        /////////////////////////////////////////////////////////////////////// BAN
                        /////////////////////////////////////////////////////////////////////// BAN
                        case "ban":
                            //Waits for member kick then sends embed giving details
                            yield ((_d = msgInt.guild) === null || _d === void 0 ? void 0 : _d.members.ban(punished).then(() => __awaiter(void 0, void 0, void 0, function* () {
                                punishedEmbed.setTitle("User was banned");
                                punishedEmbed.setDescription(`${punished} was banned from the server`);
                                //if a reason is included, else none
                                if (rsn) {
                                    punishedEmbed.addField("Reason for Ban", `${rsn}`);
                                    channel.send({ embeds: [punishedEmbed] });
                                }
                                else {
                                    punishedEmbed.addField("Reason for Ban", "No reason given");
                                    channel.send({ embeds: [punishedEmbed] });
                                }
                                yield (punished === null || punished === void 0 ? void 0 : punished.send(`You have been banned from the test server because: ${rsn}`).catch());
                                yield msgInt.editReply({
                                    content: "Completed.",
                                    components: [],
                                });
                                return;
                            })));
                            return;
                    }
                }
                else if (((_e = collection.first()) === null || _e === void 0 ? void 0 : _e.customId) === "punish_no") {
                    msgInt.editReply({
                        content: "Action cancelled",
                        components: [],
                    });
                }
            }
            catch (error) {
                switch (error) {
                    case `You can't ${punishment} this user!`:
                        msgInt.editReply({
                            content: `You can't ${punishment} this user!`,
                            components: [],
                        });
                        break;
                    case `already ${punishment}ed`:
                        yield msgInt.editReply({
                            content: `${punished} is already ${punishment}ed.`,
                            components: [],
                        });
                        break;
                    case "toolong":
                        yield msgInt.editReply({
                            content: "Time must be less than 14 days. E.g. 3d, 1300m, 8h.",
                            components: [],
                        });
                        break;
                    case "Invalid input":
                        yield msgInt.editReply({
                            content: "Time must be specified as <number><d , m , h> OR <number>(will default to minutes).",
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
