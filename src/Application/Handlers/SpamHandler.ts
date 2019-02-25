import { Bot } from "../Bot";
import * as Discord from "discord.js";
import { IConfig } from "../../Models/IConfig";
import { CMD_PokeCordMessage } from "../Commands/CMD_PokecordMessage";
import { CMD_Spam } from "../Commands/CMD_Spam";
import { CMD_Autocatch } from "../Commands/CMD_Autocatch";
import { CMD_Autolist } from "../Commands/CMD_Autolist";
import { CMD_Cmd } from "../Commands/CMD_Cmd";
import { Logger, colors } from "../../Modules/Logger/Logger";
import { CMD_Confirm } from "../Commands/CMD_Confirm";
import { setTimeout } from "timers";

export class SpamHandler{
    constructor(
        private config : IConfig
    ){
        console.log("CONFIG IN SPAMHANDLER:");
        console.log(this.config);
        console.log(this.config.autocatch);
        this.pollAutocatch();
    }

    private pollAutocatch(){
        console.log(this.config);
    }
}
   