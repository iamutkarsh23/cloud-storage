const remote = require("electron").remote;
const fs = require('fs');

let cwd = [];
let aliasCWD = [];

let getActualCWD = (path)=>{
   let pathArray = path.split("/");
   pathArray.splice(0, 1);
   let actualPath = "./Server"
   pathArray.forEach((folderName)=>{
      actualPath = actualPath.concat("/", folderName);
   });
   return actualPath;
};

let getDirList = (path)=>{
   path = getActualCWD(path);
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
   cwd = newCWDToArray.map((x)=>x);
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

let uploadFile = async (localPath, remotePath)=>{
   // let localData = fs.createReadStream(localPath);
   remotePath = getActualCWD(remotePath);
   let response = await remote.getGlobal('SFTP').fastPut(localPath, remotePath,{
      flags: 'w',  // w - write and a - append
      encoding: null, // use null for binary files
      mode: 0o666, // mode to use for created file (rwx)
      autoClose: true // automatically close the write stream when finished
    });
   return response;
}

let uploadFolder = async(localPath, remotePath)=> {
   remotePath = getActualCWD(remotePath);
   let response = await remote.getGlobal('SFTP').uploadDir(localPath, remotePath);
   return response;
}

let makeDirInCurrentCWD = async (nameOfDir)=>{
   let folderPath = getActualCWD(getCWD()) + "/" + nameOfDir;
   let response = await remote.getGlobal('SFTP').mkdir(folderPath, true);
   console.log(getCWD())
   console.log(getActualCWD(getCWD()))
   return response;
};

let removeDir = async(nameOfDir)=>{
   let folderPath = getActualCWD(getCWD()) + "/" + nameOfDir;
   let response = await remote.getGlobal('SFTP').rmdir(folderPath, true);
   return response;
}

let removeFile = async(nameOfFile)=>{
   let filePath = getActualCWD(getCWD()) + "/" + nameOfFile;
   let response = await remote.getGlobal('SFTP').delete(filePath);
   return response;
}

let renameDirOrFile = async(oldName, newName)=> {
   let oldFilePath = getActualCWD(getCWD()) + "/" + oldName;
   let newFilePath = getActualCWD(getCWD()) + "/" + newName;
   let response = await remote.getGlobal('SFTP').rename(oldFilePath, newFilePath);
   return response;
}

let downloadDir = async(remotePath, localPath) => {
   remotePath = getActualCWD(remotePath);
   let response = await remote.getGlobal('SFTP').downloadDir(remotePath, localPath);
   return response;
}

module.exports = {
   getActualCWD: getActualCWD,
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
   emptyAliasCWD: emptyAliasCWD,
   uploadFile: uploadFile,
   uploadFolder: uploadFolder,
   makeDirInCurrentCWD: makeDirInCurrentCWD,
   removeDir: removeDir,
   removeFile: removeFile,
   renameDirOrFile: renameDirOrFile,
   downloadDir: downloadDir,
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
