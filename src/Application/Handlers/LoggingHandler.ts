import { Bot } from "../Bot";
import { IConfig } from "../../Models/IConfig";

export class LoggingHandler{
    constructor(
        private config : IConfig,
        private bots : Bot[],
    ){
    }

    public log(message : string){
        this.bots[0].sendMessage(this.config.channelIDs.logChannel, '`'.concat(message).concat('`'));
    }

}
   