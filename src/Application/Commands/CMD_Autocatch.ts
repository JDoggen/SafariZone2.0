import { Bot } from "../Bot";
import { IConfig } from "../../Models/IConfig";
import * as Discord from 'discord.js';

export class CMD_Autocatch{
    static execute(channelID : string, bots: Bot[], config: IConfig, target: string, parameters: string[]){
        let newAutocatch = false;
        if(parameters && parameters[0])
            newAutocatch = parameters[0] === 'true';
        config.autocatch = newAutocatch;
    }
}