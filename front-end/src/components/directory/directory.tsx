import React from "react"
import {FolderItem} from '../folder/folder.utils'
import {FileItem, instanceOfFileItem} from "../file/file.utils";
import File from '../file/file'
import Folder from "../folder/folder"


/**
 * @interface DirectoryProps represents the props passed to Directory
 * curSimilarityId is the current similarity the user is looking at
 * data is the list of folders/files
 * setFile function enables setting of the current file for Plagiarism component Code boxes for display
 */
export interface DirectoryProps{
    curSimilarityId:string,
    data:(FolderItem|FileItem)[]
    setFile:  (file:FileItem)=>void,
}


/**
 * @class Directory
 * This class is responsible for all Files/Folders display and logic
 */
class Directory extends React.Component<DirectoryProps>{

    shouldComponentUpdate(nextProps: Readonly<DirectoryProps>,
                          nextState: any, nextContext: any): boolean {

        return nextProps.curSimilarityId !== this.props.curSimilarityId ||
              nextProps.data.length != this.props.data.length}



    render(){
        return this.props.data.map(item => {
            if (instanceOfFileItem(item)) {
                return <File key={item.name} item={item}
                             setFile={this.props.setFile}
                             curSimilarityId={this.props.curSimilarityId}/>
            }
            else {
                return (
                    <Folder name={item.name} key={item.name} curSimilarityId={this.props.curSimilarityId} >
                        <Directory data={item.children}
                                   setFile={this.props.setFile}
                                   curSimilarityId={this.props.curSimilarityId}/>
                    </Folder>
                );
            }
        });}
};

export  default  Directory;



