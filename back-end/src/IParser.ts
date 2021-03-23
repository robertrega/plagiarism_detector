import {IFile} from "./IFile";

// The Parser interface compares files to find similarities.
export interface IParser {
    /**
    * Get the list of the input IFiles.
    */
    getFiles(): IFile[];

    /**
    * Get the total similarity lines for these two files. (used to calculate percentage)
    */
    getTotalSimilarityLines() : number;

    /**
    * Compare the codes in the two files and get the similarities.
    */
    compareCodes(): void;
}