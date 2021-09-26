"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    category: 'Testing',
    description: 'Testing',
    callback: ({ message, channel }) => {
        message.reply('Enter your username');
        const filter = (m) => {
            return m.author.id === message.author.id;
        };
        const collector = channel.createMessageCollector({
            filter,
            max: 1,
            time: 1000 * 20
        });
        collector.on('collect', message => {
            console.log(message.content);
        });
        collector.on('end', collected => {
            if (collected.size === 0) {
                message.reply('You did not provide your username.');
                return;
            }
            let text = 'Collected:\n\n';
            collected.forEach((message) => {
                text += `${message.content}\n`;
            });
            message.reply(text);
        });
    }
};
