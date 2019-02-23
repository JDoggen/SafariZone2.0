import { Bot } from "./Bot";
import * as Discord from "discord.js";
import { IConfig } from "../Models/IConfig";
import { CMD_PokeCordMessage } from "./Commands/CMD_PokecordMessage";
import { CMD_Spam } from "./Commands/CMD_Spam";
import { CMD_Autocatch } from "./Commands/CMD_Autocatch";
import { CMD_Autolist } from "./Commands/CMD_Autolist";
import { CMD_Cmd } from "./Commands/CMD_Cmd";

export class MessageHandler{
   

    constructor(
        private bots : Bot[],
        private config : IConfig
    ){}

    public handle(message: Discord.Message){
        if(message.author.id === this.config.pokeCordID){
            CMD_PokeCordMessage.execute(message);
        }else {
            message.content = message.content.trim().toLowerCase();
            let prefix = message.content.substr(0,1);
            let content = message.content.substr(1);

            if(prefix !== this.config.prefix) return;

            let words = content.replace(/\s\s+/g, ' ').slice(1).split(" ");
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
            
        }
    }
}