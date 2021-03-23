
/**
 * Interface for File that representing a file
 */
export interface IFile {

    /**
     * Add a similarity to the similarity map of the file.
     * 
     * @param key unique key to represent the similarity.
     * @param startLine start line of the code for the similarity.
     * @param endLine end line of the code for the similarity.
     */
    addSimilarity(key: string, startLine: number, endLine: number): void;

    /**
     * Get the individual lines of code by line number from the file.
     */
    getContentMap(): {[k: string]: string};

    /**
     * Get the similarity key sets of the file.
     */
    getSimilarityKeys(): string[];

    /**
     * Get the similarity map of the file.
     */
    getSimilarities() : {[k: string]: any}[]

    /**
     * Get the file path of the file.
     */
    getName(): string

    /**
     * Get a string to describe the file including file path, and similarity information.
     */
    toString(): string 
}