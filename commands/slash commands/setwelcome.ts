import DJS from "discord.js";
import { ICommand } from "wokcommands";
import welcomeSchema from "../../models/guild-schema";

//module.exports = {}
export default {
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
      type: DJS.Constants.ApplicationCommandOptionTypes.CHANNEL,
    },
    {
      name: "text",
      description: "The target channel.",
      required: true,
      type: DJS.Constants.ApplicationCommandOptionTypes.STRING,
    },
  ],

  callback: async ({ guild, message, interaction, args }) => {
    if (!guild) {
      return "Please use this command within a server.";
    }
    const target = message
      ? message.mentions.channels.first()
      : interaction.options.getChannel("channel");
    if (!target || target.type !== "GUILD_TEXT") {
      return "Please tag a text channel.";
    }

    let text = interaction?.options.getString("text");
    if (message) {
      // !setwelcome
      //removes initial channel index for legacy
      args.shift();
      //joins rest of words into a sentence
      text = args.join(" ");
    }

    await welcomeSchema.findOneAndUpdate(
      { _id: guild.id },
      { _id: guild.id, text, channelId: target.id },
      { upsert: true }
    );

    return "Welcome channel set!";
  },
} as ICommand;
