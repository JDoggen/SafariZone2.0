export {colors} from "./colors";


export class Logger{

    static log(message : string, ...colors : string[]){
        let colorCode = '';
        for(let color of colors){
            colorCode = colorCode.concat(color);
        }
        colorCode.concat('%s\x1b[0m\x1b[40m');
        console.log(colorCode, message);
    }


}