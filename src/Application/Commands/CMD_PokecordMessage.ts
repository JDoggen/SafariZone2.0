import * as Discord from 'discord.js';
import { CatchHandler } from '../Handlers/CatchHandler';
import * as request from 'request';
import { IConfig } from '../../Models/IConfig';
import { Bot } from '../Bot';
import { Logger, colors, logLevel} from '../../Modules/Logger/Logger';
import { LoggingHandler } from '../Handlers/LoggingHandler';

export class CMD_PokeCordMessage{
    static async execute(message: Discord.Message, catchHandler : CatchHandler, config : IConfig, bots : Bot[], loggingHandler: LoggingHandler){
        Logger.log('Executing PokeCordMessage', logLevel.File);

        //Handle pokémon spawn
        if(message.embeds && message.embeds[0] && message.embeds[0].title.includes("A wild pokémon has appeared!")){
            let url = message.embeds[0].image.url;
            Logger.log(`Requesting pokémon identify check for url ${url}`, logLevel.File);
            request.post({
                url:     'https://pokecord.exchange/identify-check',
                form:    { parseurl: url }
              }, (error : any, response : any, body : string) => {
                  Logger.log(`Request returned with error[${error}] response[${response}] body[${body}]`, logLevel.File);
                  if(error){
                      Logger.log('Error in request', logLevel.File);
                      catchHandler.catch('could not be identified');
                  } else{
                    catchHandler.catch(body);
                  }
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
            //If -info shows icon of the user, log this user. Else it is the same as last logged.
            let user : Discord.ClientUser;
            let sameAsLast = false;

            if(message.embeds[0].thumbnail){
                let messagethumbnailWithSize = message.embeds[0].thumbnail.url.trim();
                let messageSizeIndex = messagethumbnailWithSize.indexOf('?size');
                let messageThumbnail = messageSizeIndex == -1 ?  messagethumbnailWithSize : messagethumbnailWithSize.substring(0, messageSizeIndex);

                for(let bot of bots){
                    let botImageURLWithSize = bot.fetchThumbnailURL();
                    let botSizeIndex = botImageURLWithSize.indexOf('?size');
                    let botThumbnail = botSizeIndex == -1 ? botImageURLWithSize : botImageURLWithSize.substring(0, botSizeIndex);

                    if(botThumbnail === messageThumbnail){
                        user = bot.getBotUser();
                        config.lastInfoUser = user;
                    }
                }

            } else{
                user = config.lastInfoUser;
                sameAsLast = true;
            }

            if(user || sameAsLast){
                //If only same as last, we need to log the user as 'undefined'
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
                    let username;
                    
                    if(user){username = user.username}
                    else{ username = 'undefined'; }

                    if(legendary || shinyString){
                        Logger.log(iv.concat('% ').concat(shinyString).concat(pokemon).concat(shinyString).concat(' ').concat(username), logLevel.Both, colors.fg.Yellow);
                    } else if(parsedIV >= 80){
                        Logger.log(iv.concat('% ').concat(pokemon).concat(' ').concat(username), logLevel.Both, colors.fg.Green);
                    } else if(parsedIV <= 20){
                        Logger.log(iv.concat('% ').concat(pokemon).concat(' ').concat(username), logLevel.Both, colors.fg.Red);
                    } else{
                        Logger.log(iv.concat('% ').concat(pokemon).concat(' ').concat(username), logLevel.Both, colors.fg.White);
                    }  
                    loggingHandler.log(iv.concat('% ').concat(shinyString).concat(pokemon).concat(shinyString).concat(' ').concat(username));
 
                } catch(exception){
                    Logger.log(exception, logLevel.Both, colors.fg.Red);
                    Logger.log("Error parsing IV for:", logLevel.Both, colors.fg.Red);
                    Logger.log(iv + "% " + pokemon, logLevel.Both, colors.fg.Red);
                    loggingHandler.log(iv.concat('% ').concat(pokemon).concat(' --Error parsing IV. No shiny check concluded.'));
                }
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