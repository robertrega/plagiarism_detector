import File from "../src/File";
import Parser from "../src/Parser";
import {expect} from 'chai';


// a Test suite for the Parser class
// Since the Parser does a lot of the code comparison, a lot of the testing was done manually 
// with the front-end.
describe("unit test suite for the Parser class", () => {
    let myFile1 = new File("./tests/testFile1.js");
    let myFile2 = new File("./tests/testFile2.js");

    let myParse = new Parser([myFile1, myFile2]);
    myParse.compareCodes();

    it("test getFiles", () => {
        expect(myParse.getFiles()).to.have.same.members([myFile1, myFile2]);
    })

    // Test total lines in both files that are similar.
    it("test getTotalSimilarityLines", () => {
        expect(myParse.getTotalSimilarityLines()).to.equal(20);
    })
    
    it("test similarity was added correctly to both files", () => {
        expect(myFile1.toString()).to.equal("./tests/testFile1.js\n"
        + "Key:4f57b8cdee8f8f21bb89036350fa9050667d935"
        + "f\nStart Line:1\nEnd Line:10\n");

        expect(myFile2.toString()).to.equal("./tests/testFile2.js\n"
        + "Key:4f57b8cdee8f8f21bb89036350fa9050667d935"
        + "f\nStart Line:6\nEnd Line:15\n");
    })
    }
)