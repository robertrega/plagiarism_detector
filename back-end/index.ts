const port = 8080
const express = require('express');
const admZip = require('adm-zip');
const fs = require("fs")
const fsExtra = require('fs-extra')
import {results} from "./src/Main";
import {Request, Response} from 'express';

const cors = require('cors');
const app = express();
const multer = require("multer");

//to get the file property from a request
interface MulterRequest extends Request {
    file: any;
}

var storage =  multer.diskStorage({
        dest: function (req:Request, cb: any) {
            if (req.params.project === 'project1') {
                return cb(null, 'project1')
            } else {
                return  cb(null, 'project2')
            }
        },
    })


//REMOVE ANY TYPE ARGS
app.use(express.json())
app.use(cors());

var upload = multer({ storage }).single('file')

app.post("/upload/:project", upload, function(req: MulterRequest, res: Response, next: any) {
    const {file} = req;


    //empty the directory and upload zip files
    fsExtra.emptyDirSync(`${req.params.project}`);
    var zip2 = new admZip(file.path);
    zip2.extractAllTo(`${__dirname}/${req.params.project}`, true);
    //remove dir generated by mac for zip files
    fs.rmdirSync(`${req.params.project}/__MACOSX`, { recursive: true });


    res.send("success")
});


app.get("/plagiarism", function(req:Request, res:Response, next:any) {
       let result = results()
      res.send(JSON.stringify(result))

})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})