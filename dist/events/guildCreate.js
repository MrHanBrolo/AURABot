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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const guild_schema_1 = __importDefault(require("../models/guild-schema"));
const logs_schema_1 = __importDefault(require("../models/logs-schema"));
module.exports = {
    name: 'guildCreate',
    once: true,
    execute: (guild) => __awaiter(void 0, void 0, void 0, function* () {
        /*
         *
         *
         *
         *         ADD GUILD TO DB
         *
         *
         *
         *
        */
        console.log('Joined the server!');
        const { id, name } = guild;
        const presence = yield guild_schema_1.default.findOne({
            guildId: id,
        }).catch(() => false);
        if (!presence) {
            guild_schema_1.default.create({
                guildId: id,
                guildName: name,
                users: []
            });
        }
        /*
         *
         *
         *
         *          CREATE LOG SETTINGS
         *
         *
         *
         *
        */
        yield logs_schema_1.default.create({
            guildId: guild === null || guild === void 0 ? void 0 : guild.id,
            logs: []
        });
        /*
         *
         *
         *
         *          CHECK FOR / CREATE MUTED ROLE
         *
         *
         *
         *
        */
        /*
         *
         *
         *
         *          ENUMERATE USERS AND ADD TO DB
         *
         *
         *
         *
        */
        // const list = client.guilds.cache.get(id); 
        // list.members.cache.forEach(member => console.log(member.user.username)); 
    })
};
