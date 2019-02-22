import * as q from 'q';
import * as path from 'path';
import { IConfig } from './Models/IConfig';
import * as fs from 'fs';
//import {red} from 'colors';

export class SafariZone{
    private config ?: IConfig;

    constructor(){
        console.log("\x1b[43m\x1b[36m%s\x1b[0m", "Started SafariZone");
        console.log("Booting...");
        this.readConfig()
        .then(config=>{
            this.config = config;
        })
    }

    private readConfig() : q.Promise<IConfig>{
        console.log("Reading config...");
        let defer = q.defer<IConfig>()
        let configPath = path.join('.', "config.json");
        fs.readFile(configPath,"utf-8", (err, data) =>{
            if(!err){
                let config = JSON.parse(data) as IConfig;
                console.log('Config succesfully read');
                defer.resolve(config);
            } else{
                console.log('Error whilest reading config file');
                defer.reject(err);
            }   
        });
        return defer.promise;
    }

}