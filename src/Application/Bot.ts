import * as Discord from 'discord.js';
import * as q from 'q';
import { Logger, colors } from '../Modules/Logger/Logger';
import { MessageHandler } from './MessageHandler';

export class Bot{
    private client : Discord.Client;
    private messageHandler : MessageHandler;

    constructor(
        private token: string
    ){
        this.client = new Discord.Client();
    }

    public getID() : string{
        return this.client.user.id;
    }

    public init() : q.Promise<boolean>{
        let defer = q.defer<boolean>();
        this.client.login(this.token)
        .then(result=>{
            Logger.log('Succesfully logged in for '.concat(this.token), colors.fg.Green);
            defer.resolve(true);
        })
        .catch(err =>{
            Logger.log('Error while logging in for '.concat(this.token).concat('.'), colors.fg.Red);
            Logger.log('Token might be invalid, or account might be suspended', colors.fg.Red);
            defer.resolve(false);
        });
        return defer.promise;
    }

    public startPolling(messageHandler : MessageHandler) : void{
        this.messageHandler = messageHandler;
        this.client.on('message', message => {this.messageHandler.handle(message)});
        Logger.log('Started polling...', colors.fg.Blue);
    }

    public sendMessage(channelID : string, message : string){
        let channel = this.client.channels.get(channelID) as Discord.TextChannel;
        channel.send(message);
    }

}

