import {
    ButtonInteraction,
    GuildMember,
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
            name: "user",
            description: "The user you want to unban.",
            type: 6,
            required: true,
          },
          {
            name: "reason",
            description: "Why you want to ban them.",
            type: 3,
            required: false,
          },
        ],
      },
      {
        name: "mute",
        description: "Unmute a user from the server.",
        type: 1,
        options: [
          {
            name: "user",
            description: "The user you want to unmute.",
            type: 6,
            required: true,
          },
        ],
      },
    ],
  
    callback: async ({ interaction: msgInt, channel }) => {
      const timeElapsed = Date.now();
      const unixTimestamp = Math.floor(new Date(timeElapsed).getTime() / 1000);
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
  
      await msgInt.reply({
        content: "Are you sure?",
        components: [punishRow],
        ephemeral: true,
      });
  
      const filter = (btnInt: ButtonInteraction) => {
        return msgInt.user.id === btnInt.user.id;
      };
  
      const collector = channel.createMessageComponentCollector({
        filter,
        max: 1,
        time: 1000 * 15,
      });
  
      collector.on("end", async (collection) => {
        const muted = msgInt.guild?.roles.cache.find(
          (role) => role.name === "muted"
        );
  
        try {
          if (collection.first()?.customId === "punish_yes") {
            // Member checks
            const punished = msgInt.options.getMember(
              "user",
              true
            ) as GuildMember;
            const kicker = msgInt.user.tag;
            // reason checks
            const rsn = msgInt.options.getString("reason", false) as string;
  
            // command checks
            const undo = msgInt.options.getSubcommand();
  
            const unpunishedEmbed = new MessageEmbed()
              .setColor("#76b900")
              .setAuthor(`Action performed by: ${kicker}`)
              .setTimestamp()
              .setFooter("Remember to behave!");
  
            switch (undo) {
              case "mute":
                // Check if user has role             
                const muted = msgInt.guild?.roles.cache.find(
                    (role) => role.name === "muted"
                  );

                if (!punished.roles.cache.some((role) => role.name === "muted")) {
                  throw `User is not muted.`
                }
  
                await punished.roles.remove(muted!.id).then(async () => {
                  unpunishedEmbed.setTitle("User was unmuted");
  
                  try {
                    unpunishedEmbed.setDescription(
                      "You are no longer muted on the server"
                    );
                    await punished?.send({ embeds: [unpunishedEmbed] });
                  } catch (err) {}
  
                  unpunishedEmbed.setDescription(
                    `${punished} was unmuted at <t:${unixTimestamp}:f> and is no longer muted on the server`
                  );
                  channel.send({ embeds: [unpunishedEmbed] });
  
                  await msgInt.editReply({
                    content: `Unmuted ${punished}`,
                    components: [],
                  });
                  return;
                });
                return;
  
             // case "ban":
            }
          } else if (collection.first()?.customId === "punish_no") {
            msgInt.editReply({
              content: "Action cancelled",
              components: [],
            });
          }
        } catch (error) {
          switch (error) {
            case "User is not muted.":
              msgInt.editReply({
                content: 'User is not muted!',
                components: [],
              });
              break;
  
            case "User is not banned":
              await msgInt.editReply({
                content:
                  "User is not currently banned from the guild!",
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
      });
    },
  } as ICommand;
  