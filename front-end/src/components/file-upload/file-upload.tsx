import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";


/**
 * @interface FileUploadProps represents props passed to FileUpload component
 * setProject function will set the uploaded project in the Upload parent
 * project name is either "1" or "2"
 * uploaded boolean signifies whether something was already uploaded or not
 */
interface FileUploadProps {
    setProject: (name: string, file: Blob|string)=>void,
    projectName:string,
    uploaded: boolean

}

/**
 * @function FileUpload
 * @description Responsible for a single file upload
 * @param props
 */
const FileUpload = (props:FileUploadProps)=> {

   const { setProject, projectName, uploaded} = props

    return  !uploaded ? <div className="d-flex mb-3 upload-item">
            <div className="input-group">
                <div className="custom-file">
        <input className="custom-file-input"
           type="file"
           id="file"
           accept=".zip"
           onChange={event => setProject(projectName,event.target.files![0])}/>
          <label className="custom-file-label" >Choose project {projectName}</label>
           </div>
        </div>
      </div> :
    <div className="d-flex">
    <p className="upload-success-txt mr-auto"> Project {projectName} is uploaded </p>
    <FontAwesomeIcon className="remove-file-icon" icon={faTimes}
      onClick={()=> setProject(projectName, "")}/>
    </div>


}

export default FileUpload;
