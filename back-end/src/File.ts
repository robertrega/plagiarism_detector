import {IFile} from "./IFile";
const fs = require("fs");

// A file class implements IFile interface.
export default class File implements IFile {
    private similarityMap: Map<string, number[]>;
    private contentMap: {[k: string]: string};
    
    // a valid file path is the input to create a File class.
    constructor(private name: string) {
        this.similarityMap = new Map();
        this.contentMap = {};
        let contents = fs.readFileSync(name).toString();
        var i = 1;
        for(var content of contents.split("\n")) {
            this.contentMap[i.toString()] = content;
            i++;
        }
    }

    /**
     * Add a similarity to the similarity map of the file.
     * 
     * @param key unique key to represent the similarity.
     * @param startLine start line of the code for the similarity.
     * @param endLine end line of the code for the similarity.
     */
    public addSimilarity(key: string, startLine: number, endLine: number) {
        this.similarityMap.set(key, [startLine, endLine]);
    }

    /**
     * Get the individual lines of code by line number from the file.
     */
    public getContentMap(): {[k: string]: string} {
        return this.contentMap;
    }

    /**
     * Get the similarity key sets of the file.
     */
    public getSimilarityKeys(): string[] {
        return Array.from(this.similarityMap.keys());
    }

    /**
     * Get the similarity map of the file.
     */
    public getSimilarities() : {[k: string]: any}[] {
        const similarities = [];
    
        for(var info of this.similarityMap) {
            const similarity: {[k: string]: any} = {};
            similarity["id"] = info[0];
            similarity["startLine"] = info[1][0];
            similarity["endLine"] = info[1][1];
            similarities.push(similarity);
            
        }
        return similarities;
    }

    /**
     * Get the file path of the file.
     */
    public getName(): string {
        return this.name;
    }

    /**
     * Get a string to describe the file including file path, and similarity information.
     */
    public toString(): string {
        var str = this.name.concat("\n");
        for(var key of this.similarityMap.keys()) {
            str = str.concat("Key:", key, "\n");
            str = str.concat("Start Line:", this.similarityMap.get(key)[0].toString(), "\n");
            str = str.concat("End Line:", this.similarityMap.get(key)[1].toString(), "\n");
        }
        return str;
    }
}