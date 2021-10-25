import {
  MessageComponentInteraction,
  MessageSelectMenu,
  MessageActionRow,
  MessageEmbed,
  GuildMember,
} from "discord.js";
import { ICommand } from "wokcommands";

export default {
  category: "Moderation",
  description: "Manages roles for a user.",
  slash: true,
  testOnly: true,
  options: [
    {
      name: "user",
      description: "The user whose roles you want to manage.",
      type: 6,
      required: true,
    },
  ],

  callback: async ({ interaction: msgInt, channel }) => {
    const userR = msgInt.options.getMember("user") as GuildMember;
    const botRoles = (await msgInt.guild?.members.fetch(
      "889924119708196916"
    )) as GuildMember;
    const userHighest = userR.roles.highest.name;

    const timeElapsed = Date.now();
    const unixTimestamp = Math.floor(new Date(timeElapsed).getTime() / 1000);

    const invoker = msgInt.user.tag;

    const managedUserRoles = new Array();
    let removedArray = new Array();
    let namedRoles = new Array();

    const roleMenu = new MessageSelectMenu()
      .setCustomId("userRoles")
      .setPlaceholder("None Selected");

    const roleRow = new MessageActionRow();

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
      .setAuthor(`Action performed by: ${invoker}`)
      .setTimestamp()
      .setFooter("Remember to behave!");

    try {
      const list = await userR.roles.cache;
      await list?.forEach((role) => {
        msgInt.guild?.roles.fetch(role.id).then((roleName) => {
          if (roleName?.name == "@everyone") {
            return;
          }
          if (
            userR.roles.highest.comparePositionTo(botRoles.roles.highest) >= 1
          ) {
            var removeIndex = managedUserRoles
              .map(function (item) {
                return item.label;
              })
              .indexOf(userHighest);
            managedUserRoles.splice(removeIndex, 1);
          }
          managedUserRoles.push({
            label: `${roleName?.name}`,
            value: `${roleName?.id}`,
          });
        });
      });

      if (managedUserRoles[0] === undefined) {
        await msgInt.reply({
          content: "User does not have additional roles",
          components: [],
          ephemeral: true,
        });
        return;
      }

      roleMenu.maxValues = managedUserRoles.length;

      for (let i = 0; i < managedUserRoles.length; i++) {
        roleMenu.addOptions([managedUserRoles[i]]);
      }
      roleRow.addComponents(roleMenu);
      const menuCollector = channel.createMessageComponentCollector({
        componentType: "SELECT_MENU",
        filter,
        max: 1,
        time: 1000 * 30,
      });

      await msgInt.reply({
        content: "Choose what roles to remove",
        components: [roleRow],
        ephemeral: true,
        fetchReply: true,
      });

      menuCollector.on("end", async (collection) => {
        if (collection.first()?.customId === "userRoles") {
          let roleCollection = collection.first();
          if (roleCollection?.isSelectMenu()) {
            for (let i = 0; i < roleCollection.values.length; i++) {
              removedArray.push(roleCollection.values[i]);
              userR.roles.remove(roleCollection.values[i]);

              await msgInt.guild?.roles.fetch(removedArray[i]).then((role) => {
                let roles = msgInt.guild?.roles.cache.find(
                  (r) => r.id === role?.id
                );
                namedRoles.push(roles);
              });
            }

            const nR = namedRoles.join(" ● ").replace(/,/g, " ");

            let user = userR.id;

            unpunishedEmbed.addFields({
              name: `❌ Roles removed`,
              value: `**<@${user}> had the following roles removed: \n \n ${nR}**`,
            });

            unpunishedEmbed.setDescription(
              `Action performed at <t:${unixTimestamp}:f>`
            );
            channel.send({ embeds: [unpunishedEmbed] });
          }
        }
        await msgInt.editReply({
          content: "Removed Roles.",
          components: [],
        });
      });
      return;
    } catch (error) {
      switch (error) {
        case "Role is higher.":
          msgInt.editReply({
            content:
              "One or more roles were higher than mine and were not removed",
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
