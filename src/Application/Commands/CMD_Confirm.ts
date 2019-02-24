import { Bot } from "../Bot";
import { IConfig } from "../../Models/IConfig";
import * as Discord from 'discord.js';

export class CMD_Confirm{
    static execute(channelID : string, bots: Bot[], config: IConfig, target: string, parameters: string[]){
        for(let bot of bots){
            if(target.includes(bot.getID()) || target === 'all'){
                let price;
                if(parameters) price = parameters[0];
                if(!price){
                    bot.sendMessage(channelID, `-market list  ${bot.botConfig.autolisting.pokemonID} ${bot.botConfig.autolisting.price}`);
                } else{
                    bot.sendMessage(channelID, `-market list  ${bot.botConfig.autolisting.pokemonID} ${price}`);
                }
                setInterval(CMD_Confirm.confirmListing, config.delays.autoList, bot, channelID);


            }
        }
    }

    static confirmListing(bot : Bot, channelID : string, config : IConfig){
        bot.sendMessage(channelID, config.prefix.concat('confirmlist'));
    }
}