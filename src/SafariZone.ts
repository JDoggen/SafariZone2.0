import * as q from 'q';
import * as path from 'path';
import { IConfig } from './Models/IConfig';
import * as fs from 'fs';
import {Logger, colors} from './Modules/Logger/Logger';
import {Bot} from './Models/Bot';
//import {red} from 'colors';

export class SafariZone{
    private config ?: IConfig;
    private bots ?: Bot[];

    constructor(){
        Logger.log('Starting Safari Zone v2.0', colors.fg.Blue);
        Logger.log("Booting...", colors.fg.Blue);
        this.readConfig()
        .then(config=>{
            this.config = config;
            this.initBots();
        });

    }

    private readConfig() : q.Promise<IConfig>{
        Logger.log("Reading config...", colors.fg.Blue);
        let defer = q.defer<IConfig>()
        let configPath = path.join('.', "config.json");
        fs.readFile(configPath,"utf-8", (err, data) =>{
            if(!err){
                let config = JSON.parse(data) as IConfig;
                Logger.log('Config succesfully read', colors.fg.Green);
                defer.resolve(config);
            } else{
                Logger.log('Error whilest reading config file', colors.fg.Red);
                defer.reject(err);
            }   
        });
        return defer.promise;
    }

    private initBots(){
        Logger.log('Initializing bots...', colors.fg.Blue);
        let count = 0;
        for(let token of this.config.tokens){
            Logger.log('Creating bot for '.concat(token), colors.fg.Blue);
            
        }
    }

}