export interface IConfig{
    pokecordPrefix : string,
    prefix : string,
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
        autoList : number;
    },
    timeouts : {
        spam : number; 
        unknownPokemon : number;
    };
    maxAutolistingStages : number;
    undetectableList : string[];
    legendaryList : string[]
}