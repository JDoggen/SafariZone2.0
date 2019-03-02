import { Bot } from "../Bot";
import { IConfig } from "../../Models/IConfig";
import * as Discord from 'discord.js';
import { Logger, logLevel } from "../../Modules/Logger/Logger";

export class CMD_Autocatch{
    static execute(channelID : string, bots: Bot[], config: IConfig, target: string, parameters: string[]){
        Logger.log('Executing autocatch command', logLevel.File);
        Logger.log(`target [${target}] parameters[${parameters}]`, logLevel.File);
        let newAutocatch = false;
        if(parameters && parameters[0])
            newAutocatch = parameters[0] === 'true';
        config.autocatch = newAutocatch;
    }
}