let remote = require("electron").remote;

let cwd = [];

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

module.exports = {
   getDirList: getDirList,
   addFolderToCWD: addFolderToCWD,
   removeFolderFromCWD: removeFolderFromCWD,
   getCWD: getCWD,
   getCWDasArray: getCWDasArray
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
