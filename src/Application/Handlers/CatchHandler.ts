import { Bot } from "../Bot";
import { IConfig } from "../../Models/IConfig";
import { SpamHandler } from "./SpamHandler";
import { LoggingHandler } from "./LoggingHandler";

export class CatchHandler{
    constructor(
        private config : IConfig,
        private bots : Bot[],
        private spamHandler : SpamHandler,
        private loggingHandler : LoggingHandler
    ){
    }
    public catch(pokemon : string){
        if (pokemon.toLowerCase().includes("could not be identified")){ 
            this.spamHandler.delaySpamming(this.config.delays.unknownPokemon);
            setTimeout(this.catchUnknownPokemon, this.config.delays.unknownPokemon, this.config, this.config.undetectableList, this.sendCatchCommand);
        } else{
            pokemon = pokemon.replace("<div class='typewriter'>", "").replace("</div>", "");
            let delay = Math.round(Math.random() * (this.config.delays.catchVariable) + this.config.delays.catchMin);
            this.spamHandler.delaySpamming(delay);
            setTimeout(this.sendCatchCommand, delay, this.config, this.bots[Math.floor(Math.random() * this.bots.length)], pokemon, 0);
            
        }
    }

    private catchUnknownPokemon(config : IConfig, undetectableList : string[], stage : number, bots: Bot[], catchFunction : Function, catchUnkownFunction : Function){
        if(!(stage >= undetectableList.length)){
            catchFunction(config, bots[Math.floor(Math.random() * this.bots.length)], undetectableList[stage]);
            setTimeout(catchUnkownFunction, config.delays.unknownPokemon, config, undetectableList, stage, bots, catchFunction, catchUnkownFunction);
        }
    }

    private sendCatchCommand(config : IConfig, bot : Bot, pokemon : string){
        bot.sendMessage(config.channelIDs.spawnChannel, config.pokecordPrefix.concat('catch ').concat(pokemon));
    }


}
   