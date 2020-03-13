let remote = require("electron").remote;

let cwd = [];
let aliasCWD = [];

let getDirList = (path)=>{
   return remote.getGlobal('SFTP').list(path);
};

let addFolderToCWD = (folderName)=>{
   cwd.push(folderName);
};

let removeFolderFromCWD = ()=>{
   cwd.pop();
};

let getCWD = ()=>{
   var path = ".";
   cwd.forEach((dirName) => {
      path = path.concat('/',dirName);
   })
   return path;
};

let getCWDasArray = ()=>{
   return cwd;
};

let changeCWD = (newCWD)=>{
   let newCWDToArray = newCWD.split('/');
   newCWDToArray.splice(0, 1);
   cwd = newCWDToArray;
};

let getIndexOfAliasCWD = ()=>{
   let newAlias = [];
   newAlias = cwd.map((x)=>x);
   return (aliasCWD.push(newAlias)-1);
};

let getAliasCWD = (index)=>{
   var path = ".";
   aliasCWD[index].forEach((dirName) => {
      path = path.concat('/',dirName);
   })
   return path;
};

let addFolderToAliasCWD = (folderName, index)=>{
   aliasCWD[index].push(folderName);
};

let removeFolderFromAliasCWD = (index)=>{
   aliasCWD[index].pop();
};

let emptyAliasCWD = ()=>{
   aliasCWD.splice(0, aliasCWD.length);
};

module.exports = {
   getDirList: getDirList,
   addFolderToCWD: addFolderToCWD,
   removeFolderFromCWD: removeFolderFromCWD,
   getCWD: getCWD,
   getCWDasArray: getCWDasArray,
   changeCWD: changeCWD,
   getIndexOfAliasCWD: getIndexOfAliasCWD,
   getAliasCWD: getAliasCWD,
   addFolderToAliasCWD: addFolderToAliasCWD,
   removeFolderFromAliasCWD: removeFolderFromAliasCWD,
   emptyAliasCWD: emptyAliasCWD
};

/* SFTP File JSON
type: (...)
name: (...)
size: (...)
modifyTime: (...)
accessTime: (...)
rights: (...)
   user: "rwx"
   group: "rx"
   other: "rx"
owner: (...)
group: (...)
get type: () => {…}
set type: (value) => {…}
get name: () => {…}
set name: (value) => {…}
get size: () => {…}
set size: (value) => {…}
get modifyTime: () => {…}
set modifyTime: (value) => {…}
get accessTime: () => {…}
set accessTime: (value) => {…}
get rights: () => {…}
set rights: (value) => {…}
get owner: () => {…}
set owner: (value) => {…}
get group: () => {…}
set group: (value) => {…}
*/
