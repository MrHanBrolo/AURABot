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
    category: 'Testing',
    description: 'Testing',
    default_permission: ['ADMINISTRATOR'],
    slash: true,
    testOnly: true,
    options: [
        {
            name: 'ban',
            description: 'Permanently ban a user from the server.',
            type: 1,
            options: [
                {
                    name: 'user',
                    description: 'The user you want to ban.',
                    type: 6,
                    required: true,
                },
                {
                    name: 'reason',
                    description: 'Why you want to ban them.',
                    type: 3,
                    required: true,
                }
            ]
        },
        {
            name: 'kick',
            description: 'Kick a user from the server.',
            type: 1,
            options: [
                {
                    name: 'user',
                    description: 'The user you want to ban.',
                    type: 6,
                    required: true,
                },
                {
                    name: 'reason',
                    description: 'Why you want to ban them.',
                    type: 3,
                    required: false,
                }
            ]
        },
        {
            name: 'mute',
            description: 'Assigns a muted role to the user.',
            type: 1,
            options: [
                {
                    name: 'user',
                    description: 'The user you want to mute.',
                    type: 6,
                    required: true,
                },
                {
                    name: 'reason',
                    description: 'Why you want to ban them (optionl, but recommended if its not an emergency).',
                    type: 3,
                    required: false,
                }
            ]
        }
    ],
    callback: ({ interaction: msgInt, channel }) => __awaiter(void 0, void 0, void 0, function* () {
        const punishRow = new discord_js_1.MessageActionRow()
            .addComponents(new discord_js_1.MessageButton()
            .setCustomId('punish_yes')
            .setLabel('Confirm')
            .setStyle('SUCCESS'))
            .addComponents(new discord_js_1.MessageButton()
            .setCustomId('punish_no')
            .setLabel('Cancel')
            .setStyle('DANGER'));
        yield msgInt.reply({
            content: 'Are you sure?',
            components: [punishRow],
            ephemeral: true
        });
        const filter = (btnInt) => {
            return msgInt.user.id === btnInt.user.id;
        };
        const collector = channel.createMessageComponentCollector({
            filter,
            max: 1,
            time: 1000 * 15
        });
        collector.on('end', (collection) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            collection.forEach(() => {
            });
            if (((_a = collection.first()) === null || _a === void 0 ? void 0 : _a.customId) === 'punish_yes') {
                // Check user perms
                const punished = msgInt.options.getUser('user', true);
                const rsn = msgInt.options.getString('reason', false);
                const kicker = msgInt.user.tag;
                const punishedEmbed = new discord_js_1.MessageEmbed()
                    .setColor('#76b900')
                    .setAuthor(`Action performed by: ${kicker}`)
                    .setTimestamp()
                    .setFooter('Remember to behave!');
                //Kicks the target user
                //Gets the user
                switch (msgInt.options.getSubcommand()) {
                    case ('kick'):
                        //Tries to DM user and sends reason if provided - continues if not
                        try {
                            yield punished.send(`You have been kicked from the test server because: ${rsn}`);
                        }
                        catch (err) {
                            console.log('User kicked but unable to DM');
                        }
                        //Waits for member kick then sends embed giving details
                        yield ((_b = msgInt.guild) === null || _b === void 0 ? void 0 : _b.members.kick(punished).then(() => __awaiter(void 0, void 0, void 0, function* () {
                            punishedEmbed.setTitle('User was kicked');
                            punishedEmbed.setDescription(`${punished} was kicked from the server`);
                            //if a reason is included, else none
                            if (rsn) {
                                punishedEmbed.addField('Reason for kicking', `${rsn}`);
                                channel.send({ embeds: [punishedEmbed] });
                            }
                            else {
                                punishedEmbed.addField('Reason for kicking', 'No reason given');
                                channel.send({ embeds: [punishedEmbed] });
                            }
                            yield msgInt.editReply({
                                content: 'Completed.',
                                components: []
                            });
                        })));
                        return;
                    case ('ban'):
                        try {
                            yield punished.send(`You have been banned from the test server because: ${rsn}`);
                        }
                        catch (err) {
                            console.log('User BANNED but unable to DM');
                        }
                        //Waits for member kick then sends embed giving details
                        yield ((_c = msgInt.guild) === null || _c === void 0 ? void 0 : _c.members.ban(punished).then(() => __awaiter(void 0, void 0, void 0, function* () {
                            punishedEmbed.setTitle('User was banned');
                            punishedEmbed.setDescription(`${punished} was banned from the server`);
                            //if a reason is included, else none
                            if (rsn) {
                                punishedEmbed.addField('Reason for Ban', `${rsn}`);
                                channel.send({ embeds: [punishedEmbed] });
                            }
                            else {
                                punishedEmbed.addField('Reason for Ban', 'No reason given');
                                channel.send({ embeds: [punishedEmbed] });
                            }
                        })));
                        yield msgInt.editReply({
                            content: 'Completed.',
                            components: []
                        });
                        return;
                }
            }
            // Cancel message if user chickens out
            else if (((_d = collection.first()) === null || _d === void 0 ? void 0 : _d.customId) === 'punish_no') {
                msgInt.editReply({
                    content: 'Action cancelled',
                    components: []
                });
            }
        }));
    })
};
