import React from "react";
import './code.css'
import {Similarity} from "../file/file.utils";

/**
 * @interface CodeProps represents props passed to Code component
 * contents represents the code of the file
 * curSimilarityId is the current similarity the user is looking at
 * similarities is the list of similarities this file contains
 */
interface CodeProps {
    contents: { [key: string]: string},
    curSimilarityId:string,
    similarities: (Similarity)[]
}

/**
 * @class Code
 * This class is responsible for displaying code on Plagiarism page
 * @description It highlights plagiarized code, srolls to it, and keeps track of the current similarity
 * the user is a looking at
 */
class Code extends React.Component<CodeProps>{

    private domRefs: {[key: string]: HTMLElement} = {}
    componentDidMount() {
        let {curSimilarityId} = this.props
        if(curSimilarityId && this.domRefs[curSimilarityId]){
           this.domRefs[curSimilarityId].scrollIntoView({behavior:"smooth"})
        }
    }


    componentDidUpdate(prevProps:CodeProps, prevState:any, snapshot:any) {
        let {curSimilarityId} = this.props

        if(prevProps.curSimilarityId !== curSimilarityId && this.domRefs[curSimilarityId]
            ||
            prevProps.curSimilarityId == curSimilarityId && this.domRefs[curSimilarityId]){
                    this.domRefs[curSimilarityId].scrollIntoView({behavior:"smooth"})


        }


    }



//highlight plagiarized code
    highlight = (index:number) =>{
        let col = ""
       for(let i = 0 ; i < this.props.similarities.length; i++){
           let s = this.props.similarities[i]
          if(s.id === this.props.curSimilarityId && s.startLine <= index && index <= s.endLine){
                col = "red-current";
                break;
            }
            else if(s.startLine <= index && index <= s.endLine) {
                col = "red";
                break;
            }
             else {
                 col= ""
           }
        }
        return col;
    }

    //map ref to similarity id
    setRef = (i:number, elem:any) =>{
        this.props.similarities.forEach(s => {
            if(i === s.startLine) {
              this.domRefs[`${s.id}`] = elem
            }

       })

    }


    render() {

        return <div className="file-container">
            {Object.keys(this.props.contents).map((key, i) => (

                <code key={i} className={this.highlight(i)}
                      ref={elem =>this.setRef(i, elem)}>
                    <span className="index" >{i}</span>
                    {this.props.contents[key]}
                 </code>))
            }
        </div>
    }
}


export default Code;
