let cwd = [];

let getDirList = (sftp, path)=>{
   return sftp.list(path);
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

let makerDirInCurrentCWD = async (sftp, nameOfDir)=>{
   let folderPath = getCWD() + "/" + nameOfDir;
   await sftp.mkdir(folderPath, true);
   return;
};

module.exports = {
   getDirList: getDirList,
   addFolderToCWD: addFolderToCWD,
   removeFolderFromCWD: removeFolderFromCWD,
   getCWD: getCWD,
   getCWDasArray: getCWDasArray,
   changeCWD: changeCWD,
   makerDirInCurrentCWD: makerDirInCurrentCWD
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
