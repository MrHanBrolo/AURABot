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
    slash: true,
    testOnly: true,
    callback: ({ interaction: msgInt, channel }) => __awaiter(void 0, void 0, void 0, function* () {
        const row = new discord_js_1.MessageActionRow()
            .addComponents(new discord_js_1.MessageButton()
            .setCustomId('ban_yes')
            .setEmoji('🔨')
            .setLabel('Confirm')
            .setStyle('SUCCESS'))
            .addComponents(new discord_js_1.MessageButton()
            .setCustomId('ban_no')
            .setLabel('Cancel')
            .setStyle('DANGER'));
        const linkRow = new discord_js_1.MessageActionRow()
            .addComponents(new discord_js_1.MessageButton()
            .setURL('https://google.com')
            .setLabel('Visit Google')
            .setStyle('LINK'));
        yield msgInt.reply({
            content: 'Are you sure?',
            components: [row, linkRow],
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
            var _a;
            collection.forEach((click) => {
                console.log(click.user.id, click.customId);
            });
            if (((_a = collection.first()) === null || _a === void 0 ? void 0 : _a.customId) === 'ban_yes') {
                //ban the target user
            }
            yield msgInt.editReply({
                content: 'An action has already been taken.',
                components: []
            });
        }));
    }),
};
