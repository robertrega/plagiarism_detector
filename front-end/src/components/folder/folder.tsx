import React from "react";
import {FolderItem} from "./folder.utils";
import {FileItem, instanceOfFileItem} from "../file/file.utils";
import Directory from "../directory/directory";

/**
 * @interface FolderProps represents props passed to Folder component
 * name is the name of the folder
 * curSimilarityId is the current similarity the user is looking at
 * children is a directory contained withing the folder, which is a list of files and folders
 */
export interface FolderProps {
    name:string,
    curSimilarityId:string,
    children: React.ReactElement<Directory>
}

/**
 * @interface FolderState represents the state of a Folder
 * folder can either be closed or opened
 */
export interface FolderState {
    isOpen:boolean
}


/**
 * @class Folder
 * Represents a folder in a directory
 * @description responsible for showing and hiding its sub-directories/files
 */
class Folder  extends React.Component<FolderProps,FolderState>{
    state = {
        isOpen: false
    }

    componentDidMount(): void {
        const {children,curSimilarityId} = this.props;
            if(this.shouldOpen(children.props.data, curSimilarityId)){
                this.setState({isOpen: true})
        }
    }

    componentDidUpdate(prevProps:FolderProps, prevState:FolderState, snapshot:any) {
        const {children,curSimilarityId} = this.props;
        if(curSimilarityId !== prevProps.curSimilarityId){
            if(this.shouldOpen(children.props.data, curSimilarityId)){
                this.setState({isOpen: true})
            }
        }
    }

    /**
     * Show or hide folder sub directories
     * @param e
     */
    handleToggle = (e: React.MouseEvent<HTMLSpanElement>) => {
        e.preventDefault();
        this.setState({isOpen: !this.state.isOpen});
    };

    /**
     * Should the folder be opened?
     * Initially only opened if files inside contain current similarity
     * @param children sub-directories of a folder
     * @param curSimilarityId
     */
    shouldOpen = (children:(FileItem|FolderItem)[], curSimilarityId:string):boolean => {
        return children.some(item => {
            if (instanceOfFileItem(item)) {
                return item.similarities.some(s => s.id === curSimilarityId)
            }
            else  {
                return this.shouldOpen(item.children, curSimilarityId)
            }
        });

    }
    render() {
        const { name, children} = this.props;
        const {isOpen} = this.state;

        return (
            <div>
                <span onClick={(e)=>this.handleToggle(e)}>{name}/</span>
                <div className={isOpen ? `d-block pl-2` : `d-none`}
                     key={name}>{children}</div>
            </div>
        );
    }
};


export default Folder;


