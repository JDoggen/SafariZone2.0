import * as Discord from 'discord.js';
import { CatchHandler } from '../Handlers/CatchHandler';
import * as request from 'request';
import { IConfig } from '../../Models/IConfig';
import { Bot } from '../Bot';
import { Logger, colors } from '../../Modules/Logger/Logger';

export class CMD_PokeCordMessage{
    static async execute(message: Discord.Message, catchHandler : CatchHandler, config : IConfig, bots : Bot[]){

        //Handle pokémon spawn
        if(message.embeds && message.embeds[0] && message.embeds[0].title.includes("A wild pokémon has appeared!")){
            let url = message.embeds[0].image.url;
            request.post({
                url:     'https://pokecord.exchange/identify-check',
                form:    { parseurl: url }
              }, (error : any, response : any, body : string) => {
                  catchHandler.catch(body);
              });
        }

        //Log caught pokémon
        else if(message.content.includes("You caught a ")){
            for(let bot of bots){
                if(message.isMentioned(bot.getBotUser())){
                    let delay = Math.random() * config.delays.infoVariable + config.delays.infoMin;
                    setTimeout(CMD_PokeCordMessage.getInfo, delay, bot, config);
                }
            }
        }

        //Log info of pokémon
        else if(message.embeds && message.embeds[0] && message.embeds[0].description.includes("Total IV")){
            let owner = message.embeds[0].thumbnail.url.replace('https://discordapp.com/assets/', '').replace('.png', '');
            let user = await bots[0].fetchUser(owner);
            let embed = message.embeds[0]
            let pokemonIndex = embed.title.indexOf( ' ', embed.title.indexOf( ' ' ) + 1 );
            let pokemon = embed.title.substring( pokemonIndex + 1 );
            let ivIndex = embed.description.indexOf("Total IV %:** ");
            let iv = embed.description.substring(ivIndex + 14 , embed.description.length -1);
            if(iv.includes(".")){
                if(iv.length == 4){
                    if(iv.indexOf(".") == 1){
                        iv = "0" + iv;
                    } else if(iv.indexOf(".") == 2){
                        iv = iv.concat("0");
                    }
                }
            } else{
                iv = iv.concat(".00");
            }
            let legendary = CMD_PokeCordMessage.isLegendary(pokemon, config)
            try{
                let parsedIV = parseFloat(iv);
                let shinyString = '';
                if(CMD_PokeCordMessage.isShiny(pokemon)){
                    shinyString = shinyString.concat('***');
                    let indexOfSpace = pokemon.indexOf(' ');
                    pokemon = pokemon.substring(indexOfSpace + 1);
                }
            
                if(legendary || shinyString){
                    Logger.log(iv.concat('% ').concat(shinyString).concat(pokemon).concat(shinyString).concat(' ').concat(user.username), colors.fg.Yellow);
                } else if(parsedIV >= 80){
                    Logger.log(iv.concat('% ').concat(pokemon).concat(user.username), colors.fg.Green);
                } else if(parsedIV <= 20){
                    Logger.log(iv.concat('% ').concat(pokemon).concat(user.username), colors.fg.Red);
                } else{
                    Logger.log(iv.concat('% ').concat(pokemon).concat(user.username), colors.fg.White);
                }   
            } catch(exception){
                Logger.log(exception, colors.fg.Red);
                Logger.log("Error parsing IV for:", colors.fg.Red);
                Logger.log(iv + "% " + pokemon, colors.fg.Red);
            }
        }
    }

    static getInfo(bot : Bot, config : IConfig){
        bot.sendMessage(config.channelIDs.spawnChannel, config.pokecordPrefix.concat('info latest'));
    }

    static isLegendary(pokemon : string, config : IConfig) : boolean{
        for(let legendary of config.legendaryList){
            if(pokemon.toLowerCase() == legendary.toLowerCase()){
                return true;
            }
        }
        return false;
    }

    static isShiny(pokemon : string) : boolean{
        let indexOfSpace = pokemon.indexOf(' ');
        if(indexOfSpace == -1) return false;
        let possibleNumber = pokemon.substring(0, indexOfSpace);
        if(isNaN(parseFloat(possibleNumber))){
            return false
        } else{
            return true
        }
    }
}