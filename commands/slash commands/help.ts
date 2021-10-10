import {
    MessageComponentInteraction,
    MessageSelectMenu,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
  } from "discord.js";
  import { ICommand } from "wokcommands";
  
  export default {
    category: "Tools",
    description: "View available commands",
    slash: true,
    testOnly: true,
  
    callback: async ({ interaction: msgInt, channel }) => {
      const muted = msgInt.guild?.roles.cache.find(
        (role) => role.name === "muted"
      );
  
      const undo = msgInt.options.getSubcommand();
      const timeElapsed = Date.now();
      const unixTimestamp = Math.floor(new Date(timeElapsed).getTime() / 1000);
      const kicker = msgInt.user.tag;
      const mutedUser = new Array();
  
      const mutedMenu = new MessageSelectMenu()
        .setCustomId("mutedusers")
        .setPlaceholder("None Selected");
  
      const categoryRow = new MessageActionRow();
    
      const filter = (btnInt: MessageComponentInteraction) => {
        return msgInt.user.id === btnInt.user.id;
      };
      const collector = channel.createMessageComponentCollector({
        filter,
        max: 1,
        time: 1000 * 15,
      });
  
      const unpunishedEmbed = new MessageEmbed()
        .setColor("#76b900")
        .setAuthor(`Action performed by: ${kicker}`)
        .setTimestamp()
        .setFooter("Remember to behave!");
  
      console.log("verified input");
  
      try {
        








      } catch (error) {
        switch (error) {
          case "User is not muted.":
            msgInt.editReply({
              content: "User is not muted!",
              components: [],
            });
            break;
  
          case "No users are muted in this server!":
            msgInt.editReply({
              content: "No users are muted in this server!",
              components: [],
            });
            break;
  
          case "User is not banned.":
            await msgInt.editReply({
              content: "User is not currently banned from the guild!",
              components: [],
            });
            break;
        }
        if (
          error instanceof TypeError &&
          error.name === "TypeError [COMMAND_INTERACTION_OPTION_EMPTY]"
        ) {
          msgInt.editReply({
            content: "User is not in guild.",
            components: [],
          });
        }
      }
    },
  } as ICommand;
  