"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    category: 'Testing',
    description: 'Testing',
    slash: 'both',
    testOnly: true,
    callback: ({ message, channel }) => __awaiter(void 0, void 0, void 0, function* () {
        const filter = m => m.author.id === message.author.id;
        let answered = true;
        //create embed for application...creation
        const appealEmbed = new discord_js_1.MessageEmbed()
            .setColor('#76b900')
            .setTitle('Ban Appeal')
            .setAuthor(message.author.tag)
            .setDescription('Testing, attention please')
            .setThumbnail('https://img.ibxk.com.br/2020/02/04/04155339211586.jpg?w=1120&h=420&mode=crop&scale=both');
        //create embed for application timeout
        const timeoutEmbed = new discord_js_1.MessageEmbed()
            .setColor('#76b900')
            .setTitle('Application Cancelled')
            .setThumbnail('https://img.ibxk.com.br/2020/02/04/04155339211586.jpg?w=1120&h=420&mode=crop&scale=both');
        channel.send({ embeds: [appealEmbed] }).then((updatedEmbed) => __awaiter(void 0, void 0, void 0, function* () {
            //Function to ask question for appeal form
            function askQuestion(question, formResponse, timer, isNumber) {
                return __awaiter(this, void 0, void 0, function* () {
                    yield channel.send(`**${question}**`);
                    //wait for message send, filter to command caller ID
                    const collected = yield channel.awaitMessages({ filter, max: 1, idle: timer, errors: ['idle'] });
                    //collect first message sent after question, add field to embed
                    const response = collected.first();
                    const reply = response === null || response === void 0 ? void 0 : response.content;
                    switch (true) {
                        case (reply === "cancel"):
                            throw "is cancelled";
                        case (isNumber && isNaN(Number(reply)) && reply !== "cancel"):
                            throw "not a number";
                        case (reply !== "cancel"):
                            appealEmbed.addField(`**${formResponse}**`, reply);
                            updatedEmbed.edit({ embeds: [appealEmbed] });
                    }
                });
            }
            ;
            //call functions, wait for promise to be fulfilled (see above code block), if user takes too long, error out, cancel application
            yield askQuestion("Welcome to the ban appeal process. Please note each response is limited to 1024 characters, with the exception of Number of Warnings which is limited to integers (numbers) ONLY. To begin type when the ban was issued:", "Date ban was issued", 10000, false)
                .catch((error => {
                console.log(error);
                answered = false;
                //if answered is false & error is user cancellation, apply cancellation embed
                if (!answered && error === "is cancelled") {
                    console.log("Application cancelled by user");
                    timeoutEmbed.setDescription("**Application has been cancelled successfully**");
                    channel.send({ embeds: [timeoutEmbed] });
                }
                //if answered is false && error is user idle time, apply cancellation embed
                else {
                    console.log("Application timeout");
                    timeoutEmbed.setDescription(`**${message.author.tag}**` + " " + "**took too long!**"),
                        channel.send({ embeds: [timeoutEmbed] });
                }
            }));
            //stops function from running more promises
            if (!answered) {
                return;
            }
            //Rest of this does the same shit as above
            yield askQuestion("What was the reason given for the ban?", "Reason given for the ban:", 10000, false)
                .catch((error => {
                answered = false;
                if (!answered && error === "is cancelled") {
                    console.log("Application cancelled by user");
                    timeoutEmbed.setDescription("**Application has been cancelled successfully**");
                    channel.send({ embeds: [timeoutEmbed] });
                }
                else {
                    console.log("Application timeout");
                    timeoutEmbed.setDescription(`**${message.author.tag}**` + " " + "**took too long!**"),
                        channel.send({ embeds: [timeoutEmbed] });
                }
            }));
            if (!answered) {
                return;
            }
            ;
            yield askQuestion("Who was the team member who issued the ban?", "Team member who issued ban:", 10000, false)
                .catch((error => {
                answered = false;
                if (!answered && error === "is cancelled") {
                    console.log("Application cancelled by user");
                    timeoutEmbed.setDescription("**Application has been cancelled successfully**");
                    channel.send({ embeds: [timeoutEmbed] });
                }
                else {
                    console.log("Application timeout");
                    timeoutEmbed.setDescription(`**${message.author.tag}**` + " " + "**took too long!**"),
                        channel.send({ embeds: [timeoutEmbed] });
                }
            }));
            if (!answered) {
                return;
            }
            ;
            yield askQuestion("How many warnings were you given prior to the ban?", "Number of warnings given:", 10000, true)
                .catch((error => {
                answered = false;
                if (!answered && error === "is cancelled") {
                    console.log("Application cancelled by user");
                    timeoutEmbed.setDescription("**Application has been cancelled successfully**");
                    channel.send({ embeds: [timeoutEmbed] });
                }
                //Checks isNumber for "true" in above ayncfunction, then returns error and requests user to enter integer
                else if (!answered && error === "not a number") {
                    console.log("Input not a number, application cancelled.");
                    timeoutEmbed.setDescription("**Input is not a valid number! Please use a valid integer e.g. 5!**");
                    channel.send({ embeds: [timeoutEmbed] });
                }
                else {
                    console.log("Application timeout");
                    timeoutEmbed.setDescription(`**${message.author.tag}**` + " " + "**took too long!**"),
                        channel.send({ embeds: [timeoutEmbed] });
                }
            }));
            if (!answered) {
                return;
            }
            ;
            yield askQuestion("Explain why we should lift the ban:", "You should lift my ban because:", 10000, false)
                .catch((error => {
                answered = false;
                if (!answered && error === "is cancelled") {
                    console.log("Application cancelled by user");
                    timeoutEmbed.setDescription("**Application has been cancelled successfully**");
                    message.channel.send({ embeds: [timeoutEmbed] });
                }
                else {
                    console.log("Application timeout");
                    timeoutEmbed.setDescription(`**${message.author.tag}**` + " " + "**took too long!**"),
                        channel.send({ embeds: [timeoutEmbed] });
                }
            }));
            if (!answered) {
                return;
            }
            ;
            yield askQuestion("How do you plan on being different if we lift the ban?", "How you plan on being different if we lift the ban:", 10000, false)
                .catch((error => {
                answered = false;
                if (!answered && error === "is cancelled") {
                    console.log("Application cancelled by user");
                    timeoutEmbed.setDescription("**Application has been cancelled successfully**");
                    channel.send({ embeds: [timeoutEmbed] });
                }
                else {
                    console.log("Application timeout");
                    timeoutEmbed.setDescription(`**${message.author.tag}**` + " " + "**took too long!**"),
                        channel.send({ embeds: [timeoutEmbed] });
                }
            }));
            if (!answered) {
                return;
            }
            ;
        }));
        channel.send({ embeds: [appealEmbed] });
        message.reply("**Application submitted, thank you. We'll review it over the next 14 days.**");
    })
};
