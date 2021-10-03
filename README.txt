                _                                                _    _                 _____                 _   _                             _                        _   _                 _  _             _    _ _____            ____        _   
     /\        | |                                              | |  | |               |  __ \               | | (_)                 /\        | |                      | | (_)              _| || |_      /\  | |  | |  __ \     /\   |  _ \      | |  
    /  \  _   _| |_ ___  _ __   ___  _ __ ___   ___  _   _ ___  | |  | |___  ___ _ __  | |__) |___  __ _  ___| |_ _  ___  _ __      /  \  _   _| |_ ___  _ __ ___   __ _| |_ _  ___  _ __   |_  __  _|    /  \ | |  | | |__) |   /  \  | |_) | ___ | |_ 
   / /\ \| | | | __/ _ \| '_ \ / _ \| '_ ` _ \ / _ \| | | / __| | |  | / __|/ _ \ '__| |  _  // _ \/ _` |/ __| __| |/ _ \| '_ \    / /\ \| | | | __/ _ \| '_ ` _ \ / _` | __| |/ _ \| '_ \   _| || |_    / /\ \| |  | |  _  /   / /\ \ |  _ < / _ \| __|
  / ____ \ |_| | || (_) | | | | (_) | | | | | | (_) | |_| \__ \ | |__| \__ \  __/ |    | | \ \  __/ (_| | (__| |_| | (_) | | | |  / ____ \ |_| | || (_) | | | | | | (_| | |_| | (_) | | | | |_  __  _|  / ____ \ |__| | | \ \  / ____ \| |_) | (_) | |_ 
 /_/    \_\__,_|\__\___/|_| |_|\___/|_| |_| |_|\___/ \__,_|___/  \____/|___/\___|_|    |_|  \_\___|\__,_|\___|\__|_|\___/|_| |_| /_/    \_\__,_|\__\___/|_| |_| |_|\__,_|\__|_|\___/|_| |_|   |_||_|   /_/    \_\____/|_|  \_\/_/    \_\____/ \___/ \__|
                                                                                                                                                                                                                                                                                                                        
                                           
Written in TS, utilising:
- NodeJS
- DiscordJS
- Mongoose
- WOKCommands

Some additional utilities
- dotenv
- concurrently

Automated file syncing thanks to:
- Vultr
- buddy.works

                   ___                         ___           ___           ___           ___                                      ___           ___     
       ___        /  /\          ___          /  /\         /  /\         /  /\         /  /\          ___            ___        /  /\         /  /\    
      /__/\      /  /::|        /  /\        /  /::\       /  /::\       /  /::|       /  /::\        /__/\          /__/\      /  /::\       /  /::|   
      \__\:\    /  /:|:|       /  /::\      /  /:/\:\     /  /:/\:\     /  /:|:|      /  /:/\:\       \  \:\         \__\:\    /  /:/\:\     /  /:|:|   
      /  /::\  /  /:/|:|__    /  /:/\:\    /  /:/  \:\   /  /::\ \:\   /  /:/|:|__   /  /::\ \:\       \__\:\        /  /::\  /  /:/  \:\   /  /:/|:|__ 
   __/  /:/\/ /__/:/ |:| /\  /  /::\ \:\  /__/:/ \__\:\ /__/:/\:\_\:\ /__/:/_|::::\ /__/:/\:\_\:\      /  /::\    __/  /:/\/ /__/:/ \__\:\ /__/:/ |:| /\
  /__/\/:/~~  \__\/  |:|/:/ /__/:/\:\ \:\ \  \:\ /  /:/ \__\/~|::\/:/ \__\/  /~~/:/ \__\/  \:\/:/     /  /:/\:\  /__/\/:/~~  \  \:\ /  /:/ \__\/  |:|/:/
  \  \::/         |  |:/:/  \__\/  \:\_\/  \  \:\  /:/     |  |:|::/        /  /:/       \__\::/     /  /:/__\/  \  \::/      \  \:\  /:/      |  |:/:/ 
   \  \:\         |__|::/        \  \:\     \  \:\/:/      |  |:|\/        /  /:/        /  /:/     /__/:/        \  \:\       \  \:\/:/       |__|::/  
    \__\/         /__/:/          \__\/      \  \::/       |__|:|~        /__/:/        /__/:/      \__\/          \__\/        \  \::/        /__/:/   
                  \__\/                       \__\/         \__\|         \__\/         \__\/                                    \__\/         \__\/ 


**  COMMANDS **
==== MODERATION ==== 
/ Punish < Kick, Ban , Mute >

Each punishment requires it's own params, I'll list below with required in <> and optional in (). Shortened to /p

/p kick <user> (reason)
/p ban <user> <reason>
/p mute <user> (time) (reason)

//////////// A note about Mute and what works and what doesn't

For input on TIME:
Valid: 10
Valid: 10m or 10d or 10h
Valid [Mostly was done for idiot proofing / fun / challenge]: 10asmafadsf (will select first index value input, in this case 'd' and 'm' exist, but the lowest index value is selected ('m') ---- if d was first e.g. dasdasdm then d would be selected.

Invalid: alskjlakdjf
Invalid: time greater than 14 days (measured in minutes, hours or days) e.g. anything greater than 20160m / 336h / 14d

/////////// A note about responses

1. Bot will DM user if possible, but will still punish regardless. If MUTED then bot will DM on mute and unmute.
2. Emebed times for MUTES are displayed in unix timestamp, so will display local time for anyone looking at it.  

Error Handling:
No, you won't break it, don't worry.
Yes, it handles everything you can think of for Discord.



@AuraBotProject
