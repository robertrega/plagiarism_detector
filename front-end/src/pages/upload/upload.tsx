import * as React from "react"
import "./upload.css"
import { History } from 'history';
import FileUpload from "../../components/file-upload/file-upload";
import {sendProject} from '../../services'

/**
 * @interface CodeState represents the state of upload component
 * project1 and project2 fields are for uploading respective projects
 * any field is for dynamic setting of projects only
 *
 */
interface UploadState {
    project1: string| Blob,
    project2: string| Blob,
    [key: string]: any
}

/**
 *@interface UploadProps represents the props passed down to Upload component
 * setUpload will let App component know that projects were uploaded and user can now access
 * Plagiarism Page
 * History props is a prop from react router use for redirection
 */
interface UploadProps {
    setUpload: ()=>void,
    history: History
}


class Upload extends React.Component<UploadProps,UploadState>{
    state={
        project1: "",
        project2: "",
    }


    /**
     * Uploads two files on the server separately
     */
    send = () => {
        if(!this.state.project1 || !this.state.project2){
            alert("Please upload the missing projects!")
        }
        else{
            const data = new FormData();
            const data2 = new FormData();
            data.append("file", this.state.project1);
            data2.append("file", this.state.project2);

            sendProject(data,"1").then(() =>{
                sendProject(data2, "2").then(() => {
                    this.props.setUpload();
                    this.props.history.push('/plagiarism');
                  })
                }
            )

        }
    }

    /**
     * Set file function to be passed to FileUpload component
     * @param fileNum
     * @param file
     */
    setProject = (fileNum:string, file:Blob|string) => {
        let name = "project"+fileNum;

        this.setState({[name]: file})
    }

    render() {
        let canSend = this.state.project2 && this.state.project1

        return ( <div className="container upload-container w-50 ">
                <h3 className="mr-auto ml-auto">Upload two projects/files in
                    <span className="font-weight-bolder"> zip</span> format</h3>
                <form action="#" className="mt-3">
                    <FileUpload setProject={this.setProject} uploaded={this.state.project1 !== ""} projectName="1"/>
                    <FileUpload setProject={this.setProject} uploaded={this.state.project2 !== ""} projectName="2" />
                </form>
                <button className={`btn btn-dark btn-send ${canSend? `` : 'disabled'}`}
                        onClick={()=>{this.send();}}>Compare programs</button>
            </div>
        );
    }
}

export default Upload;
