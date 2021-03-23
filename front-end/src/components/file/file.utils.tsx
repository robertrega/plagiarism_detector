/**
 * @interface FileItem represents an object containing:
 * contents of the file(index -> line of code)
 * it's name and type and list of similarities in this file
 */
export interface FileItem  {
    type: string,
    name: string,
    contents: Object,
    similarities: Array<Similarity>
};


/**
 * @interface Similarity represents a similarity between two projects in a file
 */
export interface Similarity {
    id: string,
    startLine: number,
    endLine: number
}

/**
 * @description determines if an object is an instance of a FileItem
 * @param object: any object
 */
export function instanceOfFileItem(object: any): object is FileItem {
    return  object.hasOwnProperty("type") && object.type=="file"
}



