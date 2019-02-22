export interface IConfig{
    channelIDs : {
        spamChannel : string;
        spawnChannel : string;
    };
    pokeCordID : string;
    tokens : string[];
    delays : {
        catchMin : number;
        catchVariable : number;
        infoMin : number;
        infoVariable : number;
        unknownPokemon : number;
    },
    timeouts : {
        spam : number; 
        unknownPokemon : number;
    };
    undetectableList : string[];
    legendaryList : string[]
}