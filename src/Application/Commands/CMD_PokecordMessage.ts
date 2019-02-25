import * as Discord from 'discord.js';
import { CatchHandler } from '../Handlers/CatchHandler';
import * as request from 'request';
import { IConfig } from '../../Models/IConfig';

export class CMD_PokeCordMessage{
    static execute(message: Discord.Message, catchHandler : CatchHandler, config : IConfig){

        //Handle pokémon spawn
        if(message.embeds && message.embeds[0] && message.embeds[0].title.includes("A wild pokémon has appeared!")){
            let url = message.embeds[0].image.url;
            request.post({
                url:     'https://pokecord.exchange/identify-check',
                form:    { parseurl: url }
              }, (error, response, body : string) => {
                if (body.toLowerCase().includes("could not be identified")){ 
                    //IMPLEMENT
                    CMD_PokeCordMessage.delaySpamming(config.delays.unknownPokemon);
                    catchHandler.catch(body);
                } else{
                    let pokemon = body.replace("<div class='typewriter'>", "").replace("</div>", "");
                    let delay = Math.round(Math.random() * (config.delays.catchVariable) + config.delays.catchMin);
                    CMD_PokeCordMessage.delaySpamming(delay);
                    catchHandler(catchPokemon, delay, pokemon, message);
                }
              });
            catcher.autoCatch(client, message, config);
        }
    }

    static delaySpamming(delay : number){

    }
}