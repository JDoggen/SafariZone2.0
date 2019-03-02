import { IConfig } from "../../Models/IConfig";
import { Bot } from "../Bot";
import * as Discord from 'discord.js';
import { Logger, colors, logLevel} from '../../Modules/Logger/Logger';

export class CMD_Spam{
    static execute(channelID : string, bots: Bot[], config: IConfig, target: string, parameters: string[]){
        Logger.log('Executing spam command', logLevel.File);
        Logger.log(`target [${target}] parameters[${parameters}]`, logLevel.File);
        let newSpam = false;
        if(parameters && parameters[0])
            newSpam = parameters[0] === 'true';
        config.spamming = newSpam;

    }
}