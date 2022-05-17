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
const discord_js_2 = require("discord.js");
exports.default = {
    category: 'Testing',
    description: 'Testing',
    slash: true,
    testOnly: true,
    options: [
        {
            name: 'appeal',
            description: 'Fill out and send ban appeal form',
            type: 1,
            options: [
                {
                    name: 'ban-date',
                    description: 'When you were banned',
                    type: 3,
                    required: true,
                },
                {
                    name: 'ban-reason',
                    description: 'The reason for your ban.',
                    type: 3,
                    required: true,
                },
                {
                    name: 'ban-issuer',
                    description: 'The person who issued your ban.',
                    type: 3,
                    required: true,
                },
                {
                    name: 'warnings',
                    description: 'How many warnings you were given before the ban.',
                    type: 4,
                    required: true,
                },
                {
                    name: 'reason-for-ban-lift',
                    description: 'Why we should lift the ban.',
                    type: 3,
                    required: true,
                }
            ]
        }
    ],
    callback: ({ interaction: msgInt, channel }) => __awaiter(void 0, void 0, void 0, function* () {
        const confirmationRow = new discord_js_1.MessageActionRow()
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
            components: [confirmationRow],
            ephemeral: true
        });
        const filter = (btnInt) => {
            return msgInt.user.id === btnInt.user.id;
        };
        console.log(filter);
        const collector = channel.createMessageComponentCollector({
            filter,
            max: 1,
            time: 1000 * 15
        });
        collector.on('end', (collection) => __awaiter(void 0, void 0, void 0, function* () {
            collection.forEach(() => {
                var _a, _b;
                if (((_a = collection.first()) === null || _a === void 0 ? void 0 : _a.customId) === 'punish_yes') {
                    const banDate = msgInt.options.getString('ban-date', true);
                    const banReason = msgInt.options.getString('ban-reason', true);
                    const banIssuer = msgInt.options.getString('ban-issuer', true);
                    const warnings = msgInt.options.getInteger('warnings', true);
                    const banLift = msgInt.options.getString('reason-for-ban-lift', true);
                    const appealEmbed = new discord_js_2.MessageEmbed()
                        .setColor('#76b900')
                        .setTitle('Ban Appeal Form')
                        .setAuthor(msgInt.user.tag)
                        .setDescription(`User ID: ${msgInt.user.id}`)
                        .addFields({
                        name: 'Date user was banned:',
                        value: banDate
                    }, {
                        name: 'Reason user was banned:',
                        value: banReason
                    }, {
                        name: 'Who banned the user:',
                        value: banIssuer
                    }, {
                        name: 'No. of warnings user was given before ban:',
                        value: `${warnings}`
                    }, {
                        name: 'Reason for ban lift given by user:',
                        value: banLift
                    })
                        .setThumbnail('https://img.ibxk.com.br/2020/02/04/04155339211586.jpg?w=1120&h=420&mode=crop&scale=both')
                        .setTimestamp();
                    msgInt.editReply({
                        content: 'Application submitted.',
                        components: []
                    });
                    channel.send({ embeds: [appealEmbed] });
                }
                // Cancel message if user chickens out
                else if (((_b = collection.first()) === null || _b === void 0 ? void 0 : _b.customId) === 'punish_no') {
                    msgInt.editReply({
                        content: 'Application cancelled',
                        components: []
                    });
                }
            });
        }));
    })
};
