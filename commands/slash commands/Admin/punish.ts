import {
    MessageComponentInteraction,
    GuildMember,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    TextChannel
} from "discord.js"
import { ICommand } from "wokcommands"
import muteSchema from "../../../models/mute-schema"
import logSchema from "../../../models/logs-schema"
import userSchema from "../../../models/user-schema"

export default {
    category: "Testing",
    description: "Moderation Tool for ban / kick / mute",
    slash: true,
    testOnly: true,
    guildOnly: true,
    options: [
        {
            name: "ban",
            description: "Permanently ban a user from the server.",
            type: 1,
            options: [
                {
                    name: "user",
                    description: "The user you want to ban.",
                    type: 6,
                    required: true,
                },
                {
                    name: "reason",
                    description: "Why you want to ban them.",
                    type: 3,
                    required: true,
                },
            ],
        },
        {
            name: "kick",
            description: "Kick a user from the server.",
            type: 1,
            options: [
                {
                    name: "user",
                    description: "The user you want to ban.",
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
            description: "Assigns a muted role to the user.",
            type: 1,
            options: [
                {
                    name: "user",
                    description: "The user you want to mute.",
                    type: 6,
                    required: true,
                },
                {
                    name: "time",
                    description: "How long you want to mute the user for.",
                    type: 3,
                    required: false,
                },
                {
                    name: "reason",
                    description:
                        "Why you want to ban them (optionl, but recommended if its not an emergency).",
                    type: 3,
                    required: false,
                },
            ],
        },
    ],

    callback: async ({ interaction: msgInt, channel, guild, client }) => {


        // Time variables
        const timeElapsed = Date.now()
        const unixTimestamp = Math.floor(new Date(timeElapsed).getTime() / 1000)
        const time = msgInt.options.getString("time")


        // User Variables
        const punished = msgInt.options.getMember("user", true) as GuildMember
        const kicker = msgInt.user.tag

        // Check DB for log channel existence
        const logChannelExists = await logSchema.exists({
            guildId: guild ?.id,
        })

        const logChannel = await logSchema.findOne({
            guildId: guild ?.id,
        })
        const userExists = await userSchema.exists({ guildId: guild ?.id, userId: punished ?.id})

        if (!userExists) {
            await userSchema.create({
                guildId: guild ?.id,
                userId: punished ?.id,
                mutes: 0,
                staffId: msgInt.user.id
            })
        }


        // Punishment Variables
        const punishment = msgInt.options.getSubcommand()
        const rsn = msgInt.options.getString("reason", false) as string
        let sent = false

        // Embeds
        const punishedEmbed = new MessageEmbed()
            .setColor("#DE1F1F")
            .setTimestamp()
            .setFooter({ text: "Remember to behave!" })

        // Menus and Actions
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
            )

        const helpRowMuteRole = new MessageActionRow().addComponents(
            new MessageButton()
                .setLabel("View Wiki Page")
                .setStyle("LINK")
                .setURL("https://github.com/MrHanBrolo/AURABot/wiki/Punish-Command#about-the-mute-role")
        )

        const timeRow = new MessageActionRow()

            .addComponents(
                new MessageButton()
                    .setLabel("View Wiki Page")
                    .setStyle("LINK")
                    .setURL("https://github.com/MrHanBrolo/AURABot/wiki/Punish-Command#valid-syntax-for-time")
            )

        await msgInt.reply({
            content: "Are you sure?",
            components: [punishRow],
            ephemeral: true,
        })

        const filter = (btnInt: MessageComponentInteraction) => {
            return msgInt.user.id === btnInt.user.id
        }

        const collector = channel.createMessageComponentCollector({
            filter,
            max: 1,
            time: 1000 * 15,
        })


        collector.on("end", async (collection) => {
            try {
                if (collection.first() ?.customId === "punish_yes") {

                    console.log(collection.first)
                    // command checks


                    //Checks if specified user is able to be punished and exists in the server
                    if (!punished.kickable || !punished.bannable) {
                        throw `You can't ${punishment} this user!`
                    }

                    switch (punishment) {
                        /////////////////////////////////////////////////////////////////////// KICK
                        /////////////////////////////////////////////////////////////////////// KICK
                        /////////////////////////////////////////////////////////////////////// KICK 
                        case "kick":
                            //Tries to DM user and sends reason if provided - continues if not
                            try {
                                punishedEmbed.setTitle("You have been kicked")
                                if (rsn) {
                                    punishedEmbed.addField("Reason for kicking", `${rsn}`)
                                    await punished ?.send({ embeds: [punishedEmbed] })
                                    sent = true
                                } else {
                                    punishedEmbed.addField(
                                        "Reason for kicking",
                                        "No reason given"
                                    )
                                    await punished ?.send({ embeds: [punishedEmbed] })
                                    sent = true
                                }
                            } catch (err) { console.log(err) }

                            await guild ?.members.kick(punished!).then(async () => {
                                punishedEmbed.setTitle("User was kicked")
                                punishedEmbed.setDescription(
                                    `${punished} was kicked from the server`
                                )
                                if (!logChannelExists) {
                                    channel.send({ embeds: [punishedEmbed] })

                                } else {
                                    for (let i = 0; i < logChannel.logs.length; i++) {
                                        console.log(logChannel.logs[i].logName)
                                        if (logChannel.logs[i].logName === "kicks") {
                                            const channel = await client.channels.cache.get(logChannel.logs[i].channelId) as TextChannel
                                            channel.send({ embeds: [punishedEmbed] })
                                            await msgInt.reply({
                                                content: 'User was kicked.',
                                                ephemeral: true,
                                                components: [],
                                            })
                                            return
                                        }
                                    }
                                }

                                if (sent) {
                                    for (let i = 0; i < logChannel.logs.length; i++) {
                                        if (logChannel.logs[i].logName === "kicks") {
                                            const channel = await client.channels.cache.get(logChannel.logs[i].channelId) as TextChannel
                                            channel.send({ embeds: [punishedEmbed] })
                                            await msgInt.reply({
                                                content: 'User was kicked.',
                                                ephemeral: true,
                                                components: [],
                                            })
                                            return

                                        }
                                    }
                                } else {
                                    for (let i = 0; i < logChannel.logs.length; i++) {
                                        console.log(logChannel.logs[i].logName)
                                        if (logChannel.logs[i].logName === "kicks") {
                                            const channel = await client.channels.cache.get(logChannel.logs[i].channelId) as TextChannel
                                            channel.send({ embeds: [punishedEmbed] })
                                            await msgInt.reply({
                                                content: 'User was kicked.',
                                                ephemeral: true,
                                                components: [],

                                            })
                                        }
                                        return
                                    }
                                }
                            })
                        break

                        /////////////////////////////////////////////////////////////////////// MUTE
                        /////////////////////////////////////////////////////////////////////// MUTE
                        /////////////////////////////////////////////////////////////////////// MUTE

                        case "mute":
                            const muted = guild ?.roles.cache.find(
                                (role) => role.name === "muted")
                
                            if (!muted) {
                                guild ?.roles.create({
                                    name: 'muted',
                                    color: '#8E8E8E',
                                    hoist: false,
                                    permissions: ['VIEW_CHANNEL'],
                                    position: 20,
                                    reason: 'Muted role did not exist.'
                                })
                            throw "no role"
                            }
                            //Check user isn't muted already
                            if (punished.roles.cache.some((role) => role.name === "muted")) {
                                console.log(punished.roles.cache.some((role) => role.name === "muted"))
                                throw "already punished"
                            }

                            if (time) {
                                /////////////// WRONG INPUT CHECKING - DON'T TOUCH THIS SHIT
                                const timed = time.toLowerCase() //converts input
                                const search = timed.match(/(\d+|[^\d]+)/g) // basically seperates num from chars e.g. ['20', 'asdaf'] when given 20asdaf
                                let defaultTime
                                if (search![1] === undefined) {
                                    defaultTime = search![0].split("")
                                } else {
                                    defaultTime = search![1].split("")
                                }

                                const letter = new Array("h", "d", "m")
                                const nolength = letter.some((i) => defaultTime ?.includes(i))

                                if (nolength) {
                                    const day = await defaultTime.indexOf("h")
                                    const hour = await defaultTime.indexOf("m")
                                    const minute = await defaultTime.indexOf("d")
                                    const arr = new Array(day, hour, minute)

                                    for (var i = arr.length - 1; i >= 0; i--) {
                                        if (arr[i] < 0) {
                                            arr[i] = arr[arr.length - 1]
                                            arr.pop()
                                        }
                                    }
                                    const minValue = Math.min.apply(null, arr)
                                    search ?.pop()
                                    const newTime = defaultTime[minValue]
                                    search ?.push(newTime)
                                }
                                /////////////// WRONG INPUT CHECKING - END OF THAT SHIT

                                // PUNISH TIME VARIABLES
                                const newTimer = parseInt(search![0])
                                let countDown
                                const punishTime = unixTimestamp + countDown / 1000

                                if (!nolength && isNaN(newTimer)) {
                                    throw "Invalid input"
                                }

                                if (
                                    !(search![1] === "m") &&
                                    !(search![1] === "h") &&
                                    !(search![1] === "d")) {
                                    throw "Invalid Timestamp"
                                }

                                if (
                                    (newTimer > 20160 && search![1] === "m") ||
                                    (newTimer > 336 && search![1] === "h") ||
                                    (newTimer > 14 && search![1] === "d")
                                ) {
                                    throw "toolong"
                                }

                                async function punishmentRun(timeSet, timeLeft) {

                                    await muteSchema.create({
                                        guildId: guild ?.id,
                                        userId: punished ?.id,
                                        reason: rsn,
                                        timeFrom: timeSet,
                                        timeUntil: timeLeft,
                                        staffId: msgInt.user.id
                                    })

                                    const muteID = await muteSchema.findOne({
                                        guildId: guild ?.id,
                                        userId: punished ?.id
                                        }).then(user => user._id.toString())

                                    punishedEmbed.setAuthor({ name: `Action performed by: ${kicker} • ID: ${muteID}` })

                                    punishedEmbed.setTitle("⚠️ You have been muted")
                                    if (rsn) {
                                        punishedEmbed.addField("Reason for mute", `${rsn}`)
                                        await punished ?.send({ embeds: [punishedEmbed] }).then(able => {
                                            able ? sent = true : sent
                                        })

                                    } else {
                                        punishedEmbed.addField(
                                            "Reason for mute",
                                            "No reason given"
                                        )
                                        await punished ?.send({ embeds: [punishedEmbed] }).then(able => {
                                            if (able) {
                                                sent = true
                                            }
                                        })
                                    }

                                    await punished.roles.add(muted!.id).then(async () => {
                                        punishedEmbed.setTitle("⚠️ User was muted")

                                        if (rsn) {
                                            punishedEmbed.setDescription(
                                                `${punished} was muted on the server until <t:${timeSet}:f>`
                                            )
                                            if (!logChannelExists) {
                                                console.log("no log channel")
                                                channel.send({ embeds: [punishedEmbed] })
                                            } else {
                                                for (let i = 0; i < logChannel.logs.length; i++) {
                                                    if (logChannel.logs[i].logName === "mutes") {
                                                        const channel = await client.channels.cache.get(logChannel.logs[i].channelId) as TextChannel
                                                        channel.send({ embeds: [punishedEmbed] })
                                                        break
                                                    }
                                                }
                                            }
                                        } else {
                                            punishedEmbed.setDescription(
                                                `${punished} was muted until <t:${timeSet}:f> because ${kicker} said so.`
                                            )

                                            if (!logChannelExists) {
                                                channel.send({ embeds: [punishedEmbed] })
                                            } else {
                                                for (let i = 0; i < logChannel.logs.length; i++) {
                                                    if (logChannel.logs[i].logName === "mutes") {
                                                        const channel = await client.channels.cache.get(logChannel.logs[i].channelId) as TextChannel
                                                        console.log(channel)
                                                        channel.send({ embeds: [punishedEmbed] })
                                                        return
                                                    }
                                                }
                                            }
                                        }

                                        setTimeout(async () => {
                                            punished.roles.remove(muted!.id)
                                            punishedEmbed.setTimestamp()
                                            punishedEmbed.setTitle("⚠️ User was unmuted")
                                            punishedEmbed.setDescription(
                                                `You are no longer muted on the server.`
                                            )
                                            await punished ?.send({ embeds: [punishedEmbed] })

                                            sent = true
                                            punishedEmbed.setDescription(
                                                `${punished} has served their time and been unmuted.`
                                            )

                                            if (!logChannelExists) {
                                                channel.send({ embeds: [punishedEmbed] })
                                            } else {
                                                for (let i = 0; i < logChannel.logs.length; i++) {
                                                    if (logChannel.logs[i].logName === "mutes") {
                                                        const channel = await client.channels.cache.get(logChannel.logs[i].channelId) as TextChannel
                                                        channel.send({ embeds: [punishedEmbed] })
                                                        return
                                                    }
                                                }
                                            }
                                        }, timeLeft)

                                        await userSchema.updateOne(
                                            {
                                                guildId: guild ?.id,
                                                userId: punished ?.id
                                        }, {
                                                $inc:
                                                {
                                                    mutes: 1
                                                }
                                            })

                                        if (sent) {
                                            await msgInt.editReply({
                                                content: "Completed.",
                                                components: [],
                                            })
                                        } else if (!sent) {
                                            await msgInt.editReply({
                                                content: "Completed but unable to DM user.",
                                                components: [],
                                            })
                                        }
                                    })
                                }
                                ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Hours
                                try {
                                    if (search![1] === "h") {
                                        countDown = newTimer * 3600000
                                        await punishmentRun(punishTime, countDown)
                                    }

                                    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Days
                                    if (search![1] === "d") {
                                        countDown = newTimer * 86400000
                                        await punishmentRun(punishTime, countDown)
                                    }

                                    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Minutes

                                    if (search![1] === "m" || !nolength) {
                                        countDown = newTimer * 60000
                                        await punishmentRun(punishTime, countDown)

                                    }
                                    return
                                } catch (error) {
                                    console.log(error)

                                    switch (error) {
                                        case "no role":
                                            msgInt.editReply({
                                                content: `Muted role did not exist, created role. Please refer to documentation.`,
                                                components: [helpRowMuteRole],
                                            })
                                            break
                                    }
                                }
                            }
                            break

                        /////////////////////////////////////////////////////////////////////// BAN
                        /////////////////////////////////////////////////////////////////////// BAN
                        /////////////////////////////////////////////////////////////////////// BAN

                        case "ban":
                            //Waits for member kick then sends embed giving details
                            await guild ?.members.ban(punished!).then(async () => {
                                punishedEmbed.setTitle("❗User was banned")
                                punishedEmbed.setDescription(
                                    `${punished} was banned from the server`
                                )
                                //if a reason is included, else none
                                if (rsn) {
                                    punishedEmbed.addFields({ name: "Reason for Ban", value: `${rsn}` })
                                    if (!logChannelExists) {
                                        channel.send({ embeds: [punishedEmbed] })
                                    } else {
                                        for (let i = 0; i < logChannel.logs.length; i++) {
                                            if (logChannel.logs[i].logName === "bans") {
                                                const channel = await client.channels.cache.get(logChannel.logs[i].channelId) as TextChannel
                                                channel.send({ embeds: [punishedEmbed] })
                                                return
                                            }
                                        }
                                    }

                                } else {
                                    punishedEmbed.addFields({ name: "Reason for Ban", value: "No reason given" })
                                    if (!logChannelExists) {
                                        channel.send({ embeds: [punishedEmbed] })
                                    } else {
                                        for (let i = 0; i < logChannel.logs.length; i++) {
                                            if (logChannel.logs[i].logName === "bans") {
                                                const channel = await client.channels.cache.get(logChannel.logs[i].channelId) as TextChannel
                                                channel.send({ embeds: [punishedEmbed] })
                                                return
                                            }
                                        }
                                    }
                                }

                                await punished
                                    ?.send(
                                        `❗ | You have been banned from the server because: ${rsn}`
                                    )
                                        .catch()

                                await msgInt.editReply({
                                            content: "Completed.",
                                            components: [],
                                        })
                                return
                            })
                            return
                    }
                } else if (collection.first() ?.customId === "punish_no") {
                    msgInt.editReply({
                        content: "Action cancelled",
                        components: [],
                    })
                }
            } catch (error) {
                switch (error) {
                    case "already punished":
                        msgInt.editReply({
                            content: `${punished} is already muted.`,
                            components: [],
                        })
                        break

                    case "toolong":
                        msgInt.editReply({
                            content: "Time must be less than 14 days. E.g. 3d, 1300m, 8h.",
                            components: [timeRow],
                        })
                        break

                    case "Invalid input":
                        msgInt.editReply({
                            content:
                                "Time must be specified as <number> <d , m , h> OR <number> (will default to minutes).",
                            components: [timeRow],
                        })
                        break

                    case "Invalid Timestamp":
                        msgInt.editReply({
                            content:
                                "Time must contain <d , m , h> OR <number> (will default to minutes).",
                            components: [timeRow],
                        })
                        break

                    case `You can't ${punishment} this user!`:
                        msgInt.editReply({
                            content: `You can't ${punishment} this user!`,
                            components: [],
                        })
                        break

                    case "already banned":
                        msgInt.editReply({
                            content: `${punished} is already banned.`,
                            components: [],
                        })
                        break

                    case "already kicked":
                        msgInt.editReply({
                            content: `${punished} is not in the server.`,
                            components: [],
                        })
                        break
                }

                if (
                    error instanceof TypeError &&
                    error.name === "TypeError [COMMAND_INTERACTION_OPTION_EMPTY]"
                ) {
                    msgInt.editReply({
                        content: "User is not in guild.",
                        components: [],
                    })
                }
            }
        })
    },
} as ICommand