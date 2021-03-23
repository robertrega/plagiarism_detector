import {IFile} from "./IFile";
import {IParser} from "./IParser";
const fs = require("fs");
const stable = require('stable');
const crypto = require('crypto');
const babylon = require('babylon');

/**
 * This is a parser class to compare two files in two projects.
 * It populated the similarities to the File class and the total number
 * of how many total lines for similarity.
 */
export default class Parser implements IParser {
  private fileNodes: Map<string, any[]>;
  private threshold: number;
  private nodeTypes: Map<string, any[]>;
  private keyMap: { [k: string]: any[] };
  private totalSimilarityLines: number;

  /**
   * The constructor takes a list of IFile as the input to create a Parser class.
   * @param files two IFile objects in a list.
   */
  constructor(private files: IFile[]) {
    this.fileNodes = new Map();
    this.threshold = 30;
    this.nodeTypes = new Map();
    this.keyMap = {};
    this.totalSimilarityLines = 0;
  }

  /**
   * Get the list of the input IFiles.
   */
  public getFiles(): IFile[] {
    return this.files;
  }

  /**
   * Get the total similarity lines for these two files.
   */
  public getTotalSimilarityLines() : number {
    return this.totalSimilarityLines;
  }

  /**
   * Compare the codes in the two files and get the similarities.
   */
  public compareCodes() {
    const filePaths: string[] = [];
    this.files.forEach(function (path) {filePaths.push(path.getName())});

    //walk through two files, get the ast tree and create key for every 30 nodes for each file.
    for(var filePath of filePaths) {
        const trees: any[] = [];
        const ast = fs.readFileSync(filePath).toString();
        var astRoot;
        try { 
          astRoot = this.parseFile(ast, "script");
        } catch (e) {
          try {
            astRoot = this.parseFile(ast, "module");
          } catch (e) {
            console.log("fail to parse file " + filePath);
            return;
          }
        }
        this.getNodesDFS(astRoot, filePath, false, trees);
        this.walkTree(astRoot, filePath);
        this.fileNodes.set(filePath, trees);
       
    }

    this.analyze();      
  }   

  /**
   * Use babylon library to parse the codes in the file and return the AST tree
   * representing the codes of the file.
   * 
   * @param ast code content in a file to be parsed.
   * @param sourceType a script can either be a script or module.
   */
  private parseFile(ast: string, sourceType: string): any {
    return babylon.parse(ast, {
      allowReturnOutsideFunction: true,
      allowImportExportEverywhere: true,
      sourceType: sourceType,
      plugins: ['jsx', 'flow', 'doExpressions', 'objectRestSpread', 'decorators',
      'classProperties', 'exportExtensions', 'asyncGenerators', 'functionBind',
      'functionSent', 'dynamicImport']
    }).program;
  }

  /**
   * Walk through the ast tree starting from the root using DFS and from every root
   * of subtrees using DFS. If the total nodes of a subtree are larger than 30,
   * we add a common unique key to first 30 nodes in this subtree and add this occurence set
   * to each nodes in this subtree.
   * 
   * @param node The root node of the AST tree.
   * @param filename the filepath of the file for which ast tree represents.
   */
  private walkTree(node: any, filename: string) {
    var visit = (node: any) => {
      var nodes: any[] = [];
      this.getNodesDFS(node, filename, true, nodes);
      if (nodes.length >= this.threshold) {
        this.insertNode(nodes);
      }
      this.getChildren(node).forEach((child: any) => {
        visit(child);
      });
    };
    this.getChildren(node).forEach((child: any) => {
      visit(child);
    });
  }

  /**
   * generate a unique key based on the nodes info, and nodes array as the value.
   * Push the {key: [node,...,node]} to the occurence field.
   * 
   * @param nodes node array where nodes share same root node.
   */
  private insertNode(nodes: any[]) {
    var types = "";
    nodes.forEach(node => {
      types += node.type.toString();
    })
   
    // encrypt the codes
    var key = crypto.createHash('sha1').update(types).digest('base64');

    // push the node in the nodes to the value set
    nodes.forEach(node => {
      if (!node.occurrences.has(key)) node.occurrences.set(key, []);
      node.occurrences.get(key).push(nodes);
    });

    if (!this.keyMap[key]) this.keyMap[key]= [];

    // push this entry set to the overall keyMap.
    this.keyMap[key].push(nodes);
  }

  /**
   * Walk through the ast tree using DFS method and add each node to the nodes parameter.
   * 
   * @param root Root node of AST tree.
   * @param filename filepath.
   * @param hasThreshold if this method is to read all nodes in the tree or only first 30.
   * @param nodes nodes where to push the found node.
   */
  private getNodesDFS(root: any, filename: string, hasThreshold: boolean, nodes: any[]) {

    if(hasThreshold && nodes.length >= this.threshold) return;

    if (!root.filename) root.filename = filename;
    if (!root.occurrences) root.occurrences = new Map();

    nodes.push(root);
    this.getChildren(root).forEach((node: any) => {
      this.getNodesDFS(node, filename, hasThreshold, nodes)});
  }

  /**
   * Get the children node of the root node.
   * @param node root node of the ast tree.
   */
  private getChildren(node: any): any[] {
    var children: any[] = [];

    // get keys whose values have children node that can be expanded.
    if (!this.nodeTypes.has(node.type)) {
        this.nodeTypes.set(node.type, Object.keys(node).filter((key: string) => {
            return key !== 'loc' && typeof node[key] === 'object';
          }))
    }

    this.nodeTypes.get(node.type).forEach((key: string) => {
      var childNode = node[key];

      if (childNode && childNode.type) {
        children.push(childNode);
      } else if (childNode instanceof Array && childNode.length > 0) {
        children = children.concat(childNode.filter(node => {return node && (node.type !== 'JSXText' || node.value.trim())}));
      }
    });

    return children;
  }
  /**
   * Helper function to analyze the codes in two files. if in a key, there are over
   * 2 sets of values and values are not from the same file, it means there are similarities.
   */
  private analyze() {
    var keys: String[] = [];

    // Remove key whose value only one element.
    for (let key of Object.keys(this.keyMap)) {  
      if(this.keyMap[key].length >= 2) keys.push(key);
    } 

    // stable sort the nodes in the node array and keep the parent node
    // in the front of children nodes 
    var sortedKeys = stable(keys, (value1 : string, value2: string) => {
      return this.keyMap[value2].length - this.keyMap[value1].length;
    });

    // go throught each key to find similarities.
    for (let key of sortedKeys) {
      if (this.keyMap[key]) {
        
        // make a copy of the value of key.
        let nodeArrays = this.keyMap[key].slice(0);
        this.removeOverlappingGroup(nodeArrays);
     
        if (nodeArrays.length < 2) continue;
        
        var keyNodes: String[] = [];
        this.expand(nodeArrays);
        
        nodeArrays.forEach(nodes => nodes.forEach((node: any) => keyNodes.push(node.name || node.type)));

        var id = crypto.createHash('sha1').update(keyNodes.join(",")).digest('hex');
        var isSameFile = (nodeArrays: any[]) => {
          return nodeArrays.every(nodes => nodes[0].filename === nodeArrays[0][0].filename)}; 

        if(isSameFile(nodeArrays)) {
          continue;
        } 

        // find the filename, start line, and end line of the nodes in the node arrays
        // and add smilarity infomation to the File as well as calculate the similarity lines.
        for(var nodes of nodeArrays) {
          var filename = nodes[0].filename;
          var start = nodes[0].loc.start.line;
          var end = nodes[0].loc.start.line;
          var endFinal = nodes[0].loc.end.line;
          for(var node of nodes) {
            start = start < node.loc.start.line? start : node.loc.start.line;
            end = end > node.loc.start.line? end : node.loc.start.line;
            endFinal = endFinal > node.loc.end.line? endFinal : node.loc.end.line;
          }
          
          var last = nodes[nodes.length - 1];
          var lastEnd = last.loc.end;
          if (lastEnd.line > end.line && !this.getChildren(last).length) {
            end = lastEnd;
          }
          
          if(endFinal - end <= 2) {
            end = endFinal;
          } 
          
          for(var file of this.files) {
            if(file.getName() === filename) {
              
              if(file.getSimilarityKeys().some(key => key === id)) {
                break;
              }
              file.addSimilarity(id, start, end);
              this.totalSimilarityLines += end - start + 1;
            }
          }
        }
        
        // after getting the similarity, remove the node that counts for the similarity.
        nodeArrays.forEach(nodes => nodes.forEach((node: any) => this.removeNode(node)));
      }
    }
  }

  /**
   * If the same node appears in the different node array, remove the overlapping node.
   * Same means object equal not just value equal.
   * @param nodeArrays node arrays where each node array share the same key.
   */
  private removeOverlappingGroup(nodeArrays: any[]) {
    var set= new Set();

    for (let i = 0; i < nodeArrays.length; i++) {
      var tempSet = new Set();
      set.forEach((node: any) => tempSet.add(node));
      nodeArrays[i].forEach((node: any) => tempSet.add(node));
      
      if(set.size + nodeArrays[i].length === tempSet.size) {
        nodeArrays[i].forEach((node: any) => set.add(node));
      } else {
        nodeArrays.splice(i--, 1);
      }
    }
  }

  /**
   * Since the node arrays reaches the minimun node requirement that counts a similarity,
   * it will go up from the start similar position and go down from the end similar position
   * to see if more nodes are similar to find the largest similarity.
   * @param nodeArrays node arrays where each node array share the same key.
   */
  private expand(nodeArrays: any[]) {
    var allTrees: any[] = [];
    nodeArrays.forEach(nodes => {
        allTrees.push(this.fileNodes.get(nodes[0].filename));
    });
    
    var startIndex: any[] = [];
    nodeArrays.forEach((nodes, i) => {
      startIndex.push(allTrees[i].indexOf(nodes[0]));
    });

    var endIndex: any[] = [];
   nodeArrays.map((nodes, i) => {
      endIndex.push(allTrees[i].indexOf(nodes[nodes.length - 1]));
    });

    var sameType = (nodes: any[]) => {
      return nodes.every(node => node && node.type === nodes[0].type); };

    while (true) {
      startIndex = startIndex.map((n: number) => n - 1);
      var nodes: any[] = [];
      startIndex.forEach((val: number, i: number) => nodes.push(allTrees[i][val]));
      if (!sameType(nodes) || this.exists(nodes, nodeArrays)) {
        break;
      }
      nodeArrays.forEach((group: any, i: number) => group.unshift(nodes[i]));
    }

    while (true) {
      endIndex = endIndex.map((n: number) => n + 1);
      var nodes: any[] = [];
      endIndex.forEach((val: number, i: number) => nodes.push(allTrees[i][val]));
      if (!sameType(nodes) || this.exists(nodes, nodeArrays)) {
        break;
      }
      nodeArrays.forEach((array, i) => array.push(nodes[i]));
    }
  }

  /**
   * If the nodes exists in the nodeArrays.
   * @param nodes nodes
   * @param nodeArrays node arrays containing sets of nodes.
   */
  private exists(nodes: any[], nodeArrays: any[]): boolean {
    nodes.forEach(node => {
      if(nodeArrays.some(array => array.indexOf(node) !== -1)) return false;
    });
    return true;
  }

  /**
   * Remove the occurence field and related key for this node.
   * @param node an ast node to remove
   */
  private removeNode(node: any) {
    if(node.occurrences) {
      for (let key of node.occurrences.keys()) {
        
        for (let i = 0; i < node.occurrences.get(key).length; i++) {
          if (!this.keyMap[key]) break;
          let index = this.keyMap[key].indexOf(node.occurrences.get(key)[i]);
          if (index > -1) {
              this.keyMap[key].splice(index, 1);
          }
          if (!this.keyMap[key].length) {
              delete this.keyMap[key];
          }
        }
        delete node.occurrences[key];
      }
    }
  }
}