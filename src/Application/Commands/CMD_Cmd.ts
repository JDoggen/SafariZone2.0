import { Bot } from "../Bot";
import { IConfig } from "../../Models/IConfig";
import{Logger, logLevel} from "../../Modules/Logger/Logger";

export class CMD_Cmd{
    static execute(channelID : string, bots: Bot[], config: IConfig, target: string, parameters: string[]){
        Logger.log('Executing cmd command', logLevel.File);
        Logger.log(`target [${target}] parameters[${parameters}]`, logLevel.File);
        for(let bot of bots){
            if(target.includes(bot.getID()) || target === 'all'){
                let command = parameters.join(" ");
                bot.sendMessage(channelID, command);
            }
        }
    }
}