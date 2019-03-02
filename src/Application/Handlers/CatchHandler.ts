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
            this.spamHandler.delaySpamming(this.config.timeouts.unknownPokemon);
            setTimeout(this.catchUnknownPokemon.bind(this), this.config.delays.unknownPokemon, this.config, 0, this.bots);
        } else{
            pokemon = pokemon.replace("<div class='typewriter'>", "").replace("</div>", "");
            let delay = Math.round(Math.random() * (this.config.delays.catchVariable) + this.config.delays.catchMin);
            this.spamHandler.delaySpamming(delay);
            setTimeout(this.sendCatchCommand.bind(this), delay, this.config, this.bots[Math.floor(Math.random() * this.bots.length)], pokemon, 0);  
        }
    }

    private catchUnknownPokemon(config : IConfig, stage : number, bots: Bot[]){
        if((stage < config.undetectableList.length)){
            this.sendCatchCommand(config, bots[Math.floor(Math.random() * this.bots.length)], config.undetectableList[stage]);
            stage++;
            setTimeout(this.catchUnknownPokemon.bind(this), config.delays.unknownPokemon, config, stage, bots);
        }
    }

    private sendCatchCommand(config : IConfig, bot : Bot, pokemon : string){
        bot.sendMessage(config.channelIDs.spawnChannel, config.pokecordPrefix.concat('catch ').concat(pokemon));
    }


}
   