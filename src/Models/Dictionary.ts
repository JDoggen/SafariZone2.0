import * as path from 'path';
import * as fs from 'fs';
import { Logger, colors, logLevel } from '../Modules/Logger/Logger';
export class Dictionary{

    private fileExtension : string = "word.csv";
    private alphabet : string[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "V", "W", "X", "Y", "Z"];
    private dictionary : string[]= new Array;

    constructor(){}

    public initialize(){
        Logger.log("Initializing dictionary...", logLevel.Both, colors.fg.Blue);
        for(let element of this.alphabet){
            this.addFile(element);
        }
        Logger.log("Initialized Dictionary succesfully!", logLevel.Both, colors.fg.Blue); 
    }

    private addFile(letter: string){
        let csvPath = path.join('.', 'Dictionary', 'Words', letter.concat(this.fileExtension));
        fs.readFile(csvPath,"utf-8", (err, data) =>{
            for(let word of data.split(' \r\n')){
                this.dictionary.push(word);
            }
        });
    }

    public composeRandomSentence(){
        let wordCount = Math.floor((Math.random() * 10) + 5);
        let punctuationCount = Math.floor((Math.random() * 6 + 1));
        let sentence = this.getRandomWords(wordCount);
        sentence = this.cutOffLastSpace(sentence);
        sentence = this.capitalizeFirstLetter(sentence);
        if(punctuationCount <=4){
            sentence += ".";
        }else if(punctuationCount == 5){
            sentence +="?";
        } else if(punctuationCount == 6){
            sentence += "!";
        }
        return sentence;
    }

    private getRandomWords(wordCount : number) : string{
        let sentence = "";
        for(let i = 0; i < wordCount; i++){
            sentence += this.randomWord();
            sentence += " ";
        }
        return sentence
    }

    private cutOffLastSpace(sentence : string) : string{
        return sentence.slice(0, sentence.length-1);
    }

    private capitalizeFirstLetter(sentence : string) : string{
        return sentence.charAt(0).toUpperCase() + sentence.slice(1);
    }

    private randomWord() : string{
        let word = Math.floor((Math.random() * this.dictionary.length));
        return this.dictionary[word];
    }
}