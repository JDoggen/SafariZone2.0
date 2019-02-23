import { Bot } from "./Bot";
import * as Discord from "discord.js";

export class MessageHandler{

    constructor(
        private bots : Bot[]
    ){}

    public handle(message: Discord.Message){
        
    }
}