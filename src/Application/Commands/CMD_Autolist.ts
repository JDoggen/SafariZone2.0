import { Bot } from "../Bot";
import { IConfig } from "../../Models/IConfig";
import * as Discord from 'discord.js';
import { Logger, colors, logLevel } from "../../Modules/Logger/Logger";

export class CMD_Autolist{
    static execute(channelID : string, bots: Bot[], config: IConfig, target: string, parameters: string[]){
        Logger.log('Executing autolist command', logLevel.File);
        Logger.log(`target [${target}] parameters[${parameters}]`, logLevel.File);
        for(let bot of bots){
            if(target.includes(bot.getID()) || target == 'all'){
                if(parameters && parameters[0]){
                    bot.botConfig.autolisting.BottomIVs = new Array();
                    bot.botConfig.autolisting.BottomPrices = new Array();
                    bot.botConfig.autolisting.TopIVs = new Array();
                    bot.botConfig.autolisting.TopPrices = new Array();
                    bot.botConfig.autolisting.stage = 1;
                    let pokemonID = parameters[0];
                    bot.botConfig.autolisting.pokemonID = pokemonID;
                    bot.botConfig.autolisting.channelID = channelID;
                    bot.sendMessage(channelID, config.pokecordPrefix.concat('info ').concat(pokemonID));
                    setTimeout(CMD_Autolist.pollResponse, config.delays.autoList, channelID, bot, config);
                }
            }
        }
        
    }

    static pollResponse(channelID : string, bot : Bot, config : IConfig){
        bot.retrieveMessages(channelID, 30)
        .then(messages =>{
            let infoMessage = CMD_Autolist.fetchLastInfoMessage(messages, config);
            if(infoMessage){
                let embed = infoMessage.embeds[0];

                let footerText = embed.footer.text;
                let secondPart = footerText.slice(20);
                let slashIndex = secondPart.indexOf("/");
                let ID = secondPart.substring(0, slashIndex);
                let equalID = ID == bot.botConfig.autolisting.pokemonID;
                if(equalID){
                    //Log IV
                    let pokemonIndex = embed.title.indexOf(' ', embed.title.indexOf( ' ' ) + 1);
                    let pokemon = embed.title.substring(pokemonIndex + 1);
                    let ivIndex = embed.description.indexOf("Total IV %:** ");
                    let iv = embed.description.substring(ivIndex + 14 , embed.description.length -1);
                    bot.botConfig.autolisting.IV = parseFloat(iv);
                    bot.botConfig.autolisting.pokemon = pokemon;
                    setTimeout(CMD_Autolist.getMarketPrice, config.delays.autoList, bot, config);

                } else{
                    Logger.log('Error, found another message with incorrect ID. Please try again', logLevel.Both, colors.fg.Red);
                }

            }else{
                Logger.log('Error retrieving message for channel '.concat(channelID), logLevel.Both, colors.fg.Red);
            }
        })
        .catch(err =>{
            Logger.log('Error retrieving message for channel '.concat(channelID), logLevel.Both, colors.fg.Red);
            Logger.log(err, logLevel.Both, colors.fg.Red);
        })
    }

    static fetchLastMarketMessage(messages : Discord.Collection<string, Discord.Message>, config : IConfig) : Discord.Message{
        let messagesArray = messages.array();
        while(messagesArray.length > 0){
            let next = messagesArray.pop();
            if(next.author.id === config.pokeCordID && next.embeds && next.embeds[0] && next.embeds[0].title.includes('Pokécord Market')){
                return next;
            }
        }
        return null;
    }

    static fetchLastInfoMessage(messages : Discord.Collection<string, Discord.Message>, config : IConfig) : Discord.Message{
        let messagesArray = messages.array().reverse();
        while(messagesArray.length > 0){
            let next = messagesArray.pop();
            if(next.author.id === config.pokeCordID && next.embeds && next.embeds[0] && next.embeds[0].title.includes('Level')){
                return next;
            }
        }
        return null;
    }

    static getMarketPrice(bot : Bot, config : IConfig){
        let page = bot.botConfig.autolisting.stage;
        bot.sendMessage(bot.botConfig.autolisting.channelID, config.pokecordPrefix.concat('market search ' + page + ' --name ' + bot.botConfig.autolisting.pokemon + ' --showiv --order iv d'))
        bot.retrieveMessages(bot.botConfig.autolisting.channelID, 30)
        .then(messages => {
            let marketMessage = CMD_Autolist.fetchLastMarketMessage(messages, config);
            let textblock = marketMessage.embeds[0].description;
            let lines = textblock.split("\n");
            lines.forEach(function(line){
                let ivIndex = line.indexOf("IV: ");
                let percentIndex = line.indexOf("%");
                let priceIndex = line.indexOf("Price: ");
                let creditsIndex = line.indexOf(" Credits");
                let iv = line.substring(ivIndex+4, percentIndex);
                let price = line.substring(priceIndex+7, creditsIndex);
                let parsedIV = parseFloat(iv);
                let parsedPrice = Number(price.replace(",", ""));
                if(parsedIV >= bot.botConfig.autolisting.IV){
                    bot.botConfig.autolisting.TopIVs.push(parsedIV);
                    bot.botConfig.autolisting.TopPrices.push(parsedPrice);
                } else{
                    bot.botConfig.autolisting.BottomIVs.push(parsedIV);
                    bot.botConfig.autolisting.BottomPrices.push(parsedPrice);
                }
            })
            bot.botConfig.autolisting.stage++;
            if(bot.botConfig.autolisting.BottomPrices.length >= 10){
                CMD_Autolist.makeProposal(bot, config);
            } else if(bot.botConfig.autolisting.stage <= config.maxAutolistingStages){
                setTimeout(CMD_Autolist.getMarketPrice, config.delays.autoList, bot, config);
            } else {
                Logger.log('Could not identify price of pokémon. Consider listing the pokémon yourself or chaning the maximum autolisting Stages', logLevel.Both, colors.fg.Red);
            }
        })
        .catch(err=>{
            Logger.log('error in command retrieveMessages', logLevel.File);
            Logger.log(err, logLevel.Both);
        })
    }

    static makeProposal(bot : Bot, config : IConfig){
        let lowestIV = 100.0;
        let highestIV = 0.0
        let lowestPrice = 10000000;
        let highestPrice = 0;
        let totalIV = 0.0
        let totalPrice = 0.0
        let totalPokemon = 0;
        bot.botConfig.autolisting.BottomIVs.reverse();
        bot.botConfig.autolisting.BottomPrices.reverse();
        for(let i=0; i<10; i++){
            let highIV = bot.botConfig.autolisting.TopIVs.pop();
            let highPrice = bot.botConfig.autolisting.TopPrices.pop();
            let lowIV = bot.botConfig.autolisting.BottomIVs.pop();
            let lowPrice = bot.botConfig.autolisting.BottomPrices.pop();
    
            if(highIV){
                totalPokemon ++;
                totalIV += highIV;
                totalPrice += highPrice;
                if(highestIV < highIV){
                    highestIV = highIV;
                }
                if(lowestPrice > highPrice){
                    lowestPrice = highPrice;
                }
                if(highestPrice < highPrice){
                    highestPrice = highPrice;
                }
            }
    
            if(lowIV){
                totalPokemon ++;
                totalIV += lowIV;
                totalPrice += lowPrice;
                if(lowestIV > lowIV){
                    lowestIV = lowIV;
                }
                if(lowestPrice > lowPrice){
                    lowestPrice = lowPrice;
                }
                if(highestPrice < lowPrice){
                    highestPrice = lowPrice;
                }
            }
        }
        let averageIV = totalIV / totalPokemon;
        let averagePrice = Math.round(totalPrice / totalPokemon);
        bot.sendMessage(bot.botConfig.autolisting.channelID,
            `Your ${bot.botConfig.autolisting.pokemon} ${bot.botConfig.autolisting.IV}% compared to:
            Average IV      : ${averageIV.toFixed(2)}%
            Average Price   : ${averagePrice.toLocaleString()}
            Lowest Price    : ${lowestPrice.toLocaleString()}
            Highest Price   : ${highestPrice.toLocaleString()}
            Lowest IV       : ${lowestIV.toFixed(2)}
            Highest IV      : ${highestIV.toFixed(2)}%
            List pokemon for ${averagePrice} Credits?
            Type '${config.prefix}confirm' to confirm`);
        bot.botConfig.autolisting.price = averagePrice;
    }
}