export {colors} from "./colors";


export class Logger{

    static log(message : string, level : logLevel, ...colors : string[]){
        let colorCode = '';
        for(let color of colors){
            colorCode = colorCode.concat(color);
        }
        colorCode.concat('%s\x1b[0m\x1b[40m');
        if(level == logLevel.Both || level == logLevel.Display)
            console.log(colorCode, message);
        if(level == logLevel.Both || level == logLevel.File)
            console.error(message);
    }
}

export enum logLevel{
    Display = 1,
    File = 2,
    Both = 3
}