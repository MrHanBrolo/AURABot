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
const discord_js_1 = __importDefault(require("discord.js"));
const welcome_schema_1 = __importDefault(require("../../models/welcome-schema"));
//module.exports = {}
exports.default = {
    category: "Configuration",
    description: "Sets the welcome channel.",
    permissions: ["ADMINISTRATOR"],
    minArgs: 2,
    expectedArgs: "<channel> <text>",
    slash: "both",
    testOnly: true,
    options: [
        {
            name: "channel",
            description: "The target channel.",
            required: true,
            type: discord_js_1.default.Constants.ApplicationCommandOptionTypes.CHANNEL,
        },
        {
            name: "text",
            description: "The target channel.",
            required: true,
            type: discord_js_1.default.Constants.ApplicationCommandOptionTypes.STRING,
        },
    ],
    callback: ({ guild, message, interaction, args }) => __awaiter(void 0, void 0, void 0, function* () {
        if (!guild) {
            return "Please use this command within a server.";
        }
        const target = message
            ? message.mentions.channels.first()
            : interaction.options.getChannel("channel");
        if (!target || target.type !== "GUILD_TEXT") {
            return "Please tag a text channel.";
        }
        let text = interaction === null || interaction === void 0 ? void 0 : interaction.options.getString("text");
        if (message) {
            // !setwelcome
            //removes initial channel index for legacy
            args.shift();
            //joins rest of words into a sentence
            text = args.join(" ");
        }
        yield welcome_schema_1.default.findOneAndUpdate({ _id: guild.id }, { _id: guild.id, text, channelId: target.id }, { upsert: true });
        return "Welcome channel set!";
    }),
};
