import React from "react";
import {FileItem} from "./file.utils";
const color = "rgb(235, 233, 233)";


/**
 * @interface FileProps represents props passed down to File component
 * item is a FileItem containing all the info about the file
 * setFile function enables setting of the current file for Plagiarism component Code boxes for display
 * curSimilarityId is the current similarity the user is looking at
 */
export interface FileProps {
    item: FileItem,
    setFile: (file:FileItem)=>void,
    curSimilarityId: string
}

/**
 * @interface FileState represents the state of File component
 * highlight property highlight the file name in directory if the file contains the current similarity
 */
export interface FileState {
    highlight:string

}
/**
 * @class File
 * Represents a file in a directory
 * @description If the file contains the current similarity the user is looking at
 * It will send the contents of this file to Code class through parent(Plagiarism)
 */
class File extends React.Component<FileProps, FileState>{
    constructor(props:FileProps) {
        super(props);
        this.state={
            highlight: "transparent"
        }
    }

    componentDidMount() {
        this.highlightFile()
    }
    componentDidUpdate(prevProps:FileProps, prevState:FileState,snapshot:any) {
        let { curSimilarityId} = this.props
         if(curSimilarityId !== prevProps.curSimilarityId){
             this.highlightFile()
          }
        }

    /**
     * highlight file in dir if it contains the current similarity
     */
       highlightFile(this: File) {
         let {item, setFile, curSimilarityId} = this.props;
        for(let i = 0; i < item.similarities.length; i++){
            let s = item.similarities[i];
            if(s.id === curSimilarityId){
                setFile(item)
                this.setState({highlight:color})
                break;
            }
        }
        if(item.similarities.every(s => s.id !== curSimilarityId)){
            this.setState({highlight:"transparent"})
        }
     }

    render(){
        let {item, setFile} = this.props
        return <span className={`d-block`}
                     style={{backgroundColor: this.state.highlight}}
                     onClick={()=> setFile(item)}>
                        {item.name}</span>
    }
}

export default File;
