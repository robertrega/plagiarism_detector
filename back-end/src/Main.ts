import Parser from "./Parser";
import File from './File';
import {IFile} from "./IFile";
const fs = require("fs");

const folder1 = './project1';
const folder2 = './project2';

// the results sent to the front.
export const results =  () => {

    // This is the output files passing to the front
    const files1: { [k: string]: any }[] = [];
    const files2: { [k: string]: any }[] = [];
    
    var idList: string[] = [];
    var totalCodeLine = 0;
    var similarityLine = 0;

    var fileList1: string[] = [];
    var fileList2: string[] = [];

    walkFolder(folder1, files1, fileList1);
    walkFolder(folder2, files2, fileList2);

    // comapre all JS files in project 1 with each file with project 2. Compare each file in every 
    // combination.
    fileList1.forEach((filePath1: string) => {
        fileList2.forEach((filePath2: string) => {
            const filePaths: IFile[] = [];
            filePaths.push(new File(filePath1));
            filePaths.push(new File(filePath2));
            const parse = new Parser(filePaths);
            parse.compareCodes();
            walkFiles(parse.getFiles()[0], files1, folder1);
            walkFiles(parse.getFiles()[1], files2, folder2);
            similarityLine += parse.getTotalSimilarityLines();
            for(var file of parse.getFiles()) {
                idList = idList.concat(file.getSimilarityKeys()); 
            }
        })
    })

    /**
     * Walk through the folder and its subfolder to find all JS files and create a 
     * tree to represent the folder structure.
     * 
     * @param folderPath folder path.
     * @param folder ast folder representation
     * @param fileList a list containing JS file paths.
     */
    function walkFolder(folderPath: string, folder: { [k: string]: any }[], fileList: string[]) {
        fs.readdirSync(folderPath).forEach((childPath: string) => {
            var child: { [k: string]: any } = {};
            var path = folderPath + "/" + childPath;
            if (childPath.indexOf(".") === -1) {
                child["type"] = "folder";
                child["name"] = childPath;
                var childFolder: { [k: string]: any }[] = [];
                child["children"] = childFolder;
                walkFolder(path, childFolder, fileList);
            } else {
                child["type"] = "file";
                child["name"] = childPath;
                var content: { [k: string]: any } = {};
                var similarities: { [k: string]: any }[] = [];
                child["contents"] = content;
                child["similarities"] = similarities;
                if(path.split('.')[path.split('.').length - 1] === 'js') {
                    fileList.push(path);
                }
            }
            folder.push(child);
        });
    }

    /**
     * Walk through the ast folder and populate the codes and similarities of file
     * to the ast folder.
     * 
     * @param file File class
     * @param files ast folder representation
     * @param folderPath folder path
     */
    function walkFiles(file: IFile, files: { [k: string]: any }[], folderPath: string) {
        var relativePath = file.getName().replace(folderPath + "/", "");
        const child = files.filter(child => child["name"] === relativePath.split("/")[0]);
        if (child.length != 0) {
            if (child[0]["type"] === "file") {
                var content: { [k: string]: any } = {};
                
                if(Object.keys(child[0]["contents"]).length === 0) {
                    child[0]["contents"] = file.getContentMap();
                    totalCodeLine += Object.keys(file.getContentMap()).length;
                 
                }
                
                child[0]["similarities"] = child[0]["similarities"].concat(file.getSimilarities());
            } else {
                walkFiles(file, child[0]["children"], folderPath + "/" + child[0]["name"]);
            }
        }
    }

    // the key set of similarities.
    idList = idList.filter( function( item, index, inputArray ) {
        return inputArray.indexOf(item) == index;
    });
    
    // calculate the similarity percentage.
    const similarityScore = (similarityLine / totalCodeLine) * 100;

    return {files1, files2, idList, similarityScore}
}

results();
