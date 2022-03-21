"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wokcommands_1 = __importDefault(require("wokcommands"));
const path_1 = __importDefault(require("path"));
module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        new wokcommands_1.default(client, {
            commandsDir: path_1.default.join(__dirname, '../commands/'),
            typeScript: true,
            ignoreBots: true,
            testServers: ['939511826868219974'],
            botOwners: ['234885897743630336'],
            mongoUri: process.env.MONGO_URI
        });
        console.log(`Ready! Logged in as ${client.user.tag}`);
    },
};
