import * as q from 'q';
import * as path from 'path';
import { IConfig } from './Models/IConfig';
import * as fs from 'fs';
import {Logger, colors} from './Modules/Logger/Logger';
import {Bot} from './Models/Bot';
//import {red} from 'colors';

export class SafariZone{
    private config ?: IConfig;
    private bots ?: Bot[] = new Array();

    constructor(){
        Logger.log('Starting Safari Zone v2.0', colors.fg.Blue);
        Logger.log("Booting...", colors.fg.Blue);
        this.readConfig()
        .then(config=>{
            this.config = config;
            this.initBots()
            .then(reuslt =>{
                this.checkAccountStatus();
            });
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

    private initBots() : q.Promise<boolean>{
        let defer = q.defer<boolean>();
        Logger.log('Initializing bots...', colors.fg.Blue);
        let count = 0;
        for(let token of this.config.tokens){
            Logger.log('Creating bot for '.concat(token), colors.fg.Blue);
            let bot = new Bot(token);
            bot.init()
            .then(result =>{
                count++;
                if(result){
                    this.bots.push(bot);
                }
                if(count == this.config.tokens.length){
                    defer.resolve(true);
                }
            })
        }
        return defer.promise;
    }

    private checkAccountStatus(){
        if(this.bots.length > 0){
            Logger.log('Found '.concat(this.bots.length.toString()).concat(' bots, proceeding'), colors.fg.Green);
        }
    }
}