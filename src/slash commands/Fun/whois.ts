import { GuildMember, MessageEmbed, MessageAttachment, MessageComponentInteraction, MessageActionRow, MessageButton, Interaction } from "discord.js";
import { ICommand } from "wokcommands";
import { Canvas, loadImage } from "skia-canvas"
import Str from "@supercharge/strings"

export default {
    category: "Tools",
    description: "View user information",
    slash: true,
    testOnly: true,
    options: [
        {
            name: "user",
            description: "User you want to get the information of.",
            type: 6,
            required: true,
        },
        {
            name: "detailed",
            description: "Provides permissions view.",
            type: 5,
            required: false,
        },
    ],

    callback: async ({ interaction: msgInt, channel, message }) => {
        try {
            // Functions
            // Takes the first letter of each word, capitalises it, then attaches the letter back to the rest of the word
            function sortArray(x) {
                if (x ?.length) {
                    for (let i = 0; i < x ?.length; i++) {
                        for (let j = 0; j < x[i].length; j++) {
                            x[i][j] = x[i][j][0].toUpperCase() + x[i][j].substring(1)
                        }
                    }
                }
            }
            // Gets UNIX timestamp for specified date (t)
            function getDate(t) {
                return Math.floor(new Date(t).getTime() / 1000)
            }

            // Variables
            // Interaction Options
            const whois = msgInt.options.getMember("user", true) as GuildMember;
            const detailed = msgInt.options.getBoolean("detailed", false) as Boolean;

            //User data
            const userPic = whois.displayAvatarURL({ format: "jpg" })
            await whois.user.fetch(true)
            let userBg = whois.user.bannerURL({ format: 'jpg', size: 1024 }) as string
            let pres

            const flipFrontRow = new MessageActionRow().addComponents(new MessageButton()
                .setCustomId("flipFront")
                .setLabel("Flip to Front")
                .setStyle("PRIMARY")
            )

            const flipBackRow = new MessageActionRow().addComponents(new MessageButton()
                .setCustomId("flipBack")
                .setLabel("Flip to Back")
                .setStyle("PRIMARY")
            )

            const flipDisabledBack = new MessageActionRow().addComponents(new MessageButton()
                .setCustomId("flipDisabledBack")
                .setLabel("Flip to Back")
                .setStyle("PRIMARY")
                .setDisabled()
            )

            const flipDisabledFront = new MessageActionRow().addComponents(new MessageButton()
                .setCustomId("flipDisabledFront")
                .setLabel("Flip to Back")
                .setStyle("PRIMARY")
                .setDisabled()
            )

            const helpRowWhoIs = new MessageActionRow().addComponents(new MessageButton()
                .setLabel("View Wiki Page")
                .setStyle("LINK")
                .setURL("https://github.com/MrHanBrolo/AURABot/wiki/Tools#whois")
            )

            async function presence() {
                pres = await whois.presence ?.status
                if (pres === undefined) {
                    pres = "offline"
                }
            }


            presence()
            const doing = await whois.presence ?.activities
      const userCreation = new Date(whois.user.createdAt)
            const userJoin = new Date(whois.joinedAt as Date)
            const createdDate = userCreation.getTime()
            const joinDate = userJoin.getTime()
            const createdTimestamp = getDate(createdDate)
            const joinedTimestamp = getDate(joinDate)

            //Arrays
            const noteableStatus = new Array()

            /*
              Retrieves user roles and maps them to a new array, joining each role name into an single string seperated by a ' | ' e.g. @mod | @staff | @guineapig 
            */
            const roles = await whois.roles.cache.map((r) => `${r}`).join(" | ")

            /*
              Retrieves user flags (e.g. 'DISCORD_PARTNER') and maps them to a new array, removing the underscores, converting to lower case and 
              splitting the new words up into their own array (e.g. 'discord',  'partner')
              */
            let special = await whois.user.flags
                ?.toArray().map((s) => s.toLowerCase().replace(/_/g, " ").split(" "))

      // Creates array of permissions for user e.g. [['MANAGES_MESSAGES', 'MANAGE_ROLES', 'SEND MESSAGES']] etc..
      const permCollection = whois.permissions.toArray();

            //Placeholder variables
            let newRoles
            let words
            let moderator
            let partner
            let discoEmployee
            let serverRank
            sortArray(special)

            // Text size limiter
            const applyText = (canvas, text, size) => {
                do {
                    ctx.font = `${size -= 2}pt sans-serif`;
                } while (ctx.measureText(text).width > canvas.width - 250);
                return ctx.font;
            };

            function wrapText(ctxt, text, x, y, maxWidth, lineHeight) {
                const words = text.split(' ');
                let line = '';
                for (const [index, w] of words.entries()) {
                    const testLine = line + w + ' ';
                    let limit1 = Str(testLine).limit(127, '...').get()
                    const metrics = ctxt.measureText(limit1);
                    const testWidth = metrics.width;
                    if (testWidth > maxWidth && index > 0) {
                        ctxt.fillText(line, x, y);
                        line = w + ' ';
                        y += lineHeight;
                    } else {
                        line = testLine;
                    }
                    let limit = Str(line).limit(127, '...').get()
                    console.log(line)
                    ctxt.fillText(limit, x, y);
                }
            }
            // node-canvas info setup
            const mainCanvas = new Canvas(700, 750)
            let bg
            let presImg

            // Blur Rect properties
            const blurredRect = {
                x: 0,
                y: 0,
                height: 250,
                width: 702,
                spread: 7
            };

            const ctx = mainCanvas.getContext('2d')

            // Check for user bg or user default
            !userBg ? bg = await loadImage('./wallpaper/AURABotWhoIsBG.png') : bg = await loadImage(userBg)

            //Dark grey rect
            ctx.strokeStyle = 'rgba(1, 1, 1, 0)'
            ctx.lineWidth = 8
            ctx.fillStyle = '#1B1B1B'

            // Main Profile card
            ctx.fillStyle = 'white'
            ctx.beginPath()
            ctx.moveTo(20, 10);
            ctx.lineTo(660, 10);
            ctx.arcTo(690, 10, 690, 70, 10);
            ctx.lineTo(690, 730);
            ctx.arcTo(690, 740, 680, 740, 10);
            ctx.lineTo(20, 740);
            ctx.arcTo(10, 740, 10, 730, 10);
            ctx.lineTo(10, 20);
            ctx.arcTo(10, 10, 20, 10, 10)
            ctx.closePath()
            ctx.stroke()
            ctx.clip()
            ctx.fillRect(0, 0, mainCanvas.width, mainCanvas.height)

            //Top of Card (User BG)
            ctx.drawImage(bg, 0, 0, 700, 250)

            //Top of Card (Blur Rect base)
            ctx.fillStyle = 'rgba(102,102,102,0.35)'
            ctx.fillRect(0, 0, 700, 250)

            //Top of Card (Blur Rect)
            ctx.filter = 'blur(' + blurredRect.spread + 'px)';
            ctx.drawImage(mainCanvas,
                blurredRect.x, blurredRect.y, blurredRect.width, blurredRect.height,
                blurredRect.x, blurredRect.y, blurredRect.width, blurredRect.height
            );

            //Profile pic outline
            ctx.lineWidth = 15
            ctx.strokeStyle = '#FFFFFF'
            ctx.filter = 'none'
            ctx.beginPath()
            ctx.arc(345, 240, 140, 0.44, 1.195, true)
            ctx.arcTo(345, 240, 405, 268, 45)
            ctx.closePath()
            ctx.stroke()
            ctx.save()
            ctx.clip()

            // Profile Pic
            const avatar = await loadImage(userPic)
            ctx.drawImage(avatar, 205, 100, 280, 280)

            //User tag text
            ctx.restore()
            ctx.font = '40px sans-serif';
            ctx.fillStyle = '#0F0F0F';

            ctx.font = applyText(mainCanvas, whois.user.tag, 60)
            ctx.fillText(whois.user.tag, mainCanvas.width / 4.5, mainCanvas.height / 1.7)

            //Presence icons
            switch (pres) {
                case "dnd":
                    presImg = await loadImage("https://i.imgur.com/loJ3Xb1.png")
                    ctx.drawImage(presImg, 393, 293, 79, 79)
                    break

                case "offline":
                    presImg = await loadImage("https://i.imgur.com/UhQ3IW8.png")
                    ctx.drawImage(presImg, 393, 293, 79, 79)
                    break

                case "idle":
                    presImg = await loadImage("https://i.imgur.com/Ju8DKov.png")
                    ctx.drawImage(presImg, 393, 293, 79, 79)
                    break

                case "online":
                    presImg = await loadImage("https://i.imgur.com/Pup1yF6.png")
                    ctx.drawImage(presImg, 393, 293, 79, 79)
                    break
            }

            if (doing ?.length) {
                const spl = await loadImage('https://i.imgur.com/k4s5Nq9.png')
                const gam = await loadImage('https://i.imgur.com/QNGFoqu.png')

                const activities = new Array()

                // 

                doing.forEach(activity => {
                    activities.push({
                        name: activity.name,
                        details: activity.details,
                        state: activity.state,
                        type: activity.type
                    })
                })

                const playing = await activities.find(a => a.type === "PLAYING")
                const listening = await activities.find(a => a.type === "LISTENING")
                const custom = await activities.find(a => a.type === "CUSTOM")

                // playing game
                if (playing && !listening && !custom) {
                    ctx.drawImage(gam, mainCanvas.width / 1.4, mainCanvas.height / 3.9, 54, 54)
                    ctx.font = "20pt sans-serif"
                    wrapText(ctx, `Currently ${playing.type.toLowerCase()} ${playing.name}`, mainCanvas.width / 11.5, mainCanvas.height / 1.5, 650, 30)
                }


                // listening to music
                else if (listening && !playing && !custom) {
                    ctx.drawImage(spl, mainCanvas.width / 1.4, mainCanvas.height / 3.9, 54, 54)
                    ctx.font = "20pt sans-serif"
                    wrapText(ctx, `Listening to ${listening.details} by ${listening.state}`, mainCanvas.width / 11.5, mainCanvas.height / 1.5, 600, 30)
                }

                //custom status
                else if (custom && !listening && !playing) {
                    ctx.font = "18pt sans-serif"
                    wrapText(ctx, `Currently doing...in...on? ${custom.state}`, mainCanvas.width / 11.5, mainCanvas.height / 1.5, 650, 30)
                }

                //playing game and listening to music
                else if (playing && listening && !custom) {
                    ctx.drawImage(spl, mainCanvas.width / 1.4, mainCanvas.height / 3.7, 53.52, 42)
                    ctx.drawImage(gam, mainCanvas.width / 1.25, mainCanvas.height / 3.9, 54, 54)
                    ctx.font = "18pt sans-serif"
                    wrapText(ctx, `Playing ${playing.name} and listening to ${listening.details} by ${listening.state}`, mainCanvas.width / 11.5, mainCanvas.height / 1.5, 620, 30)
                }

                //playing game and custom status
                else if (playing && custom && !listening) {
                    ctx.font = "18pt sans-serif"
                    wrapText(ctx, `Playing ${playing.name} and...doing...in..on? ${custom.state}`, mainCanvas.width / 11.5, mainCanvas.height / 1.5, mainCanvas.width - 50, 30)
                }

                //playing game and custom status and listening to music
                else if (playing && custom && listening) {
                    ctx.drawImage(spl, mainCanvas.width / 1.4, mainCanvas.height / 3.7, 53.52, 42)
                    ctx.drawImage(gam, mainCanvas.width / 1.25, mainCanvas.height / 3.9, 54, 54)
                    ctx.font = "18pt sans-serif"
                    wrapText(ctx, `Playing ${playing.name}, ${custom.state} and listening to ${listening.details} by ${listening.state}.`, mainCanvas.width / 11.5, mainCanvas.height / 2.3, 620, 30)
                }
            }



            // Joins words back into singular string and removes any comma's e.g. ("Discord Partner House Brilliance Early Supporter")
            words = special ?.join().replace(/,/g, " ")

      // Removes @ everyone role from list since all users have this role by default and it can't be removed, it's unecessary to show it.
      if (roles.indexOf("| @everyone")) {
                newRoles = roles.replace("| @everyone", "")
            }
            if (roles.indexOf("@everyone") === 0) {
                newRoles = roles.replace("@everyone", "This user has no other roles. 😬")
            }

            const roleCount = newRoles.split(" | ")

            //Embed to display card
            const frontCard = new MessageEmbed()
                .setColor("#2f3136")
                .setTimestamp()
                .setFooter({ text: "Collect 'em all!" })

            // Embed to display additional information
            const backCard = new MessageEmbed()
                .setColor("#2f3136")
                .setTimestamp()
                .setFooter({ text: `Brought to you by @AURABot` })

            backCard.addFields(
                {
                    name: "Date user joined 🕔",
                    value: `<t:${joinedTimestamp}:f>`,
                    inline: true,
                },
                {
                    name: "Account creation date 🕛",
                    value: `<t:${createdTimestamp}:f>`,
                    inline: true,
                },
                {
                    name: `This user has [${roleCount.length}] roles: 🏷️`,
                    value: newRoles,
                }
            )

            /*
      
                Simply implemented, but this section will basically assign the highest level of privilege to a new field called "special"
                and list it.
      
            */

            // Checks if server owner and sets rank to this
            if (whois.id === msgInt.guild ?.ownerId) {
                serverRank = "Server Owner 👑"

                // ctx.font = applyText(canvas, "Server Owner 👑")
                // ctx.fillStyle = '#ffffff'
            }

            if (!serverRank) {
                if (permCollection.indexOf("ADMINISTRATOR") >= 0) { serverRank = "Administrator" }
                if (permCollection.indexOf("MANAGE_GUILD") >= 0) { serverRank = "Server Manager" }

                else if (
                    permCollection.indexOf("KICK_MEMBERS") >= 0 &&
                    permCollection.indexOf("BAN_MEMBERS") >= 0
                ) { serverRank = "Moderator" }
            }

            if (serverRank) { backCard.addField("Special", serverRank) }

            //This section checks for the three notable main Discord perks and lists them in, what is in my opinion, the most prominent order
            //Partnered server owner
            if (words.indexOf("Partnered Server Owner") >= 0) {
                partner = "Partnered Server Owner"
                noteableStatus.push(partner)
            }

            //Discord Employee
            if (words.indexOf("Discord Employee") >= 0) {
                discoEmployee = "Discord Employee"
                noteableStatus.push(discoEmployee)
            }

            //Discord cert. mod
            if (words.indexOf("Discord Certified Moderator") >= 0) {
                moderator = "Discord Certified Moderator"
                noteableStatus.push(moderator)
            }

            if (noteableStatus.length > 0) {
                const noteableString = noteableStatus.join(" | ")
                backCard.addFields({
                    name: "Notable Other",
                    value: `${noteableString}`,
                })
            }

            //If user sets detailed view to true, displays a list of what I felt to be notable permissions. i.e. What are dangerous permissions to grant.
            if (detailed) {
                let noteablePerms = new Array()
                for (let i = 0; i < permCollection.length; i++) {
                    //Couldn't really figure out a better way to do this. Basically checks each permission value in the array and if it matches to one of this, adds it to the new noteablePerms array.
                    if (
                        permCollection[i] === "KICK_MEMBERS" ||
                        permCollection[i] === "BAN_MEMBERS" ||
                        permCollection[i] === "MANAGE_CHANNELS" ||
                        permCollection[i] === "MANAGE_GUILD" ||
                        permCollection[i] === "VIEW_AUDIT_LOG" ||
                        permCollection[i] === "PRIORITY_SPEAKER" ||
                        permCollection[i] === "MANAGE_MESSAGES" ||
                        permCollection[i] === "VIEW_GUILD_INSIGHTS" ||
                        permCollection[i] === "MUTE_MEMBERS" ||
                        permCollection[i] === "DEAFEN_MEMBERS" ||
                        permCollection[i] === "MOVE_MEMBERS" ||
                        permCollection[i] === "MANAGE_NICKNAMES" ||
                        permCollection[i] === "MANAGE_ROLES" ||
                        permCollection[i] === "MANAGE_WEBHOOKS" ||
                        permCollection[i] === "MANAGE_EMOJIS_AND_STICKERS" ||
                        permCollection[i] === "MANAGE_THREADS" ||
                        permCollection[i] === "START_EMBEDDED_ACTIVITIES"
                    ) { noteablePerms.push(permCollection[i]) }
                }

                const permView = await noteablePerms.map((p) =>
                    p.toLowerCase().replace(/_/g, " ").split(" "))

                sortArray(permView)

                const newView = permView.join(" ● ").replace(/,/g, " ")

                backCard.addFields({
                    name: "Notable Permissions",
                    value: `${newView}`,
                })
            }

            const attachment = new MessageAttachment(await mainCanvas.toBuffer('png'), 'profile-image.png')
            frontCard
                .setImage('attachment://profile-image.png')

            const reply = await msgInt.reply({ files: [attachment], components: [flipBackRow], fetchReply: true })

            //FLIP BUTTON
            const filter = (btnInt: MessageComponentInteraction) => {
                return msgInt.user.id === btnInt.user.id && reply.id === btnInt.message.id
            }

            const collector = channel.createMessageComponentCollector({
                filter,
                time: 1000 * 45,
            });
            collector.on("collect", i => {
                if (i.user.id === msgInt.user.id) {
                    if (i.customId === "flipBack") {
                        i.update({ embeds: [backCard], attachments: [], components: [flipFrontRow] })
                    }
                    if (i.customId === "flipFront") {
                        i.update({ files: [attachment], embeds: [], components: [flipBackRow] })
                    }
                } else {
                    i.reply({ content: `These buttons aren't for you!`, ephemeral: true });
                }
            })

            collector.on("end", async (collection) => {
                if (collection.last() ?.customId == "flipBack") {
                    await msgInt.editReply({ embeds: [backCard], attachments: [], components: [flipDisabledFront] })
                }

                if (collection.last() ?.customId == "flipFront") {
                    await msgInt.editReply({ embeds: [], files: [attachment], components: [flipDisabledBack] })
                }

                if (collection.last() == undefined) {
                    await msgInt.editReply({ components: [flipDisabledBack] })
                }
            })


        } catch (error) {
            console.log(error)
            if (error instanceof TypeError &&
                error.name === "TypeError [COMMAND_INTERACTION_OPTION_EMPTY]") {
                msgInt.reply({
                    content: "User is not in guild.",
                    components: [],
                })
            }
            if (
                error instanceof TypeError &&
                error.name === "TypeError [INTERACION_NOT_REPLIED]") {
                msgInt.reply({
                    content: "Unable to perform command.",
                    components: [],
                })
            }
        }
    },
} as ICommand;