import { Bot } from "../Bot";
import { IConfig } from "../../Models/IConfig";
import * as Discord from 'discord.js';

export class CMD_Cmd{
    static execute(channelID : string, bots: Bot[], config: IConfig, target: string, parameters: string[]){
        for(let bot of bots){
            if(target.includes(bot.getID()) || target === 'all'){
                let command = parameters.join(" ");
                bot.sendMessage(channelID, command);
            }
        }
    }
}