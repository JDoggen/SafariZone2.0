import * as q from 'q';
import * as path from 'path';
import {IConfig} from '../Models/IConfig';
import * as fs from 'fs';
import {Logger, colors, logLevel} from '../Modules/Logger/Logger';
import {Bot} from './Bot';
import {Dictionary} from '../Models/Dictionary';
import { MessageHandler } from './Handlers/MessageHandler';
import { SpamHandler } from './Handlers/SpamHandler';
import { CatchHandler } from './Handlers/CatchHandler';
import { LoggingHandler } from './Handlers/LoggingHandler';

export class SafariZone{
    private config ?: IConfig;
    private bots ?: Bot[] = new Array();
    private dictionary : Dictionary;
    private spamHandler : SpamHandler;
    private catchHandler : CatchHandler;
    private loggingHandler : LoggingHandler;

    constructor(){
        Logger.log('Starting Safari Zone v2.0', logLevel.Both, colors.fg.Blue);
        Logger.log("Booting...", logLevel.Both, colors.fg.Blue);
        this.readConfig()
        .then(config=>{
            this.config = config;
            this.initBots()
            .then(reuslt =>{
                let activeAccounts = this.checkAccountStatus();
                if(activeAccounts){
                    this.dictionary = new Dictionary();
                    this.dictionary.initialize();
                    this.startPolling();
                }else{
                    this.exitApplication('No logged in account found');
                }
            });
        })

    }

    private readConfig() : q.Promise<IConfig>{
        Logger.log("Reading config...", logLevel.Both, colors.fg.Blue);
        let defer = q.defer<IConfig>()
        let configPath = path.join('.', "config.json");
        fs.readFile(configPath,"utf-8", (err, data) =>{
            if(!err){
                let config = JSON.parse(data) as IConfig;
                Logger.log('Config succesfully read', logLevel.Both, colors.fg.Green);
                defer.resolve(config);
            } else{
                Logger.log('Error whilest reading config file', logLevel.Both, colors.fg.Red);
                defer.reject(err);
            }   
        });
        return defer.promise;
    }

    private initBots() : q.Promise<boolean>{
        let defer = q.defer<boolean>();
        Logger.log('Initializing bots...', logLevel.Both, colors.fg.Blue);
        let count = 0;
        for(let token of this.config.tokens){
            Logger.log('Creating bot for '.concat(token),logLevel.Both,  colors.fg.Blue);
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
            }).catch(err =>{
                Logger.log('Error:', logLevel.Both, colors.fg.Red);
                Logger.log(err, logLevel.Both, colors.fg.Red);
            })
        }
        return defer.promise;
    }

    private checkAccountStatus() : boolean{
        if(this.bots.length > 0){
            Logger.log('Found '.concat(this.bots.length.toString()).concat(' bots, proceeding'), logLevel.Both, colors.fg.Blue);
            return true;
        } else{
            return false;
        }
    }

    private exitApplication(reason ?: string) : void{
        Logger.log('Error during execution of application', logLevel.Both, colors.fg.Red);
        if(reason){
            Logger.log('Reason:', logLevel.Both, colors.fg.Red);
            Logger.log(reason, logLevel.Both, colors.fg.Red);
        }
        Logger.log('Exiting program', logLevel.Both, colors.fg.Red);
    }

    private startPolling() : void{
        this.loggingHandler = new LoggingHandler(this.config, this.bots);
        this.loggingHandler.log('---New instance---');
        this.spamHandler = new SpamHandler(this.config, this.bots, this.dictionary);
        this.catchHandler = new CatchHandler(this.config, this.bots, this.spamHandler, this.loggingHandler);
        let messageHandler = new MessageHandler(this.bots, this.config, this.catchHandler, this.loggingHandler);
        this.bots[0].startPolling(messageHandler);

    }
}