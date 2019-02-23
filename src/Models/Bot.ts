import * as Discord from 'discord.js';
import * as q from 'q';
import { Logger, colors } from '../Modules/Logger/Logger';

export class Bot{
    private client : Discord.Client;


    constructor(
        private token: string
    ){
        
    }

    public init() : q.Promise<boolean>{
        let defer = q.defer<boolean>();
        this.client.login('')
        .then(result=>{
            Logger.log('Succesfully logged in for '.concat(this.token), colors.fg.Green);
            defer.resolve(true);
        })
        .catch(err =>{
            Logger.log('Error while logging in for '.concat(this.token).concat('.'), colors.fg.Red);
            Logger.log('Token might be invalid, or account might be suspended', colors.fg.Red);
            defer.resolve(false);
        });
        Logger.log('returning promise', colors.fg.Magenta);
        return defer.promise;
    }
}

