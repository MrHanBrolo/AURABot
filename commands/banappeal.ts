import { ButtonInteraction, MessageActionRow, MessageButton } from "discord.js";
import { ICommand } from "wokcommands";
import { MessageEmbed } from "discord.js";

export default {
    category: 'Testing',
    description: 'Testing',

    slash: "both",
    testOnly: true,

    callback: async ({ interaction: message , channel}) => {

        const filter = m => m.author.id === message.user.id; let answered = true;

        //create embed for application...creation
        const appealEmbed = new MessageEmbed()
            .setColor('#76b900')
            .setTitle('Ban Appeal')
            .setAuthor(message.user.id)
            .setDescription('Testing, attention please')
            .setThumbnail('https://img.ibxk.com.br/2020/02/04/04155339211586.jpg?w=1120&h=420&mode=crop&scale=both');

        //create embed for application timeout
        const timeoutEmbed = new MessageEmbed()
            .setColor('#76b900')
            .setTitle('Application Cancelled')
            .setThumbnail('https://img.ibxk.com.br/2020/02/04/04155339211586.jpg?w=1120&h=420&mode=crop&scale=both');


            channel.send({ embeds: [appealEmbed] }).then(async (updatedEmbed) => {

                //Function to ask question for appeal form
        async function askQuestion (question: string, formResponse: string, timer: number, isNumber: boolean) {
          const botMsg = await channel.send(`**${question}**`)
            //wait for message send, filter to command caller ID  
           const collected = await channel.awaitMessages({filter, max: 1, idle: timer, errors: ['idle'] });
                //collect first message sent after question, add field to embed
                    const response = collected.first(); 
                    const reply = response?.content;

                    switch (true) {
                        case (reply === "cancel"):
                            throw "is cancelled";
                        case (isNumber && isNaN(Number(reply)) === true && reply !== "cancel"):
                            throw "not a number";
                        case (isNumber === false && isNaN(Number(reply)) === false && reply !== "cancel"):
                            throw "not appropriate response";
                        case (reply !== "cancel"):
                            appealEmbed.addField(`**${formResponse}**`, reply as string);
                            updatedEmbed.edit({ embeds: [appealEmbed]})
                            botMsg.delete()
                            response?.delete()

                    }
        };

        //call functions, wait for promise to be fulfilled (see above code block), if user takes too long, error out, cancel application
        await askQuestion("Welcome to the ban appeal process. Please note each response is limited to 1024 characters, with the exception of Number of Warnings which is limited to integers (numbers) ONLY. To begin type when the ban was issued:", "Date ban was issued", 10000, false)
            .catch((error => {
                console.log(error);
                answered = false

                //if answered is false & error is user cancellation, apply cancellation embed
                if (!answered && error === "is cancelled") {
                    console.log("Application cancelled by user");
                    timeoutEmbed.setDescription("**Application has been cancelled successfully**");
                    channel.send({ embeds: [timeoutEmbed] })
                
                } else if(!answered && error === "not appropriate response"){
                    console.log("Input not a string, application cancelled.");
                    timeoutEmbed.setDescription("**Input is not a valid response! Don't use numbers.**");
                    channel.send({ embeds: [timeoutEmbed] })
                }
                //if answered is false && error is user idle time, apply cancellation embed
                else {
                    console.log("Application timeout");
                    timeoutEmbed.setDescription(`**${message.user.id}**` + " " + "**took too long!**"),
                    channel.send({ embeds: [timeoutEmbed] })
                }
            }));


        //stops function from running more promises
        if (!answered) {
            return;
        }


        //Rest of this does the same shit as above
        await askQuestion("What was the reason given for the ban?", "Reason given for the ban:", 10000, false)
            .catch((error => {
                answered = false;
                if (!answered && error === "is cancelled") {
                    console.log("Application cancelled by user");
                    timeoutEmbed.setDescription("**Application has been cancelled successfully**");
                    channel.send({ embeds: [timeoutEmbed] })

                } else if(!answered && error === "not appropriate response"){
                    console.log("Input not a string, application cancelled.");
                    timeoutEmbed.setDescription("**Input is not a valid response! Don't use numbers.**");
                    channel.send({ embeds: [timeoutEmbed] })
                }
                    else {
                    console.log("Application timeout");
                    timeoutEmbed.setDescription(`**${message.user.id}**` + " " + "**took too long!**"),
                    channel.send({ embeds: [timeoutEmbed] })
                }
            }));

        if (!answered) {
            return;
        };


        await askQuestion("Who was the team member who issued the ban?", "Team member who issued ban:", 10000, false)
            .catch((error => {
                answered = false;
                if (!answered && error === "is cancelled") {
                    console.log("Application cancelled by user");
                    timeoutEmbed.setDescription("**Application has been cancelled successfully**");
                    channel.send({ embeds: [timeoutEmbed] })

                } else if(!answered && error === "not appropriate response"){
                    console.log("Input not a string, application cancelled.");
                    timeoutEmbed.setDescription("**Input is not a valid response! Don't use numbers.**");
                    channel.send({ embeds: [timeoutEmbed] })

                } else {
                    console.log("Application timeout");
                    timeoutEmbed.setDescription(`**${message.user.id}**` + " " + "**took too long!**"),
                        channel.send({ embeds: [timeoutEmbed] })
                }
            }));

        if (!answered) {
            return;
        };

        await askQuestion("How many warnings were you given prior to the ban?", "Number of warnings given:", 10000, true)
            .catch((error => {
                answered = false;
                if (!answered && error === "is cancelled") {
                    console.log("Application cancelled by user");
                    timeoutEmbed.setDescription("**Application has been cancelled successfully**");
                    channel.send({ embeds: [timeoutEmbed] })
                }
                //Checks isNumber for "true" in above ayncfunction, then returns error and requests user to enter integer
                else if (!answered && error === "not a number") {
                    console.log("Input not a number, application cancelled.");
                    timeoutEmbed.setDescription("**Input is not a valid number! Please use a valid integer e.g. 5!**");
                    channel.send({ embeds: [timeoutEmbed] })
                }
                else {
                    console.log("Application timeout");
                    timeoutEmbed.setDescription(`**${message.user.id}**` + " " + "**took too long!**"),
                    channel.send({ embeds: [timeoutEmbed] });
                }
            }));

        if (!answered) {
            return;
        };

        await askQuestion("Explain why we should lift the ban:", "You should lift my ban because:", 10000, false)
            .catch((error => {
                answered = false;
                if (!answered && error === "is cancelled") {
                    console.log("Application cancelled by user");
                    timeoutEmbed.setDescription("**Application has been cancelled successfully**");
                    channel.send({embeds: [timeoutEmbed]});

                } else if(!answered && error === "not appropriate response"){
                    console.log("Input not a string, application cancelled.");
                    timeoutEmbed.setDescription("**Input is not a valid response! Don't use numbers.**");
                    channel.send({ embeds: [timeoutEmbed] })

                } else {
                    console.log("Application timeout");
                    timeoutEmbed.setDescription(`**${message.user.id}**` + " " + "**took too long!**"),
                    channel.send({ embeds: [timeoutEmbed] });
                }
            }));

        if (!answered) {
            return;
        };


        await askQuestion("How do you plan on being different if we lift the ban?", "How you plan on being different if we lift the ban:", 10000, false)
            .catch((error => {
                answered = false;
                if (!answered && error === "is cancelled") {
                    console.log("Application cancelled by user");
                    timeoutEmbed.setDescription("**Application has been cancelled successfully**");
                    channel.send({ embeds: [timeoutEmbed] })

                } else if(!answered && error === "not appropriate response"){
                    console.log("Input not a string, application cancelled.");
                    timeoutEmbed.setDescription("**Input is not a valid response! Don't use numbers.**");
                    channel.send({ embeds: [timeoutEmbed] })

                } else {
                    console.log("Application timeout");
                    timeoutEmbed.setDescription(`**${message.user.id}**` + " " + "**took too long!**"),
                        channel.send({ embeds: [timeoutEmbed] })
                }
            }));

        if (!answered) {
            return;
        };
        message.reply("**Application submitted, thank you. We'll review it over the next 14 days.**")   
    })

    }

} as ICommand