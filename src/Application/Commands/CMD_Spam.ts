import { IConfig } from "../../Models/IConfig";
import { Bot } from "../Bot";
import * as Discord from 'discord.js';

export class CMD_Spam{
    static execute(channelID : string, bots: Bot[], config: IConfig, target: string, parameters: string[]){
        let newSpam = false;
        if(parameters && parameters[0])
            newSpam = parameters[0] === 'true';
        config.spamming = newSpam;

    }
}