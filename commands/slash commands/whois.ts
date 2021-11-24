import { GuildMember, MessageEmbed, MessageAttachment, Presence } from "discord.js";
import { ICommand } from "wokcommands";
import { Canvas, loadImage } from "skia-canvas"
import  Str  from "@supercharge/strings"

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

  callback: async ({ interaction: msgInt, channel }) => {
    try {
      // Functions
      // Takes the first letter of each word, capitalises it, then attaches the letter back to the rest of the word
      function sortArray(x) {
        if (x?.length) {
          for (let i = 0; i < x?.length; i++) {
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
      let userBg = whois.user.bannerURL({format: 'jpg', size: 1024 }) as string
      let pres
      
    


      async function presence (){
        pres = await whois.presence?.status
        console.log(pres)

        if(pres === undefined){
          pres = "offline"

          console.log(pres)
        }
      }
      
      
      presence()
      const doing = await whois.presence?.activities
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
      
      function wrapText (ctxt, text, x, y, maxWidth, lineHeight) {
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

      const canvas = new Canvas(700,250)
      let bg

      const blurredRect = {
        x: 130,
        y: 21,
        height: 208,
        width: 566,
        spread: 7
      };
      
      const ctx = canvas.getContext('2d')
        if(!userBg){
            bg = await loadImage('./wallpaper/AURABotWhoIsBG.png')
        } else {
            bg = await loadImage(userBg)
        }
      let presImg
      ctx.drawImage(bg, 0, 0, canvas.width, canvas.height)
      ctx.strokeStyle = '#FFFFFF'
      ctx.lineWidth=7
      ctx.strokeRect(0,0,canvas.width,canvas.height)
      ctx.fillStyle = 'rgba(35,39,42,0.75)'
      ctx.fillRect(130,21, 566, 208)
      ctx.filter = 'blur('+ blurredRect.spread +'px)';
      ctx.drawImage(canvas,
        blurredRect.x, blurredRect.y, blurredRect.width, blurredRect.height,
        blurredRect.x, blurredRect.y, blurredRect.width, blurredRect.height
      );
      ctx.filter = 'none'
      ctx.beginPath()
      ctx.lineWidth = 0
      ctx.arc(125 , 125, 100, 0.44, 1.195, true)
      ctx.arcTo(125, 125, 185, 153, 35);  // Create an arc
      ctx.closePath() 
      ctx.stroke()// Draw it


      ctx.save()
      ctx.clip()



      const avatar = await loadImage(userPic)
      ctx.drawImage(avatar, 25, 25, 200, 200)

      ctx.restore()
      ctx.arc(125 , 125, 100, 0.44, 1.195, true)     
      ctx.arcTo(125, 125, 185, 153, 35); 
      ctx.closePath() 
      ctx.stroke()
      ctx.strokeStyle = '#FFFFFF'
      ctx.lineWidth = 6
      ctx.stroke()

      //Profile Text
      ctx.font = '30px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('Profile', canvas.width / 3, canvas.height / 4);

      //User tag text
      ctx.font = applyText(canvas, whois.user.tag, 60)
      ctx.fillText(whois.user.tag, canvas.width / 2.8, canvas.height / 2.3)


      //Presence icons
      switch(pres){
        case "dnd":
          presImg = await loadImage("https://i.imgur.com/loJ3Xb1.png")  
          ctx.drawImage(presImg, 165, 168, 54, 54)
          break

        case "offline":
          presImg = await loadImage("https://i.imgur.com/UhQ3IW8.png")
          ctx.drawImage(presImg,  165, 169, 54, 54)
          break

        case "idle":
          presImg = await loadImage("https://i.imgur.com/Ju8DKov.png")
          ctx.drawImage(presImg,  165, 168, 54, 54)
          break

        case "online":
          presImg = await loadImage("https://i.imgur.com/Pup1yF6.png")
          ctx.drawImage(presImg,  165, 168, 54, 54)
          break
      }

        if(doing?.length){
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
          console.log(activities)

            const playing = await activities.find(a => a.type === "PLAYING")
            const listening = await activities.find(a => a.type === "LISTENING")
            const custom = await activities.find(a => a.type === "CUSTOM")

            // playing game
            if(playing && !listening && !custom){
              ctx.font = "18pt sans-serif"
              wrapText(ctx,`Currently ${playing.type.toLowerCase()} ${playing.name}` ,canvas.width / 2.77, canvas.height / 1.8, canvas.width-300, 30)
            }

        

            // listening to music
            else if(listening && !playing && !custom){
              ctx.drawImage(spl, canvas.width/2.2,canvas.height/7, 43.52, 32)
              ctx.font = "18pt sans-serif"
              wrapText(ctx,`Listening to ${listening.details} by ${listening.state}` ,canvas.width / 2.77, canvas.height / 1.8, canvas.width-300, 30)
            }

            //custom status
            else if(custom && !listening && !playing){
              ctx.font = "18pt sans-serif"
              wrapText(ctx,`Currently doing...in...on? ${custom.state}` ,canvas.width / 2.77, canvas.height / 1.8, canvas.width-300, 30)
            }

            //playing game and listening to music
            else if(playing && listening && !custom){
              ctx.drawImage(spl, canvas.width/2.2,canvas.height/7, 43.52, 32)
              ctx.font = "18pt sans-serif"
              wrapText(ctx,`Playing ${playing.name} and listening to ${listening.details} by ${listening.state}` ,canvas.width / 2.77, canvas.height / 1.8, canvas.width-300, 30)
            }

            //playing game and custom status
            else if(playing && custom && !listening){
              ctx.font = "18pt sans-serif"
              wrapText(ctx,`Playing ${playing.name} and...doing...in..on? ${custom.state}` ,canvas.width / 2.77, canvas.height / 1.8, canvas.width-300, 30)
            }

            //playing game and custom status and listening to music
            else if(playing && custom && listening){
              ctx.drawImage(spl, canvas.width/2.2,canvas.height/7, 43.52, 32)
              ctx.font = "18pt sans-serif"
              wrapText(ctx,`Playing ${playing.name}, ${custom.state} and listening to some music.` ,canvas.width / 2.77, canvas.height / 1.8, canvas.width-300, 30)
            }
          }


  
      // Joins words back into singular string and removes any comma's e.g. ("Discord Partner House Brilliance Early Supporter")
      words = special?.join().replace(/,/g, " ")

      // Removes @ everyone role from list since all users have this role by default and it can't be removed, it's unecessary to show it.
      if (roles.indexOf("| @everyone")) {
        newRoles = roles.replace("| @everyone", "")
      }
      if (roles.indexOf("@everyone") === 0) {
        newRoles = roles.replace("@everyone","This user has no other roles. 😬")} // RIP
      
      const roleCount = newRoles.split(" | ")

      // Embed to display information
      const whoisEmbed = new MessageEmbed()
        .setColor("#330034")
        .setTimestamp()
        .setFooter(`Brought to you by @AURABot`)

      whoisEmbed.addFields(
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
          name: `Roles the user has [${roleCount.length}] 🏷️`,
          value: newRoles,
        }
      )

      /*

          Simply implemented, but this section will basically assign the highest level of privilege to a new field called "special"
          and list it.

          */
      // Checks if server owner and sets rank to this
      if (whois.id === msgInt.guild?.ownerId) 
      {
        serverRank = "Server Owner 👑"
        
        // ctx.font = applyText(canvas, "Server Owner 👑")
        // ctx.fillStyle = '#ffffff'
      }

      if (!serverRank) {
        if (permCollection.indexOf("ADMINISTRATOR") >= 0) {serverRank = "Administrator"}
        if (permCollection.indexOf("MANAGE_GUILD") >= 0) {serverRank = "Server Manager"} 
          
          else if (
          permCollection.indexOf("KICK_MEMBERS") >= 0 &&
          permCollection.indexOf("BAN_MEMBERS") >= 0
        ) {serverRank = "Moderator"}}

      if (serverRank) {whoisEmbed.addField("Special", serverRank)}

      //This section checks for the three notable main Discord perks and lists them in, what is in my opinion, the most prominent order
      //Partnered server owner
      if (words.indexOf("Partnered Server Owner") >= 0) {
        partner = "Partnered Server Owner"
        noteableStatus.push(partner)}

      //Discord Employee
      if (words.indexOf("Discord Employee") >= 0) {
        discoEmployee = "Discord Employee"
        noteableStatus.push(discoEmployee)}

      //Discord cert. mod
      if (words.indexOf("Discord Certified Moderator") >= 0) {
        moderator = "Discord Certified Moderator"
        noteableStatus.push(moderator)}

      if (noteableStatus.length > 0) {
        const noteableString = noteableStatus.join(" | ")
        whoisEmbed.addFields({
          name: "Notable Other",
          value: `${noteableString}`,})}

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
          ) {noteablePerms.push(permCollection[i])}}

        const permView = await noteablePerms.map((p) =>
          p.toLowerCase().replace(/_/g, " ").split(" "))

        sortArray(permView)

        const newView = permView.join(" ● ").replace(/,/g, " ")

        whoisEmbed.addFields({
          name: "Notable Permissions",
          value: `${newView}`,})}

     const attachment = new MessageAttachment(await canvas.toBuffer(), 'profile-image.png')

      await msgInt.reply({embeds: [whoisEmbed], files: [attachment]})

    //  msgInt.followUp({embeds: [whoisEmbed]})

    } catch (error) {
      console.log(error)
      if (error instanceof TypeError &&
          error.name === "TypeError [COMMAND_INTERACTION_OPTION_EMPTY]")
      {
        msgInt.reply({
          content: "User is not in guild.",
          components: [],})
      }
      if (
        error instanceof TypeError &&
        error.name === "TypeError [INTERACION_NOT_REPLIED]") 

      {
        msgInt.reply({
          content: "Unable to perform command.",
          components: [],})
      }
    }
  },
} as ICommand;
