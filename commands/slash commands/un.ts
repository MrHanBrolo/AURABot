import {
  MessageComponentInteraction,
  MessageSelectMenu,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from "discord.js";
import { ICommand } from "wokcommands";

export default {
  category: "Moderation",
  description: "Unbans / Mutes a user.",
  slash: true,
  testOnly: true,
  options: [
    {
      name: "ban",
      description: "Unban a user from the server.",
      type: 1,
      options: [
        {
          name: "id",
          description: "The user you want to unmute.",
          type: 3,
          required: true,
        },
      ],
    },
    {
      name: "mute",
      description: "Unmute a user from the server.",
      type: 1,
    },
  ],

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

    const userRow = new MessageActionRow();

    const punishRow = new MessageActionRow()

      .addComponents(
        new MessageButton()
          .setCustomId("punish_yes")
          .setLabel("Confirm")
          .setStyle("SUCCESS")
      )
      .addComponents(
        new MessageButton()
          .setCustomId("punish_no")
          .setLabel("Cancel")
          .setStyle("DANGER")
      );

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
      switch (undo) {
        case "mute":
          const list = await msgInt.guild?.members.fetch();
          list?.forEach((users) => {
            if (users.roles.cache.some((role) => role.name === "muted")) {
              mutedUser.push({
                label: `${users.displayName}`,
                value: `${users.id}`,
                emoji: {
                  id: null,
                  name: "🔇",
                },
              });
            }
          });
          
          if(mutedUser[0]=== undefined){
            await msgInt.reply({
              content: "No one is muted on the server!",
              components: [],
              ephemeral: true,
            });
            return
          }
          mutedMenu.maxValues = mutedUser.length;

          for (let i = 0; i < mutedUser.length; i++) {
            mutedMenu.addOptions([mutedUser[i]]);
          }
          userRow.addComponents(mutedMenu);
          const menuCollector = channel.createMessageComponentCollector({
            componentType: "SELECT_MENU",
            filter,
            max: 1,
            time: 1000 * 30,
          });

          await msgInt.reply({
            content: "Choose who to unmute",
            components: [userRow],
            ephemeral: true,
            fetchReply: true,
          });

          menuCollector.on("end", async (collection) => {
            if (collection.first()?.customId === "mutedusers") {
              let myValues = collection.first();
                  if (myValues?.isSelectMenu()) {
                    if(myValues.values.length === undefined){
                      throw "No users are muted in this server!"
                    }

                    for(let i=0; i < myValues.values.length; i++){
                      let users = await msgInt.guild?.members.fetch(myValues.values[i])
                      users?.roles.remove(muted!.id)
                      let user = users?.displayName
                      unpunishedEmbed.addFields(
                        {
                            name: `User was unmuted`,
                            value: `${user} is no longer muted on the server`
                        })
                    }
                    unpunishedEmbed.setDescription(
                      `Action performed at <t:${unixTimestamp}:f>`
                    );
                    channel.send({ embeds: [unpunishedEmbed] });
                  }
                }
                await msgInt.editReply({
                  content: "Unmuted users.",
                  components:[]
                });
              });
          return;

        case "ban":
          const userId = await msgInt.options.getString("id", true);
          const banned = await msgInt.guild?.bans.fetch();

          if (!banned?.has(userId)) {
            console.log("caught");
            throw "User is not banned.";
          } else {
            await msgInt.guild?.members.unban(userId).then(async (user) => {
              unpunishedEmbed.setDescription(
                `${user.tag} was unbanned at <t:${unixTimestamp}:f> and is no longer banned on the server`
              );
              channel.send({ embeds: [unpunishedEmbed] });

              await msgInt.editReply({
                content: `Unbanned user.`,
                components: [],
              });
              return;
            });
          }
      }
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
