import * as Discord from "discord.js";

export interface IConfig{
    lastInfoUser : Discord.ClientUser;
    autocatch : boolean,
    spamming : boolean,
    pokecordPrefix : string,
    prefix : string,
    channelIDs : {
        spamChannel : string;
        spawnChannel : string;
        logChannel : string;
        commandsChannel : string;
    };
    pokeCordID : string;
    tokens : string[];
    delays : {
        catchMin : number;
        catchVariable : number;
        infoMin : number;
        infoVariable : number;
        unknownPokemon : number;
        autoList : number;
        tradePollResponse : number;
        tradeSendTradeInvite : number;
        tradeAddPokemon : number;
        tradeConfirm : number;
    },
    timeouts : {
        spam : number; 
        unknownPokemon : number;
    };
    maxAutolistingStages : number;
    undetectableList : string[];
    legendaryList : string[]
}