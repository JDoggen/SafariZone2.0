import { IConfig } from "../../Models/IConfig";
import { setTimeout } from "timers";
import { Bot } from "../Bot";
import { Dictionary } from "../../Models/Dictionary";
import { Logger, colors } from "../../Modules/Logger/Logger";

export class SpamHandler{
    private timers : any;
    constructor(
        private config : IConfig,
        private bots : Bot[],
        private dictionary : Dictionary
    ){

        this.initializePolls();
    }

    public delaySpamming(delay : number){
        if(this.config.spamming){
            this.config.spamming  = false;
            setTimeout(this.turnSpammingBackOn, delay, this.config);
        }
    }

    private turnSpammingBackOn(config : IConfig){
        config.spamming = true;
    }

    private initializePolls(){
        for(let bot of this.bots){
            let delay = Math.random() * this.config.delays.catchVariable + this.config.delays.catchMin;
            setTimeout(this.poll, delay, this.config, bot, this.dictionary, this.poll);
        }
    }

    private poll(config : IConfig, bot : Bot, dictionary : Dictionary, pollFunction : any){
        if(config.spamming === true){
            let randomMessage = dictionary.composeRandomSentence();
            bot.sendMessage(config.channelIDs.spamChannel, randomMessage);   
        }
        let delay = Math.random() * config.delays.catchVariable + config.delays.catchMin;
        setTimeout(pollFunction , delay, config, bot, dictionary, pollFunction);
    }




}
   