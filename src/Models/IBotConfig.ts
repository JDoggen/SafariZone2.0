export interface IBotConfig{
    autolisting : {
        pokemonID : string,
        channelID : string,
        price : number,
        stage : number,
        IV: number,
        pokemon : string,
        TopIVs : number[],
        TopPrices : number[],
        BottomIVs : number[],
        BottomPrices : number[],
    }
}