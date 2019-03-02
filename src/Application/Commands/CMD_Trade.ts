import { Bot } from "../Bot";
import { IConfig } from "../../Models/IConfig";
import { Logger, logLevel } from "../../Modules/Logger/Logger";
import * as Discord from 'discord.js';

export class CMD_Trade{
    static execute(channelID : string, bots: Bot[], config: IConfig, target: string, parameters: string[], authorID : string){
        Logger.log('Executing trade command', logLevel.File);
        Logger.log(`target [${target}] parameters[${parameters}]`, logLevel.File);
        for(let bot of bots){
            if((target.includes(bot.getID()) || target === 'all') && parameters && parameters[0]){
                //Trade all top pokemon
                let amount = Number(parameters[0]);
                if(!isNaN(amount) && amount > 0 && amount <= 20){
                    bot.sendMessage(config.channelIDs.commandsChannel, config.pokecordPrefix.concat('pokemon'));
                    setTimeout(CMD_Trade.pollResponse, config.delays.tradePollResponse, bot, config, amount, authorID);
                }
                //trade Pokemon with specific 
                else if(parameters && parameters[0] && parameters[1] && parameters[0] == 'n'){
                    let pokemonList = parameters.join(' ').substring(2);
                    let inviteDelay = config.delays.tradeSendTradeInvite;
                    let addPokemonDelay = config.delays.tradeAddPokemon + inviteDelay;
                    let confirmDelay = config.delays.tradeConfirm + addPokemonDelay;
                    setTimeout(CMD_Trade.sendTradeInvite, inviteDelay, bot, config, authorID);
                    setTimeout(CMD_Trade.addStringPokemonToTrade, addPokemonDelay, bot, config, pokemonList);
                    setTimeout(CMD_Trade.confirmTrade, confirmDelay, bot, config);
                }
            }
        }
    }

    static pollResponse(bot : Bot, config : IConfig, amount: number, authorID : string){
        bot.retrieveMessages(config.channelIDs.commandsChannel, 30)
        .then(messages =>{
            let infoMessage = CMD_Trade.fetchLastPokemonMessage(messages, config);
            if(infoMessage){
                let IDs : number[] = CMD_Trade.fetchPokemonIDs(infoMessage, amount);
                let inviteTimeout = config.delays.tradeSendTradeInvite;
                let addPokemonTimout = config.delays.tradeAddPokemon + inviteTimeout;
                let confirmTimeout = config.delays.tradeConfirm + addPokemonTimout;
                setTimeout(CMD_Trade.sendTradeInvite, inviteTimeout, bot, config, authorID);
                setTimeout(CMD_Trade.addPokemonToTrade, addPokemonTimout, bot, config, IDs);
                setTimeout(CMD_Trade.confirmTrade, confirmTimeout, bot, config);
            } else{
                bot.sendMessage(config.channelIDs.commandsChannel, 'Error polling for response. Please try again');
            }
        })
    }

    static fetchLastPokemonMessage(messages : Discord.Collection<string, Discord.Message>, config : IConfig) : Discord.Message{
        let messagesArray = messages.array().reverse();
        while(messagesArray.length > 0){
            let next = messagesArray.pop();
            if(next.author.id === config.pokeCordID && next.embeds && next.embeds[0] && next.embeds[0].title.includes('Your pokémon')){
                return next;
            }
        }
        return null;
    }  
    static fetchPokemonIDs(message : Discord.Message, amount: number) : number[]{
        if(!message.embeds || !message.embeds[0]) return null;
        let lines = message.embeds[0].description.split('\n');
        let pokeNumbers : number[] = [];
        for(let line of lines){
            let numberIndex = line.indexOf('Number: ');
            let substring = line.substring(numberIndex);
            let spaceIndex = substring.indexOf(' ');
            let lineIndex = substring.indexOf('|');
            substring = substring.substring(spaceIndex, lineIndex).trim();
            let pokeNumber = Number(substring);
            if(pokeNumbers.length < amount)
                pokeNumbers.push(pokeNumber);

        }
        return pokeNumbers;
    }

    static sendTradeInvite(bot : Bot, config : IConfig, authorID : string){
        bot.sendMessage(config.channelIDs.commandsChannel, `${config.pokecordPrefix}trade <@${authorID}>`);
    }

    static addPokemonToTrade(bot : Bot, config : IConfig, IDs : number[]){
        bot.sendMessage(config.channelIDs.commandsChannel, `${config.pokecordPrefix}p add ${IDs.join(' ')}`);
    }

    static addStringPokemonToTrade(bot : Bot, config : IConfig, IDs : string){
        bot.sendMessage(config.channelIDs.commandsChannel, `${config.pokecordPrefix}p add ${IDs}`);
    }

    static confirmTrade(bot : Bot, config : IConfig){
        bot.sendMessage(config.channelIDs.commandsChannel, `${config.pokecordPrefix}confirm`);
    }

}