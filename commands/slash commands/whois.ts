import {
    GuildMember,
    MessageEmbed,
  } from "discord.js";
  import {Canvas} from "canvas"
  import { ICommand } from "wokcommands";
  
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
          required: true
      },
      {
        name: "detailed",
        description: "Provides permissions view.",
        type: 5,
        required: false
    },
  ],
  
    callback: async ({ interaction: msgInt, channel }) => {


      const whois = msgInt.options.getMember("user", true) as GuildMember
      const detailed = msgInt.options.getBoolean("detailed", false) as Boolean

      const userPic = await whois.displayAvatarURL({ format: 'jpg' })

      const userCreation = new Date(whois.user.createdAt)
      const userJoin = new Date(whois.joinedAt as Date)
      const newDate = userCreation.getTime()
      const joinDate = userJoin.getTime()
      const createdTimestamp = Math.floor(new Date(newDate).getTime() / 1000);
      const joinedTimestamp = Math.floor(new Date(joinDate).getTime() / 1000);
      const roles = await whois.roles.cache.map(r =>
        `${r}`).join(' | ')
      let newRoles
      let words
      let moderator
      let partner
      let discoEmployee
      let serverRank

      let special = await whois.user.flags?.toArray().map(s => 
        s.toLowerCase().replace(/_/g, " ").split(" ")
      )

      if(special?.length){
        for(let i=0; i < special?.length; i++){
          for(let j=0; j < special[i].length; j++){
            special[i][j] = special[i][j][0].toUpperCase() + special[i][j].substring(1);
          }
        }
      }

      words = special?.join().replace(/,/g, " ")

      if(roles.indexOf('| @everyone')){newRoles = roles.replace('| @everyone', "")}
      if(roles.indexOf('@everyone') === 0){newRoles = roles.replace('@everyone', "This user has no other roles. 😬")}
      const roleCount = newRoles.split(' | ')


      const whoisEmbed = new MessageEmbed()
      .setColor("#330034")
      .setAuthor(`${whois.user.tag}`)
      .setThumbnail(`${userPic}`)
      .setTimestamp()
      .setFooter(`Brought to you by @AURABot`);
  
      try {
            whoisEmbed.addFields({
              name: 'Date user joined 🕔',
              value: `<t:${joinedTimestamp}:f>`,
              inline: true
          }, {
              name: 'Account creation date 🕛',
              value: `<t:${createdTimestamp}:f>`,
              inline: true
          }, {
              name: `Roles the user has [${roleCount.length}] 🏷️`,
              value: newRoles
          })
  
          const permCollection = whois.permissions.toArray()

          if(whois.id === msgInt.guild?.ownerId){
            serverRank = "Server Owner 👑"
          }

          if(!serverRank){
            console.log(permCollection)
            if(permCollection.indexOf('ADMINISTRATOR') >= 0 ){serverRank = 'Administrator'}

            if(permCollection.indexOf('MANAGE_GUILD') >= 0 ){serverRank = 'Server Manager'}

            else if(permCollection.indexOf('KICK_MEMBERS') >= 0 && permCollection.indexOf('BAN_MEMBERS') >= 0){
                serverRank = 'Moderator'}}
                
            if(serverRank){whoisEmbed.addField('Special', serverRank)}

            //Partnered server only
           if(words.indexOf("Discord Certified Moderator") === -1 && 
               words.indexOf("Discord Employee") === -1 &&
               words.indexOf("Partnered Server Owner") >= 0 ){
                  partner = "Partnered Server Owner" 
                  whoisEmbed.addFields({
                    name: 'Big Boi Status',
                    value: `${partner}`})}

  
            //Discord Employee only
            if(words.indexOf("Discord Certified Moderator") === - 1 && 
               words.indexOf("Discord Employee") >= 0&& 
               words.indexOf("Partnered Server Owner") === -1 ){
                  discoEmployee = "Discord Employee"
                  whoisEmbed.addFields({
                    name: 'Special',
                    value: `${discoEmployee}`})}
  
            //Discord cert. mod only
            if(words.indexOf("Discord Certified Moderator") >= 0 && 
              words.indexOf("Discord Employee") == -1 && 
              words.indexOf("Partnered Server Owner") === -1 ){
                  moderator = "Discord Certified Moderator"
                  whoisEmbed.addFields({
                    name: 'Special',
                    value: `${moderator}`})}
  
            if(words.indexOf("Discord Certified Moderator") === -1 && 
               words.indexOf("Discord Employee") >= 0 && 
               words.indexOf("Partnered Server Owner") >= 0){
                  discoEmployee.join(`| ${partner}`)
                  whoisEmbed.addFields({
                    name: 'Special',
                    value: `${discoEmployee}`})}
  
            if(words.indexOf("Discord Certified Moderator") >= 0 && 
               words.indexOf("Discord Employee") >= 0 && 
               words.indexOf("Partnered Server Owner") >= 0){
                  discoEmployee.join(`| ${partner} | ${moderator}`)
                  whoisEmbed.addFields({
                    name: 'Special',
                    value: `${discoEmployee}`})}
  
            if(words.indexOf("Discord Certified Moderator") >= 0 && 
               words.indexOf("Discord Employee") === -1 && 
               words.indexOf("Partnered Server Owner") >= 0){
                  partner.join(`| ${moderator}`)
                  whoisEmbed.addFields({
                        name: 'Special',
                        value: `${partner}`})}

            if(detailed){
            let noteablePerms = new Array()
            for (let i = 0; i < permCollection.length; i++){

                  if(permCollection[i] === ('KICK_MEMBERS') || 
                  permCollection[i] === ('BAN_MEMBERS') ||
                  permCollection[i] === ('MANAGE_CHANNELS') ||
                  permCollection[i] === ('MANAGE_GUILD') ||
                  permCollection[i] === ('VIEW_AUDIT_LOG') ||
                  permCollection[i] === ('PRIORITY_SPEAKER') ||
                  permCollection[i] === ('MANAGE_MESSAGES') ||
                  permCollection[i] === ('VIEW_GUILD_INSIGHTS') ||
                  permCollection[i] === ('MUTE_MEMBERS') ||
                  permCollection[i] === ('DEAFEN_MEMBERS') ||
                  permCollection[i] === ('MOVE_MEMBERS') ||
                  permCollection[i] === ('MANAGE_NICKNAMES') ||
                  permCollection[i] === ('MANAGE_ROLES') ||
                  permCollection[i] === ('MANAGE_WEBHOOKS') ||
                  permCollection[i] === ('MANAGE_EMOJIS_AND_STICKERS') ||
                  permCollection[i] === ('MANAGE_THREADS') ||
                  permCollection[i] === ('START_EMBEDDED_ACTIVITIES')){
                    noteablePerms.push(permCollection[i])
                  }
            }
              const permView = await noteablePerms.map( p=> 
              p.toLowerCase().replace(/_/g, " ").split(" "))


              if(permView?.length){
                for(let i=0; i < permView?.length; i++){
                  for(let j=0; j < permView[i].length; j++){
                    permView[i][j] = permView[i][j][0].toUpperCase() + permView[i][j].substring(1);
                  }
                }
              }

              const newView = permView.join(' ● ').replace(/,/g, " ")

              console.log(newView)

              whoisEmbed.addFields({
                name: 'Notable Permissions',
                value: `${newView}`})
            }

          await msgInt.reply({
            content: "Fetched user info:",
            components: [],
          });
          channel.send({embeds: [whoisEmbed]})

      } catch (error) {
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
   