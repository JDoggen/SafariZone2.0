import * as Discord from 'discord.js';
import * as q from 'q';
import { Logger, colors, logLevel } from '../Modules/Logger/Logger';
import { MessageHandler } from './Handlers/MessageHandler';
import { IBotConfig } from '../Models/IBotConfig';

export class Bot{
    private client : Discord.Client;
    private messageHandler : MessageHandler;
    public botConfig : IBotConfig;

    constructor(
        private token: string
    ){
        this.client = new Discord.Client();
        this.client.on('error', err =>{
            Logger.log(err.message, logLevel.File);
        });
        this.botConfig = {
                autolisting : {
                pokemonID : '',
                channelID : '',
                price : 0,
                stage : 0,
                IV: 0,
                pokemon : '',
                TopIVs : new Array(),
                TopPrices : new Array(),
                BottomIVs : new Array(),
                BottomPrices : new Array()
            } 
        } as IBotConfig;
    }

    public getID() : string{
        return this.client.user.id;
    }

    public init() : q.Promise<boolean>{
        let defer = q.defer<boolean>();
        this.client.login(this.token)
        .then(result=>{
            Logger.log('Succesfully logged in for '.concat(this.token), logLevel.Both, colors.fg.Green);
            defer.resolve(true);
        })
        .catch(err =>{
            Logger.log('Error while logging in for '.concat(this.token).concat('.'), logLevel.Both, colors.fg.Red);
            Logger.log('Token might be invalid, or account might be suspended', logLevel.Both, colors.fg.Red);
            defer.resolve(false);
        });
        return defer.promise;
    }

    public startPolling(messageHandler : MessageHandler) : void{
        this.messageHandler = messageHandler;
        this.client.on('message', message => {this.messageHandler.handle(message)});
        Logger.log('Started polling...', logLevel.Both, colors.fg.Blue);
    }

    public sendMessage(channelID : string, message : string){
        let channel = this.client.channels.get(channelID) as Discord.TextChannel;
        channel.send(message);
    }

    public retrieveMessages(channelID : string, amount : number) : Promise<Discord.Collection<string, Discord.Message>>{
        let channel = this.client.channels.get(channelID) as Discord.TextChannel;
        return channel.fetchMessages({limit : amount});
    }

    public getBotUser() : Discord.ClientUser{
        return this.client.user;
    }

    public fetchUser(user : string) : Promise<Discord.User>{
        return this.client.fetchUser(user);
    }

    public fetchThumbnailURL() : string {
        return this.client.user.displayAvatarURL;
    }

}

