import File from "../src/File";
import {expect} from 'chai';
const fs = require("fs");


// Most of these methods are simple getters and do not lend themselves to extensive testing
// No real edge cases, etc
describe("unit test suite for the File class", () => {
    let myFile = new File("./tests/testFile1.js");

    myFile.addSimilarity("asdf", 7, 10);
    myFile.addSimilarity("qwerty", 11, 12);

    it("test getName", () => {
        expect(myFile.getName()).to.equal("./tests/testFile1.js");
    })

    it("test getContentMap", () => {
        expect(myFile.getContentMap()[1]).to.equal("function fun(sa, sb) {\r");
        expect(myFile.getContentMap()[7]).to.equal("        let num4 = 8;\r");
        expect(myFile.getContentMap()[13]).to.equal("\r");
    })

    it("test getSimilarityKeys", () => {
        expect(myFile.getSimilarityKeys()).to.have.same.members(["asdf", "qwerty"]);
    })

    it("test getSimilarityKeys", () => {
        expect(myFile.getSimilarityKeys()).to.have.same.members(["asdf", "qwerty"]);
    })

    it("test toString", () => {
        expect(myFile.toString()).to.equal("./tests/testFile1.js\n"
        + "Key:asdf\n"
        + "Start Line:7\n"
        + "End Line:10\n" 
        + "Key:qwerty\n"
        + "Start Line:11\n"
        + "End Line:12\n");
    })

    // The object object output by this method is used to shuttle data to the front end. 
    // Tested by manually checking console log
    it("test getSimilarities", () => {
        console.log(myFile.getSimilarities());
    })
    }
)