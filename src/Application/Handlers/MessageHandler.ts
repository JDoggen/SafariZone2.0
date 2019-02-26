import { Bot } from "../Bot";
import * as Discord from "discord.js";
import { IConfig } from "../../Models/IConfig";
import { CMD_PokeCordMessage } from "../Commands/CMD_PokecordMessage";
import { CMD_Spam } from "../Commands/CMD_Spam";
import { CMD_Autocatch } from "../Commands/CMD_Autocatch";
import { CMD_Autolist } from "../Commands/CMD_Autolist";
import { CMD_Cmd } from "../Commands/CMD_Cmd";
import { Logger, colors } from "../../Modules/Logger/Logger";
import { CMD_Confirm } from "../Commands/CMD_Confirm";
import { CatchHandler } from "./CatchHandler";
import { LoggingHandler } from "./LoggingHandler";

export class MessageHandler{
   

    constructor(
        private bots : Bot[],
        private config : IConfig,
        private catchHandler : CatchHandler,
        private loggingHandler : LoggingHandler
    ){}

    public handle(message: Discord.Message){
        if(message.author.id === this.config.pokeCordID){
            CMD_PokeCordMessage.execute(message, this.catchHandler, this.config, this.bots, this.loggingHandler);
        }else {
            message.content = message.content.trim().toLowerCase();
            let prefix = message.content.substr(0,1);
            let content = message.content.substr(1);
            if(prefix !== this.config.prefix) return;

            let words = content.replace(/\s\s+/g, ' ').split(" ");
            let channelID = message.channel.id;
            let command;
            let target;
            let parameters;
            if(words[0]) command = words[0];
            if(words[1]) target = words [1];
            if(words[2]) parameters = words.slice(2, words.length);
            
            if(!command) return;
            else if(command === "spam") CMD_Spam.execute(channelID, this.bots, this.config, target, parameters);
            else if(command === "autocatch") CMD_Autocatch.execute(channelID, this.bots, this.config, target, parameters);
            else if(command === "autolist") CMD_Autolist.execute(channelID, this.bots, this.config, target, parameters);
            else if(command === "cmd") CMD_Cmd.execute(channelID, this.bots, this.config, target, parameters);
            else if(command === "confirm") CMD_Confirm.execute(channelID, this.bots, this.config, target, parameters);
            
        }
    }
}