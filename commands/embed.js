"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = require("discord.js");
exports.default = {
    category: 'Testing',
    description: 'Sends an embed',
    permissions: ['ADMINISTRATOR'],
    callback: function (_a) {
        var message = _a.message, text = _a.text;
        var embed = new discord_js_1.MessageEmbed()
            .setDescription("Hello World");
        return embed;
    }
};
